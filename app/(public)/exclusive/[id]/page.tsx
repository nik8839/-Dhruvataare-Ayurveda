'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { FiDownload, FiLock, FiArrowLeft, FiEye, FiBell } from 'react-icons/fi'
import Link from 'next/link'
import { pdfAPI, paymentAPI, authAPI } from '@/lib/api'

export default function ExclusivePage() {
  const params = useParams()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasPurchased, setHasPurchased] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [pdf, setPdf] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paymentOrder, setPaymentOrder] = useState<any>(null)

  useEffect(() => {
    loadPDF()
    checkAuth()
  }, [params.id])

  const checkAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    setIsAuthenticated(!!token)
  }

  const loadPDF = async () => {
    try {
      setLoading(true)
      const response = await pdfAPI.getPDF(params.id as string)
      if (response.success) {
        setPdf(response.data)
        if (isAuthenticated) {
          const userStr = localStorage.getItem('user')
          if (userStr) {
            const user = JSON.parse(userStr)
            const hasPurchasedItem = user.purchasedItems?.some(
              (item: any) => item.pdfId === response.data._id
            )
            setHasPurchased(hasPurchasedItem || false)
          }
        }
      }
    } catch (error) {
      console.error('Error loading PDF:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!isAuthenticated) {
      alert('Please sign in or sign up to download this PDF')
      router.push('/login')
      return
    }

    if (pdf?.isPremium && !hasPurchased) {
      await handleCreateOrder()
      return
    }

    try {
      await pdfAPI.downloadPDF(params.id as string)
    } catch (error: any) {
      if (error.message.includes('purchase')) {
        alert('Please purchase this PDF to download')
        await handleCreateOrder()
      } else {
        alert(error.message || 'Download failed')
      }
    }
  }

  const handleCreateOrder = async () => {
    try {
      const response = await paymentAPI.createOrder(params.id as string)
      if (response.success) {
        setPaymentOrder({
          ...response.order,
          purchaseId: response.purchaseId,
          mockMode: response.mockMode
        })
        setShowPayment(true)
      }
    } catch (error: any) {
      alert(error.message || 'Failed to create order')
    }
  }

  const handlePurchase = async () => {
    if (!paymentOrder) {
      await handleCreateOrder()
      return
    }

    if (paymentOrder.mockMode || paymentOrder.key === 'mock_key_id') {
      console.log('🧪 Mock payment mode')
      try {
        const verifyResponse = await paymentAPI.verifyPayment(
          paymentOrder.id,
          'mock_payment_id',
          'mock_signature',
          paymentOrder.purchaseId
        )
        if (verifyResponse.success) {
          setHasPurchased(true)
          setShowPayment(false)
          alert('Payment successful! You can now download the PDF.')
          const userData = await authAPI.getMe()
          if (userData.success) {
            localStorage.setItem('user', JSON.stringify(userData.user))
          }
        }
      } catch (error: any) {
        alert(error.message || 'Payment verification failed')
      }
      return
    }

    const options = {
      key: paymentOrder.key,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
      name: 'EduTech',
      description: pdf?.title || 'PDF Purchase',
      order_id: paymentOrder.id,
      handler: async (response: any) => {
        try {
          const verifyResponse = await paymentAPI.verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
            paymentOrder.purchaseId
          )
          if (verifyResponse.success) {
            setHasPurchased(true)
            setShowPayment(false)
            alert('Payment successful! You can now download the PDF.')
            const userData = await authAPI.getMe()
            if (userData.success) {
              localStorage.setItem('user', JSON.stringify(userData.user))
            }
          }
        } catch (error: any) {
          alert(error.message || 'Payment verification failed')
        }
      },
      prefill: {
        email: JSON.parse(localStorage.getItem('user') || '{}').email || '',
      },
      theme: {
        color: '#0ea5e9',
      },
    }

    const razorpay = new (window as any).Razorpay(options)
    razorpay.open()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </Link>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : !pdf ? (
        <div className="text-center text-red-600">PDF not found</div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {pdf.title}
          </h1>
          {pdf.description && (
            <p className="text-gray-600 mb-4">{pdf.description}</p>
          )}

          {showPayment && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <FiLock className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-800">Purchase Required for Download</h3>
              </div>
              <p className="text-yellow-700 mb-4">
                You can read this content for free, but downloading requires a purchase.
              </p>
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Price:</span>
                  <span className="text-2xl font-bold text-blue-600">₹{pdf.price}</span>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handlePurchase}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Proceed to Payment
                </button>
                <button
                  onClick={() => setShowPayment(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="bg-gray-100 rounded-lg p-8 mb-6 min-h-[400px] flex items-center justify-center">
            {pdf.isPremium ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiLock className="w-10 h-10 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Exclusive Content</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  This content is exclusive. Please purchase and download to view the full PDF.
                </p>
              </div>
            ) : (
              <iframe
                src={`${pdfAPI.viewPDF(pdf._id)}`}
                className="w-full h-full min-h-[600px] border-0"
                title={pdf.title}
              />
            )}
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FiEye className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-700">
                  You can read this content for free
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!isAuthenticated && (
                <span className="text-sm text-gray-600">
                  <FiLock className="inline w-4 h-4 mr-1" />
                  Sign in required for download
                </span>
              )}
              {isAuthenticated && pdf.isPremium && !hasPurchased && (
                <span className="text-sm text-yellow-600">
                  <FiLock className="inline w-4 h-4 mr-1" />
                  Purchase required for download
                </span>
              )}
              {isAuthenticated && (!pdf.isPremium || hasPurchased) && (
                <span className="text-sm text-green-600">
                  ✓ Ready to download
                </span>
              )}
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiDownload className="w-5 h-5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 bg-blue-50 rounded-lg p-6 text-center">
        <Link
          href="/community"
          className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold text-lg"
        >
          <span>Join Our Community</span>
          <FiBell className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}
