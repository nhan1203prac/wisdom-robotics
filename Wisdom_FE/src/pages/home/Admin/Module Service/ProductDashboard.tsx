import { useEffect, useState } from "react";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../../../../service/http/serviceApi";

import AdminLayout from "../../../home/Admin/Layouts/AdminLayout";
import { Service } from "../../../../types/service.type";

export default function ProductDashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    serviceName: "",
    description: "",
    basePrice: 0,
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  // ================================
  // LOAD DATA
  // ================================

  const loadServices = async () => {
    const data = await getServices();
    setServices(data);
  };

  useEffect(() => {
    loadServices();
  }, []);

  // ================================
  // INPUT CHANGE
  // ================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "basePrice" ? Number(value) : value,
    });
  };

  // ================================
  // IMAGE CHANGE
  // ================================

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setThumbnail(file);

      setPreview(URL.createObjectURL(file));
    }
  };

  // ================================
  // SUBMIT CREATE / UPDATE
  // ================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("serviceName", form.serviceName);
    formData.append("description", form.description);
    formData.append("basePrice", String(form.basePrice));

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      if (editingId) {
        await updateService(editingId, formData);
      } else {
        await createService(formData);
      }

      resetForm();
      loadServices();
    } catch {
      alert("Create service failed");
    }
  };

  // ================================
  // RESET FORM
  // ================================

  const resetForm = () => {
    setForm({
      serviceName: "",
      description: "",
      basePrice: 0,
    });

    setEditingId(null);
    setThumbnail(null);
    setPreview("");
  };

  // ================================
  // EDIT
  // ================================

  const handleEdit = (service: Service) => {
    setForm({
      serviceName: service.serviceName,
      description: service.description,
      basePrice: service.basePrice,
    });

    setEditingId(service.serviceId);

    if (service.thumbnail) {
      setPreview(`http://localhost:8080/images/${service.thumbnail}`);
    }
  };

  // ================================
  // DELETE
  // ================================

  const handleDelete = async (id: number) => {
    if (confirm("Delete this service?")) {
      await deleteService(id);

      loadServices();
    }
  };

  // ================================
  // SEARCH
  // ================================

  const filteredServices = services.filter((s) =>
    s.serviceName.toLowerCase().includes(search.toLowerCase()),
  );

  // ================================
  // STATS
  // ================================

  const avgPrice =
    services.length > 0
      ? Math.round(
          services.reduce((a, b) => a + b.basePrice, 0) / services.length,
        )
      : 0;

  return (
    <AdminLayout>
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Service Management</h1>

        {/* STATISTIC */}

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500">Total Services</p>

            <h2 className="text-2xl font-bold">{services.length}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500">Average Price</p>

            <h2 className="text-2xl font-bold text-green-500">${avgPrice}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500">Total Views</p>

            <h2 className="text-2xl font-bold text-blue-500">
              👁 {services.reduce((a, b) => a + b.viewCount, 0)}
            </h2>
          </div>
        </div>

        {/* FORM */}

        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Update Service" : "Create Service"}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              name="serviceName"
              placeholder="Service name"
              value={form.serviceName}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />

            <input
              name="basePrice"
              type="number"
              placeholder="Price"
              value={form.basePrice}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />

            <div className="col-span-2">
              <input
                type="file"
                onChange={handleImageChange}
                className="border p-2 rounded"
              />

              {preview && (
                <img src={preview} className="w-24 h-24 mt-2 rounded border" />
              )}
            </div>

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="border p-2 rounded col-span-2"
            />

            <div className="col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {editingId ? "Update" : "Create"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search service..."
          className="border rounded-lg px-4 py-2 mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TABLE */}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">ID</th>
                <th>Image</th>
                <th>Service</th>
                <th>Price</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredServices.map((s) => (
                <tr key={s.serviceId} className="border-t">
                  <td className="p-3 text-center">{s.serviceId}</td>

                  <td className="text-center">
                    {s.thumbnail ? (
                      <img
                        src={`http://localhost:8080/images/${s.thumbnail}`}
                        className="w-14 h-14 object-cover rounded mx-auto"
                      />
                    ) : (
                      "No image"
                    )}
                  </td>

                  <td>
                    <div className="font-semibold">{s.serviceName}</div>

                    <div className="text-gray-500 text-xs">{s.description}</div>
                  </td>

                  <td className="text-center text-blue-600">${s.basePrice}</td>

                  <td className="text-center">👁 {s.viewCount}</td>

                  <td className="text-center">
                    <button
                      onClick={() => handleEdit(s)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(s.serviceId)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
