import type { Exoplanet } from "../../model/Exoplanet";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

interface Props {
  exoplanet: Exoplanet;
  onCardClick: (id: number) => void;
}

/**
 * Exoplanet card to show its information on the navigator list of exoplanets
 * @returns 
 */
export const ExoplanetCard = ({ exoplanet, onCardClick }: Props) => {
  const handleCardClick = () => {
    onCardClick(exoplanet.id);
  };

  return (
    <article className="h-100">
      <Card className="exoplanet-card h-100 mt-3 shadow-lg bg-dark bg-opacity-75 text-white border border-light border-opacity-10 rounded-4 overflow-hidden">
        <Card.Body className="d-flex flex-column p-4">
          <Card.Title className="fw-bold text-primary mb-3">
            {exoplanet.name}
          </Card.Title>

          <ListGroup variant="flush" className="specs-list mb-4 flex-grow-1 bg-transparent">
            <ListGroup.Item className="px-0 py-2 bg-transparent text-white border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
              <span className="text-light text-opacity-75 small fw-medium">Radius</span>
              <span className="fw-semibold">{exoplanet.radius} Earth radius</span>
            </ListGroup.Item>
            <ListGroup.Item className="px-0 py-2 bg-transparent text-white border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
              <span className="text-light text-opacity-75 small fw-medium">Mass</span>
              <span className="fw-semibold">{exoplanet.mass} Earth mass</span>
            </ListGroup.Item>
            <ListGroup.Item className="px-0 py-2 bg-transparent text-white border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
              <span className="text-light text-opacity-75 small fw-medium">Orbit period</span>
              <span className="fw-semibold">{exoplanet.orbitPeriod} Days</span>
            </ListGroup.Item>
            <ListGroup.Item className="px-0 py-2 bg-transparent text-white border-0 d-flex justify-content-between align-items-center">
              <span className="text-light text-opacity-75 small fw-medium">Eccentricity</span>
              <span className="fw-semibold">{exoplanet.orbitEccentricity}</span>
            </ListGroup.Item>
          </ListGroup>

          <button
            className="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow"
            onClick={handleCardClick}
          >
            View details
          </button>
        </Card.Body>
      </Card>
    </article>
  );
};
