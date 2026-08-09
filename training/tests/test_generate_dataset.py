# test_generate_dataset.py — verifies the dataset generator produces valid training data.
#
# WHY TEST THIS:
#   train.py will consume dataset.json without validating it. A malformed dataset
#   (wrong keys, empty targets, duplicate inputs) silently degrades model quality.
#   These tests catch problems before you spend 1-2 hours training on bad data.
#
# RUN WITH:
#   pytest tests/test_generate_dataset.py -v

import json
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from generate_dataset import generate, save


def test_generate_returns_nonempty_list():
    # Must produce at least 30 pairs (one per template, first fact per category).
    pairs = generate()
    assert isinstance(pairs, list)
    assert len(pairs) >= 30, f"Only {len(pairs)} pairs — check TEMPLATES in generate_dataset.py"


def test_each_pair_has_correct_format():
    # train.py expects exactly these two keys with the "Question:/Answer:" format.
    pairs = generate()
    for i, pair in enumerate(pairs):
        assert 'input'  in pair, f"Pair #{i} missing 'input'"
        assert 'target' in pair, f"Pair #{i} missing 'target'"
        # Input must start with "Question:" and end with "Answer:" —
        # this matches the prompt template in ai-worker.ts.
        assert pair['input'].startswith('Question:'), \
            f"Pair #{i} input doesn't start with 'Question:': {pair['input'][:40]}"
        assert pair['input'].strip().endswith('Answer:'), \
            f"Pair #{i} input doesn't end with 'Answer:': {pair['input'][-20:]}"
        assert len(pair['target']) > 0, f"Pair #{i} has empty target"


def test_no_duplicate_inputs():
    # Duplicate questions with different answers give the model contradictory
    # training signal — it learns the last one seen and ignores earlier ones.
    pairs = generate()
    inputs = [p['input'] for p in pairs]
    assert len(inputs) == len(set(inputs)), \
        "Duplicate question inputs detected — deduplication logic may be broken"


def test_save_writes_valid_json(tmp_path):
    # tmp_path is a pytest built-in that gives a clean temp directory per test.
    # Verifies save() writes valid JSON that round-trips back to the same data.
    pairs = generate()
    out_file = tmp_path / 'dataset.json'
    save(pairs, str(out_file))

    with open(out_file, encoding='utf-8') as f:
        loaded = json.load(f)

    assert loaded == pairs, "Saved JSON doesn't match what generate() returned"
