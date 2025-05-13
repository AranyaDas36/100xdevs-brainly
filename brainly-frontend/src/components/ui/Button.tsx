import { ReactElement } from 'react';

export interface ButtonProps {
    variant: "primary" | "secondary";
    size: "md" | "sm" | "lg";
    text: string;
    startIcon?: ReactElement;
    endIcon?: ReactElement;
    onClick: () => void;
}

export const Button = ({ variant, size, text, startIcon, endIcon, onClick }: ButtonProps) => {
    const baseClasses = "flex items-center justify-center rounded-md font-semibold";
    const variantClasses = variant === "primary" 
        ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer m-3" 
        : "bg-gray-300 text-black hover:bg-gray-400 cursor-pointer";

    const sizeClasses = {
        sm: "px-2 py-1 text-sm",
        md: "px-4 py-2 text-md",
        lg: "px-6 py-3 text-lg"
    }[size];

    return (
        <button 
            className={`${baseClasses} ${variantClasses} ${sizeClasses}`}
            onClick={onClick}
        >
            {startIcon && <span className="mr-2">{startIcon}</span>}
            {text}
            {endIcon && <span className="ml-2">{endIcon}</span>}
        </button>
    );
}
