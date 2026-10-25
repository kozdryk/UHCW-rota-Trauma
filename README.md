# UHCW T&O On-Call Rota

Single-page app (`index.html`) for the trauma & orthopaedic on-call rota at UHCW. Hosted on GitHub Pages; shared data lives in Firebase Firestore (project `uhcw-trauma-rota`, London region). No user accounts beyond an email + shared password inside the app.

## How the rota works

- Each **team** has a 4-week cycle anchored on one date (Team 3: 4 Nov 2026 = week 4). Weeks run Monday–Sunday.
- **Weekday on call**: one weekday per week (Team 3: Wednesday). The consultant holding that week number is on call; it repeats every 4 weeks.
- **Team weekend**: Friday–Sunday of one week in the cycle (Team 3: week 3). Two consultants: *long* (Fri on call + trauma, Sat ward round, Sun on call + trauma, Mon post-take + VFC) and *short* (Sat on call + trauma, Sun ward round). The pairs come from a repeating list in the team settings.
- **Fracture clinic** days (Team 3: Wednesday): every clinic-attending consultant is assumed present unless on call, away, or marked out. Minimum 1 consultant; the day goes red if cover is zero.
- **Red days** = the team's on-call days. Leave and swaps are only entered from those days.

## Sign-in

- Email is the username. `firstname.surname@uhcw.nhs.uk` → the surname picks the consultant, so names can't be mis-claimed.
- Password **ROTA** → team member (consultant if the surname matches, otherwise secretary for the chosen team).
- Password **ROTAUHCW** → administrator (can be a consultant or admin-only; any email).
- Passwords are changed in Settings (admin). They stop accidental edits; they are not a security boundary.

## Permissions

| Action | Consultant | Secretary | Admin |
|---|---|---|---|
| Mark own clinic attendance | own name | – | anyone |
| Record leave | own | anyone in their team | anyone |
| Ask/offer cover (swap request) | duties involving self | – | – |
| Approve/decline a request | addressed to self | – | any |
| Set a duty directly | – | – | yes |
| Change regular on-call week | request → admin approves | – | directly in Settings |
| Add teams/consultants, passwords | – | – | yes |

## Data (Firestore)

| Collection | Doc id | Purpose |
|---|---|---|
| `settings/main` | – | app title, passwords, email domain |
| `teams/{teamId}` | `team3` … | name, cycle anchor, on-call weekday, weekend week, consultants (`slot` 1–4 = week), weekend pairs |
| `overrides/{team~date}` | | one-off weekday on-call change |
| `weekends/{team~friday}` | | one-off weekend pair change |
| `clinic/{team~date}` | | manual clinic presence, registrar, note |
| `leave/{id}` | | who / from / to / type |
| `requests/{id}` | | swap and week-change requests with status |
| `accounts/{email}` | | consultant id, team, role |
| `log/recent` | | last 150 changes |

Security rules are in `firestore.rules` (paste into Firebase console → Firestore → Rules).
