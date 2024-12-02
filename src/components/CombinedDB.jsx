import React, { useState } from 'react';
import QueryDatabase from '../components/QueryDatabase';
import CombinedConversattion from '../components/CombinedConversattion';
import AudioComponent from '../components/AudioComponent';
import QueryPrint from '../components/QueryPrint';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const CombinedDB = () => {

    const [question, setQuestion] = useState('');
    const [selectedDatabase, setSelectedDatabase] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleDatabaseChange = (e) => {
        setSelectedDatabase(e.target.value);
    };

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    const api = axios.create({
        baseURL: 'http://127.0.0.1:8000/api'
    });

    const handleSubmit = async () => {
        if (!question || !selectedDatabase) {
            alert("Please enter a question and select a database.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/query-database', {
                question: question,
                database: selectedDatabase,
            });
            // console.log(response.data)
            setAnswer(response.data.answer);
        } catch (error) {
            console.error('Error querying database:', error);
            setAnswer('An error occurred while querying the database.');
        }
        setIsLoading(false);
    };
    return (
        <div className='flex w-full gap-10 p-5'>
            <div className='w-[25%] h-[200px] bg-gray-400 p-5 rounded-lg shadow-md'>
                <h1 className='text-2xl font-bold mb-4 text-black'>Select Database to Query</h1>
                <div className='flex justify-start items-start flex-col '>
                    <label className='mb-2 text-xl cursor-pointer'>
                        <input
                            type='radio'
                            name='database'
                            value='print'
                            checked={selectedDatabase === 'print'}
                            onChange={handleDatabaseChange}
                            className='mr-2 cursor-pointer'
                        />
                        Print Database
                    </label>
                    <label className='mb-2 text-xl cursor-pointer'>
                        <input
                            type='radio'
                            name='database'
                            value='video'
                            checked={selectedDatabase === 'video'}
                            onChange={handleDatabaseChange}
                            className='mr-2 cursor-pointer'
                        />
                        Video Database
                    </label>
                    <label className='mb-2 text-xl cursor-pointer'>
                        <input
                            type='radio'
                            name='database'
                            value='audio'
                            checked={selectedDatabase === 'audio'}
                            onChange={handleDatabaseChange}
                            className='mr-2 cursor-pointer'
                        />
                        Audio Database
                    </label>
                </div>
            </div>
            <div className=" bg-gray-400 flex items-center  flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-[60%] w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-blue-700">Query  Database</h1>
                    </div>
                    <div className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="question" className="block text-sm font-bold text-black">
                                Your Question bellow:
                            </label>
                            <textarea
                                id="question"
                                name="question"
                                rows="3"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Enter your question here"
                                value={question}
                                onChange={handleQuestionChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-black">Select  Database:</label>
                            <div className="mt-2 space-y-2">
                                <div className="flex items-center">
                                    <input
                                        id="sports"
                                        name="database"
                                        type="radio"
                                        value="sports"
                                        onChange={handleDatabaseChange}
                                        className="focus:ring-blue-600 h-4 w-4 text-blue-600 border-gray-500"
                                    />
                                    <label htmlFor="sports" className="ml-3 block text-sm font-semibold text-gray-700">
                                        Sports Database
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="politics"
                                        name="database"
                                        type="radio"
                                        value="politics"
                                        onChange={handleDatabaseChange}
                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <label htmlFor="politics" className="ml-3 block text-sm font-semibold  text-gray-700">
                                        Political News Database
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="industry"
                                        name="database"
                                        type="radio"
                                        value="industry"
                                        onChange={handleDatabaseChange}
                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <label htmlFor="industry" className="ml-3 block text-sm font-semibold  text-gray-700">
                                        Industry News Database
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={handleSubmit}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Querying...' : 'Submit'}
                            </button>
                        </div>

                    </div>

                </div>
                {answer && (
                    <div className="mt-4 p-4 border border-gray-400  w-[90%] rounded-md bg-black">
                        <h2 className="text-lg font-bold text-white">Answer</h2>
                        <ReactMarkdown className={`flex justify-start flex-col py-2 text-gray-400 items-start leading-7`}>{answer}</ReactMarkdown>
                        {/* <p className="mt-2 text-white">{answer}</p> */}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CombinedDB