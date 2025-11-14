import { useState, useEffect} from "react";
import { Wallet, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeContext";
import { AuthStorage } from "@/utils/storage";
import { formatAddress } from "@/utils/formatters";

const Header: React.FC = () => {
  const { theme, toggleTheme, loading } = useTheme(); 
  const [address, setAddress] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchAddress = async () => {
        const walletAddress = await AuthStorage.getWalletAddress();
        setAddress(walletAddress);
      };
  
      fetchAddress();
    }, []);

  if (loading) return null; // avoid flicker on load

  return (
    <header
      className={`${
        theme === "light"
          ? "bg-gray-100 border-gray-200"
          : "bg-gray-900 border-gray-800"
      } shadow-sm border-b`}
    >
      <div className="flex justify-between py-4 px-3">
        <div ></div>

        {/* Right Section */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center gap-3 items-center"
          >
            <div
              className={`flex ${
                theme === "light" ? "bg-gray-400" : "bg-gray-800"
              } cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold tracking-[0.015em] transition-colors hover:bg-opacity-80`}
            >
              <Wallet size={24} className="text-cyan-800" />
              <span
                className={`truncate ${
                  theme === "light" ? "text-black" : "text-white"
                }`}
              >
                {formatAddress(address)}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
