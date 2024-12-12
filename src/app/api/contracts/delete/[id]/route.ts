import { NextRequest, NextResponse } from 'next/server';
import prisma from "../../../../../lib/prisma";

export async function DELETE(
  request: NextRequest,
  context: { params: Record<string, string | string[]> }
) {
  const id = context.params.id as string;
  if (!id) {
    return NextResponse.json(
      { error: 'Contract ID is required' },
      { status: 400 }
    );
  }

  try {
    // Check if contract exists
    const contract = await prisma.contract.findUnique({
      where: { id },
    });

    if (!contract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }

    // Delete the contract
    await prisma.contract.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Contract deleted successfully' });
  } catch (error) {
    console.error('Error deleting contract:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete contract' },
      { status: 500 }
    );
  }
}
