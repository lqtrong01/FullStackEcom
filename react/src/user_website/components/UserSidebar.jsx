import React from 'react';
import classNames from 'classnames';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { XMarkIcon, UserCircleIcon, WalletIcon, HeartIcon, TruckIcon} from '@heroicons/react/24/outline'
import { useStateContext } from '../../contexts/ContextProvider';
import { FcAddressBook, FcCustomerSupport, FcHeadset, FcShipped } from 'react-icons/fc';

const links = [
    { name: 'Profile', path: '/user/profile', icon: <UserCircleIcon className='h-6 w-6 mr-3'/>, id: 1 },
    { name: 'Order', path: '/user/order', icon: <FcShipped className='h-6 w-6 mr-3'/>, id: 2 },
    { name: 'Favourite', path: '/user/favourite', icon: <HeartIcon className='h-6 w-6 mr-3 text-pink-600'/>, id: 3 },
    { name: 'Book Address', path: '/user/address', icon: <FcAddressBook className='h-6 w-6 mr-3'/>, id: 4 },
];

const linkClass = 'flex items-center gap-2 font-light px-3 py-2 hover:bg-blue-700 hover:no-underline w-full text-base';

export default function Sidebar() {
    const {currentUser} = useStateContext()
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/');
    };

    return (
        <div className="bg-cyan-600 min-h-screen w-60 p-3 flex flex-col">
            <div onClick={handleClick} className="flex items-center gap-2 px-1 py-3 cursor-pointer">
                
            </div>
            <div className="py-8 flex flex-1 flex-col gap-0.5 w-full">
                {links.map(link => (
                    <SidebarLink key={link.id} link={link} />
                ))}
            </div>
        </div>
    );
}

function SidebarLink({ link }) {
    const { pathname } = useLocation();

    return (
        <Link
            to={link.path}
            className={classNames(
                pathname === link.path ? 'border-2 rounded-full text-white' : 'text-neutral-900',
                linkClass
            )}
        >
            {link.icon}
            {link.name}
        </Link>
    );
}
