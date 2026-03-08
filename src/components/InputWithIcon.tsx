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
      <Icon className="absolute left-4 top-5 w-5 h-5 text-[#1C2B3A]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-12 pr-4 py-4 bg-[#eaf0f6] border ${error ? 'border-red-500/50' : 'border-[#dde5ed]'} rounded-xl text-[#1C2B3A] placeholder:text-[#6b8299] focus:outline-none focus:border-[#1C2B3A] focus:shadow-[0_0_0_3px_rgba(28,43,58,0.08)] transition-all ${className}`}
      />
    </div>
  );
};
