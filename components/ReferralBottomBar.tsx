import React from 'react';
import { useData } from '../context/DataContext';
import GlassCard from './GlassPanel';
import PremiumButton from './PremiumButton';
import { InviteIcon3D } from './icons/NavIcons';

interface ReferralBottomBarProps {
    showLabel?: boolean;
}

const ReferralBottomBar: React.FC<ReferralBottomBarProps> = ({ showLabel = true }) => {
    const { user } = useData();

    const handleInvite = () => {
        const shareText = `Join Watch & Earn! Use my code to get a bonus: ${user.referralCode}.`;
        if (navigator.share) {
            navigator.share({
                title: 'Join Watch & Earn!',
                text: shareText,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(shareText);
            alert('Invite link copied to clipboard!');
        }
    };

    return (
        <GlassCard className="!p-4 border-t-2 border-brand-purple/50">
            <div className="flex justify-end items-center gap-4">
                <PremiumButton
                    onClick={handleInvite}
                    icon={!showLabel ? <InviteIcon3D /> : undefined}
                    className={showLabel ? "!w-32 !h-12 !text-sm flex-shrink-0" : "!w-16 !h-12 flex-shrink-0"}
                >
                    {showLabel && 'Invite'}
                </PremiumButton>
            </div>
        </GlassCard>
    );
};

export default ReferralBottomBar;
