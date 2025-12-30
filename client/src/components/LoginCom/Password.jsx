import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Password = ({ value, onChange, label = "Password" }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-gray-300 font-medium">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="w-full px-4 py-3 pr-12 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors duration-200"
        />
        <button
          type='button' 
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
};

export default Password;