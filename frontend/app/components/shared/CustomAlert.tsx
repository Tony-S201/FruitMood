'use client';

import React from "react";

interface CustomAlertProps {
  showAlert: boolean;
  alertType: typeOfAlert;
  alertMessage: string;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

type typeOfAlert = 'error' | 'success';

const CustomAlert: React.FC<CustomAlertProps> = ({
  showAlert,
  alertType,
  alertMessage, 
  setShowAlert
}) => {
  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${showAlert ? 'block' : 'hidden'}`}>
      <div className={`bg-${alertType === 'success' ? 'green' : 'red'}-500 text-white py-4 px-6 shadow-lg flex items-center justify-between`}>
        <span className="font-semibold">{alertMessage}</span>
        <button
          onClick={() => setShowAlert(false)}
          className="text-white hover:text-gray-200 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default CustomAlert;