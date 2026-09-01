import type { Lead } from '../../types'
import { Card } from '../shared/Card'

interface CustomerInfoCardProps {
  lead: Lead
}

export function CustomerInfoCard({ lead }: CustomerInfoCardProps) {
  const rows = [
    { label: 'Name', value: lead.customerName },
    {
      label: 'Phone',
      value: (
        <a href={`tel:${lead.phone}`} className="hover:text-neutral-900 hover:underline">
          {lead.phone}
        </a>
      ),
    },
    {
      label: 'Email',
      value: (
        <a href={`mailto:${lead.email}`} className="hover:text-neutral-900 hover:underline">
          {lead.email}
        </a>
      ),
    },
    { label: 'Postcode', value: lead.postcode },
  ]

  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold text-neutral-900">Customer information</h2>
      <dl className="mt-3 divide-y divide-neutral-100">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 py-2 text-sm">
            <dt className="shrink-0 text-neutral-500">{row.label}</dt>
            <dd className="truncate font-medium text-neutral-700">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
