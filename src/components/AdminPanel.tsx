import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Component, ComponentType } from "../types/component";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";

const COMPONENT_TYPES: ComponentType[] = [
  "CPU",
  "GPU",
  "RAM",
  "Motherboard",
  "Storage",
  "PSU",
  "Case",
  "Cooler",
];

export default function AdminPanel() {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [filterType, setFilterType] = useState<ComponentType | "All">("All");

  const [formData, setFormData] = useState({
    name: "",
    type: "CPU" as ComponentType,
    price: "",
    image_url: "",
    description: "",
    specs: "",
  });

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("components")
      .select("*")
      .order("type")
      .order("price");

    if (!error) setComponents(data || []);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "CPU",
      price: "",
      image_url: "",
      description: "",
      specs: "",
    });
  };

  const openAddModal = () => {
    resetForm();
    setEditingId(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (component: Component) => {
    setFormData({
      name: component.name,
      type: component.type,
      price: component.price.toString(),
      image_url: component.image_url,
      description: component.description || "",
      specs: component.specs || "",
    });

    setEditingId(component.id);
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setEditingId(null);
    resetForm();
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: Number(formData.price),
    };

    if (editingId) {
      await supabase
        .from("components")
        .update(payload)
        .eq("id", editingId);
    } else {
      await supabase.from("components").insert(payload);
    }

    closeModal();
    fetchComponents();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus komponen ini?")) return;

    await supabase.from("components").delete().eq("id", id);

    fetchComponents();
  };

  const filteredComponents =
    filterType === "All"
      ? components
      : components.filter((c) => c.type === filterType);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  /* MODAL COMPONENT */
  const Modal = ({
    title,
    children,
    onClose,
  }: {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-slate-800 mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-slate-800">Admin Panel</h1>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} /> Tambah Komponen
          </button>
        </div>

        {/* FILTER */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterType("All")}
            className={`px-4 py-2 rounded-lg ${
              filterType === "All"
                ? "bg-slate-700 text-white"
                : "bg-white text-slate-700 border"
            }`}
          >
            Semua
          </button>

          {COMPONENT_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg ${
                filterType === type
                  ? "bg-slate-700 text-white"
                  : "bg-white text-slate-700 border"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* LIST */}
        {!loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComponents.map((component) => (
              <div
                key={component.id}
                className="bg-white shadow-md rounded-xl overflow-hidden border"
              >
                <div className="aspect-video bg-slate-200">
                  <img
                    src={component.image_url}
                    alt={component.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <span className="px-2 py-1 text-xs bg-slate-700 text-white rounded">
                    {component.type}
                  </span>

                  <h3 className="text-lg font-semibold mt-2">
                    {component.name}
                  </h3>

                  <p className="text-sm text-slate-600 mt-1">
                    {component.specs}
                  </p>

                  <p className="text-blue-600 font-bold text-lg mt-3">
                    {formatPrice(component.price)}
                  </p>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => openEditModal(component)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(component.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">Memuat...</p>
        )}
      </div>

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <Modal title="Tambah Komponen" onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* input fields */}
            <InputFields formData={formData} setFormData={setFormData} />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <Save size={18} /> Simpan
            </button>
          </form>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <Modal title="Edit Komponen" onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputFields formData={formData} setFormData={setFormData} />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <Save size={18} /> Update
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* COMPONENT UNTUK INPUT FIELD — BIAR LEBIH BERSIH */
function InputFields({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: any;
}) {
  return (
    <>
      <div>
        <label className="font-medium">Nama</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="font-medium">Tipe</label>
        <select
          value={formData.type}
          onChange={(e) =>
            setFormData({ ...formData, type: e.target.value })
          }
          className="w-full border rounded px-3 py-2"
        >
          {COMPONENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-medium">Harga</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="font-medium">URL Gambar</label>
        <input
          type="text"
          value={formData.image_url}
          onChange={(e) =>
            setFormData({ ...formData, image_url: e.target.value })
          }
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="font-medium">Spesifikasi</label>
        <input
          type="text"
          value={formData.specs}
          onChange={(e) =>
            setFormData({ ...formData, specs: e.target.value })
          }
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="font-medium">Deskripsi</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          className="w-full border rounded px-3 py-2"
        />
      </div>
    </>
  );
}
