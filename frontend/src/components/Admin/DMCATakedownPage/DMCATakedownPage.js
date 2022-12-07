import React, { useState, useRef } from 'react'
import './DMCATakedownPage.css';

export default function DMCATakedownPage() {
  const [reviewIDs, setReviewIDs] = useState([]);
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

  function addId() {
    if(!reviewIDs.includes(idInput.current.value)) {
      setReviewIDs([...reviewIDs, idInput.current.value]);
    } else {
      alert('You have already added this review.')
    }
  }
  function logNotice() {
    let date = noticeDate.current.value.split('-');
    let time = noticeTime.current.value.split(':');

    console.log(noticeNotes.current.value, noticeID.current.value);
  }
  function logRequest() {

  }
  function logDispute() {

  }

  function activateRequest() {

  }
  function disactivateRequest() {

  }
  return (<>
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
  </>)
}

function generateInputRow(dateRef, timeRef, addFunc, notesRef, idRef) {
  return (<div className='row'>
    {idRef ? <input className='f1' type='number' ref={idRef}/> : <></>}
    <input className='f1' type='date' ref={dateRef}/>
    <input className='f1' type='time' ref={timeRef}/>
    <input className='notes' type='text' placeholder='notes' ref={notesRef}/>
    <button onClick={addFunc}>Add</button>
</div>)
}

