import React from 'react';

export const Card = ({ children, className = '', title, action }) => {
    return (
        <div className={`glass-panel ${className}`}>
            {(title || action) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    {title && <h3 style={{ margin: 0 }}>{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
};
