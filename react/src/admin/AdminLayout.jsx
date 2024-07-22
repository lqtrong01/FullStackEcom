import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./components/shared/Sidebar";
import Header from "./components/shared/Header";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios";
import { FaSpinner } from "react-icons/fa";
import { CheckBadgeIcon, CheckIcon, XCircleIcon } from "@heroicons/react/24/outline";
const AdminLayout = () => {
	const { notification, userToken, currentUser, setCurrentUser, setUserToken } = useStateContext()
	const navigate = useNavigate()
	const [loading, setLoading] = useState(true)

	if (!userToken) {
		return <Navigate to="/login" />;
	}
	useEffect(()=>{
		axiosClient.get('/me')
		.then(({ data }) => {
			setCurrentUser(data.user)

		}).catch((err) => {
			setCurrentUser({})

		}).finally(() => {
			setLoading(false);
		});
	}, [])
		

	if (loading) {
		return (
			<div className="w-full flex flex-col gap-4 justify-center items-center">
				<FaSpinner className="animate-spin text-cyan-600 size-11" />
				Waiting...
			</div>
		);
	}
	if (currentUser.role === 'User') {
		return <Navigate to="/home" />;
	}


	const logout = () => {
		if (window.confirm('Are you exit this site'))
			axiosClient.post("/logout").then((res) => {
				setCurrentUser({});
				setUserToken(null);
				navigate('/')
			});
	};

	return (
		<>
			{currentUser.role === 'Super Admin' && <div className="bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row">
				<Sidebar logout={logout} />
				<div className="flex flex-col flex-1">
					<Header logout={logout} />
					<div className="flex-1 p-4 min-h-0 overflow-auto">
						<Outlet />
					</div>
				</div>
				{notification.message.length>0 && (
					<div className={`fixed flex z-50 right-4 top-4 ${notification.show?'bg-green-500':'bg-red-500'} text-white p-4 rounded-lg shadow-lg`}>
						{notification.show ?<CheckBadgeIcon className='size-5'/>:<XCircleIcon className='size-5'/>}
						{notification.message}
					</div>
				)}
			</div>}
		</>
	)
}

export default AdminLayout;