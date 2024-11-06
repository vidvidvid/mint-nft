import React from "react";
import { Button } from "@/components/ui/button";

interface SpecialButtonProps {
  disabled?: boolean;
  label: string;
  onClick?: () => void;
}

const SpecialButton: React.FC<SpecialButtonProps> = ({
  disabled,
  label,
  onClick,
}) => (
  <Button
    type='submit'
    onClick={onClick}
    disabled={disabled}
    className='flex-1 bg-gradient-to-r from-[#627EEA] to-[#C6538B] hover:from-blue-400 hover:to-violet-600 text-white h-14 text-sm font-medium tracking-wide min-w-[200px] rounded-[2px]'
    variant='default'
  >
    {label}
  </Button>
);

export default SpecialButton;
