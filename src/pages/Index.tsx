
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  getColorHarmonies, 
  hexToHsl, 
  hslToHex,
  ColorHarmony
} from '@/lib/colorUtils';
import ColorWheelSection from '@/components/ColorWheelSection';
import HarmoniesSection from '@/components/HarmoniesSection';

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
          <ColorWheelSection 
            selectedColor={selectedColor}
            wheelSize={wheelSize}
            saturation={saturation}
            lightness={lightness}
            onColorChange={handleColorChange}
            onHexChange={handleHexChange}
            onSaturationChange={handleSaturationChange}
            onLightnessChange={handleLightnessChange}
          />
          
          <HarmoniesSection 
            colorHarmonies={colorHarmonies}
            savedPalettes={savedPalettes}
            onSavePalette={savePalette}
            onDownloadPalettes={downloadPalettes}
          />
        </div>
      </main>
      
      <footer className="max-w-5xl mx-auto mt-16 text-center text-sm text-muted-foreground">
        <p>Color Wheel Harmonizer - Create beautiful color palettes with ease</p>
      </footer>
    </div>
  );
};

export default Index;
