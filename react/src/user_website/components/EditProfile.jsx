import React, { useState, useRef, useEffect, Profiler } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';
import axiosClient from '../../axios';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { FaSpinner } from 'react-icons/fa';

const phonePrefixes = {
  Viettel: ['086', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039'],
  Mobifone: ['089', '090', '093', '070', '079', '077', '076', '078'],
  Vinaphone: ['088', '091', '094', '083', '084', '085', '081', '082'],
  Vietnamobile: ['092', '056', '058'],
  Gmobile: ['099', '059']
};

const EditProfile = () => {
  const { currentUser, setNotification, setCurrentUser } = useStateContext()
  const scrollToRef = useRef(null)
  const [loading, setLoading] = useState(null)
  const [profile, setProfile] = useState({})
  const [loadForm, setLoadForm] = useState(false)

  const [phone, setPhone] = useState('');
  const [carrier, setCarrier] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    if (phone.length < 9) {
      setCarrier('');
      setError('Số điện thoại phải có ít nhất 9 chữ số sau +84.');
    } else {
      checkCarrier(phone);
    }
  }, [phone]);

  const handleChange = (e) => {
    let value = e.target.value;

    // Loại bỏ các ký tự không phải số
    value = value.replace(/\D/g, '');

    // Giới hạn độ dài tối đa của số điện thoại
    if (value.length > 10) {
      value = value.slice(0, 9);
    }

    setPhone(value);
    setProfile({...profile, phone_number:value})
  };

  const checkCarrier = (phone) => {
    const prefix = phone.slice(0, 3);
    
    let carrierName = '';
    for (const [name, prefixes] of Object.entries(phonePrefixes)) {
      if (prefixes.includes(prefix)) {
        carrierName = name;
        break;
      }
    }
    setCarrier(carrierName);

    // Kiểm tra số điện thoại hợp lệ
    if (phone.length !== 10) {
      setError('Số điện thoại không hợp lệ.');
    } else {
      setError('');
    }
  };

  const scrollToDiv = () => {
    if (scrollToRef.current) {
      scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) {
        return;
      }

      scrollToDiv();
      setLoading(false);

      try {
        const { data } = await axiosClient.get(`/user/${currentUser.id}`);
        setProfile(data.data);
        setLoading(true);
      } catch (err) {
        console.error(err.response);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser, loadForm]);

  const onImageChoose = (ev) => {
    const file = ev.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      setProfile({
        ...profile,
        image: file,
        user_image: reader.result,
      });
      ev.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleSaveChanges = (e) => {
    e.preventDefault()
    if (phone.length !== 10) {
      return alert(error)
    }
    if (window.confirm('Are you update this profile')) {
      axiosClient.put(`/user/${currentUser.id}`, {
        'name': profile.name??"",
        'phone_number': profile.phone_number?profile.phone_number??null:currentUser.phone_number,
        'user_image': profile.user_image?profile.user_image??null:currentUser.user_image,
      })
        .then(({ data }) => {
          setNotification(data.message, true)
          setCurrentUser({
            ...currentUser,
            event:'updateProfile'
          })
          setLoadForm(!loadForm)
          
        })
        .catch((err) => {
          setNotification('Fail to updated Profile', false)
        })
    }
    console.log('Changes saved');
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) { // Chỉ cho phép nhập tối đa 10 chữ số
      setProfile({ ...profile, phone_number: value });
    }
  };

  return (
    <>

      <div ref={scrollToRef}></div>
      {!loading && <div className="w-full flex justify-center items-center flex-col"><FaSpinner className="animate-spin size-12 text-cyan-400" />Waiting...</div>}
      {loading &&
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Full Name */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Full name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            {/* Email Address */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="flex items-center">
                <input
                  type="email"
                  disabled={true}
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full bg-gray-200 text-gray-500 cursor-not-allowed opacity-50"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* Mobile */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Mobile</label>
              <div className="flex flex-col">
                <div className='flex '>
                <span className='relative flex items-center p-2 border-2 border-r-none text-red-500 border-gray-300'>+84</span>
                <input
                  type="text"
                  id="phone"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Số điện thoại"
                  value={profile.phone_number??currentUser.phone_number}
                  onChange={handleChange}
                />
                </div>
              
                {/* {carrier && <p className="mt-2 text-green-600">Nhà mạng: {carrier}</p>} */}
                {/* {error && <p className="mt-2 text-red-600">{error}</p>} */}
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Image:</label>
                <div className="flex items-center">
                  {/* <img src={product ? "https://via.placeholder.com/100" : product.product_image} alt="Product" className="w-24 h-24 object-cover rounded-md mr-4" /> */}
                  {profile.user_image && (
                    <img
                      src={profile.user_image[0] === 'i' ? import.meta.env.VITE_API_BASE_URL + '/' + profile.user_image : profile.user_image}
                      alt=""
                      className="w-24 h-24 object-cover rounded-md mr-4"
                    />
                  )}
                  {!profile.user_image && (
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

          </div>

          {/* Save Changes Button */}
          <div className="mt-6">
            <button
              onClick={(e) => handleSaveChanges(e)}
              className="bg-orange-500 text-white py-2 px-4 rounded-md"
            >
              SAVE CHANGES
            </button>
          </div>
        </div>}
    </>
  );
};

export default EditProfile;
