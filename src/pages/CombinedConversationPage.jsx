import React, { useState } from 'react';
import QueryDatabase from '../components/QueryDatabase';
import CombinedConversattion from '../components/CombinedConversattion';
import AudioComponent from '../components/AudioComponent';
import QueryPrint from '../components/QueryPrint';

const CombinedConversationPage = () => {
    const [selectedDatabase1, setSelectedDatabase1] = useState('print');

    const handleDatabaseChange = (event) => {
        setSelectedDatabase1(event.target.value);
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
                            checked={selectedDatabase1 === 'print'}
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
                            checked={selectedDatabase1 === 'video'}
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
                            checked={selectedDatabase1 === 'audio'}
                            onChange={handleDatabaseChange}
                            className='mr-2 cursor-pointer'
                        />
                        Audio Database
                    </label>
                </div>
            </div>
            <div className='w-[70%]'>
            <h2 className='text-3xl pb-3 text-gray-400 font-semibold'>
                    Chat Single Database
                </h2>
                {selectedDatabase1 === 'video' && <QueryDatabase />}
                {selectedDatabase1 === 'print' && <QueryPrint />}
                {selectedDatabase1 === 'audio' && <AudioComponent />}
            </div>
        </div>
    )
}

export default CombinedConversationPage