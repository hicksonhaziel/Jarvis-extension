import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Modal from "../ui/Modal";
import React from "react";

interface VoiceCommandResultProps {
  isOPen: boolean;
  text: string;
  result: any;
  onClose: () => void;
}

const VoiceCommandResult: React.FC<VoiceCommandResultProps> = ({ isOPen, text, result, onClose}) => {
  // Safely extract values from result object
  const commandAction = result?.command?.action || 'N/A';
  const commandImage = result?.command?.image || 'N/A';
  const resultStatus = result?.result?.status || result?.status || 'N/A';
  const deploymentId = result?.result?.deployment_id || 'N/A';
  const resultMessage = result?.result?.message || '';

  return (
    <AnimatePresence>
      {isOPen && (
        <Modal>
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4 }}
            className="w-[250px] max-w-4xl h-[275px] flex flex-col glassmorphism-card overflow-hidden border border-white/10 shadow-2xl rounded-xl duration-300"
          >
            {/* Header */}
            <header className="flex items-center justify-between p-3 border-b border-white/10">
              <h2 className="text-xl font-bold tracking-tight text-white">
                Voice Command Result
              </h2>
              <button
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </header>

            
            <main className="flex-grow p-3 overflow-y-auto text-white space-y-6">

              {/* Voice Input */}
              <div className="space-y-2">
                <div>
                  <p className="text-xs uppercase text-white/50 mb-1">Voice Input</p>
                  <p className="font-mono text-sm bg-white/5 p-3 rounded-lg border border-white/10">
                    {text || 'No text provided'}
                  </p>
                </div>
              </div>

              {/* Command Details */}
              <div className="space-y-2">
                <p className="text-xs uppercase text-white/50 mb-2">Command Details</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                    <p className="text-xs text-white/50 mb-1">Action</p>
                    <p className="font-mono text-sm">{commandAction}</p>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                    <p className="text-xs text-white/50 mb-1">Image</p>
                    <p className="font-mono text-sm">{commandImage}</p>
                  </div>
                </div>
              </div>

              {/* Deployment Result */}
              <div className="space-y-2">
                <p className="text-xs uppercase text-white/50 mb-2">Deployment Result</p>
                <div className="space-y-3">
                  <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                    <p className="text-xs text-white/50 mb-1">Status</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                      resultStatus === 'success' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-yellow-500 text-gray-900'
                    }`}>
                      {resultStatus}
                    </span>
                  </div>
                  
                  {deploymentId !== 'N/A' && (
                    <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                      <p className="text-xs text-white/50 mb-1">Deployment ID</p>
                      <p className="font-mono text-xs break-all">{deploymentId}</p>
                    </div>
                  )}

                  {resultMessage && (
                    <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                      <p className="text-xs text-white/50 mb-1">Message</p>
                      <p className="text-sm">{resultMessage}</p>
                    </div>
                  )}
                </div>
              </div>
            </main>

            <footer className="flex items-center justify-between p-3 border-t border-white/10">
              <button
                onClick={onClose}
                className="px-3 py-1 rounded-lg text-white font-bold bg-transparent border border-white/20 hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                Close
              </button>
            </footer>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  )
}

export default VoiceCommandResult