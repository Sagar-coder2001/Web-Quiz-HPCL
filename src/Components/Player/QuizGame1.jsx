import React, { useState, useEffect } from 'react';
import DataNotFound from '../DataNotFound';
import Loading from '../Loading';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, LinearProgress, Button } from '@mui/material';
import './Register.css'
import Navbar from './Navbar';
import bg from '../../assets/_.png'
import confused from '../../assets/Confused Man.gif'
import optionbg from '../../assets/sky blue.png'
// Custom Radio Button Component
// Custom Radio Button Component
const RadioButton = ({ name, value, id, checked, onChange, label }) => {
  return (
    <>
      <div className="radio-option" style={{ display: 'flex', flex: '1 1 45%', marginBottom: '15px' }}>
        <input
          type="radio"
          name={name}
          value={value}
          id={id}
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        <div style={{ position: 'relative' }}>
          <img src={optionbg} alt="" />

          <label
            htmlFor={id}
            // className="cursor-pointer p-4 bg-transparent rounded-lg transition duration-300 shadow-md"
            style={{
              position: 'absolute',
              top: '0px',
              left: '40px'
            }}
          >
            {label}
          </label>
        </div>
      </div>
    </>
  );
};

const QuizGame1 = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(15); // 15 seconds for each question
  const [loading, setLoading] = useState(true);
  const [dataFound, setDataFound] = useState(false);
  const [animationState, setAnimationState] = useState('');
  const [updatedscore, setUpdatedScore] = useState()
  const [quizcomplete, setQuizComplete] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [totalTime, setTotalTime] = useState(0);
  const location = useLocation();
  const username = location.state?.name;
  console.log(username)

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = new FormData();
        formData.append('GID', localStorage.getItem('gid'));
        const response = await fetch('http://192.168.1.27/Vedanta/API/getQnA.php', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        const questions = result.Data;
        console.log(result);
        setQuestions(questions);
        setDataFound(true);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOptionChange = (selectedValue) => {
    if (!selectedValue) {
      // Handle the case where no option is selected, e.g., no points for this question
      console.log("No option selected");
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeRemaining(15);
      return;
    }
    console.log(selectedValue);
    setSelectedOption(selectedValue);
    // Get the current question
    const currentQuestion = questions[currentQuestionIndex];
    // Find the selected option and its associated points
    const selectedOption = currentQuestion.Option.find((option) => option[1] === selectedValue);
    const pointsToAdd = selectedOption ? selectedOption[1] : 0; // Points from the selected option
    // Check if the selected option is valid (you might have a logic for correctness based on selected value)
    if (selectedValue) {
      // Update score for the selected category based on question type
      setScore((prevScore) => {
        const updatedScore = { ...prevScore };
        const type = currentQuestion.Type; // Example: "energy", "food", etc.
        console.log(type)
        // Initialize the type score if not yet
        if (!updatedScore[type]) {
          updatedScore[type] = 0;
        }
        // Add the score for this question's type based on the points associated with the selected option
        updatedScore[type] += pointsToAdd;
        console.log(updatedScore); // Log the updated score for debugging purposes
        setUpdatedScore(updatedScore);
        return updatedScore;
      });
    }
    setAnimationState('fade-out');

    // Go to the next question after a delay
    setTimeout(() => {
      setAnimationState('fade-in');
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null); // Reset the selected option
      } else {
        handleSubmit(); // If it's the last question, submit the score
      }
    }, 500);
  };


  useEffect(() => {
    if (timeRemaining > 0 && !quizcomplete) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 100000);
      return () => clearInterval(timer); // Clean up the timer on component unmount
    } else if (timeRemaining === 0) {
      if (!selectedOption) {
        handleOptionChange(null); // Automatically record as null if no option was selected
      }
    }
  }, [timeRemaining, quizcomplete]);


  const handleSubmit = async () => {
    // Calculate total time taken
    const endTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 1000); // Duration in seconds
    setTotalTime(duration); // Set total time taken

    // alert(`Quiz submitted! Your score is ${finalScore} out of ${questions.length}. Total time: ${duration} seconds.`);
    // setQuizCompleted(true);
    navigate('/Score', {
      state: { score: score, totalTime: duration, totalQuestions: questions.length }
    });
    // try {
    //   setLoading(true);
    //   const formData = new FormData();
    //   formData.append('GID', localStorage.getItem('gid'));
    //   formData.append('contact', localStorage.getItem('contact'));
    //   formData.append('email', localStorage.getItem('email'));
    //   formData.append('score', finalScore);
    //   formData.append('timetaken', duration);

    //   const response = await fetch('https://ca81-115-96-216-155.ngrok-free.app/Vedanta/API/getQnA.php', {
    //     method: 'POST',
    //     body: formData,
    //   });

    //   if (!response.ok) {
    //     throw new Error('Network response was not ok');
    //   }

    //   const result = await response.json();
    //   console.log(result);
    //   if (result.Status == true) {
    //     setLeaderBoardData(result.LeaderBoard);
    //     console.log(result);
    //   } else {
    //     navigate('/');
    //   }
    // } catch (err) {
    //   console.error(err.message);
    // } finally {
    //   setLoading(false);
    // }
  };

  if (loading) return <Loading darkMode={false} />;
  if (!dataFound) return <DataNotFound />;

  // Check if the current question and its options exist
  const currentQuestion = questions[currentQuestionIndex];
  const options = currentQuestion?.Option || [];

  const progress = (timeRemaining / 15) * 100;

  return (
    <div>
      <Navbar />
      <div className="app-container">
        <div className="container-fluid" style={{ marginTop: '80px', marginBottom: '20px' }}>
          <Card sx={{ padding: '30px 10px', boxShadow: '0px 0px 4px', borderRadius: '10px', backgroundColor: 'transparent' }}>
            <div className="row d-flex justify-content-center align-items-center">
              <div className="col-xl-6">
                <div className="card-container p-0 p-lg-5 mb-5">
                  <div className="p-3">
                    <h1 className="text-4xl font-bold mb-4 text-center">Carbon Footprint Quiz</h1>
                    <hr />
                    <div className="userinfo d-flex justify-content-around align-items-center">
                      <div className="img-container" style={{ width: '100%' }}>
                        <img src={confused} alt="Quiz Test" className="w-[180px] md:w-[300px]" />
                      </div>
                      <div style={{ fontSize: '20px', width: '100%' }}>
                        <h3 style={{ fontSize: '30px' }}>Welcome {username}</h3>
                        <div>

                          <h3 style={{
                            marginTop: '20px'
                          }}>Category - {currentQuestion.Type}
                          <p>
                            {
                              currentQuestion.Suggestion[0]
                            }
                            </p>

                            
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-6">
                <div className="progress-container" style={{ marginBottom: '20px' }}>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ width: '400px', maxWidth: '100%', margin: '0px auto', paddingBottom: '10px', borderRadius: '20px' }}
                  />
                </div>
                <div className={`question-container ${animationState}`}>
                  <div
                    className="flex items-center w-full max-w-md justify-between mb-4 mx-auto"
                  >
                    <span className="text-xl flex-1" style={{ fontSize: '25px' }}>Question {currentQuestionIndex + 1}/{questions.length}</span>
                    <h2 className="text-2xl font-semibold flex items-center mr-4">{timeRemaining < 10 ? `0${timeRemaining}` : timeRemaining}</h2>
                  </div>
                  <div className={`form-container ${animationState}`}>
                    <div style={{ position: 'relative', width: '100%' }}>
                      {/* Image */}
                      <img
                        src={bg}
                        alt="Background"
                        style={{
                          width: '100%',
                          height: 'auto',
                          objectFit: 'cover',
                        }}
                      />

                      {/* Question Text */}
                      <p
                        className="text-2xl font-semibold text-center"
                        style={{
                          fontSize: '22px',
                          color: 'black',
                          wordWrap: 'break-word',
                          textAlign: 'center',
                          position: 'absolute',
                          top: '20%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          maxWidth: '90%',
                          padding: '0 10px',
                        }}
                      >
                        <span>{currentQuestionIndex + 1}.</span>
                        {currentQuestion?.Question || 'Loading Question...'}
                      </p>

                      {/* Optional: Horizontal Line */}
                      <hr className="mt-4" />
                    </div>

                    <div>
                    </div>

                    <div className="p-6 mt-5 rounded-lg shadow-lg w-full mx-auto border-1 row" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                      <span className='text-center'><strong>Options</strong></span>
                      {options.length > 0 ? (
                        options.map((option, index) => (
                          <RadioButton
                            key={index}
                            name={`question-${currentQuestionIndex}`}
                            value={option[1]}
                            id={`option-${currentQuestionIndex}-${index}`}
                            checked={selectedOption === option[1]}
                            onChange={() => handleOptionChange(option[1])}
                            label={option[0]}
                          />
                        ))
                      ) : (
                        <p>No options available for this question.</p>
                      )}
                    </div>
                    <div className='text-center'>
                      <Button
                        variant="contained"
                        color="default"
                        onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                        disabled={currentQuestionIndex === 0} // Disable "Prev" button if on first question
                        className='w-40'
                      >
                        Prev
                      </Button>
                      <Button
                        className='w-40'
                        variant="contained"
                        color="default"
                        onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                        disabled={currentQuestionIndex === questions.length - 1} // Disable "Next" button if on last question
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div >
    </div >
  );
};

export default QuizGame1;
