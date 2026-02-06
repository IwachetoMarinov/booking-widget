import React from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

interface CalendarProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

const Calendar = ({ selectedDate, onChange }: CalendarProps) => {
  const minDate = new Date();

  // Add only up to 8 days to the current date
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 8);

  return (
    <div>
      <p>Selecciona una fecha</p>
      <DatePicker
        minDate={minDate}
        maxDate={maxDate}
        selected={selectedDate}
        className="widget-datepicker"
        onChange={(date: Date | null) => date && onChange(date)}
      />
    </div>
  );
};

export default Calendar;
