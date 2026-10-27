import { useFrame } from "@react-three/fiber";
import type { ExoplanetarySystem } from "../../model/ExoplanetarySystem";
import { useRef } from "react";
import * as THREE from "three";
import { ExoplanetModel } from "../Exoplanet/Exoplanet";
import StarMesh from "../StarMesh/StarMesh";
import { calculateOrbitCoordinates } from "../../utils/orbitCalculator";
import { OrbitPath } from "../OrbitPath/OrbitPath";

interface Props {
  planetarySystem: ExoplanetarySystem;
  // Used to follow certain exoplanet position when it is selected
  selectedExoplanetId: number
}

/**
 * Three.js component that renders the whole planetary system 
 */
export const PlanetarySystem = ({ planetarySystem, selectedExoplanetId }: Props) => {
  // Mesh exoplanets list to update the exoplanets position based on their trayectories
  const planetRefs = useRef<(THREE.Mesh | null)[]>([]);

  // How many days corresponds to each second of simulation
  const DAYS_PER_SECOND = 0.2;

  // Elaśed time 
  const accumulatedTimeRef = useRef(0);

  // Used to follow the exoplanet position when selected
  const currentLookTargetRef = useRef(new THREE.Vector3());

  const isFirstFrameRef = useRef(true);

  // Function that moves the camera to a desired position, in this case will be used to 
  // follow an exoplanet position 
  const updateCameraPosition = (
    camera: THREE.Camera,
    position: THREE.Vector3,
    delta: number
  ) => {
    const lerpFactor = 1 - Math.exp(-10 * delta);

    const direction = position.clone().normalize();

    const distance = 6;
    const height = 2;

    const desiredPosition = position.clone()
      .add(direction.clone().multiplyScalar(distance))
      .add(new THREE.Vector3(0, height, 0));

    camera.position.lerp(desiredPosition, lerpFactor);

    // Look slightly ahead of the planet to shift it toward the left
    const cameraDirection = desiredPosition.clone()
      .sub(position)
      .normalize();

    const right = new THREE.Vector3()
      .crossVectors(camera.up, cameraDirection)
      .normalize();

    const targetLook = position.clone().add(
      right.multiplyScalar(0)
    );

    if (isFirstFrameRef.current) {
      currentLookTargetRef.current.copy(targetLook);
      isFirstFrameRef.current = false;
    } else {
      currentLookTargetRef.current.lerp(targetLook, lerpFactor);
    }

    camera.lookAt(currentLookTargetRef.current);
  };

  // Function that updates each exoplanet position and moves rthe camera autromatically if needed
  useFrame(({ camera }, delta) => {
    //Elapsed time betwwen frames
    const clampedDelta = Math.min(delta, 0.1);
    // Real elapsedTime in days
    accumulatedTimeRef.current += clampedDelta * DAYS_PER_SECOND;
    // Real elapsed time 
    const elapsedTime = accumulatedTimeRef.current;

    // Position to be follwed is there is an exoplanet selected
    const selectedPosition = new THREE.Vector3();

    let followExoplanet = false;

    // For each exoplanet in the system
    for (let i = 0; i < planetarySystem.exoplanets.length; i++) {
      // Get the exoplanet mesh
      const mesh = planetRefs.current[i];

      // If there is no mesh 
      if (!mesh) continue;

      // Compute its orbit piosition based in the elapsedTime
      const position = calculateOrbitCoordinates(
        elapsedTime,
        planetarySystem.exoplanets[i]
      );

      // Updaye mesh exoplanet position
      mesh.position.copy(position);

      // I f the current exoplanet is the one to be followed by the camera
      if (selectedExoplanetId === planetarySystem.exoplanets[i].id) {
        // Store its position 
        selectedPosition.copy(mesh.position);
        followExoplanet = true;
      }
    }

    // If there is an exoplanet to be follwed
    if (followExoplanet) {
      // Move the camera to it
      updateCameraPosition(camera, selectedPosition, clampedDelta);
    } else {
      isFirstFrameRef.current = true;
      currentLookTargetRef.current.set(0, 0, 0);
    }
  });

  return (
    <>
      <StarMesh star={planetarySystem.star} />

      {planetarySystem.exoplanets.map((exoplanet, index) => (
        <group key={exoplanet.id || index}>
          <OrbitPath exoplanet={exoplanet} />

          <ExoplanetModel
            exoplanet={exoplanet}
            setRef={(el: THREE.Mesh | null) => {
              planetRefs.current[index] = el;
            }}
          />
        </group>
      ))}
    </>
  );
};
