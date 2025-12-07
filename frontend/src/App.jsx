import "./App.css";
import { EventsProvider } from "./contexts/EventsContext";
import EventManagement from "./pages/EventManagement";
import { ProfilesProvider } from "./contexts/ProfilesContext";

function App() {
  return (
    <>
      <EventsProvider>
        <ProfilesProvider>
          <EventManagement />
        </ProfilesProvider>
      </EventsProvider>
    </>
  );
}

export default App;
