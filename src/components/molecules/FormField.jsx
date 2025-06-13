import React from 'react';
import Text from '@/components/atoms/Text';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

const FormField = ({ label, type = 'text', value, onChange, placeholder, min, max, required, options, children, ...props }) => {
  const id = label.toLowerCase().replace(/\s/g, '-'); // Simple ID generation

  const renderInput = () => {
    if (type === 'select') {
      return (
        <Select
          id={id}
          value={value}
          onChange={onChange}
          options={options}
          required={required}
          {...props}
        />
      );
    } else if (type === 'textarea') {
      return (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          rows={props.rows || 3}
          placeholder={placeholder}
          required={required}
          {...props}
        />
      );
    } else {
      return (
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          required={required}
          {...props}
        />
      );
    }
  };

  return (
    <div>
      <Text as="label" htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </Text>
      {renderInput()}
      {children} {/* For additional elements like avatar options */}
    </div>
  );
};

export default FormField;