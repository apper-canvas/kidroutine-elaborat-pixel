import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className = '', onClick, type = 'button', disabled = false, whileHover, whileTap, ...props }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
        ${className}
      `}
      whileHover={whileHover}
      whileTap={whileTap}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;