import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/auth.store";
import { getHomePageContent, putHomePageContent } from "../../../services/api/pages.api.requests";
import type { HomePageContent } from "../../../services/api/pages.api.types";
import { DEFAULT_HOME_PAGE_CONTENT } from "../../../services/api/pages.api.defaults";

interface HomePageEditorProps {
  onClose: () => void;
}

const HomePageEditor = ({ onClose }: HomePageEditorProps) => {
  const { role, isAuthenticated } = useAuthStore();
  const [content, setContent] = useState<HomePageContent>(DEFAULT_HOME_PAGE_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !role || role === "CLIENT") {
      onClose();
      return;
    }

    const fetchContent = async () => {
      try {
        const data = await getHomePageContent();
        setContent(data);
      } catch (err) {
        setError("Failed to load home page content");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [isAuthenticated, role, onClose]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await putHomePageContent(content);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError("Failed to save home page content");
      console.error(err);
      setSaving(false);
    }
  };

  if (!isAuthenticated || !role || role === "CLIENT") {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto py-10">
      <div className="bg-white rounded-lg p-8 max-w-3xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Home Page</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            Changes saved successfully!
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <form className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Hero Title</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Part One
                </label>
                <input
                  type="text"
                  value={content.heroTitle.partOne}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      heroTitle: {
                        ...prev.heroTitle,
                        partOne: e.target.value,
                      },
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Part Two
                </label>
                <input
                  type="text"
                  value={content.heroTitle.partTwo}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      heroTitle: {
                        ...prev.heroTitle,
                        partTwo: e.target.value,
                      },
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Part Three
                </label>
                <input
                  type="text"
                  value={content.heroTitle.partThree}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      heroTitle: {
                        ...prev.heroTitle,
                        partThree: e.target.value,
                      },
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Motto
              </label>
              <textarea
                value={content.heroMotto}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    heroMotto: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-2 h-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Image URL
              </label>
              <input
                type="text"
                value={content.heroImageSrc}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    heroImageSrc: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Info</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={content.contactInfo.address}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      contactInfo: {
                        ...prev.contactInfo,
                        address: e.target.value,
                      },
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Working Hours
                </label>
                <input
                  type="text"
                  value={content.contactInfo.workingHours}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      contactInfo: {
                        ...prev.contactInfo,
                        workingHours: e.target.value,
                      },
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={content.contactInfo.phone}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      contactInfo: {
                        ...prev.contactInfo,
                        phone: e.target.value,
                      },
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="text"
                  value={content.contactInfo.email}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      contactInfo: {
                        ...prev.contactInfo,
                        email: e.target.value,
                      },
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default HomePageEditor;
