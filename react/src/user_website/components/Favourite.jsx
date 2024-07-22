import React, { useEffect, useState } from 'react';
import axiosClient from '../../axios'
import { useStateContext } from '../../contexts/ContextProvider';
import { ShoppingCartIcon, StarIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

const Favorites = () => {
  const { currentUser, setNotification } = useStateContext()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(null)
  const [favorites, setFavorite] = useState([])
  const [loadForm, setLoadForm] = useState(false)

  useEffect(() => {
    if(!currentUser) {return}
    setLoading(false)
    axiosClient.get(`user/favourite/${currentUser.id}`)
      .then(({ data }) => {
        setFavorite(data.data)
        setLoading(true)
      }).catch(({ err }) => {
        setLoading(false)
      })
  }, [loadForm, currentUser])

  const updatefavourite = (id) => {
    axiosClient.put(`/user/favourite/${currentUser.id}`, {
      'user_id': currentUser.id,
      'product_id': id,
    })
      .then(({ data }) => {
        setNotification(data.message, true)
        setLoadForm(!loadForm)
      }).catch((err) => {
        setNotification('Fail to action Favourite', false)
      })
  }
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  return (
    <>
      {!loading && <div className="w-full flex justify-center items-center"><FaSpinner className='size-12 animate-spin text-cyan-500' /></div>}
      {loading &&
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Favorites</h2>
          <ul className="space-y-4 w-auto">
            {favorites && favorites
              .filter(favorite => favorite.is_default===1)
              .map(favorite => (
                <li key={favorite.id} className="p-4 border rounded bg-slate-50 grid grid-cols-2 space-x-4">
                  <div className="flex items-center">
                    <img src={favorite.product_id.product_image[0] === 'i' ? import.meta.env.VITE_API_BASE_URL + '/' + favorite.product_id.product_image : favorite.product_id.product_image} alt="Product Image" className="w-20 h-20 object-contain mr-3 rounded" />
                    <div className="flex flex-col justify-center">
                      <h3 onClick={() => navigate(`/product/${favorite.product_id.id}`)} className="font-bold cursor-pointer text-xl text-gray-800 truncate">{favorite.product_id.name}</h3>
                      
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    {/* Assuming you want to add a trash icon and a shopping cart icon */}
                    <TrashIcon
                      onClick={() => updatefavourite(favorite.product_id.id)}
                      className="w-6 h-6 text-gray-600 cursor-pointer" />
                  </div>
                </li>
              ))}
              {favorites.filter(favorite => favorite.is_default===1).length===0 && <div className='max-w-full'>Không có sản phẩm yêu thích</div>}

          </ul>
        </div>}
    </>
  );
};

export default Favorites;
