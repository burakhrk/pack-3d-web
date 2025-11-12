import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
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
        emissiveIntensity={hovered ? 0.3 : 0}
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
      {/* X-axis (Width) */}
      <Text
        position={[container.width / 2, -0.5, -0.5]}
        fontSize={0.4}
        color="#3B82F6"
      >
        Width: {container.width}
      </Text>
      {/* Y-axis (Height) */}
      <Text
        position={[-0.5, container.height / 2, -0.5]}
        fontSize={0.4}
        color="#10B981"
        rotation={[0, 0, Math.PI / 2]}
      >
        Height: {container.height}
      </Text>
      {/* Z-axis (Depth) */}
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
    <div className="w-full h-full bg-visualization rounded-lg overflow-hidden shadow-lg border border-border">
      <Canvas
        camera={{
          position: [cameraDistance, cameraDistance, cameraDistance],
          fov: 50,
        }}
      >
        <color attach="background" args={["hsl(var(--visualization-bg))"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />

        <ContainerWireframe container={container} />
        <AxisLabels container={container} />

        {packedItems.map((item) => (
          <PackedBox
            key={item.id}
            item={item}
            onHover={() => onItemHover(item)}
            onHoverEnd={() => onItemHover(null)}
          />
        ))}

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
        />
        
        <gridHelper args={[maxDimension * 2, 20]} position={[container.width / 2, 0, container.depth / 2]} />
      </Canvas>
    </div>
  );
}
