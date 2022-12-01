import { Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import LogIn from './components/LogIn/LogIn';
import SignUp from './components/SignUp/SignUp';
import NavBar from './components/NavBar/NavBar';
import {useState} from 'react';
import './App.css';
import queryBackend, {logOut} from './components/queryBackend';
import PlaylistReview from './components/loggedIn/PlaylistReview/PlaylistReview';
import UserPlaylist from './components/loggedIn/UserPlaylist/UserPlaylist';
import UserPlaylists from './components/loggedIn/UserPlaylists/UserPlaylists';
import ChangePassword from './components/loggedIn/ChangePassword/ChangePassword';
import jwtDecode from 'jwt-decode';

function App() {
  const [user, setUser] = useState(() => {
    let token = localStorage.getItem('refreshToken');
    if(token) {
      return jwtDecode(token);
    } else {
      return {};
    }
  });

  const loginUser = async (email, password) => {
    let result = await fetch('/api/account/login', {
      method : 'POST',
      headers : {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({
        email : email,
        password : password
      })
    });

    if(result.ok) {
      result = await result.json();
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      setUser(jwtDecode(localStorage.getItem('refreshToken')));
    } else {
      result = await result.json();
      alert(result.error);
    }
  }

  const logOutUser = async () => {
    if(await logOut()) {
      setUser({});
    }
  }
  const changePassword = async (password) => {
    let {resultHTTP, resultBody} = await queryBackend('/api/account/loggedin/changepassword', {
      method : 'PUT',
      body : JSON.stringify({
        password : password
      })
      
    })

    if(resultHTTP.ok) {
      alert("Your password has been updated");
    }
  }

  return (
    <>
      <NavBar user={user.email} userName={user.userName} onLogout={logOutUser} onChangePassword={changePassword}/>
      <div id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account/login" element={<LogIn onLogin={loginUser}/> } />
          <Route path="/account/signup" element={<SignUp /> } />
          <Route path="/loggedin/playlistReview" element={<PlaylistReview />} />
          <Route path="/loggedin/playlist" element={<UserPlaylist />} />
          <Route path="/loggedin/playlists" element={<UserPlaylists />} />
          <Route path="/loggedin/changepassword" element={<ChangePassword />} />
        </Routes>
      </div>
    </>

  );
}

export default App;
