import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/shared/AppShell'
import { DashboardLeadPage } from './routes/DashboardLeadPage'
import { DashboardPage } from './routes/DashboardPage'
import { LandingPage } from './routes/LandingPage'
import { ReceptionistPage } from './routes/ReceptionistPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<LandingPage />} />
          <Route path="receptionist" element={<ReceptionistPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="dashboard/leads/:leadId" element={<DashboardLeadPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
