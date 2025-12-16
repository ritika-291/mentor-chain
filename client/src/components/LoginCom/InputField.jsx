import React from 'react'

const InputField = ({label,type,value,onChange}) => {
  return (
    <div className='space-y-2'>
        <label className='text-gray-300 font-medium' >{label}</label>
        <input
        type={type} required
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors duration-200' />
    </div>
  )
}

export default InputField;