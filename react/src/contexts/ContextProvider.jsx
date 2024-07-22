import { useContext, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import axiosClient from "../axios";

const StateContext = createContext({
    currentUser: {},
    userToken: null,
    notification: null,
    toast: {
        message: null,
        show: false,
    },
    products: null,
    setProducts: () => { },
    setCurrentUser: () => { },
    setUserToken: () => { },
    setNotification: () => { }
});


export const ContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});
    const [userToken, _setUserToken] = useState(
        localStorage.getItem("TOKEN") || ""
    );
    const [notification, _setNotification] = useState({ message: "", show: false })
    const [products, setProducts] = useState([]);
    const [toast, setToast] = useState({ message: "", show: false });

    const setUserToken = (token) => {
        if (token) {
            localStorage.setItem("TOKEN", token);
        } else {
            localStorage.removeItem("TOKEN");
        }
        _setUserToken(token);
    };

    useEffect(() => {
        axiosClient.get('/product')
            .then(({ data }) => {
                setProducts(data.data)
            })
            .catch(({ err }) => {
                console.error(err)
            })
    }, [])

    useEffect(() => {
        // Lấy thông tin người dùng khi có userToken
        if (userToken) {
            axiosClient.get('/me', {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            })
                .then(({ data }) => {
                    setCurrentUser(data.user);
                })
                .catch((error) => {
                    console.error("Lỗi khi lấy thông tin người dùng:", error);
                });
        }
    }, [userToken]);

    const showToast = (message) => {
        setToast({ message, show: true });
        setTimeout(() => {
            setToast({ message: "", show: false });
        }, 5000);
    };

    const setNotification = (message, bool) => {
        _setNotification({ message: message, show: bool })
        setTimeout(() => {
            _setNotification({ message: "", show: false })
        }, 5000)
    }

    return (
        <StateContext.Provider
            value={{
                currentUser,
                setCurrentUser,
                userToken,
                setUserToken,
                setProducts,
                products,
                toast,
                showToast,
                notification,
                setNotification
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);

export const formatCurrency = (money) => {
    let config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9 }
    return new Intl.NumberFormat('vi-VN', config).format(money);
}

export const convertTimestampToDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
};

export const convertTimestampToDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getUTCFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
}