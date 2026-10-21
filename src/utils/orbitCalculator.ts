import type { Exoplanet } from "../model/Exoplanet";
import * as THREE from "three";
import { auToScene } from "./units";

export function calculateOrbitCoordinates(
  time: number,
  exoplanet: Exoplanet
): THREE.Vector3 {
  const P = exoplanet.orbitPeriod;
  const a = auToScene(exoplanet.semiMajorAxis);
  const e = exoplanet.orbitEccentricity ?? 0;

  const omegaPeri = THREE.MathUtils.degToRad(
    exoplanet.periastronAngle ?? 0
  );

  if (!P || P <= 0) return new THREE.Vector3(0, 0, 0);

  const n = (2 * Math.PI) / P;
  const M = n * time; // Tiempo limpio sin epoch masivo

  let E = M;
  for (let j = 0; j < 10; j++) {
    const delta = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= delta;
    if (Math.abs(delta) < 1e-6) break;
  }

  // Coordenadas base en el plano orbital elíptico (X y Z como plano horizontal de Three.js)
  const xCoord = a * (Math.cos(E) - e);
  const zCoord = a * Math.sqrt(1 - e ** 2) * Math.sin(E);

  // Rotación por el argumento del periastro (omega)
  const cosW = Math.cos(omegaPeri);
  const sinW = Math.sin(omegaPeri);

  const X = xCoord * cosW - zCoord * sinW;
  const Z = xCoord * sinW + zCoord * cosW;
  const Y = 0; // Mantenemos la órbita plana horizontal por defecto, o puedes aplicar inclinación sutil si lo deseas

  return new THREE.Vector3(X, Y, Z);
}
