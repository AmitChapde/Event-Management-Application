import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getAllEvents } from "../api/eventApi";

const EventsContext = createContext(null);

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await getAllEvents();
      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
        ? res.data
        : [];
      setEvents(list);
    } catch (err) {
      console.error("Failed to load events", err);
      setErrorMsg("Failed to load events.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const addEvent = useCallback((evt) => {
    if (!evt) return;
    setEvents((prev) => {
      const exists = prev.some((e) => e._id === evt._id);
      if (exists) {
        return prev.map((e) => (e._id === evt._id ? evt : e));
      }
      return [evt, ...prev];
    });
  }, []);

  const updateEventInState = useCallback((evt) => {
    if (!evt) return;
    setEvents((prev) => prev.map((e) => (e._id === evt._id ? evt : e)));
  }, []);

  return (
    <EventsContext.Provider
      value={{
        events,
        loading,
        errorMsg,
        fetchEvents,
        addEvent,
        updateEventInState,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) {
    throw new Error("useEvents should be used in EventsProvider");
  }
  return ctx;
}
