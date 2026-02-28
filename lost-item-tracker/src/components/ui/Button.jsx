import React from 'react';

export const Button = ({ children, variant = 'primary', icon, className = '', ...props }) => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;

    if (variant === 'icon') {
        return (
            <button className={`${baseClass}-icon ${className}`} {...props}>
                {icon || children}
            </button>
        )
    }

    return (
        <button className={`${baseClass} ${variantClass} ${className}`} {...props}>
            {icon && <span className="btn-icon-wrapper">{icon}</span>}
            {children}
        </button>
    );
};
