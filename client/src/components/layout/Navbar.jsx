import React, { useState } from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import { FaBell } from "react-icons/fa";
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    // Initial check for logged-in user
    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        window.location.reload();
    };

    const getDashboardLink = () => {
        if (!user) return '/login';
        return user.role === 'mentor' ? '/mentor/overview' : '/mentee/overview';
    };

    return (
        <header className='fixed w-full top-0 z-50 bg-gray-800/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-700/50 text-white shadow-lg transition-colors duration-300'>
            <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
                {/* Logo on the left */}
                <div className='flex-shrink-0'>
                    <NavLink to='/'>
                        <h1 className='text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 hover:from-blue-500 hover:to-teal-400 transition-all duration-300 ease-in-out tracking-wide'>MentorChain</h1>
                    </NavLink>
                </div>

                {/* Hamburger menu for mobile devices */}
                <div className="md:hidden flex items-center space-x-4 z-50">
                    <button onClick={toggleMenu} className="text-white text-2xl focus:outline-none">
                        <GiHamburgerMenu />
                    </button>
                </div>

                {/* Desktop Navigation - Hidden on mobile */}
                <div className="hidden md:flex md:items-center md:space-x-8">
                    <nav>
                        <ul className='flex space-x-8'>
                            <li>
                                <NavLink to='/' className="text-gray-300 font-medium hover:text-teal-400 transition duration-300 ease-in-out">
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <a href='#about' className="text-gray-300 font-medium hover:text-teal-400 transition duration-300 ease-in-out">
                                    About
                                </a>
                            </li>
                            <li>
                                <a href='#howItWorks' className="text-gray-300 font-medium hover:text-teal-400 transition duration-300 ease-in-out">
                                    Works
                                </a>
                            </li>
                            <li>
                                <a href='#features' className="text-gray-300 font-medium hover:text-teal-400 transition duration-300 ease-in-out">
                                    Features
                                </a>
                            </li>
                            <li>
                                <NavLink to='/community' className="text-gray-300 font-medium hover:text-teal-400 transition duration-300 ease-in-out">
                                    Community
                                </NavLink>
                            </li>
                        </ul>
                    </nav>

                    <div className='flex items-center space-x-4'>
                        {/* Toggle Button Removed */}

                        {/* Notifications Bell */}
                        {user && (
                            <NavLink
                                to={user.role === 'mentor' ? '/mentor/notifications' : '/mentee/notifications'}
                                className="text-gray-300 hover:text-teal-400 transition-colors relative"
                            >
                                <FaBell className="text-xl" />
                                {/* Optional: Red dot here if unread */}
                            </NavLink>
                        )}

                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 focus:outline-none">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full border-2 border-teal-400"
                                    />
                                    <span className="font-semibold text-gray-200">{user.username}</span>
                                </button>
                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-100 dark:border-gray-700">
                                    <NavLink to={getDashboardLink()} className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-gray-700 transition-colors">
                                        Dashboard
                                    </NavLink>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <NavLink to='/signup'>
                                    <button className="bg-transparent border border-white text-white font-semibold py-2 px-6 rounded-full transition duration-300 ease-in-out hover:bg-white hover:text-gray-900">
                                        Sign Up
                                    </button>
                                </NavLink>
                                <NavLink to='/login'>
                                    <button className='bg-white text-gray-900 font-semibold py-2 px-6 rounded-full transition duration-300 ease-in-out hover:bg-transparent hover:text-white hover:border hover:border-white'>
                                        Sign In
                                    </button>
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`
                    fixed inset-x-0 top-0 transform transition-transform duration-300 ease-in-out 
                    ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'} 
                    bg-gray-900/95 backdrop-blur-xl w-full h-auto p-6 flex flex-col items-center space-y-6 z-40
                    md:hidden shadow-2xl rounded-b-3xl border-b border-gray-700
                `}>
                    <button onClick={toggleMenu} className="absolute top-4 right-4 text-white text-3xl focus:outline-none">
                        &times;
                    </button>
                    <nav className="w-full text-center mt-8">
                        <ul className='flex flex-col space-y-4 text-xl w-full'>
                            <li>
                                <NavLink to='/' className="block py-2 text-gray-300 font-medium hover:text-teal-400 transition duration-300 ease-in-out" onClick={() => setIsMenuOpen(false)}>
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <a href='#about' className="block py-2 text-gray-300 font-medium hover:text-teal-400 transition duration-300 ease-in-out" onClick={() => setIsMenuOpen(false)}>
                                    About
                                </a>
                            </li>
                            <li>
                                <a href='#howItWorks' className="block py-2 text-gray-300 font-medium hover:text-teal-400 transition duration-300 ease-in-out" onClick={() => setIsMenuOpen(false)}>
                                    Works
                                </a>
                            </li>
                            <li>
                                <a href='#features' className="block py-2 text-gray-300 font-medium hover:text-teal-400 transition duration-300 ease-in-out" onClick={() => setIsMenuOpen(false)}>
                                    Features
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <div className='flex flex-col items-center space-y-4 w-full mt-4'>
                        {user ? (
                            <>
                                <NavLink to={getDashboardLink()} onClick={() => setIsMenuOpen(false)} className="w-full">
                                    <button className="w-full bg-teal-500 text-white font-semibold py-3 px-6 rounded-full transition duration-300 hover:bg-teal-600 shadow-lg">
                                        Go to Dashboard
                                    </button>
                                </NavLink>
                                <button
                                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                    className="w-full bg-red-500/80 text-white font-semibold py-3 px-6 rounded-full transition duration-300 hover:bg-red-600 shadow-lg"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink to='/signup' onClick={() => setIsMenuOpen(false)} className="w-full">
                                    <button className="w-full bg-transparent border border-white text-white font-semibold py-3 px-6 rounded-full transition duration-300 ease-in-out hover:bg-white hover:text-gray-900">
                                        Sign Up
                                    </button>
                                </NavLink>
                                <NavLink to='/login' onClick={() => setIsMenuOpen(false)} className="w-full">
                                    <button className='w-full bg-white text-gray-900 font-semibold py-3 px-6 rounded-full transition duration-300 ease-in-out hover:bg-transparent hover:text-white hover:border hover:border-white'>
                                        Sign In
                                    </button>
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
export default Navbar;