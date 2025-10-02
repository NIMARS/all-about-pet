import React from 'react';
import { formatDate } from '../../../shared/utils';

const PetCard = ({ pet, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{pet.name}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(pet)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(pet.id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Species:</span>
          <span className="font-medium">{pet.species}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Breed:</span>
          <span className="font-medium">{pet.breed}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Birth Date:</span>
          <span className="font-medium">{formatDate(pet.birthDate)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Weight:</span>
          <span className="font-medium">{pet.weight} kg</span>
        </div>
      </div>

      {pet.description && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-gray-700 text-sm">{pet.description}</p>
        </div>
      )}
    </div>
  );
};

export default PetCard; 