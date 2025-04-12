
import React, { useRef, useEffect, useState } from 'react';
import { hslToRgb, hslToHex } from '@/lib/colorUtils';

interface ColorWheelProps {
  size: number;
  saturation?: number;
  lightness?: number;
  onChange: (color: { hex: string; h: number; s: number; l: number }) => void;
}

const ColorWheel: React.FC<ColorWheelProps> = ({ 
  size, 
  saturation = 70, 
  lightness = 50, 
  onChange 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedAngle, setSelectedAngle] = useState(0);
  const indicatorSize = Math.round(size * 0.08);
  
  // Draw the color wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = size;
    canvas.height = size;
    
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2;
    
    // Draw color wheel
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 2) * Math.PI / 180;
      const endAngle = (angle + 2) * Math.PI / 180;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      const [r, g, b] = hslToRgb(angle, saturation, lightness);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fill();
    }
    
    // Draw center white circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.15, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#e1e1e1';
    ctx.lineWidth = 1;
    ctx.stroke();
    
  }, [size, saturation, lightness]);
  
  // Update the indicator position
  useEffect(() => {
    updateColorFromAngle(selectedAngle);
  }, [selectedAngle, saturation, lightness]);
  
  const updateColorFromAngle = (angle: number) => {
    const hex = hslToHex(angle, saturation, lightness);
    onChange({ hex, h: angle, s: saturation, l: lightness });
  };
  
  const getAngleFromPoint = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const deltaX = x - centerX - rect.left;
    const deltaY = y - centerY - rect.top;
    
    // Calculate angle in radians and convert to degrees
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    // Convert to 0-360 range
    angle = (angle + 360) % 360;
    
    // Adjust angle to match color wheel (0 at right, going clockwise)
    angle = (angle + 90) % 360;
    
    return angle;
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    const angle = getAngleFromPoint(e.clientX, e.clientY);
    setSelectedAngle(angle);
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const angle = getAngleFromPoint(e.clientX, e.clientY);
    setSelectedAngle(angle);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    const angle = getAngleFromPoint(touch.clientX, touch.clientY);
    setSelectedAngle(angle);
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    const angle = getAngleFromPoint(touch.clientX, touch.clientY);
    setSelectedAngle(angle);
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  // Calculate indicator position
  const indicatorAngleRad = (selectedAngle - 90) * (Math.PI / 180);
  const indicatorRadius = (size / 2) * 0.85;
  const indicatorX = (size / 2) + indicatorRadius * Math.cos(indicatorAngleRad);
  const indicatorY = (size / 2) + indicatorRadius * Math.sin(indicatorAngleRad);
  
  return (
    <div className="relative color-wheel" style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="touch-none select-none"
      />
      <div 
        className="absolute rounded-full border-2 border-white shadow-md"
        style={{
          width: indicatorSize,
          height: indicatorSize,
          left: indicatorX - indicatorSize / 2,
          top: indicatorY - indicatorSize / 2,
          backgroundColor: hslToHex(selectedAngle, saturation, lightness),
          transform: 'translate(0, 0)'
        }}
      />
    </div>
  );
};

export default ColorWheel;
