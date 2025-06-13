import React from 'react';

const Input = ({ className = '', type = 'text', value, onChange, placeholder, min, max, required = false, ...props }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      max={max}
      required={required}
      className={`
        w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent
        ${className}
      `}
      {...props}
    />
  );
};

export default Input;