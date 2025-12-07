import { useEffect, useMemo, useRef, useState } from "react";
import { useEvents } from "../../contexts/EventsContext";
import styles from "./EditEventModal.module.css";
import DateSelector from "../common/DateSelector/DateSelector";
import ProfileSelector from "../common/ProfileSelector/ProfileSelector";
import TimezoneDropdown from "../common/TimezoneDropdown/TimezoneDropdown";
import Toast from "../common/Toast/Toast";
import ErrorSnackbar from "../common/ErrorSnackbar/ErrorSnackbar";
import { updateEvent } from "../../api/eventApi";
import dayjs from "../../utils/setupDayjs";
import {
  toUTC,
  isEndBeforeStart,
  isBeforeToday,
} from "../../utils/timezoneUtils";

const toId = (p) => (typeof p === "string" ? p : p?._id || p?.id);

function normalizeProfiles(list) {
  if (!Array.isArray(list)) return [];
  return list.map((p) =>
    typeof p === "string" ? { _id: p, name: p } : { ...p, _id: p._id || p.id }
  );
}

export default function EditEventModal({ event, updatedBy, onClose }) {
  const { updateEventInState } = useEvents();

  const [eventName, setEventName] = useState("");
  const [timezone, setTimezone] = useState(dayjs.tz.guess());
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [startDate, setStartDate] = useState({ date: null, time: "09:00" });
  const [endDate, setEndDate] = useState({ date: null, time: "09:00" });
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const prevTimezoneRef = useRef(timezone);

  useEffect(() => {
    if (!event) return;

    const initialTZ = event.initialTimezone || dayjs.tz.guess();
    const startInTZ = event.startTimeUTC
      ? dayjs.utc(event.startTimeUTC).tz(initialTZ)
      : null;
    const endInTZ = event.endTimeUTC
      ? dayjs.utc(event.endTimeUTC).tz(initialTZ)
      : null;

    setEventName(event.title || "");
    setTimezone(initialTZ);
    setSelectedProfiles(normalizeProfiles(event.assignedProfiles));
    setStartDate({
      date: startInTZ ? startInTZ.toDate() : null,
      time: startInTZ ? startInTZ.format("HH:mm") : "09:00",
    });
    setEndDate({
      date: endInTZ ? endInTZ.toDate() : null,
      time: endInTZ ? endInTZ.format("HH:mm") : "09:00",
    });

    prevTimezoneRef.current = initialTZ;
    setErrorMsg("");
  }, [event]);

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

  const currentEventAssignedIds = useMemo(
    () => (event?.assignedProfiles || []).map(toId).filter(Boolean),
    [event]
  );
  const isAuthorized = updatedBy && currentEventAssignedIds.includes(updatedBy);

  const handleUpdateEvent = async () => {
    if (!isAuthorized) {
      setErrorMsg("You are not allowed to update this event.");
      return;
    }
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

    const selectedProfileIds = (selectedProfiles || [])
      .map(toId)
      .filter(Boolean);

    const payload = {
      updatedBy,
      title: eventName,
      startTimeUTC: startUTC,
      endTimeUTC: endUTC,
      initialTimezone: timezone,
      assignedProfiles: selectedProfileIds,
    };

    const optimistic = {
      ...event,
      title: eventName,
      startTimeUTC: startUTC,
      endTimeUTC: endUTC,
      initialTimezone: timezone,
      assignedProfiles: selectedProfiles,
    };

    try {
      setSaving(true);
      updateEventInState(optimistic);

      const res = await updateEvent(event._id, payload);
      const server = res?.data?.data || res?.data || null;

      if (server) {
        updateEventInState({
          ...server,
          assignedProfiles:
            Array.isArray(selectedProfiles) && selectedProfiles.length
              ? selectedProfiles
              : normalizeProfiles(server.assignedProfiles),
        });
      }

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        onClose();
      }, 400);
    } catch (err) {
      console.error(err);
      setErrorMsg("Event update failed.");
      updateEventInState(event);
    } finally {
      setSaving(false);
    }
  };

  if (!event) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h4 className={styles.title}>Edit Event</h4>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {!isAuthorized && (
          <div className={styles.warning}>
            You are not part of this event's assigned profiles. Updates are not
            allowed.
          </div>
        )}

        <div className={styles.form}>
          <div className={styles.formRow}>
            <label className={styles.label}>Profiles</label>
            <ProfileSelector
              value={selectedProfiles}
              onChange={setSelectedProfiles}
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>Timezone</label>
            <TimezoneDropdown value={timezone} onChange={setTimezone} />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>Event Name</label>
            <input
              className={styles.inputElement}
              type="text"
              placeholder="Enter Event Name.."
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>

          <div className={styles.formRow}>
            <DateSelector
              label="Start Date & Time"
              value={startDate}
              onChange={setStartDate}
            />
          </div>

          <div className={styles.formRow}>
            <DateSelector
              label="End Date & Time"
              value={endDate}
              onChange={setEndDate}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.btn} onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            className={styles.btnPrimary}
            onClick={handleUpdateEvent}
            disabled={saving || !isAuthorized}
          >
            {saving ? "Updating..." : "Update Event"}
          </button>
        </div>

        {showToast && (
          <Toast
            message="Event updated successfully!"
            onClose={() => setShowToast(false)}
          />
        )}
        {errorMsg && (
          <ErrorSnackbar message={errorMsg} onClose={() => setErrorMsg("")} />
        )}
      </div>
    </div>
  );
}
