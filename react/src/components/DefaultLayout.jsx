import { Disclosure, Menu, Transition } from "@headlessui/react";
import Logo from "../assets/react.svg";
import { Navigate, NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../provider/ContextProvider";
import axiosClient from "../axios";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/20/solid";
import React, { Fragment, useEffect, useState } from "react";
import AOS from "aos";
import {
  ArrowDownIcon,
  ChevronDownIcon,
  ShoppingCartIcon,
  Bars3Icon,
  BellIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import DarkMode from "./navbar/DarkMode";
import { MdLocalShipping } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { FiLogIn } from "react-icons/fi";
import { CiLogout, CiUser } from "react-icons/ci";
import Homeproduct from "../user_website/components/home_product";
import { useAuth0 } from "@auth0/auth0-react";
import Footer from "../user_website/views/footer";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DefaultLayout() {
  const { currentUser, userToken, setCurrentUser, setUserToken } =
    useStateContext();

    if (userToken && currentUser.role==='Super Admin') {
      return <Navigate to="/admin" />;
    }
  const logout = (ev) => {
    ev.preventDefault();
    axiosClient.post("/logout").then((res) => {
      setCurrentUser({});
      setUserToken(null);
    });
  };

  // useEffect(() => {
  //   axiosClient.get("/me").then(({ data }) => {
  //     setCurrentUser(data);
  //   });
  // }, []);
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "case-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  useEffect(() => {
    if (open === false) {
      localStorage.setItem("isCart", true);
    } else {
      localStorage.setItem("isCart", false);
    }
  }, [open]);

  const navigate = [
    { id: 1, name: "Home", to: "/" },
    { id: 2, name: "Shop", to: "/shop" },
    { id: 3, name: "Cart", to: "/cart" },
    { id: 4, name: "About", to: "/about" },
    { id: 5, name: "Contact", to: "/contact" },
  ];

  const userNavigation = [
    { id: 1, name: "Profile", to: "/profile" },
    { id: 2, name: "Settings", to: "/settings" },
    { id: 3, name: "Sign Out", to: "/signout" },
  ];

  const [cart, setCart] = useState([]);
  //Shop Page product
  const [shop, setShop] = useState(Homeproduct);
  //Shop Search Filter
  const [search, setSearch] = useState("");
  //Shop category filter
  const Filter = (x) => {
    const catefilter = Homeproduct.filter((product) => {
      return product.cat === x;
    });
    setShop(catefilter);
  };
  const allcatefilter = () => {
    setShop(Homeproduct);
  };
  //Shop Search Filter
  const searchlength = (search || []).length === 0;
  const searchproduct = () => {
    if (searchlength) {
      alert("Please Search Something !");
      setShop(Homeproduct);
    } else {
      const searchfilter = Homeproduct.filter((x) => {
        return x.cat === search;
      });

      setShop(searchfilter);
      console.log(searchfilter);
      // router.navigate('/shop')
    }
  };
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();
  //Add To cart
  const addtocart = (product) => {
    const exist = cart.find((x) => {
      return x.id === product.id;
    });
    if (exist) {
      alert("This product is alleardy added in cart");
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
      alert("Added To cart");
    }
  };
  console.log(cart);
  const handleHomePageNav = () => {
    window.location.href = "/";
  };

  return (
    <>
      <div className="z-20 min-h-full sticky top-0 shadow-sm bg-gray-100 dark:bg-gray-800 dark:text-white text-black">
        <Disclosure as="nav" className="">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center p-2">
                  <div className="flex items-center text-lg">
                    <MdLocalShipping />
                    <p className="ml-1">
                      Free Shipping When Shopping up to $1000
                    </p>
                  </div>
                </div>
                <div className="flex h-20 items-center">
                  <div className="flex items-center w-full justify-start">
                    <div
                      onClick={handleHomePageNav}
                      className="flex-shrink-0 flex-row flex items-center justify-around hover:cursor-pointer space-x-2"
                    >
                      <img src={Logo} alt="Company Logo" className="h-8" />
                      <h1>IDK</h1>
                    </div>

                    <div className="flex space-x-4 w-full justify-around ml-20">
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={search}
                          placeholder="Search"
                          onChange={(e) => setSearch(e.target.value)}
                          className="p-2 rounded-l dark:bg-white dark:text-black outline-none w-64"
                        />
                        <button
                          onClick={searchproduct}
                          className="h-10 w-10 p-2 bg-blue-500 text-white rounded-r hover:bg-yellow-400 transition"
                        >
                          <AiOutlineSearch />
                        </button>
                      </div>
                      <div className=" flex items-center justify-center">
                        {isAuthenticated ? (
                          <div className="flex items-center">
                            <CiLogout className="text-xl mr-3" />
                            <button
                              onClick={() =>
                                logout({
                                  logoutParams: {
                                    returnTo: window.location.origin,
                                  },
                                })
                              }
                              className="text-lg"
                            >
                              Logout
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <FiLogIn className="text-xl mr-3" />
                            <button
                              onClick={loginWithRedirect}
                              className="text-lg"
                            >
                              Login
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* <div className="flex items-center">
                      {isAuthenticated ? (
                        <>
                          <CiUser className="text-2xl p-2 bg-white text-blue-500 rounded" />
                          <div className="ml-3">
                            <h2 className="text-lg">{user.name}</h2>
                            <p className="text-sm text-gray-300">
                              {user.email}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <CiUser className="text-2xl p-2 bg-white text-blue-500 rounded" />
                          <div className="ml-3">
                            <p>Please Login</p>
                          </div>
                        </>
                      )}
                    </div> */}
                  </div>

                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-blue-800 p-2 text-gray-400 hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                  {navigate.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? "bg-blue-900 text-white"
                            : "dark:text-white text-gray-800 hover:bg-blue-700 hover:text-white",
                          "block px-3 py-2 rounded-md text-base font-medium"
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
                <div className="border-t border-gray-700 pt-4 pb-3">
                  <div className="absolute right-0">
                    <DarkMode />
                  </div>
                  <div className="flex items-center px-5">
                    <div className="flex items-center">
                      {isAuthenticated ? (
                        <>
                          <CiUser className="text-2xl p-2 bg-white text-blue-500 rounded" />
                          <div className="ml-3">
                            <div className="text-base font-medium leading-none text-white">
                              {currentUser.name}
                            </div>
                            <div className="text-sm font-medium leading-none text-gray-400">
                              {currentUser.email}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <CiUser className="h-8 w-auto text-2xl p-2 dark:bg-white bg-gray-800/90 dark:text-blue-500 text-white rounded" />
                          <div className="ml-3">
                            <p>Please Login</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item, index) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        to={item.to}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 dark:text-white hover:bg-blue-700 hover:cursor-pointer hover:text-white"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        {/* <div className="dark:bg-gray-800 dark:text-white text-black md:hidden">
          <div className="flex justify-center items-center h-auto">
            <div className="flex justify-between items-center gap-4 p-3">
              <nav className="flex items-center justify-between gap-4">
                {navigate.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={({ isActive }) =>
                      classNames(
                        isActive
                          ? "bg-blue-900 text-white"
                          : "dark:text-white text-gray-800 hover:bg-blue-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium"
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </nav>
              <div
                onClick={() => setModalOpen(true)}
                className="bg-yellow-400 p-2 rounded cursor-pointer"
              >
                <p className="uppercase text-gray-900 font-semibold">
                  flat 10% off on all iPhones
                </p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      {/* <Outlet /> */}
      <Footer />
    </>
  );
}
