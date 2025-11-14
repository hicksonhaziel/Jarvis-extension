import { motion } from "framer-motion"
import { Wallet } from "lucide-react"
import { History } from "@/components/common/History";

const Payments = () => {
  return (
    <div className="flex w-full">
      <main className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col overflow-x-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-between items-center mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Payments Overview
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }} 
          className="flex flex-col sm:flex-row border-white/10 text-white bg-gray-900/50 justify-between w-full gap-3 px-4 py-4 text-sm font-medium glassmorphism-card border shadow-lg rounded-xl"
        >
          <div className="flex justify-between sm:justify-start">
            <div className="flex gap-3">
              <div className="flex text-red-500 rounded-xl bg-black/20 shrink-0 p-3">
                <Wallet size={24}/>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-base font-bold text-white">123.45 AKT</p>
                <p className="text-xs text-gray-500">AKT Balance</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center">
            <button 
              className="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-5 bg-cyan-500 text-black text-sm font-bold leading-normal tracking-wide shadow-lg shadow-cyan-500/20 hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
            >
              <span className="truncate">Add Funds</span>
            </button>
          </div>
        </motion.div>

        <div className="mt-6">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-4">
            Recents
          </h2>
          <History/>
        </div>
      </main>
    </div>
  )
}

export default Payments