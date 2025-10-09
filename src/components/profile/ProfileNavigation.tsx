import { EditIcon } from '../ui/icons';

interface ProfileNavigationProps {
  isEditing: boolean;
  onEditToggle: () => void;
}

export const ProfileNavigation = ({ isEditing, onEditToggle }: ProfileNavigationProps) => (
  <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <h1 className="text-xl font-bold text-gray-900">Profile</h1>
        <button
          onClick={onEditToggle}
          className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isEditing 
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
              : 'bg-blue-600 text-black hover:bg-blue-700 shadow-sm'
          }`}
        >
          <EditIcon />
          <span className="ml-2">{isEditing ? 'Cancel' : 'Edit'}</span>
        </button>
      </div>
    </div>
  </div>
);
