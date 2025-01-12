import { useEffect } from "react";
import { useReservationSystem } from "../hooks/useReservationSystem";
import { days, times } from "../utils/constants";
import { convertToTimestamp } from "../utils/timeConvert";
import "./calendar.css";

/**
 * @param {Function} togglePopup - fonction pour ouvrir la popup
 * @param {String} plateauName - nom du plateau
 * @returns {JSX.Element} Composant de calendrier
 */
const Calendar = ({ togglePopup, plateauName}) => {
  const { reservations, error } = useReservationSystem();

  const isReserved = (day, time) => {
    const currentTime = convertToTimestamp(day, time);
    return reservations.some(
      (r) =>
        isTimeIncluded(
          new Date(r.startTime),
          new Date(r.endTime),
          currentTime
        ) && r.plateauName === plateauName
    );
  };

  const isTimeIncluded = (startTime, endTime, time) => {
    return time >= startTime && time < endTime;
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div id="calendar">
      <table>
        <thead>
          <tr>
            <th>Temps</th>
            {days.map(day => <th key={day} >{day}</th>)}
          </tr>
        </thead>
        <tbody id="calendar-body">
          {times.map((time) => (
            <tr key={time}>
              <td>{time}</td>
              {days.map((day) => (
                <td
                  key={`${day}-${time}`}
                  className={isReserved(day, time) ? "reserved" : "available"}
                  onClick={() => {
                    if (isReserved(day, time)) {
                      const reservation = reservations.find((r) =>
                        isTimeIncluded(
                          new Date(r.startTime),
                          new Date(r.endTime),
                          convertToTimestamp(day, time)
                        )
                      );
                      togglePopup(reservation);
                    }
                  }}
                >
                  {isReserved(day,time) ? "Reservé" : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;