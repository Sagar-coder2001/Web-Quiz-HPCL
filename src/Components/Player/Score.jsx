import React from 'react'
import { useLocation } from 'react-router-dom';
import './Register.css'
import { Card } from '@mui/material';
import Navbar from './Navbar';
import thankyou from '../../assets/Thank You (1).gif'

const Score = () => {
    const location = useLocation();
    const { score, totalTime, totalQuestions } = location.state || {};
  return (
    <div>
        <Navbar/>
       <div className="app-container">
        <div className="container-sm">
          <Card sx={{ padding: '30px 15px', backgroundColor: '#3E5879', color: 'dark'}}>
          <div className="p-6 rounded-lg shadow-lg w-full max-w-md text-white text-center mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">Quiz Results</h2>
                    <p className="text-lg mb-4" style={{fontSize:'25px'}}>
                      You scored <strong>{score}</strong> out of {totalQuestions.length}.<br />
                      Total time taken: <strong>{totalTime} seconds</strong>
                    </p>
                    <p className="mb-4" style={{fontSize:'30px'}}>Thank you for playing!</p>
                    <div className="thankimg">
                    <img src={thankyou} alt="" />
                  </div>
                  </div>
          </Card>
          </div>
          </div>
    </div>
  )
}

export default Score
