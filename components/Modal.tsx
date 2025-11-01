
import React from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6 mx-auto border border-gray-700 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-100 text-3xl font-bold transition-colors"
          aria-label="Close"
        >
          &times;
        </button>
        {title && <h2 className="text-2xl font-semibold text-green-400 mb-4 text-center">{title}</h2>}
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
