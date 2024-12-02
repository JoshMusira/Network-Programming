import React, { useState } from 'react';
import axios from 'axios';

const TranscribeAudio = () => {
    const [file, setFile] = useState(null);
    const [transcription, setTranscription] = useState('');
    const [translation, setTranslation] = useState('');
    const [transcribeTime, setTranscribeTime] = useState('');
    const [translateTime, setTranslateTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [error, setError] = useState('');
    const [showSaveButton, setShowSaveButton] = useState(false);
    const [selectedDatabase, setSelectedDatabase] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const api = axios.create({
        baseURL: 'http://127.0.0.1:8000/api'
    });

    const handleUpload = async (action) => {
        if (!file) {
            setError('Please select an audio file to upload.');
            return;
        }

        if (action === 'transcribe') {
            setLoading(true);
        } else {
            setLoading1(true);
        }

        setError('');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const endpoint = action === 'transcribe' ? '/transcribe-audio-file' : '/translate-audio-file';
            const response = await api.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (action === 'transcribe') {
                setTranscription(response.data.transcription);
                setTranscribeTime(response.data.transcribe_time);
            } else {
                setTranslation(response.data.translation);
                setTranslateTime(response.data.translate_time);
            }

            setShowSaveButton(true);
        } catch (err) {
            setError('An error occurred while processing the audio.');
        } finally {
            if (action === 'transcribe') {
                setLoading(false);
            } else {
                setLoading1(false);
            }
        }
    };

    const handleDatabaseChange = (e) => {
        setSelectedDatabase(e.target.value);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const data = {
                youtube_url: "This was uploaded in local files",
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
        setLoading(false);
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
        <div className="flex flex-col items-center justify-center bg-slate-400 min-h-screen rounded-lg p-4">
            <div className="bg-slate-100 shadow-lg rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-black text-center">Transcribe or Translate Audio</h2>
                <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 cursor-pointer
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        mb-4"
                />
                <button
                    onClick={() => handleUpload('transcribe')}
                    className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Upload and Transcribe'}
                </button>
                <button
                    onClick={() => handleUpload('translate')}
                    className={`w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading1}
                >
                    {loading1 ? 'Processing...' : 'Upload and Translate'}
                </button>
                {error && (
                    <div className="text-red-500 mt-4 text-center">{error}</div>
                )}
            </div>
            {showSaveButton && (
                <div className="mt-4 w-full">
                    <p className="text-3xl text-purple-700 font-bold underline">Where do you want to save your data?</p>
                    <div className="mt-2 shadow-sm shadow-black p-3 w-[70%] mx-auto bg-slate-500 rounded-lg">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio"
                                name="database"
                                value="sports_local"
                                onChange={handleDatabaseChange}
                            />
                            <span className="ml-2 text-xl">Sports Database</span>
                        </label>
                        <label className="inline-flex items-center ml-4">
                            <input
                                type="radio"
                                className="form-radio"
                                name="database"
                                value="politics_local"
                                onChange={handleDatabaseChange}
                            />
                            <span className="ml-2 text-xl">Political News Database</span>
                        </label>
                        <label className="inline-flex items-center ml-4">
                            <input
                                type="radio"
                                className="form-radio"
                                name="database"
                                value="industry_local"
                                onChange={handleDatabaseChange}
                            />
                            <span className="ml-2 text-xl">Industry News Database</span>
                        </label>
                    </div>
                    <button
                        onClick={handleSave}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-xl font-medium rounded-md text-black bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-4"
                        disabled={loading || !selectedDatabase}
                    >
                        {loading ? 'Saving...' : 'Save to your database of choice'}
                    </button>
                </div>
            )}
            {transcription && (
                <div className="mt-4 w-[90%] bg-black p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-white">Transcription:</h3>
                    <p className="mt-2 text-sm text-gray-500">Transcribed in: {formatDownloadTime(Number(transcribeTime))}</p>
                    <p className="mt-2 p-2 leading-7  rounded">{transcription}</p>
                </div>
            )}
            {translation && (
                <div className="mt-4 w-[90%] bg-black p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-white">Translation:</h3>
                    <p className="mt-2 text-sm text-gray-500">Translated in: {formatDownloadTime(Number(translateTime))}</p>
                    <p className="mt-2 p-2 leading-7  rounded">{translation}</p>
                </div>
            )}
        </div>
    );
};

export default TranscribeAudio;
