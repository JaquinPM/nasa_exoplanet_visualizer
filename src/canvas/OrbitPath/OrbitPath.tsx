import { useMemo } from "react";
import * as THREE from "three";
import type { Exoplanet } from "../../model/Exoplanet";
import { calculateOrbitCoordinates } from "../../utils/orbitCalculator";

interface Props {
  exoplanet: Exoplanet;
  segments?: number; // How smooth the orbit circle is
}

export const OrbitPath = ({ exoplanet, segments = 128 }: Props) => {
  // Generate points and build the Line object once per exoplanet/segments change
  const lineObject = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const period = exoplanet.orbitPeriod;

    for (let i = 0; i <= segments; i++) {
      const time = (i / segments) * period;
      const pos = calculateOrbitCoordinates(time, exoplanet);
      pts.push(pos);
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(pts);
    const material = new THREE.LineBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.3,
    });

    return new THREE.Line(geometry, material);
  }, [exoplanet, segments]);

  return <primitive object={lineObject} />;
};
