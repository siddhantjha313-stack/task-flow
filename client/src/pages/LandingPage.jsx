import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
    >
      <div className="text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">TaskFlow AI</h1>
        <p className="text-xl text-gray-600 mb-8">
          Intelligent task management for modern teams
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

