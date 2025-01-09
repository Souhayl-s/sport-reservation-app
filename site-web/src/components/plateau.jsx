import "./plateau.css";

/**
 * TODO : Afficher l'image et le titre du plateau
 * @param {string} image : lien vers l'image du plateau
 * @param {string} title : titre du plateau 
 * @returns {JSX.Element} : vignette d'un plateau
 */
function Plateau({ image, title }) {
  return (
    <div className="card">
      <img src={image} alt={title} className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
      </div>
    </div>
  );
}

export default Plateau;
