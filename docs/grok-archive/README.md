# Grok archive for Space Snack Quest

Verbatim copies of the Space Snack Quest Grok threads from Brian's Movement Institute workspace, scraped 2026-11-06 between about 12:40 and 1:40 PM PT. Purpose: one place to read what Brian asked for and what the bots claimed, so nothing is lost while the work lives in this repo.

## Battle Ostriches files removed

On 2026-11-13 the Battle Ostriches threads were taken out of this Sasquatch repo. They are not deleted from git history.

The last commit that still has them is `bc0759f91bfda9cf37ab7eb5aeb6248a405d380b` (main, "Walk later-chapter doors out and in, and cut one spoiler line").

To read one back:

```
git show bc0759f91bfda9cf37ab7eb5aeb6248a405d380b:docs/grok-archive/ostrich-thread.md
```

Removed from the working tree:

| File | What it was |
| --- | --- |
| `ostrich-thread.md` | The Ostrich Game bot thread |
| `ostrich-project-gbot-handoff.md` | G Bot handoff to Ostrich Game |
| `ostrich-project-readonly-audit.md` | Ostrich source audit, PR #1 |
| `ostrich-project-lobby.md` | Ostrich lobby, PR #3 |
| `ostrich-project-action-ring.md` | Ostrich action ring, PR #2 |
| `ostrich-project-stale-egg.md` | Ostrich egg clue, PR #4 |
| `ostrich-project-teach-actions.md` | Ostrich PR #5 (lobby, grid, timer) |

`FEEDBACK-INDEX.md` section D (Ostrich rows D1–D38) was removed from that file in the same commit. Sections A, B, and C are unchanged. Section E (G Bot) stays, because it also sets up the Squatch work.

## Kept on purpose, even though they mention Ostriches

| File | Why it stayed |
| --- | --- |
| `gbot-thread.md` | One verbatim thread. It creates the Squatch Game bot and transcribes the Sasquatch playtest. The same thread also starts the Ostrich bot. Splitting it would cut the Squatch handoff. |
| `gbot-handoff.md` | The sheet from G Bot to the Squatch Game bot. Space Snack Quest only. |
| `FEEDBACK-INDEX.md` section E, and the principle list at the end | Section E is the G Bot asks. A few principles were first written down on Ostrich rows. The sentences stay. The D rows do not. |

## Files still here

| File | What it is |
| --- | --- |
| `squatch-thread.md` | The Squatch Game bot thread |
| `gbot-handoff.md` | G Bot to Squatch Game |
| `project-fix-progression-blockers.md` | Squatch coding agent: PRs #1–#5 |
| `project-review-interaction-story-feedback.md` | Read-only QA for PR #3 |
| `project-qa-kitchen-presentation-pass.md` | Kitchen art QA, PR #4 and PR #5 |
| `project-audit-fresh-player-progression.md` | Chapter 1 fresh-player audit, PR #6 docs |
| `project-rework-manager-office.md` | Office redesign brief. Nothing was built |
| `gbot-thread.md` | G Bot coordinator thread |
| `FEEDBACK-INDEX.md` | Numbered asks from Brian. Ostrich rows removed. Statuses are still unverified |

## Method

- Browser: the Claude desktop app's built-in pane, signed in as Brian (MI workspace). A direct `/bot/<id>` URL rendered a blank page; threads were opened from the sidebar.
- Each thread is a virtualized list. The page was scrolled to the top, then walked in 300px steps, keeping the longest text for each `data-bot-entry-id`. Three passes. The third added nothing (Squatch 265 ids; G Bot 92).
- Speaker labels: entries right after a "Message from X" marker are **Agent: X**. Everything else from the bot is **Grok**.

## What could not be reached

- Brian's playtest transcripts are not in Grok. G Bot transcribed the recordings into its own sandbox. The Grok page shows the audio file names only. The Sasquatch asks that were quoted from that recording are section B of `FEEDBACK-INDEX.md`.
- Attachments the bots produced (the backlog, `story-options.html`, and the Ostrich HTML mockups) were chat cards. The backlog and story docs that belong to this game are elsewhere under `docs/`. The Ostrich mockups were never in this repo.
- Agent screenshots under `/opt/cursor/artifacts/` are in Cursor's cloud stores. Only alt text is here.
