import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = ({ type = 'none' }) => {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false); // State to manage alert visibility
  const [alertMessage, setAlertMessage] = useState(''); // State to manage alert visibility


  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // setError(null); // Reset error state on new submission

    try {
      const formData = new FormData();
      formData.append('username', username); // Replace with your actual key-value pairs
      formData.append('password', password);

      const response = await fetch('http://localhost/WebQuiz/Admin/log.php?do=login', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if (result.Status == true) {
        navigate('/Admin');
        sessionStorage.setItem('Content', 'Dashboard');
        // console.log(result);
      } else {
        console.log(result);
        setAlertMessage(result.Message);
        setAlertVisible(true);
      }
      localStorage.setItem('token', result.Token); // Example of storing a token
      localStorage.setItem('username', username); // Example of storing a token
    } catch (err) {
      console.log(err);

      setAlertMessage(err.Message);
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Loading />
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-300">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        {/* Conditional Alert */}
        {type === 'alert' && (
          <div role="alert" className="rounded border-s-4 mb-4 border-red-500 bg-red-50 p-4">
            <strong className="block font-medium text-red-800"> Something went wrong </strong>

            <p className="mt-2 text-sm text-red-700">
              Please Sign in again
            </p>
          </div>
        )}
        {alertVisible && (
          <div role="alert" className="rounded border-s-4 mb-4 border-red-500 bg-red-50 p-4">
            <strong className="block font-medium text-red-800"> Something went wrong </strong>

            <p className="mt-2 text-sm text-red-700">
              {alertMessage}
            </p>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-center">Sign in to your account</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="name">
            User Name
          </label>
          <input
            type="text"
            id="name"
            value={username}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Login
        </button>
      </div>
    </div>
  );
};

Login.propTypes = {
  type: PropTypes.string,
};

export default Login;
