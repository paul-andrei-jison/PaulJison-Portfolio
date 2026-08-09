# Flan-T5-Small Fine-Tuning — Design Spec

**Date:** 2026-08-09  
**Status:** Approved

---

## Overview

Fine-tune `google/flan-t5-small` on a generated Q&A dataset about Paul Jison, export the trained model to ONNX for browser use, host it on AWS S3, and update the portfolio AI worker to fetch from S3. The goal is both a smarter in-browser AI and a hands-on learning experience covering every step of the ML training pipeline.

---

## Goals

- Fine-tune flan-t5-small to answer questions about Paul more accurately than bio-context prompting alone.
- Learn the full ML pipeline: data generation → training → ONNX export → cloud deployment.
- Keep the zero-server-cost in-browser architecture — model runs entirely in the visitor's browser.
- All training code is written by Paul, not generated — the plan is step-by-step instructional.

---

## Non-Goals

- No LLM-generated training data — dataset is template-based from structured bio facts.
- No server-side inference.
- No multi-turn conversation memory.

---

## Architecture

```
Phase 1 — Training (local Python)
  training/generate_dataset.py  →  training/dataset.json
  training/train.py             →  training/output/ (fine-tuned PyTorch model)
  training/export_onnx.py       →  training/onnx/ (ONNX model + tokenizer files)

Phase 2 — Deploy (AWS)
  training/upload_s3.py         →  S3 bucket (public-read, CORS-enabled)

Phase 3 — Integration (Next.js)
  src/workers/ai-worker.ts      →  updated to fetch model from S3
```

All training code lives in `training/` at the repo root — a self-contained Python project with its own `requirements.txt`, completely separate from the Next.js app.

---

## Files

| File | Role |
|---|---|
| `training/requirements.txt` | Python dependencies |
| `training/facts.py` | Structured bio facts (name, location, skills, projects, etc.) |
| `training/generate_dataset.py` | Applies question-template banks to facts → `dataset.json` |
| `training/dataset.json` | Generated training data (200–400 Q&A pairs) |
| `training/train.py` | Fine-tunes `google/flan-t5-small` via `Seq2SeqTrainer` |
| `training/export_onnx.py` | Exports fine-tuned PyTorch model to ONNX via `optimum` |
| `training/upload_s3.py` | Uploads `onnx/` folder to S3 with public-read ACL |
| `src/workers/ai-worker.ts` | Updated: `env.remoteHost` points to S3, model ID = `flan-t5-paul` |

---

## Dataset Generation

`facts.py` holds the bio as structured Python data:

```python
FACTS = [
    { "category": "identity", "answer": "Paul Jison is from Davao City, Philippines." },
    { "category": "education", "answer": "Paul is currently in senior high school, graduating May 2028." },
    { "category": "skills", "answer": "Paul's stack includes Next.js, React, TypeScript, Node.js, and C++." },
    # ...
]
```

`generate_dataset.py` applies a template bank per category. Each fact gets 3–5 question phrasings:

```python
TEMPLATES = {
    "identity": [
        "Where is Paul from?",
        "What city does Paul live in?",
        "Where does Paul Jison live?",
    ],
    # ...
}
```

Output format (one entry per Q&A pair):

```json
[
  { "input": "Question: Where is Paul from?\nAnswer:", "target": "Paul Jison is from Davao City, Philippines." },
  { "input": "Question: What city does Paul live in?\nAnswer:", "target": "Paul Jison is from Davao City, Philippines." }
]
```

The dataset is saved to `training/dataset.json`.

---

## Fine-Tuning

**Script:** `training/train.py`  
**Base model:** `google/flan-t5-small` (77M parameters, PyTorch)  
**Trainer:** HuggingFace `Seq2SeqTrainer`

Key hyperparameters:
- Epochs: 5
- Learning rate: `5e-4`
- Batch size: 8
- Output: `training/output/`

The script auto-detects CPU vs GPU via `torch.cuda.is_available()`. On CPU: ~1–2 hours for a 300-pair dataset. On GPU: ~5–10 minutes.

---

## ONNX Export

**Script:** `training/export_onnx.py`  
**Library:** `optimum`

Runs:
```bash
optimum-cli export onnx --model ./output/ --task text2text-generation ./onnx/
```

Output files in `training/onnx/`:
- `encoder_model.onnx`
- `decoder_model.onnx`
- `decoder_with_past_model.onnx`
- `config.json`, `tokenizer.json`, `tokenizer_config.json`, `special_tokens_map.json`

These are the exact files Transformers.js needs to run inference in the browser.

---

## AWS S3 Hosting

**Script:** `training/upload_s3.py`  
**Library:** `boto3`

Steps:
1. Create S3 bucket (e.g. `paul-jison-portfolio-models`) in any region.
2. Enable public-read access (disable "Block all public access").
3. Add CORS policy allowing `GET` from `*`.
4. Run `upload_s3.py` — uploads every file in `onnx/` to `flan-t5-paul/` prefix.

After upload, files are accessible at:
```
https://<bucket>.s3.<region>.amazonaws.com/flan-t5-paul/encoder_model.onnx
https://<bucket>.s3.<region>.amazonaws.com/flan-t5-paul/config.json
...
```

### S3 CORS Policy

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

---

## Portfolio Integration

`src/workers/ai-worker.ts` changes:

```ts
// Replace HuggingFace Hub source with S3
env.remoteHost = 'https://<bucket>.s3.<region>.amazonaws.com/';
env.remotePathTemplate = '{model}/';

generator = await pipeline('text2text-generation', 'flan-t5-paul', { ... });
```

Transformers.js constructs file URLs as `remoteHost + model + '/' + filename`. Browser IndexedDB caching continues to work unchanged — first visit downloads from S3, subsequent visits load from cache in ~0.5s.

Model size reverts to ~80MB (from `flan-t5-base`'s ~250MB).

---

## AWS Training (Later Phase)

When ready to train on AWS:
1. Launch an EC2 `g4dn.xlarge` instance (NVIDIA T4 GPU, ~$0.53/hr).
2. Clone the repo, `pip install -r training/requirements.txt`.
3. Run `python train.py` — same script, GPU auto-detected, completes in ~5–10 min.
4. Run `python export_onnx.py` and `python upload_s3.py` on the instance.
5. Terminate the instance.

No script changes needed between local and AWS runs.

---

## Dependencies

```
# training/requirements.txt
torch
transformers
datasets
optimum[exporters]
boto3
```

No changes to the Next.js `package.json`.
