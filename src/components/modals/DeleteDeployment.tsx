import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import Modal from "../ui/Modal";
import { useState } from "react";
import { useApi } from "@/hooks/useApi";

interface DeleteDeploymentProps {
  isOPen: boolean;
  image: string;
  deployment_id: string;
  onClose: () => void;
  onAlert: (type: "success" | "error" | "info", message: string) => void
}

const DeleteDeployment: React.FC<DeleteDeploymentProps> = ({ isOPen, onClose, image, deployment_id, onAlert }) => {
  const { terminateDeployment, loading } = useApi();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    const result = await terminateDeployment(deployment_id);

    setIsDeleting(false);

    if (result) {
      onClose();
      onAlert("success", `Deployment ${result.deployment_id} terminated successfully!`);
    } else {
      onAlert("error", "An error occurred. Please try again later!");
    }
  };

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
            className="w-[300px] max-w-4xl h-[400px] flex flex-col glassmorphism-card overflow-hidden border border-white/10 shadow-2xl rounded-xl duration-300"
          >
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-xl font-bold tracking-tight text-white">
                Delete Deployment
              </h2>
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="text-white/50 hover:text-white transition-colors disabled:opacity-50"
              >
                <X size={24} />
              </button>
            </header>

            
            <main className="flex-grow p-4 overflow-y-auto text-white space-y-6">
              {/* Warning */}
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                <AlertTriangle size={20} className="h-5 w-5 mt-0.5 flex-shrink-0"/>
                <p className="text-sm">
                  You are about to permanently delete this deployment. This action cannot be
                  undone.
                </p>
              </div>

              {/* Deployment Info */}
              <div className="space-y-2">
                <div>
                  <p className="text-xs uppercase text-white/50">Image</p>
                  <p className="font-mono text-sm">{image}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-white/50">Deployment ID</p>
                  <p className="font-mono text-sm">{deployment_id}</p>
                </div>
              </div>
            </main>

            <footer className="flex items-center justify-between p-4 border-t border-white/10">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-white font-bold bg-transparent border border-white/20 hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200/20 disabled:opacity-50"
              >
                {isDeleting ? (
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
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </footer>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default DeleteDeployment;