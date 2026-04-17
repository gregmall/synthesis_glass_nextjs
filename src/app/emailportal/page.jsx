import ProtectedRoute from "../../components/ProtectedRoute"
import EmailPortal from "../../components/Admin/EmailPortal"

export default function EmailPortalPage() {
  return (
    <ProtectedRoute>
      <EmailPortal />
    </ProtectedRoute>
  )
}