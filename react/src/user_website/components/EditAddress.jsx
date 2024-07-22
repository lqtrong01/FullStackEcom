import React, { useEffect, useState } from 'react';
import axiosClient from '../../axios';
import { useStateContext } from '../../contexts/ContextProvider';
import DialogAddress from './actions/DialogAddress';
import { FaSpinner } from 'react-icons/fa';

const AddressBook = () => {
    const [addresses, setAddress] = useState([])
    const [show, setShow] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const {currentUser} = useStateContext()
    const [edit, setEdit] = useState({})
    const [loading, setLoading] = useState(null)
    const [id, setId] = useState(null)
    const [loadForm, setLoadForm] = useState(null)
    useEffect(()=>{
        setLoading(false)
        axiosClient.get(`/user/${currentUser.id}`)
        .then(({data})=>{
            setAddress(data.data.addresses)
            setLoading(true)
        })
        .catch((err)=>{
            setLoading(false)
        })
    },[loadForm, currentUser])

    const setEditAddress = (address) => {
        setShow(true)
        setId(address.id)
        setEdit(address.address_line)        
    }
    
    return (
        <>
        <DialogAddress title="Edit Address" show={show} setShow={setShow} _value={edit} setValue={setEdit} setLoading={setLoadForm} loading={loadForm} id={id}/>
        <DialogAddress title="Add Address" show={showAdd} setShow={setShowAdd} setLoading={setLoadForm}/>
        <div className="w-full p-3 bg-white shadow-md rounded-lg">
            <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold">Address Book</h2>
            </div>

            <table className="min-w-full bg-white p-4 table-fixed">
                <thead className='bg-gray-400 text-gray-700'>
                    <tr>
                        <th className="py-2 px-2 text-left border-r-2 border-white">Address Shipping</th>
                        <th className="py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {addresses.map((address, index) => (
                        <tr key={index} className="border-t">
                            <td className="py-2 px-2 flex items-center border-r-2 border-gray-900">
                                <span className="bg-orange-500 text-white rounded-full px-2 py-1 text-xs mr-2">{address.label}</span>
                                {address.address_line}
                            </td>
                            <td className="py-2 px-2 text-center">
                                <span onClick={()=>setEditAddress(address)} className="text-blue-500 hover:underline cursor-pointer">Edit</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {!loading && <div className='w-full flex justify-center items-center'><FaSpinner className='animate-spin size-10 text-cyan-600'/></div>}
            {addresses.length===0 && <div className='w-full justify-center text-center'>No Address please add address below</div>}
            

            <div className="mt-4 flex justify-end">
                <button
                    onClick={()=>setShowAdd(true)} 
                    className="bg-blue-500 text-white py-2 px-4 rounded-md">+ ADD NEW ADDRESS</button>
            </div>
        </div>
        </>
    );
};

export default AddressBook;

