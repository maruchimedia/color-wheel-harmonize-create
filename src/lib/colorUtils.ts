
// Convert HSL to RGB
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

// Convert RGB to HEX
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Convert HEX to RGB
export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ]
    : [0, 0, 0];
}

// Convert HSL to HEX
export function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

// Convert HEX to HSL
export function hexToHsl(hex: string): [number, number, number] {
  const rgb = hexToRgb(hex);
  return rgbToHsl(rgb[0], rgb[1], rgb[2]);
}

// Get color brightness (0-255)
export function getColorBrightness(hex: string): number {
  const rgb = hexToRgb(hex);
  return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
}

// Determine if text should be dark or light based on background
export function getTextColor(bgHex: string): string {
  return getColorBrightness(bgHex) > 128 ? '#000000' : '#ffffff';
}

// Generate color harmonies
export interface ColorHarmony {
  name: string;
  colors: string[];
}

export function getColorHarmonies(hue: number, saturation: number, lightness: number): ColorHarmony[] {
  // Ensure hue is 0-360
  hue = ((hue % 360) + 360) % 360;
  
  const complementary = [(hue + 180) % 360];
  const analogous = [(hue + 30) % 360, (hue + 330) % 360];
  const triadic = [(hue + 120) % 360, (hue + 240) % 360];
  const tetradic = [(hue + 90) % 360, (hue + 180) % 360, (hue + 270) % 360];
  const splitComplementary = [(hue + 150) % 360, (hue + 210) % 360];
  
  return [
    {
      name: 'Complementary',
      colors: [hslToHex(hue, saturation, lightness), ...complementary.map(h => hslToHex(h, saturation, lightness))]
    },
    {
      name: 'Analogous',
      colors: [hslToHex(hue, saturation, lightness), ...analogous.map(h => hslToHex(h, saturation, lightness))]
    },
    {
      name: 'Triadic',
      colors: [hslToHex(hue, saturation, lightness), ...triadic.map(h => hslToHex(h, saturation, lightness))]
    },
    {
      name: 'Tetradic',
      colors: [hslToHex(hue, saturation, lightness), ...tetradic.map(h => hslToHex(h, saturation, lightness))]
    },
    {
      name: 'Split Complementary',
      colors: [hslToHex(hue, saturation, lightness), ...splitComplementary.map(h => hslToHex(h, saturation, lightness))]
    }
  ];
}
