import { Suspense } from 'react'
import ProtectedRoute from '../../components/ProtectedRoute'
import Orders from '../../components/Admin/Orders'

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div />}>
        <Orders />
      </Suspense>
    </ProtectedRoute>
  )
}
