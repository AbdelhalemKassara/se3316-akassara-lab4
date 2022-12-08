import { Outlet, Route, Routes } from 'react-router-dom';
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
import EditPlaylist from './components/loggedIn/UserPlaylists/EditPlaylist/EditPlaylist';
import ViewUsers from './components/Admin/ViewUsers/ViewUsers';
import ViewReviews from './components/Admin/ViewReviews/ViewReviews';
import TextEditor from './components/Admin/TextEditor/TextEditor';
import TextViewer from './components/Admin/TextEditor/TextViewer';
import DMCATakedownPage from './components/Admin/DMCATakedownPage/DMCATakedownPage';
import DMCARequestsInfo from './components/Admin/DMCARequestsInfo/DMCARequestsInfo';

function App() {
  const [publicPlaylists, setPublicPlaylists] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [user, setUser] = useState(() => {
    let token = localStorage.getItem('refreshToken');
    if(token) {
      return jwtDecode(token);
    } else {
      return {};
    }
  });
  const updateUserPlaylists = async () => {
    let {result, body} = await fetchWrapper("/api/account/loggedin/playlists");
    if(result.ok) {
      setUserPlaylists(body);
    } else {
      alert(body && body.error ? body.error : "There was an issue with getting your playlists.");
    }
  }
  useEffect(() => {
    async function fetchData() {
      let {body} = await fetchWrapper('/api/playlists');
      setPublicPlaylists(body);
    }
    fetchData();

    if(user.id) {
      updateUserPlaylists();
    }
  }, [user])

  
  
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
      <NavBar userName={user.userName} onLogout={logOutUser} isAdmin={user.admin == 1}/>
      <div id="main-content">
        <Routes>
          <Route path="/" element={<Home publicPlaylists={publicPlaylists}/>} />
          <Route path='/documents'>
            <Route path='securityandprivacypolicy' element={<TextViewer path='/api/documents/securityandprivacypolicy'/>}/>
            <Route path='acceptableusepolicy' element={<TextViewer path='/api/documents/acceptableusepolicy'/>}/>
            <Route path='dmcapolicy' element={<TextViewer path='/api/documents/dmcapolicy'/>}/>
          </Route>
          <Route path="/account" element={!user.id?<Outlet /> : <Home publicPlaylists={publicPlaylists}/>}>
            <Route path="login" element={<LogIn onLogin={loginUser}/> } />
            <Route path="signup" element={<SignUp /> } />
          </Route>

          <Route path="/playlist/:id" element={<Playlist playlists={publicPlaylists} canEdit={false} loggedIn={localStorage.getItem('refreshToken') !== null}/>} />
          <Route path="/track/:id" element={<TrackInfo />} />
          <Route path='/search' element={<Search />} />
          
          <Route path='/loggedin' element={user.id ? <Outlet/> :<LogIn onLogin={loginUser}/>}> 
            <Route path="playlist/edit/:id" element={<EditPlaylist userPlaylists={userPlaylists} onUpdateUserPlaylists={updateUserPlaylists}/>}/>
            <Route path="playlists" element={<UserPlaylists userPlaylists={userPlaylists}/>} />
            <Route path="playlist/:id" element={<Playlist playlists={userPlaylists} canEdit={true} loggedIn={localStorage.getItem('refreshToken') !== null}/>} />
            <Route path="changepassword" element={<ChangePassword onChangePassword={changePassword}/>} />
            <Route path="playlistReview" element={<PlaylistReview />} />
          </Route>
  
          <Route path='/admin' element={user.admin === 1 ? <Outlet /> : <Home publicPlaylists={publicPlaylists}/>}>
            <Route path='view/users' element={<ViewUsers />}/>
            <Route path='view/reviews' element={<ViewReviews />}/>
            <Route path='dmcatakedown' element={<DMCATakedownPage />}/>
            <Route path='edit/securityandprivacypolicy' element={<TextEditor filePath='/api/account/loggedin/admin/documents/securityandprivacypolicy' getPath='/api/documents/securityandprivacypolicy' title='Security and Privacy Policy'/>} />
            <Route path='edit/acceptableusepolicy' element={<TextEditor filePath='/api/account/loggedin/admin/documents/acceptableusepolicy' getPath='/api/documents/acceptableusepolicy' title='Acceptable Use Policy'/>} />
            <Route path='edit/dmcapolicy' element={<TextEditor filePath='/api/account/loggedin/admin/documents/dmcapolicy' getPath='/api/documents/dmcapolicy' title='DMCA Policy'/>} />
            <Route path='view/dmcatakedown' element={<TextViewer path='/api/account/loggedin/admin/documents/dmcatakedown'/>}/>
            <Route path='view/request/:id' element={<DMCARequestsInfo />}/>
          </Route>

          <Route path="*" element={<p>404 Not Found</p>} />
        </Routes>
      </div>
    </>

  );
}

export default App;
