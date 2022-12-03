import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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
        alert("There was an issue with getting the tracks");
      }
    }
    fetchData();
  }, []);
  
  //props.userLoggedIn
  
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

  return (<>
    <div className="playlist-info">
      <button onClick={() => navigate(-1)}>Go Back</button>
      {props.loggedIn && props.canEdit? <button>Edit</button> : <></>}
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
      header={false}/>))}
    </div>
    <br/>
    <PlaylistReviews id={playlistID} canEdit={props.canEdit} loggedIn={props.loggedIn}/>
  </>)
}