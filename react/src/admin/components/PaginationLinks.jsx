import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

export default function PaginationLinks({ totalPosts, postsPerPage, setPostsPerPage, setCurrentPage }) {
  const [currentPage, setCurrentPageState] = useState(1);
  const [selected, setSelected] = useState(postsPerPage); // Default selected value

  let pages = [];
  for (let i = 0; i <= Math.ceil(totalPosts / selected); i++) {
    pages.push({ label: i + 1, active: i + 1 === currentPage }); // Setting active state based on currentPage
  }

  const onPageClick = (pageNumber) => {
    setCurrentPageState(pageNumber);
    setCurrentPage(pageNumber);
  };

  const handleSelectedChange = (value) => {
    setSelected(value);
    setPostsPerPage(value)
    setCurrentPageState(1); // Reset to first page when changing posts per page
    setCurrentPage(1); // Reset to first page when changing posts per page
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 shadow-md mt-4">
      <div className="flex flex-1 justify-between sm:hidden">
        <a
          href="#"
          onClick={(ev) => {
            ev.preventDefault();
            if (currentPage > 1) {
              onPageClick(currentPage - 1); // Handle previous page click
            }
          }}
          className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }`}
        >
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" /> Previous
        </a>
        <a
          href="#"
          onClick={(ev) => {
            ev.preventDefault();
            if (currentPage < pages.length) {
              onPageClick(currentPage + 1); // Handle next page click
            }
          }}
          className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${currentPage === pages.length ? "pointer-events-none opacity-50" : ""
            }`}
        >
          Next <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{(currentPage - 1) * selected + 1}</span> to{" "}
            <span className="font-medium">{Math.min(currentPage * selected, totalPosts)}</span> of &nbsp;
            <span className="font-medium">{totalPosts}</span> results
          </p>
        </div>
        <div className="ml-4">
          <label htmlFor="postsPerPage" className="text-sm font-medium text-gray-700">
            Show
          </label>
          <select
            id="postsPerPage"
            name="postsPerPage"
            className="ml-2 w-14 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={selected}
            onChange={(ev) => handleSelectedChange(parseInt(ev.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div>
          <nav
            className="inline-flex -space-x-px rounded-md shadow-sm"
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
      </div>
    </div>
  );
}
