import { NavLink, Outlet } from 'react-router-dom'

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/40 focus-visible:ring-offset-2'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-sm border-b-2 py-1 text-sm font-medium transition-colors duration-150 ${FOCUS_RING} ${
    isActive
      ? 'border-neutral-900 text-neutral-900'
      : 'border-transparent text-neutral-500 hover:border-neutral-200 hover:text-neutral-900'
  }`

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <NavLink to="/" className={`flex items-center gap-2 rounded-sm ${FOCUS_RING}`}>
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-900 text-sm font-semibold text-white">
              T
            </span>
            <span className="text-sm font-semibold tracking-tight text-neutral-900">
              THERMOFLOW
            </span>
          </NavLink>
          <nav className="flex items-center gap-6">
            <NavLink to="/receptionist" className={navLinkClass}>
              AI Receptionist
            </NavLink>
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}
