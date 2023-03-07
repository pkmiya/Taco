import React from 'react'
import Header from '../../modules/Header';
import Calendar from '../../modules/Calendar';
import Footer from '../../modules/Footer';
import SubHeader from '../../modules/Subheader';

function SelectCalendar() {
  return (
    <div>
        <Header />
        <SubHeader pageName="Calendar"/>
        <Calendar />
        <Footer label="calendar" />
    </div>
  )
}

export default SelectCalendar