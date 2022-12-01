import { Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import LogIn from './components/LogIn/LogIn';
import SignUp from './components/SignUp/SignUp';
import NavBar from './components/NavBar/NavBar';
import {useState} from 'react';
import './App.css';
import {logIn, logOut} from './components/queryBackend';

function App() {
  const [user, setUser] = useState();
  const loginUser = async (email, password) => {
    if(await logIn({email : email, password : password})) {
      console.log("You have been logged in")
      setUser(email);
    } 
  }
  const logOutUser = async () => {
    if(await logOut()) {
      setUser('');
    }
  }
  return (
    <>
      <NavBar user={user} onLogout={logOutUser}/>
      <div id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account/login" element={<LogIn onLogin={loginUser}/> } />
          <Route path="/account/signup" element={<SignUp /> } />
        </Routes>
      </div>
    </>

  );
}

export default App;
