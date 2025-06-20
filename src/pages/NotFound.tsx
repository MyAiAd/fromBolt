import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-rise-dark flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <Eye className="h-24 w-24 text-rise-gold opacity-50" />
        </motion.div>

        <motion.h1 
          className="text-4xl font-bold font-serif text-white mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          404 - Page Not Found
        </motion.h1>

        <motion.p 
          className="text-gray-400 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link 
            to="/dashboard" 
            className="btn btn-primary inline-flex items-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;