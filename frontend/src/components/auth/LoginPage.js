import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import InputField from '../common/InputField';

const LoginPage = ({ showNotification }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await login(username, password);
        if (!success) {
            setError('Invalid username or password.');
            showNotification('Invalid username or password.', 'error');
        } else {
            showNotification('Login successful! Welcome to G3 Transport.', 'success');
        }
    };

    return (
        <div className="min-h-screen bg-green-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-green-800">G3 Transport Management</h1>
                    <p className="mt-2 text-gray-600">Secure Login</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <InputField 
                        label="Username" 
                        name="username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder="admin or employee" 
                        required 
                    />
                    <InputField 
                        label="Password" 
                        name="password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="password123" 
                        required 
                    />
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button 
                        type="submit" 
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-green-800 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
