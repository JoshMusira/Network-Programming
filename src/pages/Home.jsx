import axios from 'axios';
import React, { useState } from 'react';
import { BounceLoader } from 'react-spinners';
import ReactMarkdown from 'react-markdown';
import NewsUpload from '../components/NewsUpload';
import NewsSelection from '../components/NewsSelection';

const Home = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDatabase, setSelectedDatabase] = useState('');

    const api = axios.create({
        baseURL: 'http://127.0.0.1:8000/api'
    });

    const handleSubmit = async (e) => {
        setAnswer('');
        setIsLoading(true);
        e.preventDefault();
        console.log("Your question: ", question);

        try {
            const response = await api.post('/indexing', { message: question, database: selectedDatabase });
            const data = response.data;

            const responseText = typeof data.response === 'string' ? data.response : JSON.stringify(data.response);
            setAnswer(responseText);
        } catch (error) {
            console.error('Error indexing:', error);
            setAnswer('An error occurred while indexing the URL.');
        }

        setIsLoading(false);
    };

    const handleDatabaseChange = (e) => {
        setSelectedDatabase(e.target.value);
    };

    return (
        <div className='flex flex-col w-[60%] mx-auto h-[80vh]  overflow-y-auto'>
            <div className="group ">
                <h1 className="text-2xl flex flex-start font-bold text-white pb-3 cursor-pointer"><span className='text-gray-300 mr-2'>1.0:</span> Single Article News
                </h1>
                <span className="hidden group-hover:block z-50 absolute bg-slate-400 text-black p-1 px-2 rounded-lg">
                    If you have a single news article and you wish to analyze its content, simply paste the URL below.
                </span>
            </div>
            <form className='w-[95%] flex gap-3' onSubmit={handleSubmit}>
                <input
                    type='text'
                    className='form-input-home'
                    required
                    placeholder='Paste your website URL to  for retrieval ...'
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <select
                    className='form-select-home rounded-sm z-10'
                    value={selectedDatabase}
                    onChange={handleDatabaseChange}
                    required
                >
                    <option value="" disabled>Select Database</option>
                    <option className='pb-2' value="sports_print">Sports Database</option>
                    <option className='pb-2' value="politics_print">Political News Database</option>
                    <option className='pb-2' value="industry_print">Industry News Database</option>
                </select>
                <button
                    type="submit"
                    className='text-2xl w-[20%] font-semibold p-[10px] bg-blue-800 rounded-lg cursor-pointer hover:bg-blue-500 hover:text-black shadow-sm shadow-white'
                >
                    Submit
                </button>
            </form>

            {isLoading && (
                <div className="loader-container">
                    <BounceLoader color="#3498db" />
                </div>
            )}

            {answer && (
                <div className="results-container">
                    <div className="results-answer">
                        <h2 className='text-red-600 mb-2'>Response:</h2>
                        <ReactMarkdown>{answer}</ReactMarkdown>
                    </div>
                </div>
            )}
            <h1 className="text-4xl flex flex-start font-bold text-white pt-5 "> OR </h1>
            <div className="">
                <h1 className="text-2xl flex flex-start font-bold text-white pt-5 "><span className='text-gray-300 mr-2'>2.0: </span>  Print News from Multiple Sources.</h1>
            </div>
            <NewsSelection />
            {/* <NewsUpload /> */}
        </div>
    );
};

export default Home;
