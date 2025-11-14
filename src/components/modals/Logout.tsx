import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import Modal from "../ui/Modal";
import { useState } from "react";
import { useAuth } from "@/hooks/AuthContext";

interface LogoutProps {
  isOPen: boolean;
  onClose: () => void;  
  onAlert: (type: "success" | "error" | "info", message: string) => void
}

const Logout: React.FC<LogoutProps> = ({ isOPen, onClose, onAlert}) => {

  const [isLogingOut, setIsLogingOut] = useState(false);
  const { logout } = useAuth();

  const handleLogOut = async () => {
    setIsLogingOut(true);

    await logout();

    setIsLogingOut(false);
    onClose();
    onAlert("success", "Loggedout successuf!")
  }

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
                  className="w-[300px] max-w-4xl h-[350px] flex flex-col glassmorphism-card overflow-hidden border border-white/10 shadow-2xl rounded-xl duration-300"
                >
                    {/* Header */}
                    <header className="flex items-center justify-between p-4 border-b border-white/10">
                        <h2 className="text-xl font-bold tracking-tight text-white">
                            Confirm Logout
                        </h2>
                        <button
                            onClick={onClose}
                            disabled={isLogingOut}
                            className="text-white/50 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </header>
                    <main className="flex-grow p-4 overflow-y-auto text-white space-y-6">
                      {/* Warning */}
                      <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                        <AlertTriangle size={20} className="h-5 w-5 mt-0.5 flex-shrink-0"/>
                        <p className="text-sm">
                          You are about to Logout.
                          This action will disconnect your wallet connection with us.
                        </p>
                      </div>
                    </main>
                    <footer className="flex items-center justify-between p-4 border-t border-white/10">
                      <button
                        onClick={onClose}
                        disabled={isLogingOut}
                        className="px-6 py-2 rounded-lg text-white font-bold bg-transparent border border-white/20 hover:bg-white/10 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleLogOut}
                        disabled={isLogingOut}
                        className="px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 text-black bg-red-500 hover:bg-red-500 hover:text-white shadow-lg shadow-red-200/20 disabled:opacity-50"
                      >
                        {isLogingOut ? (
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
                            Loging Out...
                          </>
                         ) : (
                          "Logout"
                        )}
                      </button>
                    </footer>
                </motion.div>
            </Modal>
        )}
    </AnimatePresence>
  )
}

export default Logout