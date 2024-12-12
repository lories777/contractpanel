'use client';

import { useForm } from "react-hook-form";
import { ContractData } from "@/types/contract";
import { useEffect } from "react";

interface AdminContractFormProps {
  onSubmit: (data: ContractData) => void;
  defaultValues?: Partial<ContractData>;
}

export default function AdminContractForm({ onSubmit, defaultValues }: AdminContractFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContractData>({
    defaultValues: {
      contractDate: "",
      companyType: "PC_Beskidy",
      companyAddress: "PC Beskidy Sp. z o.o. Górnicza St. 1 32- 332 Bukowno",
      companyNIP: "6372217791",
      workScope: "",
      startDate: "",
      endDate: "",
      remuneration: 0,
      remunerationText: "For the performance of the work, the Contractor shall receive a lump sum remuneration in the amount of 450 euros net, in words: four hundred and fifty euros net, payable within 14 days from the date of completion of the work and its acceptance by the Contracting Authority.",
      authorizationText: "The Contractor shall use his own materials and tools to complete the work. The Contractor, in exchange for the remuneration specified in § 4, shall authorize the use of the aforementioned materials for the promotion of the Ordering Party in the Ordering Party's social channels and promotional materials.",
      ...defaultValues,
    },
  });

  const companyType = watch("companyType");
  const contractDate = watch("contractDate");

  // Update company details when company type changes
  useEffect(() => {
    if (companyType === "PC_Beskidy") {
      setValue("companyAddress", "PC Beskidy Sp. z o.o. Górnicza St. 1 32- 332 Bukowno");
      setValue("companyNIP", "6372217791");
    } else {
      setValue("companyAddress", "Paris Cosmetics Sp. z o.o. Górnicza St. 1 32- 332 Bukowno");
      setValue("companyNIP", "6372211771");
    }
  }, [companyType, setValue]);

  // Update start date when contract date changes
  useEffect(() => {
    if (contractDate) {
      setValue("startDate", contractDate);
    }
  }, [contractDate, setValue]);

  const onFormSubmit = async (data: ContractData) => {
    try {
      console.log('Form data before submission:', data);
      await onSubmit(data);
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Contract Date
        </label>
        <input
          type="text"
          {...register("contractDate", { 
            required: "Contract date is required",
            pattern: {
              value: /^\d{1,2}\.\d{1,2}\.\d{4}$/,
              message: "Please enter date in format DD.MM.YYYY"
            }
          })}
          placeholder="DD.MM.YYYY"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
        {errors.contractDate && (
          <p className="mt-1 text-sm text-red-600">{errors.contractDate.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Company Type
        </label>
        <select
          {...register("companyType")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option value="PC_Beskidy">PC Beskidy</option>
          <option value="Paris_Cosmetics">Paris Cosmetics</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Work Scope
        </label>
        <textarea
          {...register("workScope", { required: "Work scope is required" })}
          rows={4}
          placeholder="Enter work scope details..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
        {errors.workScope && (
          <p className="mt-1 text-sm text-red-600">{errors.workScope.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Authorization Text
        </label>
        <textarea
          {...register("authorizationText", { required: "Authorization text is required" })}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
        {errors.authorizationText && (
          <p className="mt-1 text-sm text-red-600">{errors.authorizationText.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          End Date
        </label>
        <input
          type="text"
          {...register("endDate", { 
            required: "End date is required",
            pattern: {
              value: /^\d{1,2}\.\d{1,2}\.\d{4}$/,
              message: "Please enter date in format DD.MM.YYYY"
            }
          })}
          placeholder="DD.MM.YYYY"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
        {errors.endDate && (
          <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Remuneration (EUR)
        </label>
        <input
          type="number"
          {...register("remuneration", { 
            required: "Remuneration is required",
            min: { value: 0, message: "Remuneration must be positive" },
            valueAsNumber: true
          })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
        {errors.remuneration && (
          <p className="mt-1 text-sm text-red-600">{errors.remuneration.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Remuneration Text
        </label>
        <textarea
          {...register("remunerationText", { required: "Remuneration text is required" })}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
        {errors.remunerationText && (
          <p className="mt-1 text-sm text-red-600">{errors.remunerationText.message}</p>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="mt-4 p-4 bg-red-50 rounded-md">
          <h3 className="text-sm font-medium text-red-800">Form has errors:</h3>
          <ul className="mt-2 text-sm text-red-700">
            {Object.entries(errors).map(([key, error]) => (
              <li key={key}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
