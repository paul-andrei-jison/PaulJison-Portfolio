# test_facts.py — verifies that facts.py is well-formed before we generate training data.
#
# WHY TEST THIS:
#   generate_dataset.py blindly trusts FACTS. If a fact has a typo in 'category',
#   or 'answer' is empty, the generated dataset will be silently wrong — and training
#   on wrong data produces a wrong model. Catching it here is much cheaper.
#
# RUN WITH:
#   pytest tests/test_facts.py -v

import sys
import os

# Add training/ to the path so pytest can import facts.py directly.
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from facts import FACTS, CATEGORIES


def test_facts_is_nonempty_list():
    # Must have at least 10 facts — fewer means too little training data.
    assert isinstance(FACTS, list)
    assert len(FACTS) >= 10, f"Only {len(FACTS)} facts — add more"


def test_each_fact_has_required_keys():
    # Every fact must have non-empty 'category' and 'answer' strings.
    # Missing or empty values cause silent failures in generate_dataset.py.
    for i, fact in enumerate(FACTS):
        assert 'category' in fact, f"Fact #{i} missing 'category': {fact}"
        assert 'answer'   in fact, f"Fact #{i} missing 'answer': {fact}"
        assert isinstance(fact['category'], str) and len(fact['category']) > 0, \
            f"Fact #{i} has empty 'category'"
        assert isinstance(fact['answer'], str) and len(fact['answer']) > 0, \
            f"Fact #{i} has empty 'answer'"


def test_all_categories_are_known():
    # A typo like 'identiy' instead of 'identity' means no templates match
    # that fact — it silently produces zero training pairs for it.
    known = set(CATEGORIES.keys())
    for fact in FACTS:
        assert fact['category'] in known, \
            f"Unknown category '{fact['category']}' — must be one of: {sorted(known)}"


def test_categories_dict_is_nonempty():
    assert isinstance(CATEGORIES, dict)
    assert len(CATEGORIES) >= 5
