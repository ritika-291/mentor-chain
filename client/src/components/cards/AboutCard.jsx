import React from 'react'

const AboutCard = ({title,description,subtext}) => {
  return (
    <div className="w-full sm:w-80 md:w-96 p-6 bg-gray-800 rounded-xl shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl ">
        <h3 className='text-2xl font-bold mb-2 text-teal-400'>{title}</h3>
        <p className='text-gray-300 mb-4' >{description}</p>
        <p className='text-sm text-gray-400 italic'>{subtext}</p>
    </div>
  )
}

export default AboutCard