import { Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import LogIn from './components/LogIn/LogIn';
import SignUp from './components/SignUp/SignUp';
import NavBar from './components/NavBar/NavBar';
import './App.css';

function App() {
  return (
    <>
      <NavBar />
      <div id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account/login" element={<LogIn /> } />
          <Route path="/account/signup" element={<SignUp /> } />
        </Routes>
      </div>
    </>

  );
}

export default App;

/*
    <div className="App">
      <LogIn />
    </div>
  );
*/