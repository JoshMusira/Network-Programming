import React, { useState } from 'react';

const channels = ["cnn", "bbc-news", "cbc-news", "al-jazeera-english", "cbs-news", "fox-news", "time", "usa-today", "the-wall-street-journal", "reuters", "mtv-news-uk", "google-news-ru","handelsblatt", "die-zeit","el-mundo","goteborgs-posten","mtv-news-uk","politico","xinhua-net","ynet","wirtschafts-woche"];
const topics = ["select all", "Rishi Sunak", "Keir Starmer", "Joe Biden", "Donald Trump", "Modi", "Kamala Harris", "Xi Jinping", "Vladimir Putin", "Kim Jong Un", "Angela Merkel","Frank-Walter Steinmeier","Olaf Scholz"];

const NewsSelection = () => {
    const [selectedChannels, setSelectedChannels] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDatabase, setSelectedDatabase] = useState('');
    const [wordCloudImage, setWordCloudImage] = useState('');

    const handleChannelChange = (event) => {
        const value = event.target.value;
        setSelectedChannels(prev =>
            prev.includes(value) ? prev.filter(channel => channel !== value) : [...prev, value]
        );
    };
    const handleDatabaseChange = (e) => {
        setSelectedDatabase(e.target.value);
    };

    const handleTopicChange = (event) => {
        const value = event.target.value;
        if (value === 'select all') {
            setSelectedTopics(prev =>
                prev.length === topics.length ? [] : topics
            );
        } else {
            setSelectedTopics(prev =>
                prev.includes(value) ? prev.filter(topic => topic !== value) : [...prev, value]
            );
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const filteredTopics = selectedTopics.filter(topic => topic !== 'select all');
        const payload = {
            selected_channels: selectedChannels,
            selected_topics: filteredTopics,
            start_date: startDate,
            end_date: endDate,
            database: selectedDatabase
        };
        console.log('Payload:', payload);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/upload_news_combined', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Success: ${data.message}`)
                console.log('Success:', data);
            } else {
                alert(`Error: ${error.message}`)
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            alert('Error:', error)
            console.error('Error:', error);
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (
        <div className="p-5 flex flex-col justify-start items-start rounded-lg shadow-md pb-12 ">
            <h1 className="text-2xl font-bold text-gray-400 mb-1"><span className='text-white'>2.1:</span> Select News Channel</h1>
            <div className="grid grid-cols-1  mx-auto h-[150px]  overflow-y-auto gap-3 w-[80%] shadow-sm shadow-white p-5 rounded-lg">
                {channels.map(channel => (
                    <label key={channel} className="mr-4 flex items-center text-white text-xl">
                        <input
                            type="checkbox"
                            value={channel}
                            checked={selectedChannels.includes(channel)}
                            onChange={handleChannelChange}
                            className="mr-2 text-xl"
                        />
                        {channel}
                    </label>
                ))}
            </div>

            <h1 className="text-2xl font-bold text-gray-400 my-2 mb-1"><span className='text-white'>2.2:</span> Select News Topics</h1>
            <div className="mb-4 grid grid-cols-1 h-[100px]  overflow-y-auto w-[60%] mx-auto shadow-sm shadow-white p-5 rounded-lg">
                {topics.map(topic => (
                    <label key={topic} className="mr-4 mb-2 flex items-center text-white text-xl">
                        <input
                            type="checkbox"
                            value={topic}
                            checked={selectedTopics.includes(topic)}
                            onChange={handleTopicChange}
                            className="mr-2"
                        />
                        {topic}
                    </label>
                ))}
            </div>

            <h1 className="text-2xl font-bold text-gray-300 mb-1"><span className='text-white'>2.3:</span> Select Timeframe</h1>
            <div className="flex w-[60%] justify-between  mx-auto my-5 mb-4 shadow-sm shadow-white p-5 rounded-lg">
                <label className="mb-2 text-xl text-white">
                    Start Date:
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="ml-2 p-1 border text-white rounded-lg"
                    />
                </label>
                <label className="mb-2 text-xl text-white">
                    End Date:
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="ml-2 p-1 border text-white rounded-lg"
                    />
                </label>
            </div>
            <h1 className="text-2xl font-bold text-gray-300 mb-1"><span className='text-white'>2.4:</span> Select Database</h1>
            <select
                className='form-select-home ml-20 py-2 my-2 w-[200px] rounded-lg px-2 cursor-pointer'
                value={selectedDatabase}
                onChange={handleDatabaseChange}
                required
            >
                <option value="" disabled>Select Database</option>
                <option value="sports_print">Sports Database</option>
                <option value="politics_print">Political News Database</option>
                <option value="industry_print">Industry News Database</option>
            </select>

            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-[150px] text-black font-bold text-xl p-2 rounded-lg ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    }`}
            >
                {isLoading ? "Loading..." : "Collect News"}
            </button>

        </div>
    );
};

export default NewsSelection;
