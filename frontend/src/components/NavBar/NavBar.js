import React, { useState } from 'react'
import './NavBar.css';
import { Link } from 'react-router-dom';
import UserWindow from './UserWindow/UserWindow';


export default function NavBar(props) {

  return (
    <div className="Nav-Bar">
      <p>Abdelhalem</p>
      <Link to="/" className="Nav-Bar-Item" id="Home">Home</Link>
      <Link to="/Genres" className="Nav-Bar-Item" id="Genres">Genres</Link>
      <Link to="/Search" className="Nav-Bar-Item" id="Search">Search</Link>
      <UserWindow userName={props.userName} onLogout={props.onLogout}/>
    </div>
  );
}
