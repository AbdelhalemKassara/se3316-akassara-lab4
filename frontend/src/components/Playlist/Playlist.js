import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchWrapper } from '../queryBackend';
import TrackRow from '../TrackRow/TrackRow';
import './Playlist.css';
import { useNavigate } from 'react-router-dom';

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
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => { 
    async function fetchData() {
      if(isNaN(id)) return alert("Please enter a number");
      let {result, body} = await fetchWrapper("/api/tracks/" + id);//get set of track

      if(result.ok) {
        setTracks(body);
      } else {
        alert("There was an issue with getting the tracks");
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    let list = props.publicPlaylists.find((list) => list.playlistID == id);
    if(list !== undefined) {
      setPlaylistName(list.name);
      setUserName(list.userName);
      setNumOfTracks(list.numOfTracks);
      setDuration(list.duration);
      setPublicVisibility(list.publicVisibility);
      setRating(list.rating);
      setDateLastChanged(list.dateLastChanged);
      setDescription(list.description);
    }
  }, [props.publicPlaylists]);

  return (<>
    <div className="playlist-info">
      <button onClick={() => navigate(-1)}>Go Back</button>
      <br/>
      <p>Description: <span>{description}</span></p>
      <br/>
      <p>playlistName: {playlistName}</p>
      <p>creator : <span>{userName}</span></p>
      <p>Tracks: <span>{numOfTracks}</span></p>
      <p>PlayTime: <span>{duration}</span></p>
      <p>visability: <span>{publicVisibility === 1 ? 'public' : 'private'}</span></p>
      <p>Avg Rating: <span>{rating}</span></p>
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
    
  </>)
}