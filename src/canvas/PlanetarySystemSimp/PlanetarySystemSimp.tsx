import { useState, useMemo } from "react";
import * as THREE from "three"; // Importamos THREE para crear la geometría
import { PointMaterial } from "@react-three/drei"; // Importamos PointMaterial de drei
import type { ExoplanetarySystemSimp } from "../../model/ExoplanetarySystem";

interface Props {
    system: ExoplanetarySystemSimp;
    onClick: () => void;
}

export const PlanetarySystemSimp = ({ system, onClick }: Props) => {
    const [hovered, setHovered] = useState(false);

    const x = system.star?.x ?? 1;
    const y = system.star?.y ?? 1;
    const z = system.star?.z ?? 1;

    const color = useMemo(() => {
        const distance = Math.sqrt(x * x + y * y + z * z);
        const hue = (distance * 15) % 360;
        return `hsl(${hue}, 100%, 40%)`;
    }, [x,y,z]);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute(
            "position",
            new THREE.Float32BufferAttribute([x, y, z], 3),
        );
        return geo;
    }, [x, y, z]);

    return (
        <points
            onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(true);
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                setHovered(false);
            }}
            onClick={onClick}
        >
            <bufferGeometry attach="geometry" {...geometry} />
            <PointMaterial
                color={hovered ? "#ffffff" : color}
                size={1} // Tamaño base del punto en pixeles
                sizeAttenuation={true} // Hace que se vean más pequeños si están lejos (como en Space Engine)
                transparent={true}
                opacity={1}
                depthWrite={false} // Importante para que no se tapen entre ellos raramente al superponerse
            />

            
        </points>
    );
};
