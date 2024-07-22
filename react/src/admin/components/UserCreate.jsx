import React, { useEffect, useState } from "react";
import TButton from "./shared/TButton";
import { IoArrowBackOutline } from "react-icons/io5";
import axiosClient from "../../axios"
import { EyeIcon, EyeSlashIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";

const UserCreate = () => {
    const [country, setCountry] = useState([])
    const [user, setUser] = useState({
        role:'user'
    })
    const [error, setError] = useState({ __html: "" });

    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedState, setSelectedState] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const scrollToTopRef = useRef(null);

    const scrollToTop = () => {
        if (scrollToTopRef.current) {
            scrollToTopRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const filteredStates = country.filter(state =>
        state.country_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    useEffect(() => {
        axiosClient.get('/country')
            .then(({ data }) => {
                setCountry(data.data)
            })
            .catch(({ err }) => {
                console.error(err)
            })
    }, [])
    useEffect(()=>{
        console.log(user)
    },[user])

    const [imageBase64, setImageBase64] = useState('');

    const onImageChoose = (ev) => {
        const file = ev.target.files[0];

        const reader = new FileReader();
        reader.onload = () => {
            setUser({
                ...user,
                user_image:reader.result
            })
            setImageBase64(reader.result);
            ev.target.value = "";
        };
        reader.readAsDataURL(file);
    };


    const onSubmit = async (ev) => {
        ev.preventDefault();
        setError({ __html: "" });
        

        try {
            const { data } = await axiosClient.post('/user', user);
            alert(data.message);
            console.log(data.data);
        } catch (err) {
            let errorMessage = 'An unknown error occurred.';
            if (err.response) {
                if (err.response.status === 500) {
                    errorMessage = 'Internal server error. Please try again later.';
                } else if (err.response.data && err.response.data.errors) {
                    const finalErrors = Object.values(err.response.data.errors).reduce(
                        (accum, next) => [...accum, ...next],
                        []
                    );
                    errorMessage = finalErrors.join('<br>');
                }
            }
            setError({ __html: errorMessage });
            scrollToTop()
            console.error(err);
        }
    }
    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,10}$/.test(value)) { 
          setUser({ ...user, phone_number: value });
        }
      };
    return (
        <div className="min-h-screen bg-gray-100 p-4 font-serif">
            <div ref={scrollToTopRef}></div>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='uppercase font-bold font-sans text-2xl'>Create Customer</h1>
                <TButton color="green" to="/admin/customers">
                    <IoArrowBackOutline className="h-6 w-6 mr-2" />
                    Back
                </TButton>
            </div>
           
            {error.__html && (
                <div
                    className="bg-red-500 rounded py-2 px-3 text-white max-w-4xl mx-auto p-6 shadow-md"
                    dangerouslySetInnerHTML={error}
                ></div>
            )}
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">

                <form onSubmit={(e)=>onSubmit(e)}>
                    <div className="">
                        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-5">
                            <div>
                                <label className="flex text-sm font-medium text-gray-700">Name <p className='text-red-500'>*</p>:</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={user.name??""}
                                    onChange={(e) => setUser({...user, name:e.target.value})}
                                    className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 flex">Email<p className='text-red-500'>*</p>:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={user.email}
                                    onChange={(e) => setUser({...user, email:e.target.value})}
                                    className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contact No</label>
                                <input
                                    type="number"
                                    name="contactNo"
                                    value={user.phone_number??""}
                                    onChange={(e)=>handlePhoneNumberChange(e)}
                                    className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none"
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    name="password"
                                    value={user.password}
                                    onChange={(e) => setUser({...user, password:e.target.value})}
                                    className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center px-3 mt-4 text-gray-600"
                                    onClick={togglePasswordVisibility}
                                >
                                    <div className="w-4 h-4" fill="currentColor">
                                        {passwordVisible ? (
                                            <EyeIcon class="h-6 w-6 text-gray-500" />
                                        ) : (
                                            <EyeSlashIcon class="h-6 w-6 text-gray-500" />
                                        )}
                                    </div>
                                </button>
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                <input
                                    type={confirmPasswordVisible ? "text" : "password"}
                                    name="confirmPassword"
                                    value={user.confirmPassword??""}
                                    onChange={(e) => setUser({...user, confirmPassword:e.target.value})}
                                    className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center px-3 mt-4 text-gray-600"
                                    onClick={toggleConfirmPasswordVisibility}
                                >
                                    <div className="w-4 h-4">
                                        {confirmPasswordVisible ? (
                                            <EyeIcon class="h-6 w-6 text-gray-500" />
                                        ) : (
                                            <EyeSlashIcon class="h-6 w-6 text-gray-500" />
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div className="grid lg:grid-cols-3 md:grid-cols-1 gap-4 mt-4">
                            <div className="relative inline-block w-64">
                                <label className="block text-sm font-medium text-gray-700">Country</label>
                                <div
                                    className="relative border border-gray-300 rounded-md"
                                    
                                >

                                    <input
                                        type="text"
                                        value={selectedState}
                                        placeholder="Country"
                                        className="w-full px-3 py-2 rounded-md focus:outline-none"
                                        onChange={e => {
                                            setSearchTerm(e.target.value);
                                            setSelectedState(e.target.value); 
                                        }}
                                       
                                        onFocus={() => setIsOpen(true)}
                                    />
                                    <button
                                        onClick={()=>setIsOpen(!isOpen)}
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-600"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                                
                                {isOpen && (
                                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md max-h-60 overflow-y-auto">
                                        {filteredStates.length > 0 ? (
                                            filteredStates.map((country, index) => (
                                                <li
                                                    key={index}
                                                    id={country.id}
                                                    className="px-3 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                                                    onClick={(e) => {
                                                        setSelectedState(country.country_name);
                                                        setUser({...user, country_id:e.target.id})
                                                        setIsOpen(false);
                                                    }}
                                                >
                                                    {country.country_name}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="px-3 py-2 text-gray-500">No results found</li>
                                        )}
                                    </ul>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={user.city}
                                    onChange={(e) => setUser({...user, city:e.target.value})}
                                    className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <textarea
                                    name="address"
                                    value={user.address}
                                    onChange={(e) => setUser({...user, address:e.target.value})}
                                    className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none h-32"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Notes</label>
                                <textarea
                                    name="notes"
                                    value={user.note??""}
                                    onChange={(e) => setUser({...user, note:e.target.value})}
                                    className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none"
                                ></textarea>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-gray-700">Image:</label>
                                <div className="flex items-center">
                                    {/* <img src={product ? "https://via.placeholder.com/100" : product.product_image} alt="Product" className="w-24 h-24 object-cover rounded-md mr-4" /> */}
                                    {imageBase64 && (
                                        <img
                                            src={imageBase64}
                                            alt=""
                                            className="w-24 h-24 object-cover rounded-md mr-4"
                                        />
                                    )}
                                    {!imageBase64 && (
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
                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2">
                            Save
                        </button>
                        <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded-lg">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    );
}

export default UserCreate