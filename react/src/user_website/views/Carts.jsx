import { useEffect, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useStateContext } from '../../contexts/ContextProvider'
import axiosClient from '../../axios'
import Spinner from '../../assets/Spinner.png'
import { useNavigate } from 'react-router-dom'

export default function Carts({ setOpen, open, addtocart }) {
  const { currentUser, products, setNotification, setCurrentUser } = useStateContext();
  const [product, setProduct] = useState([]);
  const [carts, setCart] = useState([]);
  const [loading, setLoading] = useState(null);
  const [loadForm, setLoadForm] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate()

  useEffect(() => {
    if(!currentUser){
      return
    }
    setLoading(false);
    axiosClient.get(`/user/${currentUser.id}`)
      .then(({ data }) => {
        const fetchedCarts = data.data.shopping_cart.items;
        const mergedItems = fetchedCarts.map(item => {
          const product = products.find(product => product.product_item.id === item.product_item_id);
          if (product) {
            return {
              ...item,
              price: product.product_item.price,
              name: product.name
            };
          }

          return item;
        });

        setCart(mergedItems);
        const total = mergedItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
        setTotalPrice(total);

        setLoading(true);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, [loadForm]);

  const formatCurrency = (money) => {
    let config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9 }
    return new Intl.NumberFormat('vi-VN', config).format(money);
  }

  const updateQty = (productItem, newQty, type) => {
    const product = carts.find(product => product.id === productItem.id);
    if (newQty === 0) {
      if (window.confirm("Are you sure you want to delete this product?")) {
        // Remove the product from the cart
        axiosClient.delete(`/shopping_cart/user/${productItem.id}`).then(() => {
          setNotification('The product was deleted', true);
          setCart(carts.filter(product => product.id !== productItem.id));
          setLoadForm(!loadForm);
        });
        return;
      }
    }
    
    if(newQty>=1){
      setCart(carts.map(product =>
        product.id === productItem.id ? { ...product, qty: Math.max(newQty, 0) } : product
      ));
      axiosClient.post('/shopping_cart/user', {
        cart_id: currentUser.id,
        product_item_id: productItem.product_item_id,
        qty: type === '-' ? -1 : +1,
        product_image: productItem.product_image
      }).then(({ data }) => {
        setNotification(data.message, true);
        setLoadForm(!loadForm)
      });
    }
    
    
  }

  const deleteCart = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      axiosClient.delete(`/shopping_cart/user/${id}`).then(({ data }) => {
        setNotification(data.message, true);
        setCurrentUser({...currentUser, event:'deleteCart'})
        setLoadForm(!loadForm)
      }).catch((err)=>{
        setNotification('Fail to updated this cart', false)
      });
    }
  }

  const handleQtyChange = (productItem, value) => {
    const newQty = parseInt(value, 10);
    let oldQty = Number(carts.find(product => product.id === productItem.id).qty);
    if (!isNaN(newQty) && newQty >= 1 && newQty<productItem.product.qty_in_stock) {
      // Tạo một bản sao mới của mảng cart với qty được cập nhật cho sản phẩm cụ thể
      const updatedCart = carts.map(item => {
        if (item.product.id === productItem.product.id) {
          return { ...item, qty: newQty };
        }
        return item;
      });
      setCart(updatedCart);

      setTimeout(() => {
        if(window.confirm(`Bạn muốn cập nhật ${newQty} sản phẩm ${productItem.name} vào giỏ hàng chứ`)){
          console.log(Number(newQty-oldQty))
          axiosClient.post('/shopping_cart/user', {
            cart_id: currentUser.id,
            product_item_id: productItem.product_item_id,
            qty: Number(newQty-oldQty),
            product_image: productItem.product_image
          }).then(({ data }) => {
            setNotification(data.message, true);
            setLoadForm(!loadForm)
          });
        } else {
          setLoadForm(!loadForm)
        }
        
      }, 2000);
      
    }
  };

  const checkOut = () => {
    setOpen(false)
    navigate('/checkout')
  }

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
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
              <div className="flex items-start justify-between sticky mt-2">
                    <DialogTitle className="text-lg mx-1 font-medium text-gray-900">Shopping cart</DialogTitle>
                    <div className="flex h-7 items-center">
                      <button
                        type="button"
                        className="relative p-2 text-gray-400 hover:text-gray-500"
                        onClick={() => setOpen(false)}
                      >
                        <span className="absolute" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                  </div>
                  <hr className=''></hr>
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  
                  {!loading && (<div className='w-full justify-center items-center flex flex-col'><img src={Spinner} className='animate-spin size-20' alt="" />Waiting...</div>)}
                  {loading &&
                    <div className="mt-8">
                      <div className="flow-root">
                        <ul role="list" className="-my-6 divide-y scroll-my-3 divide-gray-200">
                          {carts.length === 0 && <div className='w-full flex justify-center items-center flex-col h-full max-h-[200px]'>
                            <h3>There is no product</h3>
                            <button
                              type="button"
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                              onClick={() => setOpen(false)}
                            >
                              Continue Shopping
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </div>}
                          {carts.length > 0 && carts.map((product) => (
                            <li key={product.id} className="flex py-6">
                              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img
                                  src={product.product_image[0]==='i'?import.meta.env.VITE_API_BASE_URL+'/'+product.product_image:product.product_image}
                                  alt={""}
                                  className="h-full w-full object-contain object-center"
                                />
                              </div>

                              <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>
                                      <a href={'#'}>{product.name}</a>
                                    </h3>
                                    <p className="ml-4">{formatCurrency(product.price)}</p>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                  <button
                                    onClick={() => updateQty(product, product.qty - 1, '-')}
                                    type="button"
                                    className="font-bold text-indigo-600 hover:text-indigo-500">
                                    –
                                  </button>
                                  {/* <p className="text-gray-500">{product.qty}</p> */}
                                  <input
                                    type="number"
                                    className="text-gray-500 border rounded-md w-12 text-center no-spinner"
                                    value={product.qty}
                                    onChange={(e) => handleQtyChange(product, e.target.value)}
                                    min="1"
                                  />
                                  <button
                                    onClick={() => updateQty(product, product.qty + 1, '+')}
                                    type="button"
                                    className="font-bold text-indigo-600 hover:text-indigo-500">
                                    +
                                  </button>


                                  <div className="flex">
                                    <button
                                      onClick={() => deleteCart(product.id)}
                                      type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>}
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>{formatCurrency(totalPrice)}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                  <div className="mt-6 justify-center flex">
                    <button
                      onClick={()=>checkOut()}
                      disabled={carts.length === 0}
                      className={`flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 ${carts.length === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      Checkout
                    </button>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or{' '}
                      <button
                        type="button"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                        onClick={() => setOpen(false)}
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
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
