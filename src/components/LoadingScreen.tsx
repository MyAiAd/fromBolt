import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-jennaz-purple-dark flex flex-col items-center justify-center z-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <img 
          src="/JennaA-texta-logo-aqua.png" 
          alt="Loading..." 
          className="h-16 w-16"
        />
      </motion.div>
      <motion.p 
        className="text-lg text-jennaz-rose mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default LoadingScreen;