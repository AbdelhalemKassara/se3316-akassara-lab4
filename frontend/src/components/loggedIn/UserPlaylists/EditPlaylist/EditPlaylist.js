import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { fetchWrapper } from '../../../queryBackend';
import './EditPlaylist.css';
import TrackRow
 from '../../../TrackRow/TrackRow';
export default function CreatePlaylist(props) {
  const { id } = useParams();
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

  const addTrack = useRef();
  useEffect(() => {
    getTracks();
  }, []);

  async function getTracks() {
    let {result, body} = await fetchWrapper('/api/account/loggedin/tracks/' + id);

    if(result.ok) {
      setTracks(body);
    } else {

      alert(body && body.error? body.error : "There was an issue with getting the tracks");
    }
  }

  useEffect(() => {
    let list = props.userPlaylists.find((list) => list.playlistID == id);
    if(list !== undefined) {
      setPlaylistID(list.playlistID);
      setPlaylistName(list.name);
      setUserName(list.userName);
      setNumOfTracks(list.numOfTracks);
      setDuration(list.duration);
      setPublicVisibility(list.publicVisibility);
      setRating(list.averageRating);
      setDateLastChanged(list.dateLastChanged);
      setDescription(list.description == null ? '' : list.description);
    }
  }, [props.userPlaylists]);

  async function updatePlaylist() {

    props.onUpdateUserPlaylists();
    getTracks();
  }
  
  async function deletePlaylist() {
    console.log(playlistID);
  }

  async function getNewTrack() {//only gets the track
    if(tracks.filter((track) => track.id === Number(addTrack.current.value)).length !== 0) return alert('This track is already in the playlist');
    
    let {result, body} = await fetchWrapper('/api/track/' + addTrack.current.value);

    if(result.ok) {
      setTracks([...tracks, body]);      
    } else {
      alert(body && body.error ? body.error : 'There was an issue with getting this track');
    } 
  }

  const deleteTrack = (trackID) => {
    setTracks([...tracks.filter((track) => track.id !== trackID)]);
  };

  return (<>
    <div className="edit-top-buttons">
      <button onClick={() => updatePlaylist()}>Save</button>
      <button>Cancel</button>
    </div>
    <br/><br/>
    <div>
      <p className='lables'>Visibility</p>
      <button onClick={() => setPublicVisibility(publicVisibility == 1?0:1)}>{publicVisibility == 1? 'public' : 'private'}</button>
    </div>
    <br/>
    <div>
      <p className="lables">Playlist Name</p>
      <input type="text" value={playlistName} onChange={(e) => setPlaylistName(e.target.value)}/>
      <br/><br/>
      <p className="lables">Description</p>
      <textarea className="description-input" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
    </div>
    <br/><br/>
    <div className="tracks delete">
      <TrackRow header={true} canEdit={true}/>
      {tracks.map((track) => (<TrackRow key={track.id} 
      id={track.id}
      artist={track.artistName} 
      duration={track.duration} 
      title={track.title}
      albumName={track.albumName}
      header={false} canEdit={true}
      onDeleteTrack={deleteTrack}/>))}
    </div>
    <br/><br/>
    <div>
      <button className='lables' onClick={() => getNewTrack()}>Add Track</button>
      <input type="number" ref={addTrack}/>
    </div>
    <br/><br/>
    <button onClick={() => deletePlaylist()}>Delete Playlist</button>
    </>);
}
