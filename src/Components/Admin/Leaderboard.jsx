import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import DataNotFound from '../DataNotFound';
import Loading from '../Loading';


const Leaderboard = ({ darkMode }) => {
    const navigate = useNavigate();

    const [leaderboardData, setLeaderBoard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataFound, setDataFound] = useState(false);



    const [categories, setCategories] = useState([]);

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const scoresPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const formData = new FormData();
                formData.append('username', localStorage.getItem('username'));
                formData.append('token', localStorage.getItem('token'));
                formData.append('categoryID', selectedCategory);
                formData.append('date', selectedDate);

                const response = await fetch('http://localhost/WebQuiz/Admin/leaderBoard.php?do=get', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                console.log(result)

                if (result.Status == true) {
                    setLeaderBoard(result.LeaderBoard)
                    setDataFound(true);

                } else if (result.Authentication == false) {
                    navigate('/Login');
                } else {
                    setDataFound(false);
                }

                if (result.Category.Status == true) {
                    setCategories(result.Category.Data);
                }

            } catch (err) {
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate, selectedDate, selectedCategory]);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        console.log('Selected Date:', e.target.value);
        setCurrentPage(1); // Reset to first page on date change
    };

    const handleCategoryChange = async (e) => {
        console.log('Selected Category:', e.target.value);
        setSelectedCategory(e.target.value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        const header = [['Rank', 'Name', 'Score', 'Date', 'Category']];
        const pdfData = leaderboardData.map((entry, index) => [
            index + 1,
            entry.name,
            entry.score,
            entry.date,
            entry.category,
        ]);

        doc.autoTable({
            head: header,
            body: pdfData,
            theme: 'grid',
        });

        const filename = (selectedCategory =='')?'Leaderboard':selectedCategory; 

        doc.save(filename + `.pdf`);
    };

    if (loading) {
        return <Loading darkMode={darkMode} />;
    }

    return (
        <div className={`p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-300 text-black'} min-h-screen`}>
            <h1 className="text-3xl font-bold mb-6 text-center">Leaderboard</h1>

            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row items-center justify-between">
                <div className="flex-1 mr-4 mb-4 sm:mb-0">
                    <label htmlFor="date" className="block text-sm font-medium mb-2">
                        Select Date
                    </label>
                    <input
                        type="date"
                        id="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className={`p-2 border ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'} rounded-md w-full`}
                    />
                </div>
                <div className="flex-1 mr-4 mb-4 sm:mb-0">
                    <label htmlFor="category" className="block text-sm font-medium mb-2">
                        Select Category
                    </label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className={`p-2 border ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'} rounded-md w-full`}
                    >
                        <option value="">--Select Category--</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex-none">
                    <button
                        onClick={downloadPDF}
                        className={`px-4 py-2 mt-7 ${darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded transition duration-200`}
                    >
                        Download PDF
                    </button>
                </div>
            </div>

            {dataFound ? (<>
                {/* Leaderboard Table */}
                <table className={`min-w-full rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} border border-gray-300`}>
                    <thead>
                        <tr className={`text-sm leading-normal ${darkMode ? 'bg-blue-700' : 'bg-blue-500'} text-white`}>
                            <th className="py-3 px-6 text-left">Rank</th>
                            <th className="py-3 px-6 text-left">Name</th>
                            <th className="py-3 px-6 text-left">Score</th>
                            <th className="py-3 px-6 text-left">Date</th>
                            <th className="py-3 px-6 text-left">Category</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-light">
                        {leaderboardData.slice((currentPage - 1) * scoresPerPage, currentPage * scoresPerPage).map((entry, index) => (
                            <tr key={entry.id} className={`border-b border-gray-200 hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''} transition duration-200 ease-in-out`}>
                                <td className="py-3 text-center px-6">{index + 1 + (currentPage - 1) * scoresPerPage}</td>
                                <td className="py-3 px-6 text-left">{entry.name}</td>
                                <td className="py-3 px-6 text-left">{entry.score}</td>
                                <td className="py-3 px-6 text-left">{entry.date}</td>
                                <td className="py-3 px-6 text-left">{entry.category}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-6">
                    {Array.from({ length: Math.ceil(leaderboardData.length / scoresPerPage) }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 mx-1 ${currentPage === index + 1 ? (darkMode ? 'bg-blue-600' : 'bg-blue-500') : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')} text-white rounded transition duration-200`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </>) : (<DataNotFound />)}

        </div>
    );
};

export default Leaderboard;
