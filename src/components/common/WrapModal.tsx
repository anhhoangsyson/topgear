import React, { useEffect } from 'react';
import { useState } from 'react';

export default function WrapModal({ children, isOpenModal }: { children: React.ReactNode, isOpenModal?: boolean }) {
  const [isOpen, setIsOpen] = useState(isOpenModal);

  useEffect(() => {
    setIsOpen(isOpenModal);
  }, [isOpenModal]);

  return (
    <div
      className={` ${isOpen ? 'block' : 'hidden'} fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50`}>
      <div className="bg-white rounded-lg shadow-lg p-4 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={() => setIsOpen(false)}
        >
          Close
        </button>
        {children}
      </div>
    </div>
  );
}