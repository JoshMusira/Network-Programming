import React, { useState } from 'react';
import axios from 'axios';

const AnalysisComponent = () => {
    const [question, setQuestion] = useState('');
    const [database, setDatabase] = useState('sports_print');
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    const handleDatabaseChange = (e) => {
        setDatabase(e.target.value);
    };

    const api = axios.create({
        baseURL: 'http://127.0.0.1:8000/api'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.post('/analyze', { question, database });
            setResult(response.data);
        } catch (error) {
            console.error('Error fetching the analysis:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg'>
            <h2 className='text-4xl font-bold text-black text-center mb-4'>Visualize Your Data</h2>
            <form onSubmit={handleSubmit} className='space-y-6 flex w-full gap-5 justify-center items-center'>
                <div className='flex flex-col w-[55%]'>
                    <label htmlFor='question' className='text-lg font-medium text-black mb-2'>Question:</label>
                    <input
                        id='question'
                        type='text'
                        className='border w-full border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={question}
                        onChange={handleQuestionChange}
                    />
                </div>
                <div className='flex flex-col w-[20%]'>
                    <label htmlFor='database' className='text-lg font-medium text-black mb-2'>Database:</label>
                    <select
                        id='database'
                        className='border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={database}
                        onChange={handleDatabaseChange}
                    >
                        <option value='sports_print'>Sports</option>
                        <option value='politics_print'>Politics</option>
                        <option value='industry_print'>Industry</option>
                    </select>
                </div>
                <button
                    type='submit'
                    className={`w-[20%] p-3 bg-blue-500 text-white font-semibold py-3 rounded-lg transition duration-200 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'Submit'}
                </button>
            </form>
            {result && (
                <div className='mt-6'>
                    <img src={`data:image/png;base64,${result.graph}`} alt='Graph' className='mx-auto' />
                </div>
            )}
        </div>
    );
};

export default AnalysisComponent;
