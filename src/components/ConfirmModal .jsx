import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center px-9 bg-black bg-opacity-50">
            <div className="bg-gray-600 p-6 rounded shadow-lg">
                <h2 className="text-xl mb-4">Confirm Deletion of your database content!</h2>
                {children}
                <div className="mt-4 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-black rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
