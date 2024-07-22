import React, { useEffect, useState } from 'react'

import { AiFillHeart, AiFillEye, AiOutlineClose} from 'react-icons/ai';
import Banner1 from '../image/shop_left.avif';
import Banner2 from '../image/shop_top.webp';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';
import axiosClient from '../../axios';
import ProductQuickReview from '../components/ProductQuickReview.jsx';
import Spinner from '../../assets/Spinner.png'
import { FaSpinner } from 'react-icons/fa';
const Shop = () => {
    const { shop, addtocart, setShop, allcatefilter, addfavourite } = useOutletContext()
    const navigate = useNavigate()
    const {products} = useStateContext()
    const [loading, setLoading] = useState(null)
    const [category, setCategory] = useState([])
    const [showDetail, setShowDetail] = useState(false)
    // Detail Page Data
    const [detail, setDetail] = useState([])
    //Showing Detail Box
    const detailpage = (product) => 
    {
        const detaildata = ([{product}])
        const productdetail = detaildata[0]['product']
        // console.log(productdetail)
        setDetail(productdetail)
        setShowDetail(true)
    }

    const Filter = (key) => {
        if (key === '') {
            setShop(...products)
        } else {
            setShop([...products].filter(item =>
                item.category.category_name.toLowerCase().includes(key.toString().toLowerCase()) ||
                item.category_id.toString().toLowerCase().includes(key.toString().toLowerCase())
            )
            );
        }
    }

    useEffect(()=>{
        axiosClient.get('/product_category')
        .then(({data})=>{
            setCategory(data.data)
        })
        .catch(({err})=>{
            console.error(err)
        })
    }, [])

    useEffect(()=> {
        setLoading(false)
        setTimeout(() => {
            setShop(products)
        }, 5000);
        setLoading(true)
    },[])
  return (
    <>
    {showDetail && <ProductQuickReview open={showDetail} setOpen={setShowDetail} detail={detail} addtocart={addtocart}/>}    
    {!loading && (<div className='w-full justify-center items-center flex flex-col'><FaSpinner className='animate-spin size-20' alt="" />Waiting...</div>)}
    {loading && 
    <div className='shop'>
        <h2># shop</h2>
        <p>Home . shop</p>
        <div className='container'>
            <div className='left_box'>
                <div className='category'>
                    <div className='header'>
                        <h3>all categories</h3>
                    </div>
                    <div className='box'>
                        <ul>
                            <li onClick={() => allcatefilter ()}># All</li>
                            {category && category.map((item)=>(
                                <li onClick={() => Filter(item.id)}># {item.category_name}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className='banner'>
                    <div className='img_box'>
                        <img src={Banner1} alt=''></img>
                    </div>
                </div>
            </div>
            <div className='right_box'>
                <div className='banner'>
                    <div className='img_box'>
                        <img src={Banner2} alt=''></img>
                    </div>
                </div>
                <div className='product_box'>
                    <h2>Shop Product</h2>
                    <div className='product_container'>
                        {
                            shop.map((curElm) => 
                            (
                                
                                    <div className='box'>
                                        <div className='img_box'>
                                            <img onClick={()=>navigate(`/product/${curElm.id}`)} src={curElm.product_image[0]==='i'?import.meta.env.VITE_API_BASE_URL+'/'+curElm.product_image:curElm.product_image} alt=''></img>
                                            <div className='icon'>
                                               <li onClick={() => addfavourite(curElm)}><AiFillHeart /></li> 
                                               <li onClick={() => detailpage (curElm)}><AiFillEye /></li> 
                                            </div>
                                        </div>
                                        <div className='detail'>
                                            <h3 onClick={()=>navigate(`/product/${curElm.id}`)}>{curElm.name}</h3>
                                            {/* <p>$ {curElm.product_item.price}</p> */}
                                            <button onClick={() => addtocart (curElm)}>Add To Cart</button>
                                        </div>
                                    </div>
         
                            ) )
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>}
    </>
  )
}

export default Shop