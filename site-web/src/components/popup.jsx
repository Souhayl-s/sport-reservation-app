import { useReservationSystem } from "../hooks/useReservationSystem";
import "./popup.css";

/**
 * @param {string} reservationId : identifiant de la réservation à annuler
 * @param {HTMLElement} content : contenu du popup sous forme de contenu HTML arbitraire
 * @param {Function} handleClose : fonction à appeler pour fermer le popup 
 * @returns {JSX.Element} : Popup pour annuler une réservation
 */
const Popup = ({ reservationId, content, handleClose }) => {
  const { error ,cancelReservation } = useReservationSystem();

  // Recharger la page après une annulation réussie.
  const handleCancel = async () => {
    await cancelReservation(reservationId);
    if(error === null){
      alert("Réservation annulée avec succès");
      window.location.reload();
      return;
    }
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="title-container">
          <h2>Réservation</h2>
          <button className="close-btn" onClick={handleClose}> &times; </button>
        </div>
        <h3>{content}</h3>
        <button className="cancel-btn" onClick={handleCancel}> Annuler</button>
      </div>
    </div>
  );
};

export default Popup;
