# Model evaluations

CAR-168 implements the explicit live runner and 20 synthetic cases. CAR-169 adds
weekly scoring and human review. No model calls are made by task #0 or ordinary CI.

Keep fixed synthetic inputs in version control. Put generated reports in
`evals/results/` (ignored). Never record real user profiles or API keys.
The runner must respect `EVAL_MAX_MODEL_CALLS` and `EVAL_CONCURRENCY`, report model
and prompt versions, and distinguish safe rejection from successful generation.
