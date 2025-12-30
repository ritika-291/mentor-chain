import React from 'react';
import workSteps from '../../data/WorksData'; // Assuming this data is an array of objects
import WorkCard from '../cards/WorkCard';

const HowItWorks = () => {
  return (
    <section id="howItWorks" className="bg-gray-900 text-white py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 tracking-wide">
          How MentorChain Works!
        </h2>
        <p className="mt-4 mb-12 text-lg text-center text-gray-300 max-w-2xl mx-auto">
          A simple 3-step process to start your mentorship journey.
        </p>

        {/* Responsive grid for the work cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
          {workSteps.map((step, index) => (
            <WorkCard
              key={index}
              step={step.step}
              title={step.title}
              description={step.description}
              buttonText={step.buttonText}
              image={step.image}
              link={step.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;