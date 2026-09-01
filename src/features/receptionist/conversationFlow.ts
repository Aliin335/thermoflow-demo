import type { IssueType, ReceptionistCollectedInfo, ReceptionistState, ReceptionistStep } from '../../types'
import { appendDescriptionFragment } from './description'
import { extractInformation } from './informationExtraction'
import { detectIntent, hasChangeOfMindCue } from './intentDetection'
import { createMessage } from './message'
import { detectEmergencyCategory, detectPriority, mergePriority, type EmergencyCategory } from './urgencyDetection'
import {
  isValidEmail,
  isValidName,
  isValidPhone,
  isValidPostcode,
  looksLikeQuestion,
  looksLikeUnsureResponse,
} from './validation'

type StrictStep = 'postcode' | 'name' | 'phone' | 'email'
type FallbackOutcome = 'not-applicable' | 'already-filled' | 'filled' | 'unsure' | 'question' | 'invalid'

const STRICT_STEPS = new Set<ReceptionistStep>(['postcode', 'name', 'phone', 'email'])

function isStrictStep(step: ReceptionistStep): step is StrictStep {
  return STRICT_STEPS.has(step)
}

// Steps during which the customer is still describing their issue (as
// opposed to answering a specific contact-detail question) — replies here
// get folded into the running description.
const ISSUE_PHASE_STEPS = new Set<ReceptionistStep>(['greeting', 'description', 'equipment-type'])

function isIssuePhaseStep(step: ReceptionistStep): boolean {
  return ISSUE_PHASE_STEPS.has(step)
}

/**
 * If the previous assistant turn asked for postcode/name/phone/email and
 * opportunistic extraction didn't already fill it, treat the whole reply as
 * the answer to that pending field (with validation) rather than asking the
 * customer to repeat themselves in a more structured way.
 */
function applyStepFallback(
  previousStep: ReceptionistStep,
  text: string,
  collected: ReceptionistCollectedInfo,
): FallbackOutcome {
  if (previousStep !== 'postcode' && previousStep !== 'name' && previousStep !== 'phone' && previousStep !== 'email') {
    return 'not-applicable'
  }

  const alreadyFilled = Boolean(
    (previousStep === 'postcode' && collected.postcode) ||
      (previousStep === 'name' && collected.customerName) ||
      (previousStep === 'phone' && collected.phone) ||
      (previousStep === 'email' && collected.email),
  )
  if (alreadyFilled) return 'already-filled'

  if (looksLikeUnsureResponse(text)) return 'unsure'
  if (looksLikeQuestion(text)) return 'question'

  const trimmed = text.trim()
  if (previousStep === 'postcode' && isValidPostcode(trimmed)) {
    collected.postcode = trimmed.toUpperCase()
    return 'filled'
  }
  if (previousStep === 'name' && isValidName(trimmed)) {
    collected.customerName = trimmed
    return 'filled'
  }
  if (previousStep === 'phone' && isValidPhone(trimmed)) {
    collected.phone = trimmed
    return 'filled'
  }
  if (previousStep === 'email' && isValidEmail(trimmed)) {
    collected.email = trimmed
    return 'filled'
  }
  return 'invalid'
}

/** Decides which field to ask about next, skipping anything already known. */
function determineNextStep(
  collected: ReceptionistCollectedInfo,
  previousStep: ReceptionistStep,
  emergencyHit: boolean,
): ReceptionistStep {
  if (previousStep === 'greeting' && !emergencyHit) {
    if (collected.issueType === 'boiler') return 'description'
    if (collected.issueType === 'other') return 'description'
    if (
      (collected.issueType === 'service' ||
        collected.issueType === 'quote' ||
        collected.issueType === 'booking') &&
      !collected.equipmentType
    ) {
      return 'equipment-type'
    }
  }
  if (!collected.customerName) return 'name'
  if (!collected.postcode) return 'postcode'
  if (!collected.phone) return 'phone'
  if (!collected.email) return 'email'
  return 'complete'
}

function lowerFirst(text: string): string {
  return text.length ? text[0].toLowerCase() + text.slice(1) : text
}

function acknowledgeIssue(issueType: IssueType | undefined): string {
  switch (issueType) {
    case 'boiler':
      return 'Sorry to hear that.'
    case 'heating':
      return 'Sorry to hear that — no heating is no fun, especially in cold weather.'
    case 'hot-water':
      return "Sorry to hear that — I'll get this sorted for you."
    case 'air-conditioning':
      return "Got it — let's get your air conditioning sorted."
    case 'service':
      return 'Happy to help get that booked in.'
    case 'quote':
      return 'Happy to help put a quote together.'
    case 'booking':
      return "Sure, let's get an appointment set up."
    default:
      return "Thanks for reaching out — I'll get this sorted for you."
  }
}

function freshPrompt(field: ReceptionistStep, collected: ReceptionistCollectedInfo): string {
  switch (field) {
    case 'description':
      return collected.issueType === 'boiler'
        ? 'Are you currently without heating, hot water, or both?'
        : "Could you tell me a little more about what's happening?"
    case 'equipment-type':
      return collected.issueType === 'quote'
        ? 'What would this be for — a new boiler, heating system, or air conditioning?'
        : 'What needs servicing — your boiler, heating system, or air conditioning?'
    case 'postcode':
      return "What's the postcode for the property?"
    case 'name':
      return 'Can I take your name?'
    case 'phone':
      return "What's the best phone number to reach you on?"
    case 'email':
      return 'And an email address for confirmation?'
    default:
      return ''
  }
}

const UNSURE_TEXT: Record<StrictStep, string> = {
  postcode: 'No problem — whenever you have it, the postcode helps us send the right engineer.',
  name: 'No worries — a first name is fine, just so the team knows who they’re speaking with.',
  phone: "That's alright — a mobile or landline both work, whenever you're ready.",
  email: 'That’s fine — even a rough email address will do so we can send confirmation.',
}

const INVALID_TEXT: Record<StrictStep, string> = {
  postcode: "I didn't quite catch a postcode there — could you send it over again?",
  name: "Sorry, I didn't quite get your name — could you type it again?",
  phone: "That doesn't look like a complete phone number — could you double-check it?",
  email: "That email doesn't look quite right — mind double-checking it?",
}

function reAskPrompt(field: StrictStep, outcome: FallbackOutcome, collected: ReceptionistCollectedInfo): string {
  if (outcome === 'question') {
    return `Good question — our team can cover that when they follow up. ${freshPrompt(field, collected)}`
  }
  if (outcome === 'unsure') return UNSURE_TEXT[field]
  return INVALID_TEXT[field]
}

function completionMessage(name: string | undefined, alreadyComplete: boolean): string {
  if (alreadyComplete) return "Got it — I've added that to your request."
  const greetingName = name ? `, ${name}` : ''
  return `Thanks${greetingName}. I have the details I need — I'll prepare your request for the service team.`
}

function emergencySafetyMessage(category: EmergencyCategory): string {
  switch (category) {
    case 'gas':
      return "If you can smell gas or think there may be a gas leak, please stop using gas appliances if it's safe to do so, leave the area, and contact your emergency gas service or emergency services immediately — this isn't something we can help with over chat."
    case 'fire':
      return "If there's any smoke, sparking, or fire risk, please switch off the power at the mains if it's safe to do so, leave the area, and contact the emergency services immediately — this isn't something we can help with over chat."
    case 'flooding':
      return "If there's significant flooding, please turn off your water supply at the mains if it's safe to do so and contact an emergency plumber or your local emergency services — this isn't something we can help with over chat."
    default:
      return "This sounds like it could be dangerous — please contact the emergency services or an emergency engineer right away. This isn't something we can help with over chat."
  }
}

interface ReplyContext {
  collected: ReceptionistCollectedInfo
  previousStep: ReceptionistStep
  nextField: ReceptionistStep
  emergencyHit: boolean
  emergencyCategory: EmergencyCategory | null
  fallbackOutcome: FallbackOutcome
}

function buildReply(ctx: ReplyContext): string {
  const segments: string[] = []

  if (ctx.emergencyHit && ctx.emergencyCategory) {
    segments.push(emergencySafetyMessage(ctx.emergencyCategory))
  }

  if (ctx.previousStep === 'greeting' && !ctx.emergencyHit) {
    segments.push(acknowledgeIssue(ctx.collected.issueType))
  }

  if (ctx.nextField === ctx.previousStep && isStrictStep(ctx.nextField)) {
    segments.push(reAskPrompt(ctx.nextField, ctx.fallbackOutcome, ctx.collected))
  } else if (ctx.nextField === 'complete') {
    segments.push(completionMessage(ctx.collected.customerName, ctx.previousStep === 'complete'))
  } else if (ctx.nextField !== ctx.previousStep) {
    const prompt = freshPrompt(ctx.nextField, ctx.collected)
    segments.push(ctx.emergencyHit ? `Once you're safe, ${lowerFirst(prompt)}` : prompt)
  }

  return segments.join(' ')
}

/**
 * Pure conversation step: given the current state and a new customer
 * message, returns the full next state (customer message + assistant
 * reply appended). This is the engine's entire "brain" — the UI only
 * ever renders what this function decides.
 */
export function processMessage(state: ReceptionistState, rawText: string): ReceptionistState {
  const text = rawText.trim()
  const previousStep = state.step
  const collected: ReceptionistCollectedInfo = { ...state.collected }

  const emergencyCategory = detectEmergencyCategory(text)
  const emergencyHit = emergencyCategory !== null

  if (!collected.issueType || hasChangeOfMindCue(text)) {
    const detected = detectIntent(text)
    if (detected !== 'other' || !collected.issueType) {
      collected.issueType = detected
    }
  }

  if (isIssuePhaseStep(previousStep)) {
    collected.description = appendDescriptionFragment(collected.description, text)
  }

  const extracted = extractInformation(text)
  if (!collected.postcode && extracted.postcode) collected.postcode = extracted.postcode
  if (!collected.phone && extracted.phone) collected.phone = extracted.phone
  if (!collected.email && extracted.email) collected.email = extracted.email
  if (!collected.equipmentType && extracted.equipmentType) collected.equipmentType = extracted.equipmentType
  if (!collected.customerName && extracted.customerName) collected.customerName = extracted.customerName

  const fallbackOutcome = applyStepFallback(previousStep, text, collected)

  const detectedPriority = detectPriority(text)
  collected.priority = mergePriority(collected.priority, detectedPriority)

  const nextField = determineNextStep(collected, previousStep, emergencyHit)

  const replyText = buildReply({
    collected,
    previousStep,
    nextField,
    emergencyHit,
    emergencyCategory,
    fallbackOutcome,
  })

  const userMessage = createMessage('user', rawText)
  const assistantMessage = createMessage('assistant', replyText)

  return {
    step: nextField,
    messages: [...state.messages, userMessage, assistantMessage],
    collected,
    isComplete: nextField === 'complete',
    leadId: state.leadId,
  }
}
