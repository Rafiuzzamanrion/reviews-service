import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { auth } from '@/lib/auth';

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    const newMethod = await request.json();

    if (!newMethod.name || !newMethod.key) {
      return NextResponse.json({ error: 'Name and key are required' }, { status: 400 });
    }

    const settings = await Settings.findOneAndUpdate(
      {},
      { 
        $push: { paymentMethods: newMethod },
        $set: { updatedAt: new Date() }
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Payment method POST error:', error);
    return NextResponse.json({ error: 'Failed to add payment method' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    const settings = await Settings.findOneAndUpdate(
      {},
      { 
        $pull: { paymentMethods: { key } },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Payment method DELETE error:', error);
    return NextResponse.json({ error: 'Failed to remove payment method' }, { status: 500 });
  }
}
