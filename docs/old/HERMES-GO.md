# Hermes job 1: check every feedback row against the game code

You are Hermes, running on Brian's Mac mini. Follow these steps in order, exactly as written. Do not skip a step. Do not improve, shorten or reword anything. Do not make judgment calls. When a step says STOP, do what it says and end the job.

## This job checks the bots' claims against the game code.

Brian's game bots claimed they made many changes. The file `docs/grok-archive/FEEDBACK-INDEX.md` lists those claims in 64 rows (A1 to A27, B1 to B29, C1 to C8). This job searches the game code for each claim and writes a report. A script below does the searching. Your job is to set it up, run it, and check the result.

## These rules apply to every step.

1. Work only inside the repo folder: the folder that contains `index.html` and the `docs` folder. Every command below is run from that folder.
2. You may create the folder `.work/` and the file `docs/FEEDBACK-CODE-CHECK.md`. You may create `docs/HERMES-BLOCKED.md` only when a step says STOP. Do not create, change or delete any other file.
3. Do not run `git add`, `git commit`, `git push`, `git checkout`, `git reset` or `git pull`.
4. **STOP** means: write the file `docs/HERMES-BLOCKED.md` containing the step number, the command you ran, and its full output. Then end the job and tell Brian: "Hermes job 1 is blocked. See docs/HERMES-BLOCKED.md."
5. Copy commands exactly, character for character. Each command is in its own grey box.

## Step 1. Check you are in the right folder.

```
ls index.html docs/grok-archive/FEEDBACK-INDEX.md docs/HERMES-GO.md
```

You should see the three file names and no error. If any says "No such file or directory", STOP.

## Step 2. Check the game version this job needs is in git.

```
git cat-file -t 15051ec
```

You should see the word `commit`. If you see anything else, STOP.

## Step 3. Make the work folder.

```
mkdir -p .work
```

## Step 4. Copy the game file from that version.

```
git show 15051ec:index.html > .work/index-15051ec.html
```

Then check its size:

```
wc -c < .work/index-15051ec.html
```

The number must be `587516` (spaces before it are fine). If it is a different number, STOP.

## Step 5. Pull the program out of the game file.

```
python3 -I -c "import re;s=open('.work/index-15051ec.html',encoding='utf-8').read();open('.work/bundle.js','w',encoding='utf-8').write(re.findall(r'<script>(.*?)</script>',s,re.S)[-1])"
```

Then check its size:

```
wc -c < .work/bundle.js
```

The number must be `586952`. If it is a different number, STOP.

## Step 6. Make the readable copy of the program.

First check whether a readable copy is already there:

```
wc -l < .work/pretty.js
```

If this prints `26918`, go to Step 7.

Otherwise, run:

```
npx --yes prettier@3.9.10 --print-width 140 .work/bundle.js > .work/pretty.js
```

Then check it:

```
wc -l < .work/pretty.js
```

The number must be `26918`. If `npx` is "command not found", or the number is different, STOP, and in `docs/HERMES-BLOCKED.md` also write this line: "Brian: copy pretty.js from the MacBook into .work/pretty.js on the mini, then run Hermes job 1 again."

## Step 7. Save the checking script from this file.

```
awk '/^# BEGIN check_feedback.py$/{f=1} f{print} /^# END check_feedback.py$/{f=0}' docs/HERMES-GO.md > .work/check_feedback.py
```

Then check it is exactly the right script:

```
shasum -a 256 .work/check_feedback.py
```

The long code at the start must be exactly:

`95cdbd96497a76617a6624f80ddae06717d4e2594b3f3b517a8fad11ef126295`

If it is different, STOP.

## Step 8. Run the script.

```
python3 -I .work/check_feedback.py .work/pretty.js docs/FEEDBACK-CODE-CHECK.md
```

The last line printed must start with `WROTE docs/FEEDBACK-CODE-CHECK.md rows=64`. If it starts with `STOP`, or shows `Traceback`, STOP.

## Step 9. Check the report is complete.

Run each command and compare with the expected answer.

```
grep -o '^| [ABC][0-9]*' docs/FEEDBACK-CODE-CHECK.md | sort -u | wc -l
```

Expected: `64`.

```
grep -c '^## Claims to check by a person$' docs/FEEDBACK-CODE-CHECK.md
```

Expected: `1`.

```
grep -c '^## Evidence (first live line for each search)$' docs/FEEDBACK-CODE-CHECK.md
```

Expected: `1`.

```
grep -c 'ROW NOT FOUND IN FEEDBACK-INDEX.md' docs/FEEDBACK-CODE-CHECK.md
```

Expected: `0`.

```
git status --porcelain
```

Expected: the only new or changed paths are `.work/` and `docs/FEEDBACK-CODE-CHECK.md` (other lines that were already there before you started are fine; you did not make them). If a file you did not create shows as modified (a line starting with ` M`), STOP.

If any expected answer is different, STOP.

## Step 10. Tell Brian it is done.

Say exactly this, filling in the numbers from the line in the report that starts with `Rows: 64.`:

"Hermes job 1 is done. The report is docs/FEEDBACK-CODE-CHECK.md. Summary: <copy the whole line that starts with Rows: 64.> A Claude reviewer should check five rows before anyone relies on it."

Do not commit the report. Brian or a Claude session will review and commit it.

## The checking script is below, and Step 7 copies it out.

Do not type this script by hand and do not edit it. Step 7 copies it out of this file.

```python
# BEGIN check_feedback.py
import os, subprocess, sys

PRETTY = sys.argv[1] if len(sys.argv) > 1 else ".work/pretty.js"
OUT = sys.argv[2] if len(sys.argv) > 2 else "docs/FEEDBACK-CODE-CHECK.md"

# Line ranges in the pretty-printed bundle of commit 15051ec (26,918 lines).
# From docs/CODE-REVIEW-2026-11-06.md.
def region(n):
    if n <= 11640: return "REACT"
    if n <= 12151: return "SHARED"
    if n <= 14406: return "DEAD"
    if n <= 15282: return "LIVE"
    if n <= 15587: return "DEAD"
    return "LIVE"

SKIP = "SKIP"; TEXT = "TEXT"; FILE = "FILE"; GIT = "GIT"; MANUAL = "MANUAL"

ROWS = [
 ("A1", SKIP, "Account matter (repo privacy), not game code."),
 ("A2", SKIP, "Account matter (sign-in scope), not game code."),
 ("A3", SKIP, "Agent errors, process only."),
 ("A4", SKIP, "Review in chat, process only."),
 ("A5", SKIP, "A list of items; each one is checked in the B rows."),
 ("A6", SKIP, "Build in parallel, process only."),
 ("A7", TEXT, ["Locals still fear Sasquatches", "PROTECT THE AIR SCRUBBERS"]),
 ("A8", TEXT, ["on purpose"]),
 ("A9", TEXT, ["Counter's closed. Pen's open.", "Report him or fuel him?", "The window caught the sink.", "Parked you. Still no coins."]),
 ("A10", SKIP, "Live playtest question, process only."),
 ("A11", GIT, ["32156c7"]),
 ("A12", SKIP, "Render account matter, not game code."),
 ("A13", SKIP, "Way of working, process only."),
 ("A14", TEXT, ["DIRTY DISH", "RUMBLE", "LEAVE SOUP", 'verb: "MOP"']),
 ("A15", TEXT, ["ORDERS"]),
 ("A16", SKIP, "Way of working, process only."),
 ("A17", FILE, ["docs/MASTER-BACKLOG.md"]),
 ("A18", TEXT, ["function sectionReset", "Reset section"]),
 ("A19", FILE, ["docs/story-bible.md", "docs/STORY-DECISIONS.md"]),
 ("A20", FILE, ["story-options.html"]),
 ("A21", SKIP, "Art critique; the result is row A23."),
 ("A22", SKIP, "Open question, see C1."),
 ("A23", TEXT, ['verb: "COOK"', 'verb: "OPEN"']),
 ("A24", GIT, ["15051ec", "9999f0c"]),
 ("A25", MANUAL, "Docs-only audit on a branch; a person checks the PR list."),
 ("A26", TEXT, ["MANAGER"]),
 ("A27", SKIP, "Tests paused for allowance, process only."),
 ("B1", TEXT, ["SKIP", "Escape"]),
 ("B2", MANUAL, "Collision against art needs a person or a test."),
 ("B3", TEXT, ['verb: "HIDE"']),
 ("B4", MANUAL, "Bubble stacking needs a person or a test."),
 ("B5", MANUAL, "Cone look and character size need a person."),
 ("B6", TEXT, ["GANITOR", "airlock"]),
 ("B7", TEXT, ['by: "rust"']),
 ("B8", MANUAL, "Line of sight is covered by tests/gas-stop.mjs, not by a string."),
 ("B9", TEXT, ["TANK EMPTY", "TANK FULL"]),
 ("B10", TEXT, ['cap: "diner door"']),
 ("B11", MANUAL, "Cone hiding while Mops needs a person or a test."),
 ("B12", TEXT, ['by: "pump"']),
 ("B13", TEXT, ["Holding pen. This section starts over."]),
 ("B14", TEXT, ["A WOOKIE!", "AAAAH", "She thinks the goat did it."]),
 ("B15", TEXT, ["Soup instead of gas."]),
 ("B16", TEXT, ['k.has === "soup"']),
 ("B17", TEXT, ['verb: "COOK"']),
 ("B18", TEXT, ['verb: "MOP"']),
 ("B19", TEXT, ["One paw. One sponge. Zero training."]),
 ("B20", TEXT, ['verb: "ROLL"', '!verb: "DUCK"']),
 ("B21", TEXT, ["stamp"]),
 ("B22", TEXT, ["Next stop: Phobos!", "You watch the crate."]),
 ("B23", TEXT, ['verb: "EXIT"', 'cap: "ship"']),
 ("B24", TEXT, ["!Just like that first night"]),
 ("B25", MANUAL, "Cone look needs a person."),
 ("B26", TEXT, ["Locals still fear Sasquatches"]),
 ("B27", TEXT, ["whisper"]),
 ("B28", SKIP, "Open decision, see C2 and C3."),
 ("B29", TEXT, ["crib", "wook"]),
 ("C1", TEXT, ["Ooh, my show!", "Go watch the dock"]),
 ("C2", TEXT, ["SECRET!", "CAUGHT"]),
 ("C3", TEXT, ["Space Chili"]),
 ("C4", TEXT, ["third ear", "1997"]),
 ("C5", TEXT, ["The Guardians", "GARDIAN"]),
 ("C6", TEXT, ["I have rings", "riddle"]),
 ("C7", TEXT, ["Eat up, Harry", "DANCE"]),
 ("C8", TEXT, ["PROTECT THE AIR SCRUBBERS", "Holding pen"]),
]

lines = open(PRETTY, encoding="utf-8").read().split("\n")
if lines and lines[-1] == "":
    lines = lines[:-1]
if len(lines) != 26918:
    sys.exit("STOP: pretty.js has %d lines, expected 26918. Do not continue." % len(lines))
low = [l.lower() for l in lines]

def find(pat):
    p = pat.lower()
    return [i + 1 for i, l in enumerate(low) if p in l]

def git_log():
    try:
        return subprocess.run(["git", "log", "--oneline", "--all"], capture_output=True, text=True).stdout
    except Exception:
        return ""

def find_file(name):
    if "/" in name:
        return os.path.exists(name)
    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if d not in (".git", "node_modules", ".work")]
        if name in files:
            return True
    return False

table, evidence, counts, row_status = [], [], {}, []
for rid, kind, data in ROWS:
    if kind in (SKIP, MANUAL):
        status = kind
        table.append("| %s | %s | | | | %s |" % (rid, data, status))
    elif kind == FILE:
        ok = [find_file(f) for f in data]
        status = "FILE PRESENT" if all(ok) else ("FILE PARTLY" if any(ok) else "FILE MISSING")
        for f, o in zip(data, ok):
            table.append("| %s | file `%s` | | %s | | %s |" % (rid, f, "yes" if o else "no", status))
    elif kind == GIT:
        log = git_log()
        ok = [c in log for c in data]
        status = "IN GIT" if all(ok) else ("PARTLY IN GIT" if any(ok) else "NOT IN GIT")
        for c, o in zip(data, ok):
            table.append("| %s | commit `%s` | | %s | | %s |" % (rid, c, "yes" if o else "no", status))
    else:
        ok_any, dead_any, per = [], [], []
        for raw in data:
            absent = raw.startswith("!")
            pat = raw[1:] if absent else raw
            hits = find(pat)
            live = [h for h in hits if region(h) in ("LIVE", "SHARED")]
            dead = [h for h in hits if region(h) == "DEAD"]
            per.append((pat, absent, hits, live, dead))
            ok_any.append((not live) if absent else bool(live))
            dead_any.append(bool(dead) and not absent)
        if all(ok_any): status = "MATCHES CLAIM"
        elif any(ok_any): status = "PARTLY"
        elif any(dead_any): status = "DEAD CODE ONLY"
        else: status = "NOT FOUND"
        for pat, absent, hits, live, dead in per:
            safe = pat.replace("|", "\\|")
            label = ("should be absent: `%s`" % safe) if absent else ("`%s`" % safe)
            table.append("| %s | %s | %d | %s | %s | %s |" % (
                rid, label, len(hits), " ".join("L%d" % h for h in live[:5]),
                " ".join("L%d" % h for h in dead[:5]), status))
            if live:
                ctx = lines[live[0] - 1].strip()[:160].replace("|", "\\|")
                evidence.append("- %s `%s` at L%d: `%s`" % (rid, safe, live[0], ctx))
    counts[status] = counts.get(status, 0) + 1
    row_status.append((rid, status))

row_ids = [r[0] for r in ROWS]
assert len(row_ids) == 64 and len(set(row_ids)) == 64

out = []
out.append("# Feedback code check (made by Hermes from a script; not reviewed yet)")
out.append("")
out.append("Source: `docs/grok-archive/FEEDBACK-INDEX.md` sections A, B and C (64 rows), checked against the pretty-printed bundle of commit 15051ec (26,918 lines). LIVE means the text is in code the game can reach. DEAD means it is only in the old engine nothing can reach. A row marked MATCHES CLAIM shows the searched text is (or, for a should-be-absent search, is not) in live code; it does not prove the game behaves as claimed.")
out.append("")
out.append("Rows: 64. " + ", ".join("%s %d" % (k, v) for k, v in sorted(counts.items())))
out.append("")
out.append("| Row | What was searched | Hits | Live lines | Dead lines | Row status |")
out.append("| --- | --- | --- | --- | --- | --- |")
out += table
out.append("")
# Part 2: the claim text for every row a person must look at.
FLAG = ("PARTLY", "DEAD CODE ONLY", "NOT FOUND", "FILE MISSING", "FILE PARTLY", "NOT IN GIT", "PARTLY IN GIT", "MANUAL")
claim_col = {"A": 5, "B": 4, "C": 4}
claims = {}
for line in open("docs/grok-archive/FEEDBACK-INDEX.md", encoding="utf-8"):
    cells = [c.strip() for c in line.rstrip("\n").split("|")]
    if len(cells) > 5 and cells[1][:1] in claim_col and cells[1][1:].isdigit():
        claims[cells[1]] = cells[claim_col[cells[1][0]]]
flagged = [(rid, st) for rid, st in row_status if st in FLAG]
out.append("## Claims to check by a person")
out.append("")
out.append("Rows whose status is not a clean match, with what the bot claimed (sections A and B) or what QA saw (section C), copied from FEEDBACK-INDEX.md.")
out.append("")
for rid, st in flagged:
    out.append("- %s (%s): %s" % (rid, st, claims.get(rid, "ROW NOT FOUND IN FEEDBACK-INDEX.md")))
out.append("")
out.append("## Evidence (first live line for each search)")
out.append("")
out += evidence
out.append("")
open(OUT, "w", encoding="utf-8").write("\n".join(out))
print("WROTE", OUT, "rows=64", counts)
# END check_feedback.py
```
