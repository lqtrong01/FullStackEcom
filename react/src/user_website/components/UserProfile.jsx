import React, { useEffect, useRef, useState } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';
import axiosClient from '../../axios';

const UserProfile = () => {
  const {currentUser} = useStateContext()
  const scrollToRef =  useRef(null)
  const [profile, setProfile] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const scrollToDiv = () => {
    if (scrollToRef.current) {
      scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  useEffect(()=>{
    axiosClient.get(`/user/${currentUser.id}`)
    .then(({data})=>{
      setProfile(data.data)
    })
    .catch(({err})=>{
      console.error(err.data.response)
    })
    scrollToDiv()
  }, [])
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('User Data:', formData);
  };

  return (
    <>
    <div ref={scrollToRef}></div>
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded">Update</button>
      </form>
    </div>
    </>
  );
};

export default UserProfile;
