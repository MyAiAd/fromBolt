import { Outlet, Link } from 'react-router-dom';
import { Triangle, Flower, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-jennaz-purple-dark flex flex-col justify-center">
      <div className="absolute inset-0 overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4">
          <div className="w-96 h-96 bg-jennaz-purple rounded-full opacity-20 filter blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4">
          <div className="w-96 h-96 bg-jennaz-rose rounded-full opacity-10 filter blur-3xl"></div>
        </div>
      </div>
      
      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center mb-6">
          <img src="/JennaA-texta-logo-aqua.png" alt="JennaZ Logo" className="h-12 w-auto" />
        </Link>
      </div>

      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-jennaz-purple py-8 px-4 shadow-jennaz sm:rounded-lg sm:px-10 border border-jennaz-rose border-opacity-20">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;