// src/DropdownMenu.js
import React, { useState } from 'react';
import {
  UserIcon,
  HeartIcon,
  StarIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { BiLogOut, BiRefresh } from 'react-icons/bi';

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={toggleDropdown}
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          Quang Trọng Lê's Account
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            <a
              href="#"
              className="text-gray-700 flex px-4 py-2 text-sm  items-center"
              role="menuitem"
            >
              <UserIcon className="w-5 h-5 mr-2" />
              Manage My Account
            </a>
            <a
              href="#"
              className="text-gray-700 flex px-4 py-2 text-sm  items-center"
              role="menuitem"
            >
              <ClipboardDocumentListIcon className="w-5 h-5 mr-2" />
              My Orders
            </a>
            <a
              href="#"
              className="text-gray-700 flex px-4 py-2 text-sm  items-center"
              role="menuitem"
            >
              <HeartIcon className="w-5 h-5 mr-2" />
              My Wishlist & Followed Stores
            </a>
            <a
              href="#"
              className="text-gray-700 flex px-4 py-2 text-sm  items-center"
              role="menuitem"
            >
              <StarIcon className="w-5 h-5 mr-2" />
              My Reviews
            </a>
            <a
              href="#"
              className="text-gray-700 flex px-4 py-2 text-sm  items-center"
              role="menuitem"
            >
              <BiRefresh className="w-5 h-5 mr-2" />
              My Returns & Cancellations
            </a>
            <a
              href="#"
              className="text-gray-700 flex px-4 py-2 text-sm  items-center"
              role="menuitem"
            >
              <BiLogOut className="w-5 h-5 mr-2" />
              Logout
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
