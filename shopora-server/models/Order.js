import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        _id: false,
        id: Number,
        title: String,
        price: Number,
        qty: Number,
      },
    ],
    shipping: {
      name: String,
      email: String,
      address: String,
      city: String,
      zip: String,
    },
    couponCode: String,
    subtotal: Number,
    discount: Number,
    tax: Number,
    total: Number,
  },
  { timestamps: true },
)

export default mongoose.models.Order || mongoose.model('Order', orderSchema)