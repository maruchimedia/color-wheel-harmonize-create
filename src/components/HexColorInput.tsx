
import React, { useState, useEffect } from 'react';

interface HexColorInputProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const HexColorInput: React.FC<HexColorInputProps> = ({ 
  value, 
  onChange,
  label = "Color"
}) => {
  const [inputValue, setInputValue] = useState(value);
  
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    setInputValue(newValue);
    
    // Add # if it's missing
    if (!newValue.startsWith('#')) {
      newValue = `#${newValue}`;
    }
    
    // Check if valid hex color
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex flex-col space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center space-x-2">
        <div 
          className="w-8 h-8 rounded-md border"
          style={{ backgroundColor: value }}
        />
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="#RRGGBB"
          className="color-input flex-1"
          maxLength={7}
        />
      </div>
    </div>
  );
};

export default HexColorInput;
