import { motion } from 'framer-motion'
import { BarChart3, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const stats = [
    { icon: FolderOpen, label: 'Total Projects', value: '12', color: 'from-blue-500 to-cyan-500' },
    { icon: CheckCircle, label: 'Completed Tasks', value: '48', color: 'from-green-500 to-emerald-500' },
    { icon: Clock, label: 'In Progress', value: '23', color: 'from-yellow-500 to-orange-500' },
    { icon: AlertCircle, label: 'Overdue', value: '3', color: 'from-red-500 to-pink-500' },
  ]

  const chartData = [
    { name: 'Mon', tasks: 12 },
    { name: 'Tue', tasks: 19 },
    { name: 'Wed', tasks: 15 },
    { name: 'Thu', tasks: 25 },
    { name: 'Fri', tasks: 22 },
    { name: 'Sat', tasks: 18 },
    { name: 'Sun', tasks: 14 },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-8 space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's your project overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-primary-500/50 transition"
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} p-3 mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        variants={itemVariants}
        className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10"
      >
        <h2 className="text-xl font-bold mb-6">Weekly Activity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="tasks"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={{ fill: '#0ea5e9', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  )
}
