import React from 'react';

const Select = ({ className = '', value, onChange, options = [], ...props }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`
        px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent
        ${className}
      `}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value || option} value={option.value || option}>
          {option.label || option}
        </option>
      ))}
    </select>
  );
};

export default Select;