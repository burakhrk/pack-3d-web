import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Environment, ContactShadows } from "@react-three/drei";
import { PackedItem, Container } from "@/types/packing";
import * as THREE from "three";

interface Scene3DProps {
  container: Container;
  packedItems: PackedItem[];
  onItemHover: (item: PackedItem | null) => void;
}

function Box({
  position,
  dimensions,
  color,
  opacity = 1,
  wireframe = false,
  onPointerOver,
  onPointerOut,
}: {
  position: [number, number, number];
  dimensions: [number, number, number];
  color: string;
  opacity?: number;
  wireframe?: boolean;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onPointerOver?.();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        onPointerOut?.();
      }}
    >
      <boxGeometry args={dimensions} />
      <meshStandardMaterial
        color={color}
        transparent={opacity < 1}
        opacity={opacity}
        wireframe={wireframe}
        emissive={hovered ? color : "#000000"}
        emissiveIntensity={hovered ? 0.5 : 0}
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );
}

function ContainerWireframe({ container }: { container: Container }) {
  const position: [number, number, number] = [
    container.width / 2,
    container.height / 2,
    container.depth / 2,
  ];
  const dimensions: [number, number, number] = [
    container.width,
    container.height,
    container.depth,
  ];

  return (
    <Box
      position={position}
      dimensions={dimensions}
      color="#666666"
      opacity={0.1}
      wireframe={true}
    />
  );
}

function AxisLabels({ container }: { container: Container }) {
  return (
    <>
      <Text
        position={[container.width / 2, -0.5, -0.5]}
        fontSize={0.4}
        color="#3B82F6"
      >
        Width: {container.width}
      </Text>
      <Text
        position={[-0.5, container.height / 2, -0.5]}
        fontSize={0.4}
        color="#10B981"
        rotation={[0, 0, Math.PI / 2]}
      >
        Height: {container.height}
      </Text>
      <Text
        position={[-0.5, -0.5, container.depth / 2]}
        fontSize={0.4}
        color="#F59E0B"
        rotation={[0, -Math.PI / 2, 0]}
      >
        Depth: {container.depth}
      </Text>
    </>
  );
}

import { useFrame } from "@react-three/fiber";

function AnimatedPackedBox({
  item,
  index,
  totalItems,
  onHover,
  onHoverEnd,
}: {
  item: PackedItem;
  index: number;
  totalItems: number;
  onHover: () => void;
  onHoverEnd: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [mountTime] = useState(() => performance.now());

  useFrame(() => {
    if (!meshRef.current) return;

    const now = performance.now();
    const elapsed = now - mountTime;

    // Animation constants
    const TOTAL_DURATION = 2000;
    const FALL_DURATION = 500;
    const START_HEIGHT_OFFSET = 50; // Start high up

    // Calculate delay ensuring last item finishes exactly at 2 seconds (if possible)
    const maxStartDelay = Math.max(0, TOTAL_DURATION - FALL_DURATION);
    const delayPerItem = totalItems > 1 ? maxStartDelay / (totalItems - 1) : 0;
    const myDelay = index * delayPerItem;

    if (elapsed < myDelay) {
      meshRef.current.visible = false;
    } else {
      meshRef.current.visible = true;
      const animationProgress = Math.min(1, (elapsed - myDelay) / FALL_DURATION);

      // Cubic ease out
      const ease = 1 - Math.pow(1 - animationProgress, 3);

      const targetY = item.position.y + item.height / 2;
      const startY = targetY + START_HEIGHT_OFFSET;
      const currentY = startY + (targetY - startY) * ease;

      meshRef.current.position.set(
        item.position.x + item.width / 2,
        currentY,
        item.position.z + item.depth / 2
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        onHoverEnd();
      }}
    >
      <boxGeometry args={[item.width, item.height, item.depth]} />
      <meshStandardMaterial
        color={item.color}
        emissive={hovered ? item.color : "#000000"}
        emissiveIntensity={hovered ? 0.5 : 0}
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );
}

export function Scene3D({ container, packedItems, onItemHover }: Scene3DProps) {
  const maxDimension = Math.max(container.width, container.height, container.depth);
  const cameraDistance = maxDimension * 2;

  return (
    <div className="w-full h-full bg-visualization rounded-lg overflow-hidden shadow-lg border border-border relative">
      <Canvas
        shadows
        camera={{
          position: [cameraDistance, cameraDistance, cameraDistance],
          fov: 50,
        }}
        className="bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950"
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <Environment preset="city" />

        <group position={[-container.width / 2, -container.height / 2, -container.depth / 2]}>
          <ContainerWireframe container={container} />
          <AxisLabels container={container} />
          {packedItems.map((item, idx) => (
            <AnimatedPackedBox
              key={`${item.id}-${idx}-animated`}
              item={item}
              index={idx}
              totalItems={packedItems.length}
              onHover={() => onItemHover(item)}
              onHoverEnd={() => onItemHover(null)}
            />
          ))}
        </group>

        <ContactShadows
          position={[0, -container.height / 2 - 0.1, 0]}
          opacity={0.4}
          scale={50}
          blur={2.5}
          far={10}
        />

        <OrbitControls makeDefault enableDamping dampingFactor={0.05} rotateSpeed={0.5} zoomSpeed={0.8} />
        <gridHelper args={[maxDimension * 2, 20]} position={[0, -container.height / 2, 0]} />
      </Canvas>
    </div>
  );
}
