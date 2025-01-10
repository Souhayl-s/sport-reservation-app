import { PiNumberCircleOneFill } from "react-icons/pi";
import { Link } from "react-router-dom";
import "./header.css";

import { ReservationContext } from "../context/reservation-context";
import { initialState } from "../reducers/reservation-reducer";
import { useContext } from "react";


  

const Header = () => {

  // TODO : Vérifier si une réservation est en cours

  const { state : currentState } = useContext(ReservationContext);
  const isReservationStarted = JSON.stringify(initialState) != JSON.stringify(currentState);
  return (
    <header className="homepage-header">
      <Link to="./dsadksjahklsj" className="homepage-link">
        <h1 className="homepage-title">PolyCourt</h1>
      </Link>
      <div className="link-container">
        <Link to="/reservation" className="reservation-link">
          {isReservationStarted && (
            <PiNumberCircleOneFill className="notification" />
          )}
          Réserver
        </Link>
      </div>
    </header>
  );
};

export default Header;
