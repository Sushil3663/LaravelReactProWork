# LaravelReact
A full-stack monorepo with a **Laravel 12 REST API** backend and a **React 19 SPA** frontend. Features JWT authentication, profile management, mobile OTP verification, and a dashboard UI component showcase.
## Tech Stack
### Backend (`Laravel/`)
- **Laravel 12** + PHP 8.2
- **tymon/jwt-auth** for JWT authentication
- **Pest PHP** for testing
- Domain-driven structure (Auth, Profile modules)
- MySQL / SQLite
### Frontend (`React/`)
- **React 19** + TypeScript + Vite 6
- **Redux Toolkit** (auth state) + **TanStack React Query** (server state)
- **Ant Design 5** UI library + **styled-components**
- **React Router DOM 7** with protected routes
- **Axios** with JWT interceptor & auto-refresh
## Project Structure
```
LaravelReact/
├── Laravel/                # Laravel backend
│   ├── app/                # Standard Laravel app dir
│   ├── App/                # Custom domain code
│   │   ├── Domains/
│   │   │   ├── Auth/       # Login, register, logout, refresh, me
│   │   │   └── Profile/    # Profile CRUD, OTP, image upload
│   │   ├── Helpers/        # ApiHelper (3rd-party HTTP)
│   │   ├── Http/           # Controllers, Middleware, Responses
│   │   └── Services/       # BaseService (CRUD helpers)
│   ├── config/
│   ├── routes/
│   └── tests/
├── React/                  # React frontend
│   └── src/
│       ├── features/
│       │   ├── auth/       # Login, Register, Me, ChangePassword
│       │   └── profile/    # Profile, EditProfile, AvatarUpload
│       ├── component/      # Layout, Header, Sidebar, Footer
│       ├── hooks/          # Generic CRUD hooks
│       ├── shared/         # Axios instance, types
│       ├── pages/          # Dashboard, Media pages
│       └── app/            # Store, Router
└── README.md
```
## Features
### Implemented
- JWT-based authentication (register, login, logout, token refresh)
- User profile viewing & editing
- Avatar image upload
- Mobile number OTP verification
- Password change
- Dashboard with Ant Design component showcase
- Protected routing with auth guards
- Responsive sidebar layout
### Planned
- Complete profile domain backend implementation
- Card service module
- Media (video/image) management
## Prerequisites
- PHP 8.2+
- Composer
- Node.js 20+
- MySQL or SQLite
## Setup
### Backend
```bash
cd Laravel
cp .env.example .env        # configure database
composer install
php artisan key:generate
php artisan migrate
php artisan serve           # http://localhost:8000
```
### Frontend
```bash
cd React
npm install
npm run dev                 # http://localhost:5173
```
## Scripts (Backend)
| Command | Description |
|---------|-------------|
| `composer run setup` | Full project setup (install, migrate, build) |
| `composer run dev` | Run server + queue + Vite concurrently |
| `composer run test` | Run Pest tests |
## Scripts (Frontend)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |
## License
[MIT](LICENSE)
