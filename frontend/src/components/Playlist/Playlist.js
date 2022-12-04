import React, { useEffect, useState, useRef } from 'react'
import { json, Link, useParams } from 'react-router-dom'
import { fetchWrapper } from '../queryBackend';
import TrackRow from '../TrackRow/TrackRow';
import './Playlist.css';
import { useNavigate } from 'react-router-dom';
import PlaylistReviews from './PlaylistReviews/PlaylistReviews';

export default function Playlist(props) {
  const [tracks, setTracks] = useState([]);
  const [description, setDescription] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const [userName, setUserName] = useState('');
  const [numOfTracks, setNumOfTracks] = useState(0);
  const [duration, setDuration] = useState('');
  const [publicVisibility, setPublicVisibility] = useState(0);
  const [rating, setRating] = useState(0);
  const [dateLastChanged, setDateLastChanged] = useState();
  const [playlistID, setPlaylistID] = useState();

  const inputRating = useRef();
  const inputReview = useRef();

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => { 
    async function fetchData() {
      if(isNaN(id)) return alert("Please enter a number");//figure out why this doesn't return an error with private lists
      let query = props.canEdit && props.loggedIn ? "/api/account/loggedin/tracks/" : "/api/tracks/";
      let {result, body} = await fetchWrapper(query + id);//get set of track

      if(result.ok) {
        setTracks(body);

      } else {
        alert(body && body.error ? body.error : "There was an issue with getting the tracks");
      }
    }
    fetchData();
  }, []);
    
  useEffect(() => {
    let list = props.playlists.find((list) => list.playlistID == id);
    if(list !== undefined) {
      setPlaylistID(list.playlistID);
      setPlaylistName(list.name);
      setUserName(list.userName);
      setNumOfTracks(list.numOfTracks);
      setDuration(list.duration);
      setPublicVisibility(list.publicVisibility);
      setRating(list.averageRating);
      setDateLastChanged(list.dateLastChanged);
      setDescription(list.description);
    }
  }, [props.playlists]);

  async function sendReview() {
    let {result, body} = await fetchWrapper('/api/account/loggedin/playlist/review/' + id, {
      method : 'PUT',
      headers : {
        "Content-Type" : 'application/json'
      },
      body : JSON.stringify({
        review : inputReview.current.value,
        rating : inputRating.current.value
      })
    });

    if(result.ok) {
      window.location.reload();
    } else {
      alert(body && body.error ? body.error : "There was an issue with adding your review.");
    }
  }
  return (<>
    <div className="playlist-info">
      <button onClick={() => navigate(-1)}>Go Back</button>
      {props.loggedIn && props.canEdit? <Link to={'/loggedin/playlist/edit/' + id}><button>Edit</button></Link> : <></>}
      <br/>
      <p>Description: <span>{description}</span></p>
      <br/>
      <p>playlistName: {playlistName}</p>
      <p>creator : <span>{userName}</span></p>
      <p>Tracks: <span>{numOfTracks}</span></p>
      <p>PlayTime: <span>{duration}</span></p>
      <p>visability: <span>{publicVisibility === 1 ? 'public' : 'private'}</span></p>
      <p>Avg Rating: <span>{Math.round(rating*10)/10}</span></p>
      <p>Last Modified: <span>{dateLastChanged ? new Date(dateLastChanged).toLocaleString() : ''}</span></p>
    </div>
    <br/>
    <div className="tracks">
      <TrackRow header={true}/>
      {tracks.map((track) => (<TrackRow key={track.id} 
      id={track.id}
      artist={track.artistName} 
      duration={track.duration} 
      title={track.title}
      albumName={track.albumName}
      header={false} canEdit={false}/>))}
    </div>
    <br/>
    {props.loggedIn && !props.canEdit?
    <>
      <div className="add-review-row">
        <button onClick={() => sendReview()}>Add Review</button>
        <textarea type="text" ref={inputReview}/>
        <select ref={inputRating}>
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
        </select>
      </div>
    </>
     : ''}
    <br/>
    <PlaylistReviews id={playlistID} canEdit={props.canEdit} loggedIn={props.loggedIn}/>
  </>)
}