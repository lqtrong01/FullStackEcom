import React, { useEffect, useState } from 'react';
import axiosClient from '../../axios';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../assets/Spinner.png';

const ClientDetails = () => {
    const [customer, setCustomer] = useState([])
    const [loading, setLoading] = useState(true)
    const [address, setAddress] = useState([])
    const id = useParams();
    const navigate = useNavigate()
    
    useEffect(() => {
        setLoading(false)
        axiosClient.get(`/user/${id.id}`)
            .then(({ data }) => {
                setCustomer(data.data)
                setAddress(data.data.addresses)
                setLoading(true)
            })
            .catch(({ err }) => {
                setLoading(false)
            })
    }, [])

    const convertTimestampToDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        return formattedDate;
    };
    const handleNavigate = (id) => {
        navigate(`/admin/customer/${id}/edit`)
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {!loading && <div className='flex w-full justify-center flex-col items-center'><img src={Spinner} className='animate-spin size-14' />Waitting...</div>}
            {loading && <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6 flex items-center">
                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                        <img
                            src={import.meta.env.VITE_API_BASE_URL + '/' +customer.user_image}
                            className='object-cover size-16 rounded-full'
                        />
                    </div>
                    <div className="ml-4">
                        <h2 className="text-xl font-semibold text-gray-800">{customer.name}</h2>
                        <p className="text-gray-600">{customer.email}</p>
                    </div>
                    <button
                        onClick={() => handleNavigate(customer.id)}
                        className="ml-auto bg-blue-500 text-white py-2 px-4 rounded">Edit</button>
                    <button 
                        onClick={()=>navigate('/admin/customers')}
                        className="ml-2 bg-gray-200 text-gray-700 py-2 px-4 rounded">Back</button>
                </div>

                <div className="border-t border-gray-200">
                    <nav className="flex">
                        <a href="#" className="py-4 px-6 block text-blue-500 border-b-2 border-blue-500 font-medium">
                            Overview
                        </a>
                        <a href="#" className="py-4 px-6 block text-gray-600 hover:text-gray-800">
                            Invoices
                        </a>
                        <a href="#" className="py-4 px-6 block text-gray-600 hover:text-gray-800">
                            Quotes
                        </a>
                    </nav>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600"><strong>Full Name:</strong>{customer.name ?? ""}</p>
                            <p className="text-gray-600"><strong>Contact Number:</strong>{customer.phone_number ?? ""}</p>
                            <p className="text-gray-600"><strong>State:</strong> Uttar Pradesh</p>
                            <label className="block text-base font-bold text-gray-700">Address:<span className="text-red-500">*</span></label>
                            <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                                {address && address.map((item)=>(<option value={item.id??""}>{item.address_line}</option>))}

                                {/* <option value="1">Category 1</option>
                                <option value="2">Category 2</option>
                                <option value="3">Category 3</option> */}
                            </select>
                        </div>
                        <div>
                            <p className="text-gray-600"><strong>Email:</strong>{customer.email ?? ""}</p>
                            <p className="text-gray-600"><strong>Country:</strong> {address && address.length > 0 && address[0].country_id ? address[0].country_id : 'Unknown'}</p>
                            <p className="text-gray-600"><strong>City:</strong>{address && address.length > 0 && address[0].city ? address[0].city : 'Unknown'}</p>
                            <p className="text-gray-600"><strong>Note:</strong> N/A</p>
                            <p className="text-gray-600"><strong>GSTIN:</strong> N/A</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-gray-600"><strong>Created:</strong> {convertTimestampToDate(customer.created_at) ?? ""}</p>
                        <p className="text-gray-600"><strong>Updated:</strong> {convertTimestampToDate(customer.updated_at) ?? ""}</p>
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default ClientDetails;
