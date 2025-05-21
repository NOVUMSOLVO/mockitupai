import React from 'react';

const TemplateDetailModal = ({
  template,
  isOpen,
  onClose,
  onGenerate,
  onFavoriteToggle,
  isFavorited,
  favoritingInProgress,
  currentUser,
  showNotification,
  openAuthModal
}) => {
  if (!isOpen || !template) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">{template.name} - Details</h2>
        <p className="mb-2"><strong>Description:</strong> {template.description || 'No description available.'}</p>
        <p className="mb-2"><strong>Category:</strong> {template.category}</p>
        <p className="mb-4"><strong>Style:</strong> {template.style}</p>
        
        <div className="mb-4">
          <img src={template.preview || 'https://placehold.co/400x300?text=Preview'} alt={template.name} className="w-full h-auto rounded-md" />
        </div>

        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => onFavoriteToggle(template.id)}
            disabled={favoritingInProgress}
            className={`px-4 py-2 rounded-md text-sm font-medium 
                        ${isFavorited ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} 
                        disabled:opacity-50`}
          >
            {favoritingInProgress ? '...' : (isFavorited ? 'Unfavorite' : 'Favorite')}
          </button>
          <button 
            onClick={onGenerate}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
          >
            Generate with this Template
          </button>
        </div>
        
        <button 
          onClick={onClose} 
          className="w-full mt-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm font-medium"
        >
          Close
        </button>
        {!currentUser && (
          <p className="text-xs text-center mt-2 text-gray-500">
            <button onClick={() => openAuthModal('signin')} className="text-indigo-600 hover:underline">Sign in</button> or <button onClick={() => openAuthModal('signup')} className="text-indigo-600 hover:underline">sign up</button> to generate or favorite.
          </p>
        )}
      </div>
    </div>
  );
};

export default TemplateDetailModal;
