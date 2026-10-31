---
title: "AI for accounting firms: 8 tasks to automate and 8 rules in 2026"
description: "AI for accounting firms in 2026: the tasks worth automating, the review step that keeps you accountable, client data rules and the metrics to track."
date: "2026-10-30"
updated: "2026-10-30"
category: "finance"
lang: "en"
tags: ["accounting", "audit", "ai-agents", "compliance", "finance"]
keywords: ["ai for accounting firms", "ai in accounting", "automation for accountants", "ai audit tools", "ai tax research"]
featured: false
draft: false
faq:
  - q: "Can an AI tool sign off on a tax position?"
    a: "No. The output of a model is a draft that a qualified professional reviews and owns, and the file needs to show who did the review."
  - q: "Is it safe to upload client documents to an AI tool?"
    a: "Only when the vendor's data terms, retention policy and training use are acceptable for that client and the firm's own confidentiality rules allow it. Check the engagement terms before uploading."
  - q: "Which part of a firm's work pays back first?"
    a: "Document intake, extraction and reconciliation, because they are high volume, low judgement and easy to measure against a baseline."
  - q: "Do clients accept AI-assisted work?"
    a: "More and more firms disclose it in engagement letters, and clients generally object to silence rather than to the tool itself."
---

AI for accounting firms is worth adopting in 2026 for a narrow set of high-volume work: document intake, extraction, bank reconciliation, classification, chase lists and first-pass review notes. It is not worth adopting for materiality decisions, unusual items, tax positions or sign-off. Whatever produces the draft, the accountant stays responsible for the work and for the conclusion, and an AI output is not tax or audit advice.

## Why the profession treats AI as an assistant rather than a colleague

Across the major bodies, AICPA, ACCA, ICAEW and their equivalents, the rule is consistent: the accountant remains responsible for the work and for the conclusion, whatever produced the draft. A review step belongs to the deliverable, not to a policy document that nobody reads in a busy week.

The reason is structural rather than technical. Liability attaches to a person and a firm, not to a model. A model can draft a memo in seconds, and it cannot be interviewed by a regulator, named on the file, or asked what it meant by a number it produced. The [AICPA technology resource library](https://www.aicpa-cima.com/resources/landing/technology/) is where firms usually start looking for the profession's current guidance on software and audit data.

A second constraint shapes how the tools are used. Audit standards require evidence over the population: a stated share of items has to be tested with supporting documentation. That is why AI is normally used to select and rank items for review, pointing a human at what deserves attention, rather than to replace the sampling logic with a claim that everything was checked.

## Where a model helps and where the accountant stays

The dividing line is judgement. High-volume, low-judgement work goes to the model, and anything that carries a professional opinion stays with a qualified person. Document intake, extraction and reconciliation usually pay back first, because they are high volume, low judgement and easy to measure against a baseline. The table below sets out where the line usually falls in a mid-sized practice.

| Task | What AI does | What the accountant still owns | Review control | Evidence to keep |
|---|---|---|---|---|
| Invoice and receipt extraction | Reads the document and populates the fields | The interpretation of an unusual line item | Exception flag above a stated threshold | Source document, extracted values, sample check |
| Bank reconciliation | Matches transactions against the ledger and proposes adjustments | Whether to post an adjustment and its materiality | Reconciliation report reviewed and signed | Export of matches and the unmatched list |
| Document classification | Sorts files by client, period and statement type | The filing decision on anything ambiguous | Routing rules with a manual override log | Classification log for the period |
| Chase lists | Drafts reminders ranked by age and amount | The tone and the decision to escalate | Approval before any client contact is sent | The list as it stood before sending |
| Meeting notes into working papers | Turns a call transcript into a structured draft | The accuracy of the converted content | Reviewer compares the draft against the transcript | Transcript, draft and reviewer note |
| First-pass review notes | Flags items and drafts a note for each | The materiality threshold and every conclusion | File shows the open points and who closed them | List of flags and the disposition of each |
| Client question routing | Sends each incoming question to the right person | The answer that reaches the client | Routing log plus the final answer | Ticket with the assigned owner |
| Standard client communication | Drafts a routine letter or email | The facts stated and the signature | Sign-off before sending | Final sent version and the approver |

## The client data questions to settle before anything is uploaded

Client material is confidential by default, and the answers that decide whether a document may leave the firm live in vendor terms rather than in marketing pages. Ask these questions before the pilot and record the answers in the file.

| Data question | Why it matters | What to ask the vendor | An acceptable answer |
|---|---|---|---|
| Where is the data stored | Determines which privacy and secrecy rules apply | In which countries are servers and backups located | A written list of storage and backup regions |
| Does the data train vendor models | Client material could end up inside a shared model | Are inputs used to train or improve any model | No training by default, opt-in only under separate terms |
| How long is it retained | Retention sets the size of the exposure if terms change | What is the retention period for prompts, outputs and backups | A stated period with deletion on request |
| Is there a data processing agreement | It defines the legal basis and the roles | Can you sign a DPA and under what terms | A signed DPA covering sub-processors |
| Which subcontractors are involved | A sub-processor abroad inherits the data | Which sub-processors handle the data and where are they based | A current list published in the agreement |
| Does the firm's insurance cover it | A professional indemnity policy may exclude some uses | Does the policy cover third-party AI tooling on client data | Written confirmation from the insurer or broker |
| Does the engagement letter allow it | The client contract governs what may be shared | Do the engagement terms permit third-party tools | Client consent recorded in the engagement letter |

As of October 2026 the commercial terms differ sharply between vendors: some include an assistant in the existing platform subscription, others price it per seat or by usage, and the usage-based model is what turns an uncontrolled task into an expensive one. Plans change and the vendor's official pricing page is the source of truth for what a given firm will pay.

## How to introduce a first automation that holds up under review

1. **Pick one task with a measurable baseline.** Choose document intake or bank reconciliation, not a mixed mandate. Write down the current hours per engagement and the current error rate before any tool is bought, because without a baseline there is nothing to compare the pilot against and the savings claim becomes a matter of opinion.

2. **Define who is accountable for the output.** Name the person who signs the deliverable and the person who reviews the draft. If nobody can be named, the task is not ready to automate.

3. **Set the data boundary.** Decide what may leave the firm and what may not. Client names, account numbers and payroll figures sit on one side of that line, anonymised samples on the other, and the boundary belongs in the firm's written policy rather than in the habits of whoever runs the prompt.

4. **Choose the tooling and check the data processing terms.** Run the seven questions from the table above against the vendor and against the alternative you are not choosing. If the answers are vague, the answer is no for now.

5. **Build the review step into the workflow, not as an intention.** The draft should be blocked from reaching the client until a named reviewer approves it, and the system should record that approval. A review step that exists only in a written policy is not a control, it is a hope.

6. **Require citations on every factual claim.** Every statement in a generated note should point to the page, paragraph or rule reference it came from. Where the model has to look up material it does not hold, retrieval from the firm's own library is the mechanism, and [what is RAG explained](/guides/what-is-rag-explained/) covers how that works.

7. **Pilot on a sample of past work and compare with the human result.** Take completed files from the same client and period, run them through the tool, and compare the output with what the team produced. Measure the correction rate and read the corrections, because the corrections tell you what the prompt is missing.

8. **Write the firm's AI policy and update engagement letters.** The policy records the data boundary, the review requirement and the documentation rules. The engagement letter tells the client what is used and on what terms, because clients generally object to silence rather than to the tool itself.

## What the large firms and the software vendors have actually shipped

The adoption pattern in the profession shows up in public announcements rather than in independent benchmarks, and the announcements are specific enough to be checked.

- Baker Tilly has publicly described deploying Harvey across audit and tax work.
- Grant Thornton announced a partnership with Harvey in 2024 around tax controversy work.
- Crowe launched its own AI tool for audit work in 2024.
- KPMG rolled out Clara for Tax and Legal in 2024.
- Moore announced an AI platform for audit and accounting in 2024.
- RSM has launched a set of AI-enabled tools for audit and tax.
- Deloitte has used AI in tax dispute work, including a tax chatbot for its own professionals.
- Intuit acquired Basis AI in 2025 and has shipped AI agents inside QuickBooks for categories such as receipts, invoices and cash flow.
- Bill.com and Sage sell AI agents aimed at accounts payable, while Wolters Kluwer and Thomson Reuters add AI search on top of tax and accounting content.

The pattern across those announcements is consistent. The tools sit on top of existing professional content and existing workflows, and the review step stays with the engagement team. Vendors such as [Harvey](https://harvey.ai/) sell the assistant layer, while the accounting suites sell the workflow layer, so a firm should decide which of the two problems it is solving first.

## Common mistakes that create professional exposure

- **No citations.** A generated tax position without a source looks exactly like research. This is the mistake that turns a drafting aid into a liability.
- **Uploading client data to a tool with unclear retention or training terms.** If the terms are unclear, the data does not go up.
- **Assuming the vendor's data agreement covers international transfers and subcontractors.** A processor list that does not name the regions involved is not a completed answer.
- **Skipping the sample check.** The pilot is the only point where a systematic error in the tool is still cheap to find.
- **Automating judgement calls.** Materiality, unusual items and tax positions need a person who can be held to them.
- **Promising the client savings that cannot be evidenced.** A number in a proposal that the file cannot support is a commitment the firm will have to honour.
- **Failing to document who reviewed what.** If the file does not show the reviewer, the review did not happen as far as an inspector is concerned.
- **Not updating the engagement letter or the firm's policies.** Both documents are where the disclosure belongs.
- **Training a tool on client data without a lawful basis.** Retention and training are separate questions, and the second one usually has the stricter answer.

## What to measure once the pilot is running

Measure ten things and read them together, because most pilots report the first metric and stop there. The pair that matters most is review time against time saved on drafting, since a saving that reappears as review time is not a saving.

| Metric | What it tells you | What a bad reading looks like |
|---|---|---|
| Hours per engagement | Whether the effort actually moved | Baseline hours unchanged after three months |
| Review time | The true cost of the draft | Time saved on drafting reappears as review time |
| Open review points | Whether the review was completed | A rising count at the end of the period |
| Exception rate found by the reviewer | How much the reviewer catches | Near zero, which usually means no review is happening |
| Correction rate after review | Whether the tool is learning or drifting | Corrections stay flat across three cycles |
| Client turnaround time | What the client experiences | No change, or longer once queues build up |
| Staff utilisation | Whether the hours became chargeable work | Time saved and never redeployed |
| Rework rate | The cost of getting it wrong | Rework rises as volume rises |
| Cost per engagement | Whether the arithmetic works | Tool cost per file approaches the value of the hours |
| Share of deliverables with a completed review record | Whether the control is real | Any file missing a reviewer record |

## Frequently asked questions

**Can an AI tool sign off on a tax position?** No. The output of a model is a draft that a qualified professional reviews and owns, and the file needs to show who did that review. An AI output is not tax or audit advice, and the professional rule holds whatever produced the draft.

**Is it safe to upload client documents to an AI tool?** Only when the vendor's data terms, retention policy and training use are acceptable for that client, and the firm's own confidentiality rules allow it. Check the engagement terms before uploading, because the client may have agreed to something narrower than the firm's policy.

**Which part of a firm's work pays back first?** Document intake, extraction and reconciliation, because they are high volume, low judgement and easy to measure against a baseline.

**Do clients accept AI-assisted work?** More and more firms disclose it in engagement letters, and clients generally object to silence rather than to the tool itself. A short disclosure paragraph in the engagement letter covers most of the ground.

## Where to go next

Start with one task, one client and one baseline number, because a narrow pilot that survives review is worth more than a broad programme that cannot be audited. The controls come before the tooling: [how to guardrail AI agents](/guides/how-to-guardrail-ai-agents/) covers permissions and approval steps, [how to write prompts that work](/guides/how-to-write-prompts-that-work/) covers the instruction patterns, and once the assistant runs unattended, [how to monitor AI agents in production](/guides/how-to-monitor-ai-agents-in-production/) covers traces and evaluation sets. The [tool directory](/tools/) lists what is available, and the [comparison hub](/comparisons/) covers the platforms most firms end up comparing.
