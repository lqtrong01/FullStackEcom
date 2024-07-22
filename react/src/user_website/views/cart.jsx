import React, { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { AiOutlineClose } from 'react-icons/ai';
import axiosClient from '../../axios';
const Cart = ({cart, setCart}) => {
  const context = useOutletContext();
  cart = context.cart;
  setCart = context.setCart;

  // Increase Quantity of cart product
  const incqty = (product) => 
  {
    const exist = cart.find((x) => 
    {
      return x.id === product.id
    })
    setCart(cart.map((curElm) => 
    {
      return curElm.id === product.id ? { ...exist, qty: exist.qty + 1} : curElm
    }))
  }
  // decrese Quantity of cart product
  const decqty = (product) => 
  {
    const exist = cart.find((x) => 
    {
      return x.id === product.id
    })
    setCart(cart.map((curElm) => 
    {
      return curElm.id === product.id ? {...exist ,qty: exist.qty===1 ? exist.qty-0 : exist.qty - 1}: curElm
    }))
  }

  //Removing cart product
  const removeproduct = (product) => 
  {
    const exist = cart.find((x) => 
    {
      return x.id === product.id
    })
    if(exist.qty > 0)
    {
      setCart(cart.filter((curElm) => 
      {
        return curElm.id !== product.id
      }))
    }
  }
  const [products, setProducts] = useState([]);
  //Product Type
  // useEffect(() => {
  //   axiosClient.get('/category')
  //   .then((res)=>{
  //     setProducts(res.data);
  //   }).catch((err)=>{
  //     console.log(err)
  //   })
  // }, [])
  //Total Price
  const total = cart.reduce((price, item) => price + item.qty * item.price, 0)
  return (
    <>
    <div className='cart'>
        <h3>#cart</h3>
        {
            cart.length === 0 && 
            <>
            <div className='empty_cart'>
                <h2>Your Shopping cart is empty</h2>
                <Link to='/shop'><button>Shop Now</button></Link>
            </div>
            </>
        }
        <div className='container'>
          {
            cart.map((curElm) => 
            {
              return(
                <>
                <div className='justify-center box'>
                  <div className='img_box'>
                    <img src={curElm.image} alt=''></img>
                  </div>
                  <div className='detail'>
                    <div className='info'>
                    <h4>{curElm.cat}</h4>
                    <h3>{curElm.Name}</h3>
                    <p>Price: ${curElm.price}</p>
                    <p>Total: ${curElm.price * curElm.qty}</p>
                    </div>
                    <div className='quantity'>
                      <button onClick={() => decqty (curElm)}>-</button>                    
                      <input type='number' value={curElm.qty}></input>
                      <button onClick={() => incqty (curElm)}>+</button>
                    </div>
                    <div className='icon'>
                      <li onClick={() => removeproduct(curElm)}><AiOutlineClose /></li>
                    </div>
                  </div>
                </div>
                </>
              )
            })
          }
        </div>
        <div className='bottom'>
          {
            cart.length > 0 && 
            <>
            <div className='Total'>
              <h4>Sub Total: ${total}</h4>
            </div>
            <button>checkout</button>
            </>
          }
        </div>
    </div>
    </>
  )
}

export default Cart