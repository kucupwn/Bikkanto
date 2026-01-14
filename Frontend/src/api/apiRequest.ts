export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const res = await fetch(endpoint, options);
    let data: any = null;
    try {
      data = await res.json();
    } catch {}

    if (!res.ok) {
      const msg = data?.message || data?.error || data?.detail;
      throw {
        status: res.status,
        message: msg ?? null,
        raw: data,
      };
    }

    return data as T;
  } catch (err) {
    if (err instanceof TypeError) {
      throw {
        status: 0,
        message: "Network error - server unreachable",
        raw: err,
      };
    }

    throw err;
  }
}

export function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
