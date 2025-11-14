import { motion } from "framer-motion"
import { Server, RefreshCw, Trash2Icon } from 'lucide-react'

export const History = () => {
  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }} 
        className="glassmorphism-card border-white/10 text-white bg-gray-900/50 overflow-hidden rounded-xl border shadow-lg"
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-3 border-b border-white/10 hover:bg-white/5 p-3 transition-colors">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1A1B3A]">
              <Server size={20} className="text-[#00D2FF]"/>
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-sm font-medium text-white truncate">Deployment #123</p>
              <p className="text-xs text-gray-400 truncate">Deployment created successfully</p>
            </div>
            <div className="text-xs text-gray-500 whitespace-nowrap">2 min ago</div>
          </div>
          
          <div className="flex items-center gap-3 border-b border-white/10 hover:bg-white/5 p-3 transition-colors">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1A1B3A]">
              <RefreshCw size={20} className="text-[#00D2FF]"/>
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-sm font-medium text-white truncate">Deployment #456</p>
              <p className="text-xs text-gray-400 truncate">Deployment updated</p>
            </div>
            <div className="text-xs text-gray-500 whitespace-nowrap">1 hour ago</div>
          </div>
          
          <div className="flex items-center gap-3 hover:bg-white/5 p-3 transition-colors">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1A1B3A]">
              <Trash2Icon size={20} className="text-red-500"/>
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-sm font-medium text-white truncate">Deployment #789</p>
              <p className="text-xs text-gray-400 truncate">Deployment deleted</p>
            </div>
            <div className="text-xs text-gray-500 whitespace-nowrap">1 day ago</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}