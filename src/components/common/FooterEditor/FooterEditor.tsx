import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/auth.store";
import { getFooterData, putFooterData } from "../../../services/api/pages.api.requests";
import type { FooterDto } from "../../../services/api/pages.api.types";
import styles from "./FooterEditor.module.css";

interface FooterEditorProps {
  onClose: () => void;
}

const DEFAULT_FOOTER: FooterDto = {
  phone: "+7 (3822) 30-99-22",
  email: "info@kvartalika.ru",
  footerDescription: "Квартиры комфорт-класса в Томске",
  title: "Кварталика",
  address: "Томск, площадь Батенькова 2, подъезд 7, этаж 3, офис 310",
  description: "Отдел продаж",
  privacy: "Политика конфиденциальности",
};

const FooterEditor = ({ onClose }: FooterEditorProps) => {
  const { isAuthenticated, role } = useAuthStore();
  const [footerData, setFooterData] = useState<FooterDto>(DEFAULT_FOOTER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated || !role || role === "CLIENT") {
    return null;
  }

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setLoading(true);
        const response = await getFooterData();
        setFooterData(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch footer data:", err);
        setError("Failed to load footer data");
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  const handleInputChange = (field: keyof FooterDto, value: string) => {
    setFooterData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await putFooterData(footerData);
      window.dispatchEvent(new Event("footerDataSaved"));
      onClose();
    } catch (err) {
      console.error("Failed to save footer data:", err);
      setError("Failed to save footer data");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.loadingContainer}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Edit Footer</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.content}>
          <div className={styles.section}>
            <label className={styles.label}>
              Title
              <input
                type="text"
                value={footerData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={styles.input}
              />
            </label>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>
              Footer Description
              <input
                type="text"
                value={footerData.footerDescription}
                onChange={(e) =>
                  handleInputChange("footerDescription", e.target.value)
                }
                className={styles.input}
              />
            </label>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>
              Contact Label
              <input
                type="text"
                value={footerData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className={styles.input}
              />
            </label>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>
              Address
              <textarea
                value={footerData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={styles.textarea}
                rows={3}
              />
            </label>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>
              Phone
              <input
                type="tel"
                value={footerData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={styles.input}
              />
            </label>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>
              Email
              <input
                type="email"
                value={footerData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={styles.input}
              />
            </label>
          </div>
        </div>

        <div className={styles.footer}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FooterEditor;
