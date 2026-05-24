import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { auth } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    const { id } = await params;
    const { status } = await request.json();

    const validStatuses = ['Pending', 'Processing', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // If order is cancelled, return stock to product
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      await Product.findByIdAndUpdate(order.productId, { $inc: { stock: order.quantity } });
    } else if (order.status === 'Cancelled' && status !== 'Cancelled') {
      // If un-cancelling, deduct stock again
      await Product.findByIdAndUpdate(order.productId, { $inc: { stock: -order.quantity } });
    }

    order.status = status;
    await order.save();

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order status update error:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
