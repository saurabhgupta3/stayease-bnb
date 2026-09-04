// Thin fetch wrapper around the Express JSON API.
// credentials are always sent so the express-session cookie rides along.
const BASE = import.meta.env.VITE_API_BASE_URL || "";

class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

async function request(path, { method = "GET", body, isFormData = false } = {}) {
    const options = { method, credentials: "include" };

    if (body !== undefined) {
        if (isFormData) {
            options.body = body; // let the browser set the multipart boundary
        } else {
            options.headers = { "Content-Type": "application/json" };
            options.body = JSON.stringify(body);
        }
    }

    let res;
    try {
        res = await fetch(`${BASE}/api${path}`, options);
    } catch {
        throw new ApiError(0, "Could not reach the server. Is it running?");
    }

    const text = await res.text();
    let data = null;
    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            throw new ApiError(res.status, "Unexpected response from the server");
        }
    }

    if (!res.ok) {
        throw new ApiError(res.status, (data && data.error) || "Something went wrong");
    }
    return data;
}

export { ApiError };

export const api = {
    me: () => request("/me"),
    signup: (payload) => request("/signup", { method: "POST", body: payload }),
    login: (payload) => request("/login", { method: "POST", body: payload }),
    logout: () => request("/logout", { method: "POST" }),

    getListings: () => request("/listings"),
    getListing: (id) => request(`/listings/${id}`),
    createListing: (formData) =>
        request("/listings", { method: "POST", body: formData, isFormData: true }),
    updateListing: (id, formData) =>
        request(`/listings/${id}`, { method: "PUT", body: formData, isFormData: true }),
    deleteListing: (id) => request(`/listings/${id}`, { method: "DELETE" }),

    createReview: (listingId, review) =>
        request(`/listings/${listingId}/reviews`, { method: "POST", body: { review } }),
    deleteReview: (listingId, reviewId) =>
        request(`/listings/${listingId}/reviews/${reviewId}`, { method: "DELETE" }),
};
