const Razorpay = require('razorpay');
const Purchase = require('../models/Purchase');
const PDF = require('../models/PDF');
const User = require('../models/User');
const crypto = require('crypto');

// Mock mode - use when Razorpay keys not configured
const MOCK_MODE = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_dummy';

// Initialize Razorpay only if not in mock mode
let razorpay = null;
if (!MOCK_MODE) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.log('🧪 Payment in MOCK MODE - No real payments will be processed');
}

// @desc    Create payment order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { pdfId } = req.body;

    const pdf = await PDF.findById(pdfId);

    if (!pdf || !pdf.isPremium) {
      return res.status(400).json({
        success: false,
        message: 'PDF not found or not available for purchase',
      });
    }

    // Check if already purchased
    const user = await User.findById(req.user.id);
    const hasPurchased = user.purchasedItems.some(
      (item) => item.pdfId.toString() === pdfId
    );

    if (hasPurchased) {
      return res.status(400).json({
        success: false,
        message: 'You have already purchased this PDF',
      });
    }

    const options = {
      amount: pdf.price * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        pdfId: pdfId,
        userId: req.user.id,
      },
    };

    let order;
    
    // MOCK MODE - Simulate order creation
    if (MOCK_MODE) {
      console.log('🧪 MOCK: Creating fake payment order');
      order = {
        id: `mock_order_${Date.now()}`,
        amount: options.amount,
        currency: options.currency,
      };
    } else {
      // REAL RAZORPAY
      order = await razorpay.orders.create(options);
    }

    // Create purchase record
    const purchase = await Purchase.create({
      user: req.user.id,
      pdf: pdfId,
      amount: pdf.price,
      paymentId: order.id,
      orderId: order.id,
      status: 'pending',
      razorpayOrderId: order.id,
    });

    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: MOCK_MODE ? 'mock_key_id' : process.env.RAZORPAY_KEY_ID,
      },
      purchaseId: purchase._id,
      mockMode: MOCK_MODE,
    });
  } catch (error) {
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, purchaseId } = req.body;

    // MOCK MODE - Auto-approve
    if (MOCK_MODE || razorpay_order_id?.startsWith('mock_')) {
      console.log('🧪 MOCK: Auto-approving payment');
      
      const purchase = await Purchase.findById(purchaseId);
      if (!purchase) {
        return res.status(404).json({
          success: false,
          message: 'Purchase not found',
        });
      }

      purchase.status = 'completed';
      purchase.razorpayPaymentId = razorpay_payment_id || 'mock_payment_id';
      purchase.razorpaySignature = razorpay_signature || 'mock_signature';
      await purchase.save();

      // Add to user's purchased items
      const user = await User.findById(req.user.id);
      user.purchasedItems.push({
        pdfId: purchase.pdf,
        purchasedAt: new Date(),
      });
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Mock payment verified successfully',
        purchase: purchase,
      });
    }

    // REAL RAZORPAY VERIFICATION
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

    // Update purchase
    const purchase = await Purchase.findById(purchaseId);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found',
      });
    }

    purchase.status = 'completed';
    purchase.razorpayPaymentId = razorpay_payment_id;
    purchase.razorpaySignature = razorpay_signature;
    await purchase.save();

    // Add to user's purchased items
    const user = await User.findById(req.user.id);
    user.purchasedItems.push({
      pdfId: purchase.pdf,
      purchasedAt: new Date(),
    });
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      purchase: purchase,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user purchases
// @route   GET /api/payments/purchases
// @access  Private
const getUserPurchases = async (req, res, next) => {
  try {
    const purchases = await Purchase.find({ user: req.user.id })
      .populate('pdf')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: purchases.length,
      data: purchases,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getUserPurchases,
};

