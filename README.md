# ÉcoPartage – Frontend (React + TypeScript)

Modern, responsive web app for ÉcoPartage. Built with React + TypeScript, Tailwind CSS, and shadcn/ui. Includes listing management, AI-assisted posting UX, reservation flow, real-time chat, and a clean, mobile-first interface.

## ✨ Key Screens & UX

- **Home / Explore** — search and filter listings by type/category/status.  
- **Auth** — signup/signin, JWT handling, profile page.  
- **Create Listing** — image upload, AI helpers (price estimate, title & description suggestions, quantity/unit).  
- **Post Detail** — rich listing page with status and contact/CTA.  
- **Chat** — real-time messaging per post (`socket.io-client`).  
- **Cart / Checkout** — multi-item reservation flow.  
- **About** — mission & story.

## 🧰 Tech Stack

- **React 19** + **TypeScript**  
- **Tailwind CSS** (utility-first) + **shadcn/ui** components  
- **State**: modern hooks & Context patterns  
- **Real-time**: `socket.io-client`  
- **Build**: Vite (or your preferred bundler) — update scripts below to match your setup

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18  
- npm or pnpm

### Environment

Create `.env` (or `.env.local`) in project root:

```env
# Backend API base
VITE_API_URL=http://localhost:4000

# Socket.io endpoint
VITE_SOCKET_URL=http://localhost:4000

# (Optional) Direct Cloudinary usage in UI
VITE_CLOUDINARY_CLOUD_NAME=your_cloud
```

### Install & Run

1. Install dependencies  
2. Start dev server  
3. Build for production  
4. Preview production build (if applicable)

Example script names (adapt to your package.json):
- dev — local dev server  
- build — production build  
- preview — preview production build  
- lint / format — code quality tasks

## 📁 Suggested Structure
```
src/
  components/
  pages/
    Home/
    Auth/
    CreatePost/
    PostDetail/
    Profile/
    Cart/
    About/
  hooks/
  context/
  lib/ (api clients, socket setup)
  styles/
```

## 🔌 Integrations

- API Client: typed fetchers / axios with auth interceptor (JWT from storage)  
- AI Helpers: UI calls backend AI endpoints to estimate price & suggest content while creating a post  
- Socket.io: connect on auth, join listing room, stream/send messages with optimistic UI

## 💅 UI/UX Conventions

- Responsive layout with Tailwind  
- Accessible primitives via shadcn/ui  
- Status badges for listing states (AVAILABLE, RESERVED, COMPLETED)  
- Clear empty states, loaders, and error toasts

## 🧪 Testing (optional)
Add React Testing Library / Vitest and include component & page specs.

## 🖼️ Screenshots
![EcoPartage1](https://github.com/user-attachments/assets/005face7-0466-49cd-8598-6b620d59d781)
![EcoPartage2](https://github.com/user-attachments/assets/5187c61c-cbb7-4c92-922c-f7d6a6172232)
<img width="1350" height="1724" alt="EcoPartage3" src="https://github.com/user-attachments/assets/a8d48706-6657-48a5-ab9b-b54b94993133" />
<img width="1350" height="2021" alt="EcoPartage4" src="https://github.com/user-attachments/assets/ca2832c8-3f67-464a-9d84-bae439a61cab" />
<img width="1350" height="1375" alt="EcoPartage5" src="https://github.com/user-attachments/assets/55317e79-53c5-4be4-acf9-3399fcffa4e5" />
<img width="1350" height="2419" alt="EcoPartage6" src="https://github.com/user-attachments/assets/8ba91aa9-ff00-4dc6-81d0-ce632d7a6e18" />


## 🗺️ Roadmap

- Saved searches & alerts  
- User settings (notifications, privacy)  
- Internationalization

## 📝 License
MIT.
