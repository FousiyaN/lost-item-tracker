import React from 'react';

export const Input = ({ label, id, error, className = '', ...props }) => {
    return (
        <div className="input-group">
            {label && <label htmlFor={id}>{label}</label>}
            <input
                id={id}
                className={`input-field ${error ? 'input-error' : ''} ${className}`}
                {...props}
            />
            {error && <span style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '4px' }}>{error}</span>}
        </div>
    );
};
