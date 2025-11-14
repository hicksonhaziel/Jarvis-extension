import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search as SearchIcon, ArrowLeft, ArrowRight, Plus, Inbox, RefreshCw } from 'lucide-react'
import CreateDeployment from '@/components/modals/CreateDeployment'
import DeleteDeployment from '@/components/modals/DeleteDeployment'
import Alert from '@/components/ui/Alert'
import Deployment from '@/components/common/Deployment'
import { useApi } from '@/hooks/useApi'
import type { DeploymentListItem } from '@/types/api' 

const Deployments: React.FC = () => { 
  const { listDeployments, loading: apiLoading } = useApi();
  
  const [deployments, setDeployments] = useState<DeploymentListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeploymentId, setIsDeploymentId] = useState(false);
  const [deploymentId, setDeploymentId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateDeploymentOpen, setIsCreateDeploymentOpen] = useState(false);
  const [isDeleteDeploymentOpen, setIsDeleteDeploymentOpen] = useState(false);
  const [selectedDeployment, setSelectedDeployment] = useState<DeploymentListItem | null>(null);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const pageLimit = 10;

  
  useEffect(() => {
    fetchDeployments();
  }, [currentPage]);

  const fetchDeployments = async () => {
    const result = await listDeployments(currentPage, pageLimit);
    if (result) {
      setDeployments(result.deployments);
      setTotalPages(Math.ceil(result.deployments.length / pageLimit) || 1);
    } else {
      handleAlert("error", "Failed to load deployments");
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDeployments();
    setIsRefreshing(false);
    handleAlert("success", "Deployments refreshed");
  };

  const filteredDeployments = deployments.filter(d =>
    d.image.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.deployment_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedDeployments = filteredDeployments.slice(
    (currentPage - 1) * pageLimit,
    currentPage * pageLimit
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handleAlert = (type: string, message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 10000);
  };

  const viewDeploymentDetails = (id: string) => {
    setDeploymentId(id);
    setIsDeploymentId(true);
  };

  const handleDeleteClick = (deployment: DeploymentListItem) => {
    setSelectedDeployment(deployment);
    setIsDeleteDeploymentOpen(true);
  };

  const handleDeploymentCreated = () => {
    fetchDeployments();
  };

  const handleDeploymentDeleted = () => {
    fetchDeployments();
  };


  return (
    <div className=" overflow-hidden">
      {isDeploymentId && (
        <Deployment 
          setIsDeploymentId={setIsDeploymentId}
          deploymentId={deploymentId}
        />
      )}
      {!isDeploymentId && (
        <main className="w-full h-full px-4 py-6 flex flex-col overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className={`text-2xl font-bold text-whiteb`}>
                  Deployments
                </h2>
                <span className="text-gray-500 text-lg">({deployments.length})</span>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing || apiLoading}
                  className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  title="Refresh deployments"
                >
                  <RefreshCw 
                    size={16} 
                    className={`text-white ${isRefreshing ? 'animate-spin' : ''}`}
                  />
                </button>
              </div>
            </div>
            
            <div className="relative w-full">
              <input 
                type="text" 
                value={searchTerm}
                placeholder='Search...'
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className={`bg-[#1A1B3A] text-white border-[#2d3748] border rounded-lg py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-[#00D2FF] transition-all w-full text-sm`}
              />
              <SearchIcon
                size={14}
                className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'
              />
            </div>
          </motion.div>
          
          {/* Loading State */}
          {apiLoading && !isRefreshing && (
            <div className="flex items-center justify-center py-20">
              <RefreshCw size={28} className="animate-spin text-[#00D2FF]" />
            </div>
          )}

          {/* Deployments List */}
          {!apiLoading && filteredDeployments.length > 0 ? (
            <div className="space-y-4 pb-20">
              {paginatedDeployments.map((deployment) => (
                <motion.div
                  key={deployment.deployment_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={`border border-white/10 text-white bg-gray-800 overflow-hidden shadow-md rounded-lg p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-lg`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <h3 className={`font-bold text-base text-white truncate flex-1`}>
                        {deployment.image}
                      </h3>
                      <span 
                        className={`
                          ${
                            deployment.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : deployment.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : deployment.status === "terminated"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-gray-500/20 text-gray-400"
                          }
                          flex items-center text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap
                        `}
                      >
                        <span 
                          className={`
                            ${
                              deployment.status === "active"
                              ? "bg-green-400"
                              : deployment.status === "pending"
                              ? "bg-yellow-400 animate-pulse"
                              : deployment.status === "terminated"
                              ? "bg-red-400"
                              : "bg-gray-400"
                            }
                            w-1.5 h-1.5 rounded-full mr-1.5
                          `}
                        ></span>
                        {deployment.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-gray-500 text-xs">
                      <p className="break-all">
                        <strong>ID:</strong> {deployment.deployment_id}
                      </p>
                      <p>
                        <strong>Created:</strong> {new Date(deployment.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-gray-700">
                    <button
                      onClick={() => viewDeploymentDetails(deployment.deployment_id)} 
                      className={`text-xs font-semibold text-gray-500 hover:text-white transition-colors`}
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(deployment)}
                      className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : !apiLoading && (
            <div className="flex flex-col items-center justify-center text-gray-400 py-16">
              <Inbox size={40} className="mb-3 text-gray-500" />
              <p className="text-base font-semibold">No deployments found</p>
              <p className="text-xs text-gray-500 text-center px-4">
                Create your first deployment to get started 
              </p>
            </div> 
          )}

          {/* Pagination */}
          {filteredDeployments.length > 0 && totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center pb-4">
              <nav className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? "text-gray-500 cursor-not-allowed"
                      : 'text-white hover:bg-gray-700'
                  }`}
                >
                  <ArrowLeft size={20} />
                </button>
                <span className="px-3 py-1.5 rounded-lg bg-[#00D2FF] text-gray-800 font-bold text-xs">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? "text-gray-500 cursor-not-allowed"
                      : 'text-white hover:bg-gray-700'
                  }`}
                >
                  <ArrowRight size={20} />
                </button>
              </nav>
            </div>
          )}
        </main>
      )}

      <motion.button
        drag
        dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
        whileDrag={{ scale: 1.1 }} 
        onClick={() => setIsCreateDeploymentOpen(true)}
        className="fixed bottom-6 right-6 bg-[#00D2FF] hover:bg-cyan-500 text-white font-bold rounded-full h-14 w-14 flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300 z-50"
      >
        <Plus size={22} className='text-gray-100'/>
      </motion.button>

      {/* Modals */}
      <CreateDeployment 
        isOPen={isCreateDeploymentOpen}
        onClose={() => {
          setIsCreateDeploymentOpen(false);
          handleDeploymentCreated();
        }}
        onAlert={handleAlert}
      />
      
      {selectedDeployment && (
        <DeleteDeployment 
          isOPen={isDeleteDeploymentOpen}
          onClose={() => {
            setIsDeleteDeploymentOpen(false);
            setSelectedDeployment(null);
            handleDeploymentDeleted();
          }}
          image={selectedDeployment.image}
          deployment_id={selectedDeployment.deployment_id}
          onAlert={handleAlert}
        />
      )}
      
      <Alert 
        isOpen={!!alert}
        onClose={() => setAlert(null)}
        type={alert?.type || ""}
        message={alert?.message || ""}
      />
    </div>
  );
};

export default Deployments;