import React from "react";
import type { AboutUsInfo } from "../../store/ui.store.ts";

interface AboutUsFormProps {
  aboutUsData: AboutUsInfo;
  onAboutUsChange: (field: keyof AboutUsInfo, value: string | boolean) => void;
}

const AboutUsForm: React.FC<AboutUsFormProps> = ({
  aboutUsData,
  onAboutUsChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Миссия компании
        </label>
        <textarea
          value={aboutUsData.text1 ?? ""}
          onChange={(e) => onAboutUsChange("text1", e.target.value ?? "")}
          className="w-full border rounded px-3 py-2 h-24"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Опыт и экспертиза
        </label>
        <textarea
          value={aboutUsData.text2 ?? ""}
          onChange={(e) => onAboutUsChange("text2", e.target.value ?? "")}
          className="w-full border rounded px-3 py-2 h-24"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Что мы предлагаем
        </label>
        <textarea
          value={aboutUsData.text3 ?? ""}
          onChange={(e) => onAboutUsChange("text3", e.target.value ?? "")}
          className="w-full border rounded px-3 py-2 h-24"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Почему выбирают нас
        </label>
        <textarea
          value={aboutUsData.text4 ?? ""}
          onChange={(e) => onAboutUsChange("text4", e.target.value ?? "")}
          className="w-full border rounded px-3 py-2 h-24"
        />
      </div>
    </div>
  );
};

export default AboutUsForm;
