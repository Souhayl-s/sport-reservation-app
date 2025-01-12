// reservation-reducer.js
export const initialState = {
  currentReservation: {
    name: "",
    plateau: "",
    equipment: [],
    day: "",
    startTime: "",
    endTime: "",
  },
};

export const UPDATE_RESERVATION = "UPDATE_RESERVATION";
export const RESET_RESERVATION = "RESET_RESERVATION";

export const reservationReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_RESERVATION:
      return {currentReservation : {...action.payload} };
    case RESET_RESERVATION:
      return initialState;
    default:
      return state;
  }
};
