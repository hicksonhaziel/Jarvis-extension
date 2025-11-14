import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet } from 'lucide-react'
import Alert from '@/components/ui/Alert'
import Logout from '@/components/modals/Logout'

const Settings = () => {
  const [isUpdateProfile, setIsUpdateProfile] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [email, setEmail] = useState('example@gmail.com')
  const [phone, setPhone] = useState('')
  const [isLogOutOPen, setIsLogOutOPen] = useState(false)
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null)

  const handleUpdate = async () => {
    setIsUpdating(true);
    await new Promise((resolve) => setTimeout(resolve, 10000));
    setIsUpdating(false);
    setAlert({
      type: "error",
      message: "Please try again later!",
    });
    setIsUpdateProfile(false);
  }

  const handleAlert = (type: string, message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 10000) 
  }

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
            Settings
          </h2>
        </motion.div>
        
        <section className="w-full max-w-4xl mx-auto">
          {isUpdateProfile && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glassmorphism-card border-white/10 text-white bg-gray-900/50 overflow-hidden border shadow-lg rounded-xl p-4 md:p-6 flex flex-col justify-between transition-all duration-300"
            >
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Update Profile</h2>
                <main>
                  <div className="mb-4">
                    <label className="block text-white/70 mb-1 text-sm">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-900 border-white/10 text-white px-3 py-2 rounded border text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-white/70 mb-1 text-sm">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-900 border-white/10 text-white px-3 py-2 rounded border text-sm"
                    />
                  </div>
                </main>
                <footer className="flex items-center justify-between pt-4 gap-4">
                  <button
                    onClick={() => setIsUpdateProfile(false)} 
                    className="px-4 py-2 rounded-lg text-white border-white/20 text-sm font-bold bg-transparent border hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 text-black bg-cyan-500 hover:bg-cyan-600 hover:text-white shadow-lg shadow-cyan-200/20 disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      "Update"
                    )}
                  </button>
                </footer>
              </div>
            </motion.div>
          )}

          {!isUpdateProfile && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glassmorphism-card border-white/10 text-white bg-gray-900/50 overflow-hidden border shadow-lg rounded-xl p-4 md:p-6 flex flex-col justify-between transition-all duration-300"
            >
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-xl font-bold text-white">Profile</h2>
                  <div className="flex bg-gray-800 cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold tracking-wide transition-colors hover:bg-opacity-80">
                    <Wallet size={20} className="text-cyan-800" />
                    <span className="truncate text-white">0x123...abc</span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-3 mb-6">
                  <div className="text-sm">
                    <span className="font-bold text-white">Email: </span>
                    <span className="text-gray-300">example@gmail.com</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-bold text-white">Phone: </span>
                    <span className="text-gray-300">Not Found</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-bold text-white">Created At: </span>
                    <span className="text-gray-300">2025-09-01T20:58:00.123456Z</span>
                  </div>
                </div>
                
                <footer className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-4 gap-3">
                  <div className="hidden sm:block"></div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      onClick={() => setIsUpdateProfile(true)} 
                      className="px-4 py-2 rounded-lg text-white border-white/20 text-sm font-bold bg-transparent border hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setIsLogOutOPen(true)} 
                      className="px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 text-black bg-red-500 hover:bg-red-600 hover:text-white shadow-lg shadow-red-200/20 disabled:opacity-50"
                    >
                      Logout
                    </button>
                  </div>
                </footer>
              </div>
            </motion.div>
          )}
        </section>
      </main>
      
      <Alert 
        isOpen={!!alert}
        onClose={() => setAlert(null)}
        type={alert?.type || ""}
        message={alert?.message || ""} 
      />
      <Logout 
        isOPen={isLogOutOPen}
        onClose={() => setIsLogOutOPen(false)}
        onAlert={handleAlert}
      />
    </div>
  )
}

export default Settings