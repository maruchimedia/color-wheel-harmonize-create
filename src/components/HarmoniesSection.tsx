
import React from 'react';
import { Palette, Download } from 'lucide-react';
import { toast } from 'sonner';
import { ColorHarmony } from '@/lib/colorUtils';
import HarmonyCard from './HarmonyCard';
import SavedPalettes from './SavedPalettes';

interface HarmoniesSectionProps {
  colorHarmonies: ColorHarmony[];
  savedPalettes: ColorHarmony[];
  onSavePalette: (harmony: ColorHarmony) => void;
  onDownloadPalettes: () => void;
}

const HarmoniesSection: React.FC<HarmoniesSectionProps> = ({
  colorHarmonies,
  savedPalettes,
  onSavePalette,
  onDownloadPalettes
}) => {
  return (
    <div className="flex-1 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Palette className="h-5 w-5" /> Color Harmonies
        </h2>
        <button
          onClick={onDownloadPalettes}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition"
        >
          <Download className="h-4 w-4" /> Export
        </button>
      </div>
      
      <div className="space-y-6">
        {colorHarmonies.map((harmony) => (
          <HarmonyCard 
            key={harmony.name} 
            harmony={harmony} 
            onSave={onSavePalette} 
          />
        ))}
      </div>
      
      {savedPalettes.length > 0 && (
        <SavedPalettes palettes={savedPalettes} />
      )}
    </div>
  );
};

export default HarmoniesSection;
