'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FiUpload, 
  FiBarChart2, 
  FiUsers, 
  FiDownload, 
  FiEye, 
  FiFileText,
  FiActivity 
} from 'react-icons/fi'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import { analyticsAPI, pdfAPI } from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'

interface DashboardStats {
  overview: {
    totalPageViews: number
    totalPdfViews: number
    totalPdfDownloads: number
    totalUserLogins: number
    totalUserRegistrations: number
    uniqueVisitors: number
    totalUsers: number
    totalPDFs: number
  }
  mostViewedPDFs: Array<{
    pdfId: string
    title: string
    category: string
    viewCount: number
  }>
  mostDownloadedPDFs: Array<{
    pdfId: string
    title: string
    category: string
    downloadCount: number
  }>
  dailyStats: Array<{
    _id: string
    pageViews: number
    pdfViews: number
    pdfDownloads: number
  }>
}

export default function AdminDashboard() {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload' | 'manage'>('dashboard')
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'exclusive',
    year: '',
    subject: '',
    customSubject: '',
    paper: '',
    yearValue: '',
    isPremium: false,
    price: 0,
    file: null as File | null,
  })

  useEffect(() => {
    checkAdminAccess()
    loadDashboard()
  }, [])

  const checkAdminAccess = () => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    if (!userStr) {
      router.push('/admin/login')
      return
    }
    try {
      const user = JSON.parse(userStr)
      if (user.role !== 'admin') {
        router.push('/')
        return
      }
    } catch (error) {
      router.push('/admin/login')
    }
  }

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const response = await analyticsAPI.getDashboard()
      if (response.success) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('title', uploadForm.title)
      formData.append('description', uploadForm.description)
      formData.append('category', uploadForm.category)
      if (uploadForm.year) formData.append('year', uploadForm.year)
      // Use custom subject if "Other" is selected, otherwise use dropdown value
      const subjectValue = uploadForm.subject === 'Other' ? uploadForm.customSubject : uploadForm.subject
      if (subjectValue) formData.append('subject', subjectValue)
      if (uploadForm.paper) formData.append('paper', uploadForm.paper)
      if (uploadForm.yearValue) formData.append('yearValue', uploadForm.yearValue)
      formData.append('isPremium', uploadForm.isPremium.toString())
      if (uploadForm.isPremium) {
        formData.append('price', uploadForm.price.toString())
      }
      if (uploadForm.file) {
        formData.append('pdf', uploadForm.file)
      }

      await pdfAPI.createPDF(formData)
      showSuccess('PDF uploaded successfully!')
      setUploadForm({
        title: '',
        description: '',
        category: 'exclusive',
        year: '',
        subject: '',
        customSubject: '',
        paper: '',
        yearValue: '',
        isPremium: false,
        price: 0,
        file: null,
      })
      loadDashboard()
    } catch (error: any) {
      showError(error.message || 'Upload failed')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
        </div>
        
        <div className="flex bg-white rounded-lg p-1 shadow-sm border">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-blue-50 text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FiBarChart2 className="inline w-4 h-4 mr-2" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === 'upload'
                ? 'bg-blue-50 text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FiUpload className="inline w-4 h-4 mr-2" />
            Upload Content
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === 'manage'
                ? 'bg-blue-50 text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FiFileText className="inline w-4 h-4 mr-2" />
            Manage Content
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' && stats && (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FiEye className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  +12%
                </span>
              </div>
              <p className="text-gray-500 text-sm">Total Page Views</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {stats.overview.totalPageViews.toLocaleString()}
              </h3>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <FiDownload className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  +5%
                </span>
              </div>
              <p className="text-gray-500 text-sm">Total Downloads</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {stats.overview.totalPdfDownloads.toLocaleString()}
              </h3>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <FiUsers className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  +8%
                </span>
              </div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {stats.overview.totalUsers.toLocaleString()}
              </h3>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <FiActivity className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
              <p className="text-gray-500 text-sm">Unique Visitors</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {stats.overview.uniqueVisitors.toLocaleString()}
              </h3>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Traffic Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Traffic Overview</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.dailyStats}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="_id" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="pageViews" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorViews)" 
                      name="Page Views"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Downloads Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Content Engagement</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="_id" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="pdfDownloads" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      dot={false}
                      name="Downloads"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pdfViews" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={false}
                      name="PDF Views"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">Top Performing Content</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stats.mostViewedPDFs.slice(0, 5).map((pdf) => (
                      <tr key={pdf.pdfId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">{pdf.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 text-right">{pdf.viewCount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">Most Downloaded</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Downloads</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stats.mostDownloadedPDFs.slice(0, 5).map((pdf) => (
                      <tr key={pdf.pdfId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">{pdf.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 text-right">{pdf.downloadCount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Upload New Content</h2>
            <p className="text-gray-500 mt-2">Share resources with your students</p>
          </div>
          
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter PDF title"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={3}
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="exclusive">Exclusive</option>
                  <option value="syllabus">Syllabus</option>
                  <option value="pyq">PYQ</option>
                  <option value="notes">Notes</option>
                </select>
              </div>

              {(uploadForm.category === 'syllabus' || uploadForm.category === 'notes' || uploadForm.category === 'pyq') && (
                <>
                  {(uploadForm.category === 'notes' || uploadForm.category === 'pyq' || uploadForm.category === 'syllabus') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year *
                      </label>
                      <select
                        required
                        value={uploadForm.year}
                        onChange={(e) => setUploadForm({ ...uploadForm, year: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select Year</option>
                        <option value="1st-year">1st Year</option>
                        <option value="2nd-year">2nd Year</option>
                        <option value="3rd-year">3rd Year</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={uploadForm.subject}
                      onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                      placeholder="Enter subject name (e.g., Anatomy, Physics)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter any subject name - it will automatically appear on the frontend
                    </p>
                  </div>

                </>
              )}

              {uploadForm.category === 'pyq' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paper *
                    </label>
                    <select
                      required
                      value={uploadForm.paper}
                      onChange={(e) => setUploadForm({ ...uploadForm, paper: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select Paper</option>
                      <option value="paper-1">Paper 1</option>
                      <option value="paper-2">Paper 2</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year Value *
                    </label>
                    <select
                      required
                      value={uploadForm.yearValue}
                      onChange={(e) => setUploadForm({ ...uploadForm, yearValue: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select Year</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PDF File *
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf"
                  onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <input
                  type="checkbox"
                  id="isPremium"
                  checked={uploadForm.isPremium}
                  onChange={(e) => setUploadForm({ ...uploadForm, isPremium: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isPremium" className="font-medium text-gray-700">
                  Premium Content (Requires Purchase)
                </label>
              </div>

              {uploadForm.isPremium && (
                <div className="animate-fadeIn">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required={uploadForm.isPremium}
                    min="0"
                    step="0.01"
                    value={uploadForm.price}
                    onChange={(e) => setUploadForm({ ...uploadForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0.00"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg shadow-lg hover:shadow-xl"
            >
              Upload PDF
            </button>
          </form>
        </div>
      )}

      {activeTab === 'manage' && (
        <ManageContentTab onContentDeleted={loadDashboard} />
      )}
    </div>
  )
}

function ManageContentTab({ onContentDeleted }: { onContentDeleted: () => void }) {
  const { showSuccess, showError } = useToast()
  const [pdfs, setPdfs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ category: '', year: '', subject: '' })

  useEffect(() => {
    loadPDFs()
  }, [filter])

  const loadPDFs = async () => {
    try {
      setLoading(true)
      const response = await pdfAPI.getPDFs(filter)
      if (response.success) {
        setPdfs(response.data)
      }
    } catch (error) {
      console.error('Error loading PDFs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      // Note: You'll need to add a delete endpoint to your API
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/pdfs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        showSuccess('Content deleted successfully!')
        loadPDFs()
        onContentDeleted()
      } else {
        showError('Failed to delete content')
      }
    } catch (error) {
      console.error('Error deleting PDF:', error)
      showError('Error deleting content')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Content</h2>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="exclusive">Exclusive</option>
            <option value="syllabus">Syllabus</option>
            <option value="pyq">PYQ</option>
            <option value="notes">Notes</option>
          </select>

          <select
            value={filter.year}
            onChange={(e) => setFilter({ ...filter, year: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Years</option>
            <option value="1st-year">1st Year</option>
            <option value="2nd-year">2nd Year</option>
            <option value="3rd-year">3rd Year</option>
          </select>

          <input
            type="text"
            placeholder="Search by subject..."
            value={filter.subject}
            onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : pdfs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No content found matching your filters.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Downloads</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pdfs.map((pdf) => (
                <tr key={pdf._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{pdf.title}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {pdf.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{pdf.year || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{pdf.subject || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{pdf.viewCount || 0}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{pdf.downloadCount || 0}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(pdf._id, pdf.title)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

