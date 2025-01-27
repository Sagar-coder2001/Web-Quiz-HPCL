import React from 'react';
import Navbar from './Player/Navbar';
import { Card } from '@mui/material';

const DataNotFound = ({ darkMode }) => {
  return (
    <>
    <Navbar />
    <div className="app-container">
      <div className="container-fluid" style={{marginTop:'80px', marginBottom:'20px'}}>
        <div className='p-2 p-lg-5' sx={{
          // backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${bg})`,
          // backgroundSize: 'cover',
          // backgroundPosition: 'center',
          // backgroundRepeat: 'no-repeat',
          backgroundColor:'transparent',
          boxShadow: '0px 0px 4px',
           borderRadius: '10px',
        }}>
      <div className="text-center" style={{fontSize:'30px'}}>
        <h1 className='text-danger'>No Data</h1>
        <p className='text-danger'>Data Not Found</p>
        <p className='' style={{fontSize:'18px'}}>We couldn't find any data matching your criteria.</p>
      </div>
      </div>
      </div>
      </div>
    </>
  );
};

export default DataNotFound;
