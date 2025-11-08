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
  }, []);

  const { duration, error, permissionGranted } = useAudioRecorder(
    isRecording,
    async (audioBlob: Blob) => {
      console.log("Recording saved!", audioBlob);
      setIsRecording(false);
      setStatusMessage("Processing voice command...");

      // Convert Blob to File before sending
      const audioFile = new File([audioBlob], "voice.wav", { type: "audio/wav" });
      const response = await processVoiceCommand(audioFile);

      if (response) {
        setStatusMessage("Command processed successfully!");
        
        // Pass the result to parent component (Dashboard)
        if (onVoiceCommandResult) {
          onVoiceCommandResult(response.raw_text, response);
        }
        
        // Clear status message after a moment
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
    <div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Voice Command Card */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          whileHover={{ 
            y: -10
          }}
          className={`glassmorphism-card border-white/10 text-white bg-gray-900 opacity-5 col-span-1 flex items-center justify-center rounded-xl border  p-6 shadow-lg`} 
        >
          <div className="flex flex-col items-center justify-center">
            <button 
              onClick={() => setIsRecording(!isRecording)}
              disabled={Boolean(error && !permissionGranted)}
              className={`group flex h-20 w-20 items-center justify-center rounded-full bg-red-500 transition-all duration-300 hover:scale-110 ${isRecording ? 'animate-pulse' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <MicIcon size={32} className="text-gray-50"/>
            </button>

            {/* Status Messages */}
            {isRecording && (
              <p className="mt-2 text-sm text-center">
                {statusMessage || "Listening..."}
              </p>
            )}
            {!isRecording && statusMessage && (
              <p className={`mt-2 text-sm text-center ${
                statusMessage.includes("success") ? "text-green-400" : 
                statusMessage.includes("Failed") || statusMessage.includes("error") ? "text-red-400" : 
                ""
              }`}>
                {statusMessage}
              </p>
            )}

            {/* Show mic instructions */}
            {!isRecording && !statusMessage && (
              <p className="mt-2 text-xs text-gray-500 text-center">
                Click to start recording
              </p>
            )}
          </div>
        </motion.div>
        
        {/* Balance Card */}
        <motion.div 
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          whileHover={{ 
            y: -10
          }}
          className={`glassmorphism-card border-white/10 text-white bg-gray-900 opacity-5 col-span-1 flex flex-col items-center justify-center rounded-xl border  p-6 shadow-lg`}
        > 
          <h3 className={`text-lg font-medium text-gray-300`}>AKT Balance</h3>
          <p className="text-2xl font-bold tracking-tight text-red-500">123.45 AKT</p>
        </motion.div>

        {/* Deployment Count Card */}
        <motion.div
          initial={{ opacity: 0, y: 23 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          whileHover={{ 
            y: -10
          }}
          className={`glassmorphism-card border-white/10 text-white bg-gray-900 opacity-5 flex justify-center item-center rounded-xl border p-6 shadow-lg`}
        >
          <div className="flex flex-col items-center justify-center">
            <p className={`text-base font-medium text-gray-300`}>Total Deployments</p>
            <p className={`text-2xl font-bold text-white`}>{deploymentCount}</p>
          </div>
        </motion.div> 

      </div>
    </div>
  )
}