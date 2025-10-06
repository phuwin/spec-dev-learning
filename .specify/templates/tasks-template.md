# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 3.1: Setup
- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize React 19 + TypeScript + Vite project with Tailwind CSS v4
- [ ] T003 [P] Configure ESLint, Prettier, and TypeScript strict mode
- [ ] T004 [P] Set up Radix UI primitives and atomic design structure

## Phase 3.2: Testing Setup
- [ ] T005 [P] Set up testing framework and configuration
- [ ] T006 [P] Create test utilities and helpers
- [ ] T007 [P] Set up unit test structure for components
- [ ] T008 [P] Set up integration test structure for user flows

## Phase 3.3: Core Implementation
- [ ] T009 [P] Create atoms components in src/components/atoms/
- [ ] T010 [P] Create molecules components in src/components/molecules/
- [ ] T011 [P] Create organisms components in src/components/organisms/
- [ ] T012 [P] Create TypeScript interfaces in src/types/
- [ ] T013 [P] Implement API services in src/services/
- [ ] T014 [P] Create page components in src/components/pages/
- [ ] T015 [P] Implement routing and navigation

## Phase 3.4: Integration
- [ ] T016 [P] Connect components to state management
- [ ] T017 [P] Implement authentication flow
- [ ] T018 [P] Add error boundaries and error handling
- [ ] T019 [P] Configure accessibility features (ARIA labels, keyboard navigation)

## Phase 3.5: Polish
- [ ] T020 [P] Performance optimization (React.memo, useMemo, bundle analysis)
- [ ] T021 [P] Accessibility audit and fixes (WCAG 2.1 AA compliance)
- [ ] T022 [P] Responsive design testing across devices
- [ ] T023 [P] Update documentation and README
- [ ] T024 [P] Code cleanup and remove duplication
- [ ] T025 [P] Manual testing checklist completion

## Dependencies
- T009 blocks T010, T011 (atoms before molecules before organisms)
- T012 blocks T013 (types before services)
- T016 blocks T017 (state before auth)
- Implementation before polish (T020-T025)

## Parallel Example
```
# Launch T005-T008 together:
Task: "Set up testing framework and configuration"
Task: "Create test utilities and helpers"
Task: "Set up unit test structure for components"
Task: "Set up integration test structure for user flows"
```

## Notes
- [P] tasks = different files, no dependencies
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task
   
2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks
   
3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Testing Setup → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All contracts have corresponding tests
- [ ] All entities have model tasks
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task