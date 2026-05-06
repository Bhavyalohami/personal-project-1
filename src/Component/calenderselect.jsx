import * as React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';


const CalendarSelect = () => {
    return (
        <div className=" ">
        <CalendarContainer>
            <Calendar/>
        </CalendarContainer> 
      </div>
    );
}     

export default CalendarSelect;
const CalendarContainer = styled.div`
  max-width: 500px;
  width:300px;
  margin-top:-27px;
  opacity:55%;
  color:#000000;
  padding:30px;
  
  `;
