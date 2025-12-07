import { useState, useEffect, useRef } from "react";
import { useEvents } from "../../contexts/EventsContext";
import styles from "./CreateEvent.module.css";
import DateSelector from "../common/DateSelector/DateSelector";
import ProfileSelector from "../common/ProfileSelector/ProfileSelector";
import TimezoneDropdown from "../common/TimezoneDropdown/TimezoneDropdown";
import Toast from "../common/Toast/Toast";
import ErrorSnackbar from "../common/ErrorSnackbar/ErrorSnackbar";
import { createEvent } from "../../api/eventApi";
import dayjs from "../../utils/setupDayjs";
import {
  toUTC,
  isEndBeforeStart,
  isBeforeToday,
} from "../../utils/timezoneUtils";

function CreateEvent() {
  const { addEvent } = useEvents();

  const [eventName, setEventName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [timezone, setTimezone] = useState(dayjs.tz.guess());
  const [startDate, setStartDate] = useState({
    date: new Date(2025, 9, 15),
    time: "09:00",
  });
  const [endDate, setEndDate] = useState({
    date: null,
    time: "09:00",
  });
  const [showToast, setShowToast] = useState(false);
  const prevTimezoneRef = useRef(timezone);

  const toId = (p) => (typeof p === "string" ? p : p?._id);

  useEffect(() => {
    if (!timezone || timezone === prevTimezoneRef.current) return;

    const sourceTZ = prevTimezoneRef.current || dayjs.tz.guess();

    if (startDate?.date) {
      const startUTC = toUTC(startDate.date, startDate.time, sourceTZ);
      if (startUTC) {
        const inTarget = dayjs(startUTC).tz(timezone);
        setStartDate({
          date: inTarget.toDate(),
          time: inTarget.format("HH:mm"),
        });
      }
    }

    if (endDate?.date) {
      const endUTC = toUTC(endDate.date, endDate.time, sourceTZ);
      if (endUTC) {
        const inTarget = dayjs(endUTC).tz(timezone);
        setEndDate({ date: inTarget.toDate(), time: inTarget.format("HH:mm") });
      }
    }

    prevTimezoneRef.current = timezone;
  }, [
    timezone,
    startDate?.date,
    startDate?.time,
    endDate?.date,
    endDate?.time,
  ]);

  const handleCreateEvent = async () => {
    if (!eventName || !startDate.date || !timezone) {
      setErrorMsg("Please fill all required fields.");
      return;
    }

    if (isBeforeToday(startDate.date)) {
      setErrorMsg("Start date cannot be in the past.");
      return;
    }

    const startUTC = toUTC(startDate.date, startDate.time, timezone);
    const endUTC = endDate.date
      ? toUTC(endDate.date, endDate.time, timezone)
      : null;

    if (endUTC && isEndBeforeStart(startUTC, endUTC)) {
      setErrorMsg("End date/time cannot be before start date/time.");
      return;
    }

    const assignedProfileIds = (selectedProfiles || [])
      .map(toId)
      .filter(Boolean);

    const payload = {
      title: eventName,
      startTimeUTC: startUTC,
      endTimeUTC: endUTC,
      initialTimezone: timezone,
      assignedProfiles: assignedProfileIds,
    };

    try {
      const res = await createEvent(payload);
      const created = res?.data?.data || res?.data || null;

      if (created) {
        addEvent({
          ...created,
          assignedProfiles: Array.isArray(selectedProfiles)
            ? selectedProfiles
            : created.assignedProfiles,
        });
      }

      setShowToast(true);
      setEventName("");
      setSelectedProfiles([]);
      setStartDate({ date: null, time: "09:00" });
      setEndDate({ date: null, time: "09:00" });
    } catch (err) {
      console.error(err);
      setErrorMsg("Event creation failed.");
    }
  };

  return (
    <div className={styles.eventContainer}>
      <h3>Create Event</h3>

      <label htmlFor="eventName" className={styles.eventNameLabel}>
        Event Name
      </label>
      <input
        className={styles.inputElement}
        type="text"
        placeholder="Enter Event Name.."
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
      />

      <label htmlFor="profileSelection" className={styles.eventNameLabel}>
        Profiles
      </label>
      <ProfileSelector
        value={selectedProfiles}
        onChange={setSelectedProfiles}
      />

      <label htmlFor="timezone" className={styles.eventNameLabel}>
        Timezone
      </label>
      <TimezoneDropdown value={timezone} onChange={setTimezone} />

      <DateSelector
        label="Start Date & Time"
        value={startDate}
        onChange={setStartDate}
      />
      <DateSelector
        label="End Date & Time"
        value={endDate}
        onChange={setEndDate}
      />

      <button className={styles.addButton} onClick={handleCreateEvent}>
        + Create Event
      </button>

      {showToast && (
        <Toast
          message="Event created successfully!"
          onClose={() => setShowToast(false)}
        />
      )}
      {errorMsg && (
        <ErrorSnackbar message={errorMsg} onClose={() => setErrorMsg("")} />
      )}
    </div>
  );
}

export default CreateEvent;
