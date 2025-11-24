import React, { useEffect, useState } from 'react';
import CoinIcon from './icons/CoinIcon';

const CoinExplosion = ({ onComplete }: { onComplete: () => void }) => {
    const [coins, setCoins] = useState<any[]>([]);

    useEffect(() => {
        const newCoins = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            size: Math.random() * 20 + 20,
            style: {
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`,
                transition: `all ${0.6 + Math.random() * 0.6}s cubic-bezier(0, .9, .57, 1)`,
            }
        }));
        setCoins(newCoins);

        setTimeout(() => {
            setCoins(currentCoins => currentCoins.map(coin => ({
                ...coin,
                style: {
                    ...coin.style,
                    left: `${Math.random() * 120 - 10}%`, // Allow going off-screen
                    top: `${Math.random() * 120 - 10}%`,
                    opacity: 0,
                    transform: `translate(-50%, -50%) scale(0.3) rotate(${Math.random() * 720}deg)`
                }
            })));
        }, 50);

        setTimeout(onComplete, 2000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none z-50">
            {coins.map(coin => (
                <div key={coin.id} className="absolute" style={coin.style}>
                    <CoinIcon className={`w-auto h-auto`} style={{width: coin.size, height: coin.size}}/>
                </div>
            ))}
        </div>
    );
};

export default CoinExplosion;