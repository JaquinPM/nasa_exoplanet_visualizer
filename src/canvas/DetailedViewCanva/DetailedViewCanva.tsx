import { OrbitControls } from "@react-three/drei";
import { PlanetarySystem } from "../PlanetarySystem/PlanetarySystem";
import type { ExoplanetarySystem } from "../../model/ExoplanetarySystem";

interface Props {
  planetarySystem: ExoplanetarySystem
  selectedExoplanetId: number
}

export const DetailedViewCanva = ({ planetarySystem, selectedExoplanetId }: Props) => {
  return (
    <>

      {/* Camera controlos */}
      <OrbitControls
        makeDefault
        enablePan={true}
        enableZoom={true}
        minDistance={2}
        maxDistance={10000}
        dampingFactor={0.05}
        enableDamping={true}
      />

      <PlanetarySystem
        planetarySystem={planetarySystem}
        selectedExoplanetId={selectedExoplanetId}
      />
    </>
  );
};
