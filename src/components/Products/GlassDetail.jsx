'use client'
import { useEffect, useState, useContext } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { db } from '../../config/Config';
import { Vortex } from 'react-loader-spinner';
import { UserContext } from '../../context/UserContextProvider';
import Notiflix from 'notiflix';

const BTN_CLASS = 'my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'

const GlassDetail = () => {
    const params = useParams();
    const { user } = useContext(UserContext);
    const router = useRouter();
    const [item, setItem] = useState();
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [active, setActive] = useState();
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const getItem = async () => {
            try {
                const doc = await db.collection('Products').doc(params.id).get();
                if (doc.exists) {
                    const data = doc.data();
                    const array = data.ProductImage.map(img => ({ imgLink: img }));
                    setImages(array);
                    setActive(array[0]?.imgLink || '');
                    setItem({
                        id: data.ID,
                        image: data.ProductImage,
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
    }, [params.id, router]);

    const handleClick = async (item) => {
        setAdding(true);
        try {
            await db.collection('users').doc(user.id).update({
                cart: [...(user.cart || []), { id: params.id, name: item.title, image: item.image, price: item.price }]
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

    return (
        <div className='flex items-center justify-center flex-wrap overflow-x-auto'>
            {loading ?
                <Vortex
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="vortex-loading"
                    wrapperClassName="vortex-wrapper"
                    colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
                />
                :
                <div className='max-w-xl rounded overflow-hidden bg-slate-50 mx-3 my-3 shadow-2xl'>
                    <div className='font-bold text-3xl mb-2 flex justify-center px-4'>{item?.title}</div>
                    <div>
                        <img className="w-full p-4 rounded" src={active} alt="" />
                    </div>
                    <div className="flex justify-center gap-4 max-w-full">
                        {images.map(({ imgLink }, index) => (
                            <div key={index} className='flex justify-center'>
                                <img
                                    onClick={() => setActive(imgLink)}
                                    src={imgLink}
                                    className="h-20 max-w-full cursor-pointer rounded-lg object-cover object-center mx-2 flex-wrap px-1"
                                    alt="/"
                                />
                            </div>
                        ))}
                    </div>
                    <div className='px-6 py-4 flex-col'>
                        <span className='text-xl mb-2'>${item?.price}</span>
                        <p className='text-gray-700 text-base'>{item?.description}</p>
                        <div className='flex justify-between'>
                            {user
                                ? <button className={BTN_CLASS} disabled={adding} onClick={() => handleClick(item)}>
                                    {adding ? 'Adding...' : 'Add to cart!'}
                                  </button>
                                : <button className={BTN_CLASS} onClick={() => router.push('/signin')}>Sign in to purchase!</button>
                            }
                            <button className={BTN_CLASS} onClick={() => router.back()}>Back</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default GlassDetail;
