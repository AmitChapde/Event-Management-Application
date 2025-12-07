import React, { useState } from "react";
import styles from "./DateSelector.module.css";
import Calendar from "../Calendar/Calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

function DateSelector({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(value?.date || new Date());

  const selectedDate = value?.date || null;
  const selectedTime = value?.time || "09:00";

  const displayDate = selectedDate
    ? format(selectedDate, "MMMM dd'th', yyyy")
    : "Pick a date";

  const handleDateSelect = (newDate) => {
    onChange({ date: newDate, time: selectedTime });
  };

  const handleTimeChange = (e) => {
    onChange({ date: selectedDate, time: e.target.value });
  };

  const toggleCalendar = () => {
    setOpen((prev) => !prev);
    if (!open) setCurrentDate(selectedDate || new Date());
  };

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}

      <div className={styles.wrapper}>
        <div className={styles.dateInputWrapper}>
          <button
            onClick={toggleCalendar}
            type="button"
            className={styles.dateDisplayButton}
          >
            <span className={styles.calendarIcon}>
              <CalendarIcon />
            </span>
            {displayDate}
          </button>

          {open && (
            <Calendar
              selectedDate={selectedDate}
              setSelectedDate={handleDateSelect}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              setOpen={setOpen}
            />
          )}
        </div>

        <div className={styles.timeInputWrapper}>
          <input
            className={styles.timeInput}
            type="time"
            value={selectedTime}
            onChange={handleTimeChange}
          />
        </div>
      </div>
    </div>
  );
}

export default DateSelector;
