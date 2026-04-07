import { Suspense } from 'react'
import Glass from '../../components/Products/Glass'

export default function GlassPage() {
  return (
    <Suspense fallback={<div />}>
      <Glass />
    </Suspense>
  )
}
