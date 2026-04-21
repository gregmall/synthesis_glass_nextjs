'use client'
import { useEffect, useState, useContext } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { db } from '../../config/Config';
import { Vortex } from 'react-loader-spinner';
import { UserContext } from '../../context/UserContextProvider';
import Notiflix from 'notiflix';

const BTN_CLASS = 'my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
const VORTEX_COLORS = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];

const GlassDetail = () => {
    const params = useParams();
    const { user } = useContext(UserContext);
    const router = useRouter();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState(null);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const getItem = async () => {
            try {
                const doc = await db.collection('Products').doc(params.id).get();
                if (doc.exists) {
                    const data = doc.data();
                    setActive(data.ProductImage?.[0] || null);
                    setItem({
                        id: data.ID,
                        images: data.ProductImage,
                        title: data.ProductName,
                        description: data.ProductDescription,
                        price: data.ProductPrice
                    });
                } else {
                    Notiflix.Notify.failure('Product not found!');
                    router.push('/glass');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                Notiflix.Notify.failure('An error occurred while fetching the product.');
                router.push('/glass');
            } finally {
                setLoading(false);
            }
        };

        getItem();
    }, [params.id]);

    const handleAddToCart = async () => {
        setAdding(true);
        try {
            await db.collection('users').doc(user.id).update({
                cart: [...(user.cart || []), { id: params.id, name: item.title, image: item.images, price: item.price }]
            });
            Notiflix.Notify.success(`${item.title} added to shopping cart!`);
            router.back();
        } catch (error) {
            console.error('Error adding to cart:', error);
            Notiflix.Notify.failure('An error occurred while adding the item to the cart.');
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center mt-20'>
                <Vortex
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="vortex-loading"
                    wrapperClassName="vortex-wrapper"
                    colors={VORTEX_COLORS}
                />
            </div>
        );
    }

    return (
        <div className='flex justify-center px-4 py-8'>
            <div className='w-full max-w-4xl rounded overflow-hidden bg-slate-50 shadow-2xl'>
                <div className='flex flex-col md:flex-row'>
                    {/* Image gallery */}
                    <div className='md:w-1/2 p-4 flex flex-col gap-3'>
                        <img
                            className='w-full rounded-lg object-cover aspect-square'
                            src={active}
                            alt={item?.title}
                        />
                        {item?.images?.length > 1 && (
                            <div className='flex gap-2 flex-wrap'>
                                {item.images.map((imgLink, index) => (
                                    <img
                                        key={index}
                                        onClick={() => setActive(imgLink)}
                                        src={imgLink}
                                        alt={`${item.title} view ${index + 1}`}
                                        className={`h-16 w-16 cursor-pointer rounded-lg object-cover transition-all ${
                                            active === imgLink
                                                ? 'ring-2 ring-blue-500 ring-offset-2'
                                                : 'opacity-70 hover:opacity-100'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product details */}
                    <div className='md:w-1/2 px-6 py-4 flex flex-col justify-between'>
                        <div>
                            <h1 className='font-bold text-3xl mb-3'>{item?.title}</h1>
                            <span className='text-2xl font-semibold text-gray-800'>${item?.price}</span>
                            <p className='text-gray-700 text-base mt-4 leading-relaxed'>{item?.description}</p>
                        </div>
                        <div className='flex justify-between mt-6'>
                            {user
                                ? <button className={BTN_CLASS} disabled={adding} onClick={handleAddToCart}>
                                    {adding ? 'Adding...' : 'Add to cart!'}
                                  </button>
                                : <button className={BTN_CLASS} onClick={() => router.push('/signin')}>Sign in to purchase!</button>
                            }
                            <button className={BTN_CLASS} onClick={() => router.back()}>Back</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlassDetail;
