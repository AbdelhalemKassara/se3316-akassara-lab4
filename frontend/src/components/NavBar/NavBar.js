import React, { useState } from 'react'
import './NavBar.css';
import { Link } from 'react-router-dom';


export default function NavBar() {
  const [userMenu, setUserMenu] = useState(false);
  
  return (
    <div className="Nav-Bar">
      <p>Abdelhalem</p>
      <Link to="/" className="Nav-Bar-Item" id="Home">Home</Link>
      <Link to="/Genres" className="Nav-Bar-Item" id="Genres">Genres</Link>
      <Link to="/Playlists" className="Nav-Bar-Item" id="Playlists">Playlists</Link>
      <Link to="/Search" className="Nav-Bar-Item" id="Search">Search</Link>
      <Link to='/account/login' className="Nav-Bar-Item" id="User">User</Link>
    </div>
  );
}
