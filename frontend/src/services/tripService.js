import api from '../utils/api';

export const getTrips = async () => {
  try {
    const response = await api.get('/api/trips');
    return response.data;
  } catch (error) {
    console.error('Error fetching trips:', error);
    throw error;
  }
};

export const getTripsByDateRange = async (startDate, endDate) => {
  try {
    const response = await api.get('/api/trips', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trips by date range:', error);
    throw error;
  }
};

export const getActiveDrivers = async () => {
  try {
    const response = await api.get('/api/drivers/active');
    return response.data;
  } catch (error) {
    console.error('Error fetching active drivers:', error);
    throw error;
  }
};

export const getActiveVehicles = async () => {
  try {
    const response = await api.get('/api/vehicles/active');
    return response.data;
  } catch (error) {
    console.error('Error fetching active vehicles:', error);
    throw error;
  }
};

export const getFinancialSummary = async () => {
  try {
    const response = await api.get('/api/financial/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    throw error;
  }
};
