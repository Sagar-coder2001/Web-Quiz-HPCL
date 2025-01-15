import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import UnderConstruction from '../UnderConstruction';
import QuizManagement from './QuizManagement';
import SettingsPage from './SettingsPage';
import Loading from '../Loading';
import Leaderboard from './Leaderboard';
import QuizCategoryManagement from './QuizCategoryManagement';
import { useNavigate } from 'react-router-dom'; // Import useNavigate


export default function Home() {
    const navigate = useNavigate();

    const [activeItem, setActiveItem] = useState('Dashboard');
    const [content, setContent] = useState(<Dashboard />);
    const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
    const [pendingItem, setPendingItem] = useState(null); // State to track item to click

    // State to toggle off-canvas visibility for mobile
    const [isOpen, setIsOpen] = useState(false);

    // Function to toggle the off-canvas visibility
    const toggleOffCanvas = () => setIsOpen(!isOpen);

    const handleClick = (item) => {
        setActiveItem(item);
        if (item === 'Dashboard') {
            setContent(<Dashboard darkMode={isDarkMode} />);
        } else if (item === 'Quiz Manage') {
            setContent(<QuizManagement darkMode={isDarkMode} />);
        } else if (item === 'Setting') {
            setContent(<SettingsPage darkMode={isDarkMode} />);
        } else if (item === 'Logout') {
            setContent(<Loading darkMode={isDarkMode} />);
            localStorage.clear();
            sessionStorage.removeItem('Content');
            navigate('/Login');
        } else if (item === 'Leader Board') {
            setContent(<Leaderboard darkMode={isDarkMode} />);
        } else if (item === 'Quiz Category') {
            setContent(<QuizCategoryManagement darkMode={isDarkMode} />);
        }
        else {
            setContent(<UnderConstruction darkMode={isDarkMode} />);
        }
        sessionStorage.setItem('Content', item);

    };

    useEffect(() => {
        handleClick(sessionStorage.getItem('Content'))
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
        setPendingItem(activeItem); // Set the item to click after dark mode is toggled
    };

    useEffect(() => {
        if (pendingItem) {
            handleClick(pendingItem); // Call handleClick after dark mode is toggled
            setPendingItem(null); // Reset the pending item
        }
    }, [isDarkMode, pendingItem]); // Dependency on isDarkMode and pendingItem

    return (
        <div className={`flex flex-col sm:flex-row h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-300'}`}>
            {/* Side Bar */}
            <div className={`bg-black hidden text-white sm:flex sm:flex-col justify-between w-64 h-full ${isDarkMode ? 'bg-black-800' : 'bg-black'}`}>
                <div className='flex-1'>
                    <div className="mt-4 flex text-center justify-center items-center">
                        <img className='h-10' src="https://www.zealinteractive.in/wp-content/uploads/2024/10/Zeal-interactive-Logo.png" alt="logo" />
                        <span className='ms-2'>Zeal Interactive</span>
                    </div>

                    <nav className="mt-6 text-center">
                        <ul>
                            {['Dashboard', 'Leader Board', 'Quiz Category', 'Quiz Manage', 'Setting'].map((item) => (
                                <li key={item}>
                                    <div
                                        className={`p-4 flex text-white hover:bg-gray-700 cursor-pointer rounded ${activeItem === item ? 'bg-gray-600' : ''}`}
                                        onClick={() => handleClick(item)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            {item === 'Dashboard' && (
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                                            )}
                                            {item === 'Leader Board' && (
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                                            )}
                                            {item === 'Quiz Category' && (
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                                            )}
                                            {item === 'Quiz Manage' && (
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                                            )}
                                            {item === 'Setting' && (
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                                            )}
                                        </svg>
                                        <span className='ms-5'>{item}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div>
                    {/* Dark Mode Toggle */}
                    <div
                        className={`p-4 flex text-white mb-0 hover:bg-gray-700 cursor-pointer rounded`}
                        onClick={toggleDarkMode}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5m0 15v1.5m8.25-9h-1.5m-15 0H3m10.5 0a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z" />
                        </svg>
                        <span className='ms-5'>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </div>

                    {/* Logout Button */}
                    <div
                        className={`p-4 flex text-white mb-0 hover:bg-gray-700 cursor-pointer rounded ${activeItem === "logout" ? 'bg-gray-600' : ''}`}
                        onClick={() => handleClick('Logout')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                        </svg>
                        <span className='ms-5'>Logout</span>
                    </div>
                </div>
            </div>
            {/* For Mobile Device Nav Bar */}
            <div className='sm:hidden'>
                {/* Navbar */}
                <div className={`bg-black flex justify-between items-center text-white w-screen h-16 ${isDarkMode ? 'bg-gray-800' : 'bg-black'}`}>
                    <div className="ml-2 flex items-center">
                        <img className="h-14" src="https://www.zealinteractive.in/wp-content/uploads/2024/10/Zeal-interactive-Logo.png" alt="logo" />
                        <span className="ml-2">Zeal Interactive</span>
                    </div>
                    <div className="mr-5">
                        <button onClick={toggleOffCanvas} className="p-2 text-white rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Off-Canvas */}
                <div
                    className={`fixed inset-y-0 right-0 z-50 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out bg-gray-800 bg-opacity-50`}
                >
                    <div className={`w-64 h-full ${isDarkMode ? 'bg-gray-800' : 'bg-black'} shadow-xl p-5`}>
                        <div className='flex justify-end'>
                            <button onClick={toggleOffCanvas} className="p-2 text-white rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <nav className="mt-6 text-center">
                            <ul>
                                {['Dashboard', 'Leader Board', 'Quiz Category', 'Quiz Manage', 'Dark Mode', 'Setting', 'Logout'].map((item) => (
                                    <li key={item}>
                                        <div
                                            className={`p-4 flex text-white hover:bg-gray-700 cursor-pointer rounded ${activeItem === item ? 'bg-gray-600' : ''}`}
                                            onClick={item === 'Dark Mode' ? toggleDarkMode : () => handleClick(item)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                {item === 'Dashboard' && (
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                                                )}
                                                {item === 'Leader Board' && (
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                                                )}
                                                {item === 'Quiz Category' && (
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                                                )}
                                                {item === 'Quiz Manage' && (
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                                                )}
                                                {item === 'Role Manage' && (
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                )}
                                                {item === 'Dark Mode' && (
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5m0 15v1.5m8.25-9h-1.5m-15 0H3m10.5 0a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z" />
                                                )}
                                                {item === 'Setting' && (
                                                    <>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                    </>
                                                )}
                                                {item === 'Logout' && (
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                                )}

                                            </svg>
                                            <span className='ms-5'>{item}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>

            </div>
            <div className={`w-full h-full ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'} overflow-y-auto max-h-screen`}>
                {content}
            </div>

        </div>
    );
}
