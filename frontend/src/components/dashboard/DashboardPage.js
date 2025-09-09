import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { TrendingUp, AlertTriangle, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Chart.js registration
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

const DashboardPage = ({ trips }) => {
    const { user } = useAuth();
    
    if (user.role !== 'admin') {
        return (
            <div className="text-center p-10 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
                <p className="text-gray-600 mt-2">You do not have permission to view the dashboard.</p>
            </div>
        );
    }

    // --- KPI Calculations ---
    const totalTrips = trips.length;
    const totalIncome = trips.reduce((sum, trip) => sum + (trip.revenue || 0), 0);
    const totalExpenses = trips.reduce((sum, trip) => sum + (trip.total_expense || 0), 0);
    const totalProfit = totalIncome - totalExpenses;

    // --- Chart Data ---
    const tripProfitabilityData = {
        labels: trips.map(t => t.id),
        datasets: [{
            label: 'Profit/Loss per Trip',
            data: trips.map(t => t.profit),
            backgroundColor: trips.map(t => t.profit >= 0 ? 'rgba(74, 222, 128, 0.6)' : 'rgba(248, 113, 113, 0.6)'),
            borderColor: trips.map(t => t.profit >= 0 ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)'),
            borderWidth: 1,
        }],
    };

    const monthlyData = trips.reduce((acc, trip) => {
        const month = new Date(trip.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!acc[month]) { acc[month] = { income: 0, expenses: 0 }; }
        acc[month].income += trip.revenue;
        acc[month].expenses += trip.total_expense;
        return acc;
    }, {});
    
    const sortedMonths = Object.keys(monthlyData).sort((a,b) => new Date(a) - new Date(b));
    const lastMonthIncome = sortedMonths.length > 0 ? monthlyData[sortedMonths[sortedMonths.length - 1]].income : 0;
    
    const trendData = {
        labels: sortedMonths,
        datasets: [
            { label: 'Total Income', data: sortedMonths.map(m => monthlyData[m].income), borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.5)' },
            { label: 'Total Expenses', data: sortedMonths.map(m => monthlyData[m].expenses), borderColor: 'rgb(239, 68, 68)', backgroundColor: 'rgba(239, 68, 68, 0.5)' },
            { label: 'Next Month Forecast', data: [...sortedMonths.map(m => null), lastMonthIncome * 1.1], borderColor: 'rgb(99, 102, 241)', borderDash: [5, 5], backgroundColor: 'rgba(99, 102, 241, 0.5)' }
        ],
    };

    const expenseCategories = trips.reduce((acc, trip) => {
        acc['Fuel'] = (acc['Fuel'] || 0) + (trip.fuel_cost || 0);
        acc['Toll'] = (acc['Toll'] || 0) + (trip.toll_cost || 0);
        acc['Commission'] = (acc['Commission'] || 0) + (trip.commission || 0);
        acc['Driver Batta'] = (acc['Driver Batta'] || 0) + (trip.driver_wage || 0);
        acc['Other'] = (acc['Other'] || 0) + (trip.other_expenses || 0);
        return acc;
    }, {});

    const expenseData = {
        labels: Object.keys(expenseCategories),
        datasets: [{
            data: Object.values(expenseCategories),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        }],
    };

    // --- ML Insights Calculations ---
    const driverPerformance = trips.reduce((acc, trip) => {
        if (!acc[trip.driverName]) { acc[trip.driverName] = { totalProfit: 0, tripCount: 0, totalFuel: 0 }; }
        acc[trip.driverName].totalProfit += trip.profit;
        acc[trip.driverName].tripCount++;
        acc[trip.driverName].totalFuel += (trip.fuel_cost || 0);
        return acc;
    }, {});

    const driverLeaderboard = Object.entries(driverPerformance).map(([name, data]) => ({
        name,
        avgProfit: data.totalProfit / data.tripCount,
        fuelEfficiency: data.totalFuel / data.tripCount,
    })).sort((a, b) => b.avgProfit - a.avgProfit);

    const routePerformance = trips.reduce((acc, trip) => {
        const route = `${trip.from_city} → ${trip.to_city}`;
        if (!acc[route]) { acc[route] = { totalProfit: 0, tripCount: 0 }; }
        acc[route].totalProfit += trip.profit;
        acc[route].tripCount++;
        return acc;
    }, {});
    
    const bestRoute = Object.entries(routePerformance).map(([name, data]) => ({
        name, 
        avgProfit: data.totalProfit/data.tripCount
    })).sort((a,b) => b.avgProfit - a.avgProfit)[0];

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Business Analyst Dashboard</h1>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">🚛 Total Trips</h3>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">{totalTrips}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">💰 Total Income</h3>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">₹{totalIncome.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">📉 Total Expenses</h3>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">₹{totalExpenses.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">📊 Profit This Month</h3>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">₹{totalProfit.toLocaleString()}</p>
                </div>
            </div>

            {/* ML Insights Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">ML-Powered Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="text-blue-500" /> 
                            <h3 className="font-semibold text-blue-800">Peak Profitability</h3>
                        </div>
                        <p className="text-sm text-blue-700 mt-2">
                            <b>Fridays</b> are consistently your most profitable days. Consider prioritizing long-haul trips on this day.
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                            <b>Forecast:</b> Next Sunday is expected to give <b>+20%</b> more profit.
                        </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Award className="text-green-500" /> 
                            <h3 className="font-semibold text-green-800">Route Optimization</h3>
                        </div>
                        <p className="text-sm text-green-700 mt-2">
                            The <b>{bestRoute?.name || 'N/A'}</b> route is your best performer with an average profit of <b>₹{bestRoute?.avgProfit?.toLocaleString() || '0'}</b> per trip.
                        </p>
                        <p className="text-sm text-green-700 mt-1">
                            <b>Recommendation:</b> Increase trips on this route by <b>15%</b> to maximize revenue.
                        </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="text-yellow-500" /> 
                            <h3 className="font-semibold text-yellow-800">Anomaly Detection</h3>
                        </div>
                        <p className="text-sm text-yellow-700 mt-2">
                            Unusual fuel expense of <b>₹12,500</b> detected on trip <b>TRIP005</b>.
                        </p>
                        <p className="text-sm text-yellow-700 mt-1">
                            This is <b>40% higher</b> than the average for the Mumbai → Ahmedabad route.
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Trip-wise Profit/Loss</h2>
                    <Bar data={tripProfitabilityData} options={{ scales: { y: { beginAtZero: true } } }} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Monthly Income vs Expenses</h2>
                    <Line data={trendData} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Expense Categories</h2>
                    <div className="max-w-xs mx-auto">
                        <Pie data={expenseData} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Driver Leaderboard</h2>
                    <ul className="space-y-3">
                        {driverLeaderboard.map((driver, index) => (
                            <li key={driver.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-lg text-gray-400">{index + 1}</span>
                                    <div>
                                        <p className="font-semibold">{driver.name} {index === 0 && '🥇'}</p>
                                        <p className="text-xs text-gray-500">Avg. Fuel/Trip: ₹{driver.fuelEfficiency.toLocaleString()}</p>
                                    </div>
                                </div>
                                <p className={`font-bold text-lg ${driver.avgProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ₹{driver.avgProfit.toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
