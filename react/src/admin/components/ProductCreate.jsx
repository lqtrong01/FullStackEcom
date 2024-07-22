import React, { useEffect, useState } from 'react';
import axiosClient from '../../axios';
import { BiRefresh } from 'react-icons/bi';
import { PhotoIcon } from '@heroicons/react/24/outline';
import TButton from './shared/TButton';
import { MdArrowBack } from 'react-icons/md';
import { useStateContext } from '../../contexts/ContextProvider';
import { useNavigate } from 'react-router-dom';

const ProductCreate = () => {
    const [category, setCategory] = useState([])
    const [product, setProduct] = useState([])
    const { setNotification } = useStateContext()
    const navigate = useNavigate()
    useEffect(() => {
        axiosClient.get('/product_category')
            .then(({ data }) => {
                setCategory(data.data)
            })
            .catch(({ err }) => {
                console.error(err)
            })
    }, [])
    const generateRandomCode = (length) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };
    const existingCodes = new Set(); // Tập hợp lưu trữ mã sản phẩm đã tồn tại

    const generateUniqueCode = (length) => {
        let code;
        do {
            code = generateRandomCode(length);
        } while (existingCodes.has(code));
        existingCodes.add(code);
        return code;
    };

    const [productCode, setProductCode] = useState(generateUniqueCode(6));

    const handleGenerateCode = () => {
        setProductCode(generateUniqueCode(6));
    };

    const onImageChoose = (ev) => {
        const file = ev.target.files[0];

        const reader = new FileReader();
        reader.onload = () => {
            setProduct({
                ...product,
                image: file,
                product_image: reader.result,
            });
            ev.target.value = "";
        };
        reader.readAsDataURL(file);
    };

    const onSubmit = (event) => {
        event.preventDefault()
        const productData = {
            name: product.name,
            // product_code: productCode,
            price: product.price,
            category_id: product.category_id ?? category[0].id,
            description: product.description ?? "",
            type: 'New',
            product_image: product.product_image ?? ""
        };
        if (productData)
            axiosClient.post('/product', productData)
                .then(({ data }) => {
                    setNotification(data.message, true)
                    navigate('/admin/products')
                })
                .catch(({ err }) => {
                    setNotification('Fail to created new Product', false)
                    console.error(err)
                })

    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className='flex justify-around w-full m-3'>
                <div className='flex-1'>
                    <h1 className="text-2xl font-bold mb-4">Create Product</h1>
                </div>
                <div className='flex'>
                    <TButton
                        color='green'
                        to='/admin/products'
                        className="border-2 border-black "
                    >
                        <MdArrowBack className='mr-2' />
                        Back
                    </TButton>
                </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
                <form onSubmit={(e) => onSubmit(e)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name:<span className="text-red-500">*</span></label>
                            <input
                                maxLength={100}
                                value={product.name ?? ""}
                                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="Name" />
                        </div>
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700">Product Code:<span className="text-red-500">*</span></label>
                            <div className="flex items-center justify-center">
                                <input value={productCode} type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="Product Code" />
                                <BiRefresh onClick={() => handleGenerateCode()}
                                    className='size-9 bg-gray-500 cursor-pointer rounded-full' />
                            </div>
                        </div> */}
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700">Category:<span className="text-red-500">*</span></label>
                            <select
                                value={category.id}
                                onChange={(e) => setProduct({ ...product, category_id: e.target.value })}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                                {category.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.category_name}
                                    </option>
                                ))}

                            </select>
                        </div> */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Unit Price:<span className="text-red-500">*</span></label>
                            <input
                                min={1}
                                value={product.price ?? ""}
                                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                                type="number" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="Unit Price" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category:<span className="text-red-500">*</span></label>
                            <select
                                value={category.id}
                                onChange={(e) => setProduct({ ...product, category_id: e.target.value })}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                                {category.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.category_name}
                                    </option>
                                ))}
                                {/* <option value="1">Category 1</option>
                                <option value="2">Category 2</option>
                                <option value="3">Category 3</option> */}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Description:</label>
                            <textarea
                                value={product.description ?? ""}
                                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="Description"></textarea>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Image:</label>
                            <div className="flex items-center">
                                {/* <img src={product ? "https://via.placeholder.com/100" : product.product_image} alt="Product" className="w-24 h-24 object-cover rounded-md mr-4" /> */}
                                {product.product_image && (
                                    <img
                                        src={product.product_image}
                                        alt=""
                                        className="w-24 h-24 object-cover rounded-md mr-4"
                                    />
                                )}
                                {!product.product_image && (
                                    <span className="flex justify-center  items-center text-gray-400 h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                                        <PhotoIcon className="w-8 h-8" />
                                    </span>
                                )}
                                <input
                                    id="file-upload"
                                    accept="image/png, image/jpeg, image/jpg, image/gif"
                                    type="file" className="hidden" onChange={onImageChoose} />
                                <label htmlFor="file-upload" className="cursor-pointer p-2 bg-gray-200 rounded-md">
                                    Chọn ảnh
                                </label>
                            </div>
                            <p className="text-sm text-gray-500">Allowed file types: png, jpg, jpeg.</p>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => navigate('/admin/products')}
                            type="button" className="mr-4 bg-gray-500 text-white py-2 px-4 rounded-md">Cancel</button>
                        <button

                            type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductCreate
