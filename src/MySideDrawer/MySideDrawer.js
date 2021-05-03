import React,{useState,useEffect} from 'react'
import './MySideDrawer.css'
import MyDatePicker from '../MyDatePicker/MyDatePicker'
import MyModal from '../MyModal/MyModal'
const MySideDrawer = () => {
 	const [isSliderOpen,setIsSliderOpen] = useState(false)
 	const [prevDate,setPrevDate] = useState()
	function onChange(timestamp) {
	  console.log(timestamp);
	  setPrevDate(timestamp)
	  console.log("prevDate",prevDate)
	}
	const handleIsSliderOpenChanged = () => setIsSliderOpen(!isSliderOpen)
	useEffect(()=>{
		console.log(prevDate)
		// setPrevDate(prevDate)
	},[prevDate])
	console.log("prevDate",prevDate)
	return (
		<div>
			<nav className="navbar">
				<span className="open-slide">
					<a href="#" onClick={handleIsSliderOpenChanged}>
						<svg width="30" height="30">
							<path d="M0,5 30,5" stroke="#fff" stroke-width="5"/>
							<path d="M0,14 30,14" stroke="#fff" stroke-width="5"/>
							<path d="M0,23 30,23" stroke="#fff" stroke-width="5"/>
						</svg>
					</a>
				</span>
				<ul className="navbar-nav">
					<li><a href="#">Home</a></li>
					<li><a href="#">About</a></li>
					<li><a href="#">Services</a></li>
					<li><a href="#">Contact</a></li>
				</ul>
			</nav>
			{isSliderOpen?(
				<div id="side-menu" className="side-nav">
					<a href="#" className="btn-close" onClick={handleIsSliderOpenChanged}>&times;</a>
					<a href="#">Home</a>
					<a href="#">About</a>
					<a href="#">Services</a>
					<a href="#">Contact</a>
				</div>
				):''}
			
			<div id="main" style={isSliderOpen ? {marginLeft:"250px"}:{}}>
				<MyDatePicker onChange={onChange}/>
				{prevDate ? (<MyDatePicker onChange={()=>console.log("hello")} prevDate={prevDate}/>):''}
				<MyModal/>
			</div>
	 </div>
		)
}

export default MySideDrawer