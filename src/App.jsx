
import { HashRouter, Routes, Route, BrowserRouter } from 'react-router-dom'; // Ensure you're importing from 'react-router-dom'
import Home from './Components/Admin/Home.jsx'; // Ensure the casing matches your file structure
import NotFound from './Components/NotFound.jsx';
import Login from './Components/Login.jsx';
import './App.css';
import UnderConstruction from './Components/UnderConstruction.jsx';
import RegisterPage from './Components/Player/RegisterPage.jsx';
// import QuizGame from './Components/Player/QuizGame.jsx';
// import Startpage from './Components/Player/Startpage.jsx';
import Score from './Components/Player/Score.jsx';
import QuizGame1 from './Components/Player/QuizGame1.jsx';
import ShowQrcode from './Components/Player/ShowQrcode.jsx';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<RegisterPage />} />
        <Route path="/play" element={<QuizGame1 />} />
        {/* <Route path="/Startpage" element={<Startpage />} /> */}
        <Route path="/ShowQrcode" element={<ShowQrcode />} />
        <Route path="/Score" element={<Score />} />

      </Routes>
    </HashRouter>
  );
}


export default App;
