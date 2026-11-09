'use client'
import React, { useRef } from 'react'
import { getSubjectColor } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useEffect } from 'react';
import { vapi } from '@/lib/vapi.sdk';
import Image from 'next/image';
import { Lottie, type LottieHandle } from 'lottie-react';
import soundwaves from '@/constants/soundwaves.json';
import { configureAssistant } from '@/lib/utils';
import { addToSessionHistory } from '@/lib/actions/companion.action';
enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED', 
}

function getCallErrorMessage(error: unknown): string {
    const seen = new Set<object>();
    function extract(value: unknown): string | undefined {
        if (typeof value === 'string' && value.trim()) return value;
        if (!value || typeof value !== 'object' || seen.has(value)) return;
        seen.add(value);
        if (Array.isArray(value)) {
            return value.map(extract).filter(Boolean).join('; ') || undefined;
        }
        const details = value as Record<string, unknown>;
        const message = extract(details.message) ?? extract(details.error)
            ?? extract(details.data) ?? extract(details.response) ?? extract(details.cause);
        const context = [details.stage, details.type,
            typeof details.status === 'number' ? `HTTP ${details.status}` : undefined]
            .filter(value => typeof value === 'string' && value.length > 0)
            .join(', ');
        return [context, message].filter(Boolean).join(': ') || undefined;
    }
    return extract(error) ?? 'Vapi returned no error details. Check the failed request in the browser Network tab.';
}

function CompanionComponent({subject, name, topic, userName, userImage, style, voice, companionId}: 
    CompanionComponentProps) {
        const[callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
        const[isSpeaking, setIsSpeaking] = useState(false);
        const lottieRef = useRef<LottieHandle>(null);
        const [isAnimationReady, setIsAnimationReady] = useState(false);
        const [isMuted, setIsMuted] = useState(false);
        const [messages, setMessages] = useState<SavedMessage[]>([]);
        const [partialMessage, setPartialMessage] = useState<SavedMessage | null>(null);
        const [callError, setCallError] = useState<string | null>(null);

        useEffect(() => {
            if (callStatus !== CallStatus.CONNECTING) return;
            const timeout = window.setTimeout(() => {
                setCallError('The call took too long to connect. Check microphone permissions and your connection, then try again.');
                setCallStatus(CallStatus.FINISHED);
                vapi.stop();
            }, 45000);
            return () => window.clearTimeout(timeout);
        }, [callStatus]);

        useEffect(() => {
            if (isAnimationReady) {
                if(isSpeaking && callStatus === CallStatus.ACTIVE) {
                    lottieRef.current?.play();

                } else {
                    lottieRef.current?.stop();
                }
            }
        }, [isSpeaking, callStatus, isAnimationReady]);

        

        useEffect(() => {
            let startedCompanionId: string | null = null;
            const onCallStart = () => {
                startedCompanionId = companionId || null;
                setIsMuted(vapi.isMuted());
                setCallStatus(CallStatus.ACTIVE);
            };
            const onCallEnd = () => {
                setCallStatus(CallStatus.FINISHED);
                setIsMuted(false);
                setIsSpeaking(false);
                setPartialMessage(null);
                const completedCompanionId = startedCompanionId;
                startedCompanionId = null;
                if (!completedCompanionId) return;
                void addToSessionHistory(completedCompanionId).catch((error: unknown) => {
                    setCallError(`Session history could not be saved: ${getCallErrorMessage(error)}`);
                });
            };
            const onMessage = (message: Message) => 
            {
                if(message.type === 'transcript') {
                    const newMessage = {role: message.role, content: message.transcript}
                    if (message.transcriptType === 'final') {
                        setMessages(prev => [newMessage, ... prev]);
                        setPartialMessage(previous => previous?.role === message.role ? null : previous);
                    } else {
                        setPartialMessage(newMessage);
                    }
                }
            }
            const onSpeechStart = () => setIsSpeaking(true);
            const onSpeechEnd = () => setIsSpeaking(false);
            const onError = (error: unknown) => {
                const message = getCallErrorMessage(error);
                console.error(`Vapi call error: ${message}`);
                setCallError(message);
                // Audio processing setup is optional; the SDK continues the call.
                if (error && typeof error === 'object' && 'type' in error &&
                    error.type === 'audio-processing-setup-error') return;
                setCallStatus(CallStatus.FINISHED);
                setIsSpeaking(false);
                setIsMuted(false);
                vapi.stop();
            };

            vapi.on('call-start', onCallStart);
            vapi.on('call-end', onCallEnd);
            vapi.on('message', onMessage);
            vapi.on('error', onError);
            vapi.on('speech-start', onSpeechStart);
            vapi.on('speech-end', onSpeechEnd);

            return () => {
                vapi.off('call-start', onCallStart);
                vapi.off('call-end', onCallEnd);
                vapi.off('message', onMessage);
                vapi.off('error', onError);
                vapi.off('speech-start', onSpeechStart);
                vapi.off('speech-end', onSpeechEnd);
            };
        }, [companionId]);

        const toggleMicrophone = () => {
            if (callStatus !== CallStatus.ACTIVE) return;

            try {
                const nextMuted = !vapi.isMuted();
                vapi.setMuted(nextMuted);
                setIsMuted(nextMuted);
            } catch (error) {
                console.error('Unable to toggle microphone', error);
            }
        };

        const handleDisconnectCall = () => {
            vapi.stop();
        };
 
        const handleCall = async () => {
            if (callStatus === CallStatus.CONNECTING || callStatus === CallStatus.ACTIVE) return;
            if (!companionId) {
                setCallError('The companion ID is missing. Reload this session page before starting a call.');
                return;
            }
            setCallError(null);
            setCallStatus(CallStatus.CONNECTING);
            try {
            if (!process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN) {
                throw new Error('The Vapi public token is missing. Set NEXT_PUBLIC_VAPI_WEB_TOKEN and restart the dev server.');
            }
            const assistantOverrides = {
                variableValues : {
                    subject,topic,style
                },
                //clientMessages: ['transcript'],
                //serverMessages: [],
            }
            const call = await vapi.start(configureAssistant(voice, style), assistantOverrides);
            if (!call) {
                setCallError(previous => previous ?? 'Vapi could not start the call. Check microphone permissions and your Vapi configuration.');
                setCallStatus(CallStatus.FINISHED);
            }
            } catch (error) {
                console.error('Unable to start Vapi call', error);
                setCallError(getCallErrorMessage(error));
                setCallStatus(CallStatus.FINISHED);
                vapi.stop();
            }
        };

        

        const handleDisconnect = () => {
            setCallStatus(CallStatus.FINISHED);
            vapi.stop();
        };

  return (
    <section className = "flex flex-col h-[70vh]">
        <section className = "flex gap-8 max-sm:flex-col">
            <div className = "companion-section">
                <div className = "companion-avatar" 
                style={{backgroundColor: getSubjectColor(subject)}}>
                    <div className = {cn('absolute transition-opacity duration-1000', 
                        callStatus === CallStatus.FINISHED||
                        callStatus === CallStatus.INACTIVE?'opacity-100':'opacity-0', 
                        callStatus === CallStatus.CONNECTING && 'opacity-100 animate-pulse')}>
                        <Image src ={`/icons/${subject}.svg`} alt = {subject} width = {100} height = {100}
                        className = "max-sm:w-fit" />
                    </div>

                    <div className = {cn('absolute transition-opacity duration-1000', 
                        callStatus === CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0')}>
                            <Lottie lottieRef = {lottieRef}
                            src = {soundwaves}
                            autoplay = {false}
                            loop
                            subscriptions={{ ready: () => setIsAnimationReady(true) }}
                            className =  "companion-lottie"/>
                    </div>
                </div>
                <p className = "font-bold text-2xl">
                    {name}
                </p>
            </div>
            <div className = "user-section">
                <div className = "user-avatar">
                        <Image src = {userImage}
                        alt = {userName} width = {50} height = {50} />
                        <p  className = "font-bold text-2xl">{userName}</p>
                </div>
                <button className = "btn-mic disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={callStatus !== CallStatus.ACTIVE}
                    onClick={toggleMicrophone}>
                        <Image src = {isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'} 
                        alt = "mic" width = {36} height = {36} />
                        <p className = "max-sm:hidden">
                            {isMuted ? 'Turn on microphone' : 'Turn off microphone'}
                        </p>
                </button>
                <button className = {cn('rounded-lg py-2 cursor-pointertransition-colorsw-full text-white', 
                    callStatus === CallStatus.ACTIVE ? 'bg-red-500' : 'bg-primary', 
                    callStatus === CallStatus.CONNECTING && 'animate-pulse')} 
                    disabled={callStatus === CallStatus.CONNECTING}
                    onClick={callStatus === CallStatus.ACTIVE ? handleDisconnectCall : handleCall}>
                        {callStatus === CallStatus.ACTIVE ? 'End Call' : callStatus === CallStatus.CONNECTING ? 'Connecting...' : 'Start Call'}
                </button>
                {callError && <p role="alert" className="text-sm text-red-600">{callError}</p>}
            </div>
        </section>

        <section className="transcript">
            <div className="transcript-message no-scrollbar">
                {partialMessage && (
                    <p className="opacity-60 max-sm:text-sm">
                        {partialMessage.role === 'assistant' ? name : userName}: {partialMessage.content}
                        <span className="text-sm"> (recognizing...)</span>
                    </p>
                )}
                {messages.map((message, index) => {
                    if(message.role === 'assistant') {
                        return (
                            <p key = {index} className = "max-sm:text-sm">
                                {name.split(' ')[0]
                                .replace('/[.,]/g', '')}: 
                                {message.content}
                            </p>
                        )
                    } else {
                        return (
                            <p key = {index} className = "texr -primary max-sm:text-sm">
                                {userName}: 
                                {message.content}
                            </p> 
                        )
                    }
                })
                }
            </div>
            <div className = "transcript-fade"/>
        </section>
    </section>
  )
}

export default CompanionComponent
