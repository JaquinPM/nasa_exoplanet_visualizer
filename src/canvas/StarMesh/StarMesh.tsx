
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Star } from "../../model/Star";
import { solarRadiiToScene } from "../../utils/units";

interface Props {
  star: Star;
}

// Approximate visual classification based on radius in solar radii.
// This is an artistic fallback, not a reliable temperature estimate.
function getStarColor(radius: number): string {
  if (radius < 0.5) return "#ff7045";
  if (radius < 0.8) return "#ffbd75";
  if (radius < 1.3) return "#fff0c2";
  if (radius < 2.5) return "#fff5e8";

  return "#b9d5ff";
}

function StarSurface({
  radius,
  color,
}: {
  radius: number;
  color: string;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value =
        clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[radius, 96, 96]} />

      <shaderMaterial
        ref={materialRef}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(color) },
        }}
        vertexShader={`
          varying vec3 vPosition;

          void main() {
            vPosition = position;

            gl_Position = projectionMatrix
              * modelViewMatrix
              * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor;

          varying vec3 vPosition;

          float hash(vec3 p) {
            p = fract(p * 0.3183099 + vec3(0.1));
            p *= 17.0;

            return fract(
              p.x * p.y * p.z * (p.x + p.y + p.z)
            );
          }

          float noise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);

            float n000 = hash(i);
            float n100 = hash(i + vec3(1.0, 0.0, 0.0));
            float n010 = hash(i + vec3(0.0, 1.0, 0.0));
            float n110 = hash(i + vec3(1.0, 1.0, 0.0));
            float n001 = hash(i + vec3(0.0, 0.0, 1.0));
            float n101 = hash(i + vec3(1.0, 0.0, 1.0));
            float n011 = hash(i + vec3(0.0, 1.0, 1.0));
            float n111 = hash(i + vec3(1.0, 1.0, 1.0));

            float x00 = mix(n000, n100, f.x);
            float x10 = mix(n010, n110, f.x);
            float x01 = mix(n001, n101, f.x);
            float x11 = mix(n011, n111, f.x);

            return mix(
              mix(x00, x10, f.y),
              mix(x01, x11, f.y),
              f.z
            );
          }

          void main() {
            vec3 p = normalize(vPosition);

            float n1 = noise(p * 12.0 + uTime * 0.10);
            float n2 = noise(p * 27.0 - uTime * 0.16);
            float n3 = noise(p * 55.0 + uTime * 0.07);

            float plasma =
              n1 * 0.50 +
              n2 * 0.32 +
              n3 * 0.18;

            vec3 deepColor = uColor * 0.35;

            vec3 hotColor = mix(
              uColor,
              vec3(1.0, 0.30, 0.08),
              0.25
            );

            vec3 whiteHot = mix(
              uColor,
              vec3(1.0, 0.96, 0.88),
              0.80
            );

            vec3 color = mix(
              deepColor,
              hotColor,
              smoothstep(0.25, 0.75, plasma)
            );

            color = mix(
              color,
              whiteHot,
              smoothstep(0.60, 0.85, plasma)
            );

            float granulation = smoothstep(0.35, 0.85, n2);
            color += uColor * granulation * 0.3;

            gl_FragColor = vec4(color * 1.5, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function StarCorona({
  radius,
  color,
}: {
  radius: number;
  color: string;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value =
        clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[radius * 1.18, 48, 48]} />

      <shaderMaterial
        ref={materialRef}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(color) },
        }}
        vertexShader={`
          varying vec3 vNormal;

          void main() {
            vNormal = normalize(normalMatrix * normal);

            gl_Position = projectionMatrix
              * modelViewMatrix
              * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor;

          varying vec3 vNormal;

          void main() {
            float fresnel = pow(
              1.0 - abs(normalize(vNormal).z),
              2.0
            );

            float pulse = 0.9 + 0.1 * sin(uTime * 1.5);
            float alpha = fresnel * 0.6 * pulse;

            gl_FragColor = vec4(uColor * 2.0, alpha);
          }
        `}
        transparent
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function StarMesh({ star }: Props) {
  const solarRadius = star.radius ?? 1;
  const radius = solarRadiiToScene(solarRadius);
  const starColor = getStarColor(solarRadius);

  return (
    <group>
      <StarSurface
        radius={radius}
        color={starColor}
      />

      <StarCorona
        radius={radius}
        color={starColor}
      />

      <pointLight
        intensity={2.5}
        distance={200}
        decay={2}
        color={starColor}
      />
    </group>
  );
}


