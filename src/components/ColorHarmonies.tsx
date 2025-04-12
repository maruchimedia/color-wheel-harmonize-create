
import React from 'react';
import ColorPalette from './ColorPalette';
import { ColorHarmony } from '@/lib/colorUtils';

interface ColorHarmoniesProps {
  harmonies: ColorHarmony[];
  title?: string;
}

const ColorHarmonies: React.FC<ColorHarmoniesProps> = ({ 
  harmonies,
  title = "Color Harmonies"
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-6">
        {harmonies.map((harmony) => (
          <ColorPalette 
            key={harmony.name} 
            name={harmony.name} 
            colors={harmony.colors} 
          />
        ))}
      </div>
    </div>
  );
};

export default ColorHarmonies;
