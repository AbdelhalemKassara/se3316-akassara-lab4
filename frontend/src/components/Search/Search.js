import React, {useEffect, useRef, useState} from 'react';
import {fetchWrapper} from '../queryBackend';
import TrackRow from '../TrackRow/TrackRow';

import './Search.css';

export default function Search() {
  const searchBar = useRef('');
  const [artist, setArtist] = useState('');
  const [track, setTrack] = useState('');
  const [genre, setGenre] = useState('');
  const [active, setActive] = useState('artist');
  const [results, setResults] = useState(() => {
    return []});

    useEffect(() => {
      search();
    }, []);
    
  function toggleButton(str) {
    
    if(active === 'genre') {
      setGenre(searchBar.current.value);
    } else if(active === 'track') {
      setTrack(searchBar.current.value);
    } else if(active === 'artist') {
      setArtist(searchBar.current.value);
    } 

    setActive(str);
    if(str === 'genre') {
      searchBar.current.value = genre;
    } else if(str === 'track') {
      searchBar.current.value = track;
    } else if(str === 'artist') {
      searchBar.current.value = artist;
    } else {
      searchBar.current.value = "";
    }

    console.log(artist, ' ' , track, ' ', genre);
  }
  function clearAllVals() {
    setGenre('');
    setTrack('');
    setArtist('');
    searchBar.current.value = "";
  }


  async function search() {
    let query = "/api/search?";
    query += artist !== ""? "artist=" + artist: "artist";
    query += track !== ""? "&track="+ track : "&track";
    query += genre !== ""? "&genre=" + genre: "&genre";

    let {result, body} = await fetchWrapper(query);
    if(result.ok) {
      setResults(body);  
    } else {
      alert(body && body.error ? body.error : "There was an issue with getting the search data.");
    }
  }
  return (<>
  <div className="search-bar"> 
    <button onClick={() => clearAllVals()}>Clear All Values</button>
    <input type="text" placeholder={active} ref={searchBar} disabled={active === 'all'}/>
    <button onClick={() => search()}>Search</button>
  </div>
  <div className="search-terms">
      <button onClick={() => toggleButton('all')}>All</button>
      <button onClick={() => toggleButton('artist')}>Artist</button>
      <button onClick={() => toggleButton('track')}>Track</button>
      <button onClick={() => toggleButton('genre')}>genre</button>
  </div>
  <br/>
  <div className="tracks">
    <TrackRow header={true}/>
    {results.map(track => {return <TrackRow key={track.id} 
      id={track.id}
      artist={track.artistName}
      duration={track.duration}
      title={track.title}
      albumName={track.albumName}
      header={false}
      />})}
    </div>
  </>)
}
