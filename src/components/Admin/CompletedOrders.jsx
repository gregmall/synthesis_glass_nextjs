'use client'
import React, { useState, useEffect } from 'react'
import { db } from '../../config/Config';

export default function CompletedOrders() {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const snapshot = await db.collection('completedOrders').get();
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        orders.sort((a, b) => new Date(b.dateCompleted) - new Date(a.dateCompleted));
        setCompletedOrders(orders);
      } catch (err) {
        console.error('Error fetching completed orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedOrders();
  }, []);

  return (
    <div className='flex justify-center mt-10'>
      <div className='p-4 w-full max-w-lg bg-white rounded-md'>
        <h1 className='border-b-8'>Completed Orders</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {completedOrders.map(order => (
              <li key={order.id}>
                <h2>{order.name}</h2>
                <p>Date: {order.date}</p>
                {order.items?.map((item, idx) => (
                  <div key={idx} className='flex flex-col'>
                    <div className='w-1/2'>{item.name}</div>
                    <div className='w-1/4'><img src={item.image[0]} alt={item.name} className='w-16 h-16 object-cover' /></div>
                    <div className='w-1/4'>Price: ${item.price.toFixed(2)}</div>
                    <div className='w-full'>Message: {order.message}</div>
                  </div>
                ))}
                <p>Total: ${order.total}</p>
                <p className='border-b-4'>Date Completed: {order.dateCompleted}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
