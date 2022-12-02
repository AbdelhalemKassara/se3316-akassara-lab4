import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import { fetchWrapper } from '../queryBackend';
import { useNavigate } from 'react-router-dom';

export default function TrackInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [albumTitle, setAlbumTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [dateRecorded, setDateRecorded] = useState();
  const [dateCreated, setDateCreated] = useState();
  const [duration, setDuration] = useState('');
  const [number, setNumber] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    async function fetchData() {
      let {result, body} = await fetchWrapper("/api/track/" + id);
      if(result.ok) {
        setAlbumTitle(body.albumName);
        setArtist(body.artistName);
        setDateRecorded(body.dateRecorded);
        setDateCreated(body.dateCreated);
        setDuration(body.duration);
        setNumber(body.number);
        setTitle(body.title);
      } else {
        alert(body? body.error : "There was an issue with getting this track.");
      }
    }
    fetchData();
  },[])

  return (<>
  <a href={"https://www.youtube.com/results?search_query=" + title + ' by ' + artist} target="_blank">youtube</a>
  <br/><br/>
  <p>Album: {albumTitle}</p>
  <p>Artist: {artist}</p>
  <p>Date Recorded: {dateRecorded ? new Date(dateRecorded).toLocaleString() : ''}</p>
  <p>Date Created: {dateCreated ? new Date(dateCreated).toLocaleString() : ''}</p>
  <p>Duration: {duration}</p>
  <p>Track Number: {number}</p>
  <p>Track Title: {title}</p>
  <br/>
  <button onClick={() => navigate(-1)}>Go Back</button>
  </>)
}
