'use client';

import AdminContractForm from "../../components/AdminContractForm";
import { ContractData, Contract } from "../../types/contract";
import { useState, useEffect } from "react";
import Link from 'next/link';

export default function AdminPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await fetch('/api/contracts');
      if (!response.ok) {
        throw new Error('Failed to fetch contracts');
      }
      const data = await response.json();
      setContracts(data);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  };

  const handleDelete = async (contractId: string) => {
    if (!window.confirm('Are you sure you want to delete this contract?')) {
      return;
    }

    try {
      setIsDeleting(contractId);
      setDeleteError(null);
      
      const response = await fetch(`/api/contracts/delete/${contractId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete contract');
      }

      // Remove the deleted contract from the state
      setContracts(prevContracts => prevContracts.filter(contract => contract.id !== contractId));
    } catch (error) {
      console.error('Error deleting contract:', error);
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete contract');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSubmit = async (data: ContractData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          remuneration: Number(data.remuneration),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create contract');
      }

      const result = await response.json();
      
      // Refresh contracts list
      await fetchContracts();
      
      // Redirect to contractor page
      window.location.href = `/contractor?contractId=${result.id}`;
    } catch (error) {
      console.error('Error creating contract:', error);
      setError(error instanceof Error ? error.message : 'Failed to create contract');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Contract Management</h1>
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Create New Contract</h2>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <AdminContractForm 
                onSubmit={handleSubmit} 
                key={isSubmitting ? 'submitting' : 'ready'}
              />
              {isSubmitting && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-lg">Creating contract...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Previous Contracts</h2>
              {deleteError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{deleteError}</span>
                </div>
              )}
              <div className="space-y-4">
                {contracts.map((contract) => (
                  <div key={contract.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">
                          {contract.contractorData ? contract.contractorData.fullName : 'No contractor yet'}
                        </p>
                        <p className="text-sm text-gray-600">Created: {new Date(contract.createdAt).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">Status: {contract.status}</p>
                        <p className="text-sm text-gray-600 mt-2">Work Scope:</p>
                        <p className="text-sm text-gray-800 whitespace-pre-line">{contract.workScope}</p>
                      </div>
                      <div className="space-y-2">
                        <a
                          href={`/contractor?contractId=${contract.id}`}
                          className="block w-full text-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                        >
                          Edit
                        </a>
                        <a
                          href={`/api/contracts/${contract.id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                        >
                          PDF
                        </a>
                        <button
                          onClick={() => handleDelete(contract.id)}
                          disabled={isDeleting === contract.id}
                          className="block w-full text-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting === contract.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {contracts.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No contracts yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
