import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TButton from './shared/TButton';
import { IoArrowBackOutline } from 'react-icons/io5';
import { useEffect } from 'react';
import axiosClient from '../../axios';
import Spinner from '../../assets/Spinner.png';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { useStateContext } from '../../contexts/ContextProvider';


const UserEdit = () => {
  const {setNotification} = useStateContext()
  const [formData, setFormData] = useState([]);
  const [address, setAddress] = useState([])
  const { id } = useParams()
  const [loading, setLoading] = useState(null)
  const [loadForm, setLoadForm] = useState(false)
  const handleChange = (e) => {
    const { name, value } = e.target;

  };
  const [imageBase64, setImageBase64] = useState("")
  const onImageChoose = (ev) => {
    const file = ev.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      setFormData({
        ...formData,
        image: file,
        user_image: reader.result,
      });
      ev.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    setLoading(false)
    axiosClient.get(`/user/${id}`)
      .then(({ data }) => {
        setFormData(data.data)
        setAddress(data.data.addresses)
        setLoading(true)
      })
      .catch(({ err }) => {
        console.error(err)
        setLoading(false)
      })
  }, [loadForm])

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) { // Chỉ cho phép nhập tối đa 10 chữ số
      setFormData({ ...formData, phone_number: value });
    }
  };
  const onSubmit = (e) => {
    e.preventDefault()
    if (window.confirm('Are you update this profile')) {
      axiosClient.put(`/user/${id}`, {
        'name': formData.name,
        'phone_number': formData.phone_number,
        'user_image': formData.user_image ?? null
      })
      .then(({ data }) => {
        setNotification(data.message, true)
        setLoadForm(!loadForm)
      })
      .catch((err) => {
        setNotification('Fail to updated Profile', false)
      })
    }
    console.log('Changes saved');
  }
  return (<>
    {!loading && <div className="w-full flex justify-center items-center"><img src={Spinner} className="animate-spin size-20" /></div>}
    {loading &&
      <div className="min-h-screen bg-gray-100 p-4">
        <div className='flex justify-between items-center mb-4'>
          <h1 className='uppercase font-bold font-sans text-2xl'>Edit Customer</h1>
          <TButton color="green" to="/admin/customers">
            <IoArrowBackOutline className="h-6 w-6 mr-2" />
            Back
          </TButton>
        </div>
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="flex text-sm font-medium text-gray-700">Name <p className='text-red-500'>*</p>:</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex">Email<p className='text-red-500'>*</p>:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full bg-gray-200 text-gray-500 cursor-not-allowed opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="number"
                  maxLength={10}
                  name="contactNo"
                  value={formData.phone_number}
                  onChange={(e) => handlePhoneNumberChange(e)}
                  className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none"
                />
              </div>
              {/*<div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none"
                >
                  <option>Việt Nam</option>
                  Add more options as needed 
                </select>
              </div>*/}
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <select name="" id="" value={address.id}>
                  {address && address.map((item) => (
                    <option key={item.id}>{item.address_line}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none"
                ></textarea>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Image:</label>
                <div className="flex items-center">
                  {/* <img src={product ? "https://via.placeholder.com/100" : product.product_image} alt="Product" className="w-24 h-24 object-cover rounded-md mr-4" /> */}
                  {formData.user_image && (
                    <img
                      src={import.meta.env.VITE_API_BASE_URL + '/' +formData.user_image}
                      alt=""
                      className="w-24 h-24 object-cover rounded-md mr-4"
                    />
                  )}
                  {!formData.user_image && (
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
            </div>
            <div className="mt-6 flex justify-end">
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2">
                Save
              </button>
              <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded-lg">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>}
  </>
  );
};

export default UserEdit;
