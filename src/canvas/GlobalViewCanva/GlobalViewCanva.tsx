
import { useFrame, useThree } from "@react-three/fiber";
import { useFetch } from "../../hooks";
import type { ExoplanetarySystemSimp } from "../../model/ExoplanetarySystem";
import { PlanetarySystemSimp } from "../PlanetarySystemSimp/PlanetarySystemSimp";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const url = "http://localhost:8080/api/system";

interface Props {
    selectedSystemId: number;
    isTransitioning: boolean;
    onTransitionComplete: () => void;
}

export const GlobalViewCanva = ({
    selectedSystemId,
    isTransitioning,
    onTransitionComplete,
}: Props) => {
    const systems = useFetch<ExoplanetarySystemSimp[]>(url, []);
    const { camera, controls } = useThree();

    const completedRef = useRef(false);

    const targetSystem = systems.data.find(
        (system) => system.id === selectedSystemId
    );

    const targetPosition = targetSystem
        ? new THREE.Vector3(
              targetSystem.star.x ?? 0,
              targetSystem.star.y ?? 0,
              targetSystem.star.z ?? 0
          )
        : null;

    useFrame((_, delta) => {
        if (!isTransitioning || !targetPosition || completedRef.current) {
            return;
        }

        const orbitControls = controls as
            | { target: THREE.Vector3; update: () => void }
            | null;

        if (!orbitControls) return;

        // Posición final de la cámara, conservando la dirección
        // desde la que se observa el sistema.
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
