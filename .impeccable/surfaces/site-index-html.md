---
version: 1
slug: "site-index-html"
primary_target: "site/index.html"
related_targets: ["site/src/App.jsx"]
---

# Surface: landing (site/)

Scope: the single marketing page for Ai-agent. Mode: Persuade.
Audience: Spanish-speaking people who want to hand off digital chores from their phone.
Action: try the agent on an example task in the first viewport; join the waitlist at the close.
Proof: the live route itself (synthetic demo data, labeled "ejemplo"). No customers, prices or integrations claimed.
Constraints: Spanish copy; phone-first; React + Vite with Sonner, Motion, Base UI, NumberFlow.

## Direction contract

THESIS: Every task is a metro line. The agent draws the route as stations before it leaves, and a red stop marks where it halts to ask. Refuses the AI-landing default: dark gradient hero, chat-bubble mockup, a grid of equal feature cards.

OWN-WORLD: Cool white map paper, ink-black text, 45-degree line geometry only. Line colours as roles: cobalt, green, mustard, violet; vermilion is reserved for the stop that asks permission. Stations are white discs with heavy ink rings, interchanges are capsules, line badges are rounded squares with a number. Archivo, wide and heavy for headlines, condensed for station labels.

STORY: The visitor types or picks a chore, watches it become a route, sees the train stop at the red station, approves, and receives a ticket. They believe the agent shows its work and asks first. They try it, then join the list.

FIRST VIEWPORT: Headline top-left in wide Archivo at display size; directly under it the task input styled as a station search with three example chips and the "Trazar recorrido" button as the primary action. The live route fills the right half on desktop (diagonal) and runs vertically under the input on phones, with the train dot moving.

FORM: Plano de metro, rank 1 of 7 on my grounded list (chosen by the user as the pick). seed:2f6026b776761141
Raise from the cutting bench: state is a mark, not a hue (filled disc done, ring pending, vermilion bar waiting for you, struck cross discarded).
Raise from the accretion disk: an explicit irreversible threshold drawn on the route.
Raise from the ice press: the record keeps corrections visible instead of hiding them.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
