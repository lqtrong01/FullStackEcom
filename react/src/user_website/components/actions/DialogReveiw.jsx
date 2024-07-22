import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import axiosClient from "../../../axios";
import { useStateContext } from "../../../contexts/ContextProvider";

const DialogReview = ({ title, _value, setValue, show, setShow, setLoading, id, loading }) => {
    const [error, setError] = useState("");
    const [thisValue, setThisValue] = useState(_value?.comment ?? "");
    const [rating, setRating] = useState(0);
    const {currentUser, setNotification} = useStateContext()
    const onSubmit = (e) => {
        e.preventDefault()
        if (!thisValue.trim()) {
            setError('Please enter the comment.');
            return;
        }

        if (rating === 0) {
            setError('Please select a rating.');
            return;
        }

        axiosClient.put(`/review/${id}`, {
            user_id:currentUser.id,
            comment: thisValue,
            rating_value: rating,
            // Other data to submit
        }).then(({data}) => {
            // Handle success
            setNotification('Review submitted successfully.', true);
            setRating(0)
            setThisValue(_value?.comment ?? "")
            setShow(false);
            setLoading(!loading);
        }).catch(error => {
            // Handle error
            setError('Failed to submit review. Please try again later.');
            setNotification('Failed to submit review. Please try again later.', false)
            setLoading(!loading);
        });
    };

    return (
        <Dialog open={show} onClose={setShow}>
            <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <DialogPanel className="fixed inset-0 flex items-center justify-center">
                <div className="relative max-w-sm w-full bg-white shadow-xl rounded-lg p-6">
                    <div className="flex justify-between items-center border-b-2 pb-4 mb-4">
                        <h2 className="text-lg font-semibold">{title}</h2>
                        <XMarkIcon
                            className="h-6 w-6 text-black hover:text-red-500 cursor-pointer"
                            onClick={() => setShow(false)}
                            aria-hidden="true"
                        />
                    </div>
                    <div className="space-y-4">
                        {error && (
                            <div className="bg-red-500 text-white py-2 px-3 rounded">{error}</div>
                        )}
                        <label className="block text-sm font-medium text-gray-700">
                            Comment:<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={thisValue}
                            onChange={(e) => setThisValue(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Comment"
                        />
                        <label className="block text-sm font-medium text-gray-700">
                            Rating:<span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`text-3xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'} focus:outline-none`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        {title === 'Edit Comment' && (
                            <button
                                onClick={onDelete}
                                className="w-24 h-10 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        )}
                        <button
                            onClick={onSubmit}
                            className="w-24 h-10 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setShow(false)}
                            className="w-20 h-10 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </DialogPanel>
        </Dialog>
    );
};

export default DialogReview;
