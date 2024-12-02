import React, { useState } from 'react';
import QueryDatabase from '../components/QueryDatabase';
import CombinedConversattion from '../components/CombinedConversattion';
import AudioComponent from '../components/AudioComponent';
import QueryPrint from '../components/QueryPrint';

const Youtube = () => {
  const [selectedDatabase, setSelectedDatabase] = useState('video');

  const handleDatabaseChange = (event) => {
    setSelectedDatabase(event.target.value);
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
      <div className='w-[70%]'>
        {selectedDatabase === 'video' && <QueryDatabase />}
        {selectedDatabase === 'print' && <QueryPrint />}
        {selectedDatabase === 'audio' && <AudioComponent />}
      </div>
    </div>
  );
};

export default Youtube;
