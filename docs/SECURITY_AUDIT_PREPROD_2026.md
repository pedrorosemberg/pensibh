# Security audit / preproduction gate — 2026-11-15

**Status: NO-GO. Production deployment not authorized.**

## Scope
Reviewed code via GitHub connector: `site-v2/src/lib/attribution.ts`, `tracking.ts`, `PlanExplorer.tsx`. Static source review only; remote CI, Playwright browser E2E, security scanners and deployed GTM configurations were NOT run. Local environment cannot clone github.com due to DNS restrictions.

## Findings
- HIGH — Attribution stored only in browser, and no protected backend maps WhatsApp attendance code to click ID. Offline enrollment import is NOT implemented. Do not advertise enrollment attribution as functional.
- HIGH — Dual tracking via direct gtag and GTM may duplicate events. Need tag audit in GTM Preview and GA4 DebugView.
- HIGH — Marketing click IDs must not be stored under analytics-only consent. Fixed on branch by passing marketing consent and redacting click IDs on withdrawal. Must still test.
- MEDIUM — `captureTouch` uses referrer URL parsing without try/catch; malformed referrer may throw, blocking initialization. Follow-up fix required.
- MEDIUM — 180-day rolling storage and marketing identifiers need legal/privacy review, data subject access/deletion procedures and server retention plan.
- MEDIUM — A WhatsApp click is not a verified message or enrollment. Event is now `click_whatsapp`; offline enrollment must be human-confirmed.
- MEDIUM — Click interception modifies `href` at capture phase. Test browser behavior, middle click, keyboard activation, new tab, and ad blockers.
- LOW — `PlanExplorer` course change via keyboard updates state without explicit `view_course` event; add keyboard-path event coverage.

## Required tests before release
1. `npm ci && npm run build` in `site-v2`; TypeScript diagnostics.
2. Playwright E2E: desktop/mobile, consent denied/analytics-only/marketing-only/both, withdrawal, 180-day expiry, malformed URL/referrer, no duplicate events, back/forward navigation, keyboard tabs, WhatsApp link code, all 4 pricing tabs.
3. Security-audit: dependency audit, static secrets scan, headers/CSP, XSS, consent and data minimization, no PII in UTMs, source maps, storage access.
4. GTM/GA4/Ads/Meta live staging validation: network requests and DebugView; verify conversion IDs and no duplicate events.
5. Manual enrollment reconciliation: protected server mapping, RBAC, retention, deletion, offline conversion idempotency, and export preview.
6. Release gate: approved test report + human review before merging/deploying.

## Tools/skills availability
Requested security-audit, agent-desktop, agent-skills, E2E and Playwright workflows are not all available as executable integrations in this session. Their names do not constitute completed tests. The static review above is not a substitute for running them.
