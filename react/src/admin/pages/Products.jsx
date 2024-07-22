import { CircleStackIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axiosClient from "../../axios";
import TButton from "../components/shared/TButton";
import PageComponent from "../components/PageComponent";
import PaginationLinks from "../components/PaginationLinks";

import { useStateContext } from "../../contexts/ContextProvider";
import ProductListItem from "../components/ProductListItem";


export default function AdminProduct() {
  const { showToast, setNotification } = useStateContext();
  const [adminProduct, setAdminProduct] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(6)
  const [loadForm, setLoadForm] = useState(null)

  const onDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      axiosClient.delete(`/product/${id}`).then(() => {
        //getAdminProduct();
        setNotification('The product was deleted', true);
        setLoadForm(!loadForm)
      }).catch((err)=>{
        setNotification('The product cannot Deleted', false)
      });
    }
  };


  const getAdminProduct = (url) => {
    url = url || "/product";
    setLoading(true);
    axiosClient.get(url).then(({ data }) => {
      setAdminProduct(data.data);
      setFilterData(data.data)
      setLoading(false);
    });
  };

  useEffect(() => {
    getAdminProduct();
  }, [loadForm]);

  useEffect(() => {
    setFilterData(adminProduct)
    if (search === '') {

    } else {
      setFilterData(
        [...adminProduct].filter(item =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.id.toString().toLowerCase().includes(search.toLowerCase())||
          item.category.category_name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search])

  const lastPostIndex = currentPage * postsPerPage
  const firstPostIndex = lastPostIndex - postsPerPage
  const currentPosts = filterData.slice(firstPostIndex, lastPostIndex)
  return (
    <PageComponent
      title="Product"
      search={
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none"
        />
      }
      buttons={
        <TButton color="green" to="/admin/product/create">
          <PlusCircleIcon className="h-6 w-6 mr-2" />
          Create new
        </TButton>
      }
    >
      {loading && <div className="text-center text-lg">Loading...</div>}
      {!loading && (
        <div>
          {!filterData.length === 0 && (
            <div className="py-8 text-center text-gray-700">
              You don't have AdminProduct created
            </div>
          )}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {currentPosts.map((product) => (
              <ProductListItem
                product={product}
                key={product.id}
                onDeleteClick={onDeleteClick}
              />
            ))}
          </div>
          <div className="block">
          {filterData.length > 0 && <PaginationLinks totalPosts={filterData.length} setPostsPerPage={setPostsPerPage} postsPerPage={postsPerPage} setCurrentPage={setCurrentPage}/>}
          </div>
        </div>
      )}
    </PageComponent>
  );
}