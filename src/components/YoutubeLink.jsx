
import React, { useState } from 'react';
import axios from 'axios';

const YoutubeLink = () => {
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [audioFileUrl, setAudioFileUrl] = useState('');
    const [transcription, setTranscription] = useState('');
    const [translation, setTranslation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading1, setIsLoading1] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [selectedDatabase, setSelectedDatabase] = useState('');
    const [showSaveButton, setShowSaveButton] = useState(true);
    const [downloadTime, setDownloadTime] = useState('');
    const [TranscribeTime, setTranscribeTime] = useState('');
    const [translate_time, settranslate_time] = useState('');

    const api = axios.create({
        baseURL: 'http://127.0.0.1:8000/api'
    });

    const handleDownloadAudio = async () => {
        setIsLoading(true);
        try {
            const response = await api.post('/download-audio', { youtube_url: youtubeUrl }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                // responseType: 'json'
                responseType: 'blob'
            });
            console.log(response.data)
            const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(audioBlob);
            console.log(url)
            console.log(response.headers)
            console.log(response.data)
            const downloadTime = response.headers['download-time'];
            setDownloadTime(downloadTime);
            setAudioFileUrl(url);
        } catch (error) {
            console.error('Error downloading audio:', error);
        }
        setIsLoading(false);
    };

    const handleTranscribeAudio = async () => {
        setIsLoading1(true);
        try {
            const response = await api.get('/transcribe-audio');
            // const TranscribeTime = response.headers['Transcribe-time'];
            setTranscribeTime(response.data.transcribe_time);
            setTranscription(response.data.transcription);
            setShowSaveButton(true);
        } catch (error) {
            console.error('Error transcribing audio:', error);
        }
        setIsLoading1(false);
    };

    const handleTranslateAudio = async () => {
        setIsLoading2(true);
        try {
            const response = await api.post('/translate-audio');
            settranslate_time(response.data.translate_time);
            setTranslation(response.data.translation);
            setShowSaveButton(true);
        } catch (error) {
            console.error('Error translating audio:', error);
        }
        setIsLoading2(false);
    };

    const handleNewUrlChange = (e) => {
        setYoutubeUrl(e.target.value);
        setAudioFileUrl('');
        setTranscription('');
        setTranslation('');
        setShowSaveButton(false);
    };

    const handleDatabaseChange = (e) => {
        setSelectedDatabase(e.target.value);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const data = {
                youtube_url: youtubeUrl,
                text: transcription || translation,
                database: selectedDatabase
            };
            await api.post('/save-to-database', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            alert('Data saved successfully!');
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data');
        }
        setIsLoading(false);
    };
    const formatDownloadTime = (time) => {
        if (typeof time !== 'number' || isNaN(time)) {
            return 'Invalid time';
        }

        if (time >= 60) {
            const minutes = Math.floor(time / 60);
            const seconds = (time % 60).toFixed(2);
            return `${minutes} min ${seconds} sec`;
        }
        return `${time.toFixed(2)} sec`;
    };



    return (
        <div className="min-h-screen bg-gray-400 flex items-center flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-blue-600">Audio Processor</h1>
                </div>
                <div className="mt-8 space-y-4">
                    <p className=" flex items-start text-black">
                        Step 1:
                    </p>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="youtube-url" className="sr-only">
                                YouTube URL
                            </label>
                            <input
                                id="youtube-url"
                                name="youtube-url"
                                type="text"
                                autoComplete="off"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Enter YouTube URL"
                                value={youtubeUrl}
                                onChange={handleNewUrlChange}
                            />
                        </div>
                    </div>
                    <div>
                        <p className=" flex items-start text-black mb-1">
                            Step 2:
                        </p>
                        <button
                            onClick={handleDownloadAudio}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Downloading...' : 'Download Audio'}
                        </button>
                    </div>
                    {/* {audioFileUrl && ( */}
                    <div>
                    {downloadTime && (
                        <div className="mt-4 text-center text-lg text-green-700">
                            <p>Download completed in {formatDownloadTime(Number(downloadTime))} seconds</p>
                        </div>
                    )}
                        {
                            audioFileUrl && <audio controls src={audioFileUrl} className="w-full mt-4"></audio>
                        }

                        <p className=" flex items-start text-black">
                            Step 3.0:
                        </p>
                        <button
                            onClick={handleTranscribeAudio}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mt-1 ${isLoading1 ? 'bg-green-600 cursor-not-allowed' : ' cursor-pointer mb-1'}`}
                            disabled={isLoading1}
                        >
                            {isLoading1 ? 'Translating...' : 'Translate Audio'}
                        </button>
                        {TranscribeTime && <p className='text-black'>Transcribe time: {formatDownloadTime(Number(TranscribeTime))}</p>}
                        <p className=" flex items-start text-black pt-2">
                            Step 3.1:
                        </p>
                        <button
                            onClick={handleTranslateAudio}
                            className={`first-line:group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 mt-1 ${isLoading2 ? 'bg-yellow-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-yellow-700 cursor-pointer'}`}
                            disabled={isLoading2}
                        >
                            {isLoading2 ? 'Transcribing...' : 'Transcribe Audio'}
                        </button>
                        {
                            translate_time && <p className='text-black mt-1'>Translate time: {formatDownloadTime(Number(translate_time))}</p>
                        }
                    </div>
                    {/* )} */}
                </div>
            </div>
            {showSaveButton && (
                <div className="mt-4 w-full">
                    <p className="text-3xl text-purple-700 font-bold underline">Where do you want to save your data?</p>
                    <div className="mt-2 shadow-sm shadow-black  p-3 w-[70%] mx-auto bg-slate-500 rounded-lg">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio"
                                name="database"
                                value="sports"
                                onChange={handleDatabaseChange}
                            />
                            <span className="ml-2 text-xl">Sports Database</span>
                        </label>
                        <label className="inline-flex items-center ml-4">
                            <input
                                type="radio"
                                className="form-radio"
                                name="database"
                                value="politics"
                                onChange={handleDatabaseChange}
                            />
                            <span className="ml-2 text-xl">Political News Database</span>
                        </label>
                        <label className="inline-flex items-center ml-4">
                            <input
                                type="radio"
                                className="form-radio"
                                name="database"
                                value="industry"
                                onChange={handleDatabaseChange}
                            />
                            <span className="ml-2 text-xl">Industry News Database</span>
                        </label>
                    </div>
                    <button
                        onClick={handleSave}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-xl font-medium rounded-md text-black bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-4"
                        disabled={isLoading || !selectedDatabase}
                    >
                        {isLoading ? 'Saving...' : 'Save to your databae of choice.'}
                    </button>
                </div>
            )}
            <div className='mt-4'>
                {transcription && (
                    <div className="p-4 border border-gray-300 rounded-md bg-black">
                        <h2 className="font-bold underline text-green-700 text-4xl">Translation</h2>
                        <p className="mt-2 text-gray-600 whitespace-pre-wrap">{transcription}</p>
                    </div>
                )}
                {translation && (
                    <div className="p-4 border border-gray-300 rounded-md bg-black">
                        <h2 className="text-4xl font-bold underline text-yellow-700">Transcription</h2>
                        <p className="mt-2 text-gray-600 whitespace-pre-wrap">{translation}</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default YoutubeLink;


