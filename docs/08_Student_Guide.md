# Student Guide — Smart Door Access System

Welcome! This project is a real (if small) production-style system built by three
teams working in parallel. Everything you need to know about *what* to build is in
the `docs/` folder. This guide tells you *how to work* on it.

---

## 1. How the project is organized

| Folder     | What lives there                                              |
|------------|---------------------------------------------------------------|
| `docs/`    | All specifications: requirements, use cases, contracts, domain |
| `shared/`  | Shared TypeScript types, constants, and events (workspace pkg) |
| `backend/` | Node.js + Express + Prisma API (`@smartdoor/backend`)          |
| `dashboard/` | React + TypeScript dashboard (`@smartdoor/dashboard`)         |
| `firmware/` | ESP32 + RFID firmware (`DoorController/`)                     |

Three teams: **Firmware (3)**, **Dashboard (4)**, **Backend (4)**.

The teams communicate through **contracts**, not conversations:

- Message contracts: `docs/05_Message_Contracts.md`
- Event flows: `docs/04_Event_Protocols.md`
- Database model: `docs/06_Domain_Model.md`
- Shared code: `shared/` → imported by both backend and dashboard

If you change a contract or a shared type, tell your team lead and the other teams —
they depend on it.

---

## 2. Your team and your task

Each student has a task card in `docs/tasks/` (`backend.md`, `firmware.md`,
`dashboard.md`). Read **your** card first, then the docs sections it references.

Do **not** invent requirements. If a spec is unclear or contradicts itself, ask —
do not guess.

---

## 3. Using AI tools (this is a requirement)

You are **expected** to use AI assistants (ChatGPT, Claude, GitHub Copilot, Cursor,
etc.) to help write your code. That is one of the things this project is teaching:
using AI productively in real development. But:

> AI writes the code. **You** own whether it works and whether it is right.

### Rules

1. **It must work.** AI output that does not compile, run, and satisfy the
   acceptance criteria of your task is not a deliverable.
2. **You must be able to explain it.** In every review you will be asked *"why does
   this work / why did you choose this?"*. Copy-paste without understanding is a fail.
3. **Never paste secrets** (passwords, tokens, `.env` contents, JWT secrets) into an
   AI tool.
4. **Respect the contracts.** If the AI proposes a field or enum that is not in
   `docs/05` or `shared/`, stop and ask. The contract wins.
5. **Don't let the AI add dependencies** (npm packages, Arduino libraries) without
   checking with your team lead first.
6. **Small, focused prompts.** Ask the AI to modify one file or solve one problem,
   not "build my whole feature".
7. **Verify AI output.** Run the build/check commands listed on your task card. If it
   fails, don't paste the error back and ship — fix it or ask for help.

### How to write a good prompt

A good prompt gives the AI **context, constraints, and a verification step**:

- Point it at the exact file and the exact doc section.
- Tell it what NOT to change.
- Tell it what must be true when it's done (compile, test command).
- Ask it to explain, not just output code.

### Sample prompt

> You are implementing the login handler in the `backend` of our smart door
> project (Node.js + Express + TypeScript + Prisma).
>
> 1. Open `backend/src/modules/auth/auth.controller.ts`, `auth.schema.ts`,
>    `auth.service.ts`, and `docs/05_Message_Contracts.md` first.
> 2. Implement `login`: validate the request body against `auth.schema.ts` (zod),
>    look up the Administrator by username, compare the password with bcrypt, and
>    return a JWT in exactly the shape of **Message Contract 7**
>    (`{ access_token, expires_in }`).
> 3. On invalid credentials, return `401` with our standard error format
>    `{ error: { code, message } }`.
> 4. Only change files inside `backend/src/modules/auth/`. Do not touch other
>    modules, the Prisma schema, or `shared/`.
> 5. Match the existing docstring style. When done, prove it works: run
>    `npm run check` from the repo root and show me the result.
> 6. Summarize the flow in 3 bullets.

Note how the prompt gives a **file**, a **contract**, **scope limits**, a
**verification command**, and asks for an **explanation**.

---

## 4. Git with GitHub Desktop (Windows)

You will get your own **feature branch** and open a **pull request (PR)** when your
work is ready. Your mentor merges PRs.

### One time — clone the repo

```bash
git clone https://github.com/YOUR_ORG/smart-door-project.git
cd smart-door-project
```

Or in **GitHub Desktop**: `File ▸ Clone repository ▸ paste the URL ▸ Clone`.

### Before every work session — get the latest

```bash
git checkout main
git pull
```

### Create your feature branch (once per task)

```bash
git checkout -b feature/<team>/<feature>
# e.g. feature/backend/auth-login
#      feature/firmware/offline-cache
#      feature/dashboard/logs-page
```

In GitHub Desktop: `Branch ▸ New Branch`, type the name, click **Create branch**.

### Save your work and push

```bash
git add -A
git commit -m "feat(auth): implement login endpoint"
git push -u origin feature/backend/auth-login
```

> **Commit message convention** (Conventional Commits): start with
> `feat:`, `fix:`, `docs:`, `refactor:`, or `chore:` followed by a short
> description. Write meaningful messages, not "stuff".

In GitHub Desktop: type your commit message, click **Commit to …**, then click
**Push origin**.

### Open a Pull Request

After pushing, GitHub Desktop shows a **Create Pull Request** button (top right).
Click it, write a short description, and open the PR. Your task card lists the
acceptance criteria — paste them into the PR description.

### When a teammate changes shared code

```bash
git checkout main
git pull
git checkout <your-branch>
git merge main
```

If files conflict, GitHub Desktop will show you. Ask for help if you're unsure —
don't force-push or delete other people's branches.

---

## 5. Definition of Done (applies to every task)

Before you push and open a PR, every item below must be true:

- [ ] The code compiles / runs with **zero errors** (run the check command on your card).
- [ ] Every acceptance criterion on your task card is met.
- [ ] The code follows the contracts in `docs/05` and the types in `shared/` —
      no invented strings, no hardcoded enums.
- [ ] You tested your work end-to-end against a teammate's dependency, or the
      dependency is documented as blocked (e.g. "waiting on the access route").
- [ ] You can explain how it works.
- [ ] No secrets, `.env` files, or `node_modules` are committed.
- [ ] Branch pushed, PR opened, demo ready.

---

## 6. Where to get help

1. Re-read your task card and the docs section it names.
2. Check `docs/09_Setup.md` for environment problems.
3. Ask your team lead (mentor).
4. For cross-team questions, check `docs/10_Team_Coordinates.md` first — the answer
   is probably a contract, not a conversation.
