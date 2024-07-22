import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import Logo from "../assets/logo.png"
import { FaSpinner } from "react-icons/fa";
import axiosClient from "../axios";

export default function GuestLayout() {
  const { userToken, currentUser, setCurrentUser } = useStateContext();
  if(userToken) {
    axiosClient.get('/me')
        .then(({ data }) => {
            setCurrentUser(data.user)
        }).catch((err)=>{
            setCurrentUser({})
        })
  }
  if (currentUser.role === 'Super Admin') {
    return <Navigate to='/admin' />;
  } else if (currentUser.role === 'User') {

    return <Navigate to='/home' />;
  }

  return (
    <>
    {userToken && currentUser && <div className="w-full flex flex-col gap-4 justify-center items-center"><FaSpinner className="animate-spin text-cyan-600 size-11"/>Waitting...</div>}
    {!userToken && <div>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md shadow-lg">
          <div className="bg-slate-50 rounded-lg rounded-b-none">
            <img
              className="object-contain h-36 w-full"
              src={Logo}
              alt="TTShop"
            />
          </div>
          <Outlet/>
        </div>
      </div>
    </div>}
    </>
  )
}