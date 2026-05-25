import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  // Demo credentials
  const fillDemoCredentials = () => {
    setEmail('demo@taskflow.ai')
    setPassword('demo123456')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">
              TaskFlow AI
            </span>
          </div>
          <p className="text-gray-400">Welcome back</p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10"
        >
          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-primary-500 focus:outline-none transition text-white placeholder-gray-500"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-primary-500 focus:outline-none transition text-white placeholder-gray-500"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-primary-500 hover:bg-primary-600 font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>

          {/* Demo Credentials */}
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="w-full mt-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 font-semibold transition text-sm"
          >
            Use Demo Credentials
          </button>
        </motion.form>

        {/* Signup Link */}
        <p className="text-center mt-6 text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-semibold">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
