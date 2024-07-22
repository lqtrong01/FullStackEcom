import {
	HiOutlineViewGrid,
	HiOutlineCube,
	HiOutlineShoppingCart,
	HiOutlineUsers,
	HiOutlineDocumentText,
	HiOutlineAnnotation,
	HiOutlineQuestionMarkCircle,
	HiOutlineCog,
	HiOutlineTable,
	HiOutlineTruck
} from 'react-icons/hi'
import { MdPercent } from 'react-icons/md'

export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/admin/dashboard',
		icon: <HiOutlineViewGrid />
	},
	{
		key: 'products',
		label: 'Products',
		path: '/admin/products',
		icon: <HiOutlineCube />
	},
	// {
	// 	key:'promotion',
	// 	label: 'Giảm Giá',
	// 	path:'/admin/promotions',
	// 	icon: <MdPercent/>
	// },
	{
		key: 'categories',
		label: 'Categories',
		path: '/admin/category',
		icon: <HiOutlineTable/>
	},
	{
		key: 'shipping_methods',
		label: 'Shipping Methods',
		path: '/admin/shipping_method',
		icon: <HiOutlineTruck/>
	},
	{
		key: 'orders',
		label: 'Orders',
		path: '/admin/orders',
		icon: <HiOutlineShoppingCart />
	},
	{
		key: 'customers',
		label: 'Customers',
		path: '/admin/customers',
		icon: <HiOutlineUsers />
	},
	{
		key: 'transactions',
		label: 'Transactions',
		path: '/admin/transactions',
		icon: <HiOutlineDocumentText />
	},
	{
		key: 'reviews',
		label: 'Reviews',
		path: '/admin/reviews',
		icon: <HiOutlineAnnotation />
	}
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	// {
	// 	key: 'settings',
	// 	label: 'Settings',
	// 	path: '/admin/settings',
	// 	icon: <HiOutlineCog />
	// },
	// {
	// 	key: 'support',
	// 	label: 'Help & Support',
	// 	path: '/admin/support',
	// 	icon: <HiOutlineQuestionMarkCircle />
	// }
]