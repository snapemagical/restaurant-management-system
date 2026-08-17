import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axiosClient";

// Renders a create/edit form for ANY entity, driven by its schema descriptor.
export default function EntityForm({ schema, apiPath, basePath }) {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [values, setValues] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      api.get(`${apiPath}/${id}`).then((res) => setValues(res.data.data));
    } else {
      const defaults = {};
      Object.entries(schema.fields).forEach(([key, def]) => {
        if (def.default !== undefined) defaults[key] = def.default;
      });
      setValues(defaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function handleChange(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (isEdit) {
        await api.put(`${apiPath}/${id}`, values);
      } else {
        await api.post(apiPath, values);
      }
      navigate(basePath);
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 480 }}>
      <h2>{isEdit ? `Edit ${schema.name}` : `Add ${schema.name}`}</h2>
      {Object.entries(schema.fields).map(([key, def]) => (
        <div className="form-group" key={key}>
          <label>{def.label}{def.required && " *"}</label>
          {def.enum ? (
            <select value={values[key] ?? ""} onChange={(e) => handleChange(key, e.target.value)} required={def.required}>
              <option value="" disabled>Select...</option>
              {def.enum.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={def.type === "Number" ? "number" : "text"}
              value={values[key] ?? ""}
              onChange={(e) => handleChange(key, def.type === "Number" ? Number(e.target.value) : e.target.value)}
              required={def.required}
            />
          )}
        </div>
      ))}
      {error && <p className="error-text">{error}</p>}
      <button className="btn" type="submit">{isEdit ? "Save Changes" : "Create"}</button>
    </form>
  );
}
