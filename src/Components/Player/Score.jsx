import React, { useEffect, useState } from 'react';
import { Card, CircularProgress, LinearProgress } from '@mui/material';
import Navbar from './Navbar';
import './Register.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Score = () => {
  const [finaldata, setFinalData] = useState({});
  const [highestScore, setHighestScore] = useState(null);
  const [highestScoreCategory, setHighestScoreCategory] = useState(null);
  const [maxScore, setMaxScore] = useState(0);  // To find the max score across all categories
  const [average, setAverage] = useState();

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
        setFinalData(data.Result); // Assuming data.Result is an object now

        // Assuming data.Result is an object where keys are categories and values are the scores
        if (data.Result) {
          let highest = { score: -Infinity, category: null }; // Initialize with a very low score

          // Find the highest score and set max score for scaling
          for (const category in data.Result) {
            const score = data.Result[category];

            // Update highest score and category
            if (score > highest.score) {
              highest = { score, category };
            }
          }
          setHighestScore(highest.score);
          setHighestScoreCategory(highest.category); // Set the category that had the highest score
          setMaxScore(9); // Set the max score for scaling progress bars
        }
      } catch (err) {
        console.error('Error fetching score:', err.message);
      }
    };
    fetchScoreData(); // Call the async function to fetch the data
  }, []);

  const total = 25;
  const outoff = 45

  const percentage = (total / outoff) * 100;

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
              <h1 style={{ fontSize: '30px', marginBottom: '8px' }}>Carbon Quiz Calculator</h1>

              <div className="row d-flex justify-content-center align-items-center">
                <div className="col-xl-6">
                  {/* Display Highest Score */}
                  {highestScore !== null && highestScoreCategory !== null ? (
                    <div className="progressdata">
                      <h2 style={{ fontSize: '25px' }}> Your Highest Score Is: {highestScore}</h2>
                      <h3 className='mt-2' >Category: {highestScoreCategory}</h3>
                    </div>
                  ) : ''}

                  <div className="row  mt-3 p-1 lineardiv">
                    <div className="col-lg-6 border-1 p-2">
                      {/* Display Progress for Each Category */}
                      {Object.keys(finaldata).map((category) => {
                        const score = finaldata[category];

                        // Normalize the score to be between 0 and 100 based on the max score
                        const progress = (score / maxScore) * 100;

                        return (
                          <div key={category} className='lineardata mt-3'>
                            <h4 className='text-start m-2'>{category}: {score}</h4>
                            <LinearProgress variant="determinate" value={progress} sx={{ height: '10px', borderRadius: '20px' }} />
                          </div>
                        );
                      })}
                    </div>
                    <div className="col-lg-6 mt-4">
                      <div style={{maxWidth:'100%', width:'300px', margin:'0px auto'}}>
                      <CircularProgressbar
                        value={percentage}
                        text={`${total} / ${outoff}`}
                        circleRatio={0.75}
                        styles={buildStyles({
                          rotation: 1 / 2 + 1 / 8,
                          strokeLinecap: "butt",
                          trailColor: "#eee",
                          pathColor: "#4caf50",
                          textColor: "#333",
                        })}
                      />
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
