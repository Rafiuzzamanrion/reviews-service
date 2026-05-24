import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { auth } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const adminView = searchParams.get('view') === 'admin';

    let query = { projectSource: 'premiums-edu' };
    
    // Only fetch ALL orders if the user is an admin AND requested the admin view
    if (!(session.user.role === 'admin' && adminView)) {
      query.userId = session.user.id;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();
    const { productId, quantity, fullName, contact, deliveryAddress, paymentMethod, transactionId } = data;

    if (!productId || !quantity || !fullName || !contact || !deliveryAddress || !paymentMethod || !transactionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return NextResponse.json({ error: 'Product not available' }, { status: 400 });
    }

    if (quantity < product.minOrder) {
      return NextResponse.json({ error: `Minimum order is ${product.minOrder}` }, { status: 400 });
    }

    if (quantity > product.stock) {
      return NextResponse.json({ error: `Not enough stock. Available: ${product.stock}` }, { status: 400 });
    }

    const totalPrice = quantity * product.price;

    const order = await Order.create({
      userId: session.user.id,
      productId: product._id,
      productSnapshot: {
        title: product.title,
        price: product.price,
        format: product.format,
        access: product.access,
        policy: product.policy,
        badge: product.badge,
        instantDelivery: product.instantDelivery,
      },
      quantity,
      totalPrice,
      fullName,
      contact,
      deliveryAddress,
      paymentMethod,
      transactionId,
      status: 'Pending',
    });

    // Deduct stock
    await Product.findByIdAndUpdate(product._id, { $inc: { stock: -quantity } });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}
