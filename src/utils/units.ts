const AU_TO_KM = 149_597_870.7;
const EARTH_RADIUS_KM = 6_371;
const SOLAR_RADIUS_KM = 695_700;
const ORBIT_SCALE = 1;

export const SCENE_UNIT_KM = 100_000;

export const auToScene = (au: number): number =>
  (ORBIT_SCALE * (au * AU_TO_KM)) / SCENE_UNIT_KM;

export const earthRadiiToScene = (radius: number): number =>
  (radius * EARTH_RADIUS_KM) / SCENE_UNIT_KM;

export const solarRadiiToScene = (radius: number): number =>
  (ORBIT_SCALE * (radius * SOLAR_RADIUS_KM)) / SCENE_UNIT_KM;

export const kmToScene = (km: number): number => km / SCENE_UNIT_KM;
