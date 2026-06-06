import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import VehicleRecords from './pages/VehicleRecords'
import RectificationTasks from './pages/RectificationTasks'
import ReviewEvidences from './pages/ReviewEvidences'
import Penalties from './pages/Penalties'
import Complaints from './pages/Complaints'
import ConstructionSites from './pages/ConstructionSites'
import Vehicles from './pages/Vehicles'
import EarthworkPlans from './pages/EarthworkPlans'
import WashRecords from './pages/WashRecords'
import NightExcavationApprovals from './pages/NightExcavationApprovals'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dust-monitoring" element={<Dashboard />} />
        <Route path="vehicle-records" element={<VehicleRecords />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="wash-records" element={<WashRecords />} />
        <Route path="night-excavation-approvals" element={<NightExcavationApprovals />} />
        <Route path="rectification-tasks" element={<RectificationTasks />} />
        <Route path="review-evidences" element={<ReviewEvidences />} />
        <Route path="penalties" element={<Penalties />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="construction-sites" element={<ConstructionSites />} />
        <Route path="earthwork-plans" element={<EarthworkPlans />} />
      </Route>
    </Routes>
  )
}

export default App
