import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { auth } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const { note } = await request.json();

    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (order.refillRequest?.requested) {
      return NextResponse.json({ error: 'Refill already requested' }, { status: 400 });
    }

    order.refillRequest = {
      requested: true,
      requestedAt: new Date(),
      note: note || '',
      status: 'Pending',
    };

    await order.save();

    return NextResponse.json(order);
  } catch (error) {
    console.error('Refill request POST error:', error);
    return NextResponse.json({ error: 'Failed to request refill' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    const { id } = await params;
    const { status, adminNote } = await request.json();

    if (!['Fulfilled', 'Rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!order.refillRequest?.requested) {
      return NextResponse.json({ error: 'No refill request exists for this order' }, { status: 400 });
    }

    order.refillRequest.status = status;
    if (adminNote !== undefined) {
      order.refillRequest.adminNote = adminNote;
    }

    await order.save();

    return NextResponse.json(order);
  } catch (error) {
    console.error('Refill update PUT error:', error);
    return NextResponse.json({ error: 'Failed to update refill request' }, { status: 500 });
  }
}
