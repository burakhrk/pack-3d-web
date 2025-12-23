import { useRef, useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Environment, ContactShadows, Edges } from "@react-three/drei";
import { PackedItem, Container } from "@/types/packing";
import * as THREE from "three";

interface Scene3DProps {
  container: Container;
  packedItems: PackedItem[];
  onItemHover: (item: PackedItem | null) => void;
  highlightedTypes?: string[];
}

function Box({
  position,
  dimensions,
  color,
  opacity = 1,
  wireframe = false,
  onPointerOver,
  onPointerOut,
  isHighlighted,
  isDimmed,
}: {
  position: [number, number, number];
  dimensions: [number, number, number];
  color: string;
  opacity?: number;
  wireframe?: boolean;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  isHighlighted?: boolean;
  isDimmed?: boolean;
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
        transparent={opacity < 1 || isDimmed}
        opacity={isDimmed ? 0.1 : opacity}
        wireframe={wireframe}
        emissive={hovered && !isDimmed ? color : "#000000"}
        emissiveIntensity={hovered && !isDimmed ? 0.5 : 0}
        roughness={0.4}
        metalness={0.1}
      />
      {isHighlighted && <Edges color="black" threshold={15} />}
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
  isHighlighted,
  isDimmed,
}: {
  item: PackedItem;
  onHover: () => void;
  onHoverEnd: () => void;
  isHighlighted?: boolean;
  isDimmed?: boolean;
}) {
  return (
    <Box
      position={[
        item.position.x + item.width / 2,
        item.position.y + item.height / 2,
        item.position.z + item.depth / 2,
      ]}
      dimensions={[item.width, item.height, item.depth]}
      color={item.color}
      onPointerOver={onHover}
      onPointerOut={onHoverEnd}
      isHighlighted={isHighlighted}
      isDimmed={isDimmed}
    />
  );
}

function CameraUpdater({ container }: { container: Container }) {
  const { camera, controls } = useThree();

  useEffect(() => {
    const maxDim = Math.max(container.width, container.height, container.depth);
    const distance = maxDim * 2;
    // Position camera to view the whole container
    camera.position.set(distance, distance, distance);
    camera.far = 100000;
    camera.updateProjectionMatrix();

    if (controls) {
      // @ts-expect-error - OrbitControls target is not correctly typed in Drei
      controls.target.set(0, 0, 0);
      // @ts-expect-error - OrbitControls update is not correctly typed in Drei
      controls.update();
    }
  }, [container, camera, controls]);

  return null;
}

export interface Scene3DHandle {
  captureScreenshot: () => string | null;
}

export const Scene3D = forwardRef<Scene3DHandle, Scene3DProps>(
  ({ container, packedItems, onItemHover, highlightedTypes = [] }, ref) => {
    const maxDimension = Math.max(container.width, container.height, container.depth);
    const cameraDistance = maxDimension * 2;

    // Use a ref to get the GL context
    const glRef = useRef<THREE.WebGLRenderer | null>(null);

    useImperativeHandle(ref, () => ({
      captureScreenshot: () => {
        if (!glRef.current) return null;
        return glRef.current.domElement.toDataURL("image/png");
      },
    }));

    return (
      <div className="w-full h-full bg-visualization rounded-lg overflow-hidden shadow-lg border border-border relative">
        <Canvas
          shadows
          gl={{ preserveDrawingBuffer: true }}
          onCreated={({ gl }) => {
            glRef.current = gl as THREE.WebGLRenderer;
          }}
          camera={{
            position: [cameraDistance, cameraDistance, cameraDistance],
            fov: 50,
            far: 100000
          }}
          className="bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950"
        >
          <ambientLight intensity={0.5} />
          <spotLight position={[maxDimension, maxDimension * 2, maxDimension]} angle={0.3} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-maxDimension, -maxDimension, -maxDimension]} intensity={0.5} />

          <Environment preset="city" />

          <CameraUpdater container={container} />

          <group position={[-container.width / 2, -container.height / 2, -container.depth / 2]}>
            <ContainerWireframe container={container} />
            <AxisLabels container={container} />
            {packedItems.map((item) => {
              const hasHighlight = highlightedTypes.length > 0;
              // Remove suffix like " #1", " #2" to match the base type logic in Index.tsx
              const itemBaseName = item.name.replace(/ #\d+$/, '');
              const isHighlighted = hasHighlight ? highlightedTypes.includes(itemBaseName) : false;
              const isDimmed = hasHighlight ? !isHighlighted : false;

              return (
                <PackedBox
                  key={item.id}
                  item={item}
                  onHover={() => onItemHover(item)}
                  onHoverEnd={() => onItemHover(null)}
                  isHighlighted={isHighlighted}
                  isDimmed={isDimmed}
                />
              );
            })}
          </group>

          <ContactShadows
            position={[0, -container.height / 2 - 0.1, 0]}
            opacity={0.4}
            scale={maxDimension * 2}
            blur={2.5}
            far={maxDimension}
          />

          <OrbitControls makeDefault enableDamping dampingFactor={0.05} rotateSpeed={0.5} zoomSpeed={0.8} />
          <gridHelper args={[maxDimension * 2, 20]} position={[0, -container.height / 2, 0]} />
        </Canvas>
      </div>
    );
  }
);
