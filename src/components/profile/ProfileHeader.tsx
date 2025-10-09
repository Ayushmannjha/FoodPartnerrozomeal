import type { User } from '../../types/user';

interface ProfileHeaderProps {
  user: User;
  profileCompletion: number;
}

export const ProfileHeader = ({ user, profileCompletion }: ProfileHeaderProps) => (
  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-black p-6 mb-8 relative overflow-hidden">
    <div className="absolute inset-0 bg-black opacity-10"></div>
    <div className="relative z-10">
      <div className="flex items-center space-x-4">
        <div className="h-20 w-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
          {user.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{user.name || 'User Name'}</h2>
          <p className="text-blue-100 text-lg">{user.role || 'Food Partner'}</p>
          <div className="flex items-center mt-2">
            <div className="flex-1 bg-white bg-opacity-20 rounded-full h-2 mr-3">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500" 
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{profileCompletion}% Complete</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
