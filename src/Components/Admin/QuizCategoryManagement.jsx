import React, { useState, useEffect } from 'react';
import Loading from '../Loading';
import DataNotFound from '../DataNotFound';
import { useNavigate } from 'react-router-dom'; // Import useNavigate


const QuizCategoryManagement = ({ darkMode }) => {
  const navigate = useNavigate();


  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [dataFound, setDataFound] = useState(false);
  const [alertType, setAlertType] = useState('success'); // Fixed typo: 'sucess' to 'success'
  const [alertMessage, setAlertMessage] = useState('');




  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 10;

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = new FormData();
        formData.append('username', localStorage.getItem('username'));
        formData.append('token', localStorage.getItem('token'));

        const response = await fetch('http://localhost/WebQuiz/Admin/quizCategory.php?do=get', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();

        if (result.Status == true) {
          setCategories(result.Data);
          setDataFound(true);
        } else if (result.Authentication == false) {
          navigate('/Login');
        }
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleSubmit = async () => {
    if (editCategoryId && editCategoryName) {
      // Update existing category
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('username', localStorage.getItem('username'));
        formData.append('token', localStorage.getItem('token'));
        formData.append('categoryNewName', editCategoryName);
        formData.append('categoryID', editCategoryId);

        const response = await fetch('http://localhost/WebQuiz/Admin/quizCategory.php?do=edit', {
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
        } else if (result.Authentication == false) {
          navigate('/Login');
        } else {
          setAlertMessage(result.Message);
          setAlertType('danger');
        }

        if (result.Data.Status == true) {
          setCategories(result.Data.Data);
          setDataFound(true);
        } else {
          setDataFound(false);
        }

        // console.log(result);
      } catch (err) {
        console.error(err.message);
        setAlertType('danger');
        setAlertMessage('Failed to update category.');
      } finally {
        setLoading(false);
      }
    } else if (newCategory) {
      // Add new category
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('username', localStorage.getItem('username'));
        formData.append('token', localStorage.getItem('token'));
        formData.append('categoryName', newCategory);

        const response = await fetch('http://localhost/WebQuiz/Admin/quizCategory.php?do=add', {
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
        } else if (result.Authentication == false) {
          navigate('/Login');
        } else {
          setAlertMessage(result.Message);
          setAlertType('danger');
        }

        if (result.Data.Status == true) {
          setCategories(result.Data.Data);
          setDataFound(true);
        } else {
          setDataFound(false);
        }

        // console.log(result);
      } catch (err) {
        console.error(err.message);
        setAlertType('danger');
        setAlertMessage('Failed to Add category.');
      } finally {
        setLoading(false);
      }
    }

    setIsModalOpen(false);
    setNewCategory('');
    setEditCategoryName('');
  };

  const handleAddCategory = () => {
    setIsModalOpen(true);
    setEditCategoryId(null);
  };

  const handleEdit = (id) => {
    const category = categories.find(cat => cat.id === id);
    if (category) {
      setEditCategoryId(id);
      setEditCategoryName(category.name);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id) => {
    console.log('Deleting Category ID:', id);
    const confirmed = window.confirm("This will delete all the question of this category. Its ok to you?");
    if (confirmed) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('username', localStorage.getItem('username'));
        formData.append('token', localStorage.getItem('token'));
        formData.append('categoryID', id);

        const response = await fetch('http://localhost/WebQuiz/Admin/quizCategory.php?do=remove', {
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
        } else if (result.Authentication == false) {
          navigate('/Login');
        } else {
          setAlertMessage(result.Message);
          setAlertType('danger');
        }

        if (result.Data.Status == true) {
          setCategories(result.Data.Data);
          setDataFound(true);
        } else {
          setDataFound(false);
        }

        // console.log(result);
      } catch (err) {
        console.error(err.message);
        setAlertType('danger');
        setAlertMessage('Failed to delete category.');
      } finally {
        setLoading(false);
      }
    }else{
      setAlertType('danger');
      setAlertMessage('Failed to delete category.');
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setNewCategory('');
    setEditCategoryName('');
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



      <h1 className="text-3xl font-bold mb-6 text-center">Quiz Category Management</h1>

      <div className="flex justify-between mb-6">
        <button
          onClick={handleAddCategory}
          className={`px-4 py-2 ${darkMode ? 'bg-green-600 hover:bg-green-500' : 'bg-green-600 hover:bg-blue-600'} text-white rounded-lg transition duration-300 shadow-md hover:shadow-lg focus:outline-none`}
        >
          Add Category
        </button>
      </div>

      {/* Categories Table */}
      {dataFound ? (
        <table className={`min-w-full rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} border border-gray-300`}>
          <thead>
            <tr className={`text-sm leading-normal ${darkMode ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'}`}>
              <th className="py-3 px-6 text-left">Category ID</th>
              <th className="py-3 px-6 text-left">Category Name</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {currentCategories.map((category) => (
              <tr key={category.id} className={`border-b border-gray-200 transition duration-300 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                <td className="py-3 text-left px-6">{category.id}</td>
                <td className="py-3 px-6 text-left">{category.name}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleEdit(category.id)}
                    className={`px-4 me-4 py-1 ${darkMode ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-yellow-600 hover:bg-yellow-700'} text-white rounded transition duration-300 shadow-md hover:shadow-lg focus:outline-none`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className={`px-4 py-1 ${darkMode ? 'bg-red-500 hover:bg-red-400' : 'bg-red-600 hover:bg-red-700'} text-white rounded transition duration-300 shadow-md hover:shadow-lg focus:outline-none`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <DataNotFound darkMode={darkMode}/>
      )}

      {/* Pagination Controls */}
      {dataFound && (
        <div className="flex justify-center mt-6">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 mx-1 ${currentPage === index + 1 ? (darkMode ? 'bg-blue-600' : 'bg-blue-500') : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')} text-white rounded-lg transition duration-200`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal for Adding/Editing Category */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
          <div className={`p-6 rounded-lg shadow-lg w-1/3 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <h2 className="text-xl font-bold mb-4">{editCategoryId ? 'Edit Category' : 'Add New Category'}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Category Name</label>
              <input
                type="text"
                value={editCategoryId ? editCategoryName : newCategory}
                onChange={(e) => editCategoryId ? setEditCategoryName(e.target.value) : setNewCategory(e.target.value)}
                className={`p-2 border ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'} rounded-md w-full`}
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleCancel}
                className={`mr-2 px-4 py-2 ${darkMode ? 'bg-red-500 hover:bg-red-400' : 'bg-red-600 hover:bg-red-700'} text-white rounded-lg transition duration-300 shadow-md hover:shadow-lg focus:outline-none`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`px-4 py-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition duration-300 shadow-md hover:shadow-lg focus:outline-none`}
              >
                {editCategoryId ? 'Update' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizCategoryManagement;
