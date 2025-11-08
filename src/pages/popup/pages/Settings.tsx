import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet } from 'lucide-react'
import Alert from '@/components/ui/Alert'
import Logout from '@/components/modals/Logout'


const Settings = () => {

  // fields
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
    setAlert(null);
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
            Settings
          </h2>
                  
        </motion.div>
        <section>

          {/* Update Profile Section */}
          {isUpdateProfile && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`glassmorphism-card border-white/10 text-white bg-gray-900 opacity-5 p-4 mx-8 flex flex-col  overflow-hidden border shadow-lg rounded-xl p-6 flex flex-col justify-between transition-all duration-300`}
            >
              <div>
                <h2 className={`text-2xl font-bold text-white `}>Update</h2>
                <main>
                  <div className='m-4'>
                    <label className={`block  text-white/70 mb-1`}>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full bg-gray-900 border-white/10 text-white  px-3 py-2 rounded  border `}
                    />
                  </div>
                  <div className='m-4'>
                    <label className={`block text-white/70 mb-1`}>Phone</label>
                    <input
                      type="number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full bg-gray-900 border-white/10 text-white  px-3 py-2 rounded  border `}
                    />
                  </div>
                </main>
                <footer className="flex items-center justify-between p-5">
                  <button
                    onClick={() => setIsUpdateProfile(false)} 
                    className={`px-6 py-2 rounded-lg text-white border-white/20  font-bold bg-transparent border hover:bg-white/10 transition-colors disabled:opacity-50`}
                  >
                    Cancel
                  </button>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleUpdate}
                      disabled={isUpdating}
                      className="px-6 py-2 rounded-lg font-bold flex items-center justify-center gap-2 text-black bg-cyan-500 hover:bg-cyan-600 hover:text-white shadow-lg shadow-cyan-200/20 disabled:opacity-50"
                    >
                      {isUpdating ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
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
                  </div> 
                </footer>
              </div>
            </motion.div>
          )}

          {/* Profile Info Section */}
          {!isUpdateProfile && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`glassmorphism-card border-white/10 text-white bg-gray-900 opacity-5 p-4 mx-8 flex flex-col  overflow-hidden border shadow-lg rounded-xl p-6 flex flex-col justify-between transition-all duration-300`}
            >
              <div>
                <div className="flex justify-between mx-3 mt-2">
                  <h2 className={`text-2xl font-bold text-white `}>Profile</h2>
                  <div
                    className={`flex bg-gray-800 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold tracking-[0.015em] transition-colors hover:bg-opacity-80`}
                  >
                    <Wallet size={24} className='text-cyan-800' />
                    <span className={`truncate  text-white `}>0x123...abc</span>
                  </div>
                </div>
                <div className="flex flex-col my-8 my-4">
                  <div className="grid grid-cols-1 gap-4 p-2 m-2">
                    <p><span className={`font-bold text-white `}>Email:</span> example@gmail.con</p>
                    <p><span className={`font-bold text-white `} >Phone:</span> Not Found</p>
                    <p><span className={`font-bold text-white `}>Created At:</span> 2025-09-01T20:58:00.123456Z</p>
                  </div>
                </div>
                <footer className="flex items-center justify-between p-5">
                  <div className=""></div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsUpdateProfile(true)} 
                      className={`px-6 py-2 rounded-lg text-white border-white/20  font-bold bg-transparent border hover:bg-white/10 transition-colors disabled:opacity-50`}             
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setIsLogOutOPen(true)} 
                      className={`px-6 py-2 rounded-lg font-bold flex items-center justify-center gap-2 text-black bg-red-500 hover:bg-red-600 hover:text-white shadow-lg shadow-red-200/20 disabled:opacity-50`}
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