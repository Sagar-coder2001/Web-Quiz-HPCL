import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '@mui/material';
import Navbar from './Navbar';
import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import thank from '../../assets/thank.gif';
import './Register.css';



// Register necessary chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);



const Score = () => {
  const location = useLocation();
  const { score, totalTime, totalQuestions, } = location.state || {};
  const [finaldata , setFinalData] = useState([])

  // console.log(score , totalQuestions , totalTime,);

  useEffect(() => {
    const fetchScoreData = async () => {
      try {
        const response = await fetch(`http://192.168.1.25/Vedanta/API/getScore.php?UID=${2}`, {
          method: 'GET', 
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json(); 
        console.log(data); 
        setFinalData(data.Result);
        if (result.Status === true) {
          console.log(result); 
        } else {

        }
      } catch (err) {
        console.error('Error fetching score:', err.message);
      }
    };

    fetchScoreData(); // Call the async function to fetch the data

  }, []);


  const totalScore = Object.values(score).reduce((acc, value) => acc + value, 0);
  console.log(totalScore);

  const lineData = {
    labels: Object.keys(score),
    datasets: [
      {
        label: 'Carbon Impact',
        data: Object.values(score),
        borderColor: '#4bc0c0',
        backgroundColor: 'rgba(91, 195, 195)',
        fill: true,
      },
    ],
  };

  return (
    <div>
      <Navbar />
      <div className="app-container">
        <div className="container-fluid" style={{marginTop:'80px', marginBottom:'20px'}}>
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

              <div className="row d-flex justify-content-center align-items-center">

                <div className="col-xl-6">

                  <div className="progressdata">
                    {/* {
                      finaldata.map((item) => {
                        <>
                        <input type="range" value={item} />
                        </>
                      })
                    } */}
                  </div>

                  {/* Line Chart */}
                  <div className="line-chart-container chart" style={{ marginTop: '30px', padding:'10px' }}>
                    <Bar data={lineData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                  </div>
                </div>
              </div>
              <div className="result-summary" style={{ marginTop: '30px' }}>
                <h3>Overall Score: {totalScore}/{totalQuestions}</h3>
                <p>Time Taken: {totalTime} seconds</p>
                <p>Total Carbon Impact: {totalScore} points</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Score;
