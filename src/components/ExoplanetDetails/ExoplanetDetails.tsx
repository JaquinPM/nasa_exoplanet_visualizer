import type { Exoplanet } from "../../model/Exoplanet";
import "./ExoplanetDetails.css";

interface Props {
  exoplanet: Exoplanet;
  onClose?: () => void;
}

/**
 * Detailed exoplanet info to be shown when a card is selected
 */
export const ExoplanetDetails = ({ exoplanet, onClose }: Props) => {
  const formatValue = (value: number | string | null) => {
    if (value === null || value === "") return "—";

    if (typeof value === "number") {
      return Number.isFinite(value)
        ? value.toLocaleString("en-US", {
          maximumFractionDigits: 6,
        })
        : "—";
    }

    return value;
  };

  const sections = [
    {
      title: "Physical properties",
      icon: "bi-globe",
      properties: [
        { label: "Radius", value: exoplanet.radius },
        { label: "Mass", value: exoplanet.mass },
      ],
    },
    {
      title: "Orbital parameters",
      icon: "bi-arrow-repeat",
      properties: [
        {
          label: "Semi-major axis",
          value: exoplanet.semiMajorAxis,
        },
        {
          label: "Orbital period",
          value: exoplanet.orbitPeriod,
        },
        {
          label: "Eccentricity",
          value: exoplanet.orbitEccentricity,
        },
        {
          label: "Inclination",
          value: exoplanet.orbitInclination,
        },
        {
          label: "Periastron epoch",
          value: exoplanet.periastronEpoch,
        },
        {
          label: "Periastron angle",
          value: exoplanet.periastronAngle,
        },
      ],
    },
    {
      title: "Discovery information",
      icon: "bi-telescope",
      properties: [
        {
          label: "Discovery method",
          value: exoplanet.discoveryMethod,
        },
        {
          label: "Discovery year",
          value: exoplanet.discoveryYear,
        },
        {
          label: "Telescope",
          value: exoplanet.discTelescope,
        },
        {
          label: "Instrument",
          value: exoplanet.discInstrument,
        },
      ],
    }
  ];

  return (
    <aside className="exoplanet-details">
      <header className="exoplanet-details-header">
        <div className="min-w-0">
          <h2 className="exoplanet-title text-truncate">
            {exoplanet.name}
          </h2>

        </div>

        {onClose && (
          <button
            type="button"
            className="btn btn-sm exoplanet-close"
            onClick={onClose}
            aria-label="Close details"
          >
            ×
          </button>
        )}
      </header>

      <div className="exoplanet-details-body">
        {sections.map((section) => (
          <section
            key={section.title}
            className="exoplanet-section"
          >
            <h3 className="exoplanet-section-title">
              <i
                className={`bi ${section.icon}`}
                aria-hidden="true"
              />
              {section.title}
            </h3>

            <div className="row g-2">
              {section.properties.map((property) => (
                <div
                  className="col-12 col-md-6"
                  key={property.label}
                >
                  <div className="exoplanet-property">
                    <div className="exoplanet-property-label">
                      {property.label}
                    </div>

                    <div
                      className="exoplanet-property-value"
                      title={String(
                        property.value ?? "Not available"
                      )}
                    >
                      {formatValue(property.value)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="exoplanet-details-footer">
        <span>EXOPLANET</span>
        <span>#{exoplanet.id}</span>
      </footer>
    </aside>
  );
};
