import React, { useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import axiosClient from '../../axios';
import { BiRefresh } from 'react-icons/bi';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import TButton from './shared/TButton';
import { MdArrowBack } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../assets/Spinner.png'
import { useStateContext } from '../../contexts/ContextProvider';

const ProductEdit = () => {
    const [category, setCategory] = useState([])
    const [product, setProduct] = useState([])
    const [loading, setLoading] = useState(true)
    const [product_item, setProductItem] = useState({})
    const [show, setShow] = useState(false)
    const [product_category, setProductCategory] = useState({})
    const [type_products, setTypeProduct] = useState([])
    const navigate = useNavigate()
    const [error, setError] = useState({ __html: "" });
    const { setNotification } = useStateContext()
    const [quantity, setQuantity] = useState(0)
    const [type, setType] = useState([])
    const id = useParams()

    useEffect(() => {
        setLoading(false)
        axiosClient.get('/product_category')
            .then(({ data }) => {
                setCategory(data.data)
            })
            .catch(({ err }) => {
                console.error(err)
            })
        axiosClient.get('/product_types')
            .then(({data }) => {
                setTypeProduct(data)
            })
        axiosClient.get(`/product/${id.id}`)
            .then(({ data }) => {
                setProduct(data.data)
                setProductItem(data.data.product_item)
                setProductCategory(data.data.category)
                setLoading(true)
            })
            .catch(({ err }) => {
                console.error(err)
                setLoading(false)
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

    const [productCode, setProductCode] = useState(generateUniqueCode(6))
    const handleGenerateCode = () => {
        setProductCode(generateUniqueCode(6));
    };
    const [imageBase64, setImageBase64] = useState('');

    const onImageChoose = (ev) => {
        const file = ev.target.files[0];

        const reader = new FileReader();
        reader.onload = () => {
            setProduct({
                ...product,
                image: file,
                product_image: reader.result,
            });
            setImageBase64(reader.result);
            ev.target.value = "";
        };
        reader.readAsDataURL(file);
    };

    const onSubmit = (event) => {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của form
        setProduct({...product, description:product.description??"Description"})
        const number = Number(product_item.qty_in_stock) + Number(quantity)
        const productData = {
            name: product.name??"Product??",
            // product_code: productCode,
            price: product_item.price??1,
            category_id: product_category.id,
            description: product.description ?? 'Description',
            qty_in_stock: number,
            type: product.type,
            product_image: imageBase64 === "" ? product.product_image ?? "" : ""
        };

        // Gửi dữ liệu lên server
        axiosClient.put(`/product/${id.id}`, productData)
            .then(({ data }) => {
                setNotification(data.message, true)
                navigate('/admin/products')
            })
            .catch((err) => {
                setNotification('Fail to action Updated Product', false)
                console.error(err);
            });f
    };
    const handleNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,2}$/.test(value)) { // Chỉ cho phép nhập tối đa 10 chữ số
            setQuantity(value)
        }
    };
    return (
        <>
            {
                <Dialog className="relative z-10" open={show} onClose={setShow}>
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in md:block"
                    />
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                            <DialogPanel
                                transition
                                className="flex max-w-sm transform text-left text-base transition data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in md:my-8 md:max-w-2xl md:px-4 data-[closed]:md:translate-y-0 data-[closed]:md:scale-95 lg:max-w-4xl"
                            >
                                <div className="relative flex flex-col w-auto justify-center items-center outline-none border rounded-md bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                                    <div className="flex w-full flex-shrink-0 items-center justify-around border-b-2 border-indigo-500 rounded-tl-lg rounded-tr-lg">
                                        <div class="flex-1 ">
                                            <h2>Update Quantity</h2>
                                        </div>
                                        <div >
                                            <XMarkIcon onClick={() => setShow(false)} className="h-6 w-6 text-black hover:text-red-500 cursor-pointer" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="w-full items-start gap-x-6 gap-y-8 mt-10">
                                        <div>
                                            {error.__html && (
                                                <div
                                                    className="bg-red-500 w-full flex rounded py-2 px-3 text-white"
                                                    dangerouslySetInnerHTML={error}
                                                ></div>
                                            )}
                                            <label className="block text-sm font-medium text-gray-700">Name:<span className="text-red-500">*</span></label>
                                            <input
                                                type="number"
                                                minLength={1}
                                                min={0}
                                                max={99}
                                                maxLength={2}
                                                value={quantity}
                                                onCopy={false}
                                                onChange={(e) => handleNumberChange(e)}
                                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                                placeholder="Numberic"
                                            />
                                        </div>
                                    </div>
                                    <div className=" w-full flex justify-end items-center gap-4 mt-6">
                                        <button
                                            onClick={() => setShow(false)}
                                            type="submit" className="w-[80px] h-[40px] border-none outline-none bg-sky-500 text-1xl  hover:bg-cyan-950-600 text-slate-100 rounded-md"
                                        >
                                            OK
                                        </button>
                                        <button onClick={() => setShow(false)} type="button" className="h-[40px] w-[70px] border-none outline-none bg-gray-500 text-1xl  hover:bg-cyan-950-600 text-slate-100 rounded-md">Cancle</button>
                                    </div>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>
            }
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center top-0">
                <div className='flex justify-around w-full m-3'>
                    <div className='flex-1'>
                        <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
                    </div>
                    <div className='flex'>
                        <TButton to='/admin/products'>
                            <MdArrowBack />
                            Back
                        </TButton>
                    </div>
                </div>
                {!loading && <div className="w-full flex justify-center items-center"><img src={Spinner} className="animate-spin size-20" /></div>}
                {loading &&
                    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">

                        <form>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name:<span className="text-red-500">*</span></label>
                                    <input
                                        value={product.name}
                                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                        type="text"
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="Name"
                                    />
                                </div>
                                {/* <div>
                            <label className="block text-sm font-medium text-gray-700">Product Code:<span className="text-red-500">*</span></label>
                            <div className="flex items-center justify-center">
                                <input value={productCode} type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="Product Code" />
                                <BiRefresh onClick={() => handleGenerateCode()}
                                    className='size-9 bg-gray-500 cursor-pointer rounded-full' />
                            </div>
                        </div> */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type:<span className="text-red-500">*</span></label>
                                    <select
                                        value={product.type}
                                        onChange={(e) => setProduct({ ...product, type: e.target.value })}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                                        {type_products.map((item) => (
                                            <option key={item.id} value={item.type}>
                                                {item.type}
                                            </option>
                                        ))}
                                        {/* <option value="1">Category 1</option>
                                <option value="2">Category 2</option>
                                <option value="3">Category 3</option> */}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Unit Price:<span className="text-red-500">*</span></label>
                                    <input
                                        value={product_item.price}
                                        min={1}
                                        onChange={(e) => setProductItem({ ...product_item, price: e.target.value })}
                                        type="number" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="Unit Price" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category:<span className="text-red-500">*</span></label>
                                    {category.length > 0 && product_category ? (
                                        <select
                                            value={product_category.id}
                                            onChange={(e) => setProductCategory(category.find(item => item.id === parseInt(e.target.value)))}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                        >
                                            {category.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.category_name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <p>No category available</p>
                                    )}
                                </div>
                                {/* <div>
                            <label className="block text-sm font-medium text-gray-700">Type:<span className="text-red-500">*</span></label>
                            {category.length > 0 && product_category ? (
                                <select
                                    value={product_category.id}
                                    onChange={(e) => setProductCategory(category.find(item => item.id === parseInt(e.target.value)))}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                >
                                    {category.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.category_name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p>No category available</p>
                            )}
                        </div> */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Description:</label>
                                    <textarea
                                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                        value={product.description}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="Description"></textarea>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Image:</label>
                                    <div className="flex items-center">
                                        {/* <img src={product ? "https://via.placeholder.com/100" : product.product_image} alt="Product" className="w-24 h-24 object-cover rounded-md mr-4" /> */}
                                        {product.product_image && (
                                            <img
                                                src={product.product_image[0] === 'i' ? import.meta.env.VITE_API_BASE_URL + '/' + product.product_image : product.product_image}
                                                alt=""
                                                className="w-24 h-24 object-contain rounded-md mr-4"
                                            />
                                        )}
                                        {!product.product_image && (
                                            <span className="flex justify-center  items-center text-gray-400 h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                                                <PhotoIcon className="w-8 h-8" />
                                            </span>
                                        )}
                                        <input type="file" className="hidden" id="file-upload" onChange={onImageChoose} />
                                        <label htmlFor="file-upload" className="cursor-pointer p-2 bg-gray-200 rounded-md">
                                            Chọn ảnh
                                        </label>
                                    </div>
                                    <p className="text-sm text-gray-500">Allowed file types: png, jpg, jpeg.</p>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>

                                    <label className="block text-sm font-medium text-gray-700">Quantity In Stock: {product_item.qty_in_stock}</label>
                                    {quantity > 0 && <label className='block text-sm font-medium text-gray-700'>Upadte Qty: {quantity}</label>}
                                    <button
                                        type='button'
                                        onClick={() => setShow(true)}
                                        className="cursor-pointer size-6 bg-gray-200 rounded-md border-none"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => navigate('/admin/products')}
                                    type="button" className="mr-4 bg-gray-500 text-white py-2 px-4 rounded-md">Cancel</button>
                                <button
                                    onClick={(e) => onSubmit(e)}
                                    type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">Save</button>
                            </div>
                        </form>
                    </div>}
            </div>
        </>
    );
};

export default ProductEdit
