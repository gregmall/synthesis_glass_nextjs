'use client'
import { useState, useEffect } from 'react'
import { db, auth } from '../../config/Config';
import {
    Card,
    Input,
    Button,
    Typography,
    Textarea,
} from "@material-tailwind/react";
import { BsTrash3 } from "react-icons/bs"
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Notiflix from 'notiflix';

const INPUT_LABEL_PROPS = { className: "before:content-none after:content-none" };
const INPUT_CLASS = "!border-t-blue-gray-200 focus:!border-t-gray-900";

const ShoppingCart = () => {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [apartment, setApartment] = useState('');
    const [showCheckout, setShowCheckout] = useState(false);
    const [cartMessage, setCartMessage] = useState('');

    const total = cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2);

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
            const userFromStorage = JSON.parse(localStorage.getItem('user'));
            if (userFromStorage === null) router.push('/signin');
        }
    }, [router]);

    useEffect(() => {
        if (!user?.uid) return;
        const fetchCartItems = async () => {
            const person = await db.collection('users').doc(user.uid).get();
            const data = person.data();
            setName(data?.name || '');
            setStreet(data?.shippingAddress?.street || '');
            setApartment(data?.shippingAddress?.apartment || '');
            setCity(data?.shippingAddress?.city || '');
            setState(data?.shippingAddress?.state || '');
            setZip(data?.shippingAddress?.zip || '');
            setCartItems(data?.cart || []);
            setCartMessage(data?.cartMessage || '');
        };
        fetchCartItems();
    }, [user]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success')) {
            Notiflix.Notify.success('Payment successful! Thank you for your purchase.');
            window.history.replaceState({}, '', window.location.pathname);
        }
        if (urlParams.get('canceled')) {
            Notiflix.Notify.info('Checkout canceled. Your cart is still available.');
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, []);

    const handleDelete = (item) => {
        Confirm.show(
            'Are you sure you want to remove',
            `${item.name}?`,
            'Yes',
            'No',
            async () => {
                const idx = cartItems.findIndex((el) => el.id === item.id);
                const arr = [...cartItems.slice(0, idx), ...cartItems.slice(idx + 1)];
                setCartItems(arr);
                await db.collection('users').doc(user.uid).update({ cart: arr });
            },
        );
    };

    const handleCheckout = async () => {
        if (!user || cartItems.length === 0) return;
        setLoading(true);
        try {
            const line_items = cartItems.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: { name: item.name, description: item.name },
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
                    line_items,
                    success_url: window.location.origin + '/complete?success=true',
                    cancel_url: window.location.origin + '/cart?canceled=true',
                    metadata: {
                        cartItems: JSON.stringify(cartItems.map(({ id, name, quantity }) => ({ id, name, quantity })))
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
                    Notiflix.Notify.failure('Checkout failed: ' + data.error.message);
                    setLoading(false);
                    unsubscribe();
                }
            });
        } catch (error) {
            console.error('Error creating checkout session:', error);
            Notiflix.Notify.failure('Failed to start checkout. Please try again.');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await db.collection('users').doc(user.uid).update({
                shippingAddress: { street, city, state, zip, apartment },
                cartMessage,
            });
            setShowCheckout(true);
        } catch (err) {
            Notiflix.Notify.failure('Error submitting shipping address: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className='flex justify-center'>
                <span className='text-white text-4xl'>Cart empty </span>
                <Link href='/glass' className='text-blue-500 text-4xl'><Button>Shop Now</Button></Link>
            </div>
        );
    }

    if (showForm) {
        return (
            <div className='flex justify-center mt-4'>
                <Card color="white" shadow={false} className='min-w-fit p-11'>
                    <Typography variant="h4" color="blue-gray">Shipping Address</Typography>
                    <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
                        <div className="mb-1 flex flex-col gap-6">
                            <Typography variant="h6" color="blue-gray" className="-mb-3">Your Name</Typography>
                            <Input size="lg" type="text" placeholder={user?.displayName || 'John Doe'} className={INPUT_CLASS} onChange={(e) => setName(e.target.value)} value={name} labelProps={INPUT_LABEL_PROPS} />
                            <Typography variant="h6" color="blue-gray" className="-mb-3">Street and Number</Typography>
                            <Input size="lg" type="text" placeholder={street || '123 Main St'} className={INPUT_CLASS} onChange={(e) => setStreet(e.target.value)} value={street} labelProps={INPUT_LABEL_PROPS} />
                            <Typography variant="h6" color="blue-gray" className="-mb-3">Apt/Suite/Unit</Typography>
                            <Input size="lg" type="text" placeholder={apartment || 'Apt 4B'} className={INPUT_CLASS} onChange={(e) => setApartment(e.target.value)} value={apartment} labelProps={INPUT_LABEL_PROPS} />
                            <Typography variant="h6" color="blue-gray" className="-mb-3">City</Typography>
                            <Input size="lg" type="text" placeholder={city || 'Anytown'} className={INPUT_CLASS} onChange={(e) => setCity(e.target.value)} value={city} labelProps={INPUT_LABEL_PROPS} />
                            <Typography variant="h6" color="blue-gray" className="-mb-3">State</Typography>
                            <Input size="lg" type="text" placeholder={state || 'CA'} className={INPUT_CLASS} onChange={(e) => setState(e.target.value)} value={state} labelProps={INPUT_LABEL_PROPS} />
                            <Typography variant="h6" color="blue-gray" className="-mb-3">Zip Code</Typography>
                            <Input size="lg" type="number" placeholder={zip || '90210'} className={INPUT_CLASS} onChange={(e) => setZip(e.target.value)} value={zip} labelProps={INPUT_LABEL_PROPS} />
                            {showCheckout
                                ? <Button className="mt-6 items-center" fullWidth onClick={handleCheckout} disabled={loading || !user}>{loading ? 'Loading Stripe...' : 'Complete Purchase'}</Button>
                                : <Button className="mt-6" fullWidth type='submit' disabled={loading}>{loading ? 'Saving...' : 'Submit'}</Button>
                            }
                        </div>
                    </form>
                </Card>
            </div>
        );
    }

    return (
        <div className='flex justify-center'>
            <div className='max-w-full rounded overflow-hidden shadow-lg bg-slate-50 mx-3 my-3 items-center text-center p-4'>
                {cartItems.map((item) => (
                    <div key={item.id} className='flex row-auto'>
                        <img className='w-24 h-24 p-4 rounded' src={Array.isArray(item.image) ? item.image[0] : item.image} alt={item.name} />
                        <div className='px-6 py-4 text-black'>
                            <div className='font-bold mb-2'>{item.name}</div>
                            <div className='flex row'>
                                <span className='text-l mb-2'>${item.price}</span>
                                <BsTrash3 size='14' style={{ marginTop: '4px', marginLeft: '5px' }} onClick={() => handleDelete(item)} cursor='pointer' />
                            </div>
                        </div>
                    </div>
                ))}
                <div className='flex-col max-w-lg rounded overflow-hidden shadow-lg bg-slate-50 mx-3 my-3 justify-center items-center text-center p-4'>
                    <div className='font-bold border-b my-2'>Total: ${total}</div>
                    <Typography variant="h6" color="blue-gray" className="mb-3 mt-8">Checkout Message</Typography>
                    <Textarea
                        size="extra-large"
                        type="text"
                        placeholder={cartMessage || 'Add a note to your order (optional)'}
                        className={`${INPUT_CLASS} mb-2`}
                        onChange={(e) => setCartMessage(e.target.value)}
                        value={cartMessage}
                        labelProps={INPUT_LABEL_PROPS}
                    />
                    <button
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded focus:outline-none focus:shadow-outline'
                        disabled={loading || !user}
                        onClick={() => setShowForm(true)}
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;
