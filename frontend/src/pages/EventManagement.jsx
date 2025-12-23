import React, { useState } from "react";
import styles from "./EventManagement.module.css";
import CreateEvent from "../components/CreateEvent/CreateEvent";
import EventList from "../components/EventList/EventList";
import CurrentProfileFilter from "../components/common/CurrentProfileFilter/CurrentProfileFilter";

function EventManagement() {
  const [updatedBy, setUpdatedBy] = useState(null);

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.mainTitle}>ZoneSync</h1>
            <p className={styles.subTitle}>
              Create and manage events across multiple timezones
            </p>
          </div>

          <div className={styles.headerRight}>
            <CurrentProfileFilter onSelect={(id) => setUpdatedBy(id)} />
          </div>
        </div>

        <div className={styles.eventManagementContainer}>
          <div className={styles.leftPanel}>
            <CreateEvent />
          </div>

          <div className={styles.rightPanel}>
            <EventList updatedBy={updatedBy} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventManagement;
