import React, { useEffect, useState } from 'react';
import { Box, Card, LinearProgress, Typography } from '@mui/material';
import Navbar from './Navbar';
import thank from '../../assets/thank.gif';
import './Register.css';
import { Car, Flame, Apple, TreePine, ShoppingBag, Factory } from "lucide-react"
import { useLocation } from 'react-router-dom';

// Register necessary chart.js components
const Score = () => {
  const [uid , setUid] = useState('')
  const [finaldata, setFinalData] = useState([])


  
  // useEffect(() => {
  //   const path = new URLSearchParams(window.location.search)
  //   const uid = path.get('uid')
  //   setUid(uid);
  // } , [])


  useEffect(() => {
    const fetchScoreData = async () => {
      try {
        const response = await fetch(`http://192.168.1.25/Vedanta/API/getScore.php?UID=${3}`, {
          method: 'GET', 
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json(); 
        console.log(data); 
        setFinalData(data.Result);
        console.log(finaldata);
      }
       catch (err) {
        console.error('Error fetching score:', err.message);
      }
    };
    fetchScoreData(); 
  }, []);

  const totalscore = 15;

  return (
    <div>
      <Navbar />
      <div className="app-container">
        <div className="container-fluid" style={{ marginTop: '80px', marginBottom: '20px' }}>
          <Card
            sx={{
              padding: '40px 20px',
              boxShadow: '0px 0px 10px ',
              borderRadius: '10px',
              backgroundColor: 'transparent',
              textAlign: 'center',
            }}
          >
            <div>
              <div className="username">
                <h3>sagar shinde</h3>
              </div>
              <hr className="m-3" />
              <h1 style={{ fontSize: '35px' }}>Carbon Quiz Calculator</h1>
              <div className="carbon" style={{marginTop:'70px'}}>
                <div className="relative w-full max-w-3xl mx-auto p-2">
                  <div className="aspect-square relative">
                    {/* Main circular background */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-100 to-green-200 border-4 border-green-300">
                      {/* Footprint shape overlay */}
                      <div className="absolute inset-0 bg-green-500/20 rounded-full clip-path-footprint border-2" />
                    </div>

                    {/* Center text */}
                    {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                      <h2 className="text-xl font-bold text-green-800">CARBON</h2>
                      <h3 className="text-lg font-semibold text-green-700">FOOTPRINT</h3>
                      <p className="text-sm text-green-600">INFOGRAPHIC</p>
                    </div> */}

                    {/* Data points */}
                    <div className="absolute inset-0">
                      {/* Energy */}
                      <div className="absolute top-[15%] left-[10%] flex flex-col items-center">
                        <div className="bg-white p-3 rounded-full shadow-lg mb-2">
                          <Flame className="w-6 h-6 text-orange-500" />
                        </div>
                        <div className="text-center absolute top-[-100%] right-[80%]">
                          <div className="text-2xl font-bold text-green-600">
                            {
                            ((finaldata.Energy / totalscore) * 100).toFixed(2)
                            }
                            </div>
                          <div className="text-sm font-medium text-green-700">Energy</div>
                        </div>
                      </div>

                      {/* Food */}
                      <div className="absolute top-[0%] right-[45%] flex flex-col items-center">
                        <div className="bg-white p-3 rounded-full shadow-lg mb-2">
                          <TreePine className="w-6 h-6 text-green-500" />
                        </div>
                        <div className="text-center absolute top-[-90%] right-[0%]">
                        <div className="text-2xl font-bold text-white-200">
                        {
                            ((finaldata.Food / totalscore) * 100).toFixed(2)
                            }
                          </div>
                          <div className="text-sm font-medium text-green-700">Food</div>
                        </div>
                      </div>

                      {/* Life style */}
                      <div className="absolute top-[10%] right-[9%] flex flex-col items-center">
                        <div className="bg-white p-3 rounded-full shadow-lg mb-2">
                          <Apple className="w-6 h-6 text-red-500" />
                        </div>
                        <div className="text-center absolute top-[-100%] right-[-40%]">
                          <div className="text-2xl font-bold text-green-600">
                          {
                            ((finaldata.Lifestyle / totalscore) * 100).toFixed(2)
                            }                            </div>
                          <div className="text-sm font-medium text-green-700">Lifestyle</div>
                        </div>
                      </div>

                      {/* Transport */}
                      <div className="absolute bottom-[10%] right-[6%] flex flex-col items-center">
                        <div className="bg-white p-3 rounded-full shadow-lg mb-2">
                          <Car className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div className="text-center absolute bottom-[-80%] right-[-40%]">
                          <div className="text-2xl font-bold text-green-600">
                          {
                            ((finaldata.Transport / totalscore) * 100).toFixed(2)
                            }
                            </div>
                          <div className="text-sm font-medium text-green-700">Transport</div>
                        </div>
                      </div>
                      {/* Waste */}
                      <div className="absolute bottom-[5%] left-[20%] -translate-x-1/2 flex flex-col items-center">
                        <div className="bg-white p-3 rounded-full shadow-lg mb-2">
                          <ShoppingBag className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="text-center absolute bottom-[-70%] right-[60%]">
                        <div className="text-2xl font-bold text-green-600">
                        {
                            ((finaldata.Waste / totalscore) * 100).toFixed(2)
                            }
                          </div>
                          <div className="text-sm font-medium text-green-700">Waste</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Score;