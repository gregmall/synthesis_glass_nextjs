'use client'
import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../context/UserContextProvider';
import { db, auth } from '../config/Config';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';

const Account = () => {

    const { user } = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userFromStorage = JSON.parse(localStorage.getItem('user'))
            if (userFromStorage === null) {
                router.push('/signin')
            }
        }
    }, [router])

    const deleteAccount = () => {
        Confirm.show(
            'Delete account',
            `${user.name}?`,
            'Yes',
            'No',
            async () => {
                await db.collection('users').doc(auth.currentUser.uid).delete()
                    .then(() => {
                        return true;
                    }).catch(error => { console.log('deleteAccount', error); return false; });

                const currentUser = auth.currentUser;
                await currentUser.delete();
                window.localStorage.clear()
                router.push('/signin')
            }
        )
    }

    return (
        <div className='flex justify-center'>
            <div className='max-w-sm rounded overflow-hidden shadow-lg w-full bg-slate-50 mx-3 my-3 p-5'>
                <div className='text-black'>Name: {user?.name}</div>
                <div className='text-black'>Email: {user?.email}</div>
                <div className='text-black border-b-2'>Purchase History:</div>
                {user?.history?.map((item, index) => {
                    return (
                        <div key={index}>
                            <div>{new Date(item?.timestamp).toLocaleDateString()}</div>
                            {item.items.map((i, idx) => (
                                <div key={idx} className='flex flex-row my-3'>
                                    <div><img src={i.image} alt={i.name} className='w-16 h-16 object-cover' /></div>
                                    <div className='flex flex-col mx-1'></div>
                                    <div>{i.name}</div>
                                    <div>${i.price}</div>
                                </div>
                            ))}
                            <div className='border-b-2'>Total: ${item.total}</div>
                        </div>
                    )
                })}
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-6" onClick={deleteAccount}>Delete account</button>
            </div>
        </div>
    )
}

export default Account
