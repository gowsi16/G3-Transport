import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { calculateTripMetrics } from './utils/calculations';
import { SEED_TRIPS } from './utils/constants';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Notification from './components/common/Notification';
import LoginPage from './components/auth/LoginPage';
import HomePage from './pages/HomePage';
import OCRPage from './components/ocr/OCRPage';
import TripsPage from './components/trips/TripsPage';
import InvoicesPage from './components/invoices/InvoicesPage';
import DashboardPage from './components/dashboard/DashboardPage';
import ContactPage from './components/contact/ContactPage';

const App = () => {
    return (
        <AuthProvider>
            <G3TransportApp />
        </AuthProvider>
    );
};

const G3TransportApp = () => {
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState('Home');
    const [trips, setTrips] = useState(() => SEED_TRIPS.map(calculateTripMetrics));
    const [notification, setNotification] = useState({ message: '', type: '' });


    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
    };

    const handleAddTrip = (newTrip) => {
        const tripWithMetrics = calculateTripMetrics(newTrip);
        setTrips(prevTrips => [...prevTrips, tripWithMetrics]);
        showNotification('Trip successfully saved!', 'success');
    };

    const handleUpdateTrip = (updatedTrip) => {
        const tripWithMetrics = calculateTripMetrics(updatedTrip);
        setTrips(prevTrips => prevTrips.map(t => t.id === updatedTrip.id ? tripWithMetrics : t));
        showNotification('Trip successfully updated!', 'success');
    };

    const handleDeleteTrip = (tripId) => {
        if (window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
            setTrips(prevTrips => prevTrips.filter(t => t.id !== tripId));
            showNotification('Trip successfully deleted!', 'success');
        }
    };

    if (!user) {
        return <LoginPage showNotification={showNotification} />;
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'Home': return <HomePage trips={trips} />;
            case 'OCR': return <OCRPage onSaveTrip={handleAddTrip} showNotification={showNotification} currentUser={user} />;
            case 'Trips': return <TripsPage trips={trips} onUpdateTrip={handleUpdateTrip} onDeleteTrip={handleDeleteTrip} />;
            case 'Invoices': return <InvoicesPage trips={trips} showNotification={showNotification} />;
            case 'Dashboard': return <DashboardPage trips={trips} />;
            case 'Contact': return <ContactPage showNotification={showNotification} />;
            default: return <HomePage trips={trips} />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
            <Notification 
                message={notification.message} 
                type={notification.type} 
                onClose={() => setNotification({ message: '', type: '' })} 
            />
            <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <main className="pt-16 flex-grow">
                {renderPage()}
            </main>
            {(currentPage === 'Home' || currentPage === 'Contact') && <Footer />}
        </div>
    );
};

export default App;