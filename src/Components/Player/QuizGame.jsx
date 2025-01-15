import React, { useState, useEffect } from 'react';
import DataNotFound from '../DataNotFound';
import Loading from '../Loading';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Card, LinearProgress } from '@mui/material';
import './Register.css'
import Navbar from './Navbar';


// Custom Radio Button Component
const RadioButton = ({ name, value, id, checked, onChange, label, isSelected, isCorrect, isWrong }) => {

  const getBackgroundColor = () => {
    if (isSelected && isWrong) {
      return 'bg-red-500 text-white'; // Wrong answer
    }
    if (isCorrect) {
      return 'bg-green-500 text-white'; // Correct answer
    }
    return 'bg-gray-300 text-gray-800'; // Default
  };

  return (
    <div className="flex items-center mb-4">
      <input
        type="radio"
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

  const [LeaderBoardData, setLeaderBoardData] = useState([]);

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
  const [categrotyName, setCategrotyName] = useState('');
  const [animationState, setAnimationState] = useState('');



  const handleOptionChange = (option) => {
    if (!optionSelected) {
      const updatedAnswers = [...userAnswers];
      updatedAnswers[currentQuestionIndex] = option; // Update the answer

      // Check if the selected option is correct
      if (option === questions[currentQuestionIndex].answer) {
        setScore(prevScore => prevScore + 1); // Increment score if correct
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
      }, 1500); // Delay for showing answer feedback
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = new FormData();
        formData.append('GID', localStorage.getItem('gid'));
        const response = await fetch('http://192.168.1.50/WebQuiz/play.php?do=get', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result);

        if (result.Status == true) {
          setQuestion(result.Questions);
          setDatafound(true);
          setCategrotyName(result.Category)
        } else {
          setDatafound(false)
        }
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

      const response = await fetch('http://localhost/WebQuiz/play.php?do=updateScore', {
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

  useEffect(() => {
    if (timeRemaining > 0 && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer); // Clean up the timer on component unmount
    } else if (timeRemaining === 0) {
      // If time runs out, submit the current answer as empty
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
        <div className="container-sm">
          <Card sx={{ padding: '30px 15px', backgroundColor: '#3E5879', color: 'dark'}}>
            <div className="row d-flex justify-content-center align-items-center">
              <div className="p-8 flex-grow">
                <h1 className="text-4xl font-bold mb-4 text-white text-center">Quiz Game</h1>
                <div className="progress-container">
                    <LinearProgress
                    variant="determinate"
                    value={progress} // Set the progress to the calculated percentage
                    sx={{ width: '400px', maxWidth: '100%', margin: '0px auto', paddingBottom:'20px', borderRadius:'5px' }}
                  />
                </div>
                {quizCompleted ? (
                  <div className="p-6 rounded-lg shadow-lg w-full max-w-md bg-gray-100 text-center mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">Quiz Results</h2>
                    <p className="text-lg mb-4">
                      You scored <strong>{score}</strong> out of {questions.length}.<br />
                      Total time taken: <strong>{totalTime} seconds</strong>
                    </p>
                    <p className="mb-4">Thank you for playing!</p>
                  </div>
                ) : (
                  <>
                  <div className={`question-container ${animationState}`}>
                    <div className="flex items-center w-full max-w-md justify-between mb-4 mx-auto">
                      <span className="text-xl flex-1 text-white">Question {currentQuestionIndex + 1}/{questions.length}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      <h2 className="text-2xl font-semibold flex items-center mr-4 text-white">{timeRemaining}</h2>
                    </div>
                    <Card sx={{ backgroundColor: '#3E5879', color: 'dark', width:'500px', maxWidth:'100%', margin:'0px auto', padding:'30px', boxShadow:'0px 0px 4px' }}>
                      <div>
                        <p className="text-2xl font-semibold text-center">{questions[currentQuestionIndex].question}</p>
                      </div>
                      <div className="p-6 mt-5 rounded-lg shadow-lg w-full max-w-md mx-auto">
                        <div className="mb-4">
                        {questions[currentQuestionIndex].options.map((option, index) => {
                          const isCorrect = option === questions[currentQuestionIndex].answer;
                          const isWrong = option === selectedOption && !isCorrect;
                            return (
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
                            );
                          })}
                        </div>
                      </div>
                    </Card>
                    </div>
                  </>
                )}

                {quizCompleted && (
                  <div className="p-6 mt-6 rounded-lg shadow-lg w-full max-w-md bg-white text-center mx-auto">
                    <h3 className="text-xl font-semibold mb-4">Leaderboard</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                          <tr>
                            <th className="border border-gray-300 px-4 py-2">Rank</th>
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2">Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {LeaderBoardData.map((player, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                              <td className="border border-gray-300 px-4 py-2 text-center">{player.name}</td>
                              <td className="border border-gray-300 px-4 py-2 text-center">{player.score}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuizGame;
