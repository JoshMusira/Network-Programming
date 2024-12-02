import React, { useState } from 'react';
import axios from 'axios';

const NewsUpload = () => {
    const [names, setNames] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/upload_news', {
                names,
                start_date: startDate,
                end_date: endDate
            });

            if (response.status === 201) {
                setMessage('News articles uploaded successfully');
                setMessageType('success');
            } else {
                setMessage('Unexpected response from the server');
                setMessageType('error');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className=" flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
            <div className=" w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-blue-600">Upload Politicians News</h1>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="names" className="sr-only">Names</label>
                            <input
                                id="names"
                                name="names"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-slate-50 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Enter names... Eg. Biden Or Trump ..."
                                value={names}
                                onChange={(e) => setNames(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="start-date" className="sr-only">Start Date</label>
                            <input
                                id="start-date"
                                name="start-date"
                                type="date"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-slate-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Start Date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="end-date" className="sr-only">End Date</label>
                            <input
                                id="end-date"
                                name="end-date"
                                type="date"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-slate-50 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="End Date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Uploading...' : 'Upload News'}
                        </button>
                    </div>
                    {message && (
                        <div className={`mt-4 p-4 border rounded-md ${messageType === 'success' ? 'bg-green-50 border-green-300 text-green-700' : 'bg-red-50 border-red-300 text-red-700'}`}>
                            <p>{message}</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default NewsUpload;
