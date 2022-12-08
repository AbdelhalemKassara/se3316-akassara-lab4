import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom';
import {fetchWrapper} from '../../queryBackend';

import './DMCATakedownPage.css';
import './Table.css';

export default function DMCATakedownPage() {
  const [reviewIDs, setReviewIDs] = useState([]);
  const [activeReq, setActiveReq] = useState([]);
  const [disabledReq, setDisabledReq] = useState([]);

  const idInput = useRef();
  const reqDate = useRef();
  const reqTime = useRef();
  const reqNotes = useRef();

  const noticeID = useRef();
  const noticeDate = useRef();
  const noticeTime = useRef();
  const noticeNotes = useRef();

  const disputeID = useRef();
  const disputeDate = useRef();
  const disputeTime = useRef();
  const disputeNotes = useRef();

  const disactReq = useRef();
  const actReq = useRef();

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    let result = await fetchWrapper('/api/account/loggedin/admin/dmcatakedown/activerequests');

    if(result.result.ok) {
      setActiveReq(result.body);
    } else {
      alert(result.body && result.body.error ? result.body.error : "There was an issue when getting the active requests.");
    }

    result = await fetchWrapper('/api/account/loggedin/admin/dmcatakedown/disactivatedrequests');

    if(result.result.ok) {
      setDisabledReq(result.body);
    } else {
      alert(result.body && result.body.error ? result.body.error : "There was an issue when getting the active requests.");
    }
    
  }

  function addId() {
    if(idInput.current.value === '') {
      alert("Please enter a value first.");
      return;
    }

    if(!reviewIDs.includes(idInput.current.value)) {
      setReviewIDs([...reviewIDs, idInput.current.value]);
    } else {
      alert('You have already added this review.')
    }
  }
  async function logNotice() {
    let date = noticeDate.current.value.split('-');
    let time = noticeTime.current.value.split(':');

    if(noticeID.current.value === '') {
      return alert("Please enter an id")
    }
    let {result, body} = await fetchWrapper('/api/account/loggedin/admin/dmcatakedown/lognotice/' + noticeID.current.value , {
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({
      year : date[0],
      month : date[1],
      day : date[2],
      hour : time[0],
      minute : time[1],
      note : noticeNotes.current.value
      })
    });

    if(result.ok) {
      alert('The notice has been added.');
    } else {
      alert(body && body.error ? body.error : "There was an issue with sending the notice.");
    }
    getData();
  }
  async function logRequest() {
    let date = reqDate.current.value.split('-');
    let time = reqTime.current.value.split(':');

    let {result, body} = await fetchWrapper('/api/account/loggedin/admin/dmcatakedown/logrequest', {
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({
      year : date[0],
      month : date[1],
      day : date[2],
      hour : time[0],
      minute : time[1],
      reviews : reviewIDs,
      note : reqNotes.current.value
      })
    });

    if(result.ok) {
      alert('The request has been added.');
    } else {
      alert(body && body.error ? body.error : "There was an issue with sending the request.");
    }
    getData();
  }
  async function logDispute() {
    let date = disputeDate.current.value.split('-');
    let time = disputeTime.current.value.split(':');

    if(disputeID.current.value === '') {
      return alert("Please enter an id")
    }
    let {result, body} = await fetchWrapper('/api/account/loggedin/admin/dmcatakedown/logdispute/' + disputeID.current.value , {
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({
      year : date[0],
      month : date[1],
      day : date[2],
      hour : time[0],
      minute : time[1],
      note : disputeNotes.current.value
      })
    });

    if(result.ok) {
      alert('The dispute has been added.');
    } else {
      alert(body && body.error ? body.error : "There was an issue with sending the dispute.");
    }
    getData();
  }

  async function activateRequest() {
    let {result, body} = await fetchWrapper('/api/account/loggedin/admin/dmcatakedown/activaterequest/' + actReq.current.value,
    {method : 'PUT'});

    if(result.ok) {
      alert('The request has been activated');
    } else {
      alert(body && body.error ? body.error : "There was an issue with activating the request.");
    }
    getData();
  }
  async function disactivateRequest() {
    let {result, body} = await fetchWrapper('/api/account/loggedin/admin/dmcatakedown/disactivaterequest/' + disactReq.current.value,
    {method : 'PUT'});

    if(result.ok) {
      alert('The request has been disactivated');
    } else {
      alert(body && body.error ? body.error : "There was an issue with disactivating the request.");
    }
    getData();
  }
  

  return (<>
  <Link to='/admin/view/dmcatakedown'>DMCA Takedown Explanation Document</Link>
  <h2>Log Request</h2>
  <div className='input-review-ids'>
    <p>Review IDS: {reviewIDs.map(id => id + ', ')}</p>
    <br/>
    <input type="number" ref={idInput}/>
    <button onClick={addId}>Add ID</button>
    <button onClick={() => setReviewIDs([])}>Clear</button>
  </div>
  {generateInputRow(reqDate, reqTime, logRequest, reqNotes)}
 
  <br/>
  <h2>Log Notice</h2>
  {generateInputRow(noticeDate, noticeTime, logNotice, noticeNotes, noticeID)}

  <br/>
  <h2>Log Dispute</h2>
  {generateInputRow(disputeDate, disputeTime, logDispute, disputeNotes, disputeID)}

  <div className='req'>
    <div className='req-status'>
      <h2>Activate Request</h2>
      <input type='number'ref={actReq}/>
      <button onClick={activateRequest}>Activate</button>
    </div>
    <div className='req-status'>
      <h2>Disactivate Request</h2>
      <input type='number'ref={disactReq}/>
      <button onClick={disactivateRequest}>Disactivate</button>
    </div>
  </div>
    <hr/>
    <h2>Active Requests</h2>
    <div className="table" style={{gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr'}}>
      <div className='header'>ID</div>
      <div className='header'>Active</div>
      <div className='header'>Date Recived</div>
      <div className='header'>Note</div>
      <div className='header'>reviews</div>
      {activeReq.map((value) => (<Row key={value.id} {...value}/>))}
    </div>
    <br/><br/>
    <h2>Disactivated Requests</h2>
    <div className="table" style={{gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr'}}>
      <div className='header'>ID</div>
      <div className='header'>Active</div>
      <div className='header'>Date Recived</div>
      <div className='header'>Note</div>
      <div className='header'>reviews</div>
      {disabledReq.map((value) => (<Row key={value.id} {...value}/>))}
    </div>
    <br/><br/><br/><br/>
  </>)
}

function generateInputRow(dateRef, timeRef, addFunc, notesRef, idRef) {
  return (<div className='row'>
    {idRef ? <input className='f1' type='number' placeholder='request id' ref={idRef}/> : <></>}
    <input className='f1' type='date' ref={dateRef}/>
    <input className='f1' type='time' ref={timeRef}/>
    <input className='notes' type='text' placeholder='notes' ref={notesRef}/>
    <button onClick={addFunc}>Add</button>
</div>)
}

function Row({id, active, dateRecived, note, reviews}) {
  return (<>
  <div className='row'><Link to={'/admin/view/request/' + id}>{id}</Link></div>
  <div className='row'>{active}</div>
  <div className='row'>{new Date(dateRecived).toLocaleString()}</div>
  <div className='row'>{note}</div>
  <div className='row'>{reviews.toString()}</div>
  </>)
  
}
