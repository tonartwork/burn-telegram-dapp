"use client";

import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { useEffect, useState } from "react";

interface CarouselCylindricalProps {
  images: string[];
  height?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  dragEnabled?: boolean;
  cylinderWidth?: number;
}

export function CarouselCylindrical({ 
  images,
  height = 180,
  autoRotate = true,
  autoRotateSpeed = 0.2,
  dragEnabled = true,
  cylinderWidth = 1100
}: CarouselCylindricalProps) {
  const faceCount = images.length - 2;
  const faceWidth = cylinderWidth / faceCount;
  const dragFactor = 0.05;
  const radius = cylinderWidth / (2 * Math.PI);

  const rotation = useMotionValue(0);
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);

  // Auto-rotation effect
  useEffect(() => {
    if (autoRotate && !isDragging) {
      const interval = setInterval(() => {
        rotation.set(rotation.get() + autoRotateSpeed);
      }, 16); // ~60fps

      return () => clearInterval(interval);
    }
  }, [isDragging, rotation, autoRotate, autoRotateSpeed]);

  const handleDragStart = () => {
    if (!dragEnabled) return;
    setIsDragging(true);
  };

  const handleDrag = (_: any, info: PanInfo) => {
    if (!dragEnabled) return;
    rotation.set(rotation.get() + info.offset.x * dragFactor);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (!dragEnabled) return;
    setIsDragging(false);
    controls.start({
      rotateY: rotation.get() + info.velocity.x * dragFactor,
      transition: { type: "spring", stiffness: 100, damping: 30, mass: 0.1 },
    });
  };

  const transform = useTransform(rotation, (value) => {
    return `rotate3d(0, 1, 0, ${value}deg)`;
  });

  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      <div
        className="absolute top-0 left-0 z-10 w-12 h-full pointer-events-none"
        style={{
          background: "linear-gradient(to left, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 100%)",
        }}
      />
      <div
        className="absolute top-0 right-0 z-10 w-12 h-full pointer-events-none"
        style={{
          background: "linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 100%)",
        }}
      />
      <div
        className="flex items-center justify-center h-full"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
          transform: "rotateX(0deg)",
        }}
      >
        <motion.div
          drag={dragEnabled ? "x" : false}
          className="relative flex justify-center h-full origin-center cursor-grab active:cursor-grabbing"
          style={{
            transform: transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: "preserve-3d",
          }}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={controls}
        >
          {images.map((imgUrl, i) => (
            <div
              key={i}
              className="absolute flex items-center justify-center h-full p-2 origin-center"
              style={{
                width: `${faceWidth}px`,
                transform: `rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)`,
              }}
            >
              <img
                src={imgUrl}
                alt={`Carousel image ${i + 1}`}
                className="object-cover w-22 h-22 pointer-events-none rounded-xl md:h-24"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}


export function CylindricalV2({ images }: CarouselCylindricalProps) {
  const isScreenSizeSm = true;
 
  const cylinderWidth = isScreenSizeSm ? 2000 : 3500;
  const faceCount = images.length;
  const faceWidth = cylinderWidth / faceCount;
  const dragFactor = 0.1;
  const radius = cylinderWidth / (8 * Math.PI);
 
  const rotation = useMotionValue(0);
  const controls = useAnimation();
 
  const handleDrag = (_: any, info: PanInfo) => {
    rotation.set(rotation.get() + info.offset.x * dragFactor);
  };
 
  const handleDragEnd = (_: any, info: PanInfo) => {
    controls.start({
      rotateY: rotation.get() + info.velocity.x * dragFactor,
      transition: { type: "spring", stiffness: 100, damping: 30, mass: 0.1 },
    });
  };
 
  const transform = useTransform(rotation, (value) => {
    return `rotate3d(0, 1, 0, ${value}deg)`;
  });
 
  return (
    <>
      <div className="relative h-[500px] w-full overflow-hidden">
        <div
          className="flex items-center justify-center h-full "
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
            transform: "rotateX(0deg)",
          }}
        >
          <motion.div
            drag="x"
            className="relative flex justify-center h-full origin-center cursor-grab active:cursor-grabbing"
            style={{
              transform: transform,
              rotateY: rotation,
              width: cylinderWidth,
              transformStyle: "preserve-3d",
            }}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            animate={controls}
          >
            {images.map((imgUrl, i) => {
              return (
                <div
                  key={i}
                  className="absolute flex items-center justify-center h-full p-2 origin-center"
                  style={{
                    width: `${faceWidth}px`,
                    transform: `rotateY(${
                      i * (360 / faceCount)
                    }deg) translateZ(${radius}px) rotateY(90deg)`,
                  }}
                >
                  <img
                    src={imgUrl}
                    alt="img"
                    className="object-cover w-full h-32 rounded-md pointer-events-none"
                  />
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </>
  );
}