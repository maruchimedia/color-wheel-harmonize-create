
import React from 'react';
import { getTextColor } from '@/lib/colorUtils';
import { Clipboard, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ColorPaletteProps {
  colors: string[];
  name: string;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ colors, name }) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const copyToClipboard = (color: string, index: number) => {
    navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    toast.success(`Copied ${color}`, {
      duration: 1500,
    });
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="mb-4 animate-fade-in">
      <h3 className="text-sm font-medium mb-2">{name}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {colors.map((color, index) => (
          <div
            key={`${name}-${index}`}
            className="color-swatch h-14 relative group"
            style={{ backgroundColor: color }}
            onClick={() => copyToClipboard(color, index)}
          >
            <div 
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: `${color}aa` }}
            >
              {copiedIndex === index ? (
                <Check className="h-5 w-5" style={{ color: getTextColor(color) }} />
              ) : (
                <Clipboard className="h-5 w-5" style={{ color: getTextColor(color) }} />
              )}
            </div>
            <div className="absolute bottom-1 right-1 text-xs font-mono" style={{ color: getTextColor(color) }}>
              {color}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;
