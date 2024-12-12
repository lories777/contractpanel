'use client';

import { useForm } from "react-hook-form";
import { ContractorData } from "@/types/contract";
import { useState } from "react";

interface ContractorFormProps {
  contractId: string;
  defaultValues?: ContractorData;
}

export default function ContractorForm({ contractId, defaultValues }: ContractorFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContractorData>({
    defaultValues: defaultValues || {
      fullName: "",
      address: "",
      birthDate: "",
      birthPlace: "",
      idNumber: "",
      bankAccount: "",
    },
  });

  const onSubmit = async (data: ContractorData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      console.log('Submitting contractor data:', { contractId, ...data });

      const response = await fetch('/api/contractor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractId,
          ...data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save contractor data');
      }

      const result = await response.json();
      console.log('Contractor data saved:', result);

      // Redirect to PDF download
      window.location.href = `/api/contracts/${contractId}/pdf`;
    } catch (error) {
      console.error('Error saving contractor data:', error);
      setError(error instanceof Error ? error.message : 'Failed to save contractor data');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          {...register("fullName", { required: "Full name is required" })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <input
          type="text"
          {...register("address", { required: "Address is required" })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Birth Date
        </label>
        <input
          type="text"
          {...register("birthDate", { 
            required: "Birth date is required",
            pattern: {
              value: /^\d{1,2}\.\d{1,2}\.\d{4}$/,
              message: "Please enter date in format DD.MM.YYYY"
            }
          })}
          placeholder="DD.MM.YYYY"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
        {errors.birthDate && (
          <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Birth Place
        </label>
        <input
          type="text"
          {...register("birthPlace", { required: "Birth place is required" })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
        {errors.birthPlace && (
          <p className="mt-1 text-sm text-red-600">{errors.birthPlace.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          ID Number
        </label>
        <input
          type="text"
          {...register("idNumber", { required: "ID number is required" })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
        {errors.idNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.idNumber.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Bank Account (2 letters + 22 digits)
        </label>
        <input
          type="text"
          {...register("bankAccount", { 
            required: "Bank account is required",
            pattern: {
              value: /^[A-Z]{2}\d{22}$/,
              message: "Please enter valid bank account (2 letters + 22 digits)"
            }
          })}
          placeholder="XX0000000000000000000000"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
        {errors.bankAccount && (
          <p className="mt-1 text-sm text-red-600">{errors.bankAccount.message}</p>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save and Generate PDF'}
        </button>
      </div>
    </form>
  );
}
