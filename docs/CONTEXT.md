# Context and guidelines
- Ignore docs/HUMAN_INSTRUCTION.md
- Always read and pretend you are docs/agents/agent-fullstack.md
- Always use radix-ui components in atomic design components
- Always favor atomic design components instead of writing new ones
- **MANDATORY**: Update this file whenever there are changes to the project

## Constitution Compliance
This project follows the Spec Dev Learning Constitution v1.3.0 with these NON-NEGOTIABLE principles:
- **Atomic Design System**: atoms → molecules → organisms → templates → pages
- **TypeScript-First Development**: Strict type checking, no `any` types
- **Test-Driven Development**: Red-Green-Refactor cycle mandatory
- **Modern Web Standards**: React 19, Vite 7, Tailwind CSS v4, accessibility compliance
- **AI-Assisted Development Workflow**: spec → plan → tasks → implementation
- **Logical Documentation Consistency**: 7-step path from specs to implementation
- **MVP Simplicity**: Minimize third-party dependencies, prefer built-in solutions

## Tech Stack

- **React 19.1.1** - Latest React with concurrent features
- **TypeScript 5.8.3** - Type-safe development with strict checking
- **Vite 7.1.2** - Lightning-fast build tool and dev server
- **Tailwind CSS 4.1.13** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component primitives (17 components)
- **React Router DOM 7.9.3** - Client-side routing
- **React Hook Form** - Form state management and validation
- **Zod** - Schema validation (via validation service)
- **UUID 13.0.0** - Unique identifier generation
- **i18next 25.4.2** - Internationalization framework
- **Vitest 3.2.4** - Testing framework with React Testing Library
- **ESLint 9.33.0 & Prettier 3.6.2** - Code quality and formatting
- **PostCSS 8.5.6 & Autoprefixer 10.4.21** - CSS processing

## MVP Constraints
Following the MVP Simplicity principle, avoid these external services initially:
- **Authentication**: Use JWT tokens instead of OAuth providers
- **Email**: Use simple SMTP or skip email features
- **Real-time**: Use WebSocket connections instead of third-party services
- **Storage**: Use local database instead of cloud storage
- **Notifications**: In-app only, no external push services
- **File Upload**: Local file storage, no cloud providers
- **Analytics**: Simple logging instead of external analytics

## Current Project State
- **Constitution**: v1.3.0 established with 7 core principles including MVP Simplicity
- **Templates**: All .specify templates updated for constitution compliance
- **Development Workflow**: Spec → Plan → Tasks → Implementation flow established
- **Documentation**: Single source of truth principle enforced
- **AI Integration**: CLAUDE.md points to AI-agnostic CONTEXT.md for consistency
- **MVP Approach**: Minimize external dependencies, prefer built-in solutions
- **Authentication System**: ✅ COMPLETED - Full user registration and login system implemented
- **Component Library**: ✅ COMPLETED - Complete atomic design system with Radix UI primitives
- **Current Feature**: 002-build-a-workspace (workspace creation system) - In planning phase
- **Last Updated**: 2025-01-27 - Authentication system completed, workspace feature in development

## Feature Implementation Status

### ✅ COMPLETED FEATURES

#### 001-user-can-register (Authentication System)
- **Status**: Fully implemented and functional
- **Components**: Complete atomic design system with 17 atoms, 3 molecules, 6 organisms
- **Pages**: Login, Register, Dashboard, Design System showcase
- **Services**: AuthService, LocalStorageService, ValidationService
- **Features**: User registration, login, logout, session management, form validation
- **Testing**: Test setup configured with Vitest and React Testing Library
- **Architecture**: Context-based state management with AuthProvider

### 🚧 IN PROGRESS FEATURES

#### 002-build-a-workspace (Workspace Creation System)
- **Status**: Planning phase completed, ready for task generation
- **Spec**: Complete with 12 functional requirements
- **Plan**: Technical design and contracts ready
- **Next Steps**: Generate tasks using `/tasks` command, then implement

### 📋 PLANNED FEATURES
- Multi-user todo application (see TODO_PRD.md)
- Workspace management and collaboration features
- Task assignment and tracking system

## Development Process
1. Create feature spec in `/specs/[###-feature]/`
2. Generate implementation plan using `/plan` command  
3. Create tasks using `/tasks` command
4. Implement following TDD principles
5. Update agent context files as needed
6. **MANDATORY**: Update this CONTEXT.md file

## File listing

```
├── docs/
│   ├── agents/
│   │   ├── agent-fullstack.md
│   │   ├── agent-product-designer.md
│   │   ├── agent-visual-designer.md
│   │   └── cleanup-prompt.md
│   ├── specs/
│   │   └── _authentication.md
│   ├── CONTEXT.md
│   └── HUMAN_INSTRUCTION.md
├── specs/
│   ├── 001-user-can-register/     # ✅ COMPLETED - Authentication system
│   │   ├── contracts/
│   │   ├── data-model.md
│   │   ├── plan.md
│   │   ├── quickstart.md
│   │   ├── research.md
│   │   ├── spec.md
│   │   └── tasks.md
│   └── 002-build-a-workspace/     # 🚧 IN PROGRESS - Workspace creation
│       ├── plan.md
│       └── spec.md
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── atoms/          # ✅ 17 components (Button, Input, Card, etc.)
│   │   ├── molecules/      # ✅ 3 components (Card, FormField, LoadingSpinner)
│   │   ├── organisms/      # ✅ 6 components (AuthLayout, Forms, Header, UserMenu)
│   │   ├── pages/          # ✅ 4 pages (Login, Register, Dashboard, DesignSystem)
│   │   ├── templates/      # ✅ 1 template (PageTemplate)
│   │   ├── ErrorBoundary.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── PublicRoute.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── AuthProvider.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── localStorageService.ts
│   │   └── validationService.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   └── validation.ts
│   ├── utils/
│   │   ├── cn.ts
│   │   ├── constants.ts
│   │   ├── uuid.ts
│   │   └── validation.ts
│   ├── test/
│   │   └── setup.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── dist/                   # ✅ Built application
├── node_modules/
├── .gitignore
├── CLAUDE.md
├── README.md
├── TODO_PRD.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── specs_preview.md
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```