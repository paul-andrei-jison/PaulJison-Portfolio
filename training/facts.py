# facts.py — the single source of truth for what the AI knows about Paul.
#
# HOW IT WORKS:
#   generate_dataset.py reads FACTS and pairs each fact's answer with
#   several question phrasings from TEMPLATES (in generate_dataset.py).
#   If you want the AI to know something new, add a fact here.
#   If a fact is wrong, fix it here — then re-run the full pipeline.
#
# STRUCTURE:
#   Each fact has:
#     'category' — must match a key in CATEGORIES (used to pick question templates)
#     'answer'   — the exact text the model will learn to output

# CATEGORIES maps category names to plain-English descriptions.
# Also used by the test suite to verify no fact uses an unknown category.
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
    # ── Identity ──────────────────────────────────────────────────────────────
    # Who Paul is at a glance — name, role, location, timezone.
    {'category': 'identity', 'answer': 'Paul Jison is a full-stack software developer.'},
    {'category': 'identity', 'answer': 'Paul Jison lives in Davao City, Philippines.'},
    {'category': 'identity', 'answer': "Paul's timezone is GMT+8."},

    # ── Education ─────────────────────────────────────────────────────────────
    # Keep this updated when Paul's school status changes.
    {'category': 'education', 'answer': 'Paul is currently attending senior high school.'},
    {'category': 'education', 'answer': 'Paul expects to graduate in May 2028.'},

    # ── Skills ────────────────────────────────────────────────────────────────
    # Split across three facts so each gets trained on its own question templates.
    {'category': 'skills', 'answer': "Paul's main stack is Next.js, React, TypeScript, and Node.js."},
    {'category': 'skills', 'answer': 'Paul also knows JavaScript, HTML, CSS, and Tailwind CSS.'},
    {'category': 'skills', 'answer': 'Paul has experience with C++, OpenCV, and computer vision.'},

    # ── Projects ──────────────────────────────────────────────────────────────
    # Add new projects here as Paul builds them.
    {'category': 'projects', 'answer': 'Paul built Prep Pilot, a web app that helps students prepare for exams.'},
    {'category': 'projects', 'answer': 'Paul built an Arduino Ecommerce Website for buying and selling Arduino components.'},

    # ── Competitions ──────────────────────────────────────────────────────────
    {'category': 'competitions', 'answer': 'Paul participated in HKIMO, the Hong Kong International Mathematical Olympiad.'},
    {'category': 'competitions', 'answer': 'Paul competes in online hackathons and contributes to open-source projects.'},

    # ── Extracurriculars ──────────────────────────────────────────────────────
    {'category': 'extracurriculars', 'answer': 'Paul is an active member of the Boy Scouts.'},
    {'category': 'extracurriculars', 'answer': 'Paul is a three-year varsity athlete in soccer and table tennis.'},

    # ── Contact ───────────────────────────────────────────────────────────────
    # Two facts so both question forms ("What is Paul's email?" and "How do I hire Paul?")
    # map to meaningful, slightly different answers.
    {'category': 'contact', 'answer': 'You can reach Paul at paul.andrei.jison@gmail.com.'},
    {'category': 'contact', 'answer': 'Email paul.andrei.jison@gmail.com to hire or collaborate with Paul.'},

    # ── Goals ─────────────────────────────────────────────────────────────────
    {'category': 'goals', 'answer': 'Paul wants to build production-quality software and contribute to open-source while still in school.'},
    {'category': 'goals', 'answer': 'Paul is passionate about understanding technology trade-offs to pick the right solution for business needs.'},
]
