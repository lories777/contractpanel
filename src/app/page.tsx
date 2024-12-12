'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Contract Management System</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link 
            href="/admin" 
            className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
          >
            <h2 className="text-2xl font-semibold mb-4">Admin Panel</h2>
            <p className="text-gray-600 mb-4">Create and manage contracts</p>
            <ul className="text-sm text-gray-500 list-disc list-inside">
              <li>Create new contracts</li>
              <li>View existing contracts</li>
              <li>Generate PDFs</li>
            </ul>
          </Link>
          
          <Link 
            href="/contractor" 
            className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
          >
            <h2 className="text-2xl font-semibold mb-4">Contractor Panel</h2>
            <p className="text-gray-600 mb-4">Fill in contractor details</p>
            <ul className="text-sm text-gray-500 list-disc list-inside">
              <li>Enter personal information</li>
              <li>Submit contract details</li>
              <li>Download contract PDF</li>
            </ul>
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          Select a panel to get started
        </div>
      </div>
    </div>
  );
}
