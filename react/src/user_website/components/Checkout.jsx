import React, { useEffect, useState, useRef } from 'react';
import { formatCurrency, useStateContext } from '../../contexts/ContextProvider';
import axiosClient from '../../axios';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import router from '../../router';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const Checkout = () => {
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
  const scrollToTopRef = useRef(null)
  const [memoryPrice, setMemoryPrice] = useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [counter, setCounter] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    scrollToDiv()
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
          const product = products.find(product=>product.id===item.product_item_id)
          if(product){
            return {
              ...item,
              price: product.product_item.price,
              name: product.name,
            }
          }
        });

        setCart(mergedItems);
        const total = mergedItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
        setTotalPrice(total);
        setLoading(true);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
    }
    fetch()
    setTotalPrice(Number(shippingPrice) + Number(totalPrice))
  }, []);
  useEffect(()=>{
    console.log(payment)
    console.log(totalPrice)
  },[payment])
  const handlePaymentClick = async () => {
    if(!payment?.payment_method_id){
      alert('Vui lòng chọn phương thức thanh toán')
    } else if (!payment?.shipping_address){
      alert('Vui lòng chọn địa chỉ trước khi thanh toán')
      if(window.confirm('Bạn muốn tạo địa chỉ mới')){
        navigate('/user/address')
      }
    }
    if(payment.payment_method_id===1 && payment?.shipping_address && payment?.shipping_method){
      const result = await handleTransaction(totalPrice, 'orderId');
    } else if(payment.payment_method_id===2){
      saveData()
      navigate('/home')
    }
  };

  // useEffect(() => {
  //   const handleUnload = (event) => {
  //     event.preventDefault();
  //     setOpenDialog(false); // Đóng dialog khi trang bị đóng
  //     return (event.returnValue = 'Fail this action'); // Legacy for older browsers
  //   };
  
  //   window.addEventListener('beforeunload', handleUnload);
  
  //   return () => {
  //     window.removeEventListener('beforeunload', setOpenDialog(false));
  //   };
  // }, [openDialog]);
  
  const handleTransaction = async (totalPrice) => {
    try {
      console.log(totalPrice)
      const response = await axiosClient.post('/vnpay_payment', {
        amount: totalPrice,
        bank_code: 'VNBANK',
        language: 'vn',
      });
      console.log(response)
      if (response.data.code === '00') {
        const paymentUrl = response.data.data;
        const newWindow = window.open(paymentUrl, '_blank');
  
        if (newWindow) {
          setOpenDialog(true);
  
          // Set onbeforeunload once
          newWindow.onbeforeunload = () => {
            saveData();
            alert('Payment successfully');
            navigate('/home');
          };
  
          // Check if the new window is closed or blocked
          const checkWindowClosed = setInterval(() => {
            if (newWindow.closed) {
              clearInterval(checkWindowClosed);
              setOpenDialog(false);
              console.log('Payment window closed.');
              alert('Payment Failed');
            }
          }, 1000);
  
          // Cleanup interval on unmount
          return () => {
            clearInterval(checkWindowClosed);
            if (newWindow) {
              newWindow.close();
            }
          };
        } else {
          setOpenDialog(false);
          console.error('Failed to open payment tab.');
        }
      } else {
        console.error('Payment failed:', response.data.message);
        alert(`Payment failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error during the payment process', error);
      alert('Error during the payment process. Please try again later.');
    }
  };
  

  const scrollToDiv = () => {
    if (scrollToTopRef.current) {
      scrollToTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // useEffect(() => {
  //   // Giảm counter mỗi giây
  //   const interval = setInterval(() => {
  //     setCounter(prevCounter => prevCounter - 1);
  //   }, 1000);

  //   // Điều hướng sau khi đếm ngược kết thúc
  //   if (counter === 0 && loading === false) {
  //     navigate('/');
  //   }

  //   return () => clearInterval(interval);
  // }, [counter, navigate]);

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

  const handleAddressChange = (e) => {
    const selectedShippingMethodId = e.target.value;
    setPayment({ ...payment, shipping_address: selectedShippingMethodId });
  };

  const saveData = () => {
    const orderLines = carts.map(cart => ({
      id: cart.id,
      product_item_id: cart.product_item_id,
      qty: cart.qty,
      price: cart.price
    }));

    axiosClient.post(`/order`, {
      'user_id': currentUser.id,
      'payment_method_id': payment.payment_method_id,
      'shipping_address': payment.shipping_address ?? address[0].id,
      'shipping_method': payment.shipping_method ?? shipping_method[0].id,
      'order_total': totalPrice,
      'order_status': 1,
      'order_lines': orderLines
    }).then(({ data }) => {
      setNotification(data.message, true);
      setLoadForm(!loadForm);
    }).catch(error => {
      console.error('Error checking out:', error);
      setNotification('Error checking out. Please try again.', false);
    });
  }

  return (
    <>
      <div ref={scrollToTopRef}></div>
      <Dialog open={openDialog} onClose={()=>{}}>
        <DialogTitle>Xác nhận thanh toán</DialogTitle>
        <DialogContent className='flex flex-col justify-center w-full'>
          <FaSpinner className='size-12 text-cyan-500 animate-spin text-center'/>
          Đang xử lý thanh toán...
        </DialogContent>
        <DialogActions>
          {/* Các action cho dialog (nếu cần) */}
        </DialogActions>
      </Dialog>
      {/* {!loading && (<div className='min-h-screen w-full justify-center items-center flex flex-col font-bold text-cyan-600'>
        Vui Lòng quay về trang giỏ hàng và tiến hành Thanh toán
        <div className='mt-4 text-2xl flex'>
          Trở về trang chủ sau <p className='text-red-600'>{' ' + counter + ' '}</p> giây
        </div>
      </div>)} */}
      {loading &&
        <div className='w-full bg-slate-200'>
          <div className=" p-10 border  shadow-lg rounded-lg">
            <div className='w-full flex justify-center mb-5'>
              <h1 className='font-extrabold text-2xl text-cyan-500'>Thanh Toán</h1>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phương thức vận chuyển</label>
              <div className="flex items-center justify-between">
                <select
                  value={payment.shipping_method}
                  onChange={(e) => handleShippingMethodChange(e)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                  {shipping_method.map((item) => (
                    <option key={item.id} value={item.id} price={item.price}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Địa chỉ nhận hàng</label>
              <div className="flex items-center justify-between">
                <select
                  value={payment.shipping_address}
                  onChange={(e) => handleAddressChange(e)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                  {address.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.address_line}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phương thức thanh toán</label>
              <div className='flex flex-col gap-4'>
                {payment_type && payment_type.map((item) => (
                  <label key={item.id}>
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
            <div className="mb-4">
              <h2 className="text-lg font-bold">Thông tin sản phẩm</h2>
              {carts && carts.map((item) => (
                <div className="grid grid-cols-3 items-center justify-between">
                  <div className='flex'>
                    <img className="w-24 h-24 object-contain" src={item.product_image[0] === 'i' ? import.meta.env.VITE_API_BASE_URL + '/' + item.product_image : item.product_image} alt="Product" />
                    <h2 className='text-nowrap'>{item.name}</h2>
                  </div>
                  <span className="text-blue-500 text-center">{formatCurrency(item.price)}</span>
                  <span className='flex justify-end'>x {item.qty}</span>
                </div>
              ))}
            </div>
            {/* <div className="mb-4">
              <img className="w-full h-12" src="https://via.placeholder.com/300x50" alt="Banner" />
            </div> */}
            <div className="flex justify-between text-lg font-bold">
              <span>Tổng tiền:</span>
              <span className="text-blue-500">{formatCurrency(totalPrice)}</span>
            </div>
            <div className="mt-4">
              <button
                onClick={() => handlePaymentClick()}
                className="w-full py-2 bg-blue-500 text-white rounded">Thanh toán</button>
            </div>
          </div>
        </div>}
    </>
  );
}

export default Checkout;
