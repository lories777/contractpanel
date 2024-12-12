export interface ContractData {
  contractDate: string;
  companyType: 'PC_Beskidy' | 'Paris_Cosmetics';
  companyAddress: string;
  companyNIP: string;
  workScope: string;
  startDate: string;
  endDate: string;
  remuneration: number;
  remunerationText: string;
  authorizationText: string;
}

export interface ContractorData {
  id?: string;
  fullName: string;
  address: string;
  birthDate?: string;
  birthPlace?: string;
  idNumber?: string;
  bankAccount: string;
}

export interface Contract {
  id: string;
  status: 'draft' | 'pending' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  contractDate: string;
  companyType: 'PC_Beskidy' | 'Paris_Cosmetics';
  companyAddress: string;
  companyNIP: string;
  workScope: string;
  startDate: string;
  endDate: string;
  remuneration: number;
  remunerationText: string;
  authorizationText: string;
  contractorDataId: string | null;
  contractorData: ContractorData | null;
}
