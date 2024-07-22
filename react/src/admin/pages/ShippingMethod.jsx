import React, { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import DialogComponent from "../components/DialogComponent";
import axiosClient from "../../axios";
import TButton from "../components/shared/TButton";
import { PencilSquareIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import Spinner from "../../assets/Spinner.png"
import PaginationLinks from "../components/PaginationLinks";

export default function ShippingMethod(){
    const [shipping_method, setShippingMethod] = useState([])
    const [loading, setLoading] = useState(null)
    const [loadForm ,setLoadForm] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [sortConfig, setSortConfig] = useState({ key: 'paymentDate', direction: 'ascending' })
    const itemsPerPage = 10
    const [search, setSearch] = useState("")
    const [filteredData, setFilteredData] = useState([])
    const [show, setShow] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [edit, setEdit] = useState({
        'name':'',
        'price':0
    })
    const [id, setId] = useState(0)
    const [postsPerPage, setPostsPerPage] = useState(10)
    useEffect(() => {
        setLoading(false)
        axiosClient.get('/shipping_method')
            .then(({ data }) => {
                setShippingMethod(data.data)
                setFilteredData(data.data)
                setLoading(true)
            })
            .catch(({ err }) => {
                console.error(err)
                setLoading(false)
            })
    }, [loadForm])

    const setEditMethod = (method) => {
        setShow(true)
        setId(method.id)
        setEdit(method)
        console.log(edit)
    }
    const heads = [
        { name: "Method", id: 1 },
        { name: "Price", id: 2 },
        { name: "Action", id: 3 },
    ]
    useEffect(() => {
        if (search === '') {
            setFilteredData(shipping_method)
        } else {
            setFilteredData(
                shipping_method.filter(item =>
                    item.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.id.toString().toLowerCase().includes(search.toLowerCase())||
                    item.price.toString().toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [search])

    const onDeleteClick = (id) => {
        if (window.confirm("Are you sure you want to delete this method?")) {
            axiosClient.delete(`/shipping_method/${id}`).then(({ data }) => {
                alert(data.message);
            });
        }
    };
    const lastPostIndex = currentPage * postsPerPage
    const firstPostIndex = lastPostIndex - postsPerPage
    const currentPosts = filteredData.slice(firstPostIndex, lastPostIndex)
    return(
        <>
            <DialogComponent title="Edit Shipping Method" show={show} setShow={setShow} value={edit} setValue={setEdit} id={id} setLoading={setLoadForm} loadForm={loadForm}/>
            <DialogComponent title="Add Shipping Method" show={showAdd} setShow={setShowAdd} setLoading={setLoadForm} loadForm={loadForm}/>
            <PageComponent
                title={'Shipping Method'}
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
                                {currentPosts.map((method) => (
                                    <tr key={method.id} className="border-t">
                                        <td className="px-4 py-2 flex items-center">
                                            <div>
                                                <div className="font-semibold text-blue-600">{method.name}</div>
                                                {/* <div className="text-sm text-gray-600">{category.parent_category_id}</div> */}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2"><p className=''>{method.price}</p></td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => setEditMethod(method)}
                                                type="submit" className="mr-2 text-blue-500">
                                                <PencilSquareIcon className='size-6 text-blue-700' />
                                            </button>
                                            <button
                                                onClick={() => onDeleteClick(method.id)}
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