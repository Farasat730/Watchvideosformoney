import React from 'react';

interface ToggleSwitchProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, label }) => {
    return (
        <button
            type="button"
            onClick={() => onChange(!enabled)}
            aria-pressed={enabled}
            aria-label={label || 'Toggle'}
            className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-brand-purple ${
                enabled ? 'bg-brand-purple' : 'bg-gray-600'
            }`}
        >
            <span className="sr-only">{label}</span>
            <span
                className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 shadow-md ${
                    enabled ? 'translate-x-7' : 'translate-x-1'
                }`}
            />
        </button>
    );
};

export default ToggleSwitch;