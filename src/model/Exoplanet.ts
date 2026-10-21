export interface Exoplanet {
    id: number;
    name: string;
    radius: number;
    mass: number | null;
    orbitEccentricity: number;
    orbitPeriod: number;
    orbitInclination: number | null;
    discoveryMethod: string;
    discoveryYear: string;
    discTelescope: string;
    discInstrument: string;
    semiMajorAxis: number
    periastronEpoch: number | null;
    periastronAngle: number | null;
    idExoplanetarySystem: number;
}
