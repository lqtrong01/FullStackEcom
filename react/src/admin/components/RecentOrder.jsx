import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Link, useNavigate } from 'react-router-dom'
import { getOrderStatus } from '../lib/helpers'
import axiosClient from '../../axios'
import { FaSpinner } from 'react-icons/fa'
import { formatCurrency } from '../../contexts/ContextProvider'


export default function RecentOrders() {
	const [order, setOrder] = useState([])
	const [loading, setLoading] = useState(null)
	const navigate = useNavigate()
	const [currentPage, setCurrentPage] = useState(1)
	const [postsPerPage, setPostsPerPage] = useState(10)
	const [selected, setSelected] = useState(postsPerPage); // Default selected value

	let pages = [];
	useEffect(() => {
		setLoading(false)
		axiosClient.get('/order/admin')
			.then(({ data }) => {
				const sortedOrders = data.data.sort((a, b) => {
					// Sort by descending order of creation time (assuming created_at is a timestamp)
					return new Date(b.created_at) - new Date(a.created_at);
				});
				setOrder(sortedOrders);
				setLoading(true);
			})
			.catch((error) => {
				console.error('Error fetching orders:', error);
				setLoading(false);
			});
	}, []);

	const convertTimestampToDate = (timestamp) => {
		const date = new Date(timestamp);
		const day = String(date.getUTCDate()).padStart(2, '0');
		const month = String(date.getUTCMonth() + 1).padStart(2, '0');
		const year = date.getUTCFullYear();
		const formattedDate = `${day}-${month}-${year}`;
		return formattedDate;
	};

	const onPageClick = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	for (let i = 0; i <= Math.ceil(order.length / selected); i++) {
		pages.push({ label: i + 1, active: i + 1 === currentPage }); // Setting active state based on currentPage
	}
	const lastPostIndex = currentPage * postsPerPage
	const firstPostIndex = lastPostIndex - postsPerPage
	const currentPosts = order.slice(firstPostIndex, lastPostIndex)

	return (
		<div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
			<strong className="text-gray-700 font-medium">Recent Orders</strong>
			<div className="border-x border-gray-200 rounded-sm mt-3">
				<table className="w-full text-gray-700 table-fixed gap-4">
					<thead>
						<tr className='w-full'>
							{/* <th>ID</th>
							<th>Product ID</th> */}
							<th className='border border-l-none'>Customer Name</th>
							<th className='border border-l-none'>Order Date</th>
							<th className='border border-l-none'>Order Total</th>
							<th className='border border-l-none'>Shipping Address</th>
							<th className='border'>Order Status</th>
						</tr>
					</thead>
					<tbody>
						{order && currentPosts.map((row, index) => (
							<tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
								<td className="px-4 border">
									<img
										src={!row ? `https://via.placeholder.com/50?text=${row.user_id && row.user_id.name[0]}` : `${row.user_id && import.meta.env.VITE_API_BASE_URL + '/' + row.user_id.user_image}`}
										alt={row.name}
										className="w-10 h-10 rounded-full object-cover"
									/>
									<div>
										<div onClick={() => navigate(`/admin/customer/${row.user_id.id}/profile`)} className="font-semibold text-blue-600 cursor-pointer">{row.user_id && row.user_id.name}</div>
										<div onClick={() => navigate(`/admin/customer/${row.user_id.id}/profile`)} className="text-sm text-gray-600 cursor-pointer">{row.user_id && row.user_id.email}</div>
									</div>
								</td>
								<td className='border text-center'>{convertTimestampToDate(row.created_at)}</td>
								<td className='border text-center'>{formatCurrency(row.order_total)}</td>
								<td className='border text-center'>{row.shipping_addresses.address_line}</td>
								<td className='border text-center'>
									<span className={`${row.order_status === 1 ? 'bg-green-400 text-green-800' : row.order_status === 2 ? 'bg-indigo-500 text-indigo-700' : row.order_status === 3 ? 'bg-amber-300 text-amber-700' : row.order_status === 4 ? 'bg-red-500 text-red-700' : row.order_status === 5 ? 'text-yellow-400 bg-yellow-600' : ''} rounded-md px-2 py-1`}>
										{row.order_statuses && row.order_statuses.status}
									</span>
								</td>
							</tr>
							// <tr 
							// 	className='flex justify-between items-start'
							// 	key={order.id}
							// >
							// 	<td>
							// 		<Link to={`/order/${order.id}`}>#{order.id}</Link>
							// 	</td>
							// 	<td>
							// 		<Link to={`/product/${order.product_id}`}>#{order && order.product_id}</Link>
							// 	</td>
							// 	<td>
							// 		<Link to={`/customer/${order.customer_id}`}>{order.user_id.name}</Link>
							// 	</td>
							// 	<td>{format(new Date(order.order_date), 'dd MMM yyyy')}</td>
							// 	<td>{order.order_total}</td>
							// 	<td>{order.shipment_address}</td>
							// 	<td>{getOrderStatus(order.current_order_status)}</td>
							// </tr>
						))}
					</tbody>
				</table>
				{
					<div className="bottom-4 flex items-center w-full justify-center bg-transparent px-4 py-3 sm:px-6 mt-4">
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
				{!loading && <div className='w-full flex justify-center'><FaSpinner className='animate-spin size-10 text-cyan-600' /></div>}
			</div>
		</div>
	)
}