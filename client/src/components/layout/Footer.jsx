import React from 'react';
import footerLinks from '../../data/footerData';
import FooterCard from '../cards/FooterCard';

const Footer = () => {
  return (
    <footer className='bg-gray-800 text-gray-300 py-12 md:py-16'>
      <div className='container lg:mx-15 mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8' >
        <div className='md:col-span-1 lg:col-span-1 text-center md:text-left'>
          <h2 className='text-2xl font-bold text-white mb-4 '>
            {footerLinks.brand.name}
          </h2>
          <p className='text-sm'>{footerLinks.brand.description}</p>
        </div>

        {/* Link Sections */}
        {footerLinks.links.map((section, index) => (
          <FooterCard key={index} {...section} />
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-900 mt-12 pt-8 text-center text-sm text-gray-400">
        {footerLinks.copyright}
      </div>
    </footer>
  );
};

export default Footer;
