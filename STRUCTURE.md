# AllAboutPet Project Structure

## 📁 Root Level

```
AllAboutPet/
├── package.json             # Workspace management
├── .eslintrc.js             # Shared ESLint configuration
├── .env.example             # Environment template
├── README.md                # Main documentation
├── STRUCTURE.md             # Here we are
├── backend/                 # Node.js + Express API
├── frontend/                # React application
├── tests/                   # Postman and other tests
└── docs/                    # Documentation
```

## 🚀 Backend Structure

```
backend/
├── app.js                   # Entry point
├── package.json             # Backend dependencies
├── jest.config.js           # Jest configuration
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js
│   ├── documentController.js
│   ├── eventController.js
│   ├── petController.js
│   └── __tests__/           # Co-located tests
│       └── authController.test.js
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── uploadDocument.js
├── models/
│   ├── Document.js
│   ├── Event.js
│   ├── index.js
│   ├── Pet.js
│   ├── User.js
│   └── UserPet.js
├── routes/
│   ├── authRoutes.js
│   ├── documentRoutes.js
│   ├── eventRoutes.js
│   └── petRoutes.js
├── uploads/                 # File uploads
└── tests/
    └── setup.js             # Test setup
```

## ⚛️ Frontend Structure

```
frontend/
├── package.json             # Frontend dependencies
├── vite.config.js           # Vite configuration
├── vitest.config.js         # Vitest configuration
├── index.html               # Entry HTML
├── public/                  # Static assets
└── src/
    ├── main.jsx             # Entry point
    ├── App.jsx              # Root component
    ├── index.css            # Global styles
    ├── tailwind.config.js   # Tailwind config
    ├── postcss.config.js    # PostCSS config
    ├── api/                 # API layer (consolidated)
    │   └── index.js         # All API calls
    ├── shared/              # Shared utilities
    │   ├── auth/            # Auth utilities
    │   │   └── index.js
    │   └── utils/           # General utilities
    │       └── index.js
    ├── features/            # Feature-based organization
    │   ├── auth/
    │   │   ├── components/
    │   │   │   └── LoginForm.jsx
    │   │   ├── pages/
    │   │   └── __tests__/
    │   │       └── LoginForm.test.jsx
    │   ├── pets/
    │   │   ├── components/
    │   │   │   └── PetCard.jsx
    │   │   ├── pages/
    │   │   └── __tests__/
    │   ├── events/
    │   └── documents/
    ├── components/          # Shared UI components
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   └── ui/              # Reusable UI components
    │       ├── button.jsx
    │       └── card.jsx
    ├── pages/               # Page components
    │   ├── Home.jsx
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── Dashboard.jsx
    │   ├── Pets.jsx
    │   ├── Profile.jsx
    │   ├── AdminPanel.jsx
    │   ├── Blog.jsx
    │   ├── Calendar.jsx
    │   └── NotFound.jsx
    ├── layouts/             # Layout components
    │   └── MainLayout.jsx
    ├── routes/              # Routing configuration
    │   ├── index.jsx
    │   ├── ProtectedRoute.jsx
    │   └── AdminRoute.jsx
    ├── context/             # React Context
    │   └── AuthContext.jsx
    ├── hooks/               # Custom hooks
    │   └── useAuth.js
    ├── assets/              # Static assets
    │   └── react.svg
    ├── styles/              # Additional styles
    │   └── fonts.css
    └── tests/               # Test setup
        └── setup.js
```

## 🧪 Testing Structure

### Backend Tests
- **Co-located**:  Tests are placed next to the files they test
- **Integration**: Uses Supertest for API testing
- **Coverage**:    Jest with coverage reporting

### Frontend Tests
- **Component**:   Vitest + React Testing Library
- **Unit**:        Isolated component testing
- **Integration**: API mocking and user interactions

### Postman Tests
```
tests/postman/
├── collections/
│   └── All About Pet API.postman_collection.json
├── scripts/                 # Newman scripts for CI/CD
└── README.md               # Postman test documentation
```

## 🔧 Key Improvements Made

### 1. **Root Level Configuration**
- ✅ Added `package.json` for workspace management
- ✅ Added `.eslintrc.js` for shared linting rules
- ✅ Added concurrent development scripts

### 2. **Testing Infrastructure**
- ✅ Added Jest configuration for backend
- ✅ Added Vitest configuration for frontend
- ✅ Added test setup files
- ✅ Added co-located test examples
- ✅ Added Postman test organization

### 3. **Frontend Organization**
- ✅ **Consolidated API layer**: Merged `api/` and `services/` into single `api/index.js`
- ✅ **Feature-based structure**: Organized by features (`auth/`, `pets/`, `events/`, `documents/`)
- ✅ **Shared utilities**: Consolidated `utils/` and `lib/` into `shared/`
- ✅ **Clear separation**: Components, pages, and utilities are properly separated

### 4. **Mixed Concerns Fixed**
- ✅ **Auth**: Moved auth utilities to `shared/auth/`
- ✅ **Pets**: Created feature-based structure with components and pages
- ✅ **Events**: Organized under features with proper separation
- ✅ **Documents**: Feature-based organization
- ✅ **Utilities**: Consolidated into `shared/utils/`

## 🚀 Development Commands

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev

# Run all tests
npm test

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📋 Next Steps

1. **Install Dependencies**: Run `npm run install:all`
2. **Set up Environment**: Copy `.env.example` to `.env` and configure
3. **Run Tests**: Verify everything works with `npm test`
4. **Start Development**: Use `npm run dev` for concurrent development

This structure provides a clean, maintainable, and scalable foundation for the AllAboutPet application! 