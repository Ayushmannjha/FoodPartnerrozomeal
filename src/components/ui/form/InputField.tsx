import React from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  isTextarea?: boolean;
  rows?: number;
  className?: string;
}

export const InputField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  type = "text", 
  placeholder, 
  required, 
  icon,
  isTextarea = false,
  rows = 3,
  className = ""
}: InputFieldProps) => (
  <div className={`space-y-2 ${className}`}>
    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
      {icon && <span className="text-gray-400">{icon}</span>}
      <span>{label} {required && <span className="text-red-500">*</span>}</span>
    </label>
    {isTextarea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />
    )}
  </div>
);
