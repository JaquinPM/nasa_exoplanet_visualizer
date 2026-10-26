import type { Exoplanet } from "../model/Exoplanet";
import * as THREE from "three";
import { auToScene } from "./units";

export function calculateOrbitCoordinates(
  time: number,
  exoplanet: Exoplanet
): THREE.Vector3 {
  // Earth defaults: 1 year period (365.25 days), 1 AU semi-major axis, 0 eccentricity
  const EARTH_PERIOD = 365.25;
  const EARTH_SEMI_MAJOR_AXIS = 1.0;

  const P = (exoplanet.orbitPeriod && exoplanet.orbitPeriod > 0)
    ? exoplanet.orbitPeriod
    : EARTH_PERIOD;

  const rawA = exoplanet.semiMajorAxis ?? EARTH_SEMI_MAJOR_AXIS;
  const a = auToScene(rawA);

  const e = exoplanet.orbitEccentricity ?? 0;

  const omegaPeri = THREE.MathUtils.degToRad(
    exoplanet.periastronAngle ?? 0
  );

  const n = (2 * Math.PI) / P;
  const M = n * time;

  let E = M;
  for (let j = 0; j < 10; j++) {
    const delta = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= delta;
    if (Math.abs(delta) < 1e-6) break;
  }

  const xCoord = a * (Math.cos(E) - e);
  const zCoord = a * Math.sqrt(1 - e ** 2) * Math.sin(E);

  const cosW = Math.cos(omegaPeri);
  const sinW = Math.sin(omegaPeri);

  const X = xCoord * cosW - zCoord * sinW;
  const Z = xCoord * sinW + zCoord * cosW;
  const Y = 0;

  return new THREE.Vector3(X, Y, Z);
}
