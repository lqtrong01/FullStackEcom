import React, { useEffect, useRef, useState } from 'react';
import axiosClient from '../../axios';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, useStateContext } from '../../contexts/ContextProvider';
import { FaSpinner } from 'react-icons/fa';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderPage = () => {
    const { currentUser, products, setCurrentUser, setNotification } = useStateContext()
    const [carts, setCart] = useState([])
    const [payment, setPayment] = useState([])
    const [shipping_method, setShippingMethod] = useState([])
    const [payment_type, setPaymentType] = useState([])
    const [address, setAddress] = useState([])
    const [loadForm, setLoadForm] = useState(null)
    const [loading, setLoading] = useState(null)
    const [totalPrice, setTotalPrice] = useState(0)
    const [shippingPrice, setShippingPrice] = useState(0)
    const [subTotal, setSubTotal] = useState(0)
    const scrollToTopRef = useRef(null)
    const [memoryPrice, setMemoryPrice] = useState(0)
    const [openDialog, setOpenDialog] = useState(false)
    const [counter, setCounter] = useState(10)
    const [selected, setSelected] = useState({})
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(false);
        const fetch = async () => {
            const result = await axiosClient.get('/shipping_method')
            setShippingMethod(result.data.data)

            axiosClient.get('/payment_type')
                .then(({ data }) => {
                    setPaymentType(data.data)
                })
            axiosClient.get(`/user/${currentUser.id}`)
                .then(({ data }) => {
                    setAddress(data.data.addresses)
                    const fetchedCarts = data.data.shopping_cart.items;
                    const mergedItems = fetchedCarts.map(item => {
                        const product = products.find(product => product.id === item.product_item_id);
                        if (product) {
                            return {
                                ...item,
                                price: product.product_item.price,
                                name: product.name
                            };
                        }
                        return item;
                    });

                    setCart(mergedItems);
                    const total = mergedItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
                    setSubTotal(total);
                    setTotalPrice(total);
                    setLoading(true);
                })
                .catch(err => {
                    console.error("Error fetching data:", err);
                    setLoading(false);
                    setTimeout(() => {
                        navigate('/')
                    }, 3000);
                });
        }
        fetch()
        setTotalPrice(Number(shippingPrice) + Number(totalPrice))
    }, []);

    const handlePaymentClick = async () => {
        if (!payment?.payment_method_id) {
            toast.warn('Vui lòng chọn phương thức thanh toán')
        } else if (!payment?.shipping_address) {
            toast.warn('Vui lòng chọn địa chỉ trước khi thanh toán')
            if (window.confirm('Bạn có muốn thêm địa mới trước khi thanh toán'))
                navigate('/user/address')
        } else if (!payment.shipping_method) {
            toast.warn('Vui lòng chọn phương thức vận chuyển')
        }
        else {
            if (payment.payment_method_id === 1) {
                if(totalPrice>99999999){
                    toast.warn('Phương thức thanh toán không khả dụng bởi vì số tiền quá lớn')
                    return
                }
                const result = await handleTransaction(totalPrice);
            } else if (payment.payment_method_id === 2) {
                const orderData = {
                    user_id: currentUser.id,
                    payment_method_id: payment.payment_method_id,
                    shipping_address: payment.shipping_address ?? address[0]?.id,
                    shipping_method: payment.shipping_method ?? shipping_method[0]?.id,
                    order_total: totalPrice,
                    order_status: 1,
                    order_lines: carts.map(cart => ({
                        id: cart.id,
                        product_item_id: cart.product_item_id,
                        qty: cart.qty,
                        price: cart.price
                    }))
                };
    
                await sessionStorage.setItem('orderData', JSON.stringify(orderData));
                saveData()
                toast.success('Thanh toán thành công');
                navigate('/home')
            }
        }

    };

    useEffect(() => {
        // Xử lý phản hồi từ VNPay khi trang bị load
        window.addEventListener('message', handlePaymentResponse);
        return () => {
            window.removeEventListener('message', handlePaymentResponse);
        };
    }, [window]);

    const handlePaymentResponse = async (event) => {
        const { data } = event;
        if (data === 'payment-success') {
            // Xử lý khi thanh toán thành công
            setTimeout(() => {
                saveData()
                toast.success('Thanh toán thành công');
            }, 4000);
            
            navigate('/home')
        } else if (data === 'payment-failed') {
            // Xử lý khi thanh toán thất bại
            toast.error('Thanh toán thất bại');
            setOpenDialog(false); // Đóng dialog thanh toán nếu có
        }
    };

    const handleTransaction = async (totalPrice) => {
        try {
            const orderData = {
                user_id: currentUser.id,
                payment_method_id: payment.payment_method_id,
                shipping_address: payment.shipping_address ?? address[0]?.id,
                shipping_method: payment.shipping_method ?? shipping_method[0]?.id,
                order_total: totalPrice,
                order_status: 1,
                order_lines: carts.map(cart => ({
                    id: cart.id,
                    product_item_id: cart.product_item_id,
                    qty: cart.qty,
                    price: cart.price
                }))
            };

            sessionStorage.setItem('orderData', JSON.stringify(orderData));

            const response = await axiosClient.post('/vnpay_payment', {
                amount: totalPrice,
                bank_code: 'VNBANK',
                language: 'vn'
            });

            if (response.data.code === '00') {
                const paymentUrl = response.data.data;
                const newWindow = window.open(paymentUrl);

                if (newWindow) {
                    setOpenDialog(true);

                    const checkWindowClosed = setInterval(async () => {
                        if (newWindow.closed) {
                            clearInterval(checkWindowClosed);
                            setOpenDialog(false);
                            console.log('Payment window closed.');
                            //alert('Trang thanh toán đã bị đóng')
                        }
                    }, 1000);

                    return () => {
                        clearInterval(checkWindowClosed);
                        newWindow.close();
                    };
                } else {
                    setOpenDialog(false);
                    console.error('Failed to open payment tab.');
                }
            } else {
                console.error('Payment failed:', response.data.message);
            }
        } catch (error) {
            console.error('Error during the payment process', error);
        }
    };


    const handleShippingMethodChange = (e) => {
        const selectedIndex = e.target.selectedIndex;
        const selectedOption = e.target.options[selectedIndex];
        const price = selectedOption.getAttribute('price');
        const id = e.target.value;

        const newTotalPrice = Number(totalPrice) + Number(price) - Number(memoryPrice)
        setTotalPrice(newTotalPrice);
        setMemoryPrice(Number(price))
        setPayment({ ...payment, shipping_method: id, price: price });
    };

    const handleAddressChange = (address) => {
        setPayment({ ...payment, shipping_address: address.id });
        setSelected(address);
    };

    const saveData = () => {
        const orderLines = carts.map(cart => ({
            id: cart.id,
            product_item_id: cart.product_item_id,
            qty: cart.qty,
            price: cart.price
        }));
        const orderData = JSON.parse(sessionStorage.getItem('orderData'));
        if (orderData) {
            axiosClient.post('/order', orderData)
                .then(({ data }) => {
                    setNotification(data.message, true);
                    setCurrentUser({
                        ...currentUser,
                        event: 'order'
                    });
                    sessionStorage.removeItem('orderData');
                    //navigate('/home');
                }).catch(error => {
                    toast.error('Error checking out:', error);
                    setNotification('Error checking out. Please try again.', false);
                });
        } else {
            alert('Không tìm thấy dữ liệu đơn hàng.');
        }
    };
    useEffect(() => {
        setSelected(address[0])
    }, [])

    if (!loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="animate-spin h-12 w-12 text-gray-500" />
                <span className="ml-3">Loading...</span>
                {/* <span>{currentUser?? <h2 onClick={()=>navigate('/')} className='text-red-500 cursor-pointer'>Back to home</h2>}
                </span> */}
            </div>
        );

    }

    return (
        <>
            <ToastContainer />
            <div ref={scrollToTopRef}></div>
            <Dialog open={openDialog} onClose={() => { }}>
                <DialogTitle>Xác nhận thanh toán</DialogTitle>
                <DialogContent className='flex flex-col justify-center w-full'>
                    <FaSpinner className='size-12 text-cyan-500 animate-spin text-center' />
                    Đang xử lý thanh toán...
                </DialogContent>
                <DialogActions>
                </DialogActions>
            </Dialog>
            <div className="p-4 bg-gray-100 min-h-screen">
                <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-1 rounded-lg p-4">
                        <div className="mb-6 bg-white p-4">
                            <h2 className="text-lg font-semibold">Shipping Address</h2>
                            <Listbox value={address[0]?.address_line || ''} onChange={handleAddressChange}>
                                <Label className="block text-sm font-medium leading-6 text-gray-900">Assigned to</Label>
                                <div className="relative mt-2">
                                    <ListboxButton className="relative w-full h-10 cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                                        <span className="flex items-center">
                                            <span className="ml-3 block truncate">{selected?.address_line}</span>
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                            <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                                        </span>
                                    </ListboxButton>

                                    <ListboxOptions
                                        transition
                                        className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                                    >

                                        {address.map((item) => (
                                            <ListboxOption
                                                key={item.id}
                                                value={item}
                                                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                                            >
                                                <div className="flex items-center">
                                                    <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                                                        {item.address_line}
                                                    </span>
                                                </div>

                                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                                                    <CheckIcon aria-hidden="true" className="h-5 w-5" />
                                                </span>
                                            </ListboxOption>
                                        ))}
                                    </ListboxOptions>
                                </div>
                            </Listbox>
                        </div>

                        <div className="mb-6 bg-white p-4">
                            <h2 className="text-lg font-semibold">Package</h2>
                            <p className="text-gray-500">Shipped by TTShop</p>
                            <div className="flex items-center justify-between mt-2">
                                <select
                                    value={payment.shipping_method || ''}
                                    onChange={(e) => handleShippingMethodChange(e)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                                    <option value="">Chọn phương thức vận chuyển</option>
                                    {shipping_method.length > 0 && shipping_method.map((item) => (
                                        <option key={item.id} value={item.id} price={item.price}>
                                            {item.name} - {item.price} VND
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {carts && carts.map((item) => (
                                <div className="mt-4 flex">
                                    <img src={item.product_image[0] === 'i' ? import.meta.env.VITE_API_BASE_URL + '/' + item.product_image : item.product_image} alt="Product" className="w-24 h-24 mr-4 object-contain" />
                                    <div>
                                        <p className="font-semibold">
                                            {item.name}
                                        </p>
                                        <p>x {item.qty}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <p className="font-semibold">{formatCurrency(item.product.price)}</p>
                                        {/* <p className="text-gray-500 line-through">₫ 190,000</p> */}
                                    </div>
                                </div>))}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1 bg-white p-4 h-fit mt-4">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold">Select Payment Method</h2>
                            <div className="mt-2 flex flex-col text-center">
                                {payment_type && payment_type.map((item) => (
                                    <label key={item.id} className='flex items-start'>
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value={item.value}
                                            onChange={() => setPayment({ ...payment, payment_method_id: item.id })}
                                            checked={payment.payment_method_id === item.id}
                                        />
                                        {item.value}
                                    </label>
                                ))}
                            </div>
                        </div>
                        {/* <div className="mb-6">
                            <h2 className="text-lg font-semibold">Voucher</h2>
                            <div className="mt-2 flex">
                                <input type="text" className="border p-2 rounded w-full" placeholder="Enter Voucher Code" />
                                <button className="bg-blue-500 text-white px-4 py-2 rounded ml-2">APPLY</button>
                            </div>
                        </div> */}

                        <div>
                            <h2 className="text-lg font-semibold">Order Summary</h2>
                            <div className="mt-2">
                                <div className="flex justify-between">
                                    <p>Subtotal ({carts.length} item)</p>
                                    <p>{formatCurrency(subTotal)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>Shipping Fee</p>
                                    <p>{payment.price ? formatCurrency(payment.price) : formatCurrency(shippingPrice)}</p>
                                </div>
                                <div className="flex justify-between font-semibold">
                                    <p>Total</p>
                                    <p>{formatCurrency(totalPrice)}</p>
                                </div>
                            </div>
                            <button
                                onClick={handlePaymentClick}
                                disabled={!payment.payment_method_id}
                                className={`bg-orange-500 text-white w-full py-2 rounded mt-4 ${!payment.payment_method_id ? 'opacity-50 cursor-not-allowed' : ''}`}>PROCEED TO PAYMENT</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderPage;
