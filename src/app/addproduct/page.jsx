import ProtectedRoute from '../../components/ProtectedRoute'
import AddProduct from '../../components/Admin/AddProduct'

export default function AddProductPage() {
  return (
    <ProtectedRoute>
      <AddProduct />
    </ProtectedRoute>
  )
}
