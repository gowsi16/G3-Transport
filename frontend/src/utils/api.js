const API_BASE_URL = 'http://localhost:5001/api';

export const api = {
    // Trip endpoints
    getTrips: async () => {
        const response = await fetch(`${API_BASE_URL}/trips`);
        if (!response.ok) throw new Error('Failed to fetch trips');
        return response.json();
    },

    createTrip: async (tripData) => {
        const response = await fetch(`${API_BASE_URL}/trips`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tripData),
        });
        if (!response.ok) throw new Error('Failed to create trip');
        return response.json();
    },

    deleteTrip: async (tripId) => {
        const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete trip');
        return response.json();
    },

    // Auth endpoints
    login: async (username, password) => {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        if (!response.ok) throw new Error('Invalid credentials');
        return response.json();
    }
};
