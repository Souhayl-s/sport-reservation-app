import Plateau from "../components/plateau";
import "./home.css";
import { Link } from "react-router-dom";
import { useReservationSystem } from "../hooks/useReservationSystem";
import images from "../utils/imageSource";

const HomePage = () => {
  const { plateaus } = useReservationSystem();

  return (
    <div className="homepage">
      <h1 className="title">Choisissez un plateau pour commencer!</h1>
      <div className="card-container">
        {plateaus.map((plateau) => {
          return (
            <Link to={`/plateau/${plateau.id}`} key={plateau.id}>
              <Plateau image={images[plateau.id]} title={plateau.name} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
