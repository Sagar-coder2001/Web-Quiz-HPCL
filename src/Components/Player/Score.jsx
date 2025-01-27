import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '@mui/material';
import Navbar from './Navbar';
import { Bar, Pie } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import thank from '../../assets/thank.gif';
import './Register.css';

// Register necessary chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const Score = () => {
  const location = useLocation();
  const { score, totalTime, totalQuestions } = location.state || {};

  console.log(score , totalQuestions , totalTime);

  const totalScore = Object.values(score).reduce((acc, value) => acc + value, 0);
  console.log(totalScore);

  // Prepare the data for the pie chart
  const pieData = {
    labels: Object.keys(score),
    datasets: [
      {
        data: Object.values(score),
        backgroundColor: ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0'],
        hoverBackgroundColor: ['#ff6666', '#3399ff', '#66ff66', '#ff9966', '#b3b3ff'],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for the line chart (showing detailed results over time or categories)
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
                  {/* Line Chart */}
                  <div className="line-chart-container chart" style={{ marginTop: '30px', padding:'10px' }}>
                    <Bar data={lineData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                  </div>
                </div>

                <div className="col-xl-6">
                  {/* Pie Chart */}
                  <div className="pie-chart-container chart" style={{ marginTop: '30px', padding:'10px' }}>
                    <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} style={{width:'100%', height:'100%'}} />
                  </div>
                </div>

              </div>
              {/* Average Percentage Display */}
              {/* <div style={{ marginTop: '20px' }}>
                <h3>Average Percentage: {averagePercentage.toFixed(2)}%</h3>
              </div> */}



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
