import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../components/shared/Header";
import axiosClient from "../../axios";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import PaginationLinks from "../components/PaginationLinks";
import { useNavigate } from "react-router-dom";
import { convertTimestampToDate, formatCurrency, useStateContext } from "../../contexts/ContextProvider";

const Order = () => {
  const {setNotification} = useStateContext()
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const navigate = useNavigate()
  const [isLoading, setLoading] = useState(false);
  const [shopOrder, setShopOrder] = useState([]);
  const [filterData, setFilterData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(6)
  const [activeButton, setActiveButton] = useState('All');
  const [currentPosts, setCurrentPost] = useState([])
  const [loadForm, setLoadForm] = useState(false)

  const handleButtonClick = (status) => {
    setActiveButton(status);
    setSearch(status);
    setCurrentPage(1);
  };

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get("/order/admin")
      .then(({ data }) => {
        const sortedOrders = data.data.sort((a, b) => {
          // Sort by descending order of creation time (assuming created_at is a timestamp)
          return new Date(b.created_at) - new Date(a.created_at);
        });
        setShopOrder(sortedOrders);
        setFilterData(sortedOrders)
        setLoading(false);
      })
      .catch(({ err }) => {
        console.log(err);
        setLoading(true);
      });
  }, [loadForm]);

  

  const heads = [
    'Customer',
    'Created Date',
    'Updated Date',
    'Amount',
    'Status',
    'Action'
  ]

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;

  useEffect(() => {
    if(search==='All'){
      setFilterData(shopOrder)
    }
    const filteredData = shopOrder.filter(item => {
      if (search !== '' && search !=='All') {
        return item.order_statuses.status.toString().toLowerCase().includes(search.toString().toLowerCase()) ||
               item.id.toString().toLowerCase().includes(search.toString().toLowerCase());
      } 
      return true;
    });

    setFilterData(filteredData);
  }, [search, activeButton, shopOrder]);

  useEffect(() => {
    setCurrentPost(filterData.slice(firstPostIndex, lastPostIndex));
  }, [filterData, firstPostIndex, lastPostIndex]);

  const updateOrderStatus = (id, status) => {
    axiosClient.put(`/order/${id}`,{
      'order_status':status
    }).then(({data})=>{
      setNotification(data.message, true)
      setLoadForm(!loadForm)
    }).catch((err)=>{
      setNotification('Fail to updated Order', false)
    })
  }
  
  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className="w-full max-w-sm px-4 py-2 border rounded-lg focus:outline-none"
            />
          </div>
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
          onClick={() => handleButtonClick('Accept Order')}
          className={`px-4 py-2 rounded ${activeButton === 'Accept Order' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
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
          <table className="min-w-full bg-white border table-fixed">
            <thead className="bg-gray-200">
              <tr>
                {heads.map((item, index) => (
                  <th key={index} className="px-4 py-2 text-left">{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-300 shadow-sm' : 'bg-white shadow-sm'}>
                  <td className="px-4 py-2 border">
                    <img
                      src={!row? `https://via.placeholder.com/50?text=${row.user_id && row.user_id.name[0]}`:`${row.user_id && import.meta.env.VITE_API_BASE_URL+'/'+row.user_id.user_image}`}
                      alt={row.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div onClick={()=>navigate(`/admin/customer/${row.user_id.id}/profile`)} className="font-semibold text-blue-600 cursor-pointer">{row.user_id && row.user_id.name}</div>
                      <div onClick={()=>navigate(`/admin/customer/${row.user_id.id}/profile`)} className="text-sm text-gray-600 cursor-pointer">{row.user_id && row.user_id.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2 border">{convertTimestampToDate(row.created_at)}</td>
                  <td className="px-4 py-2 border">{convertTimestampToDate(row.updated_at)}</td>
                  <td className="px-4 py-2 border">{formatCurrency(row.order_total)}</td>
                  <td className="px-4 py-2 border">
                    <span className={`text-nowrap ${row.order_status===1?'bg-green-400 text-green-800':row.order_status===2?'bg-indigo-500 text-indigo-700':row.order_status===3?'bg-amber-300 text-amber-700':row.order_status===4?'bg-red-500 text-red-700':row.order_status===5?'bg-green-500 text-white':''} rounded-md px-2 py-1`}>
                      {row.order_statuses && row.order_statuses.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">
                    {row.order_status===1 && <button
                      onClick={() => updateOrderStatus(row.id, 2)}
                      className="mr-2 text-blue-500 bg-blue-300 rounded-md mb-2">
                      {/* <PencilSquareIcon className='w-6 h-6 text-blue-700' /> */}
                      Accept
                    </button>}
                    {row.order_status===2 && <button
                      onClick={() => updateOrderStatus(row.id, 3)}
                      className="text-yellow-700 bg-yellow-500 rounded-md mr-3 mb-2">
                      {/* <PencilSquareIcon className='w-6 h-6 text-blue-700' /> */}
                      Accept Order
                    </button>}
                    <button
                      className="text-red-500 bg-red-300 rounded-md"
                      onClick={() => { }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="block">
          {filterData.length > 0 && <PaginationLinks totalPosts={filterData.length} setPostsPerPage={setPostsPerPage} postsPerPage={postsPerPage} setCurrentPage={setCurrentPage}/>}
          </div>
      </div>
    </>
  );
};

export default Order;
