# AI-Generated Code

Companion to the `eaz-code-review` skill. Code written by an AI agent usually looks
tidy and confident, which makes its mistakes easy to miss. Review it with these in mind.

## Failure modes and how to catch them

| Failure | What to check |
| :--- | :--- |
| **Invented packages or APIs** | Does every import resolve? Does the package exist, with that name and that function, in the installed version? Open the lockfile and the library's own docs rather than trusting the code |
| **Plausible but wrong logic** | Trace one real input through the code by hand. Check boundaries: empty list, zero, negative, very large, duplicate, concurrent |
| **Tests that prove nothing** | Do the assertions check mocks the test itself set up? Would the test still pass if the feature were deleted? Does it ever hit the failure path? |
| **Swallowed errors** | Empty `catch` blocks, fallbacks that hide failures, `|| default` masking a missing value, logging an error and carrying on |
| **Over-engineering** | Abstractions, config options, and layers the task did not need; a framework added for one function |
| **Dead and duplicated code** | Unused exports, leftover scaffolding, copies of an existing helper written again |
| **Scope creep** | Files changed that the task did not mention; reformatting mixed with logic; unrelated "improvements" |
| **Copied insecure patterns** | String-built SQL, permissive CORS, disabled certificate checks, secrets in examples, broad file permissions |
| **Hardcoded values** | Placeholder URLs, keys, ids, or sample data left in; raw design values instead of tokens |
| **Claims in the summary** | "Tests pass" or "verified" in the description — did the evidence appear, or only the claim? Re-run it |

## How to review it

1. Read the task or `tasks.md` criterion first, so you judge the change against what was
   asked — not against what the code happens to do.
2. Check the diff for **files the task did not need to touch**.
3. Run the code and the tests yourself; do not rely on the author's summary.
4. Mutate to test the tests: break the implementation in one line and confirm a test fails.
5. Prefer a short, specific list of real problems over a long list of nits — an
   agent-written change often has few big problems hidden among clean-looking code.
6. Say plainly what you could not verify.

## Questions worth asking the author

- Which of these files and functions did you write, and which already existed?
- What did you run to confirm it works, and what was the output?
- What did you decide not to do, and why?
