import { OrbitControls } from "@react-three/drei";
import { PlanetarySystem } from "../PlanetarySystem/PlanetarySystem";
import type { ExoplanetarySystem } from "../../model/ExoplanetarySystem";
import { Bloom, EffectComposer } from "@react-three/postprocessing";


interface Props {
  planetarySystem: ExoplanetarySystem
  selectedExoplanetId: number
}


export const DetailedViewCanva = ({ planetarySystem, selectedExoplanetId }: Props) => {
  return (
    <>

      <OrbitControls
        makeDefault
        enablePan={true}
        enableZoom={true}
        minDistance={2}
        maxDistance={500}
        dampingFactor={0.05} // Movimiento suave de la cámara
        enableDamping={true}
      />

      <PlanetarySystem
        planetarySystem={planetarySystem}
        selectedExoplanetId={selectedExoplanetId}
      />
    </>
  );
};
