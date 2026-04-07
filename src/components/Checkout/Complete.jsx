'use client'
import { useContext, useEffect, useRef } from 'react'
import { UserContext } from '../../context/UserContextProvider'
import { db } from '../../config/Config';
import Link from 'next/link'
import { Button } from '@material-tailwind/react';

export default function Complete() {
  const { user } = useContext(UserContext);
  const hasSaved = useRef(false);

  useEffect(() => {
    if (hasSaved.current || !user?.id || !user?.cart?.length) return;
    hasSaved.current = true;

    const total = Number(user.cart.reduce((sum, item) => sum + item.price, 0).toFixed(2));
    const order = {
      timestamp: new Date().toLocaleDateString(),
      items: user.cart,
      total,
      completed: false
    };

    const updatedHistory = Array.isArray(user.history)
      ? [...user.history, order]
      : [order];

    db.collection('users').doc(user.id)
      .update({ history: updatedHistory, cart: [] })
      .catch(error => console.error('Error saving order:', error));
  }, [user?.id, user?.cart, user?.history]);

  return (
    <div className='flex justify-center'>
      <div className='max-w-sm rounded overflow-hidden shadow-lg w-full bg-slate-50 mx-3 my-3 p-5'>
        <div className='text-3xl my-2'>Thanks for your order!</div>
        <div>Please allow 2-4 days for processing. You will be emailed tracking when your order has been shipped</div>
        <Button variant="gradient" className='mt-5' color="blue" fullWidth>
          <Link href='/'>Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}
