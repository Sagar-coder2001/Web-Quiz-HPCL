import React, { useState, useEffect } from 'react';
import DataNotFound from '../DataNotFound';
import Loading from '../Loading';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, LinearProgress, Button } from '@mui/material';
import './Register.css'
import Navbar from './Navbar';
import bg from '../../assets/_.png'
import confused from '../../assets/Confused Man.gif'
import optiona from '../../assets/a.png'
import TypewriterComponent from 'typewriter-effect';
// Custom Radio Button Component
// Custom Radio Button Component
const RadioButton = ({ name, value, id, checked, onChange, label }) => {

  return (
    <>
      <div className="radio-option"
        style={
          {
            display: 'flex',
            flex: '1 2 45%',
            marginBottom: '15px',
          }
        } onClick={() => onChange({ target: { value } })}>
        <input
          type="radio"
          name={name}
          value={value}
          id={id}
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        <div style={{
          position: 'relative',
          border: '1px solid',
          width: '100%',
          //  height: '200px',
          overflow: 'hidden'
        }} >

          <img src={optiona} alt="" style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }} />

          <p
            htmlFor={id}
            // className="cursor-pointer p-4 bg-transparent rounded-lg transition duration-300 shadow-md"
            style={{
              position: 'absolute',
              top: '5px',
              left: '50px',
              fontWeight: 'bold',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: '15px'
            }}
          >
            {label}
          </p>
        </div>
      </div>
    </>
  );
};

// here i display 4 option and add the background image to the option but in 4 option add same image i want to use different image to 4 option 

const QuizGame1 = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // const [timeRemaining, setTimeRemaining] = useState(15);
  const [loading, setLoading] = useState(true);
  const [dataFound, setDataFound] = useState(false);
  const [animationState, setAnimationState] = useState('');
  const [updatedscore, setUpdatedScore] = useState()
  const [quizcomplete, setQuizComplete] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [totalTime, setTotalTime] = useState(0);
  const [answers, setAnswers] = useState({});



  const location = useLocation();
  const username = location.state?.name;
  const uid = location.state?.uid;

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = new FormData();
        formData.append('GID', localStorage.getItem('gid'));
        const response = await fetch('http://192.168.1.25/Vedanta/API/getQnA.php', {
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
    if (selectedValue === null) {
      console.log("No option selected");
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const selectedOption = currentQuestion.Option.find((option) => option[1] === selectedValue);
    const pointsToAdd = selectedOption ? selectedOption[1] : 0;

    // Store the selected answer for the current question
    setAnswers((prevAnswers) => {
      const newAnswers = { ...prevAnswers, [currentQuestionIndex]: selectedValue };
      return newAnswers;
    });

    // Update score based on current answer (if changed)
    setScore((prevScore) => {
      const updatedScore = { ...prevScore };
      const type = currentQuestion.Type;
      const previousSelectedValue = answers[currentQuestionIndex];

      // Remove the previous points (if any) before adding the new points
      if (previousSelectedValue) {
        const previousSelectedOption = currentQuestion.Option.find((option) => option[1] === previousSelectedValue);
        const previousPoints = previousSelectedOption ? previousSelectedOption[1] : 0;
        updatedScore[type] -= previousPoints;
      }

      // Add the new points for the selected option
      if (!updatedScore[type]) {
        updatedScore[type] = 0;
      }
      updatedScore[type] += pointsToAdd;

      console.log(updatedScore);  // Log the updated score for debugging purposes
      setUpdatedScore(updatedScore);
      return updatedScore;
    });

    // Proceed with the question animation and navigation
    setAnimationState('fade-out');
    setTimeout(() => {
      setAnimationState('fade-in');
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      } else {
        handleSubmit(); // If it's the last question, submit the score
      }
    }, 500);
  };



  // useEffect(() => {
  //   if (timeRemaining > 0 && !quizcomplete) {
  //     const timer = setInterval(() => {
  //       setTimeRemaining((prev) => prev - 1);
  //     }, 100000);
  //     return () => clearInterval(timer); 
  //   } else if (timeRemaining === 0) {
  //     if (!selectedOption) {
  //       handleOptionChange(null);
  //     }
  //   }
  // }, [timeRemaining, quizcomplete]);


  const handleSubmit = async () => {
    // Calculate total time taken
    const endTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 1000); // Duration in seconds
    setTotalTime(duration); // Set total time taken

    // alert(`Quiz submitted! Your score is ${finalScore} out of ${questions.length}. Total time: ${duration} seconds.`);
    // setQuizCompleted(true);
    navigate('/Score', {
      state: {score: score, totalTime: duration, totalQuestions: questions.length }
    });
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append('Energy', score.Energy);
      formData.append('Transport', score.Transport);
      formData.append('Waste', score.Waste);
      formData.append('Food', score.Food);
      formData.append('Lifestyle', score.Lifestyle);
      formData.append('UID', uid);

      const response = await fetch('http://192.168.1.25/Vedanta/API/updateScore.php', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result);
      if (result.Status == true) {
        console.log(result);
      } else {
        // navigate('/');
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading darkMode={false} />;
  if (!dataFound) return <DataNotFound />;

  // Check if the current question and its options exist
  const currentQuestion = questions[currentQuestionIndex];
  const options = currentQuestion?.Option || [];

  const totalQuestion = 15;
  const progress = (currentQuestionIndex / totalQuestion) * 100;

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
                    <h1 className="text-4xl font-bold mb-4 text-center" style={{ textShadow: '2px 2px 2px white' }}>Carbon Footprint Quiz</h1>
                    <hr />
                    <div className="userinfo d-flex justify-content-around align-items-center">
                      <div className="img-container" style={{ width: '100%' }}>
                        <img src={confused} alt="Quiz Test" className="w-[180px] md:w-[300px]" />
                      </div>
                      <div style={{ width: '100%', }}>
                        <h4 style={{ fontSize: '25px', fontWeight: 'bold' }}>

                          <TypewriterComponent
                            options={{
                              strings: [`Welcome ${username}`],
                              autoStart: true,
                              loop: true,
                              delay: 50,
                            }}
                          />

                        </h4>
                        <div>
                          <h3 style={{
                            marginTop: '20px',
                            fontSize: '20px',
                            fontWeight: 'bold',
                          }}>Category - {currentQuestion.Type}
                          </h3>
                          <p style={{ marginTop: '20px', }}>
                            {
                              currentQuestion.Suggestion[0]
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-6">
                <div className="progress-container" style={{ marginBottom: '20px', position:'relative' }}>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      width: '400px',
                      maxWidth: '100%',
                      margin: '0px auto',
                      paddingBottom: '10px',
                      borderRadius: '30px',
                      height: '50px',
                    }}
                  />
                  <h2 style={{
                    position:'absolute',
                    top:'50%',
                    left:'50%',
                    transform:'translate(-50%,-50%)'
                  }}> <strong> {progress.toFixed(2)} {progress < 100 ? 'Keep It Up' : ''}</strong></h2>
                  
                </div>
                <div className={`question-container`}>
                  <div
                    className="flex items-center w-full max-w-md justify-between mb-4 mx-auto"
                  >
                    <span className="text-center flex-1" style={{ fontSize: '25px' }}>Question {currentQuestionIndex + 1}/{questions.length}</span>
                    {/* <h2 className="text-2xl font-semibold flex items-center mr-4">{timeRemaining < 10 ? `0${timeRemaining}` : timeRemaining}</h2> */}
                  </div>
                  <div className={`form-container`}>
                    <div style={{ position: 'relative', width: '100%' }}>
                      {/* Image */}
                      <img
                        src={bg}
                        alt="Background"
                        style={{
                          width: '80%',
                          height: 'auto',
                          objectFit: 'cover',
                          margin: '0px auto',
                          backgroundColor: '#71b32f',
                          borderRadius: '6px'
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
                          top: '10%',
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

                    <div className={`p-6 mt-5 rounded-lg shadow-lg w-full mx-auto border-1 row animate ${animationState}`} style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                      <span className='text-center' style={{ fontSize: '30px' }}><strong>Options</strong></span>
                      <hr />
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
                        onClick={() => {
                          // Update the selected option when navigating back
                          const previousAnswer = answers[currentQuestionIndex - 1];
                          setSelectedOption(previousAnswer);
                          setCurrentQuestionIndex(currentQuestionIndex - 1);
                        }}
                        disabled={currentQuestionIndex === 0} // Disable "Prev" button if on the first question
                        className='w-40'
                        style={{ marginRight: '20px' }}
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