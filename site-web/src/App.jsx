import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import PlateauPage from "./pages/plateau";
import ReservationPage from "./pages/reservation";
import { ReservationProvider } from "./context/reservation-context";
import Header from "./components/header";

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ReservationProvider>
        <Header/>
        <Routes basename="/sport-reservation-app">
          <Route path="/sport-reservation-app" element={<HomePage />} />
          <Route path="/plateau/:plateauId" element={<PlateauPage />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route
            path="./reservation/:selectedPlateau"
            element={<ReservationPage />}
          />
        </Routes>
      </ReservationProvider>
    </Router >
  );
}

export default App;
