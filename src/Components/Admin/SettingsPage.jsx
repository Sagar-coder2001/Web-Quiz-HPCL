import React, { useState } from 'react';
import Loading from '../Loading';
import { useNavigate } from 'react-router-dom'; // Import useNavigate


const EyeIcon = ({ onClick, isVisible }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="h-5 w-5 text-gray-500 cursor-pointer"
    onClick={onClick}
  >
    {isVisible ? (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    ) : (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </>
    )}
  </svg>
);

const SettingsPage = ({ darkMode }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const [username] = useState(localStorage.getItem('username')); // Placeholder for username
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State for adding a new user
  const [newUsername, setNewUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [confirmNewUserPassword, setConfirmNewUserPassword] = useState('');
  const [newUserMessage, setNewUserMessage] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
    } else {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('username', localStorage.getItem('username'));
        formData.append('token', localStorage.getItem('token'));
        formData.append('password', confirmPassword);

        const response = await fetch('http://localhost/WebQuiz/Admin/setting.php?do=changePassword', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result)

        if (result.Authentication == false) {
          navigate('/Login');
        }
        setMessage(result.Message);

      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
      // setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUsername || !newUserPassword || !confirmNewUserPassword) {
      setNewUserMessage("All fields are required.");
    } else if (newUserPassword !== confirmNewUserPassword) {
      setNewUserMessage("New password and confirm password do not match.");
    } else {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('username', localStorage.getItem('username'));
        formData.append('token', localStorage.getItem('token'));
        formData.append('password', confirmNewUserPassword);
        formData.append('newusername',newUsername);

        const response = await fetch('http://localhost/WebQuiz/Admin/setting.php?do=addUser', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result)

        if (result.Authentication == false) {
          navigate('/Login');
        }
        setNewUserMessage(result.Message);

      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
      setNewUsername('');
      setNewUserPassword('');
      setConfirmNewUserPassword('');
    }
  };
  if (loading) {
    return <Loading darkMode={darkMode} />;
  }

  return (
    <div className={`p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} min-h-screen`}>
      <h1 className={`text-3xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-black'}`}>Settings</h1>

      <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <div className="mb-4">
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
          <p className={`p-2 border rounded-md ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>{username}</p>
        </div>

        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange}>
          {/* <div className="mb-6">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Current Password</label>
            <div className="relative flex items-center">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`p-2 border rounded-md w-full pr-10 ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-black'}`}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <EyeIcon onClick={() => setShowCurrentPassword(!showCurrentPassword)} isVisible={showCurrentPassword} />
              </div>
            </div>
          </div> */}

          <div className="mb-6">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>New Password</label>
            <div className="relative flex items-center">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`p-2 border rounded-md w-full pr-10 ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-black'}`}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <EyeIcon onClick={() => setShowNewPassword(!showNewPassword)} isVisible={showNewPassword} />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Confirm New Password</label>
            <div className="relative flex items-center">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`p-2 border rounded-md w-full pr-10 ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-black'}`}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <EyeIcon onClick={() => setShowConfirmPassword(!showConfirmPassword)} isVisible={showConfirmPassword} />
              </div>
            </div>
          </div>

          {message && <p className="text-red-500 mb-4">{message}</p>}

          <button
            type="submit"
            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 ${darkMode ? 'hover:bg-blue-500' : 'hover:bg-blue-800'}`}
          >
            Change Password
          </button>
        </form>
      </div>

      <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} mt-8`}>
        <h2 className="text-xl font-semibold mb-4">Add User</h2>
        <form onSubmit={handleAddUser}>
          <div className="mb-6">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Username</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className={`p-2 border rounded-md w-full ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-black'}`}
              required
            />
          </div>

          <div className="mb-6">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Password</label>
            <div className="relative flex items-center">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                className={`p-2 border rounded-md w-full pr-10 ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-black'}`}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <EyeIcon onClick={() => setShowNewPassword(!showNewPassword)} isVisible={showNewPassword} />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Confirm Password</label>
            <div className="relative flex items-center">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmNewUserPassword}
                onChange={(e) => setConfirmNewUserPassword(e.target.value)}
                className={`p-2 border rounded-md w-full pr-10 ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-black'}`}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <EyeIcon onClick={() => setShowConfirmPassword(!showConfirmPassword)} isVisible={showConfirmPassword} />
              </div>
            </div>
          </div>

          {newUserMessage && <p className="text-green-500 mb-4">{newUserMessage}</p>}

          <button
            type="submit"
            className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200 ${darkMode ? 'hover:bg-green-500' : 'hover:bg-green-800'}`}
          >
            Add User
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
