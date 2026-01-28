import React, { useEffect, useState, useCallback } from 'react';
import { Button } from './Button';
import { Hexagon, Zap } from 'lucide-react';

interface ApiKeyCheckerProps {
  onReady: (skipped?: boolean) => void;
}

export const ApiKeyChecker: React.FC<ApiKeyCheckerProps> = ({ onReady }) => {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkKey = useCallback(async () => {
    try {
      const aistudio = (window as any).aistudio;
      if (aistudio) {
        const selected = await aistudio.hasSelectedApiKey();
        if (selected) {
          setHasKey(true);
          onReady(false);
        } else {
            setHasKey(false);
        }
      }
    } catch (e) {
      console.error("Error checking session state:", e);
    } finally {
      setChecking(false);
    }
  }, [onReady]);

  useEffect(() => {
    checkKey();
  }, [checkKey]);

  const handleConnect = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
        try {
            // Internally this opens the key selector, but we present it as "Connecting Account"
            await aistudio.openSelectKey();
            await checkKey();
        } catch (e) {
            setError("Failed to verify Bambee license. Please try again.");
            if (e instanceof Error && e.message.includes("Requested entity was not found")) {
                await aistudio.openSelectKey();
                await checkKey();
            }
        }
    } else {
        setError("Environment check failed.");
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-yellow-400 rounded-xl rotate-45 mb-6 shadow-lg shadow-yellow-500/20"></div>
          <p className="font-medium tracking-wide text-gray-400">Loading Bambee Engine...</p>
        </div>
      </div>
    );
  }

  if (!hasKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white p-6 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/5 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-md w-full bg-[#1e293b]/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-700/50 text-center relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-orange-500/20">
            <Hexagon className="w-10 h-10 text-[#0f172a] fill-current" strokeWidth={2.5} />
          </div>
          
          <h1 className="text-3xl font-extrabold mb-3 tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Bambee</span>
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed text-sm">
            Please connect your account to activate the Bambee Pro engine. Usage is calculated based on your plan credits.
          </p>
          
          <Button onClick={handleConnect} className="w-full text-base py-4 font-bold shadow-lg shadow-yellow-500/20 mb-4 rounded-xl">
            <Zap className="w-4 h-4 mr-2 fill-current" />
            Connect Bambee Account
          </Button>

          <Button onClick={() => onReady(true)} variant="ghost" className="w-full text-gray-500 hover:text-white rounded-xl">
            Preview Interface Only
          </Button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-700/50 flex justify-center gap-6 text-[10px] uppercase tracking-widest text-gray-600 font-bold">
            <span>Bambee Basic</span>
            <span>•</span>
            <span>Bambee Pro</span>
            <span>•</span>
            <span>Enterprise</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};