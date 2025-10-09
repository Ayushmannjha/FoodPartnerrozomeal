import React from 'react';
import { CheckIcon } from '../icons';

interface DisplayFieldProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  verified?: boolean;
  className?: string;
}

export const DisplayField = ({ label, value, icon, verified, className = "" }: DisplayFieldProps) => (
  <div className={`space-y-2 ${className}`}>
    <label className="flex items-center space-x-2 text-sm font-medium text-gray-500">
      {icon && <span className="text-gray-400">{icon}</span>}
      <span>{label}</span>
      {verified && (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          <CheckIcon />
          <span className="ml-1">Verified</span>
        </span>
      )}
    </label>
    <p className="text-gray-900 font-medium">{value || 'Not provided'}</p>
  </div>
);
