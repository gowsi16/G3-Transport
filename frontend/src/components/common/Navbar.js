import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ currentPage, setCurrentPage }) => {
    const { user, logout } = useAuth();

    const navItems = [
        { name: 'Home', label: 'Home' },
        { name: 'OCR', label: 'OCR' },
        { name: 'Trips', label: 'Trips' },
        { name: 'Invoices', label: 'Invoices' },
        { name: 'Dashboard', label: 'Dashboard' },
        { name: 'Contact', label: 'Contact' }
    ];

    return (
        <nav className="bg-white shadow-lg fixed w-full top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <h1 className="text-xl font-bold text-green-700">G3 Transport</h1>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {navItems.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => setCurrentPage(item.name)}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                            currentPage === item.name
                                                ? 'bg-green-700 text-white'
                                                : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user && (
                            <>
                                <span className="text-sm text-gray-600">Welcome, {user.username}</span>
                                <button
                                    onClick={logout}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;