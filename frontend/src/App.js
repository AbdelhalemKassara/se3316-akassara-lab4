import { Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import LogIn from './components/LogIn/LogIn';
import SignUp from './components/SignUp/SignUp';
import NavBar from './components/NavBar/NavBar';
import {useState, useEffect} from 'react';
import './App.css';
import {logOut, fetchWrapper} from './components/queryBackend';
import PlaylistReview from './components/loggedIn/PlaylistReview/PlaylistReview';
import Playlist from './components/Playlist/Playlist';
import UserPlaylists from './components/loggedIn/UserPlaylists/UserPlaylists';
import ChangePassword from './components/loggedIn/ChangePassword/ChangePassword';
import jwtDecode from 'jwt-decode';
import TrackInfo from './components/TrackInfo/TrackInfo';
import Search from './components/Search/Search';

function App() {
  const [publicPlaylists, setPublicPlaylists] = useState([]);

  useEffect(() => {
    async function fetchData() {
    let {body} = await fetchWrapper('/api/playlists');
    setPublicPlaylists(body);
  }
  fetchData();
  }, [])

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
      if(result.verificationLink && window.confirm('this will take you to verify your account.')) {
        window.location.href = result.verificationLink;
      } else {
        alert(result.error ? result.error : 'There was in issue logging you in');
      }
    }
  }

  const logOutUser = async () => {
    if(await logOut()) {
      setUser({});
      alert('You have been logged out');
    } else {
      alert('There was an issue when trying to log you out');
    }
  }
  const changePassword = async (password) => {
    let {result} = await fetchWrapper('/api/account/loggedin/changepassword', {
      method : 'PUT',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({
        password : password
      })
    })

    if(result.ok) {
      alert("Your password has been updated");
    }
  }
  
  return (
    <>
      <NavBar user={user.email} userName={user.userName} onLogout={logOutUser}/>
      <div id="main-content">
        <Routes>
          <Route path="/" element={<Home publicPlaylists={publicPlaylists}/>} />

          <Route path="/account">
            <Route path="login" element={<LogIn onLogin={loginUser}/> } />
            <Route path="signup" element={<SignUp /> } />
          </Route>

          <Route path="/playlist/:id" element={<Playlist publicPlaylists={publicPlaylists}/>} />
          <Route path="/track/:id" element={<TrackInfo />} />
          <Route path='/search' element={<Search />} />
          
          <Route path='/loggedin'> 
            <Route path="playlists" element={<UserPlaylists />} />
            <Route path="changepassword" element={<ChangePassword onChangePassword={changePassword}/>} />
            <Route path="playlistReview" element={<PlaylistReview />} />
          </Route>
  

          <Route path="*" element={<p>404 Not Found</p>} />
        </Routes>
      </div>
    </>

  );
}

export default App;
