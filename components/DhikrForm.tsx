
import React, { useState } from 'react';
import Button from './Button';
import { Dhikr } from '../types';
import Modal from './Modal';

interface DhikrFormProps {
  onAddDhikr: (phrase: string) => void;
  allDhikrs: Dhikr[];
  onRemoveDhikr: (id: string) => void;
}

const DhikrForm: React.FC<DhikrFormProps> = ({ onAddDhikr, allDhikrs, onRemoveDhikr }) => {
  const [newDhikrPhrase, setNewDhikrPhrase] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [dhikrToRemoveId, setDhikrToRemoveId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDhikrPhrase.trim()) {
      onAddDhikr(newDhikrPhrase.trim());
      setNewDhikrPhrase('');
    }
  };

  const handleRemoveClick = (id: string) => {
    setDhikrToRemoveId(id);
    setShowConfirmModal(true);
  };

  const confirmRemove = () => {
    if (dhikrToRemoveId) {
      onRemoveDhikr(dhikrToRemoveId);
      setDhikrToRemoveId(null);
    }
    setShowConfirmModal(false);
  };

  const cancelRemove = () => {
    setDhikrToRemoveId(null);
    setShowConfirmModal(false);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto py-8">
      <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">Add Custom Dhikr</h2>

      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700">
        <label htmlFor="newDhikr" className="block text-xl font-medium text-gray-300 mb-3">
          New Dhikr Phrase:
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            id="newDhikr"
            value={newDhikrPhrase}
            onChange={(e) => setNewDhikrPhrase(e.target.value)}
            placeholder="e.g., Astaghfirullah"
            className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-lg text-lg text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500 transition-colors"
            required
          />
          <Button type="submit" variant="primary" size="md" className="sm:w-auto w-full text-lg">
            Add Dhikr
          </Button>
        </div>
      </form>

      <div className="p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700">
        <h3 className="text-2xl font-bold text-green-400 mb-4 text-center">Your Custom Dhikr</h3>
        {allDhikrs.length === 0 ? (
          <p className="text-lg text-gray-400 text-center italic">No custom dhikr added yet.</p>
        ) : (
          <ul className="space-y-4">
            {allDhikrs.map((dhikr) => (
              <li
                key={dhikr.id}
                className="flex flex-col sm:flex-row justify-between items-center bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-600"
              >
                <span className="text-xl text-white font-medium mb-2 sm:mb-0 text-center sm:text-left break-words w-full sm:w-3/4">
                  {dhikr.phrase}
                </span>
                <Button
                  onClick={() => handleRemoveClick(dhikr.id)}
                  variant="danger"
                  size="sm"
                  className="sm:ml-4 mt-2 sm:mt-0 w-full sm:w-auto"
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal isOpen={showConfirmModal} onClose={cancelRemove} title="Confirm Removal">
        <div className="text-center text-gray-200 text-lg mb-6">
          Are you sure you want to remove this Dhikr? This action cannot be undone.
        </div>
        <div className="flex justify-center gap-4">
          <Button onClick={cancelRemove} variant="secondary">
            Cancel
          </Button>
          <Button onClick={confirmRemove} variant="danger">
            Remove
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default DhikrForm;
