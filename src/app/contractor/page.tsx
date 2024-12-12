'use client';

import { useSearchParams } from 'next/navigation';
import ContractorForm from '@/components/ContractorForm';
import Link from 'next/link';

export default function ContractorPage() {
  const searchParams = useSearchParams();
  const contractId = searchParams.get('contractId');

  if (!contractId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
              <div className="text-red-600 mb-6">
                <h2 className="text-xl font-semibold mb-2">Contract ID Required</h2>
                <p className="text-gray-600">Please select a contract from the admin panel first.</p>
              </div>
              
              <div className="space-y-4">
                <Link 
                  href="/admin" 
                  className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Go to Admin Panel
                </Link>
                
                <Link 
                  href="/" 
                  className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Panel Wykonawcy</h1>
              <p className="text-gray-600">Uzupełnij swoje dane do umowy</p>
            </div>
            <div className="space-x-4">
              <Link 
                href="/admin" 
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Admin Panel
              </Link>
              <Link 
                href="/" 
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Home
              </Link>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <ContractorForm contractId={contractId} />
          </div>
        </div>
      </div>
    </div>
  );
}
