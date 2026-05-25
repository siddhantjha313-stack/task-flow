import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, FolderOpen, Users, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Projects() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Complete redesign of company website',
      members: 5,
      tasks: 12,
      dueDate: '2024-12-31',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      name: 'Mobile App',
      description: 'Native iOS and Android app',
      members: 8,
      tasks: 24,
      dueDate: '2025-01-15',
      color: 'from-purple-500 to-pink-500'
    },
  ])

  const handleCreateProject = () => {
    toast.success('Project creation form would open here')
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-gray-400">Manage all your projects in one place</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateProject}
          className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition"
        >
          <Plus className="w-5 h-5" />
          New Project
        </motion.button>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-xl bg-gradient-to-br ${project.color} bg-opacity-10 backdrop-blur-md border border-white/10 hover:border-white/20 transition cursor-pointer group`}
          >
            <div className="flex items-start justify-between mb-4">
              <FolderOpen className="w-8 h-8 text-primary-400" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <h3 className="text-lg font-bold mb-2">{project.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{project.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {project.members}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(project.dueDate).toLocaleDateString()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
