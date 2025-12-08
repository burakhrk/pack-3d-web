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

function PackedBox({
  item,
  onHover,
  onHoverEnd,
}: {
  item: PackedItem;
  onHover: () => void;
  onHoverEnd: () => void;
}) {
  const position: [number, number, number] = [
    item.position.x + item.width / 2,
    item.position.y + item.height / 2,
    item.position.z + item.depth / 2,
  ];
  const dimensions: [number, number, number] = [
    item.width,
    item.height,
    item.depth,
  ];

  return (
    <Box
      position={position}
      dimensions={dimensions}
      color={item.color}
      onPointerOver={onHover}
      onPointerOut={onHoverEnd}
    />
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
            <PackedBox
              key={`${item.id}-${idx}`}
              item={item}
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
