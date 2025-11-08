import { motion } from "framer-motion"
import { Server, RefreshCw, Trash2Icon } from 'lucide-react'

export const History = () => {

  return (
    <div>
        {/* Recent Activities  */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }} 
              className={`glassmorphism-card border-white/10 text-white bg-gray-900 opacity-5 overflow-hidden rounded-xl border shadow-lg`}
            >
              <div className="flex flex-col">
                <div className={`flex items-center gap-4 border-b border-white/10 border-white/10 hover:bg-white/5 p-4 transition-colors `}>
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#1A1B3A] text-[#00D2FF]`}>
                    <Server size={26} className='text-[#00D2FF]'/>
                  </div>
                  <div className="flex-grow">
                    <p className={`text-base font-medium text-white`}>Deployment #123</p>
                    <p className="text-sm text-gray-400">Deployment created successfully</p>
                  </div>
                  <div className="text-sm text-gray-500">2 min ago</div>
                </div>
                <div className={`flex items-center gap-4 border-b border-white/10 border-white/10 hover:bg-white/5 p-4 transition-colors `}>
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#1A1B3A]  text-[#00D2FF]`}>
                    <RefreshCw size={26} className='text-[#00D2FF]'/>
                  </div>
                  <div className="flex-grow">
                    <p className={`text-base font-medium text-white `}>Deployment #456</p>
                    <p className="text-sm text-gray-400">Deployment updated</p>
                  </div>
                  <div className="text-sm text-gray-500">1 hour ago</div>
                </div>
                <div className={`flex items-center gap-4 border-b border-white/10 border-white/10 hover:bg-white/5 p-4 transition-colors `}>
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#1A1B3A]  text-[#00D2FF]`}>
                    <Trash2Icon size={26} className='text-red-500'/>
                  </div>
                  <div className="flex-grow">
                    <p className={`text-base font-medium text-white `}>Deployment #789</p>
                    <p className="text-sm text-gray-400">Deployment deleted</p>
                  </div>
                  <div className="text-sm text-gray-500">1 day ago</div>
                </div>
              </div>
            </motion.div>
    </div>
  )
}
