import React from 'react';
import { Link } from 'react-router-dom';

const FooterCard = ({ title, items }) => {
  return (
    <div className="  text-center md:text-left">
      <h4 className='text-lg font-semibold text-white mb-4' >{title}</h4>
      <ul>
        {items.map((item, idx) => (
          <li key={idx} className='mb-2'>
            <Link to={item.link}
             className="text-gray-400 hover:text-white transition-colors duration-200">
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterCard;
