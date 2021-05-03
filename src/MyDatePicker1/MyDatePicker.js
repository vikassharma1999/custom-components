import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './MyDatePicker.css';

let oneDay = 60 * 60 * 24 * 1000;
let todayTimestamp = Date.now() - (Date.now() % oneDay) + (new Date().getTimezoneOffset() * 1000 * 60);
// let inputRef = React.createRef();

export default class MyDatePicker extends Component {

  

    constructor(props) {
        super(props);
        console.log("Props::",typeof this.props.month)
        let date = (this.props.prevDate && new Date(this.props.prevDate)) || (this.props.year && this.props.month>=0 && new Date(this.props.year,this.props.month)) || new Date();
        let year = date.getFullYear();
        let month =date.getMonth();
        if(this.props.prevDate){
        console.log("PrevDate::hi",new Date(this.props.prevDate))

        }
        this.state = {
            year,
            month,
            selectedDay: (this.props.prevDate && new Date(this.props.prevDate))||(this.props.year && this.props.month>=0 && new Date(this.props.year,this.props.month,this.props.day).getTime())|| todayTimestamp,
            monthDetails: this.getMonthDetails(year, month)//2021,4

        }
    }

    componentDidMount() {
        window.addEventListener('click', this.addBackDrop);
        this.setDateToInput(this.state.selectedDay);
    }
    // componentDidUpdate(){
    // 	console.log("hello")
    // 	this.setDateToInput(this.state.selectedDay);
    // }
    componentWillUnmount() {
        window.removeEventListener('click', this.addBackDrop);
    }

    addBackDrop =e=> {
        if(this.state.showDatePicker && !ReactDOM.findDOMNode(this).contains(e.target)) {
            this.showDatePicker(false);
        }
    }

    showDatePicker =(showDatePicker=true)=> {
        this.setState({ showDatePicker })
    }

    /**
     *  Core
     */

    daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    monthMap = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    getDayDetails =args=> {
    	/*
    	index=0,numberOfDays=31,firstDay=6,year=2021,month=4
    	*/
        let date = args.index - args.firstDay; //0-6=-6
        let day = args.index%7;//0%7=0
        let prevMonth = args.month-1;//4-1->APR
        let prevYear = args.year;//2021
        if(prevMonth < 0) {
            prevMonth = 11;
            prevYear--;
        }
        let prevMonthNumberOfDays = this.getNumberOfDays(prevYear, prevMonth);//(2021,3)=>30
        let _date = (date < 0 ? prevMonthNumberOfDays+date : date % args.numberOfDays) + 1;//25
        let month;//= date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;//-1

        if(date<0 || ((!this.props.prevDate) && (new Date(prevYear,prevMonth+1,date+1).getTime() > todayTimestamp))){
            month=-1;
        }
        else if(date>=args.numberOfDays){
            month=1;
        }
        else if(this.props.prevDate && date>=0 && (this.props.prevDate > (new Date(prevYear,prevMonth+1,date)).getTime())){
        	console.log("This props::",this.props.prevDate)
            month=-1;
        }
        else{
            month=0;
        }


        let timestamp = new Date(args.year, args.month, _date).getTime();//new Date(2021,4,25)=>1621881000000
        return {
            date: _date,
            day,
            month, 
            timestamp,
            dayString: this.daysMap[day]
        }
        /*
        {
			date:25,
			day:0,
			month:-1,
			timestamp:1621881000000,
			dayString:SUN
        }
        */
    }

    getNumberOfDays =(year, month)=> {//2021,4
        return 40 - new Date(year, month, 40).getDate();//40-9=>31
    }

    getMonthDetails =(year, month)=> {//(2021,4)
    	console.log("Year:",year)
    	console.log("Month:",month)
        let firstDay = (new Date(year, month)).getDay();//6-Sat
        let numberOfDays = this.getNumberOfDays(year, month);//31
        let monthArray = [];
        let rows = 6;
        let currentDay = null;
        let index = 0;//for current iter 
        let cols = 7;//to store day from sun to sat

        for(let row=0; row<rows; row++) {
            for(let col=0; col<cols; col++) { 
                currentDay = this.getDayDetails({
                    index,
                    numberOfDays,
                    firstDay,
                    year,
                    month
                });//index=0,numberOfDays=31,firstDay=6,year=2021,month=4
                monthArray.push(currentDay);
                index++;
            }
        }
        return monthArray;
    }

    isCurrentDay =day=> {
        return day.timestamp === todayTimestamp;
    }

    isSelectedDay =day=> {
        return day.timestamp === this.state.selectedDay;
    }

    getDateFromDateString =dateValue=> {
        let dateData = dateValue.split('-').map(d=>parseInt(d, 10));
        if(dateData.length < 3) 
            return null;

        let year = dateData[0];
        let month = dateData[1];
        let date = dateData[2];
        return {year, month, date};
    }

    getMonthStr =month=> this.monthMap[Math.max(Math.min(11, month), 0)] || 'Month';

    getDateStringFromTimestamp =timestamp=> {
        let dateObject = new Date(timestamp);
        let month = dateObject.getMonth()+1;
        let date = dateObject.getDate();
        return dateObject.getFullYear() + '-' + (month < 10 ? '0'+month : month) + '-' + (date < 10 ? '0'+date : date);
    }

    setDate =dateData=> {
        let selectedDay = new Date(dateData.year, dateData.month-1, dateData.date).getTime();
        this.setState({ selectedDay })
        if(this.props.onChange) {
            this.props.onChange(selectedDay);
        }
    }


    updateDateFromInput =()=> {
        let dateValue = this.props.inputRef.current.value;
        let dateData = this.getDateFromDateString(dateValue);
        if(dateData !== null) { 
            this.setDate(dateData);
            this.setState({ 
                year: dateData.year, 
                month: dateData.month-1, 
                monthDetails: this.getMonthDetails(dateData.year, dateData.month-1)
            })
        }
    }

    setDateToInput =(timestamp)=> {
        let dateString = this.getDateStringFromTimestamp(timestamp);
        console.log("Input ref::",this.props.inputRef.current)
        this.props.inputRef.current.value = dateString;
    }

    onDateClick =day=> {
        this.setState({selectedDay: day.timestamp,showDatePicker:false}, ()=>this.setDateToInput(day.timestamp));
        if(this.props.onChange) {
            this.props.onChange(day.timestamp);
        }
    }

    setYear =offset=> {//-1
        let year = this.state.year + offset;//2021-1=>2020
        let month = this.state.month;//4
        this.setState({ 
            year,
            monthDetails: this.getMonthDetails(year, month)
        })
    }

    setMonth =offset=> {//-1
        let year = this.state.year;//2021
        let month = this.state.month + offset;//4-1=>3
        if(month === -1) {
            month = 11;
            year--;
        } else if(month === 12) {
            month = 0;
            year++;
        }
        this.setState({ 
            year, 
            month,
            monthDetails: this.getMonthDetails(year, month)
        })
    }

    /**
     *  Renderers
     */

    renderCalendar() {
        let days = this.state.monthDetails.map((day, index)=> {
            return (
                <div className={'c-day-container ' + (day.month !== 0 ? ' disabled' : '') + 
                    (this.isCurrentDay(day) ? ' highlight' : '') + (this.isSelectedDay(day) ? ' highlight-green' : '')} key={index}>
                    <div className='cdc-day'>
                        <span onClick={()=>this.onDateClick(day)}>
                            {day.date}
                        </span>
                    </div>
                </div>
            )
        })

        return (
            <div className='c-container'>
                <div className='cc-head'>
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d,i)=><div key={i} className='cch-name'>{d}</div>)}
                </div>
                <div className='cc-body'>
                    {days}
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className='MyDatePicker'>
                <div className='mdp-input'  onClick={()=> this.showDatePicker(true)}>
                    <input type='text' onChange={this.updateDateFromInput} ref={this.props.inputRef} />
                </div>

                {this.state.showDatePicker ? (
                    <div className='mdp-container'>
                        <div className='mdpc-head'>
                            <div className='mdpch-button'>
                                <div className='mdpchb-inner' onClick={()=> this.setYear(-1)}>
                                    <span className='mdpchbi-left-arrows'></span>
                                </div>
                            </div>
                            <div className='mdpch-button'>
                                <div className='mdpchb-inner' onClick={()=> this.setMonth(-1)}>
                                    <span className='mdpchbi-left-arrow'></span>
                                </div>
                            </div>
                            <div className='mdpch-container'>
                                <div className='mdpchc-year'>{this.state.year}</div>
                                <div className='mdpchc-month'>{this.getMonthStr(this.state.month)}</div>
                            </div>
                            <div className='mdpch-button'>
                                <div className='mdpchb-inner' onClick={()=> this.setMonth(1)}>
                                    <span className='mdpchbi-right-arrow'></span>
                                </div>
                            </div>
                            <div className='mdpch-button' onClick={()=> this.setYear(1)}>
                                <div className='mdpchb-inner'>
                                    <span className='mdpchbi-right-arrows'></span>
                                </div>
                            </div>
                        </div>
                        <div className='mdpc-body'>
                            {this.renderCalendar()}
                        </div>
                    </div>
                ) : ''}
            </div>
        )
    }

}