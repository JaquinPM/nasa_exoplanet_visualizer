import type { Exoplanet } from "./Exoplanet";
import type { Star } from "./Star";

export interface ExoplanetarySystemSimp{
    id : number,
    name: string,
    numberMoons: number,
    star: Star,
}


export interface ExoplanetarySystem{
    id : number,
    name: string,
    numberMoons: number,
    star: Star,
    exoplanets: Exoplanet[]
} 