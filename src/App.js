import React,{useState,useEffect,useRef} from 'react';
import './App.css';
import MySideDrawer from './MySideDrawer/MySideDrawer'
import MyDatePicker from './MyDatePicker1/MyDatePicker'
import MyModal from './MyModal/MyModal'

let inputRef1 = React.createRef();
let inputRef2 = React.createRef();

function App() {
	// year={1999} month={0} day={3}
	const [prevDate,setPrevDate]=useState()
	const [showModal,setShowModal]=useState(false)
	const isInitialMount = useRef(true);
	const onChange=(timestamp)=>{
		console.log("timestamp",timestamp)
		setPrevDate(timestamp)
	}
	const onOutSideClick=()=>{
		// console.log("Hello")
		setShowModal(false)
	}
  return (
    <div className="App">
      <MyDatePicker inputRef={inputRef1} year={1999} month={0} day={3} onChange={onChange}/>
      {prevDate?<MyDatePicker inputRef={inputRef2} prevDate={prevDate}/>:''}
      <button id="modalBtn" className="button" onClick={()=>setShowModal(true)}>Open Modal</button>
      <MyModal onOutSideClick={onOutSideClick} onClose={() => setShowModal(false)} show={showModal}/>
    </div>
  );
}

export default App;