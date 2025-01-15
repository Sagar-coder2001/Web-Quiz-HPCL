import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Important: Auto-import to register necessary components
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Loading from '../Loading';
import DataNotFound from '../DataNotFound';


const Dashboard = ({ darkMode }) => {
    const navigate = useNavigate();

    // Data for Pie Chart
    const pieData = {
        labels: ['Group A', 'Group B', 'Group C', 'Group D'],
        datasets: [
            {
                data: [400, 300, 300, 200],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            },
        ],
    };
    const [totalCategory, setTotalCategory] = useState('');
    const [totalVisit, setTotalVisit] = useState('');
    const [totalUser, setTotalUser] = useState('4');
    const [loading, setLoading] = useState(true);
    const [dataFound, setDataFound] = useState(false);


    // Data for Bar Chart
    const [barData, setBarData] = useState({
        labels: ['2024-11-10', '2024-11-11', '2024-11-12', '2024-11-13'],
        datasets: [
            {
                label: 'Visits',
                data: [3900, 3000, 2000, 2780],
                backgroundColor: '#82ca9d',
            },
        ],
    });

    // Options for the Bar Chart
    const options = {
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: darkMode ? '#555' : '#e0e0e0',
                },
                ticks: {
                    color: darkMode ? '#fff' : '#000',
                },
            },
            x: {
                grid: {
                    color: darkMode ? '#555' : '#e0e0e0',
                },
                ticks: {
                    color: darkMode ? '#fff' : '#000',
                },
            },
        },
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Prepare the form data with username and token
                const formData = new FormData();
                formData.append('username', localStorage.getItem('username'));
                formData.append('token', localStorage.getItem('token'));

                // Fetch data from the API
                const response = await fetch('http://localhost/WebQuiz/Admin/dashBoard.php?do=get', {
                    method: 'POST',
                    body: formData,
                });

                // Check if response is okay
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                console.log(result);

                // Check if the API responded with valid data
                if (result.Status === true) {
                    // Safely set state with fetched data
                    setTotalCategory(result.DashBoard.Count_Category || 0);
                    setTotalUser(result.DashBoard.Count_User || 0);
                    setTotalVisit(result.DashBoard.Count_Vist || 0);

                    // Ensure that BarData is structured correctly before setting state
                    if (result.DashBoard.BarData && Array.isArray(result.DashBoard.BarData[0]?.labels)) {
                        setBarData({
                            labels: result.DashBoard.BarData[0].labels || [],
                            datasets: [
                                {
                                    label: 'Visits',
                                    data: result.DashBoard.BarData[0].datasets[0]?.data || [],
                                    backgroundColor: '#82ca9d',
                                },
                            ],
                        });
                    } else {
                        setBarData({
                            labels: [],
                            datasets: [
                                {
                                    label: 'Visits',
                                    data: [],
                                    backgroundColor: '#82ca9d',
                                },
                            ],
                        });
                    }
                    setDataFound(true);
                } else if (result.Authentication === false) {
                    // Redirect to login page if authentication failed
                    navigate('/Login');
                } else {
                    // If status is not true, handle the case where data isn't available
                    setDataFound(false);
                }
            } catch (err) {
                // Log and handle any fetch errors
                console.error(err.message);
                setDataFound(false); // Set dataFound to false in case of error
            } finally {
                // Ensure loading state is set to false once the operation completes
                setLoading(false);
            }
        };

        // Fetch the data on component mount
        fetchData();
    }, [navigate]);

    if (loading) {
        return <Loading darkMode={darkMode} />;
    }

    if (!dataFound) {
        return <DataNotFound darkMode={darkMode} />
    }

    return (
        <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-300 text-black'} min-h-screen p-6`}>
            <div className="flex text-center flex-col md:flex-row justify-around my-10">
                <div className={`w-full md:w-1/4 p-4 rounded-lg shadow-md mb-4 md:mb-0 transition-transform transform hover:scale-105 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h3 className="text-lg font-semibold">Total Number of Category</h3>
                    <h4 className='text-3xl font-bold text-blue-600 mt-2'>{totalCategory}</h4> {/* Highlighted number */}
                </div>

                <div className={`w-full md:w-1/4 p-4 rounded-lg shadow-md mb-4 md:mb-0 transition-transform transform hover:scale-105 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h3 className="text-lg font-semibold">Total Number of Visit</h3>
                    <h4 className='text-3xl font-bold text-blue-600 mt-2'>{totalVisit}</h4> {/* Highlighted number */}
                </div>

                <div className={`w-full md:w-1/4 p-4 rounded-lg shadow-md mb-4 md:mb-0 transition-transform transform hover:scale-105 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h3 className="text-lg font-semibold">Total Number of User</h3>
                    <h4 className='text-3xl font-bold text-blue-600 mt-2'>{totalUser}</h4> {/* Highlighted number */}
                </div>
            </div>



            <div className="flex flex-col md:flex-row justify-around my-10">
                <div className={`w-full md:w-1/3 p-4 rounded-lg shadow-md mb-4 md:mb-0 transition-transform transform ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h3 className="text-lg font-semibold mb-4">Pie Chart</h3>
                    <div className='mx-10' style={{ height: '300px' }}>
                        <Pie data={pieData} />
                    </div>
                </div>

                <div className={`w-full md:w-1/2 p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h3 className="text-lg font-semibold mb-4">Bar Graph</h3>
                    <div style={{ height: '300px' }}>
                        <Bar data={barData} options={options} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
