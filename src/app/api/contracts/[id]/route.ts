import { NextRequest, NextResponse } from 'next/server';
import prisma from "../../../../lib/prisma";

type Props = {
  params: { id: string }
}

export async function GET(
  req: NextRequest,
  { params }: Props
): Promise<Response> {
  try {
    const contract = await prisma.contract.findUnique({
      where: { id: params.id },
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
  req: NextRequest,
  { params }: Props
): Promise<Response> {
  try {
    await prisma.contract.delete({
      where: { id: params.id },
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
