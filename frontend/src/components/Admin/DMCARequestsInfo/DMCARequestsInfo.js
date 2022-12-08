import React, {useEffect, useState} from 'react'
import { fetchWrapper } from '../../queryBackend';
import { useParams } from 'react-router-dom'

import '../DMCATakedownPage/Table.css';

export default function DMCARequestsInfo() {
  const { id } = useParams();
  const [notices, setNotices] = useState([]);
  const [disputes, setDisputes] = useState([]);

  useEffect(() => {
    async function getData() {
      let result = await fetchWrapper('/api/account/loggedin/admin/dmcatakedown/notices/' + id);
      
      if(result.result.ok) {
        setNotices(result.body);
      } else {
        alert(result.body && result.body.error ? result.body.error : "There was an issue when getting the notices");
      }

      result = await fetchWrapper('/api/account/loggedin/admin/dmcatakedown/disputes/' + id);

      if(result.result.ok) {
        setDisputes(result.body);
      } else {
        alert(result.body && result.body.error ? result.body.error : "There was an issue when getting the disputes");
      }    
    }

    getData();
  },[])
  
  console.log(notices);
  return (<>
  <h1>Notices</h1>
  <div className="table" style={{gridTemplateColumns: '1fr 1fr 1fr'}}>
    <div className='header'>ID</div>
    <div className='header'>Date Recived</div>
    <div className='header'>Note</div>
    {notices.map((val) => (<Row key={val.id} {...val}/>))}
  </div>

  <br/><br/>
  <h1>Disputes</h1>
  <div className="table" style={{gridTemplateColumns: '1fr 1fr 1fr'}}>
    <div className='header'>ID</div>
    <div className='header'>Date Recived</div>
    <div className='header'>Note</div>
    {disputes.map((val) => (<Row key={val.id} {...val}/>))}
  </div>

  </>)
}

function Row({id, dateRecived, note, dateSent}) {
  return(<>
  <div className='row'>{id}</div>
  <div className='row'>{new Date(dateRecived || dateSent).toLocaleString()}</div>
  <div className='row'>{note}</div>
  </>)
}
