import React, { useEffect } from 'react';
import { useAd } from '../context/AdContext';

const BannerAd = () => {
    const { showBanner, hideBanner } = useAd();

    useEffect(() => {
        showBanner();
        // Cleanup function to hide the banner when the component unmounts
        return () => {
            hideBanner();
        };
    }, [showBanner, hideBanner]);

    // This is now a standard block component, not fixed.
    // It will be placed in the normal document flow.
    return (
        <div className="w-full max-w-md mx-auto h-[50px] bg-gray-800 flex items-center justify-center text-white rounded-xl border border-gray-600 shadow-lg flex-shrink-0">
            <p className="text-sm font-semibold">Banner Ad</p>
        </div>
    );
};

export default BannerAd;