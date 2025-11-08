import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

interface AlertProps {
  type: "success" | "error" | "info" | string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({
  type,
  message,
  isOpen,
  onClose,
}) => {
  const typeStyles: Record<string, string> = {
    success: "bg-green-500/20 border-green-500/30 text-green-400",
    error: "bg-red-500/20 border-red-500/30 text-red-400",
    info: "bg-blue-500/20 border-blue-500/30 text-blue-400",
  };

  const typeIcons: Record<string, JSX.Element> = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    info: <Info size={20} />,
  };

  const styles =
    typeStyles[type] || "bg-gray-500/20 border-gray-500/30 text-gray-400";
  const icon = typeIcons[type] || <Info size={20} />;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 200 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 200 }}
          transition={{ duration: 0.4 }}
          className={`fixed top-[80px] right-[150px] px-4 py-3 rounded-lg backdrop-blur border shadow-lg ${styles}`}
        >
          <div className="flex items-center gap-3">
            
            {icon}

            
            <span className="font-medium flex-1">{message}</span>

            
            <button
              onClick={onClose}
              className="hover:opacity-80 transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
