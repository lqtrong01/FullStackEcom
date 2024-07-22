import React, { useEffect, useState } from "react"
import axiosClient from "../../axios"
import PageComponent from "../components/PageComponent"
import TButton from "../components/shared/TButton"
import { PencilSquareIcon, PlusCircleIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline"
import Spinner from '../../assets/Spinner.png'
import ReactPaginate from "react-paginate"
import { BiSearch } from "react-icons/bi"
import { AiOutlineClose } from "react-icons/ai"
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import { IoCloseCircle } from "react-icons/io5"
import { FcCloseUpMode } from "react-icons/fc"
import DialogComponent from "../components/DialogComponent"
import PaginationLinks from "../components/PaginationLinks"
import { useStateContext } from "../../contexts/ContextProvider"
import { useNavigate } from "react-router-dom"

const Category = () => {
    const [categorys, setCategory] = useState([])
    const [loading, setLoading] = useState(null)
    const [loadForm, setLoadForm] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [sortConfig, setSortConfig] = useState({ key: 'paymentDate', direction: 'ascending' })
    const navigate = useNavigate()
    const [search, setSearch] = useState("")
    const [filteredData, setFilteredData] = useState([])
    const [show, setShow] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [edit, setEdit] = useState("")
    const [id, setId] = useState(0)
    const [postsPerPage, setPostsPerPage] = useState(10)
    const {setNotification} = useStateContext()

    useEffect(() => {
        setLoading(false)
        axiosClient.get('/product_category')
            .then(({ data }) => {
                setCategory(data.data)
                setFilteredData(data.data)
                setLoading(true)
            })
            .catch(({ err }) => {
                console.error(err)
                setLoading(false)
            })
    }, [loadForm])


    const handlePageClick = (categorys) => {
        setCurrentPage(categorys.selected);
    };

    const setEditCategory = (category, id) => {

        setShow(true)
        setId(id)
        setEdit(category)
        console.log(edit)
    }

    const heads = [
        { name: "Category", id: 1 },
        { name: "Product", id: 2 },
        { name: "Action", id: 3 },
    ]

    useEffect(() => {
        setFilteredData(categorys)
        if (search === '') {

        } else {
            setFilteredData(
                categorys.filter(item =>
                    item.category_name.toLowerCase().includes(search.toLowerCase()) ||
                    item.id.toString().toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [search])

    const onDeleteClick = (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            axiosClient.delete(`/product_category/${id}`).then(({ data }) => {
                setNotification('Category successfully Deleted', true)
                setLoadForm(!loadForm)
            }).catch(({message})=>{
                alert(message)
                setNotification('Category Fail to Deleted', false)
                console.log(message)
            });
        }
    };
    const lastPostIndex = currentPage * postsPerPage
    const firstPostIndex = lastPostIndex - postsPerPage
    const currentPosts = filteredData.slice(firstPostIndex, lastPostIndex)
    return (
        <>
            <DialogComponent title="Edit Category" show={show} setShow={setShow} _value={edit} setValue={setEdit} id={id} setLoading={setLoadForm} loading={loadForm}/>
            <DialogComponent title="Add Category" show={showAdd} setShow={setShowAdd} setLoading={setLoadForm} loading={loadForm}/>
            <PageComponent
                title={'Category'}
                search={
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        placeholder="Search..."
                        className="w-full max-w-sm px-4 py-2 border rounded-lg focus:outline-none"
                    />
                }
                buttons={
                    <TButton
                        onClick={() => setShowAdd(true)}
                        color="green"
                    >
                        <PlusCircleIcon className="size-6 mr-2" />
                        Create New
                    </TButton>
                }
            >
                {!loading && <div className="w-full flex justify-center items-center"><img src={Spinner} className="animate-spin size-20" /></div>}
                {loading && <div className="min-h-screen bg-gray-100 p-4">
                    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                        <table className="min-w-full table-auto">
                            <thead className=''>
                                <tr className="bg-gray-200">
                                    {heads.map((item) => (
                                        <th scope="col" key={item.id} className='px-2 py-2'>
                                            <div className="flex " >
                                                <span>{item.name}</span>
                                                <span className="relative flex items-center">
                                                    <svg className="ml-1 w-4 h-4" href="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9">
                                                        </path>
                                                    </svg>
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {currentPosts.map((category) => (
                                    <tr key={category.id} className="border-t">
                                        <td className="px-4 py-2 flex items-center">
                                            <div>
                                                <div className="font-semibold text-blue-600">{category.category_name}</div>
                                                {/* <div className="text-sm text-gray-600">{category.parent_category_id}</div> */}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2"><p className=''>{category.product.length}</p></td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => setEditCategory(category.category_name, category.id)}
                                                type="submit" className="mr-2 text-blue-500">
                                                <PencilSquareIcon className='size-6 text-blue-700' />
                                            </button>
                                            <button
                                                onClick={() => onDeleteClick(category.id)}
                                                type="submit" className="text-red-500" on><TrashIcon className='size-6 text-red-700' /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            {filteredData.length === 0 && <div className="w-full text-center">NO DATA</div>}
                        </table>
                    </div>
                        {filteredData.length > 0 && <PaginationLinks totalPosts={filteredData.length} setPostsPerPage={setPostsPerPage} postsPerPage={postsPerPage} setCurrentPage={setCurrentPage} />}
                </div>}

            </PageComponent>
        </>
    )
}

export default Category