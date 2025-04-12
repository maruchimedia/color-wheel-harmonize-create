
import React from 'react';
import { ColorHarmony } from '@/lib/colorUtils';

interface SavedPalettesProps {
  palettes: ColorHarmony[];
}

const SavedPalettes: React.FC<SavedPalettesProps> = ({ palettes }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Saved Palettes</h2>
      <div className="space-y-4">
        {palettes.map((palette, idx) => (
          <div key={`saved-${idx}`} className="border rounded-md p-4">
            <h3 className="text-sm font-medium mb-2">{palette.name}</h3>
            <div className="flex">
              {palette.colors.map((color, colorIdx) => (
                <div
                  key={`saved-${idx}-${colorIdx}`}
                  className="h-8 flex-1"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedPalettes;
