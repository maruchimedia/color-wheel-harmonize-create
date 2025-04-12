
import React, { useState, useEffect } from 'react';
import ColorWheel from '@/components/ColorWheel';
import ColorHarmonies from '@/components/ColorHarmonies';
import HexColorInput from '@/components/HexColorInput';
import { 
  getColorHarmonies, 
  hexToHsl, 
  hslToHex,
  ColorHarmony
} from '@/lib/colorUtils';
import { 
  Slider 
} from '@/components/ui/slider';
import { Palette, Save, Download } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [selectedColor, setSelectedColor] = useState({
    hex: '#FF5733',
    h: 10,
    s: 100,
    l: 60
  });
  
  const [saturation, setSaturation] = useState(70);
  const [lightness, setLightness] = useState(50);
  const [colorHarmonies, setColorHarmonies] = useState<ColorHarmony[]>([]);
  const [savedPalettes, setSavedPalettes] = useState<ColorHarmony[]>([]);
  
  // Calculate wheel size based on viewport
  const getWheelSize = () => {
    return window.innerWidth < 640 
      ? Math.min(window.innerWidth - 40, 280) 
      : Math.min(window.innerWidth * 0.35, 400);
  };
  
  const [wheelSize, setWheelSize] = useState(getWheelSize());
  
  // Update wheel size on window resize
  useEffect(() => {
    const handleResize = () => {
      setWheelSize(getWheelSize());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Update color harmonies when color changes
  useEffect(() => {
    const harmonies = getColorHarmonies(selectedColor.h, saturation, lightness);
    setColorHarmonies(harmonies);
  }, [selectedColor.h, saturation, lightness]);
  
  const handleColorChange = (color: { hex: string; h: number; s: number; l: number }) => {
    setSelectedColor(color);
  };
  
  const handleHexChange = (hex: string) => {
    const [h, s, l] = hexToHsl(hex);
    setSelectedColor({ hex, h, s, l });
    setSaturation(s);
    setLightness(l);
  };
  
  const handleSaturationChange = (value: number[]) => {
    const newSaturation = value[0];
    setSaturation(newSaturation);
    const newHex = hslToHex(selectedColor.h, newSaturation, lightness);
    setSelectedColor({
      ...selectedColor,
      hex: newHex,
      s: newSaturation
    });
  };
  
  const handleLightnessChange = (value: number[]) => {
    const newLightness = value[0];
    setLightness(newLightness);
    const newHex = hslToHex(selectedColor.h, saturation, newLightness);
    setSelectedColor({
      ...selectedColor,
      hex: newHex,
      l: newLightness
    });
  };
  
  const savePalette = (harmony: ColorHarmony) => {
    setSavedPalettes([...savedPalettes, harmony]);
    toast.success(`Saved ${harmony.name} palette`, {
      description: "Your palette has been saved",
      duration: 3000,
    });
  };
  
  const downloadPalettes = () => {
    const allPalettes = [...colorHarmonies, ...savedPalettes];
    
    const data = {
      palettes: allPalettes,
      baseColor: selectedColor.hex,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `color-harmony-${selectedColor.hex.replace('#', '')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Palette exported successfully", {
      description: "Your color palettes have been downloaded",
      duration: 3000,
    });
  };
  
  return (
    <div className="min-h-screen py-8 px-4 md:px-8">
      <header className="max-w-5xl mx-auto text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Color Wheel Harmonizer</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Explore color harmonies by selecting colors from the wheel. Create beautiful, balanced color palettes for your designs.
        </p>
      </header>
      
      <main className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-center">
          <div className="flex flex-col items-center">
            <ColorWheel 
              size={wheelSize} 
              saturation={saturation}
              lightness={lightness}
              onChange={handleColorChange}
            />
            
            <div className="w-full mt-6 space-y-6">
              <HexColorInput 
                value={selectedColor.hex} 
                onChange={handleHexChange}
                label="Selected Color"
              />
              
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
                    onValueChange={handleSaturationChange}
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
                    onValueChange={handleLightnessChange}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Palette className="h-5 w-5" /> Color Harmonies
              </h2>
              <button
                onClick={downloadPalettes}
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition"
              >
                <Download className="h-4 w-4" /> Export
              </button>
            </div>
            
            <div className="space-y-6">
              {colorHarmonies.map((harmony) => (
                <div key={harmony.name} className="border rounded-md p-4 relative overflow-hidden">
                  <button
                    onClick={() => savePalette(harmony)}
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
                          <Clipboard className="h-4 w-4 text-white" />
                        </div>
                        <div className="absolute bottom-1 right-1 text-xs font-mono text-white">
                          {color}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {savedPalettes.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Saved Palettes</h2>
                <div className="space-y-4">
                  {savedPalettes.map((palette, idx) => (
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
            )}
          </div>
        </div>
      </main>
      
      <footer className="max-w-5xl mx-auto mt-16 text-center text-sm text-muted-foreground">
        <p>Color Wheel Harmonizer - Create beautiful color palettes with ease</p>
      </footer>
    </div>
  );
};

export default Index;
