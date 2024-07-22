import { useEffect, useState } from "react";
import axiosClient from "../../axios";
import { useNavigate } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useStateContext } from "../../contexts/ContextProvider";
import PaginationLinks from "../components/PaginationLinks";
const heads = [
    'Customer',
    'Commant',
    'Rating',
    'Product',
    'Action'
]
const Reviews = () => {
    const { setNotification } = useStateContext()
    const [reviews, setReview] = useState([])
    const [filterData, setFilterData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage, setPostsPerPage] = useState(10)
    const [search, setSearch] = useState('')
    const navigate = useNavigate()
    const [loadForm, setLoadForm] = useState(false)
    const [loading, setLoading] = useState(null)
    useEffect(() => {
        setLoading(false)
        axiosClient.get('/review')
            .then(({ data }) => {
                setReview(data.data)
                setFilterData(data.data)
                setLoading(true)
            })
    }, [loadForm])

    const handleChangeReview = (user_id, product_id, rating, comment) => {
        if (window.confirm('Delete this comment'))
        {
            console.log(user_id+'  '+comment)
            axiosClient.delete(`/review/${product_id}`,{
                data: {
                    'user_id': user_id,
                    'rating_value': rating,
                    'comment': comment
                }
            }).then(({ data }) => {
                // Handle success
                setNotification('Review submitted successfully.', true);
                setLoadForm(!loadForm)

            }).catch(error => {
                // Handle error
                setNotification('Failed to submit review. Please try again later.', false)
            });
        }  
    }

    useEffect(() => {
        if (search === '') {
            setFilterData(reviews)
        } else {
            setFilterData(
                [...reviews].filter(item =>
                    item?.user_review?.rating_value.toString().toLowerCase().includes(search.toLowerCase()) ||
                    item.id.toString().toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [search])

    const lastPostIndex = currentPage * postsPerPage
    const firstPostIndex = lastPostIndex - postsPerPage
    const currentPosts = filterData.slice(firstPostIndex, lastPostIndex)
    return (
        <>
            <div className="p-4">
                <div className="flex mb-4">
                    <input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e)=>setSearch(e.target.value)}
                        className="border p-2 rounded mr-4"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead className="bg-gray-200">
                            <tr>
                                {heads.map((item, index) => (
                                    <th key={index} className="px-4 py-2 text-left">{item}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentPosts.map((row, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-300 shadow-sm' : 'bg-white shadow-sm'}>
                                    <td className="px-4 py-2 border">
                                        <img
                                            src={!row ? `https://via.placeholder.com/50?text=${row.user_id && row.user_review.user_id.name[0]}` : `${row.user_review.user_id && import.meta.env.VITE_API_BASE_URL + '/' + row.user_review.user_id.user_image}`}
                                            alt={row.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <div onClick={() => navigate(`/admin/customer/${row.user_review.user_id.id}/profile`)} className="font-semibold text-blue-600 cursor-pointer">{row.user_review.user_id && row.user_review.user_id.name}</div>
                                            <div onClick={() => navigate(`/admin/customer/${row.user_review.user_id.id}/profile`)} className="text-sm text-gray-600 cursor-pointer">{row.user_review.user_id && row.user_review?.user_id.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 border">{row?.user_review?.comment}</td>
                                    <td className="px-4 py-2 border">{row?.user_review?.rating_value}</td>
                                    <td onClick={() => navigate(`/admin/product/${row?.product_item_id}`)} className="px-4 py-2 border text-cyan-500">{row?.product_item_id}</td>

                                    <td className="px-4 py-2 border">
                                        <button
                                            className="text-red-500 rounded-md"
                                            onClick={() => handleChangeReview(row?.user_review?.user_id?.id, row?.product_item_id, row?.user_review?.rating_value, row?.user_review?.comment)}
                                        >
                                            <TrashIcon className="size-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filterData.length > 0 && <PaginationLinks totalPosts={filterData.length} setPostsPerPage={setPostsPerPage} postsPerPage={postsPerPage} setCurrentPage={setCurrentPage} />}
                </div>
            </div>
        </>
    )
}

export default Reviews