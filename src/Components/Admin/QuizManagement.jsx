import React, { useState, useEffect } from 'react';
import Loading from '../Loading';
import DataNotFound from '../DataNotFound';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Role = ({ darkMode }) => {
  const navigate = useNavigate();


  const [quizData, setQuizData] = useState([]);

  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [modalCategory, setModalCategory] = useState('');
  const [edit, setEdit] = useState(false);
  const [questionID, setQuestionID] = useState('');
  const [loading, setLoading] = useState(true);
  const [dataFound, setDataFound] = useState(false);
  const [alertType, setAlertType] = useState('success'); // Fixed typo: 'sucess' to 'success'
  const [alertMessage, setAlertMessage] = useState('');


  // Error state
  const [errors, setErrors] = useState({
    question: false,
    category: false,
    options: [false, false, false, false],
    correctAnswer: false,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = quizData.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(quizData.length / questionsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = new FormData();
        formData.append('username', localStorage.getItem('username'));
        formData.append('token', localStorage.getItem('token'));

        const response = await fetch('http://localhost/WebQuiz/Admin/quizManage.php?do=get', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();

        if (result.Category.Status == true) {
          setSelectedCategory(result.Category.Data[0].id)
          setCategories(result.Category.Data)
        } else if (result.Authentication == false) {
          navigate('/Login');
        }
        if (result.QNA.Status == true) {
          setQuizData(result.QNA.Data);
          setDataFound(true);
        }
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleCategoryChange = async (e) => {
    setSelectedCategory(e.target.value);
    try {
      setLoading(true);
      setDataFound(false);
      const formData = new FormData();
      formData.append('username', localStorage.getItem('username'));
      formData.append('token', localStorage.getItem('token'));
      formData.append('categoryid', e.target.value);


      const response = await fetch('http://localhost/WebQuiz/Admin/quizManage.php?do=get', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      if (result.QNA.Status == true) {
        setCategories(result.Category.Data)
      } else if (result.Authentication == false) {
        navigate('/Login');
      }
      if (result.QNA.Status == true) {
        setQuizData(result.QNA.Data);
        setDataFound(true);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleAddQuestion = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    // Validation: Check if all fields are filled
    const newErrors = {
      question: !newQuestion,
      category: !modalCategory,
      options: options.map(option => option.trim() === ''),
      correctAnswer: !correctAnswer,
    };

    setErrors(newErrors);

    // If there are any errors, don't proceed
    if (newErrors.question || newErrors.category || newErrors.correctAnswer || newErrors.options.some(Boolean)) {
      return;
    }

    // Log the data in the desired format
    // console.log('New Question:', newQuestion);
    // console.log('Options:', options); // Log options as an array
    // console.log('Correct Answer:', correctAnswer);
    // console.log('Category:', modalCategory);

    try {
      setLoading(true);
      setDataFound(false);
      const formData = new FormData();
      formData.append('username', localStorage.getItem('username'));
      formData.append('token', localStorage.getItem('token'));
      formData.append('categoryid', modalCategory);
      formData.append('question', newQuestion);
      formData.append('option1', options[0]);
      formData.append('option2', options[1]);
      formData.append('option3', options[2]);
      formData.append('option4', options[3]);
      formData.append('correctOption', correctAnswer);



      const response = await fetch('http://localhost/WebQuiz/Admin/quizManage.php?do=add', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      if (result.Status == true) {
        setAlertMessage(result.Message);
        setAlertType('success');
      }
      else if (result.Authentication == false) {
        navigate('/Login');
      } else {
        setAlertMessage(result.Message);
        setAlertType('danger');
      }

      if (result.QNA.Status == true) {
        setSelectedCategory(result.Category.Data[0].id)
        setCategories(result.Category.Data)
      }
      if (result.QNA.Status == true) {
        setQuizData(result.QNA.Data);
        setDataFound(true);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }

    // Close modal and reset fields
    setIsModalOpen(false);
    setNewQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswer('');
    setModalCategory('');
    setErrors({ question: false, category: false, options: [false, false, false, false], correctAnswer: false });
  };


  const handleCancel = () => {
    setNewQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswer('')
    setIsModalOpen(false);
    setEdit(false);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleDelete = async (id) => {
    console.log('Question ID:', id);
    const confirmed = window.confirm("Are you sure to delete this.");
    if (confirmed) {
      try {
        setLoading(true);
        setDataFound(false);
        const formData = new FormData();
        formData.append('username', localStorage.getItem('username'));
        formData.append('token', localStorage.getItem('token'));
        formData.append('questionid', id);

        const response = await fetch('http://localhost/WebQuiz/Admin/quizManage.php?do=remove', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();

        if (result.Status == true) {
          setAlertMessage(result.Message);
          setAlertType('success');
        }
        else if (result.Authentication == false) {
          navigate('/Login');
        } else {
          setAlertMessage(result.Message);
          setAlertType('danger');
        }

        if (result.Category.Status == true) {
          setSelectedCategory(result.Category.Data[0].id)
          setCategories(result.Category.Data)
        }
        if (result.QNA.Status == true) {
          setQuizData(result.QNA.Data);
          setDataFound(true);
        }
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setAlertType('danger');
      setAlertMessage('Failed to delete category.');
    }
  };

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('username', localStorage.getItem('username'));
      formData.append('token', localStorage.getItem('token'));
      formData.append('questionid', id);

      const response = await fetch('http://localhost/WebQuiz/Admin/quizManage.php?do=fetchwithop', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      if (result.Status == true) {

        setQuestionID(result.QuestionID);
        setNewQuestion(result.Question);
        setOptions([result.Option1, result.Option2, result.Option3, result.Option4]);
        setCorrectAnswer(result.Correct_Option);

        setIsModalOpen(true);
        setEdit(true);

      }
      else if (result.Authentication == false) {
        navigate('/Login');
      } else {
        setAlertMessage(result.Message);
        setAlertType('danger');
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleUpdate = async () => {
    // Validation: Check if all fields are filled
    const newErrors = {
      question: !newQuestion,
      category: !modalCategory,
      options: options.map(option => option.trim() === ''),
      correctAnswer: !correctAnswer,
    };

    setErrors(newErrors);

    // If there are any errors, don't proceed
    if (newErrors.question || newErrors.correctAnswer || newErrors.options.some(Boolean)) {
      return;
    }

    // Log the data in the desired format
    // console.log('New Question:', newQuestion);
    // console.log('Options:', options); // Log options as an array
    // console.log('Correct Answer:', correctAnswer);
    // console.log('Category:', modalCategory);

    try {
      setLoading(true);
      setDataFound(false);
      const formData = new FormData();
      formData.append('username', localStorage.getItem('username'));
      formData.append('token', localStorage.getItem('token'));
      formData.append('questionid', questionID);
      formData.append('option1', options[0]);
      formData.append('option2', options[1]);
      formData.append('option3', options[2]);
      formData.append('option4', options[3]);
      formData.append('correctOption', correctAnswer);



      const response = await fetch('http://localhost/WebQuiz/Admin/quizManage.php?do=edit', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      if (result.Status == true) {
        setAlertMessage(result.Message);
        setAlertType('success');
      }
      else if (result.Authentication == false) {
        navigate('/Login');
      } else {
        setAlertMessage(result.Message);
        setAlertType('danger');
      }

      if (result.Category.Status == true) {
        setSelectedCategory(result.Category.Data[0].id)
        setCategories(result.Category.Data)
      }
      if (result.QNA.Status == true) {
        setQuizData(result.QNA.Data);
        setDataFound(true);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }

    // Close modal and reset fields
    setIsModalOpen(false);
    setNewQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswer('');
    setModalCategory('');
    setErrors({ question: false, category: false, options: [false, false, false, false], correctAnswer: false });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <Loading darkMode={darkMode} />;
  }

  return (
    <div className={`p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-300 text-black'} min-h-screen`}>
      {alertMessage && (
        <div className={`rounded-xl border ${alertType === 'success' ? (darkMode ? 'border-green-600 bg-gray-900 text-white' : 'border-green-600 bg-gray-300 text-black') : alertType === 'danger' ? (darkMode ? 'border-red-600 bg-gray-900 text-white' : 'border-red-600 bg-gray-300 text-black') : (darkMode ? 'border-yellow-600 bg-gray-900 text-white' : 'border-yellow-100 bg-white text-black')} p-4 relative`}>
          <span className={`absolute top-2 right-2 cursor-pointer ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`} onClick={() => setAlertMessage('')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
          <div className="flex items-start gap-4 pl-8">
            <span className={alertType === 'success' ? (darkMode ? 'text-green-400' : 'text-green-600') : alertType === 'danger' ? (darkMode ? 'text-red-400' : 'text-red-600') : (darkMode ? 'text-yellow-400' : 'text-yellow-600')}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                {alertType === 'success' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : alertType === 'danger' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v3.75M12 16.5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v9m0 3v-3" />
                )}
              </svg>
            </span>
            <div className="flex-1">
              <strong className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {alertType === 'success' ? 'Success!' : alertType === 'danger' ? 'Alert!' : 'Warning!'}
              </strong>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{alertMessage}</p>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6 text-center">Quiz Management</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 mr-4">
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Select Question Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className={`p-2 border ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'} rounded-md focus:ring focus:ring-blue-500 w-1/3 transition duration-200 ease-in-out`}
          >
            <option value="">--Select Category--</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAddQuestion}
          className={`px-4 py-2 ${darkMode ? 'bg-green-600 hover:bg-green-500' : 'bg-green-600 hover:bg-blue-600'} text-white rounded transition duration-200 ease-in-out focus:outline-none focus:ring focus:ring-blue-300`}
        >
          Add Question
        </button>
      </div>

      {/* Quiz Table */}
      {dataFound ? (<>
        <table className={`min-w-full rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} border border-gray-300`}>
          <thead>
            <tr className={`text-sm leading-normal ${darkMode ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'}`}>
              <th className="py-3 px-6 text-left">Question ID</th>
              <th className="py-3 px-6 text-left" style={{ width: '300px' }}>Question</th>
              <th className="py-3 px-6 text-left">Answer</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {currentQuestions.map((quiz) => (
              <tr key={quiz.id} className={`border-b border-gray-200 hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''} transition duration-200 ease-in-out`}>
                <td className="py-3 text-center px-6">{quiz.id}</td>
                <td className="py-3 px-6 text-left" style={{ width: '300px' }}>{quiz.question}</td>
                <td className="py-3 px-6 text-left">{quiz.answer}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleEdit(quiz.id)}
                    className={`px-4 ms-2 py-1 ${darkMode ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-yellow-600 hover:bg-yellow-700'} text-white rounded transition duration-200`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    className={`px-4 ms-2 py-1 ${darkMode ? 'bg-red-500 hover:bg-red-400' : 'bg-red-600 hover:bg-red-700'} text-white rounded transition duration-200`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 mx-1 ${currentPage === index + 1 ? (darkMode ? 'bg-blue-600' : 'bg-blue-500') : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')} text-white rounded transition duration-200`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </>) : (<DataNotFound darkMode={darkMode} />)}

      {/* Modal for Adding Question */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`p-6 rounded-lg shadow-lg w-1/2 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <h2 className="text-xl font-bold mb-4">{edit ? 'Edit Question' : 'Add New Question'}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Question</label>
              {edit ? (<input
                readOnly
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className={`p-2 border ${errors.question ? (darkMode ? 'border-red-500 bg-gray-800' : 'border-red-500 bg-white') : (darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300')} rounded-md w-full`}
                required
              />) : (<input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className={`p-2 border ${errors.question ? (darkMode ? 'border-red-500 bg-gray-800' : 'border-red-500 bg-white') : (darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300')} rounded-md w-full`}
                required
              />)}

            </div>

            {/* Category Selection in Modal */}
            {edit ? (<></>) : (<div className="mb-4">
              <label className="block text-sm font-medium mb-1">Select Category</label>
              <select
                value={modalCategory}
                onChange={(e) => setModalCategory(e.target.value)}
                className={`p-2 border ${errors.category ? (darkMode ? 'border-red-500 bg-gray-800' : 'border-red-500 bg-white') : (darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300')} rounded-md w-full`}
                required
              >
                <option value="">--Select Category--</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>)}


            <div className="grid grid-cols-2 gap-4 mb-4">
              {options.map((option, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium mb-1">Option {index + 1}</label>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className={`p-2 border ${(errors.options[index]) ? (darkMode ? 'border-red-500 bg-gray-800' : 'border-red-500 bg-white') : (darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300')} rounded-md w-full`}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between mb-4">
              <div className="flex-1 mr-2">
                <label className="block text-sm font-medium mb-1">Correct Answer</label>
                <select
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className={`p-2 border ${errors.correctAnswer ? (darkMode ? 'border-red-500 bg-gray-800' : 'border-red-500 bg-white') : (darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300')} rounded-md w-full`}
                  required
                >
                  <option value="">--Select Correct Answer--</option>
                  {options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="flex">
                <button
                  onClick={handleCancel}
                  className={`mr-2 px-4 mt-6 py-2 ${darkMode ? 'bg-red-500 hover:bg-red-400' : 'bg-red-600 hover:bg-red-700'} text-white rounded transition duration-200`}
                >
                  Cancel
                </button>
                {edit ? (<button
                  onClick={handleUpdate}
                  className={`px-4 py-2 mt-6 ${darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded transition duration-200`}
                >
                  Update
                </button>) : (<button
                  onClick={handleSubmit}
                  className={`px-4 py-2 mt-6 ${darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded transition duration-200`}
                >
                  Submit
                </button>)}

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Role;
