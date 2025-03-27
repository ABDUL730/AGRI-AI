import MainLayout from "@/components/layout/main-layout";
import { useLanguage } from "@/hooks/use-language";

export default function Irrigation() {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-gray-900">{t("Irrigation Management")}</h1>
        <p className="mt-1 text-sm text-gray-600">{t("Monitor and control irrigation for your fields")}</p>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <span className="material-icons text-primary text-4xl">water_drop</span>
            <h2 className="mt-2 text-lg font-medium text-gray-900">{t("Irrigation Features Coming Soon")}</h2>
            <p className="mt-1 text-gray-500">{t("This feature is under development and will be available soon.")}</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
