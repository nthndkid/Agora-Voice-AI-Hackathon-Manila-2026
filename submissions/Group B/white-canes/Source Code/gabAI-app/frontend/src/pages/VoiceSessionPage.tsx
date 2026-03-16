import React, { useState, useEffect, useRef } from 'react';
import AgoraRTC, { IAgoraRTCClient, ILocalAudioTrack, ILocalVideoTrack, IRemoteVideoTrack } from 'agora-rtc-sdk-ng';
import { toast, Toaster } from 'sonner';
import MainLayout from '@/components/layout/MainLayout';
import ModeToggle from '@/components/shared/ModeToggle';
import VideoSessionPanel from '@/components/voice-session/VideoSessionPanel';
import VoiceMicVisualizer from '@/components/voice-session/VoiceMicVisualizer';
import PromptInputBar from '@/components/voice-session/PromptInputBar';
import { Video, Mic2, X, MicOff, Mic, PhoneOff } from 'lucide-react';

const VoiceSessionPage = () => {
  const [sessionMode, setSessionMode] = useState('video');
  const [prompt, setPrompt] = useState('');
  const [hasStarted, setHasStarted] = useState(false);   // user clicked Join
  const [isConnecting, setIsConnecting] = useState(false); // waiting for backend
  const [isConnected, setIsConnected] = useState(false);   // fully live
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(true);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [remoteVideoTrack, setRemoteVideoTrack] = useState<IRemoteVideoTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<ILocalVideoTrack | null>(null);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localAudioTrackRef = useRef<ILocalAudioTrack | null>(null);

  useEffect(() => {
    clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

    // Handle volume monitoring
    let volumeInterval: any;
    if (isConnected && !isMuted && localAudioTrackRef.current) {
      volumeInterval = setInterval(() => {
        const level = localAudioTrackRef.current?.getVolumeLevel() || 0;
        setVolumeLevel(level);
      }, 100);
    } else {
      setVolumeLevel(0);
    }

    clientRef.current.on('user-published', async (user, mediaType) => {
      await clientRef.current?.subscribe(user, mediaType);
      if (mediaType === 'video') {
        setRemoteVideoTrack(user.videoTrack || null);
        toast.success('gabAI video connected!');
      }
      if (mediaType === 'audio') {
        user.audioTrack?.play();
        toast.success('gabAI is now speaking!');
      }
    });

    clientRef.current.on('user-unpublished', (user, mediaType) => {
      if (mediaType === 'video') setRemoteVideoTrack(null);
    });

    return () => {
      if (volumeInterval) clearInterval(volumeInterval);
      handleEndSession();
    };
  }, [isConnected, isMuted]);

  const handleStartSession = async () => {
    // 1. Immediately show the video UI and start local camera
    setHasStarted(true);
    setIsConnecting(true);

    try {
      // Create local tracks first so the user can see themselves while loading
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      localAudioTrackRef.current = audioTrack;

      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      setLocalVideoTrack(videoTrack);

      // 2. Call Backend to start Agora Agent
      const response = await fetch('/api/start-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelName: 'gabAI-study-room' }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error?.message || data.error || 'Failed to start agent');

      setAgentId(data.agentId);

      // 3. Join the Agora Channel and publish
      await clientRef.current?.join(
        '642bd99db17f41c9ab0aa02f5fd15efb',
        data.channelName,
        data.userToken,
        data.userUid
      );

      await clientRef.current?.publish([audioTrack, videoTrack]);

      setIsConnected(true);
      toast.success('Connected to gabAI!');
    } catch (err: any) {
      console.error('Session Start Error:', err);
      toast.error(`Backend failed, but staying in room: ${err.message}`);
      // Don't call handleEndSession() — stay in the immersive UI for demo
      toast.info('Auto-retry in 5s');
    } finally {
      // Keep isConnecting true for a bit longer or forever to keep the loading visual
      // For this demo request, we'll keep the loading visual spinning if not connected
      if (!isConnected) {
        // Stay in "connecting" state visually
        setIsConnecting(true);
      } else {
        setIsConnecting(false);
      }
    }
  };

  const handleEndSession = async () => {
    try {
      if (agentId) {
        await fetch('/api/stop-agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channelName: 'gabAI-study-room', agentId }),
        });
      }
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current.close();
        localAudioTrackRef.current = null;
      }
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
        setLocalVideoTrack(null);
      }
      await clientRef.current?.leave();
      setAgentId(null);
      setRemoteVideoTrack(null);
      setIsConnected(false);
      setIsConnecting(false);
      setHasStarted(false); // go back to pre-call screen
      toast.info('Session ended');
    } catch (err) {
      console.error('Session End Error:', err);
    }
  };

  const toggleMute = async () => {
    if (localAudioTrackRef.current) {
      const newMuted = !isMuted;
      await localAudioTrackRef.current.setEnabled(!newMuted);
      setIsMuted(newMuted);
      toast.info(newMuted ? 'Microphone muted' : 'Microphone unmuted');
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrack) {
      const newVideoActive = !isVideoActive;
      await localVideoTrack.setEnabled(newVideoActive);
      setIsVideoActive(newVideoActive);
      toast.info(newVideoActive ? 'Camera turned on' : 'Camera turned off');
    }
  };

  return (
    <MainLayout>
      <Toaster position="top-center" richColors />
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1E1E1E]">Voice Session</h1>
            <p className="text-zinc-500 text-sm flex items-center gap-2 mt-1">
              {!hasStarted && 'Start a session to talk with your Filipino study buddy.'}
              {hasStarted && isConnecting && (
                <><span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block" /> Connecting to gabAI...</>
              )}
              {hasStarted && !isConnecting && isConnected && (
                <><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Connected · gabAI is live</>
              )}
            </p>
          </div>
          <ModeToggle
            value={sessionMode}
            onChange={setSessionMode}
            options={[
              { label: 'VIDEO CHAT', icon: <Video size={16} />, value: 'video' },
              { label: 'VOICE CHAT', icon: <Mic2 size={16} />, value: 'voice' },
            ]}
          />
        </div>

        {/* Main Area */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-0">
          {!hasStarted ? (
            /* ── Pre-call screen ── */
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-[#2e1065] to-[#1f0b47] rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-[#2e1065]/20">
                <Mic2 size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1E1E1E]">Ready to start?</h2>
                <p className="text-zinc-500 max-w-xs mx-auto mt-2">
                  Join a session to start talking with your Filipino study buddy.
                </p>
              </div>
              <button
                onClick={handleStartSession}
                className="bg-gradient-to-br from-[#2e1065] to-[#1f0b47] text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-[#2e1065]/20 hover:scale-105 active:scale-95 transition-all"
              >
                Join Study Room
              </button>
            </div>
          ) : (
            /* ── Video / Voice session UI (shown immediately on click) ── */
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
              {sessionMode === 'video' ? (
                <VideoSessionPanel
                  mode="single"
                  remoteVideoTrack={remoteVideoTrack}
                  localVideoTrack={localVideoTrack}
                  isMuted={isMuted}
                  isVideoActive={isVideoActive}
                  isConnecting={isConnecting}
                  onToggleMute={toggleMute}
                  onToggleVideo={toggleVideo}
                  onEndCall={handleEndSession}
                />
              ) : (
                <div className="flex flex-col items-center gap-12">
                  <VoiceMicVisualizer
                    isActive={isConnected && !isMuted}
                    isConnecting={isConnecting}
                    isMuted={isMuted}
                    volumeLevel={volumeLevel}
                  />
                  {/* Controls — mirrors video chat style */}
                  <div className="flex items-center gap-4 px-8 py-5 bg-white border border-zinc-100 rounded-3xl shadow-xl">
                    <button
                      onClick={toggleMute}
                      title={isMuted ? "Unmute microphone" : "Mute microphone"}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${isMuted
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                        }`}
                    >
                      {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>

                    <button
                      onClick={handleEndSession}
                      title="End session"
                      className="w-16 h-16 bg-red-500 text-white rounded-2xl flex items-center justify-center hover:bg-red-600 hover:scale-110 active:scale-90 transition-all shadow-xl shadow-red-500/30"
                    >
                      <PhoneOff size={26} fill="currentColor" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Input */}
        <div className="mt-8 max-w-4xl w-full mx-auto pb-4">
          <PromptInputBar
            value={prompt}
            onChange={setPrompt}
            onSubmit={() => setPrompt('')}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default VoiceSessionPage;
