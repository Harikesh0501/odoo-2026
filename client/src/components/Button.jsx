import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";

    const variants = {
        primary: "bg-primary text-white hover:bg-blue-600 focus:ring-primary shadow-lg shadow-blue-500/30",
        secondary: "bg-white text-secondary hover:bg-gray-50 border border-gray-200 focus:ring-gray-200 shadow-sm",
        danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-lg shadow-red-500/30",
        ghost: "bg-transparent text-secondary hover:bg-gray-100 focus:ring-gray-200"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
