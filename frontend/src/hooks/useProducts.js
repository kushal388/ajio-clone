import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { buildQuery } from "../utils/buildQuery";

export default function useProducts(filters) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const params = buildQuery(filters);
        const { data } = await api.get("/products", { params });
        if (!cancelled) {
          setProducts(data.items || []);
          setTotal(data.total || 0);
        }
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.error || e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [JSON.stringify(filters)]); // shallow-stable

  return { products, total, loading, error };
}
