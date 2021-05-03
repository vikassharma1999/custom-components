import React,{useState,useEffect} from 'react'
import './MyModal.css'

const MyModal = ({show,onClose,onOutSideClick}) => {
	
	const closeOnEscapeKeyDown = e => {
		console.log("keyCode",e.keyCode)
	    if (e.keyCode === 27) {
	    	// console.log("hello ji")
	      	onClose();
	    }
  	};

  	useEffect(() => {
	    document.body.addEventListener("keydown", closeOnEscapeKeyDown);
	    return function cleanup() {
	      document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
	    };
 	 }, []);
	return (
			<div>
				
				{show ? (
						<div id="simpleModal" className="modal" onClick={onOutSideClick}>
							<div className="modal-content" onClick={e=>e.stopPropagation()}>
								<div className="modal-header">
									<span className="closeBtn" id="closeBtn" onClick={onClose}>
										&times;
									</span>
									<h2>Modal Header</h2>
								</div>
								<div className="modal-body">
									<p>Hello... I am a modal</p>
									<p>Since 1954, Loram Maintenance of Way, Inc. has been providing the most advanced, most productive and most innovative railroad maintenance services and equipment with exceptionally high standards of quality and performance. Today, the Loram portfolio represents the industry’s leading range of comprehensive solutions designed to help you achieve operational excellence, extend rail and track asset life and enhance efficiency to new levels.</p>
									<button className="button" onClick={onClose}>submit</button>
								</div>
								<div className="modal-footer">
									<h3>Modal footer</h3>
								</div>
							</div>
						</div>
						)
						:''}
				
			</div>
		)
}

export default MyModal;