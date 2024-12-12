import { NextRequest, NextResponse } from 'next/server';
import prisma from "../../../../lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Record<string, string | string[]> }
) {
  try {
    const id = context.params.id as string;
    const contract = await prisma.contract.findUnique({
      where: { id },
      include: { contractorData: true },
    });

    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    return NextResponse.json(contract);
  } catch (error) {
    console.error('Error fetching contract:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contract' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Record<string, string | string[]> }
) {
  try {
    const id = context.params.id as string;
    await prisma.contract.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contract:', error);
    return NextResponse.json(
      { error: 'Failed to delete contract' },
      { status: 500 }
    );
  }
}
