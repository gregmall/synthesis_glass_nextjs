import ProtectedRoute from '../../components/ProtectedRoute'
import CompletedOrders from '../../components/Admin/CompletedOrders'

export default function CompletedOrdersPage() {
  return (
    <ProtectedRoute>
      <CompletedOrders />
    </ProtectedRoute>
  )
}
