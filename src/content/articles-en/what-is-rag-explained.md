---
title: "What is RAG, explained: how retrieval-augmented generation works in 2026"
description: "What is RAG, explained: how retrieval-augmented generation works, when it beats fine-tuning, the four building blocks and the mistakes that break accuracy."
date: "2026-10-30"
updated: "2026-10-30"
category: "ai-tools"
lang: "en"
tags: ["rag", "vector database", "knowledge base", "ai-tools", "retrieval"]
keywords: ["what is rag", "rag explained", "retrieval augmented generation", "vector database for business", "rag vs fine tuning", "rag for small business"]
featured: false
draft: false
faq:
  - q: "What does RAG actually stand for?"
    a: "Retrieval-augmented generation. The system looks up the relevant passages in your documents first, then asks the model to answer using only those passages."
  - q: "Is RAG better than fine-tuning?"
    a: "For documents that change often and that you must be able to cite, RAG is normally the better fit. Fine-tuning changes the behaviour or format of a model, it is not a document store."
  - q: "How much does a RAG system cost to run?"
    a: "The embedding and generation calls are small next to the work of keeping the index fresh and evaluating the answers. Most of the ongoing cost sits in maintenance rather than model usage."
  - q: "Do I need a vector database to start?"
    a: "No. Postgres with a vector extension is enough for most small teams and avoids running another service to install, monitor and keep alive."
---

RAG stands for retrieval-augmented generation. Before the model answers, your system searches your own documents for the passages that match the question, places those passages in the prompt, and asks the model to answer only from them, with a pointer back to the source. It is the standard way to make a language model useful on your company knowledge without retraining it.

## Why a model needs retrieval in the first place

A language model answers from what it learned during training plus whatever you put in the prompt. It does not know your price list from last quarter, your client contract, or the procedure your team follows when a shipment is late. Left on its own it fills that gap with something plausible, which is the behaviour most people mean when they call it a hallucination.

Three approaches exist for closing the gap. You paste the documents into a long context window. You fine-tune the model on your material. Or you retrieve the relevant passages at question time and let the model work only from those. Each one moves the cost and the risk somewhere else.

Retrieval became the default for business knowledge because the documents change. A handbook, a price list or a policy page is edited by a person on a Tuesday afternoon, and the answer that matters is the answer as of that afternoon. Fine-tuning changes the behaviour of a model; it is not a document store. Retrieval keeps the source of truth in your own systems and adds a pointer to it.

For teams comparing the broader tool landscape, the [tool directory](/tools/) covers the platforms most small businesses end up running, and the [n8n versus Zapier comparison](/guides/n8n-vs-zapier/) matters if you plan to orchestrate retrieval inside a visual workflow builder.

## How to build a RAG system in seven steps

1. **Pick the questions people actually ask.** Write down fifty real questions from support tickets, email threads or meeting notes. These questions become your test set in step seven, and they tell you which documents are worth indexing. If you cannot name the questions, the corpus is too vague to start.

2. **Collect and clean the source documents.** Pull the PDFs, spreadsheets, wikis and internal pages into one place and remove what will never be answered from, such as empty templates and duplicate exports. Every document that enters the corpus becomes a document you have to keep fresh.

3. **Choose the chunk size and the overlap.** A chunk is the unit that gets indexed, usually a section heading plus the paragraphs under it. Splitting a document by a fixed character count cuts tables and policies in half, and a chunk with no overlap loses the sentence that connects two ideas. Start at a section level and adjust after you measure.

4. **Embed the chunks and build the index.** An embedding model converts each chunk into a list of numbers so that similar meaning sits close together. Store those vectors in a [Postgres vector extension](https://www.pgvector.org/) or a dedicated store such as [Pinecone](https://www.pinecone.io/learn/), along with the text, the document id and the source link.

5. **Write the retrieval step.** Convert the question into a vector, search the index, and set a similarity threshold below which you return nothing. Add keyword search alongside the vector search when your corpus is full of product codes, contract numbers and customer names, because hybrid search usually beats vector-only search on that material.

6. **Write the answering prompt with citation and refusal rules.** Tell the model to use only the retrieved passages, to quote the source identifier for every claim, and to answer that the information is not in the documents when the passages do not cover the question. The [guide to writing prompts that work](/guides/how-to-write-prompts-that-work/) covers the instruction patterns that hold up in production.

7. **Build a test set and measure.** Run the fifty questions from step one against the system, check whether the correct passage was retrieved and whether the answer is supported by it, then fix the weakest link. Most of the improvement in a RAG system comes from this loop, not from switching models.

## The four building blocks and what breaks when each one is wrong

| Component | What it does | Typical options | What breaks when it is wrong |
|---|---|---|---|
| Ingestion | Parses, cleans, chunks, embeds and indexes the source material | Document parsers, chunking scripts, embedding APIs | Garbage in the corpus becomes a confident wrong answer |
| Retrieval | Turns the question into a search and returns candidate passages | pgvector, Elasticsearch, OpenSearch, Pinecone, Weaviate, Qdrant | The right passage never reaches the model, so the answer is invented |
| Ranking | Reorders the candidates so the best ones come first | A reranking model, reciprocal rank fusion | Relevant passages sit below irrelevant ones and get cut |
| Generation | Builds the prompt and asks the model to answer from it | A frontier model, a smaller model, a hosted assistant | The model blends retrieved text with what it half-remembers |
| Citation | Carries the passage identifier back to the reader | Metadata in the answer payload | People cannot check the answer, so they stop trusting it |
| Storage and orchestration | Runs the pipeline and keeps the index fresh | n8n, Dify, LangChain, LangSmith, hosted vector stores | The index goes stale and the system answers last quarter |

## How RAG compares with fine-tuning and a long context window

| Dimension | RAG | Fine-tuning | Long context window |
|---|---|---|---|
| Freshness | New document appears once the index refreshes | Needs another training run on the new material | The document is in the prompt, so it is current by definition |
| Citations | Natural, the passage id travels with the answer | Poor, a tuned model rarely points at a source | Possible, but it depends entirely on the prompt |
| Cost | Low per question, maintenance dominates | High setup, then cheap per question | Grows with the size of the document set |
| Effort | Requires an index, a prompt and an evaluation set | Requires examples, training runs and evaluation | Lowest effort of the three |
| Risk of wrong answers | Lower when retrieval is good and the model refuses | Higher, since a tuned model can produce fluent invented facts | Low for a small set, higher once the context gets large |

The practical answer is usually a combination. A long context window handles a small, changing set of documents with no infrastructure at all. Fine-tuning is for changing the tone, the format or the behaviour of a model. Retrieval is for anything where the answer must be current, traceable and drawn from a document you control.

## What a RAG system costs per question

Embedding models are priced in cents per million tokens as of October 2026, which makes the embedding step the cheapest part of the whole pipeline. The expensive part of RAG is rarely the embedding; it is the retrieval quality and the maintenance of the index. Plans change, so the vendor's official pricing page is the source of truth for current rates.

| Step in a request | What happens | Typical time | What it costs in money |
|---|---|---|---|
| Embed the question | The question becomes a vector | Tens of milliseconds | A fraction of a cent with a hosted embedding API |
| Search the index | The vector is compared against the stored chunks | Tens to hundreds of milliseconds | Free with a self-hosted store, billed per query by some hosted ones |
| Rerank the candidates | A second model reorders the shortlist | A few hundred milliseconds | A small extra cost per request |
| Build the prompt | Retrieved passages are assembled with the instructions | Negligible | No direct cost |
| Generate the answer | The model writes the reply and the citations | One to several seconds | The material per-question cost |
| Optional second pass | The answer is checked against the passages | A few seconds | Roughly doubles the generation cost |

A worked example: a support assistant for a 60-person distributor, answering about 400 questions a month against a corpus of policies and price lists. The model calls are a minor line on the monthly invoice. The index refresh, the evaluation set and the time spent correcting answers are the real budget items, which is why the [calculators](/calculators/) help you price the human side before you compare it with a subscription.

## How companies use retrieval in practice

Morgan Stanley has publicly described an assistant for its financial advisors that searches the firm's internal research and knowledge and returns answers with references, and it has been presented in public talks as widely used inside the firm. The interesting part is not the model; it is that the retrieval layer points at a body of research the advisor was already expected to know.

Wiley announced an AI research assistant in 2023 that answers questions across its learning and research content. The catalogue and the platform around it are the corpus, and the citation behaviour is what makes it usable for study rather than for conversation.

Telefónica has described retrieval-based assistants supporting customer service agents at very large interaction volumes, where the assistant drafts an answer from internal material and the agent reviews it. The pattern is the same one most service organisations converge on: the retrieval removes the search, and the human stays in the loop on the tone and the exception. Teams in regulated fields tend to look at the same pattern in the [AI for accounting firms guide](/guides/ai-for-accounting-firms/), where the citation trail matters as much as the answer.

Cisco has also described using retrieval-based assistants to support engineers with internal documentation, and consumer products such as Notion AI and Perplexity answer from a retrieved corpus as well. The difference across all of them is the same: the corpus is the product.

## Common mistakes that break RAG accuracy

- **Chunking by fixed character count.** It cuts tables, clauses and numbered procedures in the middle. Split on document structure instead.
- **No citations.** Without a pointer to the source, nobody can verify the answer and nobody trusts it.
- **No evaluation set.** Without real questions and a score, every change to the prompt is a guess.
- **Vector-only search on a corpus full of codes.** Order numbers, invoice references and product codes need keyword search. Use hybrid retrieval.
- **A stale index.** If the ingestion job stops running, the system keeps answering with old policy. Track the lag between a document change and the answer.
- **Mismatched models.** An embedding model and a ranking model that were trained for different languages or document types quietly degrade each other.
- **A prompt with no escape hatch.** If the model is not allowed to say the information is not in the documents, it will invent something instead.
- **Feeding the whole corpus into the context.** It costs more, slows every request and makes the model read noise.
- **Trusting the first answer.** A cheap second pass that checks each claim against the retrieved passages catches a surprising share of errors.

## What to measure in a RAG system

| Metric | How to measure it | What good looks like |
|---|---|---|
| Retrieval hit rate | Share of test questions where the correct chunk appears in the top results | Above 90 percent on your own questions |
| Grounded answer rate | Share of answers fully supported by the retrieved passages | Above 95 percent |
| Citation correctness | Share of citations that point to the passage backing the claim | Above 95 percent |
| Refusal rate | Share of unanswerable questions where the model correctly declines | Close to 100 percent |
| Cost per question | Monthly spend divided by questions answered | Track the trend, not a target |
| Latency | Time from question to answer | Fast enough that people wait for it |
| Index freshness lag | Time between a document change and it being searchable | Hours, not weeks |
| Human rewrite rate | Share of answers a person had to rewrite before sending | Falling every month |

Review these weekly for the first two months, and keep the test set alive by adding every real question that produced a bad answer. Monitoring in production is a separate discipline, covered in [how to monitor AI agents in production](/guides/how-to-monitor-ai-agents-in-production/).

## Frequently asked questions

**What does RAG actually stand for?** Retrieval-augmented generation. The system looks up the relevant passages in your documents first, then asks the model to answer using only those passages, and returns the source of each claim.

**Is RAG better than fine-tuning?** For documents that change often and that you must be able to cite, RAG is normally the better fit. Fine-tuning changes the behaviour or format of a model, it is not a document store. The comparison table above sets out where each one wins.

**How much does a RAG system cost to run?** The embedding and generation calls are small compared with the work of keeping the index fresh and evaluating the answers. As of October 2026, embedding models are priced in cents per million tokens, so model usage is rarely the largest line. Maintenance time is.

**Do I need a vector database to start?** No. Postgres with a vector extension is enough for most small teams and avoids running another service. Add a dedicated vector store only when the corpus or the query volume outgrows what your database handles.

## Where to go next

Start with fifty real questions and the documents that answer them, because a small evaluated corpus beats a large unmeasured one. Once retrieval works, add the permissions and approval steps that keep an agent honest, which is covered in [how to guardrail AI agents](/guides/how-to-guardrail-ai-agents/), and then connect the answers to a process that has an owner, such as the pipeline described in [how to build a CRM pipeline](/guides/how-to-build-a-crm-pipeline/).
