import { useState } from 'react'
import { Plus } from 'lucide-react' 
import { motion } from 'framer-motion'
import CreateDeployment from '@/components/modals/CreateDeployment'
import Alert from '@/components/ui/Alert'
import { History } from '@/components/common/History'
import { Cards } from '@/components/common/DashboardCards'
import VoiceCommandResult from '@/components/modals/VoiceCommandResult'

const Home: React.FC = () => {
  const [isCreateDeploymentOPen, setIsCreateDeploymentOPen] = useState(false);
  const [isVoiceResultOPen, setIsVoiceResultOPen] = useState(false);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);
  
  const [voiceCommandData, setVoiceCommandData] = useState<{
    rawText: string;
    result: any;
  } | null>(null);
     
  const handleAlert = (type: string, message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000)
  }
  
  const handleVoiceCommandResult = (rawText: string, result: any) => {
    setVoiceCommandData({ rawText, result });
    setIsVoiceResultOPen(true);
  };
  
  const handleCloseVoiceResult = () => {
    setIsVoiceResultOPen(false);
    setTimeout(() => setVoiceCommandData(null), 300);
  };

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 h-full w-full overflow-x-hidden">
      <Cards onVoiceCommandResult={handleVoiceCommandResult} />

      <motion.div 
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-6 flex items-center justify-between gap-4"
      >
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          Recents
        </h2>
        <button  
          onClick={() => setIsCreateDeploymentOPen(true)}
          className="flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-red-500 h-10 px-4 text-sm font-bold tracking-wide text-black transition-transform hover:scale-105 whitespace-nowrap"
        >
          <Plus size={20} />
          <span className="hidden sm:inline truncate">Add New Deployment</span>
          <span className="sm:hidden">Add</span>
        </button>
      </motion.div>

      <div className="mt-4 w-full">
        <History/>
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