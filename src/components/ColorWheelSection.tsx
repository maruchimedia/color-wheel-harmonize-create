
import React from 'react';
import ColorWheel from './ColorWheel';
import HexColorInput from './HexColorInput';
import ColorAdjustment from './ColorAdjustment';

interface ColorWheelSectionProps {
  selectedColor: {
    hex: string;
    h: number;
    s: number;
    l: number;
  };
  wheelSize: number;
  saturation: number;
  lightness: number;
  onColorChange: (color: { hex: string; h: number; s: number; l: number }) => void;
  onHexChange: (hex: string) => void;
  onSaturationChange: (value: number[]) => void;
  onLightnessChange: (value: number[]) => void;
}

const ColorWheelSection: React.FC<ColorWheelSectionProps> = ({
  selectedColor,
  wheelSize,
  saturation,
  lightness,
  onColorChange,
  onHexChange,
  onSaturationChange,
  onLightnessChange
}) => {
  return (
    <div className="flex flex-col items-center">
      <ColorWheel 
        size={wheelSize} 
        saturation={saturation}
        lightness={lightness}
        onChange={onColorChange}
      />
      
      <div className="w-full mt-6 space-y-6">
        <HexColorInput 
          value={selectedColor.hex} 
          onChange={onHexChange}
          label="Selected Color"
        />
        
        <ColorAdjustment 
          saturation={saturation}
          lightness={lightness}
          onSaturationChange={onSaturationChange}
          onLightnessChange={onLightnessChange}
        />
      </div>
    </div>
  );
};

export default ColorWheelSection;
