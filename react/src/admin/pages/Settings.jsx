import React from 'react';

const Setting = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6">
                <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700">App Name:</label>
                            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="InfyInvoices" required />
                        </div>
                        <div>
                            <label className="block text-gray-700">Company Name:</label>
                            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="InfyInvoices" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700">Country Code:</label>
                            <div className="flex">
                                <select className="p-2 border w-20 border-gray-300 bg-indigo-600 rounded-l">
                                    <option>+91</option>
                                    {/* Add more country codes here */}
                                </select>
                                <input type="number" maxLength={10} className="w-full p-2 border-t border-r border-b border-gray-300 rounded-r" placeholder="9099989898" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700">Date Format:</label>
                            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="YYYY-MM-DD" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700">Manual Payment Approval:</label>
                            <div className="flex items-center mt-1">
                                <input type="checkbox" className="form-checkbox" />
                                <span className="ml-2">Auto Approve</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700">Time Format:</label>
                            <div className="flex mt-1">
                                <button type="button" className="w-full p-2 border border-gray-300 rounded-l bg-blue-500 text-white">12 Hour</button>
                                <button type="button" className="w-full p-2 border border-gray-300 rounded-r">24 Hour</button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700">Country:</label>
                            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="India" required />
                        </div>
                        <div>
                            <label className="block text-gray-700">State:</label>
                            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="Gujarat" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700">City:</label>
                            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="Surat" required />
                        </div>
                        <div>
                            <label className="block text-gray-700">Zip Code:</label>
                            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="394101" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700">Company Address:</label>
                            <textarea className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="C-303, Atlanta Shopping Mall, Nr. Sudama Chowk, Mota Varachha, Surat - 394101, Gujarat, India." required></textarea>
                        </div>
                        <div>
                            <label className="block text-gray-700">App Logo:</label>
                            <div className="mt-1">
                                <img src="/path/to/logo.png" alt="App Logo" className="w-16 h-16 rounded" />
                                <input type="file" className="mt-2" />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700">VAT No Label:</label>
                            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="GSTIN" />
                        </div>
                        <div>
                            <label className="block text-gray-700">Show Additional Address in Invoice:</label>
                            <div className="flex items-center mt-1">
                                <input type="checkbox" className="form-checkbox"/>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Save</button>
                        <button type="button" className="bg-gray-300 text-gray-700 py-2 px-4 rounded">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Setting;
