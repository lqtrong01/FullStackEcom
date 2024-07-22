import { Link, useNavigate } from "react-router-dom";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import axiosClient from '../axios.js'
import { useStateContext } from "../contexts/ContextProvider.jsx";
import { EyeDropperIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Signup() {
  const { setCurrentUser, setUserToken, setNotification } = useStateContext();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState({ __html: "" });
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const onSubmit = (ev) => {
    ev.preventDefault();
    setError({ __html: "" });
    axiosClient
      .post("/signup", {
        name: fullName,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
      })
      .then(({ data }) => {
        setCurrentUser(data.user)
        setUserToken(data.token)
        setNotification(`Welcome ${data.user.name}`, true)
        navigate('/home')
      })
      .catch((error) => {
        if (error.response) {
          const finalErrors = Object.values(error.response.data.errors).reduce((accum, next) => [...accum, ...next], [])
          console.log(finalErrors)
          setError({ __html: finalErrors.join('<br/>') })
        }
        console.error(error)
      });
  };

  return (
    <div className="p-5 bg-slate-50 rounded-lg rounded-t-none">
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Signup
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Or{" "}
        <Link
          to="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Login with your account
        </Link>
      </p>

      {error.__html && (<div className="bg-red-500 rounded py-2 px-3 text-white" dangerouslySetInnerHTML={error}>
      </div>)}

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-6"
        action="#"
        method="POST"
      >
        <input type="hidden" name="remember" defaultValue="true" />
        <div className="-space-y-px rounded-md shadow-sm">
          <div>
            <label htmlFor="full-name" className="sr-only">
              Full Name
            </label>
            <input
              id="full-name"
              name="name"
              type="text"
              required
              value={fullName}
              onChange={ev => setFullName(ev.target.value)}
              className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Full Name"
            />
          </div>
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={ev => setEmail(ev.target.value)}
              className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={ev => setPassword(ev.target.value)}
              className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>

          <div className="relative mt-2">
            <label htmlFor="password-confirmation" className="sr-only">
              Password Confirmation
            </label>
            <input
              id="password-confirmation"
              name="password_confirmation"
              type={showPasswordConfirmation ? 'text' : 'password'}
              required
              value={passwordConfirmation}
              onChange={ev => setPasswordConfirmation(ev.target.value)}
              className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Password Confirmation"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
            >
              {showPasswordConfirmation ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="group relative uppercase flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {/* <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <LockClosedIcon
                className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                aria-hidden="true"
              />
            </span> */}
            Signup
          </button>
        </div>
      </form>
    </div>
  );
}