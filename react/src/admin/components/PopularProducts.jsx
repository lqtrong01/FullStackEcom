import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../axios";
import Spinner from '../../assets/Spinner.png'
import { formatCurrency } from "../../contexts/ContextProvider";
import PaginationLinks from "./PaginationLinks";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

function PopularProducts() {
  const [popularProducts, setPopularProducts] = useState([])
  const [loading, setLoading] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(10)
  const [selected, setSelected] = useState(postsPerPage); // Default selected value

  let pages = [];

  useEffect(() => {
    setLoading(false);
    axiosClient
      .get("/product")
      .then(({ data }) => {
        setPopularProducts(data.data);
        setLoading(true);
      })
      .catch(({ err }) => {
        console.error(err);
        setLoading(false);
      });
  }, []);
  const onPageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  for (let i = 0; i <= Math.ceil(popularProducts.length / selected); i++) {
    pages.push({ label: i + 1, active: i + 1 === currentPage }); // Setting active state based on currentPage
  }
  const lastPostIndex = currentPage * postsPerPage
  const firstPostIndex = lastPostIndex - postsPerPage
  const currentPosts = popularProducts.slice(firstPostIndex, lastPostIndex)
  return (
    <>
      {/* {!loading && (
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      )} */}
      <div className="w-[20rem] bg-white p-4 rounded-sm border border-gray-200">
        <strong className="text-gray-700 font-medium">Popular Products</strong>
        <div className="mt-4 flex flex-col gap-3">
          {currentPosts.map((product) => (
            <Link
              key={product.id}
              to={`/admin/product/${product.id}/edit`}
              className="flex items-start hover:no-underline"
            >
              <div className="w-10 h-10 min-w-[2.5rem] bg-gray-200 rounded-sm">
                <img
                  className="w-full h-full object-contain rounded-sm"
                  src={product.product_image[0] === 'i' ? import.meta.env.VITE_API_BASE_URL + '/' + product.product_image : product.product_image}
                  alt={product.name}
                />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm text-gray-800">{product.name}</p>
                <span
                  className={classNames(
                    product.product_item.qty_in_stock === 0
                      ? "text-red-500"
                      : product.product_item.qty_in_stock > 50
                        ? "text-green-500"
                        : "text-orange-500",
                    "text-xs font-medium"
                  )}
                >
                  {product.product_item.qty_in_stock === 0
                    ? "Out of Stock"
                    : product.product_item.qty_in_stock + " in Stock"}
                </span>
              </div>
              <div className="text-xs text-gray-400 pl-1.5">
                {formatCurrency(product.product_item.price)}
              </div>
            </Link>
          ))}
        </div>
        {
          <div className="bottom-4 flex items-center justify-center bg-transparent px-4 py-3 sm:px-6 mt-4">
            <nav
              className="inline-flex -space-x-px rounded-md shadow-md"
              aria-label="Pagination"
            >
              {pages.map((page, index) => (
                <a
                  href="#"
                  onClick={(ev) => {
                    ev.preventDefault();
                    onPageClick(page.label);
                  }}
                  key={index}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 
                  text-gray-700 hover:bg-gray-50 ${index === 0 ? 'rounded-l-md' : ''} ${index === pages.length - 1 ? 'rounded-r-md' : ''}
                    ${page.active ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : ''}`}
                >
                  {page.label}
                </a>
              ))}
              
            </nav>
          </div>
        }
      </div>
    </>
  );
}

export default PopularProducts;
