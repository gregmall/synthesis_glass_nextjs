'use client'
import { useState, useEffect } from 'react'
import { db, auth } from '../../config/Config';
import {
    Card,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import { BsTrash3 } from "react-icons/bs"
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Notiflix from 'notiflix';

const ShoppingCart = () => {

    const [user, setUser] = useState(null);
    const router = useRouter();
    const [total, setTotal] = useState(0);
    const [cartItems, setCartItems] = useState(user?.cart || []);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState();
    const [street, setStreet] = useState();
    const [city, setCity] = useState();
    const [state, setState] = useState();
    const [zip, setZip] = useState();
    const [apartment, setApartment] = useState();
    const [showCheckout, setShowCheckout] = useState(false);
    const [cartMessage, setCartMessage] = useState('');

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => sum + (item.price), 0);
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                try {
                    const userCredential = await auth.signInAnonymously();
                    setUser(userCredential.user);
                } catch (error) {
                    console.error('Authentication error:', error);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userFromStorage = JSON.parse(localStorage.getItem('user'))
            if (userFromStorage === null) {
                router.push('/signin')
            }
        }
    }, [router]);

    useEffect(() => {
        const fetchCartItems = async () => {
            if (user?.uid) {
                const person = await db.collection('users').doc(user.uid).get();
                const array = person.data();
                const cart = array?.cart;
                setName(array?.name || '');
                setStreet(array?.shippingAddress?.street || '');
                setApartment(array?.shippingAddress?.apartment || '');
                setCity(array?.shippingAddress?.city || '');
                setState(array?.shippingAddress?.state || '');
                setZip(array?.shippingAddress?.zip || '');
                setCartItems(cart || []);
                setCartMessage(array?.cartMessage || '');

                let sum = 0;
                for (let i = 0; i < cart?.length; i++) {
                    sum += cart[i].price;
                }
                setTotal(sum.toFixed(2));
            }
        };
        fetchCartItems();
    }, [user]);

    const handleDelete = (item) => {
        Confirm.show(
            'Are you sure you want to remove',
            `${item.name}?`,
            'Yes',
            'No',
            async () => {
                const arr = cartItems.filter((element) => element.id !== item.id);
                setCartItems(arr);
                setTotal(arr.reduce((sum, i) => sum + i.price, 0).toFixed(2));
                await db.collection('users').doc(user.uid).update({ cart: arr });
            },
            () => {
                let sum = 0;
                for (let i = 0; i < cartItems?.length; i++) {
                    sum += cartItems[i].price;
                }
                setTotal(sum.toFixed(2));
                return;
            },
            {}
        );
    };

    const handleCheckout = async () => {
        if (!user || cartItems.length === 0) return;

        setLoading(true);

        try {
            const line_items = cartItems.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        description: item.name,
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: 1,
            }));

            const checkoutSessionRef = await db
                .collection('customers')
                .doc(user.uid)
                .collection('checkout_sessions')
                .add({
                    mode: 'payment',
                    line_items: line_items,
                    success_url: window.location.origin + '/complete?success=true',
                    cancel_url: window.location.origin + '/cart?canceled=true',
                    metadata: {
                        cartItems: JSON.stringify(cartItems.map(item => ({
                            id: item.id,
                            name: item.name,
                            quantity: item.quantity
                        })))
                    }
                });

            const unsubscribe = checkoutSessionRef.onSnapshot((snap) => {
                const data = snap.data();
                if (data?.url) {
                    window.location.assign(data.url);
                    unsubscribe();
                }
                if (data?.error) {
                    console.error('Checkout error:', data.error);
                    alert('Checkout failed: ' + data.error.message);
                    setLoading(false);
                    unsubscribe();
                }
            });
        } catch (error) {
            console.error('Error creating checkout session:', error);
            alert('Failed to start checkout. Please try again.');
            setLoading(false);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success')) {
            alert('Payment successful! Thank you for your purchase.');
            window.history.replaceState({}, '', window.location.pathname);
        }
        if (urlParams.get('canceled')) {
            Notiflix.Notify.success('Checkout canceled. Your cart is still available.');
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const array = {
            street: street,
            city: city,
            state: state,
            zip: zip,
            apartment: apartment
        }
        await db.collection('users').doc(user.uid).update({
            shippingAddress: array,
            cartMessage: cartMessage
        }).then(() => {
            setShowCheckout(true);
            setLoading(false);
        }).catch(err => {
            alert('Error submitting shipping address: ' + err.message);
            setLoading(false);
        })
    }

    return (
        <>
            <div className='flex justify-center'>
                {cartItems.length === 0 ?
                    <div>
                        <span className='text-white text-4xl'>Cart empty </span>
                        <Link href='/glass' className='text-blue-500 text-4xl'><Button>Shop Now</Button></Link>
                    </div> :
                    (!showForm ?
                        <div className='max-w-full rounded overflow-hidden shadow-lg bg-slate-50 mx-3 my-3 items-center text-center p-4'>
                            {cartItems.map((item, key) => {
                                return (
                                    <div key={key} className='flex row-auto'>
                                        <img className='w-24 h-24 p-4 rounded' src={item.image} alt='/' />
                                        <div className='px-6 py-4 text-black'>
                                            <div className='font-bold mb-2'>{item.name}</div>
                                            <div className='flex row'>
                                                <span className='text-l mb-2'>${item.price}</span>
                                                <BsTrash3 size='14' style={{ marginTop: '4px', marginLeft: '5px' }} onClick={() => handleDelete(item)} cursor='pointer' />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div className='flex-col max-w-sm rounded overflow-hidden shadow-lg bg-slate-50 mx-3 my-3 justify-center items-center text-center p-4'>
                                <div className='font-bold border-b my-2'>Total: ${calculateTotal().toFixed(2)}</div>
                                <Typography variant="h6" color="blue-gray" className="mb-3">
                                    Checkout Message
                                </Typography>
                                <Input
                                    size="lg"
                                    type="text"
                                    placeholder={cartMessage || 'Add a note to your order (optional)'}
                                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900 mb-2"
                                    onChange={(e) => setCartMessage(e.target.value)} value={cartMessage}
                                    labelProps={{
                                        className: "before:content-none after:content-none",
                                    }}
                                />
                                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded focus:outline-none focus:shadow-outline' disabled={loading || !user} onClick={() => setShowForm(!showForm)}>Checkout</button>
                            </div>
                        </div>
                        :
                        <div className='flex justify-center mt-4'>
                            <Card color="white" shadow={false} className='min-w-fit p-11'>
                                <Typography variant="h4" color="blue-gray">
                                    Shipping Address
                                </Typography>
                                <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
                                    <div className="mb-1 flex flex-col gap-6">
                                        <Typography variant="h6" color="blue-gray" className="-mb-3">
                                            Your Name
                                        </Typography>
                                        <Input
                                            size="lg"
                                            type='text'
                                            placeholder={user?.displayName || 'John Doe'}
                                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                            onChange={(e) => setName(e.target.value)} value={name}
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }}
                                        />
                                        <Typography variant="h6" color="blue-gray" className="-mb-3">
                                            Street and Number
                                        </Typography>
                                        <Input
                                            size="lg"
                                            type="text"
                                            placeholder={street || '123 Main St'}
                                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                            onChange={(e) => setStreet(e.target.value)} value={street}
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }}
                                        />
                                        <Typography variant="h6" color="blue-gray" className="-mb-3">
                                            Apt/Suite/Unit
                                        </Typography>
                                        <Input
                                            size="lg"
                                            type="text"
                                            placeholder={apartment || 'Apt 4B'}
                                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                            onChange={(e) => setApartment(e.target.value)} value={apartment}
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }}
                                        />
                                        <Typography variant="h6" color="blue-gray" className="-mb-3">
                                            City
                                        </Typography>
                                        <Input
                                            size="lg"
                                            type="text"
                                            placeholder={city || 'Anytown'}
                                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                            onChange={(e) => setCity(e.target.value)} value={city}
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }}
                                        />
                                        <Typography variant="h6" color="blue-gray" className="-mb-3">
                                            State
                                        </Typography>
                                        <Input
                                            size="lg"
                                            type="text"
                                            placeholder={state || 'CA'}
                                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                            onChange={(e) => setState(e.target.value)} value={state}
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }}
                                        />
                                        <Typography variant="h6" color="blue-gray" className="-mb-3">
                                            Zip Code
                                        </Typography>
                                        <Input
                                            size="lg"
                                            type="number"
                                            placeholder={zip || '90210'}
                                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                            onChange={(e) => setZip(e.target.value)} value={zip}
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }}
                                        />

                                        {!showCheckout && <Button className="mt-6" fullWidth type='submit' onSubmit={handleSubmit}>Submit</Button>}
                                        {showCheckout && <Button className="mt-6 items-center" fullWidth onClick={() => handleCheckout()} disabled={loading || !user}>{loading ? "Loading Stripe..." : "Complete Purchase"}</Button>}
                                    </div>
                                </form>
                            </Card>
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default ShoppingCart;
