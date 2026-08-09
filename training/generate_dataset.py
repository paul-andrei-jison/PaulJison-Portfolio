# generate_dataset.py — builds the training dataset from structured bio facts.
#
# HOW TRAINING DATA WORKS:
#   A language model learns by seeing (input → output) examples.
#   Each example is one Q&A pair:
#     input:  "Question: Where does Paul live?\nAnswer:"
#     target: "Paul Jison lives in Davao City, Philippines."
#
#   The model learns: when you see this input pattern, complete it with the target.
#   Giving the same fact multiple question phrasings (templates) teaches the model
#   to generalise — it won't only recognise the exact wording it was trained on.
#
# WHY DEDUPLICATION:
#   When two facts share the same category, they also share question templates.
#   Without deduplication, the same question would appear twice with different
#   answers — confusing training because the model can't know which is "right".
#   Solution: first fact in each category wins all its templates.
#
# USAGE:
#   python generate_dataset.py    → writes dataset.json
#   from generate_dataset import generate, save   → used in tests

import json
from facts import FACTS

# TEMPLATES maps each category to question phrasings.
# Every question pairs with the first fact of that category as its answer.
# To add more variety: add question strings here.
# To support a new category: add it here AND in CATEGORIES in facts.py.
TEMPLATES: dict[str, list[str]] = {
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
    Pair each question template with the first fact in its category.

    Input format:  "Question: <question>\nAnswer:"
    Target format: the fact's answer string

    The "Answer:" suffix in the input matches the prompt template in
    ai-worker.ts — the model learns to complete exactly that pattern.
    """
    pairs: list[dict] = []
    seen_inputs: set[str] = set()  # prevents duplicate questions

    for fact in FACTS:
        category = fact['category']
        answer   = fact['answer']

        for question in TEMPLATES.get(category, []):
            input_text = f'Question: {question}\nAnswer:'

            # Skip questions already claimed by an earlier fact in this category
            # to avoid contradictory (same question, different answer) pairs.
            if input_text in seen_inputs:
                continue

            seen_inputs.add(input_text)
            pairs.append({'input': input_text, 'target': answer})

    return pairs


def save(pairs: list[dict], path: str = 'dataset.json') -> None:
    """Write pairs to JSON. indent=2 keeps the file human-readable."""
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(pairs, f, indent=2, ensure_ascii=False)
    print(f'Saved {len(pairs)} Q&A pairs to {path}')


if __name__ == '__main__':
    pairs = generate()
    save(pairs)
