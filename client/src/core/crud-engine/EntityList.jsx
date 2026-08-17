import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosClient";
import { useAuth } from "../auth/AuthContext.jsx";

// Renders a data table for ANY entity, driven entirely by its schema descriptor.
export default function EntityList({ schema, apiPath, basePath }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const canCreate = user?.role === "admin" || schema.roles.create.includes(user?.role);
  const canUpdate = user?.role === "admin" || schema.roles.update.includes(user?.role);
  const canDelete = user?.role === "admin" || schema.roles.delete.includes(user?.role);

  async function fetchItems() {
    setLoading(true);
    const res = await api.get(apiPath);
    setItems(res.data.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function handleDelete(id) {
    if (!confirm("Delete this record?")) return;
    await api.delete(`${apiPath}/${id}`);
    fetchItems();
  }

  return (
    <div>
      <div className="toolbar">
        <input
          placeholder={`Search ${schema.name}s...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 260, padding: 8, borderRadius: 6, border: "1px solid #e2e6ee" }}
        />
        {canCreate && (
          <Link className="btn" to={`${basePath}/new`}>
            + Add {schema.name}
          </Link>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              {schema.listFields.map((f) => (
                <th key={f}>{schema.fields[f].label}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                {schema.listFields.map((f) => (
                  <td key={f}>{String(item[f] ?? "")}</td>
                ))}
                <td>
                  {canUpdate && <Link to={`${basePath}/${item._id}/edit`}>Edit</Link>}
                  {canDelete && (
                    <>
                      {" \u00b7 "}
                      <a href="#" onClick={(e) => { e.preventDefault(); handleDelete(item._id); }}>
                        Delete
                      </a>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={schema.listFields.length + 1}>No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
