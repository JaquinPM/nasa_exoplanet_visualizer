
import { useFrame, useThree } from "@react-three/fiber";
import { useFetch } from "../../hooks";
import type { ExoplanetarySystemSimp } from "../../model/ExoplanetarySystem";
import { PlanetarySystemSimp } from "../PlanetarySystemSimp/PlanetarySystemSimp";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const url = "http://localhost:8080/api/system";

interface Props {
  // Used to decide to which system the camera should move if the aninmation starts
  selectedSystemId: number;
  // Used to decide if the animation towards a system is being reproduced ot not
  isTransitioning: boolean;
  //Function to ber executed whern the animation is finished
  onTransitionComplete: () => void;
}

/**
 *  Three.js component used to load the systems and show them in canvas 
 */
export const GlobalViewCanva = ({
  selectedSystemId,
  isTransitioning,
  onTransitionComplete,
}: Props) => {
  // List of the systems
  const systems = useFetch<ExoplanetarySystemSimp[]>(url, []);

  // Load camera and control
  const { camera, controls } = useThree();

  // Variable to contolos whether the camera reached the final position or not while it si tranisitioning
  const completedRef = useRef(false);

  // The system to be followed the camera is treansitionign
  const targetSystem = systems.data.find(
    (system) => system.id === selectedSystemId
  );

  // Position of the system used to be followed when transitioningf to details
  const targetPosition = targetSystem
    ? new THREE.Vector3(
      targetSystem.star.x ?? 0,
      targetSystem.star.y ?? 0,
      targetSystem.star.z ?? 0
    )
    : null;


  /**
   * Function  responsible to move the camera to the selected system when is transitioning
   * */
  useFrame((_, delta) => {
    if (!isTransitioning || !targetPosition || completedRef.current) {
      return;
    }

    const orbitControls = controls as
      | { target: THREE.Vector3; update: () => void }
      | null;

    if (!orbitControls) return;
    const direction = camera.position
      .clone()
      .sub(targetPosition)
      .normalize();

    const destination = targetPosition
      .clone()
      .add(direction.multiplyScalar(12));

    const factor = 1 - Math.exp(-1.5 * Math.min(delta, 0.1));

    camera.position.lerp(destination, factor);
    orbitControls.target.lerp(targetPosition, factor);
    orbitControls.update();

    // When the distance between camera and system is enough, the the transition is finished
    if (camera.position.distanceTo(destination) < 0.1) {
      camera.position.copy(destination);
      orbitControls.target.copy(targetPosition);
      orbitControls.update();
      completedRef.current = true;
      onTransitionComplete();
    }
  });

  const previousTransitionRef = useRef(false);
  if (isTransitioning && !previousTransitionRef.current) {
    completedRef.current = false;
  }
  previousTransitionRef.current = isTransitioning;


  return (
    <>
      <OrbitControls
        makeDefault
        // Block the manual navigation when it is transitionign
        enablePan={!isTransitioning}
        enableZoom={!isTransitioning}
        enableRotate={!isTransitioning}
        minDistance={5}
        maxDistance={200}
      />

      {systems.data
        .filter(
          (system) =>
            system.star.x != null &&
            system.star.y != null &&
            system.star.z != null
        )
        .map((system) => (
          <PlanetarySystemSimp
            system={system}
            onClick={() => console.log("Click", system.id)}
            key={system.id}
          />
        ))}
    </>
  );
};
