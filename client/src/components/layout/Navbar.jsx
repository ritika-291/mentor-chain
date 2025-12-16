import React, { useState } from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className='bg-gray-800 text-white shadow-lg'>
            <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
                {/* Logo on the left */}
                <div className='flex-shrink-0'>
                    <NavLink to='/'>
                        <h1 className='text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 hover:from-blue-500 hover:to-teal-400 transition-all duration-300 ease-in-out tracking-wide'>MentorChain</h1>
                    </NavLink>
                </div>

                {/* Hamburger menu for mobile devices */}
                <div className="md:hidden flex items-center z-50">
                    <button onClick={toggleMenu} className="text-white text-2xl focus:outline-none">
                        <GiHamburgerMenu />
                    </button>
                </div>

                {/* Desktop Navigation - Hidden on mobile */}
                <div className="hidden md:flex md:items-center md:space-x-8">
                    <nav>
                        <ul className='flex space-x-8'>
                            <li>
                                <NavLink to='/' className="text-white font-medium hover:text-teal-400 transition duration-300 ease-in-out">
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <a href='#about' className="text-white font-medium hover:text-teal-400 transition duration-300 ease-in-out">
                                    About
                                </a>
                            </li>
                            <li>
                                <NavLink to='/work' className="text-white font-medium hover:text-teal-400 transition duration-300 ease-in-out">
                                    Works
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to='/features' className="text-white font-medium hover:text-teal-400 transition duration-300 ease-in-out">
                                    Features
                                </NavLink>
                            </li>
                        </ul>
                    </nav>

                    <div className='flex items-center space-x-4'>
                        <button className="bg-transparent border border-white text-white font-semibold py-2 px-6 rounded-full transition duration-300 ease-in-out hover:bg-white hover:text-gray-900">
                            Sign Up
                        </button>
                        <button className='bg-white text-gray-900 font-semibold py-2 px-6 rounded-full transition duration-300 ease-in-out hover:bg-transparent hover:text-white hover:border hover:border-white'>
                            <NavLink to='/login'>
                                Sign In
                            </NavLink>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu - Hidden on desktop, slides down from top on mobile */}
                <div className={`
                    fixed inset-x-0 top-0 transform transition-transform duration-300 ease-in-out 
                    ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'} 
                    bg-gray-900 w-full h-1/2 p-6 flex flex-col items-center justify-center space-y-6 z-40
                    md:hidden
                `}>
                    <nav>
                        <ul className='flex flex-col space-y-4 text-xl'>
                            <li>
                                <NavLink to='/' className="text-white font-medium hover:text-teal-400 transition duration-300 ease-in-out" onClick={() => setIsMenuOpen(false)}>
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <a href='#about' className="text-white font-medium hover:text-teal-400 transition duration-300 ease-in-out" /* onClick={() => setIsMenuOpen(false)} */ >
                                    About
                                </a>
                            </li>
                            <li>
                                <NavLink to='/work' className="text-white font-medium hover:text-teal-400 transition duration-300 ease-in-out" onClick={() => setIsMenuOpen(false)}>
                                    Works
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to='/features' className="text-white font-medium hover:text-teal-400 transition duration-300 ease-in-out" onClick={() => setIsMenuOpen(false)}>
                                    Features
                                </NavLink>
                            </li>
                        </ul>
                    </nav>

                    <div className='flex flex-col items-center space-y-4 w-full mt-4'>
                        <button className="w-full bg-transparent border border-white text-white font-semibold py-2 px-6 rounded-full transition duration-300 ease-in-out hover:bg-white hover:text-gray-900">
                            Sign Up
                        </button>
                        <button className='w-full bg-white text-gray-900 font-semibold py-2 px-6 rounded-full transition duration-300 ease-in-out hover:bg-transparent hover:text-white hover:border hover:border-white'>
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;