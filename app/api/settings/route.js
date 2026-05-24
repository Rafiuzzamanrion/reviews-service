import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const settings = await Settings.findOne({});
    
    if (!settings) {
      return NextResponse.json({ paymentMethods: [] });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    const { paymentMethods } = await request.json();

    if (!Array.isArray(paymentMethods)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    const settings = await Settings.findOneAndUpdate(
      {},
      { paymentMethods, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
