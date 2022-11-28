import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Home from './components/Home/Home';
import LogIn from './components/LogIn/LogIn';
import SignUp from './components/SignUp/SignUp';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account/login" element={<LogIn /> } />
        <Route path="/account/signup" element={<SignUp /> } />
      </Routes>
    </AuthProvider>

  );
}

export default App;

/*
    <div className="App">
      <LogIn />
    </div>
  );
*/