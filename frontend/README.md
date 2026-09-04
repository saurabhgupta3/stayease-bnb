# StayEase-bnb — React frontend

React 19 + Vite SPA that replaces the EJS views. It talks to the Express app
through the JSON API mounted at `/api`.

## Running it

Two processes, from two terminals:

```bash
# 1. backend (repo root) — serves /api on http://localhost:8081
npm start

# 2. frontend (this folder) — http://localhost:5173
npm run dev
```

Then open **http://localhost:5173**.

The Vite dev server proxies `/api` to `http://localhost:8081` (see
`vite.config.js`), so the browser sees a single origin and the `express-session`
cookie works without any CORS configuration on the backend. Point the proxy
somewhere else with `VITE_API_TARGET`:

```bash
VITE_API_TARGET=http://localhost:3000 npm run dev
```

The backend still needs its `.env` (`MONGO_URL`, `SESSION_SECRET`, `CLOUD_NAME`,
`CLOUD_API_KEY`, `CLOUD_API_SECRET`) — image uploads go to Cloudinary as before.

## Structure

```
src/
  api/client.js        fetch wrapper; sends the session cookie on every call
  context/             AuthContext + FlashContext (hooks) and their providers
  components/          Navbar, Footer, Flash, Layout, ListingForm, ListingMap,
                       ListingCard, Filters, star rating widgets, RequireAuth
  pages/               Listings, ShowListing, NewListing, EditListing,
                       Login, Signup, NotFound
  styles/              app.css (ported from public/css/style.css) + ratings.css
  utils/               geocode.js (Nominatim), format.js (INR + GST)
```

## Routes

| Route                | Page          | Auth        |
| -------------------- | ------------- | ----------- |
| `/` → `/listings`    | redirect      | —           |
| `/listings`          | Listings      | —           |
| `/listings/new`      | NewListing    | logged in   |
| `/listings/:id`      | ShowListing   | —           |
| `/listings/:id/edit` | EditListing   | owner only  |
| `/login`, `/signup`  | Login, Signup | —           |

## Production — one server

Express serves the React build, so there is no second process:

```bash
npm run build   # from the repo root: installs + builds frontend/dist
npm start       # http://localhost:8081 serves the app *and* the API
```

`index.js` mounts `frontend/dist` as static files and falls back to its
`index.html` for any GET that is not `/api/...`, so React Router handles deep
links like `/listings/:id` on a hard refresh. `/public` stays mounted too, so
image paths saved on older listings (`/images/default.jpg`) still resolve.

If `frontend/dist` is missing, the server logs a warning on boot and page
requests return a 500 telling you to run the build.
