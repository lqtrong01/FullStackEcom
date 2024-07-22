import React, { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { XMarkIcon, UserCircleIcon, WalletIcon, HeartIcon, TruckIcon, Cog6ToothIcon  } from '@heroicons/react/24/outline'
import { IoMdClose } from 'react-icons/io';
import { FaSignOutAlt } from 'react-icons/fa';
import classNames from 'classnames';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';
import { FcAddressBook, FcShipped } from 'react-icons/fc';


const userNavigation = [
    { name: 'Profile', path: '/user/profile', icon: <UserCircleIcon className='h-6 w-6 mr-3'/>, id: 1 },
    { name: 'Order', path: '/user/order', icon: <FcShipped className='h-6 w-6 mr-3'/>, id: 2 },
    { name: 'Favourite', path: '/user/favourite', icon: <HeartIcon className='h-6 w-6 mr-3 text-pink-600'/>, id: 3 },
    { name: 'Book Address', path: '/user/address', icon: <FcAddressBook className='h-6 w-6 mr-3'/>, id: 4 },
]

const linkClass = 'flex items-center gap-2 text-cyan-600 px-3 py-2 hover:bg-blue-700 hover:no-underline w-full text-base';

export default function Drawer({ open, setOpen, logout}) {
    const {currentUser} = useStateContext()

    return (
        <Dialog className="relative z-40" open={open} onClose={setOpen}>
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
            />

            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <DialogPanel
                            transition
                            className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
                        >
                            <TransitionChild>
                                <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:-ml-10 sm:pr-4">
                                    <button
                                        type="button"
                                        className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                        onClick={() => setOpen(false)}
                                    >
                                        <span className="absolute -inset-2.5" />
                                        <span className="sr-only">Close panel</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                            </TransitionChild>
                            <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                <div className="px-4 sm:px-6">
                                    <DialogTitle className="text-base font-semibold leading-6 text-gray-900">Panel title</DialogTitle>
                                </div>
                                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                    <div className={`fixed top-0 z-50 left-0 h-full w-full bg-white shadow-xl transition-transform transform ${open ? 'translate-x-0' : '-translate-x-full'}`}>
                                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                                                {/* Avatar user */}
                                            <div className="flex items-center">
                                                {!currentUser.user_image && <img className="w-10 h-10 rounded-full mr-2" src="https://via.placeholder.com/40" alt="User Avatar" />}
                                                {currentUser.user_image && <img className="w-10 h-10 rounded-full mr-2 object-cover" src={import.meta.env.VITE_API_BASE_URL+'/'+currentUser.user_image} alt="User Avatar" />}
                                                <div>
                                                    <h2 className="text-lg font-semibold">{currentUser.name}</h2>
                                                    <p className="text-sm text-gray-600">{currentUser.email}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => setOpen(!open)} className="text-gray-600 hover:text-gray-800">
                                                <IoMdClose size={24} />
                                            </button>
                                        </div>
                                        <nav className="p-4">
                                            <ul>
                                            {userNavigation.map((item) => (
                                                <li>
                                                    <SidebarLink key={item.id} link={item} setOpen={setOpen} />
                                                </li>
                                            ))}
                                            </ul>
                                            
                                            <div className='absolute bottom-2 cursor-pointer right-0 p-1 w-full flex justify-center items-center border border-red-400 rounded-full bg-red-400 text-gray-700 hover:text-white'>
                                                <button onClick={()=>logout()} className="flex items-center -mx-2">
                                                    <FaSignOutAlt className="mr-3" />
                                                    Logout
                                                </button>
                                            </div>

                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

function SidebarLink({ link, setOpen}) {
    const { pathname } = useLocation();

    return (
        <Link
            to={link.path}
            onClick={()=>setOpen(false)}
            className={classNames(
                pathname === link.path ? 'border-2 rounded-full text-cyan-600 border-cyan-700' : 'text-neutral-900',
                linkClass
            )}
        >
            {link.icon}
            {link.name}
        </Link>
    );
}