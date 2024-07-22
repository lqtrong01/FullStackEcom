import React, { useEffect, useState } from 'react'

import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import Homeproduct1 from '../components/home_product'
import { AiFillEye, AiFillHeart, AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai";
import { BiLogoFacebook, BiLogoTwitter, BiLogoInstagram, BiLogoYoutube } from "react-icons/bi";
import MBanner from '../image/Multi-Banner-1.avif';
import MBanner1 from '../image/Multi-banner-2.avif';
import MBanner2 from '../image/Multi-Banner-3.webp';
import MBanner3 from '../image/Multi-banner-4.avif';
import MBanner4 from '../image/Multi-Banner-5.webp';
import Testmonial from '../image/T1.avif';
import axiosClient from '../../axios.js';
import ProductQuickReview from '../components/ProductQuickReview.jsx';
import Spinner from '../../assets/Spinner.png'

const Home = () => {
  const {addtocart, formatCurrency, addfavourite} = useOutletContext()
  const [Homeproduct, setHomeproduct] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  // Product category
  const [newProduct, setNewProduct] = useState([])
  const [featuredProduct, setFeaturdProduct] = useState([])
  const [topProduct, setTopProduct] = useState([])
  //Tranding Product
  const [trendingProduct, setTrendingProduct] = useState([])
  // Filter of tranding product
  const filtercate = (x) => {
    const filterproduct = Homeproduct.filter((curElm) => {
      return curElm.type === x
    })
    setTrendingProduct(filterproduct)
  }
  //All Trending Product
  const allTrendingProduct = () => {
    setTrendingProduct(Homeproduct)
  }

  //Product Type
  useEffect(() => {
    setLoading(false)
    axiosClient.get('/product')
    .then(({data})=>{
      setHomeproduct(data.data)
      setTrendingProduct(data.data)
      productcategory(data.data)
      setLoading(true)
      
    })
    .catch(({err})=>{
      console.error(err);
    })
    
  }, [])

  const productcategory = (Homeproducts) => {
    // New Product
    const newcategory = Homeproducts?.filter((x) => {
      return x.type === 'New'
    })
    setNewProduct(newcategory)

    // Featured Product
    const featuredcategory = Homeproducts?.filter((x) => {
      return x.type === 'Featured'
    })
    setFeaturdProduct(featuredcategory)

    // Top Product
    const topcategory = Homeproducts?.filter((x) => {
      return x.type === 'Best selling'
    })
    setTopProduct(topcategory)
  }
  const [showDetail, setShowDetail] = useState(false)
  // Detail Page Data
  const [detail, setDetail] = useState([])
  //Showing Detail Box
  const detailpage = (product) => {
    const detaildata = ([{ product }])
    const productdetail = detaildata[0]['product']
    // console.log(productdetail)
    setDetail(productdetail)
    setShowDetail(true)
  }

  return (
    <>
    {showDetail && <ProductQuickReview open={showDetail} setOpen={setShowDetail} detail={detail} addtocart={addtocart}/>}    
    {!loading && (<div className='w-full justify-center items-center flex flex-col'><img src={Spinner} className='animate-spin size-20' alt="" />Waiting...</div>)}
    {loading && 
      <div className='home'>
        <div className='top_banner'>
          <div className='contant'>
            <h3>silver aluminum</h3>
            <h2>Apple Watch</h2>
            <p>30% off at your first odder</p>
            <Link to='/shop' className='link'>Shop Now</Link>
          </div>
        </div>
        <div className='trending'>
          <div className='container'>
            <div className='left_box'>
              <div className='header'>
                <div className='heading'>
                  <h2 onClick={() => allTrendingProduct()}>trending product</h2>
                </div>
                <div className='cate'>
                  <h3 onClick={() => filtercate('New')}>New</h3>
                  <h3 onClick={() => filtercate('Featured')}>Featured</h3>
                  <h3 onClick={() => filtercate('Best selling')}>best selling</h3>
                </div>
              </div>
              <div className='products'>
                <div className='container'>
                  {
                    trendingProduct.map((curElm) => {
                      return (
                        <>
                          <div className='box'>
                            <div className='img_box'>
                              <img
                                onClick={()=>navigate(`/product/${curElm.id}`)}
                                className='object-contain'
                                src={curElm.product_image[0]==='i'?import.meta.env.VITE_API_BASE_URL+'/'+curElm.product_image:curElm.product_image} alt=''></img>
                              <div className='icon'>
                                <div className='icon_box' onClick={() => detailpage (curElm)}>
                                  <AiFillEye />
                                </div>
                                <div className='icon_box' onClick={()=>addfavourite(curElm)}>
                                  <AiFillHeart />
                                </div>
                              </div>
                            </div>
                            <div className='info'>
                              <h3>{curElm.name}</h3>
                              <p>{formatCurrency(curElm.product_item.price)}</p>
                              <button className='btn items-center flex' onClick={() => addtocart(curElm)}>Add to cart</button>
                            </div>
                          </div>
                        </>
                      )
                    })
                  }
                </div>
                <button>Show More</button>
              </div>
            </div>
            <div className='right_box'>
              {/* <div className='right_container'>
                <div className='testimonial'>
                  <div className='head'>
                    <h3>our testmonial</h3>
                  </div>
                  <div className='detail'>
                    <div className='img_box'>
                      <img src={Testmonial} alt='testmonial'></img>
                    </div>
                    <div className='info'>
                      <h3>stephan robot</h3>
                      <h4>web designer</h4>
                      <p>Duis faucibus enim vitae nunc molestie, nec facilisis arcu pulvinar nullam mattisr nullam mattis.</p>
                    </div>
                  </div>
                </div>
                <div className='newsletter'>
                  <div className='head'>
                    <h3>newsletter</h3>
                  </div>
                  <div className='form'>
                    <p>join our malling list</p>
                    <input type='email' placeholder='E-mail' autoComplete='off'></input>
                    <button>subscribe</button>
                    <div className='icon_box'>
                      <div className='icon'>
                        <BiLogoFacebook />
                      </div>
                      <div className='icon'>
                        <BiLogoTwitter />
                      </div>
                      <div className='icon'>
                        <BiLogoInstagram />
                      </div>
                      <div className='icon'>
                        <BiLogoYoutube />
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <div className='banners'>
          <div className='container'>
            <div className='left_box'>
              <div className='box'>
                <img src={MBanner} alt='banner'></img>
              </div>
              <div className='box'>
                <img src={MBanner1} alt='banner'></img>
              </div>
            </div>
            <div className='right_box'>
              <div className='top'>
                <img src={MBanner2} alt=''></img>
                <img src={MBanner3} alt=''></img>
              </div>
              <div className='bottom'>
                <img src={MBanner4} alt=''></img>
              </div>
            </div>
          </div>
        </div>
        <div className='product_type'>
          <div className='container'>
            <div className='box'>
              <div className='header'>
                <h2>New Product</h2>
              </div>
              {
                newProduct.map((curElm) => {
                  return (
                    <>
                      <div className='productbox'>
                        <div className='img-box'>
                          <img
                            onClick={()=>navigate(`/product/${curElm.id}`)}
                            className='cursor-pointer'
                            src={curElm.product_image[0]==='i'?import.meta.env.VITE_API_BASE_URL+'/'+curElm.product_image:curElm.product_image} alt=''></img>
                        </div>
                        <div className='detail'>
                          <h3 onClick={()=>navigate(`/product/${curElm.id}`)} className='cursor-pointer'>{curElm.name}</h3>
                          <p onClick={()=>navigate(`/product/${curElm.id}`)} className='cursor-pointer'> {formatCurrency(curElm.product_item.price)}</p>
                          <div className='icon'>
                            <button onClick={()=> detailpage (curElm)}><AiFillEye /></button>
                            <button onClick={()=> addfavourite(curElm)}><AiFillHeart /></button>
                            <button onClick={() => addtocart(curElm)}><AiOutlineShoppingCart /></button>
                          </div>
                        </div>
                      </div>
                    </>
                  )
                })
              }
            </div>
            <div className='box'>
              <div className='header'>
                <h2>Featured Product</h2>
              </div>
              {
                featuredProduct.map((curElm) => {
                  return (
                    <>
                      <div className='productbox'>
                        <div className='img-box'>
                          <img 
                            onClick={()=>navigate(`/product/${curElm.id}`)}
                            className='cursor-pointer'
                            src={curElm.product_image[0]==='i'?import.meta.env.VITE_API_BASE_URL+'/'+curElm.product_image:curElm.product_image} alt=''></img>
                        </div>
                        <div className='detail'>
                          <h3 onClick={()=>navigate(`/product/${curElm.id}`)}
                            className='cursor-pointer'>{curElm.name}</h3>
                          <p onClick={()=>navigate(`/product/${curElm.id}`)}
                            className='cursor-pointer'>{formatCurrency(curElm.product_item.price)}</p>
                          <div className='icon'>
                            <button onClick={()=> detailpage (curElm)}><AiFillEye /></button>
                            <button onClick={()=> addfavourite(curElm)}><AiFillHeart /></button>
                            <button onClick={() => addtocart(curElm)}><AiOutlineShoppingCart /></button>
                          </div>
                        </div>
                      </div>
                    </>
                  )
                })
              }
            </div>
            <div className='box'>
              <div className='header'>
                <h2>Top Product</h2>
              </div>
              {
                topProduct.map((curElm) => {
                  return (
                    <>
                      <div className='productbox'>
                        <div className='img-box'>
                          <img src={curElm.product_image[0]==='i'?import.meta.env.VITE_API_BASE_URL+'/'+curElm.product_image:curElm.product_image} alt=''></img>
                        </div>
                        <div className='detail'>
                          <h3>{curElm.name}</h3>
                          <p>{formatCurrency(curElm.product_item.price)}</p>
                          <div className='icon'>
                            <button onClick={()=> detailpage (curElm)}><AiFillEye /></button>
                            <button onClick={()=> addfavourite(curElm)}><AiFillHeart /></button>
                            <button onClick={()=> addtocart(curElm)}><AiOutlineShoppingCart /></button>
                          </div>
                        </div>
                      </div>
                    </>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>}

    </>
  )
}

export default Home