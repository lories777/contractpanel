import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { ContractorData } from "../../../types/contract";

interface ContractorRequest extends ContractorData {
  contractId: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: ContractorRequest = await request.json();
    
    if (!data.contractId) {
      return NextResponse.json(
        { error: "Contract ID is required" },
        { status: 400 }
      );
    }

    // First, check if the contract exists
    const contract = await prisma.contract.findUnique({
      where: { id: data.contractId },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    // Create or update contractor data
    const contractorData = await prisma.contractorData.create({
      data: {
        fullName: data.fullName,
        address: data.address,
        birthDate: data.birthDate,
        birthPlace: data.birthPlace,
        idNumber: data.idNumber,
        bankAccount: data.bankAccount,
        contracts: {
          connect: { id: data.contractId }
        }
      },
    });

    // Update contract with contractor data
    const updatedContract = await prisma.contract.update({
      where: { id: data.contractId },
      data: {
        contractorData: {
          connect: { id: contractorData.id }
        }
      },
      include: {
        contractorData: true,
      },
    });

    return NextResponse.json(updatedContract);
  } catch (error) {
    console.error("Error saving contractor data:", error);
    return NextResponse.json(
      { error: "Failed to save contractor data" },
      { status: 500 }
    );
  }
}
