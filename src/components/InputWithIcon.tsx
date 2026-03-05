import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputWithIconProps {
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  error?: boolean;
}

export const InputWithIcon: React.FC<InputWithIconProps> = ({
  icon: Icon,
  value,
  onChange,
  placeholder,
  className = '',
  error = false,
}) => {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-5 w-5 h-5 text-[#22c55e]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-12 pr-4 py-4 bg-[#1e2d5e] border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#22c55e]/50 transition-all ${className}`}
      />
    </div>
  );
};
