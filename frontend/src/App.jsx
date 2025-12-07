import "./App.css";
import { EventsProvider } from "./contexts/EventsContext";
import EventManagement from "./pages/EventManagement";

function App() {
  return (
    <>
      <EventsProvider>
        <EventManagement />
      </EventsProvider>
    </>
  );
}

export default App;
