import { getStoreProfile } from "@/services/store-action";
import EditStoreForm from "./EditStoreForm";
import { redirect } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Edit3, Home, Store } from "lucide-react";

export default async function EditStorePage() {
  const store = await getStoreProfile();

  if (!store) redirect("/admin/setup-shop");

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/admin/dashboard"
              className="flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              <Home className="h-3.5 w-3.5" />
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/admin/store"
              className="flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              <Store className="h-3.5 w-3.5" />
              Store
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-1.5">
              <Edit3 className="h-3.5 w-3.5" />
              Edit Profil
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-2xl mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Edit Profil Toko</h1>
          <p className="text-muted-foreground">
            Perbarui informasi toko Anda yang tampil di publik.
          </p>
        </div>

        <EditStoreForm initialData={store} />
      </div>
    </>
  );
}
