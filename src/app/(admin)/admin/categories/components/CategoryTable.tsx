"use client";

import { DataTable } from "@/components/DataTable";
import { CategoryDialog } from "./CategoryDialog";
import { DeleteCategoryButton } from "./DeleteCategoryButton";

export function CategoryTable({ data }: { data: any[] }) {
  const categoryColumns = [
    {
      header: "Category Name",
      accessor: "name" as const,
      searchable: true,
    },
    {
      header: "Actions",
      className: "text-right",
      accessor: (category: any) => (
        <div className="flex justify-end gap-2">
          <CategoryDialog initialData={category} />
          <DeleteCategoryButton id={category.id} name={category.name} />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={categoryColumns}
      initialPageSize={10}
      searchPlaceholder="Search categories..."
    />
  );
}
