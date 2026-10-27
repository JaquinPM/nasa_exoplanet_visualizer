import type { Exoplanet } from "../../model/Exoplanet";
import { ExoplanetCard } from "../Card/ExoplanetCard";
import "./ExoplanetsList.css";

interface Props {
  exoplanets: Exoplanet[];
  error: Error | null;
  loading: boolean;
  onCardClick: (id: number) => void;
}

/**
 * 
 * Component that shows a list of card exoplanets
 * @returns 
 */
export const ExoplanetsList = ({
  exoplanets,
  error,
  loading,
  onCardClick,
}: Props) => {
  return (
    <section className="exoplanets-container">
      {loading && (
        <div className="d-flex align-items-center gap-2 py-3 text-secondary small">
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          />
          <span>Loading exoplanets...</span>
        </div>
      )}

      {error && (
        <div
          className="alert alert-danger bg-transparent border-danger-subtle text-danger small py-2 px-3 mb-0"
          role="alert"
        >
          Exoplanets could not been charged
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-secondary small">
              Results
            </span>

            <span className="badge rounded-pill text-bg-dark border border-secondary-subtle fw-normal">
              {exoplanets.length}
            </span>
          </div>

          <div className="exoplanets-grid d-flex flex-column gap-2">
            {exoplanets.map((planet) => (
              <ExoplanetCard
                key={planet.id}
                exoplanet={planet}
                onCardClick={onCardClick}
              />
            ))}

            {exoplanets.length === 0 && (
              <div className="text-center text-secondary py-4 px-3">
                <div className="fs-4 mb-2">⌕</div>
                <p className="small mb-1">
                  Exoplanets not found
                </p>
                <span className="small opacity-75">
                  Try with another name.
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};
