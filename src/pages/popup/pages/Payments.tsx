import { useState, useEffect } from "react";
import { motion } from "framer-motion"
import { Wallet } from "lucide-react"
import { History } from "@/components/common/History";


const Payments = () => {

  return (
    <div className="flex ">
      <main className="flex-1 p-8 flex flex-col">

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-between items-center mb-8"
        >
          <h2 className={`text-3xl font-bold text-white`}>
            Payments Overview
          </h2>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }} 
          className={`flex border-white/10 text-white bg-gray-900 opacity-5 justify-between w-full mt-8 gap-3 px-4 py-4 text-md font-medium text-white glassmorphism-card border shadow-lg rounded-xl`}
        >
          <div className="flex justify-between">
            <div className="flex gap-3">
              <div className="flex text-red-500 rounded-xl bg-black/20 shrink-0 p-4 m-2">
                <Wallet size={26}/>
              </div>
              <div className="flex flex-col mt-4">
                <p className={`text-lg font-bold text-white `}>123.45 AKT</p>
                <p className="text-sm text-gray-500">AKT Balance</p>
              </div>
            </div>
          </div>
          <div className="relative z-50">
            <button 
              className={`flex mt-4 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-10 px-7 bg-cyan-500 text-black text-base font-bold leading-normal tracking-wide shadow-lg shadow-cyan-500/20 hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed gap-2`}
            >
              <span className="truncate">Add Funds</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}  
          className="mt-8 grid grid-cols-2 gap-4"
        >
          <div className=""></div>
        </motion.div>

        <div>
          <h2 className={`text-2xl font-bold tracking-[-0.015em] text-whit `}>
            Recents
          </h2>
          <br />
          <History/>
        </div>
      </main>
    </div>
  )
}

export default Payments