
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface ColorAdjustmentProps {
  saturation: number;
  lightness: number;
  onSaturationChange: (value: number[]) => void;
  onLightnessChange: (value: number[]) => void;
}

const ColorAdjustment: React.FC<ColorAdjustmentProps> = ({
  saturation,
  lightness,
  onSaturationChange,
  onLightnessChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-sm font-medium">Saturation</label>
          <span className="text-sm text-muted-foreground">{saturation}%</span>
        </div>
        <Slider
          value={[saturation]}
          min={0}
          max={100}
          step={1}
          onValueChange={onSaturationChange}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-sm font-medium">Lightness</label>
          <span className="text-sm text-muted-foreground">{lightness}%</span>
        </div>
        <Slider
          value={[lightness]}
          min={0}
          max={100}
          step={1}
          onValueChange={onLightnessChange}
        />
      </div>
    </div>
  );
};

export default ColorAdjustment;
