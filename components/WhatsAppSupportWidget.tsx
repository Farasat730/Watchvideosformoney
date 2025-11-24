import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import WhatsAppIcon from './icons/WhatsAppIcon';
import { ChatBubbleLeftRightIcon, UsersIcon } from '@heroicons/react/24/solid';

const WhatsAppSupportWidget = () => {
    const { appConfig } = useData();
    const [isOpen, setIsOpen] = useState(false);
    // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> for browser compatibility, resolving the 'Cannot find namespace' error. This ensures the correct type is used for the setTimeout return value in a web environment.
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const supportLink = appConfig.globalSettings.supportLink247;
    const communityLink = appConfig.globalSettings.communitySupportLink;

    const clearTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const startTimer = () => {
        clearTimer();
        timerRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 8000);
    };

    useEffect(() => {
        if (isOpen) {
            startTimer();
        } else {
            clearTimer();
        }

        return () => clearTimer();
    }, [isOpen]);

    const toggleMenu = () => {
        setIsOpen(prev => !prev);
    };

    const handleOptionClick = (url: string) => {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
        setIsOpen(false);
    };

    return (
        <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-3">
            {/* Options Menu */}
            <div 
                className={`transition-all duration-300 ease-in-out flex flex-col items-end gap-3 ${
                    isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
            >
                {supportLink && (
                    <button 
                        onClick={() => handleOptionClick(supportLink)}
                        className="flex items-center gap-3 bg-gradient-to-br from-brand-blue to-brand-purple text-white font-semibold px-4 py-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform"
                    >
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                        <span>Support 24/7</span>
                    </button>
                )}
                 {communityLink && (
                    <button 
                        onClick={() => handleOptionClick(communityLink)}
                        className="flex items-center gap-3 bg-gradient-to-br from-brand-cyan to-brand-blue text-white font-semibold px-4 py-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform"
                    >
                        <UsersIcon className="w-5 h-5" />
                        <span>Community</span>
                    </button>
                )}
            </div>

            {/* Floating Icon */}
            <button 
                onClick={toggleMenu}
                className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40 transform transition-all duration-300 hover:scale-110 active:scale-95 animate-glow-green"
                aria-label="Open support menu"
            >
                 <WhatsAppIcon className="w-6 h-6 text-white" />
            </button>
        </div>
    );
}

export default WhatsAppSupportWidget;