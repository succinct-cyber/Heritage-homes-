# Heritage Estates

Full-stack real estate site for a single Nigerian real-estate firm (not a multi-agent
marketplace). Django REST Framework backend + React (Vite) + Tailwind CSS frontend.

```
heritage_house/
├── backend/     Django + DRF API
└── frontend/    React (Vite) + Tailwind CSS
```

## Design decisions baked into this build

- **Unified navbar** across every page: `Home · Properties · Rent & Hire · Categories · Team`
  + a single `Sign In` CTA. This replaces the two conflicting navbars found in the Figma
  export (a marketing-site nav vs. a portal-style nav with "List Property").
- **Unified 3-column footer** everywhere: brand column, Quick Links + Support column,
  Newsletter column. Replaces four different footer layouts found across the Figma pages.
- **No individual agent profile pages.** Since this is one firm (not a marketplace of
  competing agents), `Meet The Team` is a single shared grid with a "Contact" modal per
  member — no dedicated `/team/:slug` route.
- **Colors/fonts sampled directly from the Figma exports**: cream `#F9FAF4` background,
  deep green `#3F5D3B`, charcoal `#1A1A1A`, Playfair Display (headlines) + Inter (body).
- Mobile view mirrors the desktop layout section-for-section (stacked grids, hamburger nav,
  full-width filter drawer) rather than a stripped-down alternate design.

## Backend setup

```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_demo_data
python manage.py runserver
```

API runs at `http://localhost:8000/api/`. Admin at `http://localhost:8000/admin/`.

The seed command creates properties **without images** (no network access was available
while generating this scaffold). Add images per property via `/admin/` → Properties →
[property] → Images inline, or via the `PropertyImage` model. Cards fall back to a
placeholder image until then.

### Key endpoints
| Endpoint | Purpose |
|---|---|
| `GET /api/properties/` | Catalog grid — filterable & paginated |
| `GET /api/properties/?purchase_type=rent&category=villas&price_min=X&price_max=Y&location=Ikoyi` | Combinable filters |
| `GET /api/properties/featured/` | Homepage featured grid |
| `GET /api/properties/{slug}/` | Property detail |
| `GET /api/properties/{slug}/similar/` | Similar properties |
| `GET /api/properties/categories/` | Category list |
| `GET /api/team/` | Team grid |
| `POST /api/inquiries/` | Property/team contact form submission |
| `POST /api/newsletter/` | Footer newsletter signup |
| `POST /api/auth/register/`, `/api/auth/login/`, `/api/auth/refresh/`, `GET /api/auth/me/` | JWT auth |

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Runs at `http://localhost:5173`. Make sure the backend is running first so the pages have
data to render.

## What's implemented

- **Home** — hero, trust strip, stats, "What You Are Looking For", featured property grid, CTA banner
- **Categories** — featured category spotlight + "Specific Needs" grid
- **Properties (Catalog)** — combinable filter bar (purchase type, category, price range, location), removable filter chips, sort, paginated grid
- **Property Detail** — gallery, specs strip, overview, amenities, location block, inquiry form, similar properties
- **Rent & Hire** — rentals/lease toggle, location search, listing grid
- **Meet The Team** — shared grid + contact modal (no per-agent pages)
- **Sign In** — login/register tabs, JWT-backed

All pages share the same responsive Navbar/Footer and collapse to a mobile-first layout
below the `lg` breakpoint (hamburger nav, stacked grids, full-width controls).
