import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

interface CalendarProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

const Calendar = ({ selectedDate, onChange }: CalendarProps) => {
  return (
    <DatePicker
      className="widget-datepicker"
      selected={selectedDate}
      onChange={(date: Date | null) => date && onChange(date)}
    />
  );
};

export default Calendar;
