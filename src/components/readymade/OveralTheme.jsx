import React from 'react'

const OveralTheme = ({ handleReadyMadeSubmit, customLoading, setCustomIsLoading }) => {
  return (
      <div>
          <button
              onClick={() => {
                  setCustomIsLoading(true);  // Set custom loading state when the button is clicked
                  handleReadyMadeSubmit("OveralTheme");
              }}
              disabled={customLoading}  // Disable if a button is clicked
              className={`bg-blue-500 w-[150px] px-5 h-[45px] text-white font-bold py-2 rounded ${
                  customLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-blue-700'
              }`}
              style={{ cursor: customLoading ? 'not-allowed' : 'pointer' }} // Inline style to ensure the cursor behavior
          >
             OveralTheme
          </button>
      </div>
  );
}

export default OveralTheme