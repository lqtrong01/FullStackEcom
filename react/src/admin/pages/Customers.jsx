import React, { useEffect, useState } from 'react';
import axiosClient from '../../axios';
import { PencilSquareIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import PageComponent from '../components/PageComponent';
import TButton from '../components/shared/TButton';
import Spinner from '../../assets/Spinner.png'
import PaginationLinks from '../components/PaginationLinks';

const heads = [
  { name: "Customer", id: 1 },
  { name: "Invoice", id: 2 },
  { name: "Action", id: 3 },
]

const Customer = () => {
  const [customers, setCustomer] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterData, setFilterData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(10)
  const navigate = useNavigate()
  useEffect(() => {
    setLoading(false)
    axiosClient.get('/user')
      .then(({ data }) => {
        setCustomer(data.data)
        setFilterData(data.data)
        setLoading(true)
      })
      .catch(({ err }) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const handleNavigate = (id) => {
    navigate(`/admin/customer/${id}/edit`)
  }

  useEffect(() => {
    if (search === '') {
      setFilterData(customers)
    } else {
      setFilterData(
        [...customers].filter(item =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.id.toString().toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search])

  const lastPostIndex = currentPage * postsPerPage
  const firstPostIndex = lastPostIndex - postsPerPage
  const currentPosts = filterData.slice(firstPostIndex, lastPostIndex)

  return (
    <PageComponent
      title={'Customer'}
      search={
        <input
          type="text"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          placeholder="Search"
          className="w-full max-w-sm px-4 py-2 border rounded-lg focus:outline-none"
        />
      }
      buttons={
        <TButton color="green" to='/admin/customer/create'>
          <PlusCircleIcon className="size-6 mr-2" />
          Create New
        </TButton>
      }
    >
      {!loading && <div className="w-full flex justify-center items-center"><img src={Spinner} className="animate-spin size-20" /></div>}
      {loading &&
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
          </div>
          <table className="min-w-full table-fixed">
            <thead className=''>
              <tr className="bg-gray-200">
                {heads.map((item) => (
                  <th scope="col" key={item.id} className='px-2 py-2'>
                    <div className="flex " >
                      <span>{item.name}</span>
                      <span className="relative flex items-center">
                        <svg className="ml-1 w-4 h-4" href="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9">

                          </path>
                        </svg>
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((customer) => (
                <tr key={customer.id} className="border-t">
                  <td className="px-4 py-2 flex items-center">
                    <img
                      src={!customer? `https://via.placeholder.com/50?text=${customer.name[0]}`:`${customer && import.meta.env.VITE_API_BASE_URL+'/'+customer.user_image}`}
                      alt={customer.name}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-blue-600"><Link to={`/admin/customer/${customer.id}/profile`}>{customer.name}</Link></div>
                      <div className="text-sm text-gray-600">{customer.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2">{customer.id}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleNavigate(customer.id)}
                      className="mr-2 text-blue-500">
                      <PencilSquareIcon className='size-6 text-blue-700' />
                    </button>
                    <button
                      onClick={() => { }}
                      className="text-red-500" on>
                      <TrashIcon className='size-6 text-red-700' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filterData.length > 0 && <PaginationLinks totalPosts={filterData.length} setPostsPerPage={setPostsPerPage} postsPerPage={postsPerPage} setCurrentPage={setCurrentPage}/>}
      </div>}
    </PageComponent>
  );
};

export default Customer;
