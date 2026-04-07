import ProtectedRoute from '../../components/ProtectedRoute'
import AdminPage from '../../components/Admin/AdminPage'

export default function AdminPageRoute() {
  return (
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  )
}
