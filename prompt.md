# Ralph Agent Instructions

## Your Task

1. Read `./BUILD-PLAN.md`
2. Read `./tasks.json`
3. Read `./progress.txt`
   (check Codebase Patterns first)
4. Check you're on the correct branch
5. Pick highest priority subtask
   where `passes: false`
6. Implement that ONE subtask
7. Run typecheck and tests
8. Commit: `feat: [ID] - [Title]`
9. Update tasks.json: `passes: true`
10. Append learnings to progress.txt

## Progress Format

APPEND to progress.txt:

## [Date] - [Task ID]

- What was implemented
- Files changed
- **Learnings:**
  - Patterns discovered
  - Gotchas encountered

---

## Codebase Patterns

Add reusable patterns to the TOP
of progress.txt

## Stop Condition

If ALL stories pass, reply:
<promise>COMPLETE</promise>

Otherwise end normally.
