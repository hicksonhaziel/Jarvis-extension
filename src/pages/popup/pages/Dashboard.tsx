import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react' 
import { motion } from 'framer-motion'
import CreateDeployment from '@/components/modals/CreateDeployment'
import Alert from '@/components/ui/Alert'
import { useTheme } from '@/components/layout/ThemeContext'
import { History } from '@/components/common/History'
import { Cards } from '@/components/common/DashboardCards'
import VoiceCommandResult from '@/components/modals/VoiceCommandResult'

const Home: React.FC = () => {
  const { theme, loading } = useTheme();
  
  // Booleans Fields
  const [isCreateDeploymentOPen, setIsCreateDeploymentOPen] = useState(false);
  const [isVoiceResultOPen, setIsVoiceResultOPen] = useState(false);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);
  
  // Voice command state
  const [voiceCommandData, setVoiceCommandData] = useState<{
    rawText: string;
    result: any;
  } | null>(null);
  
  if (loading) return null;
     
  const handleAlert = (type: string, message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000)
  }

  // Handler to receive voice command result from Cards
  const handleVoiceCommandResult = (rawText: string, result: any) => {
    setVoiceCommandData({ rawText, result });
    setIsVoiceResultOPen(true);
  };

  // Close voice result modal
  const handleCloseVoiceResult = () => {
    setIsVoiceResultOPen(false);
    // Clear data after modal closes
    setTimeout(() => setVoiceCommandData(null), 300);
  };

  return (
    <div className="flex-1 p-10 w-[500px] min-h-[700px]">
      {/* Top contents with voice command handler */}
      <Cards onVoiceCommandResult={handleVoiceCommandResult} />

      {/* New Deployment */}
      <motion.div 
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 flex items-center justify-between"
      >
        <h2 className={`text-2xl font-bold tracking-[-0.015em] ${theme === 'light' ? 'text-black' : 'text-white'}`}>
          Recents
        </h2>
        <button  
          onClick={() => setIsCreateDeploymentOPen(true)}
          className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#00D2FF] h-12 px-6 text-base font-bold tracking-[0.015em] text-black transition-transform hover:scale-105"
        >
          <Plus size={26} />
          <span className="truncate">Add New Deployment</span>
        </button>
      </motion.div>

      <div className="mt-4 flow-root">
        <div className="-my-2 overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <History/>
          </div>
        </div>
      </div>

      <CreateDeployment 
        isOPen={isCreateDeploymentOPen}
        onClose={() => setIsCreateDeploymentOPen(false)}
        onAlert={handleAlert}
      />

      <VoiceCommandResult
        isOPen={isVoiceResultOPen}
        onClose={handleCloseVoiceResult}
        text={voiceCommandData?.rawText || ''}
        result={voiceCommandData?.result || null}
      />

      <Alert 
        isOpen={!!alert}
        onClose={() => setAlert(null)}
        type={alert?.type || ""}
        message={alert?.message || ""}
      />
    </div>
  )
}

export default Home