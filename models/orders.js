import mongoose from 'mongoose';

const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: {
      type: JSON,
      required: true,
    },
    userData: {
      type: JSON,
      required: true,
    },
    orderStatus: {
      type: JSON,
      default: 1,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Order', OrderSchema);
