'use client'
import Link from 'next/link'

function AdminPage() {

  return (
    <div className='flex justify-center mt-10'>
      <div className='p-4 w-full max-w-lg bg-white rounded-md text-center'>
        <div className='text-black text-4xl py-2 mb-4 border-b-2'>Admin Dashboard</div>
        <div className='flex flex-col justify-center mt-4'>
          <Link href="/addproduct" className='text-2xl text-purple-700 hover:text-lime-500 mx-2'>Add item</Link>
          <Link href="/formsubmissions" className='text-2xl text-purple-700 hover:text-lime-500 mx-2'>Form Submissions</Link>
          <Link href="/orders" className='text-2xl text-purple-700 hover:text-lime-500 mx-2'>Orders</Link>
          <Link href="/completedorders" className='text-2xl text-purple-700 hover:text-lime-500 mx-2'>Completed Orders</Link>
          <Link href="/emailportal" className='text-2xl text-purple-700 hover:text-lime-500 mx-2'>Email Portal</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
