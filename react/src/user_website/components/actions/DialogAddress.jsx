import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useCallback } from "react";
import { useStateContext } from "../../../contexts/ContextProvider";
import axios from "axios";
import axiosClient from "../../../axios";
import { debounce } from "lodash";

const DialogAddress = ({ title, _value, setValue, show, setShow, setLoading, loading, id }) => {
  const [error, setError] = useState({ __html: "" });
  const [thisValue, setThisValue] = useState(_value ? _value.address_line : "");
  const [isValid, setIsValid] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const { currentUser, setNotification } = useStateContext();
  const [handleCounter, setHandleCounter] = useState(0);
  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: query,
            format: 'json',
            addressdetails: 1,
          },
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (thisValue) {
      fetchSuggestions(thisValue);
    } else {
      setSuggestions([]);
    }
  }, [thisValue, fetchSuggestions]);

  const validateAddress = async () => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: thisValue,
          format: 'json',
        },
      });

      if (response.data.length > 0) {
        setIsValid(true);
        setValidationResult(response.data[0]);
      } else {
        setIsValid(false);
        setValidationResult(null);
      }
    } catch (error) {
      console.error('Error validating address:', error);
      setIsValid(false);
      setValidationResult(null);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (isValid === null) {
      alert('Please validate the address before saving.');
      return;
    }

    if (isValid === false) {
      alert('The address is invalid. Please enter a valid address.');
      return;
    }

    setLoading(true);
    if (title === "Add Address") {
      axiosClient
        .post(`/user/address/${currentUser.id}`, { address: thisValue })
        .then(({ data }) => {
          setNotification(data.message, true);
          setLoading(!loading);
          setHandleCounter(1)
          setShow(false);
          window.location.reload()
        })
        .catch(({ response }) => {
          if (response) {
            console.error(response);
            const finalErrors = Object.values(response.data.errors).reduce((accum, next) => [...accum, ...next], []);
            setError({
              __html: finalErrors.join('<br>'),
              message: response.data.message,
              errors: finalErrors,
            });
            setLoading(false);
          }
        });
    } else {
      axiosClient
        .put(`/user/address/${currentUser.id}/${id}`, { address: thisValue })
        .then(({ data }) => {
          setNotification(data.message, true);
          setLoading(!loading);
          setHandleCounter(1)
          setShow(false);
          window.location.reload()
        })
        .catch(({ response }) => {
          if (response) {
            console.error(response);
            const finalErrors = Object.values(response.data.errors).reduce((accum, next) => [...accum, ...next], []);
            setError({
              __html: finalErrors.join('<br>'),
              message: response.data.message,
              errors: finalErrors,
            });
            setLoading(false);
          }
        });
    }
  };

  const onDelete = () => {
    if (window.confirm('Are you sure you want to delete this address: ' + _value + '?')) {
      console.log(_value);
      console.log(currentUser.id);
      axiosClient.delete(`/user/address/${currentUser.id}`, {
        data: { address_id: id } // Chuyển address_id trong data object
      })
      .then(({ data }) => {
        setNotification(data.message, true);
        setLoading(!loading);
        setShow(false);
      })
      .catch(({ response }) => {
        if (response) {
          setNotification(response.data.message, false);
          console.error(response);
          setLoading(false);
        }
      });
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const address = suggestion.display_name;
    setThisValue(address);
    setValue(address);
    setSuggestions([]);
  };

  return (
    <Dialog className="relative z-50" open={show} onClose={() => setShow(false)}>
      <DialogBackdrop
        transition
        className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in md:block"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
          <DialogPanel
            transition
            className="flex max-w-sm transform text-left text-base transition data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in md:my-8 md:max-w-2xl md:px-4 data-[closed]:md:translate-y-0 data-[closed]:md:scale-95 lg:max-w-4xl"
          >
            <div className="relative flex flex-col w-full max-w-screen-lg justify-center items-center outline-none border rounded-md bg-white px-8 pb-10 pt-16 shadow-2xl sm:px-10 sm:pt-10 md:px-12 lg:px-16">
              <div className="flex w-full flex-shrink-0 items-center justify-around border-b-2 border-indigo-500 rounded-tl-lg rounded-tr-lg">
                <div className="flex-1">
                  <h2>{title}</h2>
                </div>
                <div>
                  <XMarkIcon
                    onClick={() => setShow(false)}
                    className="h-6 w-6 text-black hover:text-red-500 cursor-pointer"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div className="w-full items-start gap-x-6 gap-y-8 mt-10">
                <div>
                  {error.__html && (
                    <div
                      className="bg-red-500 w-full flex rounded py-2 px-3 text-white"
                      dangerouslySetInnerHTML={error}
                    ></div>
                  )}
                  <label className="block text-sm font-medium text-gray-700">
                    Address:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={_value ?? thisValue}
                    onChange={(e) => setThisValue(e.target.value) ?? setValue(e.target.value)}
    
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Address"
                  />
                  <ul className="border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                      <li
                        key={suggestion.place_id}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion.display_name}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={validateAddress}
                    type="button"
                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Validate Address
                  </button>
                  {isValid !== null && (
                    <div className={`mt-2 text-${isValid ? 'green' : 'red'}-500`}>
                      {isValid ? 'Address is valid!' : 'Address is invalid.'}
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full flex justify-end items-center gap-4 mt-6">
                {title === 'Edit Address' && (
                  <button
                    onClick={onDelete}
                    type="button"
                    className="w-[80px] h-[40px] border-none outline-none bg-red-600 text-1xl hover:bg-red-700 text-slate-100 rounded-md"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={onSubmit}
                  type="submit"
                  disabled={handleCounter===1}
                  className={`w-[80px] h-[40px] border-none outline-none bg-sky-500 text-1xl hover:bg-sky-600 text-slate-100 rounded-md ${handleCounter===1?'opacity-30 cursor-not-allowed' : ''}`}
                >
                  Save
                </button>
                <button
                  onClick={() => setShow(false)}
                  type="button"
                  className="h-[40px] w-[70px] border-none outline-none bg-gray-500 text-1xl hover:bg-gray-600 text-slate-100 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default DialogAddress;
