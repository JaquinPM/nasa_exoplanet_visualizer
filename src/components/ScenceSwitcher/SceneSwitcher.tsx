import { DetailedViewCanva } from "../../canvas/DetailedViewCanva/DetailedViewCanva";
import { GlobalViewCanva } from "../../canvas/GlobalViewCanva/GlobalViewCanva";
import { useFetch } from "../../hooks";
import type { Exoplanet } from "../../model/Exoplanet";
import type { ExoplanetarySystem } from "../../model/ExoplanetarySystem";

interface Props {
  selectedExoplanet: Exoplanet | null;
  currentView: "global" | "detail";
  selectedSystemId: number;
  isTransitioning: boolean;
  onTransitionComplete: () => void;
}

/**
 * Component that switches betwen detailed systen scene and global scene
 * @returns 
 */
export const SceneSwitcher = ({
  selectedExoplanet,
  currentView,
  selectedSystemId,
  isTransitioning,
  onTransitionComplete,
}: Props) => {
  const selectedExoplanetId = !selectedExoplanet ? -1 : selectedExoplanet.id;
  switch (currentView) {
    case "global":
      return (
        <GlobalViewCanva
          selectedSystemId={selectedSystemId}
          isTransitioning={isTransitioning}
          onTransitionComplete={onTransitionComplete}
        />
      );

    case "detail":
      return (
        <DetailedSystemLoader
          systemId={selectedSystemId}
          selectedExoplanetId={selectedExoplanetId}
        />
      );

    default:
      return (
        <GlobalViewCanva
          selectedSystemId={selectedSystemId}
          isTransitioning={isTransitioning}
          onTransitionComplete={onTransitionComplete}
        />
      );
  }
};

const DetailedSystemLoader = ({
  systemId,
  selectedExoplanetId,
}: {
  systemId: number | null;
  selectedExoplanetId: number;
}) => {
  const validId = systemId ?? -1;
  const url = `http://localhost:8080/api/system/${validId}`;

  const initialValue: ExoplanetarySystem = {
    id: validId,
    name: "",
    numberMoons: 0,
    star: { id: 0, x: 0, y: 0, z: 0, mass: 0, radius: 0 },
    exoplanets: [],
  };

  const { data } = useFetch<ExoplanetarySystem>(url, initialValue);

  return (
    <DetailedViewCanva
      planetarySystem={data}
      selectedExoplanetId={selectedExoplanetId}
    />
  );
};
