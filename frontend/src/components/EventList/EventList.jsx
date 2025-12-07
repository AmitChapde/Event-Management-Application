import { useMemo, useState } from "react";
import { useEvents } from "../../contexts/EventsContext";
import styles from "./EventList.module.css";
import EventCard from "../EventCard/EventCard";
import TimezoneDropdown from "../common/TimezoneDropdown/TimezoneDropdown";
import dayjs from "../../utils/setupDayjs";
import EditEventModal from "../EditEventModal/EditEventModal";
import ViewLogsModal from "../ViewLogsModal/ViewLogsModal";

function EventList({ updatedBy }) {
  const { events, loading, errorMsg } = useEvents();
  const [timezone, setTimezone] = useState(dayjs.tz.guess());
  const [selectedEventForEdit, setSelectedEventForEdit] = useState(null);
  const [selectedEventForLogs, setSelectedEventForLogs] = useState(null);

  const toId = (p) => (typeof p === "string" ? p : p?._id);

  const filteredEvents = useMemo(() => {
    if (!updatedBy) return [];
    return events.filter((event) => {
      const assignedIds = (event?.assignedProfiles || [])
        .map(toId)
        .filter(Boolean);
      return assignedIds.includes(updatedBy);
    });
  }, [events, updatedBy]);

  const isEmpty = !loading && !errorMsg && filteredEvents.length === 0;
  const noUserSelected = !updatedBy;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Events</h3>

      <div className={styles.toolbar}>
        <div className={styles.tzLabel}>View in Timezone</div>
        <TimezoneDropdown value={timezone} onChange={setTimezone} />
      </div>

      <div className={styles.list}>
        {loading && <div className={styles.placeholder}>Loading events...</div>}

        {!loading && errorMsg && (
          <div className={styles.errorMsg}>{errorMsg}</div>
        )}

        {!loading && noUserSelected && (
          <div className={styles.placeholder}>
            Please select a profile above to view your events.
          </div>
        )}

        {!loading && !errorMsg && !noUserSelected && isEmpty && (
          <div className={styles.placeholder}>
            No events found for the selected profile.
          </div>
        )}

        {!loading &&
          !errorMsg &&
          !noUserSelected &&
          filteredEvents.map((evt) => (
            <div key={evt._id}>
              <EventCard
                event={evt}
                timezone={timezone}
                onEdit={() => setSelectedEventForEdit(evt)}
                onViewLogs={(e) => setSelectedEventForLogs(e)}
              />
            </div>
          ))}
      </div>

      {selectedEventForEdit && (
        <EditEventModal
          event={selectedEventForEdit}
          updatedBy={updatedBy}
          onClose={() => setSelectedEventForEdit(null)}
        />
      )}

      {selectedEventForLogs && (
        <ViewLogsModal
          event={selectedEventForLogs}
          onClose={() => setSelectedEventForLogs(null)}
        />
      )}
    </div>
  );
}

export default EventList;
