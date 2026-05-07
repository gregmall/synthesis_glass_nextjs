'use client'
import React, { useState } from 'react'
import { storage, db } from '../../config/Config'
import { useRouter } from 'next/navigation'
import { Notify } from 'notiflix'
import { Textarea, Spinner } from "@material-tailwind/react"

const AddProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [type, setType] = useState('pipe');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const addProduct = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const imageUrls = await Promise.all(
                images.map(async (image) => {
                    const snapshot = await storage.ref(`images/${image.name}`).put(image);
                    return snapshot.ref.getDownloadURL();
                })
            );

            await db.collection('Products').add({
                ProductDescription: description,
                ProductImage: imageUrls,
                ProductName: name,
                ProductPrice: Number(price),
                Type: type,
            });

            Notify.success("ADDED!");
            router.push('/glass');
        } catch (error) {
            console.error('Error uploading product:', error);
            Notify.failure("Failed to add product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const productImgHandler = (e) => {
        setImages(Array.from(e.target.files));
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className='p-4 w-full max-w-lg bg-white rounded-md'>
                <h2>Add Product</h2>
                <form onSubmit={addProduct} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
                    <div className="mb-4">
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='product-name'>Name</label>
                        <input
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                    </div>
                    <div className="mb-4">
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='product-description'>Description</label>
                        <Textarea
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                        />
                    </div>
                    <div className="mb-6">
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='product-price'>Price</label>
                        <input
                            className='shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                            type="number"
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                        />
                    </div>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='product-image'>Image</label>
                    <input
                        type="file"
                        id="productImage"
                        accept=".png, .jpg, .jpeg"
                        multiple="multiple"
                        onChange={productImgHandler}
                    />
                    <br />
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='product-image'>Type</label>
                    <select onChange={(e) => setType(e.target.value)}>
                        <option value="pipe">pipe</option>
                        <option value="chillum">chillum</option>
                        <option value="bowl">bowl</option>
                    </select>
                    <br />
                    <button
                        className='my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? <Spinner color="green" /> : 'Add'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
