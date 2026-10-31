---
title: "How to write prompts that work: a repeatable structure for reliable output"
description: "How to write prompts that work in 2026: the six-part structure, a step-by-step method, evaluation before and after, and the mistakes that break quality."
date: "2026-10-30"
updated: "2026-10-30"
category: "ai-tools"
lang: "en"
tags: ["prompting", "ai-tools", "evaluation", "productivity", "llm"]
keywords: ["how to write prompts that work", "prompt engineering for business", "prompt structure", "prompt examples for teams", "how to test prompts"]
featured: false
draft: false
faq:
  - q: "What is the shortest prompt structure that works?"
    a: "Task, context, constraints and output format. Add a worked example and an audience only when those first four still produce inconsistent results across your test cases."
  - q: "How do I know a prompt is good?"
    a: "You need a small fixed set of real cases, a pass-or-fail rule and a baseline to compare against. Without those, a rewrite often reads better without being measurably better."
  - q: "Should I write one long prompt or several small ones?"
    a: "One prompt per deliverable. Split the work when the output feeds another step, because long multi-task prompts tend to fail silently in the middle."
  - q: "Does a longer prompt always work better?"
    a: "No. Length helps when it adds concrete context, examples or constraints, and hurts when it repeats the same instruction in different words."
---

How to write prompts that work comes down to a structure you can repeat: a task, the context the model cannot see, the constraints, the output format, and one worked example. Add a test set of ten to twenty real cases and you can tell whether a change helped. What follows is that structure, a method for building a prompt, and the mistakes that most often break output quality.

## Why prompt structure matters more than prompt tricks

The guidance published by Anthropic, OpenAI and Google converges on the same core ideas. Give the model a role and a task, supply the context it cannot access on its own, state the constraints, and specify the output format. Anthropic's [prompt engineering overview](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) recommends structuring long prompts with clearly delimited sections and asking the model to think before it answers. Google's [prompting strategies guide](https://ai.google.dev/gemini-api/docs/prompting-strategies) documents a similar set of techniques, including separating the instructions from the content they apply to, and OpenAI's [prompt engineering guide](https://platform.openai.com/docs/guides/prompt-engineering) covers the same ground from the API side.

Two shifts have made structured prompts easier to write than they were. Structured output, in the form of JSON schema or typed responses, is now standard across the major APIs, so most of the formatting drift that once required long paragraphs about output format is handled by the request itself. Prompt caching is also available on the major APIs and reuses a shared prefix, so a long fixed system prompt costs far less after the first call than the sticker price suggests.

The practical consequence for a business is that prompt writing is now a maintenance task rather than a craft. A prompt is a piece of configuration that someone owns, that runs on real inputs, and that you check when the output changes. Teams that treat it that way stop rewriting prompts from memory and start changing them against evidence.

## The six parts of a prompt that holds up

| Element | What it does | Weak version | Strong version |
|---|---|---|---|
| Task | States the one job to be done | "Help with invoices" | "Draft a reply to a customer disputing invoice 1042" |
| Context | Supplies what the model cannot see | Nothing | "Our standard terms allow a 30-day credit; the customer's contract says 14 days" |
| Inputs | Marks the variable material | "The text below" | "Customer email: <email> Invoice total: <total>" |
| Constraints | Sets the limits and prohibitions | "Be professional" | "Max 120 words, no discount offers, do not mention internal codes" |
| Output format | Fixes the shape of the answer | "Answer briefly" | "Three bullets, each under 15 words, most important first" |
| Worked example | Shows the standard | Nothing | A single labelled sample of a good reply |
| Edge case | Names the failure you expect | Nothing | "If the order number is missing, reply that the email needs the order reference" |

The last two rows are what separate a prompt that works on the example you tested with from one that works on Tuesday afternoon. A worked example is more compact than a paragraph of description, and an edge case line is cheaper than handling the failure manually every time it appears.

## A repeatable method for writing a prompt that works

1. **Start from the output specification, not the request.** Write what a finished output looks like before you write anything for the model. If you cannot describe the output in a format a colleague could check, the task is not defined yet.
2. **State the audience and the purpose.** Say who reads the result and what they do with it. The same content needs a different framing for a customer, a colleague and a regulator.
3. **Add the context the model does not have.** Company policy, the account history, the definition of your terms, the tone you actually want. This is usually the longest part of a useful prompt, and the part people cut first.
4. **Set the constraints and the prohibitions.** Length, language, what to avoid, what to do when the information is missing. Explicit prohibitions beat vague requests for tone.
5. **Fix the output format.** Use the structured output feature of the API where you can. Where you cannot, name the format in the prompt and give one example of the shape.
6. **Give one worked example.** One is usually enough. It anchors length, register and level of detail better than three paragraphs of description.
7. **Build a test set of ten to twenty real cases.** Use cases you have actually handled, including the two or three that historically went wrong. Keep the set fixed, so the results are comparable.
8. **Iterate one variable at a time.** Change the context, or the constraints, or the example, never two together. Otherwise you cannot attribute the result, and you will keep a rule in the prompt that does nothing.

Run the same set before and after every change. Our guide to [monitoring AI agents in production](/guides/how-to-monitor-ai-agents-in-production/) covers the log fields that make those comparisons visible later.

## The six-step method shown on one business task

| Part of the method | Weak prompt | Strong prompt |
|---|---|---|
| Task | "Summarise this meeting" | "Summarise this meeting for the account team" |
| Context | "Meeting notes below" | "The account team does not know the customer's deployment history; include dates" |
| Inputs | "Notes: <notes>" | "Notes: <notes> CRM status: <status>" |
| Constraints | "Make it short" | "Max 100 words, English, name the date of every commitment" |
| Output format | "Give me the key points" | "Three bullets: decision, owner, next action, each with a date" |
| Example or edge case | Nothing | "If no decision was reached, write No decision recorded" |

Read the weak column and notice what it lacks: it has a verb, but no audience, no limit, no shape. The model has to guess all three, and it guesses differently on Tuesday than on Monday. The strong column removes the guesses without adding length for its own sake.

The same structure applies when the output feeds another step, such as a support reply that becomes a CRM update or a summary that becomes a briefing note. Our guide to [building a CRM pipeline](/guides/how-to-build-a-crm-pipeline/) covers that chain, and [AI automation for HR and recruiting](/guides/ai-automation-for-hr-recruiting/) shows it applied to screening and scheduling.

## How teams are standardising prompts in practice

The pattern of separating instructions from content is not confined to API developers. GitHub Copilot supports repository-level custom instruction files, so a team can standardise prompts inside the repository instead of repeating them in every request. Notion AI lets users save their own prompts and reuse them inside the workspace, which makes shared prompt storage a normal part of an existing tool rather than a new project.

Jasper and Copy.ai built their products around reusable prompt templates for specific formats, which is why template libraries exist as a category at all. Shopify announced general availability of Sidekick, an assistant embedded in the merchant admin for paid plans, which puts an AI layer next to the operational data rather than in a separate chat window. Duolingo has publicly described rolling AI features out to its subscribers and using AI to scale content production. Klarna has said its AI assistant handled a large share of first-line customer service chats in 2024. The specific figures vary by company and change over time, but the direction is consistent across them: prompts are becoming shared configuration that teams maintain, not text that individuals type.

## Common mistakes that break output quality

- **Role-play without a purpose.** Asking for a persona produces a voice, not a useful result. Say what the output is for.
- **Vague verbs.** Improve, handle, deal with and summarise give the model nothing to calibrate against. Replace them with a concrete verb and an object.
- **No output format.** Without one, the model chooses the shape, and the shape changes between runs. Use structured output where the API offers it.
- **Instructions buried in the middle of pasted content.** Instructions placed after a long block of source material are followed less reliably. Put instructions first, delimit the content clearly, and repeat nothing.
- **Changing five things at once.** When the output improves, you do not know which change did it, and you cannot keep the useful part.
- **No test set.** If you cannot show that the new version is better on real cases, you are not improving, you are rewriting.
- **No versioning.** A prompt without a version number cannot be compared with the one running in production, and a silent change to a live prompt is how quality drops without anyone noticing.
- **Letting the model invent facts.** When the answer depends on your documents, retrieve it rather than expecting recall. [What RAG means in practice](/guides/what-is-rag-explained/) covers the retrieval approach, and [guardrails for AI agents](/guides/how-to-guardrail-ai-agents/) covers the limits you can enforce around it.
- **Encoding the answer instead of the method.** A prompt that hard-codes the expected result teaches nothing and breaks on the next variation. Write the rule, not the output.

## What to measure after a prompt goes live

- **First-pass acceptance rate.** The share of outputs a person uses without rewriting. This is the headline number.
- **Average edit distance from the raw output.** How much a person changes before sending. It catches the near-misses that acceptance rate rounds away.
- **Tokens per task.** The input side tells you whether the context section is padded, which is where prompt caching pays back.
- **Cost per task.** Total spend divided by finished outputs, including retries.
- **Latency.** Time to first output and total time per call, especially for anything a customer waits on.
- **Escalation rate to a human.** The share of cases routed to a person, which shows where the prompt is still under-specified.
- **Share of outputs rejected by review.** Distinct from acceptance rate, because a rejected output may still have been read and discussed.

Review these weekly against your test set, and re-run the set whenever a model version changes under you, since the same prompt can behave differently on a new release.

## Frequently asked questions

**What is the shortest prompt structure that works?** Task, context, constraints and output format. Those four cover most business use, and they are enough when the output is simple and the format is enforced by the API. Add a worked example and an audience only when the first four still produce inconsistent results across your test cases. Longer prompts are not automatically better, because repeated instructions tend to dilute each other.

**How do I know a prompt is good?** You need three things: a small fixed set of real cases, a rule for pass or fail, and a baseline to compare against. Without a fixed set, every change looks like an improvement because you are reading new outputs rather than comparing old ones. Without a pass-or-fail rule, the decision stays a matter of opinion. With those in place, a rewrite is a measurable change, and you can tell whether the effort paid off.

**Should I write one long prompt or several small ones?** One prompt per deliverable. Split the work when the output of one step feeds another, for example summarising a call and then drafting the follow-up, because long prompts with several tasks tend to fail quietly in the middle, where the model handles the first request well and quietly drops the rest. Smaller prompts are also cheaper to test, since each one has a clear output to check.

**Does a longer prompt always work better?** No. Length helps when it adds concrete context, an example, or a constraint the model did not know. Length hurts when it repeats the same instruction in different words, when it buries the instruction under source material, or when the extra tokens are paid for on every call. The useful measure is not the token count but how many test cases pass.

## Next steps

Take one prompt your team uses today and rebuild it with the six parts above, then run it against ten real cases before and after. The [tool directory](/tools/) lists the editors and clients where you can keep those prompts, and the [comparison hub](/comparisons/) covers where the automation around them should live. If you want to see the same structural thinking applied to the plumbing, [n8n vs Zapier](/guides/n8n-vs-zapier/) works through the equivalent cost question for workflow builders.
