import React from 'react';

interface ProfileCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isEditing?: boolean;
  className?: string;
}

export const ProfileCard = ({ title, icon, children, isEditing, className = "" }: ProfileCardProps) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 ${isEditing ? 'ring-2 ring-blue-500 ring-opacity-20' : 'hover:shadow-md'} ${className}`}>
    <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);
