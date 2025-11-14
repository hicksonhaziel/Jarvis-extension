import { useApi } from "@/hooks/useApi"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MicIcon } from "lucide-react"
import { useAudioRecorder } from '@/hooks/useAudioRecoder'

interface CardsProps {
  onVoiceCommandResult?: (rawText: string, result: any) => void;
}

export const Cards = ({ onVoiceCommandResult }: CardsProps) => {
  const { listDeployments, processVoiceCommand } = useApi();

  const [isRecording, setIsRecording] = useState(false);
  const [deploymentCount, setDeploymentCount] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeployments = async () => {
      const deployments = await listDeployments();
      if (deployments?.deployments) {
        setDeploymentCount(deployments.deployments.length);
      }
    };
    fetchDeployments();
  }, [listDeployments]);

  const { duration, error, permissionGranted } = useAudioRecorder(
    isRecording,
    async (audioBlob: Blob) => {
      console.log("Recording saved!", audioBlob);
      setIsRecording(false);
      setStatusMessage("Processing voice command...");

      const audioFile = new File([audioBlob], "voice.wav", { type: "audio/wav" });
      const response = await processVoiceCommand(audioFile);

      if (response) {
        setStatusMessage("Command processed successfully!");
        
        if (onVoiceCommandResult) {
          onVoiceCommandResult(response.raw_text, response);
        }
        
        setTimeout(() => {
          setStatusMessage(null);
        }, 2000);
      } else {
        setStatusMessage("Failed to process command.");
        setTimeout(() => {
          setStatusMessage(null);
        }, 3000);
      }
    },
    (err: string) => {
      console.error("Recording error:", err);
      setStatusMessage("Recording error.");
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    }
  );

  useEffect(() => {
    if (duration >= 30000 && isRecording) {
      setIsRecording(false);
    }
  }, [duration, isRecording]);

  return (
    <div className="w-full max-w-full">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          whileHover={{ y: -10 }}
          className="glassmorphism-card border-white/10 text-white bg-gray-900/50 col-span-1 flex items-center justify-center rounded-xl border p-4 shadow-lg min-h-[140px]"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <button 
              onClick={() => setIsRecording(!isRecording)}
              disabled={Boolean(error && !permissionGranted)}
              className={`group flex h-16 w-16 items-center justify-center rounded-full bg-red-500 transition-all duration-300 hover:scale-110 ${isRecording ? 'animate-pulse' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <MicIcon size={24} className="text-gray-50"/>
            </button>

            {isRecording && (
              <p className="mt-1 text-xs text-center text-gray-300">
                {statusMessage || "Listening..."}
              </p>
            )}
            {!isRecording && statusMessage && (
              <p className={`mt-1 text-xs text-center ${
                statusMessage.includes("success") ? "text-green-400" : 
                statusMessage.includes("Failed") || statusMessage.includes("error") ? "text-red-400" : 
                "text-gray-300"
              }`}>
                {statusMessage}
              </p>
            )}

            {!isRecording && !statusMessage && (
              <p className="mt-1 text-xs text-gray-500 text-center">
                Click to start recording
              </p>
            )}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          whileHover={{ y: -10 }}
          className="glassmorphism-card border-white/10 text-white bg-gray-900/50 col-span-1 flex flex-col items-center justify-center rounded-xl border p-4 shadow-lg min-h-[140px]"
        > 
          <h3 className="text-sm font-medium text-gray-300">AKT Balance</h3>
          <p className="text-xl font-bold tracking-tight text-red-500">123.45 AKT</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 23 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          whileHover={{ y: -10 }}
          className="glassmorphism-card border-white/10 text-white bg-gray-900/50 flex justify-center items-center rounded-xl border p-4 shadow-lg min-h-[140px]"
        >
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-gray-300">Total Deployments</p>
            <p className="text-xl font-bold text-white">{deploymentCount}</p>
          </div>
        </motion.div> 
      </div>
    </div>
  )
}