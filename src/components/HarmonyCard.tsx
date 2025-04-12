
import React from 'react';
import { Save, ClipboardCopy } from 'lucide-react';
import { toast } from 'sonner';
import { ColorHarmony } from '@/lib/colorUtils';

interface HarmonyCardProps {
  harmony: ColorHarmony;
  onSave: (harmony: ColorHarmony) => void;
}

const HarmonyCard: React.FC<HarmonyCardProps> = ({ harmony, onSave }) => {
  return (
    <div className="border rounded-md p-4 relative overflow-hidden">
      <button
        onClick={() => onSave(harmony)}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors"
        title="Save palette"
      >
        <Save className="h-4 w-4" />
      </button>
      
      <h3 className="text-lg font-medium mb-3">{harmony.name}</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        {harmony.colors.map((color, index) => (
          <div
            key={`${harmony.name}-${index}`}
            className="h-12 rounded relative group cursor-pointer"
            style={{ backgroundColor: color }}
            onClick={() => {
              navigator.clipboard.writeText(color);
              toast.success(`Copied ${color}`);
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
              <ClipboardCopy className="h-4 w-4 text-white" />
            </div>
            <div className="absolute bottom-1 right-1 text-xs font-mono text-white">
              {color}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HarmonyCard;
