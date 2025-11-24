
import React, { useState } from 'react';
import GlassCard from '../components/GlassPanel';
import { useData } from '../context/DataContext';
import PremiumButton from '../components/PremiumButton';
import { ContactIcon3D } from '../components/icons/NavIcons';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const ContactScreen = () => {
    const { user, generateApiToken, secureSubmitContactForm } = useData();
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [messageSent, setMessageSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !subject || !message) {
            return;
        }
        setIsSending(true);

        const formData = { name, email, subject, message };
        const token = generateApiToken('submitContactForm', formData);
        const result = await secureSubmitContactForm(formData, token);

        if (result.success) {
            setMessageSent(true);
        } else {
            alert("Failed to send message. Please try again.");
        }
        setIsSending(false);
    };

    const inputStyles = "w-full bg-black/40 backdrop-blur-sm border-2 border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all duration-300 shadow-inset-3d placeholder-gray-400";
    const labelStyles = "block text-sm font-semibold text-gray-200 mb-2 ml-1";
    
    if (messageSent) {
        return (
            <div className="p-6 flex flex-col items-center justify-center h-full animate-fade-in">
                <GlassCard className="w-full max-w-md text-center">
                    <div className="flex flex-col items-center gap-4">
                        <CheckCircleIcon className="w-20 h-20 text-green-400" />
                        <h2 className="text-2xl font-bold">Message Sent!</h2>
                        <p className="text-gray-300">Thank you for contacting us. We will get back to you as soon as possible.</p>
                        <PremiumButton onClick={() => setMessageSent(false)} className="mt-4">
                            Send Another Message
                        </PremiumButton>
                    </div>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="p-4 flex flex-col items-center h-full animate-fade-in overflow-y-auto">
            <GlassCard className="w-full max-w-md">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-20 h-20 mb-2">
                        <ContactIcon3D />
                    </div>
                    <h1 className="text-2xl font-bold">Contact Us</h1>
                    <p className="text-gray-300">Have a question or feedback? Let us know!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className={labelStyles}>Your Name</label>
                        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputStyles} />
                    </div>
                    <div>
                        <label htmlFor="email" className={labelStyles}>Your Email</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputStyles} />
                    </div>
                    <div>
                        <label htmlFor="subject" className={labelStyles}>Subject</label>
                        <input id="subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., Withdrawal Issue" required className={inputStyles} />
                    </div>
                    <div>
                        <label htmlFor="message" className={labelStyles}>Message</label>
                        <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Describe your issue or feedback..." required className={`${inputStyles} resize-none`}></textarea>
                    </div>
                    <PremiumButton type="submit" disabled={isSending}>
                        {isSending ? 'Sending...' : 'Send Message'}
                    </PremiumButton>
                </form>
            </GlassCard>
        </div>
    );
};

export default ContactScreen;