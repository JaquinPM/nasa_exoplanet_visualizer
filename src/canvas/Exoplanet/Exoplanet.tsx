
import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { Exoplanet } from "../../model/Exoplanet";
import { earthRadiiToScene } from "../../utils/units";

interface Props {
  exoplanet: Exoplanet;
  setRef: (el: THREE.Mesh | null) => void;
}

type PlanetType = "rocky" | "gas" | "ice" | "unknown";

function classifyPlanet(planet: Exoplanet): PlanetType {
  const { radius, mass } = planet;

  if (
    !Number.isFinite(radius) ||
    radius <= 0 ||
    mass == null ||
    !Number.isFinite(mass) ||
    mass <= 0
  ) {
    return "unknown";
  }

  // Supone radio y masa expresados en unidades terrestres.
  const density = mass / Math.pow(radius, 3);

  if (radius >= 6 || (radius >= 3 && density < 0.5)) {
    return "gas";
  }

  if (radius < 3 && density < 0.7) {
    return "ice";
  }

  if (radius < 2 && density >= 0.7) {
    return "rocky";
  }

  return "unknown";
}

const vertexShader = `
    varying vec3 vPosition;
    varying vec3 vNormal;

    void main() {
        vPosition = position;
        vNormal = normalize(normalMatrix * normal);

        gl_Position = projectionMatrix
            * modelViewMatrix
            * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    varying vec3 vPosition;
    varying vec3 vNormal;

    uniform float uTime;
    uniform float uSeed;
    uniform float uType;
    uniform vec3 uLightDirection;

    float hash(vec3 p) {
        p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
        p *= 17.0;
        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }

    float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);

        return mix(
            mix(
                mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
                mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x),
                f.y
            ),
            mix(
                mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
                mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x),
                f.y
            ),
            f.z
        );
    }

    void main() {
        vec3 p = normalize(vPosition);

        float n1 = noise(p * 5.0 + uSeed);
        float n2 = noise(p * 11.0 + uSeed * 2.0);
        float n3 = noise(p * 23.0 + uSeed * 3.0);

        vec3 rockyDark = vec3(0.12, 0.105, 0.09);
        vec3 rockyLight = vec3(0.58, 0.48, 0.34);

        vec3 gasDark = vec3(0.28, 0.12, 0.055);
        vec3 gasLight = vec3(0.9, 0.66, 0.39);

        vec3 iceDark = vec3(0.12, 0.3, 0.43);
        vec3 iceLight = vec3(0.82, 0.93, 1.0);

        vec3 unknownDark = vec3(0.16, 0.18, 0.28);
        vec3 unknownLight = vec3(0.52, 0.45, 0.68);

        vec3 darkColor = rockyDark;
        vec3 lightColor = rockyLight;

        if (uType > 0.5 && uType < 1.5) {
            // Gigante gaseoso: bandas y turbulencias.
            float bands = sin(p.y * 35.0 + n1 * 5.0 + n2 * 2.0);
            float bandMask = smoothstep(-0.25, 0.35, bands);

            darkColor = gasDark;
            lightColor = gasLight;

            n1 = mix(n1, bandMask, 0.75);
        } else if (uType > 1.5 && uType < 2.5) {
            // Mundo helado.
            darkColor = iceDark;
            lightColor = iceLight;
        } else if (uType > 2.5) {
            // Apariencia neutra cuando se desconoce la composición.
            darkColor = unknownDark;
            lightColor = unknownLight;
        }

        float surfaceNoise = n1 * 0.55 + n2 * 0.3 + n3 * 0.15;
        vec3 surface = mix(darkColor, lightColor, smoothstep(0.25, 0.8, surfaceNoise));

        if (uType < 0.5) {
            // Regiones minerales y cráteres estilizados.
            float craters = noise(p * 42.0 + uSeed * 4.0);
            surface *= mix(0.72, 1.08, craters);
        }

        if (uType > 1.5 && uType < 2.5) {
            // Grietas estilizadas en el hielo.
            float cracks = abs(n1 - n2);
            float crackMask = 1.0 - smoothstep(0.015, 0.07, cracks);
            surface = mix(surface, vec3(0.035, 0.09, 0.14), crackMask * 0.45);
        }

        // Nubes móviles en gigantes gaseosos.
        if (uType > 0.5 && uType < 1.5) {
            float clouds = noise(p * 30.0 + vec3(uTime * 0.025, 0.0, uSeed));
            float cloudMask = smoothstep(0.63, 0.78, clouds);
            surface = mix(surface, vec3(0.95, 0.83, 0.67), cloudMask * 0.55);
        }

        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(uLightDirection);

        float diffuse = max(dot(normal, lightDir), 0.0);
        float lighting = 0.055 + diffuse * 0.945;

        vec3 color = surface * lighting;

        // Resplandor atmosférico aproximado en el borde iluminado.
        float rim = pow(
            1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0),
            3.0
        );

        vec3 atmosphereColor = uType > 0.5 && uType < 1.5
            ? vec3(0.85, 0.55, 0.28)
            : vec3(0.12, 0.42, 0.8);

        color += atmosphereColor * rim * diffuse * 0.35;

        gl_FragColor = vec4(color, 1.0);

        #include <tonemapping_fragment>
        #include <colorspace_fragment>
    }
`;

export const ExoplanetModel = ({ exoplanet, setRef }: Props) => {
  const calculatedRadius = earthRadiiToScene(exoplanet.radius);
  const visualRadius = Math.max(calculatedRadius, 0.8);

  const planetRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const type = classifyPlanet(exoplanet);

  const typeValue: Record<PlanetType, number> = {
    rocky: 0,
    gas: 1,
    ice: 2,
    unknown: 3,
  };

  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.025;
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh
      ref={(el) => {
        planetRef.current = el;
        setRef(el);
      }}
      frustumCulled={false}
    >
      <sphereGeometry args={[visualRadius, 96, 96]} />

      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uSeed: { value: exoplanet.id * 0.137 },
          uType: { value: typeValue[type] },
          uLightDirection: {
            value: new THREE.Vector3(5, 3, 5).normalize(),
          },
        }}
      />
    </mesh>
  );
};
