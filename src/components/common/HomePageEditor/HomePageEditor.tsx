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
  const [content, setContent] = useState<HomePageContent>({
    ...DEFAULT_HOME_PAGE_CONTENT,
    hotDealFlatIds: DEFAULT_HOME_PAGE_CONTENT.hotDealFlatIds || [],
  });
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
        // Ensure hotDealFlatIds has a default value if not present
        setContent({
          ...data,
          hotDealFlatIds: data.hotDealFlatIds || [],
        });
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
      // Create a request object that only includes the fields the backend expects
      const requestContent = {
        heroTitle: content.heroTitle,
        heroMotto: content.heroMotto,
        heroImageSrc: content.heroImageSrc,
        projects: content.projects,
        hotDealFlatIds: content.hotDealFlatIds,
        paymentMethods: content.paymentMethods,
        promotions: content.promotions,
        metaTitle: content.metaTitle,
        metaDescription: content.metaDescription,
        metaKeywords: content.metaKeywords,
        metaImage: content.metaImage,
        contactInfo: content.contactInfo,
      };
      await putHomePageContent(requestContent);
      setSuccess(true);
      // Emit event to notify HomePage to refresh
      window.dispatchEvent(new Event("homePageDataSaved"));
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
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto pt-8">
      <div className="bg-white rounded-lg p-8 max-w-3xl w-full mx-4 my-8">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hot Deal Flat IDs (comma-separated)
              </label>
              <input
                type="text"
                value={content.hotDealFlatIds.join(", ")}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    hotDealFlatIds: e.target.value
                      .split(",")
                      .map((id) => parseInt(id.trim()))
                      .filter((id) => !isNaN(id)),
                  }))
                }
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., 1, 2, 3, 4"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">SEO Metadata</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={content.metaTitle || ""}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      metaTitle: e.target.value || null,
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  value={content.metaDescription || ""}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      metaDescription: e.target.value || null,
                    }))
                  }
                  className="w-full border rounded px-3 py-2 h-16"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={content.metaKeywords || ""}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      metaKeywords: e.target.value || null,
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Image URL
                </label>
                <input
                  type="text"
                  value={content.metaImage || ""}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      metaImage: e.target.value || null,
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Payment Methods</h3>
              {content.paymentMethods.map((method, index) => (
                <div key={index} className="border rounded p-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={method.title}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          paymentMethods: prev.paymentMethods.map((m, i) =>
                            i === index ? { ...m, title: e.target.value } : m
                          ),
                        }))
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={method.description}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          paymentMethods: prev.paymentMethods.map((m, i) =>
                            i === index ? { ...m, description: e.target.value } : m
                          ),
                        }))
                      }
                      className="w-full border rounded px-3 py-2 h-12"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Promotions</h3>
              {content.promotions.map((promotion, index) => (
                <div key={promotion.id} className="border rounded p-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={promotion.title}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          promotions: prev.promotions.map((p, i) =>
                            i === index ? { ...p, title: e.target.value } : p
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
                      value={promotion.description}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          promotions: prev.promotions.map((p, i) =>
                            i === index ? { ...p, description: e.target.value } : p
                          ),
                        }))
                      }
                      className="w-full border rounded px-3 py-2 h-12"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Long Description
                    </label>
                    <textarea
                      value={promotion.longDescription || ""}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          promotions: prev.promotions.map((p, i) =>
                            i === index ? { ...p, longDescription: e.target.value || null } : p
                          ),
                        }))
                      }
                      className="w-full border rounded px-3 py-2 h-20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={promotion.imageSrc}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          promotions: prev.promotions.map((p, i) =>
                            i === index ? { ...p, imageSrc: e.target.value } : p
                          ),
                        }))
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Projects</h3>
              {content.projects.map((project, index) => (
                <div key={project.id} className="border rounded p-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          projects: prev.projects.map((p, i) =>
                            i === index ? { ...p, title: e.target.value } : p
                          ),
                        }))
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={project.location}
                      onChange={(e) => {
                        const newLocation = e.target.value;
                        setContent((prev) => ({
                          ...prev,
                          projects: prev.projects.map((p, i) =>
                            i === index 
                              ? {
                                  ...p,
                                  location: newLocation,
                                  params: p.params.map(param =>
                                    param.icon === "map"
                                      ? { ...param, value: newLocation }
                                      : param
                                  ),
                                }
                              : p
                          ),
                        }));
                      }}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Floors
                    </label>
                    <input
                      type="number"
                      value={project.floors}
                      onChange={(e) => {
                        const newFloors = parseInt(e.target.value) || 0;
                        setContent((prev) => ({
                          ...prev,
                          projects: prev.projects.map((p, i) =>
                            i === index 
                              ? {
                                  ...p,
                                  floors: newFloors,
                                  params: p.params.map(param =>
                                    param.icon === "building"
                                      ? { ...param, value: `${newFloors} этажей` }
                                      : param
                                  ),
                                }
                              : p
                          ),
                        }));
                      }}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={project.description}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          projects: prev.projects.map((p, i) =>
                            i === index ? { ...p, description: e.target.value } : p
                          ),
                        }))
                      }
                      className="w-full border rounded px-3 py-2 h-20"
                    />
                  </div>
                </div>
              ))}
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
