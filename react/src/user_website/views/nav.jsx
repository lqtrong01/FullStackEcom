import React, { useEffect, useState } from "react";
import { MdLocalShipping } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { FiLogIn } from "react-icons/fi";
import { CiLogout, CiUser } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { useStateContext } from "../../contexts/ContextProvider";
import axiosClient from "../../axios";
import { HeartIcon, ShoppingCartIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { FcAddressBook, FcShipped } from "react-icons/fc";

const navLink = [
  { to: '/home', name: 'Home' },
  { to: '/shop', name: 'Shop' },
  { to: '/about', name: 'About' },
  { to: '/contact', name: 'Contact' }
]
const navigation = [
  { to: '/home', href: '/home', name: 'Home' },
  { to: '/shop', href: '/shop', name: 'Shop' },
  { to: '/about', href: '/about', name: 'About' },
  { to: '/contact', href: '/contact', name: 'Contact' }
]
const userNavigation = [
  { name: 'Profile', href: '/user/profile', icon: <UserCircleIcon className='h-6 w-6 mr-3' />, id: 1 },
  { name: 'Order', href: '/user/order', icon: <FcShipped className='h-6 w-6 mr-3' />, id: 2 },
  { name: 'Favourite', href: '/user/favourite', icon: <HeartIcon className='h-6 w-6 mr-3 text-pink-600' />, id: 3 },
  { name: 'Book Address', href: '/user/address', icon: <FcAddressBook className='h-6 w-6 mr-3' />, id: 4 },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Nav = ({ search, setSearch, searchproduct, setOpen, open, drawer, setDrawer, logout }) => {
  const { currentUser, setCurrentUser, setUserToken } = useStateContext()
  const [carts, setCart] = useState([])
  const navigate = useNavigate()
  const handleHomePageNav = () => {
    window.location.href = "/home";
  };

  useEffect(() => {
    if (currentUser && currentUser.id) {
      axiosClient.get(`/user/${currentUser.id}`).then(({ data }) => {
        setCart(data.data.shopping_cart.items);
      });
    }
  }, [currentUser]);
    
  return (
    <>
      <div className="min-h-full sticky z-20 top-0 shadow-lg">
        <Disclosure as="nav" style={{ backgroundColor: 'white' }}>
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center w-full justify-between">
                    <div onClick={handleHomePageNav} className="logo flex items-center cursor-pointer">
                      <img src={Logo} className="h-12" alt="logo" />
                      <h3><b>TTShop</b></h3>
                    </div>
                    <div className="lg:flex md:flex sm:flex flex   mr-10 float-left items-center justify-center text-pink-500">
                      <input
                        className="h-[40px] lg:w-60 md:w-40 sm:w-30 w-20 outline-none px-2"
                        type="text"
                        value={search}
                        placeholder="Search"
                        onChange={(e) => setSearch(e.target.value)}
                      ></input>
                      <button
                        className="size-10 bg-blue-500 items-center flex justify-center hover:bg-yellow-500 transition-all duration-300"
                        onClick={() => searchproduct()}
                      >
                        <AiOutlineSearch className="size-6" />
                      </button>
                    </div>
                    <div></div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <button
                        onClick={() => setOpen(true)}
                        type="button"
                        className="relative rounded-full bg-yellow-400 p-1 text-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-red-800"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View Shopping Cart</span>
                        <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                        {carts.length > 0 && (
                        <span className="absolute -top-2 -right-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                          {carts.length}
                        </span>
                      )}
                      </button>
                      <button
                        type="button"
                        className="sr-only hidden relative rounded-full bg-indigo-800 p-1 ml-3 text-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />

                      </button>

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <MenuButton
                            onClick={() => setDrawer(!drawer)}
                            className="relative rounded-full m-1 text-gray-900 hover:bg-indigo-900 bg-green-600 focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <div className="h-8 w-8">
                              {!currentUser.user_image && <img className="size-8 rounded-full " src="https://via.placeholder.com/40" alt="User Avatar" />}
                              {currentUser.user_image && <img className="size-8 rounded-full object-cover" src={currentUser.user_image[0] === 'i' ? import.meta.env.VITE_API_BASE_URL + '/' + currentUser.user_image : currentUser.user_image} alt="User Avatar" />}
                            </div>

                          </MenuButton>
                        </div>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <DisclosureButton className="relative inline-flex items-center justify-center rounded-md bg-indigo-300 p-2 text-gray-900 hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </DisclosureButton>
                  </div>
                </div>
              </div>

              <DisclosurePanel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <Link
                      to={item.to}
                      key={item.name}
                      as="a"
                      // href={item.href}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-900 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium',
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      {!currentUser.user_image && <img className="size-8 rounded-full" src="https://via.placeholder.com/40" alt="User Avatar" />}
                      {currentUser.user_image && <img className="size-8 rounded-full object-cover" src={currentUser.user_image[0] === 'i' ? import.meta.env.VITE_API_BASE_URL + '/' + currentUser.user_image : currentUser.user_image} alt="User Avatar" />}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-black">{currentUser.name}</div>
                      <div className="text-sm font-medium leading-none text-gray-900">{currentUser.email}</div>
                    </div>
                    <button
                      onClick={() => setOpen(true)}
                      type="button"
                      className="relative rounded-full bg-yellow-400 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View Shopping Cart</span>
                      <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                      {carts.length > 0 && (
                        <span className="absolute top-0 right-0 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                          {carts.length}
                        </span>
                      )}
                    </button>

                    {/* <button
                      type="button"
                      className="sr-only hidden relative ml-auto rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button> */}
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        as="a"
                        to={item.href}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </Link>
                    ))}
                    <DisclosureButton
                      onClick={() => logout}
                      key={'logout'}
                      as="a"
                      className="block rounded-md px-3 py-2 text-base cursor-pointer font-medium text-red-700 hover:bg-red-700 hover:text-white"
                    >
                      Logout
                    </DisclosureButton>
                  </div>
                </div>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
        <div className="header hidden md:block">
          <div className="last_header max-h-2xl"><div></div>
            <div className="nav">
              <ul>
                {navLink.map((link, index) => {
                  return (
                    <li key={index}>
                      <Link to={link.to} className="link">{link.name}</Link>
                    </li>
                  );
                })}
              </ul>
            </div><div></div>
          </div>

        </div>

      </div>
    </>
  )
  // return (
  //   <>
  //     <div className="header">
  //       <div className="top_header  ">
  //         <div className="icon">
  //           <MdLocalShipping />
  //         </div>
  //         <div className="info">
  //           <p>Free Shipping When Shopping upto $1000</p>
  //         </div>
  //       </div>
  //       <div className="mid_header ">
  //         <div onClick={handleHomePageNav} className="logo flex items-center cursor-pointer">
  //           <img src={Logo} className="h-12" alt="logo"/>
  //           <h3><b>TTShop</b></h3>
  //         </div>
  //         <div className="flex items-center justify-center text-pink-500">
  //           <input
  //             className="h-[40px] max-w-60 w-full outline-none px-2"
  //             type="text"
  //             value={search}
  //             placeholder="Search"
  //             onChange={(e) => setSearch(e.target.value)}
  //           ></input>
  //           <button
  //             className="size-10 bg-blue-500 items-center flex justify-center hover:bg-yellow-500 transition-all duration-300"
  //             onClick={searchproduct}
  //           >
  //             <AiOutlineSearch className="size-6" />
  //           </button>
  //         </div>

  //         {currentUser ? (

  //           // if user is login then Logout Button will shown and also user profile
  //           <div className="user">
  //             <div className="icon">
  //               <CiLogout />
  //             </div>
  //             <div className="btn">
  //               <button
  //                 onClick={(e) =>
  //                   logout(e)
  //                 }
  //               >
  //                 Logout
  //               </button>
  //             </div>
  //           </div>
  //         ) : (
  //           // if user is not Login then login button will shown
  //           <div className="user flex items-center">
  //             <div className="icon">
  //               <FiLogIn />
  //             </div>
  //             <div className="btn">
  //               <button onClick={() => {}}>Login</button>
  //             </div>
  //           </div>
  //         )}
  //         <div onClick={()=>setOpen(!open)}
  //         className="float-end cursor-pointer bg-yellow-200 flex justify-center items-center border-2 rounded-full border-indigo-500">
  //           <ShoppingCartIcon

  //             className="size-7 ml-3 mt-3 mb-3"/>
  //             <h3 className="mr-3">Cart</h3>
  //         </div>
  //       </div>

  //       <div className="last_header">
  //         <div className="user_profile">
  //           {
  //             // User Profile Will Shown Here
  //             currentUser ? (
  //               <>
  //                 <div className="icon">
  //                   <CiUser />
  //                 </div>
  //                 <div className="info">
  //                   <h2>{currentUser.name??"name"}</h2>
  //                   <p>{currentUser.email??"Email"}</p>
  //                 </div>
  //                 <div className="cursor-pointer">
  //                   <ChevronDownIcon className="size-6"/>
  //                 </div>
  //               </>
  //             ) : (
  //               <div className="flex items-center text-black">
  //                 <div className="icon">
  //                   <CiUser />
  //                 </div>
  //                 <div className="info">
  //                   <p>Please Login</p>
  //                 </div>
  //               </div>
  //             )
  //           }
  //         </div>
  //         <div className="nav">
  //           <ul>
  //             {navLink.map((link, index) => {
  //               return (
  //                 <li key={index}>
  //                   <Link to={link.to} className="link">{link.name}</Link>
  //                 </li>
  //               );
  //             })}
  //           </ul>

  //         </div>
  //         <div className="offer">
  //           <p>flat 10% over all iphone</p>
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );
};

export default Nav;
