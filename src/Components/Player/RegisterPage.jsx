import React, { useState, useEffect, Component } from 'react';
import { useLocation } from 'react-router-dom';
import Loading from '../../Components/Loading.jsx';
import { useNavigate } from 'react-router-dom'; // Import useNaviga
import './Register.css'
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import { Card } from '@mui/material';
import quizimg from '../../assets/userquiz.gif'
import Navbar from './Navbar';
import TypewriterComponent from 'typewriter-effect';


const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Name: '',
    Contact: '',
    email: '',
    Gender: '',
    orgName: '',
  });

  const [type, setType] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (value.trim() !== '') {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.Name) {
      newErrors.Name = 'Username is required.';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.Name)) {
      // Ensure name contains only letters and spaces
      newErrors.Name = 'Name must contain only letters and spaces.';
    }

    if (!formData.Contact) {
      newErrors.Contact = 'Contact is required.';
    } else if (/^[a-zA-Z\s]+$/.test(formData.Contact)) {
      // Ensure name contains only letters and spaces
      newErrors.Contact = 'Contact must contain only number.';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      // Email regex pattern for proper format
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.Gender) {
      newErrors.Gender = 'Gender is required.';
    }
    return newErrors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // navigate('/play', { state: { firstname: formData.firstName } });
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setLoading(true);
      try {
        // Create a new FormData object
        const formData1 = new FormData();
        formData1.append('name', formData.Name);
        formData1.append('contact', formData.Contact);
        formData1.append('email', formData.email);
        formData1.append('gender', formData.Gender);
        formData1.append('orgName', formData.orgName);
        // formData1.append('GID', gid);

        const response = await fetch('http://192.168.1.25/Vedanta/API/registerUser.php', {
          method: 'POST',
          body: formData1,
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const result = await response.json();
        console.log(result.UID)
        console.log(result);
        if (result.Status == true) {
          setMessage(result.Message);
          setErrors({});
          setType(false);
          localStorage.setItem('contact', formData.Name); // Example of storing a token
          // localStorage.setItem('email', formData.email);
          localStorage.setItem('UID', result.UID);
          navigate('/play', { state: { name: formData.Name, gender: formData.Gender, uid: result.UID } });
        }
        else {
          console.log(result);
          setType(true);
          setMessage(result.Message);
        }
      } catch (err) {
        console.error(err);
        setType(true);
        setMessage(err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <Loading darkMode={false} />; // Adjust based on your darkMode logic

  return (
    <>
      <Navbar />
      <div className="app-container">
        <div className="container-fluid" style={{ marginTop: '80px', marginBottom: '20px' }}>
          <Card className='p-2 p-lg-5' sx={{
            backgroundColor: 'transparent',
            boxShadow: '0px 0px 4px',
            borderRadius: '10px',
          }}>
            <div className="row d-flex justify-content-center align-items-center">
              <div className="col-xl-6">
                <div className="card-container p-0 p-lg-5 mb-5" >
                  <div className="img-container" style={{ width: '100%' }}>
                    <img src={quizimg} alt="Quiz Test" className="w-[200px] md:w-[300px]" />
                  </div>
                  <div className="heading  d-sm-block mt-3">
                    <h1 style={{ fontSize: '25px' }}>Welcome To Vedanta Transforming For Good...
                      <TypewriterComponent
                        options={{
                          strings: ["We are Providing Amazing Carbon Footprint Quiz!!!!"],
                          autoStart: true,
                          loop: true,
                          delay: 50,
                        }}
                      />
                    </h1>
                    <p className='mt-3 fs-5'>
                      Challenge yourself with our exciting quizzes! Each quiz is designed to enhance your understanding and provide useful insights.
                      <strong> Register to play the Quiz!</strong>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-xl-6">
                <div className="form-container">
                  <form action="#" onSubmit={handleSubmit}>
                    {type && (
                      <div role="alert" className="col-span-6 rounded border-s-4 mb-4 border-red-500 bg-red-50 p-4">
                        <strong className="block font-medium text-red-800">Something went wrong</strong>
                        <p className="mt-2 text-sm text-red-700">{message}</p>
                      </div>
                    )}
                    <div className='col-span-6 text-center' style={{ fontSize: '30px', marginBottom: '30px' }}>
                      Registration
                    </div>

                    <hr className='mb-4' />
                    <div className="col-span-6">
                      <label htmlFor="name" className="block mt-2"> <PersonIcon sx={{ marginBottom: '3px' }} /><strong className='ml-2'>Username</strong></label>
                      <input
                        type="text"
                        id="Name"
                        name="Name"
                        className="form-control mt-2 text-dark p-3"
                        // placeholder="Enter your name"
                        value={formData.Name}
                        onChange={handleChange}
                        style={{
                          boxShadow: '0px 0px 4px inset',
                          borderRadius: '8px',
                          outline: 'none',
                          fontSize: '18px'
                        }}
                      />
                      {errors.Name && <p className="mt-2 ml-2 text-md text-red-600">{errors.Name}</p>}
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="contact" className="block mt-2"> <PhoneRoundedIcon sx={{ marginBottom: '3px' }} /><strong className='ml-2'>Contact</strong></label>
                      <input
                        type="tel"
                        id="contact"
                        name="Contact"
                        maxLength={10}
                        className="form-control mt-2 text-dark p-3"
                        // placeholder="Enter your name"
                        value={formData.Contact}
                        onChange={handleChange}
                        style={{
                          boxShadow: '0px 0px 4px inset',
                          borderRadius: '8px',
                          outline: 'none',
                          fontSize: '18px'
                        }}
                      />
                      {errors.Contact && <p className="mt-2 ml-2 text-md text-red-600">{errors.Contact}</p>}
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="email" className="block mt-2"> <EmailIcon sx={{ marginBottom: '3px' }} /><strong className='ml-2'>Email</strong></label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control mt-2 text-dark p-3"
                        // placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{
                          borderRadius: '8px',
                          outline: 'none',
                          fontSize: '18px',
                          boxShadow: '0px 0px 4px inset'
                        }}
                      />
                      {errors.email && <p className="mt-2 ml-2 text-md text-red-600">{errors.email}</p>}
                    </div>

                    <div className="col-span-6">
                      <label htmlFor="radio" className="block mt-2"> <EmailIcon sx={{ marginBottom: '3px' }} /><strong className='ml-2'>Gender</strong></label>
                      <select name="Gender" className="form-control mt-2 text-dark p-3 gender" value={formData.Gender} onChange={handleChange}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.Gender && <p className="mt-2 ml-2 text-md text-red-600">{errors.Gender}</p>}
                    </div>

                    <div className="col-span-6">
                      <label htmlFor="name" className="block mt-2"> <PersonIcon sx={{ marginBottom: '3px' }} /><strong className='ml-2'>Orgnisation Name</strong></label>
                      <input
                        type="text"
                        id="orgName"
                        name="orgName"
                        className="form-control mt-2 text-dark p-3"
                        // placeholder="Enter your name"
                        value={formData.orgName}
                        onChange={handleChange}
                        style={{
                          boxShadow: '0px 0px 4px inset',
                          borderRadius: '8px',
                          outline: 'none',
                          fontSize: '18px'
                        }}
                      />
                    </div>
                    <div class="mb-3 form-check mt-2">
                      <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
                        <label class="form-check-label" for="exampleCheck1">Check me out</label>
                    </div>

                    <div className="col-span-6">
                      <button
                        type="submit"
                        className="form-control p-3 submit"
                      >
                        <strong>{loading ? 'Checking' : 'Register'}</strong>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
