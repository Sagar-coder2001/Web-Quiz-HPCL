import React, { useState, useEffect } from 'react';
import DataNotFound from '../DataNotFound';
import Loading from '../Loading';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Card, LinearProgress, Button } from '@mui/material';
import './Register.css'
import Navbar from './Navbar';
import bg from '../../assets/01.gif'
import confused from '../../assets/confused.gif'


// Custom Radio Button Component
const RadioButton = ({ name, value, id, checked, onChange, label, isSelected, isCorrect, isWrong }) => {
  const getBackgroundColor = () => {
    if (isSelected && isWrong) {
      return 'bg-red-500'; // Wrong answer
    }
    if (isCorrect) {
      return 'bg-green-500'; // Correct answer
    }
    return 'shadow m-2'; // Default
  };

  return (
    <div className="flex items-center mb-4">
      <input
        type="checkbox"
        name={name}
        value={value}
        id={id}
        className="sr-only" // Hide the radio button
        checked={checked}
        onChange={onChange}
      />
      <label
        htmlFor={id}
        className={`flex items-center cursor-pointer w-full px-4 py-2 rounded-lg transition duration-300 ${getBackgroundColor()}`}
      >
        {label}
      </label>
    </div>
  );
};

// Main Quiz Game Component
const QuizGame = () => {

  const navigate = useNavigate();

  const [questions, setQuestion] = useState([]);

  // const [LeaderBoardData, setLeaderBoardData] = useState([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(null));
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [optionSelected, setOptionSelected] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(15); // 15 seconds for each question
  const [startTime, setStartTime] = useState(Date.now()); // Capture the start time
  const [totalTime, setTotalTime] = useState(0); // State for total time
  const [loading, setLoading] = useState(true);
  const [datafound, setDatafound] = useState(false);
  const [Typename, setTypeName] = useState('');
  const [animationState, setAnimationState] = useState('');


  const location = useLocation();
  const username = location.state?.firstname;

  const handleOptionChange = (option) => {
    if (!optionSelected) {
      const updatedAnswers = [...userAnswers];
      updatedAnswers[currentQuestionIndex] = option; 

      if (option === questions[currentQuestionIndex].answer) {
        setScore(prevScore => prevScore + 1); 
      }

      setSelectedOption(option);
      setUserAnswers(updatedAnswers);
      setOptionSelected(true);
      setShowAnswer(true);

      // Delay before moving to the next question
      setAnimationState('slide-out');

      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedOption(null);
          setOptionSelected(false);
          setShowAnswer(false);
          setTimeRemaining(15); // Reset timer for the next question
          setAnimationState('slide-in');
        } else {
          handleSubmit(updatedAnswers); // Submit when it's the last question
        }
      }, 1000); // Delay for showing answer feedback
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = new FormData();
        formData.append('GID', localStorage.getItem('gid'));
        const response = await fetch('https://ca81-115-96-216-155.ngrok-free.app/Vedanta/API/getQnA.php', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        
        //   result.map((item) => {
        //     console.log(item)
        //  })

        console.log(result.Data[0].Question)

        const questions = result.Data;

        const mappedQuestions = questions.map((question, index) => ({
          id: index,
          questionText: question.Question,
          options: question.Option, 
          type: question.Type, 
          answer: question.answer || null,
        }));
  
        console.log(mappedQuestions); // Log the transformed questions array

        mappedQuestions.forEach((question, index) => {
          console.log(`Question ${index + 1}: ${question.questionText}`);
        });
        
        // if (result.Status == true) {
          setQuestion(mappedQuestions);
          setDatafound(true);
          setTypeName();
        // } else {
        //   setDatafound(false)
        // }
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (updatedAnswers) => {
    const finalScore = updatedAnswers.reduce((acc, answer, index) => {
      return answer === questions[index].answer ? acc + 1 : acc;
    }, 0);

    setScore(finalScore); // Store the final score in state

    // Calculate total time taken
    const endTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 1000); // Duration in seconds
    setTotalTime(duration); // Set total time taken

    // alert(`Quiz submitted! Your score is ${finalScore} out of ${questions.length}. Total time: ${duration} seconds.`);
    // setQuizCompleted(true);
    navigate('/Score', {
      state: { score: finalScore, totalTime: duration, totalQuestions: questions.length }
    });
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('GID', localStorage.getItem('gid'));
      formData.append('contact', localStorage.getItem('contact'));
      formData.append('email', localStorage.getItem('email'));
      formData.append('score', finalScore);
      formData.append('timetaken', duration);

      const response = await fetch('https://ca81-115-96-216-155.ngrok-free.app/Vedanta/API/getQnA.php', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result);
      if (result.Status == true) {
        setLeaderBoardData(result.LeaderBoard);
        console.log(result);
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(userAnswers[currentQuestionIndex - 1]);
      setOptionSelected(false);
      setShowAnswer(false);
      setTimeRemaining(15);
    }
  };
  const nextquestion = () => {
    console.log('Clicked');
    if (currentQuestionIndex < questions.length - 1) {
      const updatedIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(updatedIndex);
      setSelectedOption(userAnswers[updatedIndex]);
      setOptionSelected(true); 
      setShowAnswer(false); 
      setTimeRemaining(15); 
    }
  };
  
  useEffect(() => {
    if (timeRemaining > 0 && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 100000);
      return () => clearInterval(timer); // Clean up the timer on component unmount
    } else if (timeRemaining === 0) {
      if (!optionSelected) {
        handleOptionChange(null); // Automatically record as null if no option was selected
      }
    }
  }, [timeRemaining, quizCompleted]);

  if (loading) return <Loading darkMode={false} />; // Adjust based on your darkMode logic

  if (!datafound) {
    return <div className='h-screen bg-gray-300'><DataNotFound /></div>
  }

  const progress = (timeRemaining / 15) * 100;

  return (
    <div>
      <Navbar />
      <div className="app-container">
        <div className="container-fluid">
          <Card sx={{ padding: '30px 10px', boxShadow: '0px 0px 4px', borderRadius: '10px' }}>
            <div className="row d-flex justify-content-center align-items-center">
              <div className="col-lg-6">
                <div className="card-container p-0 p-lg-5 mb-5">
                  <div className="p-3">
                    <h1 className="text-4xl font-bold mb-4 text-center">Quiz Game</h1>
                    <hr />
                    <div className="userinfo mt-2">
                      <h3 className='mb-3 text-center' style={{ fontSize: '20px' }}>Welcome - {username} Let's Start The Quiz</h3>
                      <div className="img-container" style={{ width: '100%' }}>
                        <img src={confused} alt="Quiz Test" className="w-[180px] md:w-[300px]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="progress-container" style={{ marginBottom: '20px' }}>
                  <LinearProgress
                    variant="determinate"
                    value={progress} // Set the progress to the calculated percentage
                    sx={{ width: '400px', maxWidth: '100%', margin: '0px auto', paddingBottom: '10px', borderRadius: '20px' }}
                  />
                </div>
                <div className={`question-container ${animationState}`}>
                  <div className="flex items-center w-full max-w-md justify-between mb-4 mx-auto">
                    <span className="text-xl flex-1" style={{ fontSize: '25px' }}>Question {currentQuestionIndex + 1}/{questions.length}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <h2 className="text-2xl font-semibold flex items-center mr-4">{timeRemaining}</h2>
                  </div>
                  <div className="form-container">
                    <div>
                      <p className="text-2xl font-semibold text-center" style={{ fontSize: '22px' }}> <span className='text-white'>{currentQuestionIndex + 1}.</span>{questions[currentQuestionIndex].options.map((option, index) => {option.questionText})}</p>
                      <hr className='mt-4' />
                    </div>
                    <div className="p-6 mt-5 rounded-lg shadow-lg w-full mx-auto">
                      <div className="mb-4">
                        {questions[currentQuestionIndex].options.map((option, index) => {
                          const isCorrect = option === questions[currentQuestionIndex].answer;
                          const isWrong = option === selectedOption && !isCorrect;
                          return (
                            <>
                              <div>
                                <RadioButton
                                  key={index}
                                  name={`question-${currentQuestionIndex}`}
                                  value={option}
                                  id={`option-${currentQuestionIndex}-${index}`}
                                  checked={selectedOption === option}
                                  onChange={() => handleOptionChange(option)}
                                  label={option}
                                  isSelected={selectedOption === option}
                                  isCorrect={isCorrect && showAnswer}
                                  isWrong={isWrong}
                                />
                              </div>
                            </>
                          );
                        })}
                        <Button variant="contained" color="default" onClick={previousQuestion}>
                          Prev
                        </Button>

                        <Button variant="contained" color="default" onClick={nextquestion}>
                          Next
                        </Button>
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

export default QuizGame;
