import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/auth.store";
import { getAboutUsPageContent, putAboutUsPageContent } from "../../../services/api/pages.api.requests";
import type { AboutUsPageContent } from "../../../services/api/pages.api.types";
import { DEFAULT_ABOUT_US_PAGE_CONTENT } from "../../../services/api/pages.api.defaults";

interface AboutUsPageEditorProps {
  onClose: () => void;
}

const AboutUsPageEditor = ({ onClose }: AboutUsPageEditorProps) => {
  const { role, isAuthenticated } = useAuthStore();
  const [content, setContent] = useState<AboutUsPageContent>(DEFAULT_ABOUT_US_PAGE_CONTENT);
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
        const data = await getAboutUsPageContent();
        setContent(data);
      } catch (err) {
        setError("Failed to load about us page content");
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
      await putAboutUsPageContent(content);
      setSuccess(true);
      // Emit event to notify AboutUsPage to refresh
      window.dispatchEvent(new Event("aboutUsPageDataSaved"));
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError("Failed to save about us page content");
      console.error(err);
      setSaving(false);
    }
  };

  if (!isAuthenticated || !role || role === "CLIENT") {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto pt-8">
      <div className="bg-white rounded-lg p-8 max-w-3xl w-full mx-4 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit About Us Page</h2>
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
              <h3 className="text-lg font-semibold">Hero Section</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hero Image URL
                </label>
                <input
                  type="text"
                  value={content.hero.imageSrc}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        imageSrc: e.target.value,
                      },
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motto Part One
                </label>
                <input
                  type="text"
                  value={content.hero.motto.partOne}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        motto: {
                          ...prev.hero.motto,
                          partOne: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motto Part Two
                </label>
                <input
                  type="text"
                  value={content.hero.motto.partTwo}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        motto: {
                          ...prev.hero.motto,
                          partTwo: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motto Part Three
                </label>
                <input
                  type="text"
                  value={content.hero.motto.partThree}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        motto: {
                          ...prev.hero.motto,
                          partThree: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bottom Text
                </label>
                <textarea
                  value={content.hero.bottomText}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        bottomText: e.target.value,
                      },
                    }))
                  }
                  className="w-full border rounded px-3 py-2 h-20"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Image Row</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image 1 URL
                </label>
                <input
                  type="text"
                  value={content.imageRow.imageSrc1}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      imageRow: {
                        ...prev.imageRow,
                        imageSrc1: e.target.value,
                      },
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image 2 URL
                </label>
                <input
                  type="text"
                  value={content.imageRow.imageSrc2}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      imageRow: {
                        ...prev.imageRow,
                        imageSrc2: e.target.value,
                      },
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image 3 URL
                </label>
                <input
                  type="text"
                  value={content.imageRow.imageSrc3}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      imageRow: {
                        ...prev.imageRow,
                        imageSrc3: e.target.value,
                      },
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Principles</h3>
              {content.principles.map((principle, index) => (
                <div key={principle.id} className="border rounded p-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <textarea
                      value={principle.title}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          principles: prev.principles.map((p, i) =>
                            i === index ? { ...p, title: e.target.value } : p
                          ),
                        }))
                      }
                      className="w-full border rounded px-3 py-2 h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={principle.description}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          principles: prev.principles.map((p, i) =>
                            i === index ? { ...p, description: e.target.value } : p
                          ),
                        }))
                      }
                      className="w-full border rounded px-3 py-2 h-20"
                    />
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Image Number: {principle.imageNumber}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Values Image</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Values Image URL
                </label>
                <input
                  type="text"
                  value={content.valuesImage}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      valuesImage: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Values</h3>
              {content.values.map((value, index) => (
                <div key={value.id} className="border rounded p-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={value.title}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          values: prev.values.map((v, i) =>
                            i === index ? { ...v, title: e.target.value } : v
                          ),
                        }))
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={value.description}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          values: prev.values.map((v, i) =>
                            i === index ? { ...v, description: e.target.value } : v
                          ),
                        }))
                      }
                      className="w-full border rounded px-3 py-2 h-12"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    Icon Type: {value.iconType}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Partners</h3>
              {content.partners.map((partner, index) => (
                <div key={partner.id} className="border rounded p-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={partner.name}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          partners: prev.partners.map((p, i) =>
                            i === index ? { ...p, name: e.target.value } : p
                          ),
                        }))
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={partner.description}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          partners: prev.partners.map((p, i) =>
                            i === index ? { ...p, description: e.target.value } : p
                          ),
                        }))
                      }
                      className="w-full border rounded px-3 py-2 h-12"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    Icon Type: {partner.iconType}
                  </div>
                </div>
              ))}
            </div>

            {content.contactInfo && (
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
                        contactInfo: prev.contactInfo ? {
                          ...prev.contactInfo,
                          address: e.target.value,
                        } : prev.contactInfo,
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
                        contactInfo: prev.contactInfo ? {
                          ...prev.contactInfo,
                          workingHours: e.target.value,
                        } : prev.contactInfo,
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
                        contactInfo: prev.contactInfo ? {
                          ...prev.contactInfo,
                          phone: e.target.value,
                        } : prev.contactInfo,
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
                        contactInfo: prev.contactInfo ? {
                          ...prev.contactInfo,
                          email: e.target.value,
                        } : prev.contactInfo,
                      }))
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
            )}

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

export default AboutUsPageEditor;
