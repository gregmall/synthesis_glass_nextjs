import ProtectedRoute from '../../components/ProtectedRoute'
import FormSubmissions from '../../components/Admin/FormSubmissions'

export default function FormSubmissionsPage() {
  return (
    <ProtectedRoute>
      <FormSubmissions />
    </ProtectedRoute>
  )
}
