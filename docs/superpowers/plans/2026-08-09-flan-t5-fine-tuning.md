# Flan-T5-Small Fine-Tuning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fine-tune `google/flan-t5-small` on a generated Q&A dataset about Paul, export it to ONNX, host it on S3, and update the portfolio AI worker to fetch from S3.

**Architecture:** A self-contained Python project in `training/` generates a Q&A dataset from structured bio facts, fine-tunes the base flan-t5-small model, exports it to ONNX for browser compatibility, and uploads it to a public S3 bucket. The portfolio worker is then updated to fetch from S3 instead of HuggingFace Hub.

**Tech Stack:** Python 3.10+, PyTorch, HuggingFace `transformers`, `datasets`, `optimum`, `boto3`, `pytest`

---

### Task 1: Set Up the Python Environment

**Files:**
- Create: `training/requirements.txt`
- Create: `training/.gitignore`

**Why:** Python ML projects need isolated environments to avoid dependency conflicts. The `.gitignore` keeps large generated artifacts (trained model, ONNX files) out of git.

- [ ] **Step 1: Create the `training/` directory and navigate into it**

```powershell
mkdir training
cd training
```

- [ ] **Step 2: Create `training/requirements.txt`**

```
torch
transformers
datasets
optimum[exporters]
boto3
sentencepiece
pytest
```

Each package's role:
- `torch` — PyTorch, the deep learning framework that runs the model
- `transformers` — HuggingFace library with flan-t5 model + `Seq2SeqTrainer`
- `datasets` — HuggingFace library to load and tokenize your Q&A data into a format the trainer understands
- `optimum[exporters]` — converts the trained PyTorch model into ONNX format for browser use
- `boto3` — AWS Python SDK for uploading files to S3
- `sentencepiece` — required by the flan-t5 tokenizer to split text into tokens
- `pytest` — test runner

- [ ] **Step 3: Create `training/.gitignore`**

```
venv/
output/
onnx/
dataset.json
__pycache__/
*.pyc
.pytest_cache/
```

`output/` and `onnx/` are gigabytes of model weights — never commit them.

- [ ] **Step 4: Create and activate a virtual environment**

```powershell
python -m venv venv
.\venv\Scripts\activate
```

You should see `(venv)` in your prompt. This isolates your ML dependencies from the rest of your system.

- [ ] **Step 5: Install dependencies**

```powershell
pip install -r requirements.txt
```

This will take a few minutes. PyTorch alone is ~1GB.

- [ ] **Step 6: Verify the install**

```powershell
python -c "import torch; import transformers; import optimum; print('OK')"
```

Expected output: `OK`

- [ ] **Step 7: Commit**

```bash
git add training/requirements.txt training/.gitignore
git commit -m "feat: add training environment setup"
```

---

### Task 2: Define Bio Facts (`training/facts.py`)

**Files:**
- Create: `training/facts.py`
- Create: `training/tests/__init__.py`
- Create: `training/tests/test_facts.py`

**Why:** Instead of one big blob of text, we break the bio into individual facts with a `category` label. This lets the dataset generator apply the right question templates to each fact. Think of it as the "ground truth" — if you want the AI to know something new, you add it here.

- [ ] **Step 1: Create `training/tests/__init__.py`** (empty file, makes the folder a Python package)

```powershell
mkdir tests
New-Item tests/__init__.py -Type File
```

- [ ] **Step 2: Write the failing test in `training/tests/test_facts.py`**

```python
from facts import FACTS, CATEGORIES

def test_facts_is_list_of_dicts():
    assert isinstance(FACTS, list)
    assert len(FACTS) >= 10

def test_each_fact_has_required_keys():
    for fact in FACTS:
        assert 'category' in fact, f"Missing 'category' in {fact}"
        assert 'answer' in fact, f"Missing 'answer' in {fact}"
        assert isinstance(fact['category'], str)
        assert isinstance(fact['answer'], str)
        assert len(fact['answer']) > 0

def test_all_categories_are_known():
    known = set(CATEGORIES.keys())
    for fact in FACTS:
        assert fact['category'] in known, f"Unknown category: {fact['category']}"
```

- [ ] **Step 3: Run the test — it should fail**

```powershell
pytest tests/test_facts.py -v
```

Expected: `ImportError: No module named 'facts'`

- [ ] **Step 4: Write `training/facts.py`**

```python
CATEGORIES = {
    'identity':         'Who Paul is and where he lives',
    'education':        'School and expected graduation',
    'skills':           'Technical skills and stack',
    'projects':         'Projects Paul has built',
    'competitions':     'Hackathons and math olympiads',
    'extracurriculars': 'Sports and scouting',
    'contact':          'How to reach Paul',
    'goals':            'What Paul wants to build and achieve',
}

FACTS = [
    # Identity
    {'category': 'identity', 'answer': 'Paul Jison is a full-stack software developer.'},
    {'category': 'identity', 'answer': 'Paul Jison lives in Davao City, Philippines.'},
    {'category': 'identity', 'answer': "Paul's timezone is GMT+8."},

    # Education
    {'category': 'education', 'answer': 'Paul is currently attending senior high school.'},
    {'category': 'education', 'answer': 'Paul expects to graduate in May 2028.'},

    # Skills
    {'category': 'skills', 'answer': "Paul's main stack is Next.js, React, TypeScript, and Node.js."},
    {'category': 'skills', 'answer': 'Paul also knows JavaScript, HTML, CSS, and Tailwind CSS.'},
    {'category': 'skills', 'answer': 'Paul has experience with C++, OpenCV, and computer vision.'},

    # Projects
    {'category': 'projects', 'answer': 'Paul built Prep Pilot, a web app that helps students prepare for exams.'},
    {'category': 'projects', 'answer': 'Paul built an Arduino Ecommerce Website for buying and selling Arduino components.'},

    # Competitions
    {'category': 'competitions', 'answer': 'Paul participated in HKIMO, the Hong Kong International Mathematical Olympiad.'},
    {'category': 'competitions', 'answer': 'Paul competes in online hackathons and contributes to open-source projects.'},

    # Extracurriculars
    {'category': 'extracurriculars', 'answer': 'Paul is an active member of the Boy Scouts.'},
    {'category': 'extracurriculars', 'answer': 'Paul is a three-year varsity athlete in soccer and table tennis.'},

    # Contact
    {'category': 'contact', 'answer': 'You can reach Paul at paul.andrei.jison@gmail.com.'},
    {'category': 'contact', 'answer': 'Email paul.andrei.jison@gmail.com to hire or collaborate with Paul.'},

    # Goals
    {'category': 'goals', 'answer': 'Paul wants to build production-quality software and contribute to open-source while still in school.'},
    {'category': 'goals', 'answer': 'Paul is passionate about understanding technology trade-offs to pick the right solution for business needs.'},
]
```

- [ ] **Step 5: Run the test — it should pass**

```powershell
pytest tests/test_facts.py -v
```

Expected:
```
PASSED tests/test_facts.py::test_facts_is_list_of_dicts
PASSED tests/test_facts.py::test_each_fact_has_required_keys
PASSED tests/test_facts.py::test_all_categories_are_known
3 passed
```

- [ ] **Step 6: Commit**

```bash
git add training/facts.py training/tests/
git commit -m "feat: add structured bio facts for dataset generation"
```

---

### Task 3: Generate the Training Dataset (`training/generate_dataset.py`)

**Files:**
- Create: `training/generate_dataset.py`
- Create: `training/tests/test_generate_dataset.py`

**Why:** Each bio fact needs to be paired with multiple question phrasings. A model trained only on "Where is Paul from?" will fail on "What city does Paul live in?" — same underlying fact, different surface form. Generating 3–5 variants per fact teaches the model to handle natural variation in how people ask questions.

The input format matches exactly the prompt template already in your `ai-worker.ts`:
```
Question: <question>
Answer:
```
The model learns to complete that pattern with the correct answer.

- [ ] **Step 1: Write the failing test in `training/tests/test_generate_dataset.py`**

```python
import json
from generate_dataset import generate, save

def test_generate_returns_list():
    pairs = generate()
    assert isinstance(pairs, list)
    assert len(pairs) >= 30

def test_each_pair_has_correct_format():
    pairs = generate()
    for pair in pairs:
        assert 'input' in pair
        assert 'target' in pair
        assert pair['input'].startswith('Question:')
        assert pair['input'].strip().endswith('Answer:')
        assert len(pair['target']) > 0

def test_no_duplicate_inputs():
    pairs = generate()
    inputs = [p['input'] for p in pairs]
    assert len(inputs) == len(set(inputs)), "Duplicate question inputs found"

def test_save_writes_valid_json(tmp_path):
    pairs = generate()
    out = tmp_path / 'dataset.json'
    save(pairs, str(out))
    with open(out) as f:
        loaded = json.load(f)
    assert loaded == pairs
```

- [ ] **Step 2: Run the test — it should fail**

```powershell
pytest tests/test_generate_dataset.py -v
```

Expected: `ImportError: No module named 'generate_dataset'`

- [ ] **Step 3: Write `training/generate_dataset.py`**

```python
import json
from facts import FACTS

# For each category, define 3-5 question templates.
# The question is paired with the matching fact's answer as the target.
TEMPLATES = {
    'identity': [
        'Who is Paul Jison?',
        'What does Paul Jison do?',
        'Where does Paul live?',
        'What city is Paul based in?',
        'Where is Paul from?',
    ],
    'education': [
        'Where does Paul go to school?',
        'What level of education does Paul have?',
        'When does Paul graduate?',
        'What is Paul currently studying?',
        'Is Paul still in school?',
    ],
    'skills': [
        'What technologies does Paul know?',
        "What is Paul's tech stack?",
        'What programming languages does Paul use?',
        'What frameworks does Paul work with?',
        "What are Paul's technical skills?",
    ],
    'projects': [
        'What projects has Paul built?',
        "Can you describe one of Paul's projects?",
        'What has Paul worked on?',
        'What software has Paul created?',
    ],
    'competitions': [
        'Has Paul competed in any competitions?',
        'What hackathons has Paul joined?',
        'What math competitions has Paul entered?',
        'Is Paul involved in competitive programming?',
    ],
    'extracurriculars': [
        'What does Paul do outside of coding?',
        'What sports does Paul play?',
        "What are Paul's hobbies?",
        'Is Paul involved in any clubs or teams?',
    ],
    'contact': [
        "What is Paul's email?",
        'How can I contact Paul?',
        'How do I hire Paul?',
        'How do I reach Paul Jison?',
    ],
    'goals': [
        "What are Paul's goals?",
        'What does Paul want to achieve?',
        'What is Paul working toward?',
        'What motivates Paul?',
    ],
}


def generate() -> list[dict]:
    """
    For every fact in FACTS, emit one Q&A pair per template in that category.
    Input:  "Question: <question>\nAnswer:"
    Target: the fact's answer string.
    Deduplicates inputs so two facts in the same category don't share a question.
    """
    pairs = []
    seen_inputs = set()

    for fact in FACTS:
        category = fact['category']
        answer = fact['answer']
        templates = TEMPLATES.get(category, [])

        for question in templates:
            input_text = f'Question: {question}\nAnswer:'
            if input_text in seen_inputs:
                continue
            seen_inputs.add(input_text)
            pairs.append({'input': input_text, 'target': answer})

    return pairs


def save(pairs: list[dict], path: str = 'dataset.json') -> None:
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(pairs, f, indent=2, ensure_ascii=False)
    print(f'Saved {len(pairs)} Q&A pairs to {path}')


if __name__ == '__main__':
    pairs = generate()
    save(pairs)
```

- [ ] **Step 4: Run the tests — they should pass**

```powershell
pytest tests/test_generate_dataset.py -v
```

Expected:
```
PASSED tests/test_generate_dataset.py::test_generate_returns_list
PASSED tests/test_generate_dataset.py::test_each_pair_has_correct_format
PASSED tests/test_generate_dataset.py::test_no_duplicate_inputs
PASSED tests/test_generate_dataset.py::test_save_writes_valid_json
4 passed
```

- [ ] **Step 5: Generate the actual dataset file**

```powershell
python generate_dataset.py
```

Expected:
```
Saved 35 Q&A pairs to dataset.json
```

- [ ] **Step 6: Inspect the output**

```powershell
python -c "import json; d=json.load(open('dataset.json')); print(d[0]); print(d[-1]); print(len(d), 'total pairs')"
```

Expected:
```
{'input': 'Question: Who is Paul Jison?\nAnswer:', 'target': 'Paul Jison is a full-stack software developer.'}
{'input': 'Question: What motivates Paul?\nAnswer:', 'target': 'Paul is passionate about understanding technology trade-offs...'}
35 total pairs
```

Review the output. If any answers look wrong, fix them in `facts.py` and re-run.

- [ ] **Step 7: Commit**

```bash
git add training/generate_dataset.py training/tests/test_generate_dataset.py
git commit -m "feat: add dataset generator with question templates"
```

---

### Task 4: Fine-Tune the Model (`training/train.py`)

**Files:**
- Create: `training/train.py`

**Why this is the core of ML training:** The script does four things:
1. **Tokenization** — converts text (strings) into numbers (token IDs) the model understands. `max_length=512` is flan-t5-small's input context window.
2. **Train/eval split** — 90% of pairs train the model, 10% evaluate it each epoch so you can see if it's learning or overfitting.
3. **`Seq2SeqTrainer`** — HuggingFace's training loop. It handles the forward pass (model makes a prediction), loss calculation (how wrong was the prediction), and backward pass (adjust weights to be less wrong). This repeats for every batch, every epoch.
4. **Checkpointing** — saves the best model (lowest eval loss) automatically.

**Key terms:**
- **Epoch:** one full pass through all training data
- **Batch size:** how many examples are processed at once before updating weights
- **Learning rate:** how large each weight update step is (too high = unstable, too low = slow)
- **Loss:** a number measuring how wrong the model's predictions are (lower = better)

- [ ] **Step 1: Write `training/train.py`**

```python
import json
import torch
from transformers import (
    T5ForConditionalGeneration,
    T5Tokenizer,
    Seq2SeqTrainer,
    Seq2SeqTrainingArguments,
    DataCollatorForSeq2Seq,
)
from datasets import Dataset

# ── Load dataset ──────────────────────────────────────────────────────────────
with open('dataset.json', encoding='utf-8') as f:
    data = json.load(f)

# 90/10 train/eval split
split_idx  = int(len(data) * 0.9)
train_data = data[:split_idx]
eval_data  = data[split_idx:]

print(f'Train: {len(train_data)} pairs | Eval: {len(eval_data)} pairs')

# ── Load base model and tokenizer ─────────────────────────────────────────────
# google/flan-t5-small is the PyTorch base model (not the ONNX browser version).
# Downloads ~300MB on first run, cached in ~/.cache/huggingface/.
MODEL_NAME = 'google/flan-t5-small'
tokenizer  = T5Tokenizer.from_pretrained(MODEL_NAME)
model      = T5ForConditionalGeneration.from_pretrained(MODEL_NAME)

device = 'cuda' if torch.cuda.is_available() else 'cpu'
print(f'Training on: {device.upper()}')

# ── Tokenize ──────────────────────────────────────────────────────────────────
# The tokenizer turns text into lists of integers (token IDs).
# max_length=512 is flan-t5-small's input limit.
# padding='max_length' pads shorter sequences so all batches are the same shape.
# labels are the target token IDs — the model learns to predict these.
# Padding positions in labels are set to -100 so the loss function ignores them.
def tokenize(batch):
    model_inputs = tokenizer(
        batch['input'],
        max_length=512,
        truncation=True,
        padding='max_length',
    )
    labels = tokenizer(
        batch['target'],
        max_length=128,
        truncation=True,
        padding='max_length',
    )
    label_ids = [
        [(l if l != tokenizer.pad_token_id else -100) for l in lab]
        for lab in labels['input_ids']
    ]
    model_inputs['labels'] = label_ids
    return model_inputs

train_dataset = Dataset.from_list(train_data).map(tokenize, batched=True)
eval_dataset  = Dataset.from_list(eval_data).map(tokenize, batched=True)

train_dataset = train_dataset.remove_columns(['input', 'target'])
eval_dataset  = eval_dataset.remove_columns(['input', 'target'])

# ── Training arguments ────────────────────────────────────────────────────────
# num_train_epochs=5:              five full passes through the training data
# learning_rate=5e-4:              step size for weight updates
# per_device_train_batch_size=8:   process 8 pairs at once before updating
# eval_strategy='epoch':           evaluate on eval set after every epoch
# load_best_model_at_end=True:     keep the checkpoint with lowest eval loss
training_args = Seq2SeqTrainingArguments(
    output_dir='./output',
    num_train_epochs=5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    learning_rate=5e-4,
    eval_strategy='epoch',
    save_strategy='epoch',
    load_best_model_at_end=True,
    predict_with_generate=True,
    logging_steps=5,
    report_to='none',
)

data_collator = DataCollatorForSeq2Seq(tokenizer, model=model, padding=True)

trainer = Seq2SeqTrainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    tokenizer=tokenizer,
    data_collator=data_collator,
)

# ── Train ─────────────────────────────────────────────────────────────────────
print('Starting training...')
trainer.train()

# ── Save ──────────────────────────────────────────────────────────────────────
trainer.save_model('./output')
tokenizer.save_pretrained('./output')
print('Training complete. Model saved to ./output/')
```

- [ ] **Step 2: Run a smoke test (1 epoch, 10 pairs) to verify no errors before full training**

```powershell
python -c "
import json, torch
from transformers import T5ForConditionalGeneration, T5Tokenizer, Seq2SeqTrainer, Seq2SeqTrainingArguments, DataCollatorForSeq2Seq
from datasets import Dataset

with open('dataset.json') as f:
    data = json.load(f)[:10]

tokenizer = T5Tokenizer.from_pretrained('google/flan-t5-small')
model = T5ForConditionalGeneration.from_pretrained('google/flan-t5-small')

def tok(batch):
    inp = tokenizer(batch['input'], max_length=512, truncation=True, padding='max_length')
    lab = tokenizer(batch['target'], max_length=128, truncation=True, padding='max_length')
    inp['labels'] = [[(l if l != tokenizer.pad_token_id else -100) for l in x] for x in lab['input_ids']]
    return inp

ds = Dataset.from_list(data).map(tok, batched=True).remove_columns(['input','target'])
args = Seq2SeqTrainingArguments(output_dir='./output_smoke', num_train_epochs=1, per_device_train_batch_size=2, report_to='none', use_cpu=True)
trainer = Seq2SeqTrainer(model=model, args=args, train_dataset=ds, data_collator=DataCollatorForSeq2Seq(tokenizer, model=model, padding=True))
trainer.train()
print('Smoke test passed.')
import shutil; shutil.rmtree('./output_smoke')
"
```

Expected: `Smoke test passed.` (takes ~30 seconds on CPU)

- [ ] **Step 3: Run full training**

```powershell
python train.py
```

You will see training logs like:
```
Train: 36 pairs | Eval: 4 pairs
Training on: CPU
{'loss': 2.3, 'epoch': 1.0}
{'eval_loss': 1.8, 'epoch': 1.0}
...
Training complete. Model saved to ./output/
```

On CPU this takes 1–2 hours. On GPU, 5–10 minutes. Watch the `eval_loss` decrease each epoch — that's the model learning your facts.

- [ ] **Step 4: Verify the output directory**

```powershell
ls output/
```

Expected files: `config.json`, `tokenizer.json`, `tokenizer_config.json`, `special_tokens_map.json`, `spiece.model`, `pytorch_model.bin` (or `model.safetensors`)

- [ ] **Step 5: Quick inference test to confirm the model answers questions**

```powershell
python -c "
from transformers import pipeline
qa = pipeline('text2text-generation', model='./output', tokenizer='./output')
result = qa('Question: Where does Paul live?\nAnswer:', max_new_tokens=50)
print(result[0]['generated_text'])
"
```

Expected: something like `Paul Jison lives in Davao City, Philippines.`

- [ ] **Step 6: Commit**

```bash
git add training/train.py
git commit -m "feat: add flan-t5-small fine-tuning script"
```

---

### Task 5: Export to ONNX (`training/export_onnx.py`)

**Files:**
- Create: `training/export_onnx.py`

**Why ONNX:** PyTorch models can't run in the browser. ONNX (Open Neural Network Exchange) is a portable format that Transformers.js executes in WebAssembly. The `optimum` library handles the conversion — it traces through the PyTorch model and serializes every operation into a portable graph.

The export produces three separate ONNX files because flan-t5 is a seq2seq model:
- `encoder_model.onnx` — encodes the input question into a vector representation
- `decoder_model.onnx` — generates the first output token from that representation
- `decoder_with_past_model.onnx` — generates subsequent tokens efficiently using a KV cache

- [ ] **Step 1: Write `training/export_onnx.py`**

```python
import subprocess
import sys
from pathlib import Path

OUTPUT_DIR = Path('./output')
ONNX_DIR   = Path('./onnx')

if not OUTPUT_DIR.exists():
    print('ERROR: ./output/ not found. Run train.py first.')
    sys.exit(1)

print(f'Exporting {OUTPUT_DIR} → {ONNX_DIR} ...')

result = subprocess.run(
    [
        sys.executable, '-m', 'optimum.exporters.onnx',
        '--model', str(OUTPUT_DIR),
        '--task', 'text2text-generation',
        str(ONNX_DIR),
    ],
    capture_output=False,
)

if result.returncode != 0:
    print('ONNX export failed.')
    sys.exit(result.returncode)

print('\nExport complete. Files in ./onnx/:')
for f in sorted(ONNX_DIR.rglob('*')):
    if f.is_file():
        size_mb = f.stat().st_size / (1024 * 1024)
        print(f'  {f.relative_to(ONNX_DIR)}  ({size_mb:.1f} MB)')
```

- [ ] **Step 2: Run the export**

```powershell
python export_onnx.py
```

Expected output (sizes approximate):
```
Exporting ./output → ./onnx ...
Export complete. Files in ./onnx/:
  config.json  (0.0 MB)
  decoder_model.onnx  (60.2 MB)
  decoder_with_past_model.onnx  (55.1 MB)
  encoder_model.onnx  (35.4 MB)
  special_tokens_map.json  (0.0 MB)
  spiece.model  (0.8 MB)
  tokenizer.json  (2.2 MB)
  tokenizer_config.json  (0.0 MB)
```

- [ ] **Step 3: Verify all required ONNX files exist with non-zero sizes**

```powershell
python -c "
from pathlib import Path
onnx = Path('./onnx')
required = ['encoder_model.onnx', 'decoder_model.onnx', 'decoder_with_past_model.onnx', 'config.json', 'tokenizer.json']
for name in required:
    f = onnx / name
    assert f.exists() and f.stat().st_size > 0, f'Missing or empty: {name}'
    print(f'{name}: OK ({f.stat().st_size // 1024} KB)')
print('All required ONNX files present.')
"
```

- [ ] **Step 4: Commit**

```bash
git add training/export_onnx.py
git commit -m "feat: add ONNX export script"
```

---

### Task 6: Upload to S3 (`training/upload_s3.py`)

**Files:**
- Create: `training/upload_s3.py`

**Why public-read S3:** The portfolio visitor's browser needs to download the model files directly from a URL. S3 public-read gives any browser GET access without authentication. The CORS policy tells the browser it's allowed to fetch these files from a different origin than your portfolio domain.

- [ ] **Step 1: Create the S3 bucket via AWS Console**

1. Go to AWS Console → S3 → Create bucket
2. Name: `paul-jison-portfolio-models` (must be globally unique — add a suffix if taken)
3. Region: choose closest to your users (e.g. `ap-southeast-1` for Philippines)
4. **Uncheck** "Block all public access" → confirm the warning
5. Create bucket

- [ ] **Step 2: Add CORS policy to the bucket**

In the bucket → Permissions → Cross-origin resource sharing (CORS), paste:

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

- [ ] **Step 3: Configure AWS credentials locally**

```powershell
pip install awscli
aws configure
```

Enter your AWS Access Key ID, Secret Access Key, region (e.g. `ap-southeast-1`), and output format (`json`).

- [ ] **Step 4: Write `training/upload_s3.py`**

```python
import sys
import boto3
from pathlib import Path

BUCKET_NAME = 'paul-jison-portfolio-models'  # change if you used a different name
PREFIX      = 'flan-t5-paul'
ONNX_DIR    = Path('./onnx')

if not ONNX_DIR.exists():
    print('ERROR: ./onnx/ not found. Run export_onnx.py first.')
    sys.exit(1)

s3 = boto3.client('s3')

files = [f for f in ONNX_DIR.rglob('*') if f.is_file()]
print(f'Uploading {len(files)} files to s3://{BUCKET_NAME}/{PREFIX}/')

for file_path in sorted(files):
    key = f"{PREFIX}/{file_path.relative_to(ONNX_DIR).as_posix()}"
    print(f'  {file_path} → {key}')
    s3.upload_file(
        str(file_path),
        BUCKET_NAME,
        key,
        ExtraArgs={'ACL': 'public-read'},
    )

print(f'\nDone. Model accessible at:')
print(f'  https://{BUCKET_NAME}.s3.amazonaws.com/{PREFIX}/config.json')
```

- [ ] **Step 5: Verify credentials and bucket access before uploading**

```powershell
python -c "
import boto3
s3 = boto3.client('s3')
resp = s3.list_buckets()
names = [b['Name'] for b in resp['Buckets']]
print('Your buckets:', names)
assert 'paul-jison-portfolio-models' in names, 'Bucket not found — check name or AWS credentials'
print('Bucket found. Ready to upload.')
"
```

- [ ] **Step 6: Upload the model**

```powershell
python upload_s3.py
```

Expected:
```
Uploading 8 files to s3://paul-jison-portfolio-models/flan-t5-paul/
  onnx/config.json → flan-t5-paul/config.json
  ...
Done. Model accessible at:
  https://paul-jison-portfolio-models.s3.amazonaws.com/flan-t5-paul/config.json
```

- [ ] **Step 7: Verify a file is publicly accessible**

Open this URL in a browser — you should see JSON, not "Access Denied":
```
https://paul-jison-portfolio-models.s3.amazonaws.com/flan-t5-paul/config.json
```

- [ ] **Step 8: Commit**

```bash
git add training/upload_s3.py
git commit -m "feat: add S3 upload script for ONNX model"
```

---

### Task 7: Update the Portfolio Worker

**Files:**
- Modify: `src/workers/ai-worker.ts`

**Why:** `env.remoteHost` tells Transformers.js where to fetch model files from instead of HuggingFace Hub. `env.remotePathTemplate = '{model}/'` makes it construct URLs like `remoteHost + 'flan-t5-paul/' + 'encoder_model.onnx'`. The model ID changes to `flan-t5-paul` matching the S3 prefix. IndexedDB caching, progress events, and inference logic are all unchanged.

- [ ] **Step 1: Open `src/workers/ai-worker.ts` and update the env config block**

Find:
```ts
env.allowLocalModels = false;
env.useBrowserCache = true;
```

Replace with:
```ts
env.allowLocalModels = false;
env.useBrowserCache = true;
env.remoteHost = 'https://paul-jison-portfolio-models.s3.amazonaws.com/';
env.remotePathTemplate = '{model}/';
```

- [ ] **Step 2: Update the model ID in `loadModel()`**

Find:
```ts
generator = await pipeline('text2text-generation', 'Xenova/flan-t5-base', {
```

Replace with:
```ts
generator = await pipeline('text2text-generation', 'flan-t5-paul', {
```

- [ ] **Step 3: Start the dev server and test the AI chat**

```powershell
npm run dev
```

Open `http://localhost:3000`. The "Preparing AI…" pill should count up to 100% as the model downloads from S3. Then ask: "Where does Paul live?" — the model should respond with "Paul Jison lives in Davao City, Philippines."

If you see "Retry AI connection", check:
1. The S3 bucket CORS policy is saved
2. Files have public-read access (open the config.json URL in incognito)
3. `env.remoteHost` URL ends with `/`

- [ ] **Step 4: Clear browser cache and test cold load**

DevTools → Application → IndexedDB → delete `transformers-cache` → reload.

The model should re-download from S3 and work correctly.

- [ ] **Step 5: Commit and push**

```bash
git add src/workers/ai-worker.ts
git commit -m "feat: point AI worker to fine-tuned model on S3"
git push origin main
```

---

## Re-Training Workflow

When you update `facts.py` or add more question templates, re-run the full pipeline:

```powershell
cd training
.\venv\Scripts\activate
python generate_dataset.py
python train.py
python export_onnx.py
python upload_s3.py
```

Visitors with a cached model will use the old version until their IndexedDB cache expires or is cleared.
