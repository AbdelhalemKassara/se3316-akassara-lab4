import React from 'react';
import './PlaylistIcon.css';
import { Link } from 'react-router-dom'

export default function PlaylistIcon(props) {
  return (
    <Link to={'/playlist/' + props.id}>
    <div className="playlist-icon">
      <p>{props.playlistName}</p>
      <p>userName : <span>{props.user}</span></p>
      <p>Tracks: <span>{props.tracksCount}</span></p>
      <p>PlayTime: <span>{props.playTime}</span></p>
      <p>Avg Rating: <span>{props.rating}</span></p>
      <p>Last Modified: <span>{new Date(props.dateLastChanged).toLocaleString()}</span></p>
    </div>
    </Link>
    );
}
