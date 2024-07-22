import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom'
import axiosClient from '../../axios';
import { convertTimestampToDate, formatCurrency, useStateContext } from '../../contexts/ContextProvider';
import { FaSpinner } from 'react-icons/fa';
import DialogReview from './actions/DialogReveiw';
const OrderDetail = () => {
  const {id} = useParams()
  const {currentUser, setNotification} = useStateContext()
  const [order, setOrder] = useState({})
  const [items, setItem] = useState([])
  const [loading, setLoading] = useState(null)
  const [totalPrice, setTotalPrice] = useState(0)
  const [show, setShow] = useState(false)
  const [title, setTitle] = useState("")
  const [loadForm, setLoadForm] = useState(false)
  const [product_item_id, setProductItemId] = useState(null)

  useEffect(()=>{
    setLoading(false)
    axiosClient.get(`/order/${id}/show_order`)
    .then(({data})=>{
      setOrder(data.data)
      setItem(data.data.order_lines)
      const total = data.data.order_lines.reduce((sum, item) => sum + (Number(item?.price) * Number(item?.qty)), 0);
      setTotalPrice(total)
      setLoading(true)
    })
  },[loadForm])
  
  const updateOrder = (order,status) => {
    if(window.confirm('Are you sure this action?')){
      axiosClient.put(`/order/${order.id}`,{
        'order_status':status
      }).then(({data})=>{
        setNotification(data.message, true)
        setLoadForm(!loadForm)
      }).catch((err)=>{
        setNotification('Fail to updated Order', false)
      })
    }
  }
  const hanldeWriteReview = (product) => {
    setTitle(product?.name)
    setProductItemId(product.id)
    setShow(true)
  }
  return (
    <>
    <DialogReview title={title} _value={''} show={show} setShow={setShow} loading={loadForm} setLoading={setLoadForm} id={product_item_id}/>
    {!loading && (<div className='w-full justify-center items-center flex flex-col font-bold text-cyan-600'>
      <FaSpinner className='animate-spin size-13'/>
      Waiting...
    </div>)}
    {loading &&
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="border-b pb-4 mb-4">
        <h1 className="text-lg font-semibold">Cửa hàng TTShop</h1>
        <div className="flex justify-between items-center mt-2">
          <div>
            <p className="text-xl font-semibold">{order.id}</p>
            <p className="text-gray-500">Your package has been delivered.</p>
            <p className="text-gray-500">{order.deliveredDate}</p>
          </div>
          {order?.order_status===1 && <button 
            onClick={()=>updateOrder(order,4)}
            className={`flex-1 bg-blue-500 text-white ${order.order_status === 1 ? 'bg-green-400 text-green-800' : order.order_status === 2 ? 'bg-indigo-500 text-indigo-700' : order.order_status === 3 ? 'bg-amber-300 text-amber-700' : order.order_status === 4 ? 'bg-red-500 text-red-700' : ''} px-4 py-2 rounded`}>
              Cancel Order
          </button>}
          {order?.order_status===3 && <button 
            onClick={()=>updateOrder(order,5  )}
            className={`bg-blue-500 text-white ${order.order_status === 1 ? 'bg-green-400 text-green-800' : order.order_status === 2 ? 'bg-indigo-500 text-indigo-700' : order.order_status === 3 ? 'bg-amber-300 text-amber-700' : order.order_status === 4 ? 'bg-red-500 text-red-700' : ''} px-4 py-2 rounded`}>
              Received
          </button>}
          
          {<button 
            className={`bg-blue-500 text-white ${order.order_status === 1 ? 'bg-green-400 text-green-800' : order.order_status === 2 ? 'bg-indigo-500 text-indigo-700' : order.order_status === 3 ? 'bg-amber-300 text-amber-700' : order.order_status === 4 ? 'bg-red-500 text-red-700' : ''} px-4 py-2 rounded`}>
              {order?.order_statuses?.status}
          </button>}
        </div>
      </div>

      {items.length>0 && items.map(item => (
        <div key={item.id} className="border-b pb-4 mb-4">
          <div className="flex">
            <img src={item.product.product_image[0]==='i'?import.meta.env.VITE_API_BASE_URL+'/'+item.product.product_image:item.product.product_image} alt={item.name} className="w-24 h-24 mr-4 object-contain" />
            <div>
              <p className="font-semibold">{item.product.name}</p>
              <p className="text-gray-500">Qty: {item.qty}</p>
            </div>
            <div className="ml-auto gap-x-4">
              <p className="font-semibold">{formatCurrency(item.price.toLocaleString())}</p>
              {order?.order_status===5 && <button 
                onClick={()=>hanldeWriteReview(item.product)}
                className="text-blue-500 mt-2">Write A Review</button>}
            </div>
          </div>
        </div>
      ))}

      <div className="border-b pb-4 mb-4">
        <p className="font-semibold">Order {order.id}</p>
        <p className="text-gray-500">Placed on {order.orderDate}</p>
        <p className="text-gray-500">Shipped on {convertTimestampToDate(order.updated_at)}</p>
        <p className="text-gray-500">Completed on {order.completedDate}</p>
        <p className="text-gray-500">Paid by {order.paymentMethod}</p>
      </div>

      <div className="border-b pb-4 mb-4">
        <p className="font-semibold">{currentUser.name}</p>
        <p className="text-gray-500">{order?.shipping_addresses?.address_line}</p>
        <p className="text-gray-500">{currentUser.phone_number}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Total Summary</h2>
        <div className="mt-2">
          <div className="flex justify-between">
            <p>Subtotal({items.length} items)</p>
            <p>{formatCurrency(totalPrice)}</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping Fee</p>
            <p>{formatCurrency(order?.shipping_methods?.price).toLocaleString()}</p>
          </div>
          <div className="flex justify-between">
            <p>Instant Discount</p>
            <p>0 ₫</p>
          </div>
          <div className="flex justify-between font-semibold">
            <p>Total</p>
            <p>{formatCurrency(order.order_total)}</p>
          </div>
        </div>
      </div>
    </div>}
    </>
  );
};

export default OrderDetail;
