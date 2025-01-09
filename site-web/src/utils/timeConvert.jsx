const dayToDateMap = {
  Lundi: "2024-12-02",
  Mardi: "2024-12-03",
  Mercredi: "2024-12-04",
  Jeudi: "2024-12-05",
  Vendredi: "2024-12-06",
  Samedi: "2024-12-07",
  Dimanche: "2024-12-01",
};

const availableTimes = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
];

// Fonction de conversion de l'heure au format 24 heures
const convertTo24HourFormat = (time) => {
  const [timePart, modifier] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  } else if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
};

const convertToTimestamp = (day, time) => {
  const dateString = dayToDateMap[day];
  if (!dateString) {
    throw new Error("Invalid day selected");
  }

  const time24HourFormat = convertTo24HourFormat(time);
  const dateTimeString = `${dateString}T${time24HourFormat}`;

  const date = new Date(dateTimeString);
  return date.getTime();
};

export { convertToTimestamp, availableTimes };
