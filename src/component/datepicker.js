import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'


export default function App () {
    const [selectedDate, setSelectedDate] = useState(new Date())

    return (
        <div>
            <DatePicker
                selected = {selectedDate}
                onChange = {date => setSelectedDate(date)}
                dateFormat = 'dd/MM/yyyy'
            />
        </div>
    )
}