import React, { useState, useEffect, Component } from 'react';
import { useLocation } from 'react-router-dom';
import Loading from '../Loading';
import { useNavigate } from 'react-router-dom'; // Import useNaviga
import './Register.css'
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { Card } from '@mui/material';
import quizimg from '../../assets/Quiz.gif'
import Navbar from './Navbar';
import bg from '../../assets/qustion mark 3.png'

const RegisterPage = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    passwordConfirmation: '',
  });

  const [type, setType] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [gid, setGid] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const gidFromUrl = queryParams.get('GID');
    if (gidFromUrl) {
      setGid(gidFromUrl);
    } else {
      setType(true);
      setMessage('Game ID not found. Please scan the QR code correctly.');
    }
  }, [location]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required.';
    if (!formData.lastName) newErrors.lastName = 'Last name is required.';
    if (!formData.email) newErrors.email = 'Email is required.';
    if (!formData.contactNumber) newErrors.contactNumber = 'Contact number is required.';
    return newErrors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // navigate('/Startpage', { state: { firstname: formData.firstName } });
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setLoading(true);
      try {
        // Create a new FormData object
        const formData1 = new FormData();
        formData1.append('firstName', formData.firstName);
        formData1.append('lastName', formData.lastName);
        formData1.append('email', formData.email);
        formData1.append('contact', formData.contactNumber);
        formData1.append('GID', gid); // Include GID if needed

        const response = await fetch('http://192.168.1.50/WebQuiz/register.php', {
          method: 'POST',
          body: formData1,
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const result = await response.json();
        console.log(formData1);
        if (result.Status == true) {
          setMessage(result.Message);
          setErrors({});
          setType(false);
          localStorage.setItem('contact', formData.contactNumber); // Example of storing a token
          localStorage.setItem('email', formData.email);
          localStorage.setItem('gid', gid);
          navigate('/Startpage', { state: { firstname: formData.firstName } });
        } else {
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

      {/* <section className="bg-gradient-to-b from-pink-500 to-purple-500">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="https://plus.unsplash.com/premium_photo-1672114873892-d0ff9c9f075e?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="hidden lg:relative lg:block lg:p-12">
            <a className="block text-white" href="#">
              <span className="sr-only">Home</span>
              <img
                className="h-8 sm:h-10"
                src="https://www.zealinteractive.in/wp-content/uploads/2024/10/Zeal-interactive-Logo.png"
                alt="Home"
              />
            </a>

            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Welcome to Zeal Interactive Service 🦑
            </h2>

            <p className="mt-4 leading-relaxed text-white/90">
              Get ready to test your knowledge with our engaging quizzes! Each quiz is designed to challenge your understanding and provide valuable insights. Whether you’re brushing up on a subject or exploring something new, you’ll find plenty of fun and informative questions to enhance your learning experience.
            </p>
          </div>
        </section>

        <main
          className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
        >
          <div className="max-w-xl lg:max-w-3xl">
            <div className="relative -mt-16 block lg:hidden">
              <a
                className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20"
                href="#"
              >
                <span className="sr-only">Logo</span>
                <img
                  className="h-8 sm:h-10"
                  src="https://www.zealinteractive.in/wp-content/uploads/2024/10/Zeal-interactive-Logo.png"
                  alt="Logo"
                />
              </a>

              <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                Welcome to Zeal Interactive Service 🦑
              </h1>

              <p className="mt-4 leading-relaxed text-slate-50">
                Challenge yourself with our exciting quizzes! Each quiz is designed to enhance your understanding and provide useful insights. Whether you’re brushing up on existing knowledge or diving into new subjects, you’ll find plenty of enjoyable and informative questions.
                <strong> Sign up to play!</strong>
              </p>



            </div>
            <form action="#" className="mt-8 grid grid-cols-6 gap-6" onSubmit={handleSubmit}>
              {type && (
                <div role="alert" className="col-span-6 rounded border-s-4 mb-4 border-red-500 bg-red-50 p-4">
                  <strong className="block font-medium text-red-800">Something went wrong</strong>
                  <p className="mt-2 text-sm text-red-700">{message}</p>
                </div>
              )}
              <div className='col-span-6 text-center text-white font-bold text-2xl'>Registration</div>
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="firstName" className="block text-sm font-medium text-white">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm h-12 pl-3 py-2 placeholder-gray-400"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>}
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="lastName" className="block text-sm font-medium text-white">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm h-12 pl-3 py-2 placeholder-gray-400"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>}
              </div>
              <div className="col-span-6">
                <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm h-12 pl-3 py-2 placeholder-gray-400"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
              </div>
              <div className="col-span-6">
                <label htmlFor="contact" className="block text-sm font-medium text-white">Contact</label>
                <input
                  type="tel"
                  id="contact"
                  name="contactNumber"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm h-12 pl-3 py-2 placeholder-gray-400"
                  placeholder="Enter your contact number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  maxLength={10}
                />
                {errors.contactNumber && <p className="mt-2 text-sm text-red-600">{errors.contactNumber}</p>}
              </div>
              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button
                  type="submit"
                  className="w-full inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section> */}
      <Navbar/>
      <div className="app-container">
        <div className="container-sm">
          <Card sx={{ padding: '30px 15px', backgroundColor:'#3E5879' ,color: 'white', backgroundImage:`linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url(${bg})`, backgroundRepeat:'no-repeat', backgroundPosition:'center', objectFit:'cover', backgroundSize:'cover'}}>
            <div className="row d-flex justify-content-center align-items-center">
              <div className="col-lg-6">
                <div className="card-container p-0 p-md-5"
                >  
                <div className="img-container" style={{width:'100%'}}>
                  <img src={quizimg} alt="Quiz Test" style={{width:'300px', margin:'0px auto'}} />
                </div>
                  <div className="heading d-none d-sm-block">
                    <h2 className='fs-5'>Welcome To zeal Interactive Services....</h2>
                  <p className='mt-3'>
                    Challenge yourself with our exciting quizzes! Each quiz is designed to enhance your understanding and provide useful insights.
                    <strong> Sign up to play!</strong>
                  </p>
                </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-container">
                  <form action="#" onSubmit={handleSubmit}>
                    {type && (
                      <div role="alert" className="col-span-6 rounded border-s-4 mb-4 border-red-500 bg-red-50 p-4">
                        <strong className="block font-medium text-red-800">Something went wrong</strong>
                        <p className="mt-2 text-sm text-red-700">{message}</p>
                      </div>
                    )}
                    <div className='col-span-6 text-center' style={{ fontSize: '30px' }}>Registration</div>
                    <div className="col-span-6">
                      <label htmlFor="firstName" className="block mt-2"> <PersonIcon /><strong>First Name</strong></label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="form-control mt-2 text-white"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                      {errors.firstName && <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>}
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="lastName" className="block mt-2"> <PersonIcon /><strong>Last Name</strong></label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="form-control mt-2 text-white"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                      {errors.lastName && <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>}
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="email" className="block mt-2"> <EmailIcon /><strong>Email</strong></label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control mt-2 text-white"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="contact" className="block mt-2"> <PhoneIcon /><strong>Contact</strong></label>
                      <input
                        type="tel"
                        id="contact"
                        name="contactNumber"
                        className="form-control mt-2 text-white"
                        placeholder="Enter your contact number"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        maxLength={10}
                      />
                      {errors.contactNumber && <p className="mt-2 text-sm text-red-600">{errors.contactNumber}</p>}
                    </div>
                    <div className="col-span-6">
                      <button
                        type="submit"
                        className="form-control mt-3 "
                      >
                        <strong>Register</strong>
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
