import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { ContractData } from "../../../types/contract";
import { Prisma } from "@prisma/client";

export async function GET(): Promise<Response> {
  try {
    const contracts = await prisma.contract.findMany({
      include: {
        contractorData: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(contracts);
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contracts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const data: ContractData = await request.json();
    console.log('Received contract data:', data);

    // Set company address and NIP based on company type
    const companyAddress = data.companyType === 'PC_Beskidy'
      ? "PC Beskidy Sp. z o.o. Górnicza St. 1 32- 332 Bukowno"
      : "Paris Cosmetics Sp. z o.o. Górnicza St. 1 32- 332 Bukowno";

    const companyNIP = data.companyType === 'PC_Beskidy'
      ? "6372217791"
      : "6372211771";

    // Create contract using transaction
    const contract = await prisma.$transaction(async (prisma) => {
      // Create contract
      const newContract = await prisma.contract.create({
        data: {
          contractDate: data.contractDate,
          companyType: data.companyType,
          companyAddress: companyAddress,
          companyNIP: companyNIP,
          workScope: data.workScope,
          startDate: data.contractDate,
          endDate: data.endDate,
          remuneration: data.remuneration,
          remunerationText: data.remunerationText,
          authorizationText: data.authorizationText || "The Contractor shall use his own materials and tools to complete the work. The Contractor, in exchange for the remuneration specified in § 4, shall authorize the use of the aforementioned materials for the promotion of the Ordering Party in the Ordering Party's social channels and promotional materials.",
        } as Prisma.ContractCreateInput,
      });

      // Return the created contract with relations
      return await prisma.contract.findUnique({
        where: { id: newContract.id },
        include: {
          contractorData: true,
        },
      });
    });

    console.log('Created contract:', contract);
    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    console.error("Error creating contract:", error);
    return NextResponse.json(
      { error: "Failed to create contract", details: error },
      { status: 500 }
    );
  }
}
