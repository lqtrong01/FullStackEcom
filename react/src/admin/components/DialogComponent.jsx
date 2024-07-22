import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import axiosClient from "../../axios"
import { useState } from "react"
import { useStateContext } from "../../contexts/ContextProvider"
import { useNavigate } from "react-router-dom"

const DialogComponent = ({ title = "", value = {}, _value, setValue, show, setShow, id, setLoading, loadForm }) => {
    const [thisValue, setThisValue] = useState("")
    const [method, setMethod] = useState({})
    const { setNotification } = useStateContext()
    const navigate = useNavigate()
    const [error, setError] = useState({ __html: "" });

    const category = {
        'category_name': thisValue
    }
    const onSubmit = () => {
        setError({ __html: "" });
        if (title === "Add Category") {
            if (!thisValue) {
                alert('Please confirm the name if Category before Add')
            }
            else {

                axiosClient
                    .post(`/product_category`,
                        category
                    )
                    .then(({ data }) => {
                        setNotification(data.message,true)
                        // alert(data.message)
                        setShow(false)
                        setLoading(!loadForm)
                        window.reload()
                    }).catch(({response}) => {
                        if (response) {
                            console.log(response);
                            if (response.data && response.data.errors) {
                                const finalErrors = Object.values(response.data.errors).reduce((accum, next) => [...accum, ...next], []);
                                console.log(finalErrors);
                                setError({
                                    __html: finalErrors.join('<br>'),
                                    message: response.data.message,
                                    errors: finalErrors
                                });
                            }
                            console.error(response);
                        }
                    });
                    
            }
        } else if (title === "Edit Category") {
            axiosClient.put(`/product_category/${id}`, {
                'category_name': _value
            })
                .then(({ data }) => {
                    setNotification(data.message,true)
                    // alert(data.message)
                    setShow(false)
                    setLoading(!loadForm)
                })
                .catch(({response}) => {
                    if (response) {
                        console.log(response);
                        if (response.data && response.data.errors) {
                            const finalErrors = Object.values(response.data.errors).reduce((accum, next) => [...accum, ...next], []);
                            console.log(finalErrors);
                            setError({
                                __html: finalErrors.join('<br>'),
                                message: response.data.message,
                                errors: finalErrors
                            });
                        }
                        console.error(response);
                    }
                });
                
            // alert(`Update category ${value}`)
        }

        if (title === "Add Shipping Method") {
            if (!method) {
                alert('Please confirm the name if Method before Add')
            }
            else {
                axiosClient
                    .post(`/shipping_method`,
                        method
                    )
                    .then(({ data }) => {
                        setNotification(data.message,true)
                        setShow(false)
                        setLoading(!loadForm)
                        navigate('/admin/shipping_method')
                    }).catch(({response}) => {
                        if (response) {
                            console.log(response);
                            if (response.data && response.data.errors) {
                                const finalErrors = Object.values(response.data.errors).reduce((accum, next) => [...accum, ...next], []);
                                console.log(finalErrors);
                                setError({
                                    __html: finalErrors.join('<br>'),
                                });
                            }
                            console.error(response);
                        }
                    });
                    
            }
        } else if (title === "Edit Shipping Method") {
            if (!value) {
                alert('Vui lòng nhập đầy đủ dữ liệu')
            }

            const update = {
                name: value.name,
                price: parseFloat(value.price).toFixed(2)
            }
            axiosClient.put(`/shipping_method/${id}`, update)
                .then(({ data }) => {
                    setNotification(data.message, true)
                    // alert(data.message)
                    setShow(false)
                    setLoading(!loadForm)
                }).catch(({response}) => {
                    if (response) {
                        console.log(response);
                        if (response.data && response.data.errors) {
                            const finalErrors = Object.values(response.data.errors).reduce((accum, next) => [...accum, ...next], []);
                            console.log(finalErrors);
                            setError({
                                __html: finalErrors.join('<br>'),
                                message: response.data.message,
                                errors: finalErrors
                            });
                        }
                        console.error(response);
                    }
                });
                
        }
    }

    return (
        <Dialog className="relative z-10" open={show} onClose={setShow}>
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
                        <div className="relative flex flex-col w-auto justify-center items-center outline-none border rounded-md bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                            <div className="flex w-full flex-shrink-0 items-center justify-around border-b-2 border-indigo-500 rounded-tl-lg rounded-tr-lg">
                                <div class="flex-1 ">
                                    <h2>{title}</h2>
                                </div>
                                <div >
                                    <XMarkIcon onClick={() => setShow(false)} className="h-6 w-6 text-black hover:text-red-500 cursor-pointer" aria-hidden="true" />
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
                                    <label className="block text-sm font-medium text-gray-700">Name:<span className="text-red-500">*</span></label>
                                    {(title === 'Add Category' || title === 'Edit Category') && <input
                                        type="text"
                                        value={_value ?? thisValue}
                                        onChange={(e) => setThisValue(e.target.value) ?? setValue(e.target.value)}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="Name"
                                    />}
                                    {(title === 'Add Shipping Method' || title === 'Edit Shipping Method') && <div>
                                        <input
                                            type="text"
                                            value={method.name ?? value.name}
                                            onChange={(e) => setMethod({ ...method, name: e.target.value }) ?? setValue({ ...value, name: e.target.value })}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                            placeholder="Name"
                                        />
                                        <label className="block text-sm font-medium text-gray-700 mt-2">Price:<span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            value={method.price ?? value.price}
                                            onChange={(e) => setMethod({ ...method, price: e.target.value }) ?? setValue({ ...value, price: e.target.value })}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                            placeholder="Price"
                                        />
                                    </div>}
                                </div>
                            </div>
                            <div className=" w-full flex justify-end items-center gap-4 mt-6">
                                <button
                                    onClick={() => onSubmit()}
                                    type="submit" className="w-[80px] h-[40px] border-none outline-none bg-sky-500 text-1xl  hover:bg-cyan-950-600 text-slate-100 rounded-md"
                                >
                                    Save
                                </button>
                                <button onClick={() => setShow(false)} type="button" className="h-[40px] w-[70px] border-none outline-none bg-gray-500 text-1xl  hover:bg-cyan-950-600 text-slate-100 rounded-md">Cancle</button>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}

export default DialogComponent