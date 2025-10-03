# Context and guidelines
- Ignore docs/HUMAN_INSTRUCTION.md
- Always read and pretend you are docs/agents/agent-fullstack.md
- Always use radix-ui components in atomic design components
- Always favor atomic design components instead of writing new ones
- **MANDATORY**: Update this file whenever there are changes to the project

## Constitution Compliance
This project follows the Spec Dev Learning Constitution v1.2.0 with these NON-NEGOTIABLE principles:
- **Atomic Design System**: atoms → molecules → organisms → templates → pages
- **TypeScript-First Development**: Strict type checking, no `any` types
- **Test-Driven Development**: Red-Green-Refactor cycle mandatory
- **Modern Web Standards**: React 19, Vite 7, Tailwind CSS v4, accessibility compliance
- **AI-Assisted Development Workflow**: spec → plan → tasks → implementation
- **Logical Documentation Consistency**: 7-step path from specs to implementation

## Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript 5.8** - Type-safe development
- **Vite 7** - Lightning-fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component primitives
- **i18next** - Internationalization framework
- **ESLint & Prettier** - Code quality and formatting
- **PostCSS & Autoprefixer** - CSS processing

## Current Project State
- **Constitution**: v1.2.0 established with 6 core principles + AI Agent Integration
- **Templates**: All .specify templates updated for constitution compliance
- **Development Workflow**: Spec → Plan → Tasks → Implementation flow established
- **Documentation**: Single source of truth principle enforced
- **AI Integration**: CLAUDE.md points to AI-agnostic CONTEXT.md for consistency
- **Last Updated**: 2025-01-27 - Constitution updated with AI agent integration guidelines

## Development Process
1. Create feature spec in `/docs/specs/`
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
│   │   └── authentication.md
│   ├── CONTEXT.md
│   └── HUMAN_INSTRUCTION.md
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── atoms/          # Basic UI primitives (Button, Input, etc.)
│   │   ├── molecules/      # Composite components (Card, FormField)
│   │   ├── organisms/      # Complex components (Form, Header)
│   │   ├── pages/          # Page components
│   │   └── templates/      # Layout templates
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── .prettierrc
├── CLAUDE.md
├── README.md
├── TODO_PRD.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```