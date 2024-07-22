import React, { useEffect, useState } from 'react'
import Nav from './views/nav'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import Footer from './views/footer'
import { useStateContext } from '../contexts/ContextProvider'
import Carts from './views/Carts'
import axiosClient from '../axios'
import Drawer from './components/Drawer'
import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline'
const App = () => {
  const navigate = useNavigate()
  const { products, userToken, setUserToken, currentUser, notification, setNotification, setCurrentUser } = useStateContext()
  const [homeProduct, setHomeProduct] = useState([])
  const [open, setOpen] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filterData, setFilterData] = useState([])
  const [buyNow, setBuyNow] = useState([])
  const [itemCount, setItemCount] = useState(0)
  // Add To cart
  const [cart, setCart] = useState([])
  //Shop Page product
  const [shop, setShop] = useState([])
  //Shop Search Filter
  const [search, setSearch] = useState('')


  if (!userToken) {
    return <Navigate to="/login" />;
  }

  if (userToken && currentUser.role === 'Super Admin') {
    return <Navigate to={'/admin'} />
  }

  const logout = () => {
    if(window.confirm('Are you sure to logout?'))
    {
      axiosClient.post("/logout").then((res) => {
        setCurrentUser({});
        setUserToken(null);
        alert('Logout successfully')
        setTimeout(() => {
          navigate('/login')  
        }, 3000);
      });
    }
  };

  //Shop category filter
  const Filter = (x) => {
    if (x === '') {
      setFilterData(homeProduct)
    } else {
      setFilterData(
        [...homeProduct].filter(item =>
          item.category.category_name.toLowerCase().includes(x.toLowerCase())
        )
      );
      setShop(filterData ?? [])
    }
  }

  const allcatefilter = () => {
    setShop(products)
  }

  //Shop Search Filter
  const searchlength = (search || []).length === 0
  const searchproduct = () => {
    if (searchlength) {
      alert("Please Search Something !")
      setShop(products)
    }
    else {

      const searchfilter = [...products].filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toString().toLowerCase().includes(search.toLowerCase()) ||
        item.type.toLowerCase().includes(search.toLowerCase()) ||
        item.category.category_name.toLowerCase().includes(search.toLowerCase())
      )
      setShop([])
      setShop(searchfilter)
      navigate('/shop')
    }
  }

  const formatCurrency = (money) => {
    let config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9 }
    return new Intl.NumberFormat('vi-VN', config).format(money);
  }

  const addfavourite = (product) => {
    axiosClient.put(`/user/favourite/${currentUser.id}`, {
      'user_id': currentUser.id,
      'product_id': product.id,
    })
      .then(({ data }) => {
        setNotification(data.message, true)
      }).catch((err) => {
        setNotification('Fail to action Favourite', false)
      })
  }
  //Add To cart
  const addtocart = async (product) => {
    // Check if the product is already in the cart
    const exist = cart.find((item) => item.product_item.id === product.product_item.id);

    if (exist) {
      setNotification("This product is already added in the cart", false);
    } else {
      // Check if there is enough stock
      if (product.product_item.qty_in_stock > 0) {
        try {
          // Send the request to the backend to add/update the cart item
          const response = await axiosClient.post('/shopping_cart/user', {
            cart_id: currentUser.id,
            product_item_id: product.id,
            qty: 1,
            product_image: product.product_image
          });

          // Update the cart state
          setCart([...cart, { ...product, qty: 1 }]);
          setCurrentUser({
            ...currentUser,
            event: 'addtocart'
          });
          setNotification("Added to cart", true);
        } catch (error) {
          console.error("Error adding to cart:", error);
          alert("Error adding to cart. Please try again.");
        }
      } else {
        alert("This product is out of stock");
      }
    }
  };


  return (
    <>
      {currentUser.role !== 'Super Admin' && <div>
        {notification.message.length > 0 && (
          <div className={`fixed z-50 left-4 top-4 ${notification.show ? 'bg-green-500' : 'bg-red-500'} flex text-white p-4 rounded-lg shadow-lg`}>
            {notification.show ? <CheckBadgeIcon className='size-5' /> : <XCircleIcon className='size-5' />}
            {notification.message}
          </div>
        )}
        {loading && <>
          <Nav search={search} setSearch={setSearch} searchproduct={searchproduct} open={open} setOpen={setOpen} drawer={drawer} setDrawer={setDrawer} logout={logout} />
          {drawer && <Drawer open={drawer} setOpen={setDrawer} logout={logout} />}
          {open && <Carts open={open} setOpen={setOpen} addtocart={addtocart} />}
          <Outlet context={{ setCart, cart, shop, allcatefilter, addtocart, setShop, open, setOpen, formatCurrency, addfavourite, itemCount }} />
          <Footer />
        </>}
      </div>}
    </>
  )
}

export default App