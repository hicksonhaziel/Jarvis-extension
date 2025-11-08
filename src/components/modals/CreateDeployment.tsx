import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Modal from "../ui/Modal";
import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi"; 

interface CreateDeploymentProps { 
  isOPen: boolean;
  onClose: () => void;
  onAlert: (type: "success" | "error" | "info", message: string) => void
}

const CreateDeployment: React.FC<CreateDeploymentProps> = ({ isOPen, onClose, onAlert }) => {
  const { createDeployment, estimatePricing, loading } = useApi();
  
  // States
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [estimating, setEstimating] = useState(false);

  // Form Fields 
  const [image, setImage] = useState("nginx:latest");
  const [cpu, setCpu] = useState(1.0);
  const [memory, setMemory] = useState(512);
  const [memoryUnit, setMemoryUnit] = useState("MB");
  const [storage, setStorage] = useState(1);
  const [storageUnit, setStorageUnit] = useState("GB");
  const [ports, setPorts] = useState("80");
  const [paymentAmount, setPaymentAmount] = useState(10.0);
  const [paymentCurrency, setPaymentCurrency] = useState("USD");

  const [deployment_types] = useState([
    { id: 1, value: "hosting", tag: "Hosting" },
    { id: 2, value: "database", tag: "Database" },
    { id: 3, value: "compute", tag: "Compute" },
    { id: 4, value: "kubernetes", tag: "Kubernetes" },
  ]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Fetch price estimate 
  useEffect(() => {
    if (step === 3 && selectedType) {
      fetchPriceEstimate();
    }
  }, [step, cpu, memory, memoryUnit, storage, storageUnit]);

  const fetchPriceEstimate = async () => {
    setEstimating(true);
    const result = await estimatePricing({
      cpu: cpu,
      memory: `${memory}${memoryUnit}`,
      storage: `${storage}${storageUnit}`
    });
    
    if (result) {
      setEstimatedPrice(result.pricing.estimated_monthly_cost_usd);
      setPaymentAmount(result.pricing.estimated_monthly_cost_usd);
    }
    setEstimating(false);
  };

  const handleDeploy = async () => {
    setIsDeploying(true);

    const deploymentData = {
      image,
      cpu: cpu,
      memory: `${memory}${memoryUnit}`,
      storage: `${storage}${storageUnit}`,
      ports: ports.split(',').map(p => parseInt(p.trim())),
      payment_amount: paymentAmount,
      payment_currency: paymentCurrency
    };

    const result = await createDeployment(deploymentData);

    setIsDeploying(false);
    
    if (result) {
      onClose();
      onAlert("success", `Deployment created successfully! ID: ${result.deployment_id}`);
    } else {
      onAlert("error", "Failed to create deployment. Please try again.");
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
            className={`w-[250px] max-w-4xl h-[275px] border-black/10 text-white bg-gray-900 opacity-5 flex flex-col  glassmorphism-card overflow-hidden border shadow-xl rounded-xl duration-300`}
          >
            {/* Header */}
            <header className="flex items-center justify-between p-3 border-b border-white/10">
              <h2 className="text-1xl font-bold tracking-tight text-white">
                Create New Deployment
              </h2>
              <button
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </header>

            {/* Progress */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-white/70">
                  Step {step} of 4
                </p>
              </div>
              <div className="w-full bg-gray-900 rounded-full h-1">
                <motion.div
                  className="bg-red-500 h-1 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 4) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {/* Steps */}
            <main className="flex-grow p-3 overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* Step 1*/}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3 className="text-lg font-bold mb-3 text-white">
                      Select Deployment Type
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {deployment_types.map((deployment_type) => (
                        <label
                          key={deployment_type.id}
                          className="group relative cursor-pointer"
                        >
                          <input
                            name="deployment_type"
                            type="radio"
                            className="sr-only peer"
                            value={deployment_type.value}
                            checked={selectedType === deployment_type.value}
                            onChange={() =>
                              setSelectedType(deployment_type.value)
                            }
                          />
                          <div
                            className={`p-3 flex justify-center rounded-lg text-center border-1 transition-all duration-300
                            ${
                              selectedType === deployment_type.value
                                ? "border-red-200 bg-gray-900/50"
                                : "border-transparent bg-gray-900"
                            } group-hover:border-red-200`}
                          >
                            <p className="font-bold text-md text-white">
                              {deployment_type.tag}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 2*/}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3 className="text-xl font-bold mb-2 text-white">
                      Deployment Configuration
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white/70 mb-1">Image</label>
                        <input
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-gray-900 border border-white/10 text-white"
                          placeholder="nginx:latest"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-white/70 mb-1">CPU Cores</label>
                          <input
                            type="number"
                            step="0.1"
                            value={cpu}
                            onChange={(e) => setCpu(parseFloat(e.target.value))}
                            className="w-full px-3 py-2 rounded bg-gray-900 border border-white/10 text-white"
                          />
                        </div>
                        <br />
                        <div>
                          <label className="block text-white/70 mb-1">Memory</label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={memory}
                              onChange={(e) => setMemory(parseFloat(e.target.value))}
                              className="flex-1 px-3 py-2 rounded bg-gray-900 border border-white/10 text-white"
                            />
                            <select
                              value={memoryUnit}
                              onChange={(e) => setMemoryUnit(e.target.value)}
                              className="px-3 py-2 rounded bg-gray-900 border border-white/10 text-white"
                            >
                              <option value="MB">MB</option>
                              <option value="GB">GB</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/70 mb-1">Storage</label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={storage}
                              onChange={(e) => setStorage(parseFloat(e.target.value))}
                              className="flex-1 px-3 py-2 rounded bg-gray-900 border border-white/10 text-white"
                            />
                            <select
                              value={storageUnit}
                              onChange={(e) => setStorageUnit(e.target.value)}
                              className="px-3 py-2 rounded bg-gray-900 border border-white/10 text-white"
                            >
                              <option value="MB">MB</option>
                              <option value="GB">GB</option>
                              <option value="TB">TB</option>
                            </select>
                          </div>
                        </div>
                        <br />
                        <div>
                          <label className="block text-white/70 mb-1">Ports</label>
                          <input
                            value={ports}
                            onChange={(e) => setPorts(e.target.value)}
                            className="w-full px-3 py-2 rounded bg-gray-900 border border-white/10 text-white"
                            placeholder="80, 443"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3 className="text-lg font-bold mb-2 text-white">
                      Payment Information
                    </h3>
                    
                    {estimating && (
                      <div className="mb-3 p-2 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-300 text-sm">
                        Calculating estimated price...
                      </div>
                    )}
                    
                    {estimatedPrice !== null && !estimating && (
                      <div className="mb-2 p-2 bg-cyan-500/10 border border-cyan-500/30 rounded">
                        <p className="text-cyan-300 text-sm">Estimated monthly cost</p>
                        <p className="text-white text-xl font-bold">${estimatedPrice.toFixed(2)}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-white/70 mb-1">Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          value={paymentAmount}
                          onChange={(e) =>
                            setPaymentAmount(parseFloat(e.target.value))
                          }
                          className="w-full px-3 py-2 rounded bg-gray-900 border border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 mb-1">Currency</label>
                        <select
                          value={paymentCurrency}
                          onChange={(e) => setPaymentCurrency(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-gray-900 border border-white/10 text-white"
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4 */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3 className="text-lg font-bold mb-2 text-white">
                      Review & Confirm
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-gray-900 p-2 rounded-lg text-white/80 space-y-2">
                        <p><span className="font-bold text-white">Type:</span> {selectedType}</p>
                        <p><span className="font-bold text-white">Image:</span> {image}</p>
                        <p><span className="font-bold text-white">CPU:</span> {cpu} cores</p>
                        <p><span className="font-bold text-white">Memory:</span> {memory}{memoryUnit}</p>
                        <p><span className="font-bold text-white">Storage:</span> {storage}{storageUnit}</p>
                        <p><span className="font-bold text-white">Ports:</span> {ports}</p>
                        <p className="pt-2 border-t border-white/10">
                          <span className="font-bold text-white">Payment:</span> {paymentAmount.toFixed(2)} {paymentCurrency}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            <footer className="flex items-center justify-between p-3 border-t border-white/10">
              <button
                onClick={onClose}
                disabled={isDeploying}
                className="px-3 py-1 rounded-lg text-white font-bold bg-transparent border border-white/20 hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
             <div className="flex items-center gap-2">
               <button
                 onClick={prevStep}
                 disabled={step === 1 || isDeploying}
                 className={`px-3 py-1 rounded-lg font-bold ${
                   step === 1
                   ? "text-white/50 bg-gray-900 cursor-not-allowed"
                   : "text-white bg-transparent border border-white/20 hover:bg-white/10"
                  }`}
                >
                  Previous
                </button>

                {step === 4 ? (
                  <button
                    onClick={handleDeploy}
                    disabled={isDeploying}
                    className="px-3 py-1 rounded-lg font-bold flex items-center justify-center gap-2 text-black bg-[#00D2FF] hover:bg-[#00D2FF] hover:text-white shadow-lg shadow-cyan-200/20 disabled:opacity-50"
                  >
                    {isDeploying ? (
                      <>
                        <svg
                          className="animate-spin h-3 w-3 text-white"
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
                       Deploying...
                      </>
                     ) : (
                     "Deploy"
                    )}
                  </button>
                ) : (
                <button
                  onClick={nextStep}
                  disabled={step === 1 && !selectedType}
                  className={`px-3 py-1 rounded-lg font-bold ${
                    step === 1 && !selectedType
                    ? "text-white/50 bg-gray-900 cursor-not-allowed"
                    : "text-black bg-[#00D2FF] hover:bg-[#00D2FF] hover:text-white shadow-lg shadow-cyan-200/20"
                  }`}
                >
                  Next
                </button>
               )}
              </div>
            </footer>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default CreateDeployment;