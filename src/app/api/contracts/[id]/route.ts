import { NextRequest, NextResponse } from 'next/server';
import prisma from "../../../../lib/prisma";

type RouteContext = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function GET(
  request: NextRequest,
  { params, searchParams }: RouteContext
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
  request: NextRequest,
  { params, searchParams }: RouteContext
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
