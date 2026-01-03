import React from 'react';

const Input = ({ label, id, error, className = '', ...props }) => {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={id} className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`}
                {...props}
            />
            {error && (
                <span className="text-xs text-red-500">{error}</span>
            )}
        </div>
    );
};

export default Input;
