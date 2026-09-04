# Dashboard Implementation Plan

This plan adapts the team task list for a single developer implementation. It follows the requirements in the docs folder, uses the shared types from the shared package, and keeps each milestone small enough to verify and commit separately.

## Phase 1 — Foundation and authentication

Goal: establish the dashboard shell, auth flow, and protected routing.

### Scope
- Implement the API client with base URL support, JWT header injection, and normalized error handling.
- Implement authentication service and auth context with token persistence in local storage.
- Add a reusable sidebar and dashboard/auth layouts.
- Protect dashboard routes and redirect unauthenticated users to the login page.
- Wire the login page to the auth context.

### Deliverables
- Protected routing for dashboard pages
- Working login form with error display
- Shared shell for authenticated pages

### Commit
- `feat(dashboard): implement auth shell and protected routes`

## Phase 2 — Overview dashboard

Goal: replace the placeholder dashboard screen with live summary widgets.

### Scope
- Implement the data-fetching hook for backend-backed data requests.
- Build the overview page with:
  - registered users
  - registered cards
  - registered devices
  - today’s access attempts
  - recent activity list
  - device status list
  - quick action links
- Use the shared types for users, cards, devices, and logs.

### Deliverables
- Functional dashboard overview using real data endpoints
- Clear loading and error states

### Commit
- `feat(dashboard): add overview widgets and dashboard data`

## Phase 3 — Users and cards management

Goal: implement user and card management pages plus the RFID enrollment wizard.

### Scope
- Build the users page to list users, add/edit/disable/delete flows, and role/status display.
- Build the cards page to list cards, disable/replace/delete flows, and UIDs displayed in hex form.
- Implement the enroll-card wizard:
  - select user
  - start enrollment
  - waiting state
  - success state
  - failure path for CARD_ALREADY_EXISTS

### Deliverables
- Working management screens for users and cards
- Enrollment flow aligned with the documented message contract

### Commit
- `feat(dashboard): implement user and card management flows`

## Phase 4 — Devices, logs, and settings

Goal: finish the remaining management pages.

### Scope
- Implement devices page with registration, status display, last seen, rename, and disable actions.
- Implement logs page with search and filters for date, door, user, and result.
- Add detailed log row information and offline badge handling.
- Implement settings page for password, heartbeat, unlock duration, emergency cards, and system info placeholders.

### Deliverables
- Functional devices and logs experience
- Settings page shell with the documented controls

### Commit
- `feat(dashboard): add devices logs and settings experience`

## Phase 5 — Polish and validation

Goal: harden the frontend and ensure the experience is consistent with the docs.

### Scope
- Add consistent styling and color language across pages.
- Improve empty states, loading states, and error feedback.
- Validate route behavior and navigation.
- Run the repo verification commands and fix any issues.

### Deliverables
- Unified UX and no obvious regressions

### Commit
- `chore(dashboard): polish dashboard UX and validation`

## Verification checklist

For every phase, verify with:
- editor diagnostics for the changed files
- the dashboard build command from the repo root when available
- manual review of the affected page flows

## Notes

- All UI state must use the shared types from the shared package.
- API behavior should follow the message contracts in the docs folder.
- If the backend contract differs from the current assumption, the implementation must be adjusted before moving forward.
