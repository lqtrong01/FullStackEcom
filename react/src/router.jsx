import { Navigate, Outlet, createBrowserRouter, useOutletContext } from "react-router-dom";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import App from "./user_website/App";
import Home from "./user_website/views/home";
import Shop from "./user_website/views/shop";
import About from "./user_website/views/about";
import Contact from "./user_website/views/contact";
import Cart from "./user_website/views/cart";
import AdminProducts from "./admin/pages/Products";
import Order from "./admin/pages/Order";
import Customer from "./admin/pages/Customers";
import GuestLayout from "./components/GuestLayout";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Transaction from "./admin/pages/Transaction";
import Category from "./admin/pages/Categorys";
import UserEdit from "./admin/components/UserEdit";
import ProductCreate from "./admin/components/ProductCreate";
import ClientDetails from "./admin/components/UserDetail";
import Setting from "./admin/pages/Settings";
import UserCreate from "./admin/components/UserCreate";
import ProductEdit from "./admin/components/ProductEdit";
import ShippingMethod from "./admin/pages/ShippingMethod";
import ProductOverview from "./user_website/components/ProductOverview";
import DropdownMenu from "./user_website/components/DropDownMenu";
import Sidebar from "./user_website/components/UserSidebar";
import Results from "./user_website/components/Result";
import Checkout from "./user_website/components/Checkout";
import UserProfile from "./user_website/components/UserProfile";
import Favorites from "./user_website/components/Favourite";
import AddressBook from "./user_website/components/EditAddress";
import EditProfile from "./user_website/components/EditProfile";
import OrderList from "./user_website/components/UserOrder";
import OrderDetail from "./user_website/components/OrderDetail";
import GeocodingService from "./components/MapContainer";
import OrderPage from "./user_website/components/OrderPage";
import Reviews from "./admin/pages/Reviews";


const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        index:true,
        path: '/',
        element: <Navigate to="/login" />
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/home",
        element: <Home />
      },
      {
        path: "/shop",
        element: <Shop />
      },
      {
        path: "/cart",
        element: <Cart />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/contact",
        element: <Contact />
      },
      {
        path: "/product/:id",
        element: <ProductOverview />
      },
      {
        path:'/checkout',
        element:<OrderPage/>
      },
      {
        path: '/user',
        element: <div className="flex">
          <Sidebar />
          <div className="flex-1 p-8">
            <Outlet />
          </div>
        </div>,
        children: [
          {
            path:'/user/profile',
            element:<EditProfile/>
          },
          {
            path:'/user/order',
            element:<OrderList/>
          },
          {
            path:'/user/order/:id',
            element:<OrderDetail/>
          },
          {
            path:'/user/favourite',
            element:<Favorites/>
          },
          {
            path:'/user/address',
            element:<AddressBook/>
          },
          {
            path:'/user/setting',
            element:<>Setting</>
          }
        ]
      }
    ]
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,  // This makes it the default route when "/admin" is accessed
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "/admin/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/admin/products",
        element: <AdminProducts />,
      },
      {
        path: "/admin/product/:id/edit",
        element: <ProductEdit />
      },
      {
        path: "/admin/product/create",
        element: <ProductCreate />
      },
      {
        path: '/admin/category',
        element: <Category />
      },
      {
        path: '/admin/orders',
        element: <Order />
      },
      {
        path: '/admin/customers',
        element: <Customer />,
      },
      {
        path: '/admin/customer/create',
        element: <UserCreate />
      },
      {
        path: '/admin/customer/:id/profile',
        element: <ClientDetails />
      },
      {
        path: '/admin/customer/:id/edit',
        element: <UserEdit />
      },
      {
        path: '/admin/shipping_method',
        element: <ShippingMethod />
      },
      {
        path: '/admin/transactions',
        element: <Transaction />
      },
      {
        path: '/admin/settings',
        element: <Setting />
      },
      {
        path: '/admin/promotions',
        element: <>Promotion</>
      },
      {
        path:'/admin/reviews',
        element:<Reviews/>
      }
    ],
  },
  {
    path:'/render',
    element:<OrderPage/>
  }
]);

export default router;
