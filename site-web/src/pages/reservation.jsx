import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useReservationSystem } from "../hooks/useReservationSystem";
import { ReservationContext } from "../context/reservation-context";
import { availableTimes } from "../utils/timeConvert";
import {
  RESET_RESERVATION,
  UPDATE_RESERVATION,
} from "../reducers/reservation-reducer";
import { days } from "../utils/constants";
import { convertToTimestamp } from "../utils/timeConvert";
import "./reservation.css";

function ReservationPage() {
  const { selectedPlateau } = useParams();
  const { plateaus, items, error, createReservation } = useReservationSystem();
  const { state, dispatch } = useContext(ReservationContext);
  const [name, setName] = useState(state.currentReservation.name);
  const [plateau, setPlateau] = useState(
    selectedPlateau || state.currentReservation.plateau
  );
  const [equipment, setEquipment] = useState(
    state.currentReservation.equipment
  );
  const [day, setDay] = useState(state.currentReservation.day);
  const [startTime, setStartTime] = useState(
    state.currentReservation.startTime
  );
  const [endTime, setEndTime] = useState(state.currentReservation.endTime);
  const [errorMessage, setErrorMessage] = useState("");

  const getAllowedEquipment = () => {
    return items.filter((item) =>
      plateaus.find((p) => p.id === plateau)?.allowedItems.includes(item.id)
    );
  };

  // TODO: Gérer le changement de nom et mettre à jour l'état de la réservation en cours
  const handleNameChange = (event) => {
    const newName = event.target.value;
    setName(newName);
    dispatch({
      type: UPDATE_RESERVATION,
      payload: { ...state.currentReservation, name: newName },
    });
  };

  // TODO: Gérer le changement de plateau et mettre à jour l'état de la réservation en cours
  const handlePlateauChange = (event) => {
    const newPlateau = event.target.value;
    setPlateau(newPlateau);
    dispatch({
      type: UPDATE_RESERVATION,
      payload: { ...state.currentReservation, plateau: newPlateau },
    });
  };

  // TODO : Mettre à jour l'état de la réservation en cours lors du changement de l'équipement
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const newEquipment = checked
      ? [...equipment, value]
      : equipment.filter((item) => item !== value);
    setEquipment(newEquipment);
    dispatch({
      type: UPDATE_RESERVATION,
      payload: { ...state.currentReservation, equipment: newEquipment },
    });
  };

  // TODO : Gérer le changement du jour et mettre à jour l'état de la réservation en cours
  const handleDayChange = (event) => {
    const newDay = event.target.value;
    setDay(newDay);
    dispatch({
      type: UPDATE_RESERVATION,
      payload: { ...state.currentReservation, day: newDay },
    });
  };

  // TODO : Gérer le changement de l'heure de début et mettre à jour l'état de la réservation en cours
  const handleStartTimeChange = (event) => {
    const newTime = event.target.value;
    setStartTime(newTime);
    dispatch({
      type: UPDATE_RESERVATION,
      payload: { ...state.currentReservation, startTime: newTime },
    });
  };

  const handleEndTimeChange = (event) => {
    const newTime = event.target.value;
    setEndTime(newTime);
    dispatch({
      type: UPDATE_RESERVATION,
      payload: { name, plateau, equipment, day, startTime, endTime: newTime },
    });
  };

  /**
   * TODO : Vérifier l'état du formulaire et envoyer une requête de réservation si tout est valide
   */
  const handleReservation = async () => {
    // TODO : Vérifier que tous les champs sont remplis et afficher un message d'erreur si ce n'est pas le cas

    if (
      Object.values(state.currentReservation).some(
        (value) => value.length === 0
      )
    ) {
      setErrorMessage("Veuillez remplir tous les champs");
      return;
    }

    const startDateTime = convertToTimestamp(day, startTime);
    const endDateTime = convertToTimestamp(day, endTime);

    // TODO : Vérifier que l'heure de fin est après l'heure de début et afficher un message d'erreur si ce n'est pas le cas
    if (startDateTime >= endDateTime) {
      setErrorMessage("L'heure de fin doit etre apres l'heure de debut !");
      return;
    }

    try {
      await createReservation({
        clientName: name,
        plateauId: plateau,
        itemIds: equipment,
        startTime: startDateTime,
        endTime: endDateTime,
      });
      alert(`Réservation effectuée avec succès!`);
      setErrorMessage("");
      handleReset();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  /**
   * TODO : Réinitialiser le formulaire et l'état de la réservation en cours
   */
  const handleReset = () => {
    setName("");
    setPlateau("");
    setEquipment([]);
    setDay("");
    setStartTime("");
    setEndTime("");
    setErrorMessage("");
    // TODO : Réinitialiser l'état de la réservation en cours
    dispatch({ type: RESET_RESERVATION });
  };

  if (error) return <div>Error: Hello</div>;

  return (
    <div className="reservation-container">
      <div className="reservation-form">
        <h2>Réserver un plateau</h2>
        <div className="flex-container">
          <div className="form-field">
            <label htmlFor="name">Votre nom</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              placeholder="Entrez votre nom"
            />
          </div>
          <div className="form-field">
            <label htmlFor="plateau">Plateau</label>
            <select id="plateau" value={plateau} onChange={handlePlateauChange}>
              <option value="">Sélectionner un plateau</option>
              {plateaus.map((plateau) => (
                <option key={plateau.id} value={plateau.id}>
                  {plateau.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="day">Jour</label>
            <select id="day" value={day} onChange={handleDayChange}>
              <option value="">Sélectionnez un jour</option>
              {days.map((d) => (
                <option key={d} value={d}>
                  {" "}
                  {d}{" "}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-container">
          <div className="form-field">
            <label htmlFor="time">Heure de début</label>
            <select
              id="time"
              value={startTime}
              onChange={handleStartTimeChange}
            >
              <option value="">Sélectionnez une heure de début</option>
              {availableTimes.map((t) => (
                <option key={t} value={t}>
                  {" "}
                  {t}{" "}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="time">Heure de fin</label>
            <select id="time" value={endTime} onChange={handleEndTimeChange}>
              <option value="">Sélectionnez une heure de fin</option>
              {availableTimes.map((t) => (
                <option key={t} value={t}>
                  {" "}
                  {t}{" "}
                </option>
              ))}
            </select>
          </div>
        </div>

        {getAllowedEquipment()?.length > 0 && (
          <div className="form-field">
            <label htmlFor="equipment">Équipement</label>
            <div className="checkbox-group">
              {getAllowedEquipment()?.map((item) => (
                <label key={item.id} className="checkbox-label">
                  <input
                    className="checkbox"
                    type="checkbox"
                    value={item.id}
                    checked={equipment.includes(item.id)}
                    onChange={handleCheckboxChange}
                  />
                  {item.name}
                </label>
              ))}
            </div>
          </div>
        )}

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="action-buttons">
          <button className="reserve-btn" onClick={handleReservation}>
            {" "}
            Réserver{" "}
          </button>
          <button className="reset-btn" onClick={handleReset}>
            {" "}
            Réinitialiser{" "}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReservationPage;
