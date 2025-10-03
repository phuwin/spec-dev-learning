<!--
Sync Impact Report:
Version change: 0.0.0 → 1.3.0
Modified principles: N/A (initial creation)
Added sections: Atomic Design System, AI-Assisted Development, Modern Web Standards, Logical Documentation Consistency, AI Agent Integration, MVP Simplicity
Removed sections: N/A
Templates requiring updates: ✅ plan-template.md, ✅ spec-template.md, ✅ tasks-template.md
Follow-up TODOs: None
-->

# Spec Dev Learning Constitution

## Core Principles

### I. Atomic Design System (NON-NEGOTIABLE)
Every UI component MUST follow atomic design principles: atoms → molecules → organisms → templates → pages. Components MUST be reusable, composable, and follow the established hierarchy. No custom components without atomic design justification. All components MUST use Radix UI primitives as foundation.

### II. TypeScript-First Development
All code MUST be written in TypeScript with strict type checking enabled. No `any` types allowed without explicit justification. Interfaces MUST be defined for all data structures. Type safety is non-negotiable for maintainability and developer experience.

### III. Test-Driven Development (NON-NEGOTIABLE)
TDD mandatory: Tests written → User approved → Tests fail → Then implement. Red-Green-Refactor cycle strictly enforced. Every component MUST have unit tests. Integration tests required for user flows. Contract tests for API boundaries.

### IV. Modern Web Standards
MUST use React 19, Vite 7, Tailwind CSS v4, and latest TypeScript. Performance targets: <200ms API response, <3s initial page load. Accessibility compliance (WCAG 2.1 AA) is mandatory. Responsive design for all screen sizes.

### V. AI-Assisted Development Workflow
Specs MUST be written before implementation. Use provided agent personas (Archimedes fullstack) for system design. Follow the .specify template system for consistency. All features MUST go through spec → plan → tasks → implementation flow.

### VI. Logical Documentation Consistency (NON-NEGOTIABLE)
LOGIC DICTATES this path must be followed for all features:
1. `docs/specs/` - Describe the function needed
2. `src/types/` - TypeScript types for data items needed for that functionality  
3. `docs/specs/openapi/` - Endpoints needed using the types
4. `src/server/` - Database implementation matching the types
5. `src/server/` - Server implementation matching the OpenAPI spec
6. `src/client/` - Use types and API to communicate with backend
7. `src/client/` - Implement user flows from Gherkin scenarios

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

### MVP Constraints
- **Authentication**: Use built-in JWT tokens instead of external OAuth providers initially
- **Email**: Use simple SMTP or skip email features for MVP
- **Real-time**: Use WebSocket connections instead of third-party services
- **Storage**: Use local database instead of cloud storage
- **Notifications**: Use in-app notifications only, no external push services
- **File Upload**: Use local file storage, no cloud storage providers
- **Analytics**: Use simple logging instead of external analytics services

## Development Workflow

### Feature Development Process
1. Create feature spec in `/docs/specs/`
2. Generate implementation plan using `/plan` command
3. Create tasks using `/tasks` command
4. Implement following TDD principles
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

**Version**: 1.3.0 | **Ratified**: 2025-01-27 | **Last Amended**: 2025-01-27