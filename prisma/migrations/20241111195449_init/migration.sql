-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "contractDate" TEXT NOT NULL,
    "companyType" TEXT NOT NULL,
    "companyAddress" TEXT NOT NULL,
    "companyNIP" TEXT NOT NULL,
    "workScope" TEXT NOT NULL DEFAULT '',
    "authorizationText" TEXT NOT NULL DEFAULT 'The Contractor shall use his own materials and tools to complete the work. The Contractor, in exchange for the remuneration specified in § 4, shall authorize the use of the aforementioned materials for the promotion of the Ordering Party in the Ordering Party''s social channels and promotional materials.',
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "remuneration" REAL NOT NULL,
    "remunerationText" TEXT NOT NULL DEFAULT 'For the performance of the work, the Contractor shall receive a lump sum remuneration in the amount of 450 euros net, in words: four hundred and fifty euros net, payable within 14 days from the date of completion of the work and its acceptance by the Contracting Authority.',
    "contractorDataId" TEXT,
    CONSTRAINT "Contract_contractorDataId_fkey" FOREIGN KEY ("contractorDataId") REFERENCES "ContractorData" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContractorData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "birthDate" TEXT,
    "birthPlace" TEXT,
    "idNumber" TEXT,
    "bankAccount" TEXT NOT NULL
);
