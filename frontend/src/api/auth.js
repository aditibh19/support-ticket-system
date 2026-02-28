const API_URL = process.env.REACT_APP_API_URL; // "http://ticket_backend:8000/api"

export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/accounts/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/accounts/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  // 🔥 SAVE TOKEN HERE
  if (result.token) {
    localStorage.setItem("authToken", result.token);
  }

  return result;
};