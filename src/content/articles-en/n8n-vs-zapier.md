---
title: "n8n vs Zapier in 2026: cost per task, execution limits, and how to pick"
description: "n8n vs Zapier compared on price per task and per execution, self-hosting, code support, and the monthly volume where each tool wins for small teams."
date: "2026-10-30"
updated: "2026-10-30"
category: "automation"
lang: "en"
tags: ["n8n", "zapier", "automation", "workflow builder", "pricing"]
keywords: ["n8n vs zapier", "zapier vs n8n pricing", "n8n or zapier for small business", "zapier task limits", "n8n vs zapier self hosted"]
featured: false
draft: false
faq:
  - q: "Is n8n or Zapier cheaper for a small business?"
    a: "It depends on how many steps a workflow has. Zapier bills per task, one for every successful step, while n8n bills per workflow execution regardless of the number of steps, so a ten-step flow running a thousand times a month costs very differently on each."
  - q: "Can I run n8n myself instead of paying for the cloud?"
    a: "Yes. The Community edition is free to self-host with no execution limit. You pay for the server, the backups and the maintenance time, which usually matters more than the licence once a team has someone who owns it."
  - q: "Which one is easier for a team with no developer?"
    a: "Zapier, because each app ships with ready-made actions you can pick from a list. n8n is faster for teams that can write a bit of code, since any node accepts JavaScript or Python."
---

n8n is usually the cheaper option once a workflow runs thousands of times a month, because n8n bills one unit per workflow execution while Zapier bills one task per successful step. Zapier is usually easier to maintain for a team without a developer, because every app ships with ready-made actions. The crossover point depends on your step count and monthly volume.

## What Zapier and n8n actually are

Zapier is a no-code automation platform founded in 2011 and based in San Francisco. Its strongest asset is the app directory. As of October 2026 it was still described as the largest ready-made directory on the market, with integrations counted in the thousands of apps, each one shipping with actions that are already configured. You choose a trigger, choose the apps, and the platform handles the connection. There is no self-hosted version, and run history with task replay comes with the paid plans.

n8n is a Berlin-based workflow builder. The canvas resembles a no-code tool, but every node accepts JavaScript or Python, which is where the real difference sits. Its own site advertised more than 400 ready-made integrations in October 2026, and a code node covers the long tail of apps that have no maintained connector. n8n is distributed under the Sustainable Use License, a source-available licence, and the Community edition can be self-hosted for free with no execution limit.

Both vendors now sell AI agents inside the workflow builder, which matters for cost because the model call sits inside the automation and lands on the same invoice as the steps around it. Adding an agent step to a Zap tends to raise the task count faster than the number of steps you added. Our guide to [guardrails for AI agents](/guides/how-to-guardrail-ai-agents/) covers how to keep those steps bounded.

For the wider landscape, the [comparison hub](/comparisons/) and the [tool directory](/tools/) show where each option sits.

## How to decide between n8n and Zapier in eight steps

1. **List the workflows you actually run, not the ones you plan to build.** A spreadsheet with one row per live automation, the owner, and the business process it supports takes ten minutes. Everything after this step depends on that list being real.
2. **Count the billable steps in each workflow.** On Zapier, triggers and polling do not consume tasks but every successful action does. A flow that looks like one box to the customer is usually four to eight billable steps underneath.
3. **Count how many times each workflow runs per month.** Take three months of history from whatever system holds the trigger, since seasonal peaks matter more than the average.
4. **Convert both counts into the unit each vendor charges.** Zapier tasks equal runs multiplied by steps. n8n executions equal runs. Make credits equal runs multiplied by operations, with heavy apps consuming several credits per action.
5. **Check whether anyone on the team can read the documentation of the more technical option.** n8n asks more of whoever owns it: credentials, node configuration, upgrades. If the answer is no one, that is a fact about your decision, not a detail.
6. **Run the same workflow on both for 30 days.** Take the highest-volume flow, build it twice with real data, and record build time, failures and manual interventions.
7. **Write down the total cost and the maintenance hours side by side.** Include the hours at your own internal rate, because maintenance time is the cost that hides inside a self-hosted setup.
8. **Decide, then set a date to review the decision.** Six months out is a reasonable default. Record in one line what would reverse the choice, so the review is not a negotiation from scratch.

## What each tool charges and what one unit means

The figures below are the ones published in October 2026, on annual billing.

| Tool | Billing unit | Entry plan price | Included volume | What counts as one unit |
|---|---|---|---|---|
| Zapier | Task | US$ 19.99 per month billed annually | 750 tasks | One successful step in a Zap |
| n8n | Workflow execution | EUR 20 per month billed annually | 2,500 executions | One complete run, whatever the step count |
| Make, formerly Integromat | Operation, sold as credits | US$ 9 per month billed annually | 10,000 credits | One operation, and heavy apps use several credits |

As of October 2026, Zapier Professional sits at US$ 19.99 per month billed annually with 750 tasks, the Team plan starts at US$ 69 per month with 2,000 tasks, and Enterprise is priced on request. On n8n, Starter is EUR 20 per month billed annually with 2,500 executions, Pro is EUR 50 per month with 10,000 executions, and Business is around EUR 667 per month billed annually, listed on the October 2026 pricing page as self-hosted only with 40,000 monthly executions, including SSO, LDAP and audit logging. Make Core starts at US$ 9 per month billed annually with 10,000 credits, Pro at US$ 16 and Teams at US$ 29.

Plans, prices and limits change without much notice, so treat the official pricing pages as the source of truth and check them before committing a budget for a year. The [Zapier pricing page](https://zapier.com/pricing/) and the [n8n pricing page](https://n8n.io/pricing/) publish the current numbers, and the [n8n documentation](https://docs.n8n.io/) holds the behavioural details.

## What the same monthly volume costs on each platform

| Monthly workflow runs | Zapier, at 6 steps per run | n8n Cloud, 1 execution per run | n8n self-hosted | Make, at 3 operations per run |
|---|---|---|---|---|
| 500 | About US$ 89 | About US$ 24 | US$ 0 licence plus about US$ 15 to 30 for a small server | About US$ 9 |
| 5,000 | About US$ 289 | About US$ 60 | US$ 0 licence plus about US$ 15 to 30 for a small server | From US$ 16, plus credit packs |
| 20,000 | About US$ 769 | Enterprise, priced on request | US$ 0 licence plus about US$ 40 to 80 for a larger server | From US$ 29, plus credit packs |

All figures in that table use the prices published in October 2026, with annual billing. The assumptions behind it matter more than the totals. Zapier figures come from the published task ladder on the annual Professional plan, sized to the smallest tier that covers the task count, so 500 runs at six steps per run is 3,000 tasks and lands on the 5,000-task tier at about US$ 89, while 20,000 runs is 120,000 tasks on the 200,000-task tier at about US$ 769. The Team tiers cost more per unit for the same volume, with the 200,000-task Team tier quoted around US$ 999. n8n figures use EUR 20 at roughly US$ 24 and EUR 50 at roughly US$ 60, converted at the rate the vendors show on their own pages.

Two caveats keep the table honest. Make does not publish a fixed price ladder for extra credits, so the higher rows show the entry plan plus whatever credit packs the volume requires, and the invoice depends on which apps you use. The n8n self-hosted column excludes your own time: a monthly check for updates, a backup restore test and a rotated set of credentials runs roughly one to two hours, and at 20,000 runs a month you should assume a larger instance and a weekly look. None of these figures include model usage for AI steps.

## The companies behind the tools and a typical deployment

Zapier sells subscriptions to business users who want connections without code, and earns from a task-based model where the more steps and the more automation, the more it bills. Its advantage is coverage and predictability for non-technical teams. Its limit is structural: every step is a unit, so an elaborate workflow is expensive by design.

n8n sells both a hosted platform and a self-hostable product under the Sustainable Use License, earning from cloud subscriptions and from business licences for teams that run the software on their own infrastructure. Its advantage is the code node and the absence of a per-step charge. Its limit is that running and maintaining the software moves to the buyer.

Make, previously called Integromat, sits between the two: a visual builder that charges per operation rather than per step, landing in the middle on cost and on setup.

The following profile is a typical deployment rather than a customer claim. A 40-person freight forwarding company in Rotterdam receives around 300 shipment requests a month by email. The flow parses the request, creates the order in the freight system, books a delivery slot, notifies the customer and updates the tracking sheet, which comes to five billable steps.

On Zapier, 300 runs at five steps is 1,500 tasks a month, which is the Professional tier at 1,500 tasks, about US$ 39 per month billed annually. On n8n, 300 executions fit inside Starter at EUR 20, or inside the free Community edition if someone owns the server. On Make, 900 operations fit inside the Core plan at US$ 9. Building the flow takes roughly six hours on Zapier against twenty to thirty hours on n8n, where the parsing step and the slot-booking API take real code. Maintenance runs about one hour a month on Zapier and four to eight on n8n, mostly upgrades and credential handling. Now add one AI step that drafts the customer notification. Zapier charges for the AI action as a task, and an AI action can consume several, so the count can cross 2,000 tasks and move the company from the US$ 39 tier to the 2,000-task tier at about US$ 49 for the same 300 runs. On n8n the execution count barely moves, and the model call is billed by the model provider. The line-item that changed the budget was the agent, not the platform, which is worth remembering before rebuilding everything on a different tool.

## Common mistakes that cost more than the subscription

- **Comparing list prices instead of unit prices.** US$ 19.99 against EUR 20 tells you nothing until you know how many units each produces.
- **Forgetting that every step is a task.** A ten-step Zap running a thousand times a month is 10,000 tasks, not 1,000.
- **Letting AI steps multiply the bill.** A single agent action can consume several tasks, and agents also call tools, so one visible step can become many units.
- **Self-hosting without an owner.** If nobody holds the backups, the upgrade schedule and the credential rotation, a free licence becomes an unpaid liability with a real failure risk.
- **Migrating a working Zap to n8n without a reason.** A rewrite costs days and breaks the run history you depend on when something goes wrong. Migrate when the cost model changes or a step becomes impossible, not for tidiness.
- **Ignoring that long runs are slower on no-code platforms.** Each step is a network call to a remote service, and a twenty-step flow takes long enough that people start bypassing it.
- **Letting automation sprawl.** Every new workflow needs an owner and a place in the list. A hundred undocumented Zaps are worse than twenty documented ones, because nobody can safely change them.

## What to measure once the workflows are running

- **Tasks per run.** The most useful number, because multiplying it by runs gives you the bill and lets you predict the next tier.
- **Runs per month.** Track it for three months, not one, and separate the seasonal peak from the average.
- **Cost per completed business transaction.** Monthly invoice divided by finished outcomes, the only cost figure comparable with the salary of the person who used to do the work.
- **Failure rate and retries.** A failing Zap still burns tasks on the steps that succeeded, and each retry is another block of units.
- **Hours of maintenance per month.** Logged honestly, including time spent on failures and not only on upgrades.
- **Time to build a new automation.** If a request takes three days in n8n and one afternoon in Zapier, that shows up in how much of the backlog you clear.
- **Share of automations that need custom code.** If most of them need it, you are paying for a no-code tool and still carrying the maintenance burden of a code platform.

Review these monthly for the first half year. If you run agents inside these workflows, our guide to [monitoring AI agents in production](/guides/how-to-monitor-ai-agents-in-production/) covers the log fields that make the difference visible.

## Frequently asked questions

**Is n8n or Zapier cheaper for a small business?** It depends on how many steps a workflow has. Zapier bills per task and every successful step counts as one, so a ten-step flow running a thousand times a month costs about 10,000 tasks. n8n bills per workflow execution, so the same flow costs 1,000 executions no matter how many steps are inside it. Below roughly 500 runs a month Zapier is usually cheaper because its entry price is lower and you avoid running a server. Above a few thousand runs a month, n8n usually wins on the invoice, and self-hosting can win earlier if the team has someone who owns the infrastructure.

**Can I run n8n myself instead of paying for the cloud?** Yes. The Community edition is free to self-host and carries no execution limit, so you pay for the server and for the maintenance rather than for a licence. The real costs are a small server, roughly US$ 15 to 30 a month, and the hours spent on backups, upgrades and credentials. The break-even point usually arrives when several people would otherwise need to write code, because the code node removes most of the connectors that would otherwise justify a paid plan.

**Which one is easier for a team with no developer?** Zapier, because each app ships with ready-made actions that you pick from a list, and a broken Zap can be reopened in the browser and fixed by pointing at a different option. n8n is faster for teams that can write a bit of code, since any node accepts JavaScript or Python and you can replace an action that does not fit. A practical middle ground is to run standard processes on Zapier and move the ones with unusual logic to n8n later, once someone has time to own it.

## Next steps

Write down your real monthly volume before you choose anything, because the billing units decide the outcome more reliably than the feature lists do. The [comparison hub](/comparisons/) puts the platforms side by side, and [how to build a CRM pipeline](/guides/how-to-build-a-crm-pipeline/) shows the kind of multi-step flow where the task count becomes visible on the invoice. If your workflows read company documents, [what RAG means in practice](/guides/what-is-rag-explained/) is worth reading before you settle on either platform.
