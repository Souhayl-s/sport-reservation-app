import { createContext, useReducer } from "react";
import {
  initialState,
  reservationReducer,
} from "../reducers/reservation-reducer";

export const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reservationReducer, initialState);

  return (
    <ReservationContext.Provider value={{ state, dispatch }}>
      {children}
    </ReservationContext.Provider>
  );
};
