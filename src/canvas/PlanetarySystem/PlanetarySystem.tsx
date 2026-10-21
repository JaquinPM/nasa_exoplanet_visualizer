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
  selectedExoplanetId: number
}

export const PlanetarySystem = ({ planetarySystem, selectedExoplanetId }: Props) => {
  const planetRefs = useRef<(THREE.Mesh | null)[]>([]);
  const DAYS_PER_SECOND = 0.2;

  const accumulatedTimeRef = useRef(0);
  const currentLookTargetRef = useRef(new THREE.Vector3());
  const isFirstFrameRef = useRef(true);




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

  useFrame(({ camera }, delta) => {
    const clampedDelta = Math.min(delta, 0.1);
    accumulatedTimeRef.current += clampedDelta * DAYS_PER_SECOND;
    const elapsedTime = accumulatedTimeRef.current;

    const selectedPosition = new THREE.Vector3();
    let followExoplanet = false;

    for (let i = 0; i < planetarySystem.exoplanets.length; i++) {
      const mesh = planetRefs.current[i];
      if (!mesh) continue;

      const position = calculateOrbitCoordinates(
        elapsedTime,
        planetarySystem.exoplanets[i]
      );

      mesh.position.copy(position);

      if (selectedExoplanetId === planetarySystem.exoplanets[i].id) {
        selectedPosition.copy(mesh.position);
        followExoplanet = true;
      }
    }

    if (followExoplanet) {
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
