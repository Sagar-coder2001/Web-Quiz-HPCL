import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './Register.css'
import { Card } from '@mui/material';
import startbtn from '../../assets/Start.gif'
import bg from '../../assets/01.gif'

const Startpage = () => {
    // const [clickstart, setClickStart] = useState(false);
    const location = useLocation();
    const username = location.state?.firstname; 

    const navigate = useNavigate();

    const playquiz = () => {
        navigate('/play')
    }
  return (
    <div>
      <Navbar/>
      <div className="app-container">
        <div className="container-sm">
       <Card sx={{ padding: '30px 15px', width:'450px', margin:'0px auto', maxWidth:'100%',backgroundColor:'#182638' ,color: 'white', backgroundImage:`linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url(${bg})`, backgroundRepeat:'no-repeat', backgroundPosition:'center', objectFit:'cover', backgroundSize:'cover'}}>
        <div className="row d-flex justify-content-center align-items-center">
                <div className="userprofile">
                <div><span style={{fontSize:'30px', color:'crimson'}}>Welcome</span><span style={{marginLeft:'8px', fontSize:'20px'}}>{username}...</span></div>
            </div>
            <div className="instruction">
            <div className="p-6 mt-5 rounded-lg shadow-lg w-full max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4" style={{fontSize:'30px'}}>Instructions:</h3>
              <hr></hr>
              <div className="instruct" style={{fontSize:'20px'}}>
              <p className="mb-1 mt-3">1. Read each question carefully.</p>
              <p className="mb-1">2. Select the answer you believe is correct.</p>
              <p className="mb-1">3. You will have a limited time to answer each question.</p>
              <p className="text-lg">Good luck and have fun!</p>
              </div>
            </div>
            </div>
            {/* <img src={startbtn} alt="" onClick={playquiz} /> */}
        </div>
        </Card>
        </div>
      </div>
    </div>
  )
}

export default Startpage