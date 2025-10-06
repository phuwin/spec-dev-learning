<!--
Sync Impact Report:
Version change: 1.4.0 → 1.5.0
Modified principles: Test-Driven Development (removed TDD requirement)
Added sections: None
Removed sections: Test-Driven Development principle
Templates requiring updates: ✅ plan-template.md, ✅ spec-template.md, ✅ tasks-template.md
Follow-up TODOs: None
-->

# Spec Dev Learning Constitution

## Core Principles

### I. Atomic Design System (NON-NEGOTIABLE)
Every UI component MUST follow atomic design principles: atoms → molecules → organisms → templates → pages. Components MUST be reusable, composable, and follow the established hierarchy. No custom components without atomic design justification. All components MUST use Radix UI primitives as foundation.

### II. TypeScript-First Development
All code MUST be written in TypeScript with strict type checking enabled. No `any` types allowed without explicit justification. Interfaces MUST be defined for all data structures. Type safety is non-negotiable for maintainability and developer experience.


### III. Modern Web Standards
MUST use React 19, Vite 7, Tailwind CSS v4, and latest TypeScript. Performance targets: <200ms API response, <3s initial page load. Accessibility compliance (WCAG 2.1 AA) is mandatory. Responsive design for all screen sizes.

### IV. AI-Assisted Development Workflow
Specs MUST be written before implementation. Use provided agent personas (Archimedes fullstack) for system design. Follow the .specify template system for consistency. All features MUST go through spec → plan → tasks → implementation flow.

### V. Frontend-Only Architecture (NON-NEGOTIABLE)
This project is a frontend-only application with no backend requirements. All data persistence MUST use client-side storage (localStorage, IndexedDB, or similar). No server-side components, databases, or external APIs are permitted unless explicitly justified for MVP requirements.

### VI. Logical Documentation Consistency (NON-NEGOTIABLE)
LOGIC DICTATES this path must be followed for all features:
1. `specs/[feature-name]/` - Describe the function needed
2. `src/types/` - TypeScript types for data items needed for that functionality  
3. `specs/[feature-name]/contracts/` - Service contracts using the types
4. `src/services/` - Local storage service implementation matching the types
5. `src/services/` - Service implementation matching the contracts
6. `src/components/` - Use types and services for data management
7. `src/components/` - Implement user flows from Gherkin scenarios

Only ONE document can be the source of truth for any given information. Duplicate content MUST be eliminated through proper organization.

### VII. MVP Simplicity (NON-NEGOTIABLE)
MVP implementations MUST minimize third-party service dependencies to reduce complexity and external failure points. Prefer built-in solutions over external services. When external services are unavoidable, they MUST be abstracted behind interfaces to enable easy replacement or removal. No external service should be a single point of failure for core functionality.

## Development Standards

### Code Quality
- ESLint and Prettier MUST be configured and enforced
- No console.log in production code
- Meaningful commit messages following conventional commits
- Code reviews required for all changes
- Maximum function complexity: 10 cyclomatic complexity

### Performance Requirements
- Bundle size <500KB gzipped
- Lighthouse score >90 for all metrics
- No memory leaks in React components
- Optimize images and assets
- Use React.memo and useMemo appropriately

### Security Standards
- Input validation on all user inputs
- XSS protection via proper escaping
- CSRF protection for state-changing operations
- Secure authentication implementation
- No sensitive data in client-side code

### MVP Constraints (Frontend-Only)
- **Authentication**: Use localStorage-based authentication, no external OAuth providers
- **Email**: Skip email features for MVP (frontend-only)
- **Real-time**: Use client-side state management, no WebSocket connections
- **Storage**: Use localStorage or IndexedDB, no external databases
- **Notifications**: Use in-app notifications only, no external push services
- **File Upload**: Use client-side file handling, no cloud storage providers
- **Analytics**: Use simple console logging, no external analytics services
- **APIs**: No external API calls unless absolutely necessary for core functionality

## Development Workflow

### Feature Development Process
1. Create feature spec in `specs/[feature-name]/`
2. Generate implementation plan using `/plan` command
3. Create tasks using `/tasks` command
4. Implement following development standards
5. Update agent context files as needed
6. **MANDATORY**: Update `docs/CONTEXT.md` with all changes

### Documentation Maintenance
- `docs/CONTEXT.md` MUST be updated whenever:
  - New features are added or modified
  - Architecture decisions are made
  - Dependencies change
  - Development processes evolve
  - Agent personas are updated
- CONTEXT.md serves as the single source of truth for project state
- All team members must reference CONTEXT.md for current project understanding

### Code Review Process
- All PRs require approval from project maintainer
- Constitution compliance check mandatory
- Performance impact assessment required
- Accessibility review for UI changes
- Security review for authentication/authorization

### Quality Gates
- All tests MUST pass before merge
- No linting errors allowed
- TypeScript compilation must succeed
- Build must complete successfully
- Manual testing checklist completed

## Governance

This constitution supersedes all other development practices. Amendments require:
1. Documentation of the change rationale
2. Impact assessment on existing codebase
3. Approval from project maintainer
4. Update to dependent templates and documentation
5. Migration plan for breaking changes

All development work MUST verify compliance with these principles. Complexity beyond these standards MUST be justified with clear business value. Use `docs/CONTEXT.md` for runtime development guidance and `docs/agents/` for specific development approaches.

## AI Agent Integration
- `CLAUDE.md` file exists but points to the AI-agnostic `docs/CONTEXT.md` file
- All AI agents MUST reference `docs/CONTEXT.md` as the single source of truth for project context
- Agent-specific files in `docs/agents/` provide persona guidance but `CONTEXT.md` contains the authoritative project state
- This ensures consistency across all AI tools and human developers

**Version**: 1.5.0 | **Ratified**: 2025-01-27 | **Last Amended**: 2025-01-27