import React from 'react'
import aboutData from '../../data/AboutData'
import AboutCard from '../cards/AboutCard'

const About = () => {
  return (
    <section id='about' className='bg-gray-900 text-white py-16 px-4'>
        <div className='container mx-auto'>
        <h2 className='text-4xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 tracking-wide'>Discover What Mentor Chain Offers</h2>
        <p className='mt-4 mb-12 text-lg text-center text-gray-300 max-w-2xl mx-auto'> Empowering growth through meaningful mentorship connections, anytime, anywhere.</p>
       
      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        {aboutData.map((card, index) => (
          <AboutCard
            key={index}
            title={card.title}
            description={card.description}
            subtext={card.subtext}
          />
        ))}
      </div>
      </div>
    </section>
  )
}

export default About