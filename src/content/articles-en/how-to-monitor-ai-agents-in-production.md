---
title: "How to monitor AI agents in production: traces, evals, cost, rollback"
description: "How to monitor AI agents in production in 2026: the traces to keep, the metrics that matter, alert thresholds, evaluation sets, cost limits and rollback."
date: "2026-10-30"
updated: "2026-10-30"
category: "automation"
lang: "en"
tags: ["observability", "ai-agents", "monitoring", "evaluation", "cost control"]
keywords: ["monitor ai agents", "llm observability", "ai agent monitoring", "llm evaluation in production", "ai agent cost control"]
featured: false
draft: false
faq:
  - q: "What is the minimum monitoring an agent needs?"
    a: "A trace of every run with the input, the output, the tool calls and the token cost, plus one alert when a run fails in a way nobody planned for."
  - q: "How do I know the model got worse after an update?"
    a: "Run a fixed evaluation set on every change of model, prompt or tool, and compare the results with the last known good run."
  - q: "How do I control the cost of an agent?"
    a: "Cap the number of steps per run, set a budget per task, use the cheaper model for the routine steps and alert before the monthly bill jumps."
  - q: "What should I do when an agent misbehaves in production?"
    a: "Turn it off with the kill switch, roll back to the last known good version of prompt and model, and review the traces before switching it back on."
---

Monitoring AI agents in production means watching four things: whether the task was done, what it cost, how long it took and whether it stayed inside its permissions. Uptime monitoring catches none of them, because an agent fails by returning a plausible wrong answer rather than by going down. The minimum is a trace of every run, an evaluation set that runs on every change, and a tested kill switch.

## Why uptime monitoring is not enough

An AI agent fails quietly. It returns a confident answer that is wrong, calls a tool with the wrong arguments, or loops through the same step until it hits a limit. None of those raise an error banner, so a dashboard that shows a green service is telling you the process is alive and nothing else.

That is why content quality and cost need their own signals. The four families to watch are quality, meaning the task was actually completed, cost, meaning tokens and money per task, latency, tracked as p50 and p95, and safety, covering policy refusals, blocked actions and approval requests. A fifth concern sits across them: whether the agent still respects the limits it was given.

The unit of evidence is the trace. A trace is the record of one run: the input, the retrieved context, every prompt, every tool call with its arguments and result, the output, the token counts, the total cost, and the version of the prompt and model used. Without that record, an incident review becomes a matter of memory.

## How to set up monitoring in eight steps

1. **Define the golden set of real tasks and what a correct outcome looks like.** Take the requests the agent already handles and write down what right looks like for each one. A set of fifty real inputs with expected outcomes is enough to start, and it is what turns a feeling that the agent got worse into a number.

2. **Instrument the agent so every run leaves a trace with a run id.** The run id is what joins a trace to a cost entry, an alert and a user complaint. Without it, the three live in separate systems and none of them can be reconciled.

3. **Log inputs, outputs and tool calls with personal data redacted.** Traces are long-lived and widely readable inside a company, which makes them a copy of your customer data in a place nobody classified. Redact before the trace is written, not in the viewer.

4. **Set the four dashboards and the alert thresholds.** Quality, cost, latency and safety get one panel each, and each panel has a threshold that pages someone. Choose thresholds from the first month of real traffic rather than from a guess, because an alert that fires every hour is an alert that gets ignored.

5. **Run the evaluation set on every change of prompt, model or tool.** This is the step that prevents a silent downgrade. The score of the new version is compared against the last known good run, and a drop blocks the release until somebody explains it.

6. **Release with a shadow run and then a canary.** Shadow evaluation sends traffic to the new version without letting it act, so you can compare outputs on live inputs safely. A canary then lets a small percentage of traffic reach it while the old version handles the rest.

7. **Set the kill switch, the spend limit and the rollback path.** The kill switch has to be reachable by someone who is not the engineer who built the agent, and it has to be tested rather than documented. The spend limit belongs at the provider, because a budget inside your own code does not stop a loop that never returns.

8. **Review the failures every week and turn each into a test case.** Every incident that is not in the evaluation set will happen again. This loop is the difference between an agent that improves and one that surprises you.

## The signals to watch and what a bad reading looks like

| Signal | Metric | What a bad value looks like | What you do about it |
|---|---|---|---|
| Quality | Task success rate, the share of runs that produced a correct and complete outcome | The rate falls after a model or prompt change | Block the release and run the evaluation set |
| Quality | Groundedness or citation accuracy | Claims appear that the source does not support | Force citation and route unsupported claims to a person |
| Cost | Tokens and money per task | Cost per task rises while volume stays flat | Cap the step count and move routine steps to a cheaper model |
| Cost | Budget burn rate against the monthly limit | The burn rate exceeds what the month can absorb | Raise a daily budget per task and a hard spend limit |
| Latency | p95 latency | The p95 sits several times above the p50 | Shorten the context and parallelise the tool calls |
| Latency | Tool-call failure rate | A tool fails on one run in five | Retry with backoff, then hand the task to a person |
| Safety | Policy refusals and blocked actions | Zero refusals on a task that should trigger some | The policy check is probably not running |
| Safety | Human intervention rate | More than a small share of runs need a person | The task is not ready to run unattended |
| Reliability | Runs that hit the maximum step count | Step-limit hits appear on routine requests | Lower the cap or fix the loop condition in the prompt |

## The layers of a monitoring setup and who owns them

| Layer | What it records | Tool that does it | How often you look at it |
|---|---|---|---|
| Traces | Input, retrieved context, prompts, tool calls with arguments and results, output, tokens, cost, prompt and model version | Datadog LLM Observability, LangSmith, Arize Phoenix, Braintrust, Helicone, New Relic | Daily for failures, weekly for the trend |
| Evaluations | Scores from a fixed set of real inputs with expected outcomes | OpenAI Evals and the pattern it established, LangSmith datasets, Phoenix | On every release, and after any model change |
| Cost | Tokens and money per task, per model and per team | The tracing layer plus the provider's usage dashboard | Weekly, and daily once the agent is busy |
| Alerts | Threshold breaches on quality, cost, latency and safety | Alerting rules on top of the tracing layer, spend limits in the provider console | Continuously, reviewed once a day |
| Versioning | The prompt, model and tool version behind each run | A repository or registry, referenced from the trace | Before every release |
| Rollback | The last known good version and the switch that restores it | A feature flag or configuration in the orchestration layer | Tested monthly |

## What the tooling and the production teams actually do

Datadog offers LLM Observability, tracing prompts, completions and tool calls with token and cost metrics, and the [LLM observability documentation](https://docs.datadoghq.com/tracing/llm-observability/) describes how the pieces are put together. Arize Phoenix is an open-source tracing and evaluation platform that runs locally if you would rather keep the traces inside your own environment, and the [project repository](https://github.com/Arize-ai/phoenix) covers the setup. LangSmith, from LangChain, provides tracing and evaluation with datasets, and Braintrust, Helicone and New Relic cover similar ground for tracing, evaluation and cost monitoring.

OpenAI publishes [Evals](https://platform.openai.com/docs/guides/evals), a framework for scoring models and prompts against test cases, and this pattern is standard across providers: a versioned set of cases, a scorer, and a score that has to move in the right direction before a release ships.

The production habits matter as much as the tools. Airbnb has publicly written about the reliability engineering required to run LLM features in production, including shadow testing before launch. Stripe and Shopify run many internal AI features behind evaluation gates rather than shipping model changes straight to users. In both cases the pattern is the same as step five and six above: a fixed set of cases, a comparison against the last known good version, and a small slice of traffic before the full release.

## Common mistakes that leave you blind in production

- **Monitoring only uptime and error rates.** The service is up while the agent returns wrong answers, which is the most expensive failure mode of the four.
- **No run ids.** Without a shared key you cannot join a trace to its cost, its alert and the complaint it caused.
- **Logging personal data and regulated content by default.** Redact before the trace is written.
- **Alerting on everything until people ignore it.** A threshold that fires every hour is noise, and noise is how a real problem gets missed.
- **Evaluating only the happy path.** The interesting failures are the malformed inputs, the missing documents and the adversarial ones.
- **No idea of the cost per task.** You cannot cap what you have not measured, and a loop is invisible on a subscription dashboard.
- **Changing prompt and model in the same release.** When the score moves you cannot tell which change caused it.
- **No versioned prompt.** A prompt edited in a dashboard is unrecoverable, and there is no last known good version to return to.
- **No rollback.** A bad change stays in production until a user notices and reports it.
- **Dashboards nobody reads.** A panel with no owner and no review cadence is decoration.
- **Re-running failed runs without a queue.** A retry storm doubles the bill and can turn one bad release into an expensive one.

## What to measure in a monitored agent

| Metric | What it tells you | When it matters most |
|---|---|---|
| Task success rate | Whether the agent is doing the job | Daily, and immediately after every release |
| Evaluation pass rate per release | Whether a change is safe to ship | Every deployment |
| Tokens and cost per task | The economics of the agent | Weekly, and per task type |
| p95 latency | The experience of the slowest real users | Weekly, split by task type |
| Tool-call failure rate | Whether the surrounding systems are the problem | Daily during the first month |
| Groundedness or citation accuracy | Whether the answers are supported | Every release |
| Human intervention rate | How much of the work still needs a person | Monthly, as a trend |
| Mean time to detect | How long a bad release stays live | After every incident |
| Mean time to rollback | How fast the fix lands | After every incident |
| Budget burn rate against the monthly limit | Whether the agent fits the bill | Daily once the volume is steady |

Review the quality and cost numbers weekly even when nothing has changed, because a drift in either one is easier to catch in a trend than in a single bad afternoon. When the agent reads from internal documents, [what is RAG explained](/guides/what-is-rag-explained/) covers the retrieval layer that most groundedness errors come from, and the permissions that keep it inside its lane are in [how to guardrail AI agents](/guides/how-to-guardrail-ai-agents/).

## Frequently asked questions

**What is the minimum monitoring an agent needs?** A trace of every run with the input, the output, the tool calls and the token cost, plus one alert when a run fails in a way nobody planned for. Everything else on these pages is an extension of that minimum.

**How do I know the model got worse after an update?** Run a fixed evaluation set on every change of model, prompt or tool, and compare the results with the last known good run. The score has to be better than or equal to the previous release before the change goes out, and a drop is a blocker rather than a discussion.

**How do I control the cost of an agent?** Cap the number of steps per run, set a budget per task, use the cheaper model for the routine steps and alert before the monthly bill jumps. As of October 2026 the main levers are prompt caching, a smaller model for routine steps, a maximum number of steps per run, batching and a per-task budget that raises an alert. Rates change, so the provider's official pricing page is the source of truth.

**What should I do when an agent misbehaves in production?** Turn it off with the kill switch, roll back to the last known good version of prompt and model, and review the traces before switching it back on. Then add the failing input to the evaluation set so the same failure is caught by the next release.

## Where to go next

Start with the golden set, because a monitoring stack without a definition of correct cannot tell you anything worth reading. The permissions and approval steps that sit below the agent are covered in [how to guardrail AI agents](/guides/how-to-guardrail-ai-agents/), the instruction layer in [how to write prompts that work](/guides/how-to-write-prompts-that-work/), and the tool landscape in the [tool directory](/tools/). If the orchestration runs inside a visual builder, the [n8n versus Zapier guide](/guides/n8n-vs-zapier/) covers where the kill switch and approval steps usually live. Firms putting an agent into a regulated process face the same rules in a different setting, as described in [AI for accounting firms](/guides/ai-for-accounting-firms/).
