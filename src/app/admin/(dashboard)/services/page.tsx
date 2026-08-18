"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, ListPlus, ChevronRight, Settings } from "lucide-react";
import CloudinaryUploadButton from "@/components/admin/CloudinaryUploadButton";

interface Service {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  display_order: number;
  image_url: string | null;
}

interface ServiceItem {
  id: string;
  service_id: string;
  title: string;
  description: string | null;
  display_order: number;
}

export default function AdminServicesPage() {
  const supabase = createClient();
  const [services, setServices] = useState<Service[]>([]);
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");



  // Master Service Form State
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isServiceCreateMode, setIsServiceCreateMode] = useState(false);
  const [serviceFormData, setServiceFormData] = useState({
    title: "",
    slug: "",
    description: "",
    display_order: 0,
    image_url: "",
  });

  // Service Items Form State
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [isItemCreateMode, setIsItemCreateMode] = useState(false);
  const [itemFormData, setItemFormData] = useState({
    title: "",
    description: "",
    display_order: 0,
  });

  async function fetchServices() {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setServices(data || []);

      if (data && data.length > 0 && !selectedService && !isServiceCreateMode) {
        // Auto select first service to show details
        handleSelectService(data[0]);
      }
    } catch (err: any) {
      setErrorMsg("Failed to load services: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchServiceItems(serviceId: string) {
    try {
      const { data, error } = await supabase
        .from("service_items")
        .select("*")
        .eq("service_id", serviceId)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setServiceItems(data || []);
    } catch (err: any) {
      setErrorMsg("Failed to load service items: " + err.message);
    }
  }

  useEffect(() => {
    fetchServices();
  }, []);

  function handleSelectService(service: Service) {
    setSelectedService(service);
    setIsServiceCreateMode(false);
    setEditingItem(null);
    setIsItemCreateMode(false);
    setServiceFormData({
      title: service.title,
      slug: service.slug,
      description: service.description || "",
      display_order: service.display_order,
      image_url: service.image_url || "",
    });
    fetchServiceItems(service.id);
  }

  function handleOpenServiceCreate() {
    setIsServiceCreateMode(true);
    setSelectedService(null);
    setServiceItems([]);
    setServiceFormData({
      title: "",
      slug: "",
      description: "",
      display_order: services.length > 0 ? Math.max(...services.map(s => s.display_order)) + 1 : 1,
      image_url: "",
    });
  }

  // Slug generator helper
  function handleTitleChange(val: string) {
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // remove non-alphanumeric/spaces/hyphens
      .replace(/[\s_]+/g, "-")   // replace spaces/underscores with hyphens
      .replace(/^-+|-+$/g, "");   // trim leading/trailing hyphens

    setServiceFormData(prev => ({
      ...prev,
      title: val,
      slug: generatedSlug,
    }));
  }

  // Save Service (Create or Update)
  async function handleSaveService(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const slugToSave = serviceFormData.slug.trim();

    try {
      // Validate Slug unique constraint locally first (excluding current editing service)
      const existingSlugMatch = services.find(
        s => s.slug === slugToSave && (!selectedService || s.id !== selectedService.id)
      );

      if (existingSlugMatch) {
        throw new Error(`The slug "${slugToSave}" is already used by another service.`);
      }

      const payload = {
        title: serviceFormData.title.trim(),
        slug: slugToSave,
        description: serviceFormData.description.trim() || null,
        display_order: Number(serviceFormData.display_order),
        image_url: serviceFormData.image_url || null,
      };

      if (isServiceCreateMode) {
        const { data, error } = await supabase
          .from("services")
          .insert(payload)
          .select()
          .single();

        if (error) throw error;
        setSuccessMsg("Service created successfully.");
        if (data) {
          handleSelectService(data);
        }
      } else if (selectedService) {
        const { error } = await supabase
          .from("services")
          .update(payload)
          .eq("id", selectedService.id);

        if (error) throw error;
        setSuccessMsg("Service updated successfully.");
      }

      fetchServices();
    } catch (err: any) {
      setErrorMsg("Failed to save service: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  function getStoragePathFromUrl(url: string | null) {
    if (!url) return null;
    const bucketName = "milan-assets";
    const marker = `/${bucketName}/`;
    const index = url.indexOf(marker);
    if (index !== -1) {
      return url.substring(index + marker.length);
    }
    return null;
  }

  const getPublicIdFromUrl = (url: string | null) => {
    if (!url || !url.includes("res.cloudinary.com")) return null;
    try {
      const parts = url.split("/upload/");
      if (parts.length < 2) return null;
      const pathWithVersion = parts[1];
      const pathParts = pathWithVersion.split("/");
      const hasVersion = pathParts[0].startsWith("v");
      const pathArray = hasVersion ? pathParts.slice(1) : pathParts;
      const fullPath = pathArray.join("/");
      const lastDotIndex = fullPath.lastIndexOf(".");
      return lastDotIndex !== -1 ? fullPath.substring(0, lastDotIndex) : fullPath;
    } catch (e) {
      return null;
    }
  };

  async function handleDeleteService(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete the service: "${title}"?\nAll associated scope items will be deleted permanently.`)) return;

    setErrorMsg("");
    setSuccessMsg("");

    const oldImageUrl = selectedService?.image_url ?? null;

    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSuccessMsg("Service deleted.");
      setSelectedService(null);
      fetchServices();

      // Clean up Supabase Storage if it was an old storage URL
      const path = getStoragePathFromUrl(oldImageUrl);
      if (path) {
        await supabase.storage.from("milan-assets").remove([path]);
      }

      // Clean up Cloudinary
      const publicId = getPublicIdFromUrl(oldImageUrl);
      if (publicId) {
        await fetch("/api/cloudinary/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId }),
        });
      }
    } catch (err: any) {
      setErrorMsg("Failed to delete service: " + err.message);
    }
  }

  // Reorder Services
  async function handleReorderService(service: Service, direction: "up" | "down") {
    const currentIndex = services.findIndex(s => s.id === service.id);
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === services.length - 1) return;

    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const swapService = services[swapIndex];

    try {
      setLoading(true);
      const { error: err1 } = await supabase
        .from("services")
        .update({ display_order: swapService.display_order })
        .eq("id", service.id);

      const { error: err2 } = await supabase
        .from("services")
        .update({ display_order: service.display_order })
        .eq("id", swapService.id);

      if (err1 || err2) throw new Error("Order swap failed");
      
      // Keep selected
      const updatedSelect = { ...service, display_order: swapService.display_order };
      setSelectedService(updatedSelect);
      
      fetchServices();
    } catch (err: any) {
      setErrorMsg("Failed to reorder services: " + err.message);
      setLoading(false);
    }
  }

  // --- SERVICE ITEMS CRUD ---

  function handleOpenItemCreate() {
    setIsItemCreateMode(true);
    setEditingItem(null);
    setItemFormData({
      title: "",
      description: "",
      display_order: serviceItems.length > 0 ? Math.max(...serviceItems.map(si => si.display_order)) + 1 : 1,
    });
  }

  function handleOpenItemEdit(item: ServiceItem) {
    setEditingItem(item);
    setIsItemCreateMode(false);
    setItemFormData({
      title: item.title,
      description: item.description || "",
      display_order: item.display_order,
    });
  }

  async function handleSaveItem(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedService) return;

    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const payload = {
        service_id: selectedService.id,
        title: itemFormData.title.trim(),
        description: itemFormData.description.trim() || null,
        display_order: Number(itemFormData.display_order),
      };

      if (isItemCreateMode) {
        const { error } = await supabase
          .from("service_items")
          .insert(payload);

        if (error) throw error;
        setSuccessMsg("Scope item added successfully.");
      } else if (editingItem) {
        const { error } = await supabase
          .from("service_items")
          .update(payload)
          .eq("id", editingItem.id);

        if (error) throw error;
        setSuccessMsg("Scope item updated.");
      }

      setIsItemCreateMode(false);
      setEditingItem(null);
      fetchServiceItems(selectedService.id);
    } catch (err: any) {
      setErrorMsg("Failed to save scope item: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteItem(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete the item: "${title}"?`)) return;
    if (!selectedService) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { error } = await supabase
        .from("service_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSuccessMsg("Scope item deleted.");
      fetchServiceItems(selectedService.id);
    } catch (err: any) {
      setErrorMsg("Failed to delete item: " + err.message);
    }
  }

  // Reorder Service Items
  async function handleReorderItem(item: ServiceItem, direction: "up" | "down") {
    const currentIndex = serviceItems.findIndex(si => si.id === item.id);
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === serviceItems.length - 1) return;

    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const swapItem = serviceItems[swapIndex];

    try {
      const { error: err1 } = await supabase
        .from("service_items")
        .update({ display_order: swapItem.display_order })
        .eq("id", item.id);

      const { error: err2 } = await supabase
        .from("service_items")
        .update({ display_order: item.display_order })
        .eq("id", swapItem.id);

      if (err1 || err2) throw new Error("Item swap failed");
      if (selectedService) {
        fetchServiceItems(selectedService.id);
      }
    } catch (err: any) {
      setErrorMsg("Failed to reorder scope items: " + err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-xs text-milan-gold font-mono tracking-widest animate-pulse">
          LOADING SERVICES SCHEMA...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="pb-6 border-b border-milan-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="heading-display text-2xl text-milan-ivory font-serif">
            SERVICES &amp; CAPABILITIES
          </h1>
          <p className="text-xs text-milan-muted mt-1 font-mono">
            Manage core service categories, slugs, descriptions, and their related capability scope tags.
          </p>
        </div>
        {!isServiceCreateMode && (
          <button
            onClick={handleOpenServiceCreate}
            className="flex items-center space-x-2 px-4 py-2 border border-milan-gold text-milan-gold hover:bg-milan-gold hover:text-milan-primary text-xs font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer"
          >
            <Plus size={14} />
            <span>Create Service</span>
          </button>
        )}
      </header>

      {successMsg && (
        <div className="bg-emerald-950/20 border border-emerald-500/35 p-4 text-xs text-emerald-400 font-mono">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-950/20 border border-red-500/35 p-4 text-xs text-red-400 font-mono">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Services list (Span 5) */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
            Service List ({services.length})
          </span>

          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
            {services.length === 0 ? (
              <div className="bg-milan-primary border border-milan-border p-6 text-center text-xs text-milan-muted">
                No services defined. Add one above.
              </div>
            ) : (
              services.map((service, idx) => (
                <div
                  key={service.id}
                  onClick={() => handleSelectService(service)}
                  className={`border p-4 flex items-center justify-between gap-4 cursor-pointer transition-colors duration-200 ${
                    selectedService?.id === service.id
                      ? "bg-milan-emerald border-milan-gold/30 text-milan-ivory"
                      : "bg-milan-primary border-milan-border text-milan-muted hover:border-milan-gold/25"
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <span className="text-xs font-mono text-milan-gold">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs uppercase tracking-wider truncate font-semibold">
                      {service.title}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReorderService(service, "up");
                      }}
                      disabled={idx === 0}
                      className="p-1 hover:text-milan-gold disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReorderService(service, "down");
                      }}
                      disabled={idx === services.length - 1}
                      className="p-1 hover:text-milan-gold disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown size={12} />
                    </button>
                    <ChevronRight size={14} className="text-milan-gold" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Service Form & Scope items (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          {isServiceCreateMode || selectedService ? (
            <div className="space-y-6">
              {/* Part 1: Service Metadata Editor */}
              <form onSubmit={handleSaveService} className="bg-milan-primary border border-milan-border p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-milan-border/50 pb-3">
                  <h3 className="heading-display text-xs text-milan-gold tracking-widest">
                    {isServiceCreateMode ? "New Service Parameters" : "Edit Service Details"}
                  </h3>
                  {!isServiceCreateMode && selectedService && (
                    <button
                      type="button"
                      onClick={() => handleDeleteService(selectedService.id, selectedService.title)}
                      className="text-[10px] text-red-400 hover:text-red-300 font-mono uppercase underline cursor-pointer"
                    >
                      Delete Service
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="service_title" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                    Service Title *
                  </label>
                  <input
                    id="service_title"
                    type="text"
                    required
                    value={serviceFormData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none"
                    placeholder="e.g. Turnkey Interior Fit-Out"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="service_slug" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                      URL Slug * (Auto-generated/Editable)
                    </label>
                    <input
                      id="service_slug"
                      type="text"
                      required
                      value={serviceFormData.slug}
                      onChange={(e) => setServiceFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="service_order" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                      Display Order *
                    </label>
                    <input
                      id="service_order"
                      type="number"
                      required
                      value={serviceFormData.display_order}
                      onChange={(e) => setServiceFormData(prev => ({ ...prev, display_order: Number(e.target.value) }))}
                      className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none font-mono"
                    />
                  </div>
                </div>

                 <div className="space-y-2">
                  <label htmlFor="service_description" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                    Public Description
                  </label>
                  <textarea
                    id="service_description"
                    rows={3}
                    value={serviceFormData.description}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Service image editor */}
                <div className="bg-milan-charcoal/30 border border-milan-border p-4 space-y-3">
                  <label className="text-[10px] tracking-wider text-milan-gold uppercase font-mono block">
                    Category Cover Image
                  </label>
                  <CloudinaryUploadButton
                    folder="milan-interio/services"
                    currentImageUrl={serviceFormData.image_url}
                    onUploadSuccess={(url) => setServiceFormData(prev => ({ ...prev, image_url: url }))}
                    onImageRemoved={() => setServiceFormData(prev => ({ ...prev, image_url: "" }))}
                    label="Upload Cover Image"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 border border-milan-gold bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold text-[10px] tracking-widest font-semibold uppercase transition-all duration-300 disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? "SAVING SERVICE..." : "SAVE SERVICE"}
                  </button>
                </div>
              </form>

              {/* Part 2: Scope Items CRUD (Module 6) — only if not in service creation mode */}
              {!isServiceCreateMode && selectedService && (
                <div className="bg-milan-primary border border-milan-border p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-milan-border/50 pb-3">
                    <h3 className="heading-display text-xs text-milan-gold tracking-widest">
                      Manage Capability Scope Tags
                    </h3>
                    {!isItemCreateMode && !editingItem && (
                      <button
                        onClick={handleOpenItemCreate}
                        className="flex items-center space-x-1.5 px-3 py-1.5 border border-milan-border text-milan-muted hover:text-milan-gold hover:border-milan-gold/40 text-[9px] uppercase tracking-wider font-mono cursor-pointer"
                      >
                        <Plus size={10} />
                        <span>Add Tag</span>
                      </button>
                    )}
                  </div>

                  {/* Scope Item Editor */}
                  {(isItemCreateMode || editingItem) && (
                    <form onSubmit={handleSaveItem} className="border border-milan-border bg-milan-charcoal/20 p-4 space-y-4 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-milan-gold">
                          {isItemCreateMode ? "Add Scope capability" : "Edit Scope capability"}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsItemCreateMode(false);
                            setEditingItem(null);
                          }}
                          className="text-[9px] text-milan-muted hover:text-milan-ivory font-mono uppercase"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-2">
                          <label htmlFor="item_title" className="text-[9px] text-milan-muted uppercase font-mono block">Title *</label>
                          <input
                            id="item_title"
                            type="text"
                            required
                            value={itemFormData.title}
                            onChange={(e) => setItemFormData({ ...itemFormData, title: e.target.value })}
                            className="w-full bg-milan-charcoal border border-milan-border p-2 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none"
                            placeholder="e.g. Concept development"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="item_order" className="text-[9px] text-milan-muted uppercase font-mono block">Order *</label>
                          <input
                            id="item_order"
                            type="number"
                            required
                            value={itemFormData.display_order}
                            onChange={(e) => setItemFormData({ ...itemFormData, display_order: Number(e.target.value) })}
                            className="w-full bg-milan-charcoal border border-milan-border p-2 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="item_description" className="text-[9px] text-milan-muted uppercase font-mono block">Description (Optional)</label>
                        <textarea
                          id="item_description"
                          rows={2}
                          value={itemFormData.description}
                          onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                          className="w-full bg-milan-charcoal border border-milan-border p-2 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 bg-milan-gold text-milan-primary text-[9px] font-semibold tracking-wider uppercase disabled:opacity-50 cursor-pointer"
                      >
                        {saving ? "Saving Tag..." : "Save Tag"}
                      </button>
                    </form>
                  )}

                  {/* Scope Items List */}
                  {serviceItems.length === 0 ? (
                    <p className="text-xs text-milan-muted italic">No capabilities mapped to this service yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {serviceItems.map((item, idx) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4 p-3 bg-milan-charcoal/30 border border-milan-border"
                        >
                          <div className="min-w-0">
                            <span className="text-[10px] text-milan-ivory font-semibold block truncate">
                              {item.title}
                            </span>
                            {item.description && (
                              <span className="text-[10px] text-milan-muted block truncate mt-0.5 font-light">
                                {item.description}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 shrink-0">
                            <button
                              onClick={() => handleReorderItem(item, "up")}
                              disabled={idx === 0}
                              className="p-1 hover:text-milan-gold disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp size={12} />
                            </button>
                            <button
                              onClick={() => handleReorderItem(item, "down")}
                              disabled={idx === serviceItems.length - 1}
                              className="p-1 hover:text-milan-gold disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown size={12} />
                            </button>
                            <button
                              onClick={() => handleOpenItemEdit(item)}
                              className="p-1 text-milan-muted hover:text-milan-gold cursor-pointer"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id, item.title)}
                              className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-milan-primary border border-milan-border p-12 text-center text-xs text-milan-muted">
              Select a service from the left list to edit parameters or manage capabilities.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
