import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import Analytics from './pages/Analytics'
import WhatsAppBot from './pages/WhatsAppBot'
import Login from './pages/Login'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"  element={<Dashboard />} />
        <Route path="patients"   element={<Patients />} />
        <Route path="analytics"  element={<Analytics />} />
        <Route path="whatsapp"   element={<WhatsAppBot />} />
      </Route>
    </Routes>
  )
}