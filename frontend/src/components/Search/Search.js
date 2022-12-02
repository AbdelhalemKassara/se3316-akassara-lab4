import React, {useEffect, useRef, useState} from 'react';
import {fetchWrapper} from '../queryBackend';
import TrackRow from '../TrackRow/TrackRow';

import './Search.css';

export default function Search() {
  const searchBar = useRef('');
  const [searchVal, setSearchVal] = useState('');
  const artist = useRef('');
  const track = useRef('');
  const genre = useRef('');
  const [active, setActive] = useState('artist');
  const [results, setResults] = useState(() => {
    return []});

    useEffect(() => {
      search();
    }, []);

    useEffect(() => {
      if(active === 'genre') {
        genre.current = searchVal;
      } else if(active === 'track') {
        track.current = searchVal;
      } else if(active === 'artist') {
        artist.current = searchVal;
      } 
    }, [searchVal]);

  function toggleButton(str) {  
    setActive(str);
    if(str === 'genre') {
      setSearchVal(genre.current);
    } else if(str === 'track') {
      setSearchVal(track.current);
    } else if(str === 'artist') {
      setSearchVal(artist.current);
    } else {
      setSearchVal('');
    }
  }

  function clearAllVals() {
    genre.current = '';
    track.current = '';
    artist.current = '';
    setSearchVal('');
  }


  async function search() {
    let query = "/api/search?";
    query += artist !== ""? "artist=" + artist.current : "artist";
    query += track !== ""? "&track="+ track.current : "&track";
    query += genre !== ""? "&genre=" + genre.current : "&genre";

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
    <input type="text" placeholder={active} value={searchVal} onChange={(e) => setSearchVal(e.target.value)}/>
    <button onClick={() => search()}>Search</button>
  </div>
  <div className="search-terms">
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
