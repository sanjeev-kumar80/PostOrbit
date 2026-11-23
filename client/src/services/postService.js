
const API_BASE_URL = import.meta.env.DEV ? "/api" : (import.meta.env.VITE_API_URL || "/api");
const API_URL = `${API_BASE_URL}/posts`;

const getHeaders = () => {
  const token = localStorage.getItem("postorbitToken");

  if (!token) {
    throw new Error("Please login first");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const handleResponse = async (response) => {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
};

export const createPost = async (data) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

export const getMyPosts = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getHeaders(),
  });

  return handleResponse(response);
};

export const updatePost = async (id, data) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

export const deletePost = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  return handleResponse(response);
};
