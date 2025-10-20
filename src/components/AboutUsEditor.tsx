import { type FormEvent, useState, useEffect } from "react";
import { type AboutUsInfo, useUIStore } from "../store/ui.store";
import AboutUsForm from "./forms/AboutUsForm.tsx";

interface AboutUsEditorProps {
  onSaved?: () => void;
}

const AboutUsEditor = ({ onSaved }: AboutUsEditorProps) => {
  const aboutUsInfo = useUIStore((state) => state.aboutUsInfo);
  const updatePageInfo = useUIStore((state) => state.updateAboutUsInfo);
  const loading = useUIStore((state) => state.loading.upload);

  const [draftedAboutUsInfo, setDraftedAboutUsInfo] =
    useState<AboutUsInfo>(aboutUsInfo);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraftedAboutUsInfo(aboutUsInfo);
  }, [aboutUsInfo]);

  const handleAboutUsChange = (
    field: keyof AboutUsInfo,
    value: string | boolean,
  ) => {
    setDraftedAboutUsInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await updatePageInfo(draftedAboutUsInfo);
      onSaved?.();
    } catch (err) {
      console.error(err);
      setError("Не удалось сохранить информацию");
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <AboutUsForm
          aboutUsData={draftedAboutUsInfo}
          onAboutUsChange={handleAboutUsChange}
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutUsEditor;
