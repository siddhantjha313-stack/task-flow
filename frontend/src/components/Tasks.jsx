import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default function Tasks() {
  const [tasks] = useState([
    {
      id: 1,
      title: 'Design homepage mockup',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-12-15',
      assignee: 'John Doe'
    },
    {
      id: 2,
      title: 'Setup database',
      status: 'completed',
      priority: 'urgent',
      dueDate: '2024-12-10',
      assignee: 'Jane Smith'
    },
    {
      id: 3,
      title: 'API integration',
      status: 'todo',
      priority: 'medium',
      dueDate: '2024-12-20',
      assignee: 'Bob Johnson'
    },
  ])

  const statusColors = {
    'todo': 'bg-gray-500/20 text-gray-300',
    'in-progress': 'bg-yellow-500/20 text-yellow-300',
    'completed': 'bg-green-500/20 text-green-300',
  }

  const priorityColors = {
    'low': 'text-blue-400',
    'medium': 'text-yellow-400',
    'high': 'text-orange-400',
    'urgent': 'text-red-400',
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tasks</h1>
          <p className="text-gray-400">Track and manage all your tasks</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition"
        >
          <Plus className="w-5 h-5" />
          New Task
        </motion.button>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-primary-500/50 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-4 flex-1">
              <CheckCircle className="w-6 h-6 text-gray-500 group-hover:text-primary-400 transition" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{task.title}</h3>
                <p className="text-sm text-gray-400">{task.assignee}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                {task.status}
              </span>
              <span className={`text-sm font-medium ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              <span className="text-sm text-gray-400">{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
