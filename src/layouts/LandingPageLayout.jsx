import React, { useState } from 'react';
import { Outlet, NavLink } from "react-router-dom";
import axios from 'axios';
import ConfirmURLs from "../components/ConfirmURLs";
import ConfirmModal from '../components/ConfirmModal ';
// import ConfirmModal from '../components/ConfirmModal';

const LandingPageLayout = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [totalUrls, setTotalUrls] = useState(0);
    const [isTotalUrlsModalOpen, setIsTotalUrlsModalOpen] = useState(false);
    const [isLoadingTotalUrls, setIsLoadingTotalUrls] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState('');

    const collections = [
        'Print Sports News', 'Print Politics News', 'Print Industry News',
        'Local Sports News', 'Local Politics News', 'Local Industry News',
        'Youtube Sports News', 'Youtube Politics News', 'Youtube Industry News',
        'Master_Collections'
    ];

    const api = axios.create({
        baseURL: 'http://127.0.0.1:8000/api'
    });

    const handleDeleteClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        setIsModalOpen(false);
        try {
            const response = await api.post('/delete-collection-content', {
                collectionName: selectedCollection
            });
            alert(response.data.message);
        } catch (error) {
            console.log(error);
            alert("There was an error deleting the collection content!", error);
        }
    };

    const handleTotalUrlsClick = async () => {
        setIsLoadingTotalUrls(true);
        try {
            const response = await api.get('/count-unique-urls');
            setTotalUrls(response.data.message);
            setIsTotalUrlsModalOpen(true);
        } catch (error) {
            console.log(error);
            alert("There was an error fetching the total URLs!", error);
        } finally {
            setIsLoadingTotalUrls(false);
        }
    };

    const handleTotalCombinedUrlsClick = async () => {
        setIsLoadingTotalUrls(true);
        try {
            const response = await api.get('/count-unique-urls-combined');
            setTotalUrls(response.data.message);
            setIsTotalUrlsModalOpen(true);
        } catch (error) {
            console.log(error);
            alert("There was an error fetching the total URLs!", error);
        } finally {
            setIsLoadingTotalUrls(false);
        }
    };

    const handleCloseTotalUrlsModal = () => {
        setIsTotalUrlsModalOpen(false);
    };

    return (
        <div className='w-full'>
            <div className='flex flex-col gap-9 w-full'>
                <div className='flex w-full justify-between items-center gap-10 pb-1'>
                    <div className="flex items-center bg-black justify-center rounded-md animated-shadow">
                        <p className="text-3xl font-bold text-blue-700 p-2">Multi-Rag App</p>
                    </div>
                    <div className="text-sm text-white flex gap-2 justify-end">
                        <div className="relative group my-auto">
                            <NavLink to="#" className="mx-2 text-xl hover:text-[#3a5da2] transition-all duration-300 ease-in-out hover:border-[#285093] p-2">
                                Upload Options
                            </NavLink>
                            <div className="absolute hidden z-50 group-hover:block bg-white text-gray-800 shadow-xl mt-2 rounded-md w-48">
                                <NavLink to="/" className="flex items-start text-sm px-4 py-3 hover:bg-gray-400">Upload Articles</NavLink>
                                <NavLink to="/youtube" className="flex items-start text-sm px-4 py-3 hover:bg-gray-400">YouTube Upload</NavLink>
                                <NavLink to="/local-file-upload" className="flex items-start text-sm px-4 py-3 hover:bg-gray-400">Local Audio Upload</NavLink>
                            </div>
                        </div>
                        <div className="relative group my-auto">
                            <NavLink to="#" className="mx-2 text-xl hover:text-[#3a5da2] transition-all duration-300 ease-in-out hover:border-[#285093] p-2">
                                Ask/Query
                            </NavLink>
                            <div className="absolute hidden hover:flex hover:flex-col hover:items-start z-50 group-hover:block bg-white text-gray-800 shadow-xl mt-2 rounded-md w-48">
                                <NavLink to="combined-conversation" className="block items-start text-sm px-4 py-3 hover:bg-gray-400">Chat Single DB</NavLink>
                                <NavLink to="combined-data-promt" className="block text-sm px-4 py-3 hover:bg-gray-400">Chat Multiple DB</NavLink>
                            </div>
                        </div>
                        <NavLink to="Sources" className="mx-2 text-xl hover:text-[#3a5da2] transition-all duration-300 ease-in-out hover:border-[#285093] p-2">News Sources</NavLink>
                        <NavLink to="visuals" className="mx-2 text-xl hover:text-[#3a5da2] transition-all duration-300 ease-in-out hover:border-[#285093] p-2">Visuals</NavLink>
                        <NavLink to="auth/login" className="mx-2 text-2xl hover:text-[#3a5da2] transition-all duration-300 ease-in-out hover:border-[#285093] text-blue-600 p-2">Login</NavLink>
                        {/* <h1 className="mx-2 text-xl bg-blue-600 rounded-md p-1 cursor-pointer transition-all duration-300 ease-in-out text-white px-2" onClick={handleTotalCombinedUrlsClick}> */}
                            {/* {isLoadingTotalUrls ? "Loading..." : "Total URLs"} */}
                        {/* </h1> */}
                        <h1 className="mx-2 text-xl bg-red-600 rounded-md p-1 cursor-pointer transition-all duration-300 ease-in-out text-black" onClick={handleDeleteClick}>Delete DB Content</h1>
                    </div>
                </div>
                <Outlet />
                <ConfirmModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmDelete}
                >
                    <div className="flex flex-col items-center">
                        <label className="text-black text-lg mb-2">Select Collection to Delete:</label>
                        <select 
                            className="p-2 border rounded-md"
                            value={selectedCollection}
                            onChange={(e) => setSelectedCollection(e.target.value)}
                        >
                            <option value="">Select Collection</option>
                            {collections.map((collection, index) => (
                                <option key={index} value={collection}>{collection}</option>
                            ))}
                        </select>
                    </div>
                </ConfirmModal>
                {/* <ConfirmModal */}
                <ConfirmURLs
                    isOpen={isTotalUrlsModalOpen}
                    onClose={handleCloseTotalUrlsModal}
                    onConfirm={handleCloseTotalUrlsModal}
                >
                    <p className='text-black text-2xl'>Total unique URLs in the database: {totalUrls}</p>
                </ConfirmURLs>
            </div>
        </div>
    );
};

export default LandingPageLayout;
