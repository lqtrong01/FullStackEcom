import React, { useEffect, useState } from 'react'
import { IoBagHandle, IoPieChart, IoPeople, IoCart } from 'react-icons/io5'
import axiosClient from '../../axios'
import Spinner from '../../assets/Spinner.png'
import { formatCurrency } from '../../contexts/ContextProvider'

export default function DashboardStatsGrid() {
	const [customer, setCustomer] = useState([])
	const [loading, setLoading] = useState(true)
	const [order, setOrder] = useState([])
	const [totalPrice, setTotalPrice] = useState(0)
	const [totalExpress, setTotalExpress] = useState(0)

	useEffect(() => {
		setLoading(false)
		axiosClient.get('/order/admin')
			.then(({ data }) => {
				setLoading(true)
				setOrder(data.data)
				let total = data.data.reduce((sum, item)=>{
					return sum+(item.order_status===5?Number(item.order_total):0)
				},0)
				setTotalPrice(Number(total))
				let express = data.data.reduce((sum, item)=>{
					return sum+(item.order_status!==5?Number(item.order_total):0)
				},0)
				setTotalExpress(Number(express))
			})
			.catch(({ err }) => {
				setLoading(false)
			})
		axiosClient.get('/user')
			.then(({ data }) => {
				setLoading(true)
				setCustomer(data.data)
			})
			.catch(({ err }) => {
				setLoading(false)
			})
	}, [])
	return (
		<>
			<div className="flex gap-4">
				<BoxWrapper>
					<div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
						<IoBagHandle className="text-2xl text-white" />
					</div>
					<div className="pl-4">
						<span className="text-sm text-gray-500 font-light">Total Sales</span>
						{!loading && <img src={Spinner} className='animate-spin size-10'></img>}
						{loading &&
							<div className="flex items-center">
								<strong className="text-xl text-gray-700 font-semibold">{formatCurrency(totalPrice)}</strong>
								<span className="text-sm text-green-500 pl-2"></span>
							</div>
						}

					</div>
				</BoxWrapper>
				<BoxWrapper>
					<div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-600">
						<IoPieChart className="text-2xl text-white" />
					</div>
					<div className="pl-4">
						<span className="text-sm text-gray-500 font-light">Total Expenses</span>
						{!loading && <img src={Spinner} className='animate-spin size-10'></img>}
						{loading &&
							<div className="flex items-center">
								<strong className="text-xl text-gray-700 font-semibold">{formatCurrency(totalExpress)}</strong>
								<span className="text-sm text-green-500 pl-2"></span>
							</div>
						}
					</div>
				</BoxWrapper>
				<BoxWrapper>
					<div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400">
						<IoPeople className="text-2xl text-white" />
					</div>
					<div className="pl-4">


						<span className="text-sm text-gray-500 font-light">Total Customers</span>
						{!loading && <img src={Spinner} className='animate-spin size-10'></img>}
						{loading && <div className="flex items-center">
							<strong className="text-xl text-gray-700 font-semibold">
								{customer.length}
							</strong>
							<span className="text-sm text-red-500 pl-2"></span>
						</div>
						}
					</div>
				</BoxWrapper>
				<BoxWrapper>
					<div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-600">
						<IoCart className="text-2xl text-white" />
					</div>
					<div className="pl-4">
						<span className="text-sm text-gray-500 font-light">Total Orders</span>
						{!loading && <img src={Spinner} className='animate-spin size-10'></img>}
						{loading && <div className="flex items-center">
							<strong className="text-xl text-gray-700 font-semibold">{order && order.length}</strong>
							<span className="text-sm text-red-500 pl-2"></span>
						</div>}
					</div>
				</BoxWrapper>
			</div>
		</>
	)
}

function BoxWrapper({ children }) {
	return <div className="bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center">{children}</div>
}