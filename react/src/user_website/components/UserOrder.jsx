import React, { useEffect } from 'react';
import { useState } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';

import { FaSpinner } from 'react-icons/fa';
import axiosClient from '../../axios';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, CheckIcon } from '@heroicons/react/24/outline';


const OrderList = () => {
  const { currentUser, products, setNotification } = useStateContext()
  const [orders, setOrder] = useState([])
  const [search, setSearch] = useState("")
  const [order_lines, setOrderLine] = useState([])
  const [loading, setLoading] = useState(null)
  const [loadForm, setLoadForm] = useState(false)
  const [filter, setFilter] = useState([])
  const [activeButton, setActiveButton] = useState('All');
  const navigate = useNavigate()

  const handleButtonClick = (status) => {
    setSearch(status==='All'?'':status);
    setActiveButton(status);
  };

  useEffect(() => {
    setLoading(false)
    // setTimeout(() => {
    //   setLoadForm(!loadForm)
    // }, 5000);
    
    axiosClient.get(`/order/${currentUser.id}/web`)
      .then(({ data }) => {
        const sortedOrders = data.data.sort((a, b) => {
          // Sort by descending order of creation time (assuming created_at is a timestamp)
          return new Date(b.created_at) - new Date(a.created_at);
        });
        setOrder(sortedOrders)
        setFilter(sortedOrders)
        setOrderLine(data.data.order_lines)
        setLoading(true);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });

  }, [loadForm])
  
  useEffect(() => {
    if (search === '') {
      setFilter(orders)
    } else {
      setFilter(
        [...orders].filter(item =>
          item.order_status.toString().toLowerCase().includes(search.toLowerCase()) ||
          item.id.toString().toLowerCase().includes(search.toLowerCase()) ||
          item.order_lines.some(orderLine =>
            orderLine.product.name.toLowerCase().includes(search.toLowerCase())
          ) ||
          item.order_statuses.status.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search])

  const updateOrderStatus = (id,status) => {
    if(window.confirm('Are you sure?')){
      axiosClient.put(`/order/${id}`,{
        'order_status':status
      }).then(({data})=>{
        setNotification(data.message, true)
        setLoadForm(!loadForm)
      }).catch((err)=>{
        setNotification('Fail to updated Order', false)
        setLoadForm(!loadForm)
      })
    }
    
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleButtonClick('All')}
          className={`px-4 py-2 rounded ${activeButton === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        <button
          onClick={() => handleButtonClick('Ordered')}
          className={`px-4 py-2 rounded ${activeButton === 'Ordered' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Đã Đặt Hàng
        </button>
        <button
          onClick={() => handleButtonClick('In Transit')}
          className={`px-4 py-2 rounded ${activeButton === 'In Transit' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Đang Giao
        </button>
        <button
          onClick={() => handleButtonClick('Delivered')}
          className={`px-4 py-2 rounded ${activeButton === 'Delivered' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Đã Nhận Hàng
        </button>
        <button
          onClick={() => handleButtonClick('Cancelled')}
          className={`px-4 py-2 rounded ${activeButton === 'Cancelled' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Đã Hủy
        </button>
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by Seller Name, Order ID or Product name"
        className="w-full p-2 mb-4 border rounded"
      />
      <div>
      {!loading && <div className="flex flex-col w-full justify-center items-center text-cyan-500"><FaSpinner className="size-10 animate-spin" /></div>}
        {!filter && <div className="flex flex-col w-full justify-center items-center text-cyan-500">Nope</div>}
        {filter.map((order, index) => (
          <div className="border p-4 rounded-lg mb-4 bg-slate-100">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-semibold">TTShop</h3>
                <p className="text-sm text-gray-600">{order.order_lines[0].product.name}</p>
                <p className="text-sm text-gray-600">{order.order_lines[0].price} ₫</p>
                <p className="text-sm text-gray-600">Qty: {order.order_lines[0].qty}</p>
                <button 
                  onClick={()=>navigate(`/user/order/${order.id}`)}
                  className="mt-2 text-blue-500 underline">Details</button>
              </div>
              <div>
                {order?.order_status===1 && 
                <button
                  onClick={()=>updateOrderStatus(order.id, 4)}
                  className={`ml-4 px-3 py-1 text-sm rounded ${order.order_status === 1 ? 'bg-red-400 text-red-800' : order.order_status === 2 ? 'bg-indigo-500 text-indigo-700' : order.order_status === 3 ? 'bg-amber-300 text-amber-700' : order.order_status === 4 ? 'bg-red-500 text-red-700' : ''}`}>
                  Cancel Order  
                </button>}
                {order?.order_status===3 && 
                  <button 
                    onClick={()=>updateOrderStatus(order.id, 5)}
                    className='px-3 py-1 text-sm rounded bg-yellow-300'>
                    Accept Order
                  </button>
                }
                {<button className={`ml-4 px-3 py-1 text-sm rounded ${order.order_status === 1 ? 'bg-green-400 text-green-800' : order.order_status === 2 ? 'bg-indigo-500 text-indigo-700' : order.order_status === 3 ? 'bg-amber-300 text-amber-700' : order.order_status === 4 ? 'bg-red-500 text-red-700' : order.order_status === 5?'text-slate-100 bg-green-400':''}`}>
                  {order.order_status === 5 && <CheckCircleIcon className={'size-6 text-green-600 flex-1'}/> }
                  {order.order_statuses.status}
                </button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;

