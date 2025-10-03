<!--
Sync Impact Report:
Version change: 0.0.0 → 1.0.0
Modified principles: N/A (initial creation)
Added sections: Atomic Design System, AI-Assisted Development, Modern Web Standards
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

## Development Workflow

### Feature Development Process
1. Create feature spec in `/docs/specs/`
2. Generate implementation plan using `/plan` command
3. Create tasks using `/tasks` command
4. Implement following TDD principles
5. Update agent context files as needed
6. Document changes in CONTEXT.md

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

**Version**: 1.0.0 | **Ratified**: 2025-01-27 | **Last Amended**: 2025-01-27