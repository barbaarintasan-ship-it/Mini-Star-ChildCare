/* =================================================================
   Mini Star — curriculum2.js  Phase 2: World-Class Child Development
   ================================================================= */

/* ── STATE ── */
let C2_PORT_CHILD  = '';   // portfolio / readiness child selector
let C2_PBL_AGE     = 'all';
let C2_PORT_TYPE   = 'all';
let C2_RDNS_CHILD  = '';
let C2_WEEKLY_CHILD = '';

/* ══════════════════════════════════════════════
   SECTION 1 — DB EXTENSION
   ══════════════════════════════════════════════ */
(function extendDB() {
  const _orig = initCurriculumDB;
  initCurriculumDB = function() {
    _orig();
    if (!DB || !DB.curriculum) return;
    if (!DB.curriculum.portfolio)         DB.curriculum.portfolio = [];
    if (!DB.curriculum.projects)          DB.curriculum.projects = [];
    if (!DB.curriculum.readinessScores)   DB.curriculum.readinessScores = [];
    if (!DB.curriculum.flMilestones)      DB.curriculum.flMilestones = [];
    if (!DB.curriculum.leadershipProgress) DB.curriculum.leadershipProgress = [];
    if (!DB.curriculum.weeklyReports)     DB.curriculum.weeklyReports = [];
  };
  initCurriculumDB();
})();

/* ══════════════════════════════════════════════
   SECTION 2 — AGE-SPECIFIC LEARNING ROADMAPS
   ══════════════════════════════════════════════ */
const AGE_ROADMAPS = [
  {
    id: 'band_0_12m', label: '0–12 Months', ageRange: '0 to 12 months', icon: '&#128118;', color: '#FFD9C4',
    learningGoals: ['Respond to voices and faces', 'Track moving objects with eyes', 'Begin cause-and-effect understanding', 'Babble and vocalize'],
    lifeSkills: ['Self-soothing techniques', 'Feeding routines', 'Sleep schedule consistency', 'Sensory exploration'],
    thinkingSkills: ['Object permanence basics', 'Simple problem solving (reaching for objects)', 'Pattern recognition through routines'],
    socialSkills: ['Secure attachment with caregivers', 'Social smiling', 'Turn-taking in sounds'],
    leadershipSkills: ['Communicating needs clearly', 'Asserting preferences'],
    financialLiteracy: ['Concept of "mine" begins', 'Awareness of giving and receiving'],
    entrepreneurship: ['Curiosity-driven exploration', 'Cause-and-effect discovery'],
    creativityGoals: ['Sensory art: finger painting, textures', 'Music and rhythm response', 'Imaginative play with simple toys']
  },
  {
    id: 'band_1_2y', label: '1–2 Years', ageRange: '1 to 2 years', icon: '&#128118;', color: '#C8F0C8',
    learningGoals: ['First words to 50-word vocabulary', 'Walk, climb, run', 'Imitate adult actions', 'Sort objects by shape/color'],
    lifeSkills: ['Hand washing basics', 'Using spoon/fork', 'Tidying up toys', 'Simple dressing attempts'],
    thinkingSkills: ['Symbolic thinking (pretend play)', 'Simple sorting and matching', 'Following 2-step instructions'],
    socialSkills: ['Parallel play', 'Sharing awareness (emerging)', 'Empathy for distressed peers'],
    leadershipSkills: ['Making simple choices', 'Leading during play'],
    financialLiteracy: ['Handing objects to others (early exchange)', 'Understanding "all gone"'],
    entrepreneurship: ['Making things with hands', 'Showing products to adults'],
    creativityGoals: ['Scribbling and mark-making', 'Simple building blocks', 'Movement and dance exploration']
  },
  {
    id: 'band_2_3y', label: '2–3 Years', ageRange: '2 to 3 years', icon: '&#128105;', color: '#D4F0FF',
    learningGoals: ['200–300 word vocabulary', 'Ask "why" questions', 'Recognize own name in print', 'Count to 3–5'],
    lifeSkills: ['Toilet training', 'Dressing with assistance', 'Brushing teeth with help', 'Carrying own belongings'],
    thinkingSkills: ['Pretend play scenarios', 'Early classification', 'Memory for recent events'],
    socialSkills: ['Play near others cooperatively', 'Express emotions with words', 'Understand "yours" and "mine"'],
    leadershipSkills: ['Organizing peers in play', 'Asserting ideas in group'],
    financialLiteracy: ['Recognizing coins by sight', 'Understanding that things cost money'],
    entrepreneurship: ['Selling or trading toys in play scenarios', 'Making "products" (drawings) to give away'],
    creativityGoals: ['Drawing simple shapes', 'Dramatic play (cooking, shopping)', 'Building towers and structures']
  },
  {
    id: 'band_3_4y', label: '3–4 Years', ageRange: '3 to 4 years', icon: '&#127912;', color: '#E8D4FF',
    learningGoals: ['500+ word vocabulary', 'Tell simple stories', 'Write first name', 'Count to 10 with understanding'],
    lifeSkills: ['Independent toileting', 'Pour own drinks', 'Set table', 'Clean up without prompting'],
    thinkingSkills: ['Classify by 2+ attributes', 'Understand past/present/future', 'Simple logic puzzles'],
    socialSkills: ['Cooperative play with rules', 'Take turns consistently', 'Identify feelings in others'],
    leadershipSkills: ['Lead group games', 'Explain rules to peers', 'Volunteer to help'],
    financialLiteracy: ['Understanding value: more vs. less', 'Trading items of equal perceived value', 'Saving coins in piggy bank'],
    entrepreneurship: ['Mini market day play', 'Making products to sell (lemonade stand concept)', 'Understanding customers want things'],
    creativityGoals: ['Draw recognizable figures', 'Build complex block structures', 'Create stories with characters']
  },
  {
    id: 'band_4_5y', label: '4–5 Years', ageRange: '4 to 5 years', icon: '&#127912;', color: '#C4DDFF',
    learningGoals: ['Write most letters', 'Blend simple sounds', 'Add and subtract to 5', 'Retell stories with sequence'],
    lifeSkills: ['Tie shoes (emerging)', 'Make simple snacks', 'Manage personal belongings', 'Follow multi-step routines independently'],
    thinkingSkills: ['Solve problems with multiple steps', 'Understand cause and effect', 'Make predictions and test them'],
    socialSkills: ['Negotiate conflict with words', 'Maintain friendships', 'Understand fairness and rules'],
    leadershipSkills: ['Organize group activities', 'Mentor younger children', 'Take on classroom roles'],
    financialLiteracy: ['Distinguish needs vs. wants', 'Earn stickers/tokens for tasks', 'Understand saving toward a goal'],
    entrepreneurship: ['Real lemonade/bake sale setup', 'Design simple product (bracelet, drawing)', 'Understand profit basics: earn more than you spend'],
    creativityGoals: ['Write and illustrate short stories', 'Design inventions', 'Produce collaborative art projects']
  },
  {
    id: 'band_5_7y', label: '5–7 Years', ageRange: '5 to 7 years', icon: '&#128218;', color: '#E8FFD4',
    learningGoals: ['Read simple books independently', 'Write complete sentences', 'Add/subtract to 20', 'Understand scientific observation'],
    lifeSkills: ['Prepare simple meals', 'Manage time with a schedule', 'Care for pets/plants', 'Navigate safe routes independently'],
    thinkingSkills: ['Logical reasoning with evidence', 'Understand multiple perspectives', 'Research simple questions'],
    socialSkills: ['Resolve peer conflicts independently', 'Work in teams toward shared goals', 'Show empathy through action'],
    leadershipSkills: ['Class representative roles', 'Lead project teams', 'Mentoring younger students', 'Public speaking basics'],
    financialLiteracy: ['Receive and manage small allowance', 'Differentiate saving vs. spending', 'Understand banking basics', 'Create simple budget'],
    entrepreneurship: ['Class market day with real products', 'Understand supply and demand', 'Serve customers', 'Count profit and loss'],
    creativityGoals: ['Design and build projects from plans', 'Write and perform short plays', 'Create music or art with intent']
  },
  {
    id: 'band_8_10y', label: '8–10 Years', ageRange: '8 to 10 years', icon: '&#128218;', color: '#FFF4C4',
    learningGoals: ['Read chapter books with comprehension', 'Write multi-paragraph essays', 'Multiply and divide', 'Conduct experiments with hypotheses'],
    lifeSkills: ['Cook full meals with supervision', 'Manage weekly schedule', 'Handle emergencies (call for help)', 'Advocate for themselves'],
    thinkingSkills: ['Evaluate source credibility', 'Compare multiple viewpoints', 'Identify logical fallacies', 'Systems thinking basics'],
    socialSkills: ['Navigate complex social dynamics', 'Lead collaborative projects', 'Advocate for others', 'Resolve adult conflicts diplomatically'],
    leadershipSkills: ['Club and team leadership', 'Community service projects', 'Mentor peers', 'Present to groups'],
    financialLiteracy: ['Track income and expenses', 'Understand interest and savings growth', 'Research product prices', 'Create a personal budget'],
    entrepreneurship: ['Write simple business plan', 'Identify market needs', 'Create and sell a product/service', 'Calculate profit/loss'],
    creativityGoals: ['Design solutions to real problems', 'Produce creative projects end-to-end', 'Learn coding or robotics basics']
  },
  {
    id: 'band_11_12y', label: '11–12 Years', ageRange: '11 to 12 years', icon: '&#127891;', color: '#FFD4D4',
    learningGoals: ['Analyze literature themes', 'Write research papers', 'Pre-algebra concepts', 'Design controlled experiments'],
    lifeSkills: ['Full meal planning and prep', 'Manage own healthcare basics', 'Navigate public transportation', 'Interview and job skills'],
    thinkingSkills: ['Abstract reasoning', 'Ethical decision-making frameworks', 'Research and citation', 'Debate and argumentation'],
    socialSkills: ['Understand systemic social issues', 'Lead diverse teams', 'Mentor younger students formally', 'Navigate digital relationships safely'],
    leadershipSkills: ['School government participation', 'Design and lead community projects', 'Entrepreneurial team leadership', 'Public speaking and persuasion'],
    financialLiteracy: ['Understand investing basics (stocks, interest)', 'Research and compare purchases', 'Understand taxes and income', 'Create 3-month financial plan'],
    entrepreneurship: ['Full business plan with marketing', 'Run a real micro-business', 'Pitch to an audience', 'Understand scaling and competition'],
    creativityGoals: ['Produce portfolio of creative work', 'Launch a project that helps others', 'Innovate solutions to school/community problems']
  }
];

/* ══════════════════════════════════════════════
   SECTION 3 — ENTREPRENEURSHIP PATHWAY
   ══════════════════════════════════════════════ */
const ENT_PATHWAY = [
  {
    stage: 1, label: 'Discovery', ageRange: '3–4 Years', icon: '&#128161;', color: '#FFD9C4',
    concept: 'What is value? What do people want?',
    milestones: [
      'Understand that things have value to people',
      'Trade items with peers ("I give you this, you give me that")',
      'Make a product (drawing, craft) and give it to someone',
      'Explain what their "product" does'
    ],
    activities: [
      { title: 'Mini Market Play', desc: 'Set up a pretend store with toys as products. Children price items with sticker dots.', skills: 'Value, exchange, math' },
      { title: 'Make & Give', desc: 'Create a card or drawing as a "gift product." Discuss why people like it.', skills: 'Value creation, creativity' },
      { title: 'Trading Day', desc: 'Each child brings a small item to trade. Discuss fairness of trades.', skills: 'Negotiation, value judgment' }
    ]
  },
  {
    stage: 2, label: 'Junior Business', ageRange: '5–7 Years', icon: '&#127981;', color: '#C8F0C8',
    concept: 'How do businesses work? Who are customers?',
    milestones: [
      'Identify a customer need and create a product/service for it',
      'Set a fair price for a product',
      'Serve customers at a class market day',
      'Count sales and calculate simple profit',
      'Understand: you must spend money to make a product'
    ],
    activities: [
      { title: 'Class Market Day', desc: 'Each child creates 5–10 products (bookmarks, painted rocks). Set prices, sell to parents/peers.', skills: 'Sales, pricing, customer service' },
      { title: 'Team Business', desc: 'Groups of 3 create a business: name, product, price, advertisement.', skills: 'Teamwork, branding, planning' },
      { title: 'Budget Challenge', desc: 'Given $5 of "tokens," children buy supplies and must sell products for more than $5.', skills: 'Budgeting, profit concept' }
    ]
  },
  {
    stage: 3, label: 'Real Business', ageRange: '8–12 Years', icon: '&#128200;', color: '#C4DDFF',
    concept: 'How do I build and run a sustainable business?',
    milestones: [
      'Write a business plan (problem, solution, target customer, pricing)',
      'Create a marketing strategy (flyer, pitch, social awareness)',
      'Manage a real budget and track income/expenses',
      'Calculate profit, loss, and break-even point',
      'Present business to an audience and handle questions',
      'Understand competition and differentiation'
    ],
    activities: [
      { title: 'Business Plan Workshop', desc: 'Complete a 1-page business plan: idea, customers, revenue model, startup costs.', skills: 'Planning, financial thinking, research' },
      { title: 'Pitch Competition', desc: 'Present 3-minute business pitch to panel. Q&A on financials and market.', skills: 'Public speaking, persuasion, critical thinking' },
      { title: 'Real Micro-Business', desc: 'Run a service (tutoring, dog walking, car wash) or product business for 2 weeks. Track all money.', skills: 'Execution, budgeting, persistence' }
    ]
  }
];

/* ══════════════════════════════════════════════
   SECTION 4 — FINANCIAL LITERACY FRAMEWORK
   ══════════════════════════════════════════════ */
const FL_DOMAINS = [
  {
    id: 'saving', label: 'Saving', icon: '&#128180;', color: '#4A9E4A',
    milestones: [
      { level: 1, label: 'Awareness', desc: 'Knows a piggy bank holds money', age: '3–4' },
      { level: 2, label: 'Practice', desc: 'Puts coins in savings container regularly', age: '4–6' },
      { level: 3, label: 'Goal Setting', desc: 'Saves toward a specific item for 1–2 weeks', age: '6–8' },
      { level: 4, label: 'Strategy', desc: 'Divides income: save, spend, give', age: '8–10' },
      { level: 5, label: 'Growth', desc: 'Understands interest and compound growth', age: '10–12' }
    ]
  },
  {
    id: 'spending', label: 'Smart Spending', icon: '&#128722;', color: '#E86B6B',
    milestones: [
      { level: 1, label: 'Recognition', desc: 'Knows stores exchange money for goods', age: '3–4' },
      { level: 2, label: 'Choice', desc: 'Chooses between two items within a budget', age: '4–6' },
      { level: 3, label: 'Comparison', desc: 'Compares prices of similar products', age: '6–8' },
      { level: 4, label: 'Value Analysis', desc: 'Evaluates quality vs. price', age: '8–10' },
      { level: 5, label: 'Research', desc: 'Researches best prices and reads reviews', age: '10–12' }
    ]
  },
  {
    id: 'needs_wants', label: 'Needs vs. Wants', icon: '&#9878;', color: '#C8960A',
    milestones: [
      { level: 1, label: 'Awareness', desc: 'Can name examples of food, shelter (needs)', age: '3–5' },
      { level: 2, label: 'Sorting', desc: 'Sorts items into needs/wants categories', age: '5–7' },
      { level: 3, label: 'Tradeoffs', desc: 'Understands choosing a want means sacrificing another', age: '7–9' },
      { level: 4, label: 'Planning', desc: 'Prioritizes spending: needs first, wants second', age: '9–12' }
    ]
  },
  {
    id: 'earning', label: 'Earning Money', icon: '&#128184;', color: '#2ABFB8',
    milestones: [
      { level: 1, label: 'Awareness', desc: 'Knows adults earn money by working', age: '3–5' },
      { level: 2, label: 'Chores', desc: 'Earns allowance through completing tasks', age: '5–7' },
      { level: 3, label: 'Service', desc: 'Earns money outside home (helping neighbors)', age: '7–9' },
      { level: 4, label: 'Business', desc: 'Creates and runs a micro-business', age: '9–12' }
    ]
  },
  {
    id: 'delayed_gratification', label: 'Delayed Gratification', icon: '&#9203;', color: '#8B4AB8',
    milestones: [
      { level: 1, label: 'Waiting', desc: 'Waits for a treat without distress', age: '3–5' },
      { level: 2, label: 'Saving for Goals', desc: 'Saves up for a desired item over days', age: '5–7' },
      { level: 3, label: 'Long-Term Thinking', desc: 'Plans and saves over weeks for a bigger goal', age: '7–9' },
      { level: 4, label: 'Investment Mindset', desc: 'Understands waiting makes money grow (interest)', age: '9–12' }
    ]
  },
  {
    id: 'value_creation', label: 'Creating Value', icon: '&#10024;', color: '#B87828',
    milestones: [
      { level: 1, label: 'Making', desc: 'Creates something to give to others (art, craft)', age: '3–5' },
      { level: 2, label: 'Service', desc: 'Performs a service that helps someone', age: '5–7' },
      { level: 3, label: 'Product', desc: 'Makes a product others want to buy', age: '7–9' },
      { level: 4, label: 'Innovation', desc: 'Solves a problem others haven\'t solved yet', age: '9–12' }
    ]
  }
];

/* ══════════════════════════════════════════════
   SECTION 5 — LEADERSHIP MODULES
   ══════════════════════════════════════════════ */
const LEADERSHIP_MODULES = [
  {
    id: 'responsibility', label: 'Responsibility', icon: '&#9989;', color: '#4A9E4A',
    desc: 'Owning your actions and following through on commitments.',
    indicators: {
      infants:    ['Signals needs clearly'],
      toddlers:   ['Puts toys away when asked', 'Washes hands without reminder'],
      preschool:  ['Completes assigned classroom jobs', 'Tells truth when something goes wrong'],
      school_age: ['Manages homework and deadlines', 'Takes ownership of mistakes and fixes them']
    }
  },
  {
    id: 'initiative', label: 'Initiative', icon: '&#128161;', color: '#C8960A',
    desc: 'Starting tasks and projects without being told.',
    indicators: {
      infants:    ['Reaches for desired objects proactively'],
      toddlers:   ['Starts clean-up before being asked', 'Chooses activities independently'],
      preschool:  ['Suggests ideas for the group', 'Starts creative projects unprompted'],
      school_age: ['Organizes events for peers', 'Identifies and addresses classroom needs']
    }
  },
  {
    id: 'teamwork', label: 'Teamwork', icon: '&#129309;', color: '#2ABFB8',
    desc: 'Collaborating effectively to achieve shared goals.',
    indicators: {
      infants:    ['Engages in simple social games (peek-a-boo)'],
      toddlers:   ['Plays near others cooperatively', 'Shares materials with guidance'],
      preschool:  ['Takes turns in group activities', 'Includes peers who are left out'],
      school_age: ['Divides work fairly in group projects', 'Resolves team conflicts constructively']
    }
  },
  {
    id: 'communication', label: 'Communication', icon: '&#128172;', color: '#4A8BC4',
    desc: 'Expressing ideas clearly and listening actively.',
    indicators: {
      infants:    ['Uses facial expressions and gestures to communicate'],
      toddlers:   ['Uses words instead of crying to express needs', 'Listens during story time'],
      preschool:  ['Speaks in complete sentences', 'Waits to speak in conversations'],
      school_age: ['Presents ideas to groups confidently', 'Listens without interrupting, asks clarifying questions']
    }
  },
  {
    id: 'decision_making', label: 'Decision Making', icon: '&#129504;', color: '#8B4AB8',
    desc: 'Evaluating options and making thoughtful choices.',
    indicators: {
      infants:    ['Chooses between two objects when offered'],
      toddlers:   ['Makes simple choices (this or that)', 'Understands some choices have consequences'],
      preschool:  ['Weighs pros/cons in simple scenarios', 'Makes fair group decisions'],
      school_age: ['Uses a decision framework (list pros/cons, identify values)', 'Seeks input before deciding']
    }
  },
  {
    id: 'problem_solving', label: 'Problem Solving', icon: '&#128736;', color: '#E86B6B',
    desc: 'Identifying problems and generating effective solutions.',
    indicators: {
      infants:    ['Finds objects hidden under a cloth', 'Works around obstacles to reach goal'],
      toddlers:   ['Tries multiple approaches to a puzzle', 'Asks for help when stuck'],
      preschool:  ['Names a problem and suggests 2+ solutions', 'Tests solutions and reports results'],
      school_age: ['Uses structured problem-solving (define → ideate → test → refine)', 'Mentors peers through challenges']
    }
  }
];

/* ══════════════════════════════════════════════
   SECTION 6 — CRITICAL THINKING ENGINE
   ══════════════════════════════════════════════ */
const CT_PHASES = [
  { id: 'question',    label: 'Ask the Question',      icon: '&#10067;', color: '#2ABFB8', prompt: 'What do we want to find out? What is the problem we are solving?' },
  { id: 'evidence',   label: 'Gather Evidence',        icon: '&#128270;', color: '#4A8BC4', prompt: 'What information do we have? What do we observe? What sources can we use?' },
  { id: 'reasoning',  label: 'Reason It Through',      icon: '&#129504;', color: '#8B4AB8', prompt: 'What do the facts tell us? How do the pieces connect? What patterns do we see?' },
  { id: 'assumptions',label: 'Check Assumptions',      icon: '&#9888;',  color: '#C8960A', prompt: 'What are we assuming? Could we be wrong? Are our sources trustworthy?' },
  { id: 'alternatives','label': 'Consider Alternatives', icon: '&#128260;', color: '#E86B6B', prompt: 'What other explanations exist? What would happen if we tried a different approach?' },
  { id: 'decision',   label: 'Make a Decision',        icon: '&#9989;',  color: '#4A9E4A', prompt: 'What is our best conclusion based on the evidence? What will we do next?' }
];

const CT_TEMPLATES = {
  toddlers: [
    { title: 'Why did the plant die?', phases: ['We wonder why the plant looks sick', 'Check soil, water, sunlight', 'No water for 3 days', 'Maybe it just needs sun?', 'Try watering AND giving more sun', 'Water it and move it to the window'] },
    { title: 'Who took the last cookie?', phases: ['The cookies are gone — how?', 'Look for crumbs, ask friends', 'Crumbs near Timmy', 'Maybe the crumbs were already there', 'Ask Timmy; check if anyone else knows', 'Talk to Timmy — apologize if wrong'] }
  ],
  preschool: [
    { title: 'How do birds fly?', phases: ['Why can birds fly but we cannot?', 'Observe birds, feel wings, look at books', 'Birds have hollow bones and feathers', 'Maybe all animals with feathers fly?', 'Think of penguins — feathers but no flight!', 'Wings + hollow bones + right weight = flight'] },
    { title: 'Is it fair to have different rules?', phases: ['Why do older kids stay up later?', 'Talk to parents, look at sleep research', 'Older bodies need less sleep', 'Maybe it is just unfair', 'Look at other families\' rules', 'Different ages have different needs — it can be fair'] }
  ],
  school_age: [
    { title: 'Should screens be banned at school?', phases: ['Are screens helpful or harmful in learning?', 'Research studies on screen time and learning', 'Mixed evidence: some help, some harm', 'We might assume all screen time is bad', 'Look at best-practice schools with screen limits', 'Structured screen time with clear purpose = best approach'] },
    { title: 'How can we reduce waste in our classroom?', phases: ['We produce too much trash — what can we do?', 'Audit 1 week of classroom waste', 'Paper and food scraps are biggest categories', 'Assuming recycling alone will fix it', 'Try composting, digital worksheets, reusable cups', 'Launch 3 initiatives and measure waste again in 2 weeks'] }
  ]
};

/* ══════════════════════════════════════════════
   SECTION 7 — PROJECT-BASED LEARNING SYSTEM
   ══════════════════════════════════════════════ */
const PBL_PROJECTS = [
  {
    id: 'pbl_t1', ageGroup: 'toddlers', title: 'My Feelings Collage',
    objective: 'Children identify and express 4 core emotions through art.',
    materials: ['Magazines', 'Safety scissors', 'Glue sticks', 'Large paper', 'Crayons'],
    teacherGuide: ['Introduce 4 emotion faces (happy, sad, angry, surprised)', 'Read a feelings book', 'Children find magazine pictures showing feelings', 'Glue to paper, teacher labels emotions', 'Each child shares one feeling picture'],
    parentSummary: 'Your child made a Feelings Collage! They practiced identifying emotions and talking about how people feel. You can continue this at home by asking "How does this person feel?" when reading books together.',
    assessment: ['Names 4 emotions correctly', 'Selects appropriate pictures', 'Shares their collage with peers'],
    skills: ['Social-Emotional', 'Language', 'Creativity', 'Critical Thinking']
  },
  {
    id: 'pbl_p1', ageGroup: 'preschool', title: 'Our Neighborhood Map',
    objective: 'Children create a collaborative map of their neighborhood, building spatial thinking and community awareness.',
    materials: ['Large butcher paper', 'Markers', 'Stickers', 'Photo printouts', 'Rulers'],
    teacherGuide: ['Walk around neighborhood (virtual or real)', 'Photograph key places', 'Discuss: what is our neighborhood?', 'Children draw and label map sections', 'Add photos and stickers', 'Present map to another class'],
    parentSummary: 'Our class built a neighborhood map together! Your child learned about community, spatial thinking, and collaboration. Ask them to show you where key places are on a map of your area.',
    assessment: ['Contributes at least 2 map elements', 'Can explain what their element is', 'Presents to another group'],
    skills: ['Cognitive', 'Social', 'Language', 'Life Skills', 'Leadership']
  },
  {
    id: 'pbl_p2', ageGroup: 'preschool', title: 'Mini Entrepreneurs Market',
    objective: 'Children design, create, price and sell a product at a class market.',
    materials: ['Craft supplies', 'Price tags', 'Play money', 'Display tables', 'Receipt paper'],
    teacherGuide: ['Week 1: brainstorm products customers would want', 'Week 2: make 5 products per child', 'Week 3: price, design display, practice pitch', 'Market Day: invite parents, run market for 30 min', 'Count earnings, celebrate success'],
    parentSummary: 'Your child participated in our Mini Entrepreneurs Market! They designed a product, set a price, and practiced selling. This builds financial literacy, math, confidence, and entrepreneurial thinking.',
    assessment: ['Creates at least 3 products', 'Sets a fair price', 'Successfully sells to at least one customer', 'Can explain what their product does'],
    skills: ['Entrepreneurship', 'Financial Literacy', 'Math', 'Communication', 'Creativity']
  },
  {
    id: 'pbl_s1', ageGroup: 'school_age', title: 'Community Problem Solvers',
    objective: 'Students identify a real community problem and design + present a solution.',
    materials: ['Research materials', 'Poster boards', 'Laptops (if available)', 'Presentation tools'],
    teacherGuide: ['Week 1: walk around facility/neighborhood, list 5 problems', 'Week 2: choose one problem, research root causes', 'Week 3: design 3 potential solutions, evaluate each', 'Week 4: build and present best solution to staff/parents'],
    parentSummary: 'Your child tackled a real community challenge! They researched, brainstormed, evaluated options, and presented their solution. This builds critical thinking, research skills, public speaking, and civic responsibility.',
    assessment: ['Clearly defines the problem', 'Provides evidence-based analysis', 'Evaluates 3+ solutions', 'Presents confidently to audience', 'Answers audience questions'],
    skills: ['Critical Thinking', 'Leadership', 'Communication', 'Research', 'Civic Awareness']
  },
  {
    id: 'pbl_s2', ageGroup: 'school_age', title: 'Junior Business Launch',
    objective: 'Students write a business plan and run a real micro-business for 2 weeks.',
    materials: ['Business Plan template', 'Startup budget ($10 token)', 'Sales tracking sheet', 'Marketing materials'],
    teacherGuide: ['Week 1: identify needs, write business plan, get approval', 'Week 2: make products or prep service, create marketing', 'Week 3–4: run business, track sales daily', 'Final week: calculate profit/loss, present findings'],
    parentSummary: 'Your child ran a real business! They wrote a plan, managed money, served customers, and measured results. This is one of the most powerful real-world learning experiences we offer.',
    assessment: ['Completes all sections of business plan', 'Earns positive profit', 'Tracks finances accurately', 'Presents results with data', 'Reflects on what they would do differently'],
    skills: ['Entrepreneurship', 'Financial Literacy', 'Math', 'Planning', 'Leadership', 'Communication']
  },
  {
    id: 'pbl_i1', ageGroup: 'infants', title: 'Sensory Discovery Stations',
    objective: 'Infants explore 5 different sensory textures to build neural pathways and curiosity.',
    materials: ['Soft fabrics', 'Smooth plastic', 'Rough sandpaper (supervised)', 'Cool water tray', 'Warm rice bin'],
    teacherGuide: ['Prepare 5 sensory bins/surfaces', 'Lay infants near each station for 3–5 min', 'Narrate: "This is rough, this is smooth"', 'Observe reactions and note preferences', 'Record developmental responses'],
    parentSummary: 'Your baby explored different textures and materials today! Sensory play is essential for brain development. Try this at home with a spoon, a soft blanket, or water in a small tub.',
    assessment: ['Reacts differently to contrasting textures', 'Shows curiosity (reaching, mouthing, looking)', 'Tolerates all 5 stations for at least 1 minute'],
    skills: ['Cognitive', 'Physical', 'Sensory Development', 'Curiosity']
  }
];

/* ══════════════════════════════════════════════
   SECTION 8 — READINESS CRITERIA
   ══════════════════════════════════════════════ */
const SCHOOL_READINESS = [
  { id: 'sr_letters', label: 'Letter Recognition', icon: '&#128214;', desc: 'Recognizes and names letters of alphabet' },
  { id: 'sr_numbers', label: 'Number Sense', icon: '&#128290;', desc: 'Counts to 20, understands quantity' },
  { id: 'sr_print', label: 'Print Awareness', icon: '&#128221;', desc: 'Knows books have a top/bottom, reads left to right' },
  { id: 'sr_listening', label: 'Listening Skills', icon: '&#128266;', desc: 'Follows 3-step instructions' },
  { id: 'sr_finemotor', label: 'Fine Motor Skills', icon: '&#9998;', desc: 'Holds pencil correctly, cuts with scissors' },
  { id: 'sr_phonics', label: 'Phonological Awareness', icon: '&#127925;', desc: 'Rhymes words, hears beginning sounds' },
  { id: 'sr_science', label: 'Scientific Curiosity', icon: '&#128300;', desc: 'Asks "why" questions, observes and predicts' },
  { id: 'sr_mathpatterns', label: 'Math Patterns', icon: '&#129518;', desc: 'Identifies and extends ABAB patterns' }
];

const LIFE_READINESS = [
  { id: 'lr_independence', label: 'Independence', icon: '&#127775;', desc: 'Completes age-appropriate tasks without prompting' },
  { id: 'lr_communication', label: 'Communication', icon: '&#128172;', desc: 'Expresses needs and ideas clearly to adults and peers' },
  { id: 'lr_responsibility', label: 'Responsibility', icon: '&#9989;', desc: 'Owns belongings, completes chores, keeps commitments' },
  { id: 'lr_practical', label: 'Practical Skills', icon: '&#128295;', desc: 'Handles basic self-care and real-world tasks for their age' },
  { id: 'lr_problem_solving', label: 'Problem Solving', icon: '&#128736;', desc: 'Identifies problems and generates solutions independently' },
  { id: 'lr_emotional', label: 'Emotional Regulation', icon: '&#129505;', desc: 'Manages emotions and bounces back from setbacks' },
  { id: 'lr_social', label: 'Social Awareness', icon: '&#129309;', desc: 'Reads social cues, shows empathy, cooperates with others' },
  { id: 'lr_health', label: 'Health & Safety', icon: '&#127807;', desc: 'Knows basic health habits, stays safe, understands rules' }
];

const RDNS_LEVELS = ['Not Yet', 'Emerging', 'Developing', 'Proficient'];
const RDNS_LEVELS_ES = ['Aún no', 'Emergente', 'En Desarrollo', 'Competente'];
function rdnsLabel(l) { const i = RDNS_LEVELS.indexOf(l); return typeof LANG !== 'undefined' && LANG === 'es' && i >= 0 ? RDNS_LEVELS_ES[i] : l; }
const RDNS_COLORS = ['#EEE', '#FFE08A', '#A8D8F0', '#A8D8A8'];

/* ══════════════════════════════════════════════
   SECTION 9 — HELPER FUNCTIONS
   ══════════════════════════════════════════════ */

function getAgeGroupFromChild(childId) {
  const child = DB.children.find(c => c.id === childId);
  if (!child || !child.classId) return 'preschool';
  return typeof getAgeKey === 'function' ? getAgeKey(child.classId) : 'preschool';
}

function getRoadmapForChild(childId) {
  const child = DB.children.find(c => c.id === childId);
  if (!child) return AGE_ROADMAPS[4];
  const ageKey = typeof getAgeKey === 'function' ? getAgeKey(child.classId) : 'preschool';
  const idx = { infants: 0, toddlers: 2, preschool: 4, school_age: 5 }[ageKey] ?? 4;
  return AGE_ROADMAPS[idx];
}

function getEntStageForChild(childId) {
  const ageKey = getAgeGroupFromChild(childId);
  if (ageKey === 'school_age') return ENT_PATHWAY[2];
  if (ageKey === 'preschool')  return ENT_PATHWAY[1];
  return ENT_PATHWAY[0];
}

function getFLMilestone(childId, domainId) {
  return (DB.curriculum.flMilestones||[]).find(m => m.childId===childId && m.domainId===domainId);
}

function saveFLMilestone(childId, domainId, level) {
  const existing = getFLMilestone(childId, domainId);
  if (existing) { existing.level = level; existing.date = getTodayDate(); }
  else (DB.curriculum.flMilestones = DB.curriculum.flMilestones||[]).push({ id: uid(), childId, domainId, level, date: getTodayDate(), teacherId: CU?CU.id:'' });
  saveDB(); renderPortal();
}

function getLeadershipProgress(childId, moduleId) {
  return (DB.curriculum.leadershipProgress||[]).find(p => p.childId===childId && p.moduleId===moduleId);
}

function saveLeadershipProgress(childId, moduleId, level) {
  const existing = getLeadershipProgress(childId, moduleId);
  if (existing) { existing.level = level; existing.date = getTodayDate(); }
  else (DB.curriculum.leadershipProgress = DB.curriculum.leadershipProgress||[]).push({ id: uid(), childId, moduleId, level, date: getTodayDate(), teacherId: CU?CU.id:'' });
  saveDB(); renderPortal();
}

function getReadinessScore(childId, criteriaId, type) {
  return (DB.curriculum.readinessScores||[]).find(r => r.childId===childId && r.criteriaId===criteriaId && r.type===type);
}

function saveReadinessScore(childId, criteriaId, type, level) {
  const existing = getReadinessScore(childId, criteriaId, type);
  if (existing) { existing.level = level; existing.date = getTodayDate(); }
  else (DB.curriculum.readinessScores = DB.curriculum.readinessScores||[]).push({ id: uid(), childId, criteriaId, type, level, date: getTodayDate(), teacherId: CU?CU.id:'' });
  saveDB(); renderPortal();
}

function getPortfolioItems(childId, type) {
  const items = (DB.curriculum.portfolio||[]).filter(p => p.childId === childId);
  return type && type !== 'all' ? items.filter(p => p.type === type) : items;
}

function addPortfolioItem(childId, type, title, description, skills) {
  (DB.curriculum.portfolio = DB.curriculum.portfolio||[]).push({
    id: uid(), childId, type, title, description, skills, date: getTodayDate(),
    teacherId: CU?CU.id:'', photos: []
  });
  saveDB(); renderPortal();
}

function getChildReadinessAvg(childId, type) {
  const criteria = type === 'school' ? SCHOOL_READINESS : LIFE_READINESS;
  const scores = criteria.map(c => {
    const s = getReadinessScore(childId, c.id, type);
    return s ? RDNS_LEVELS.indexOf(s.level) : 0;
  });
  const avg = scores.reduce((a,b)=>a+b,0) / scores.length;
  return Math.round((avg / 3) * 100);
}

function childrenForCurrentTeacher() {
  return DB.children.filter(c => c.classId === CU.classId);
}

/* ══════════════════════════════════════════════
   SECTION 10 — ROADMAP VIEW
   ══════════════════════════════════════════════ */

function roadmapView(isAdmin) {
  let h = `<div class="card t-gold" style="margin-bottom:14px">
    <p class="lead" style="margin-bottom:4px">&#127919; ${t('Age-Specific Learning Roadmaps','Rutas de Aprendizaje por Edad')}</p>
    <p style="font-size:.83rem;color:var(--muted);margin:0">${t('Evidence-based developmental pathways from birth to 12 years, covering all domains of learning.','Rutas de desarrollo basadas en evidencia desde el nacimiento hasta los 12 años, abarcando todos los dominios de aprendizaje.')}</p>
  </div>`;

  AGE_ROADMAPS.forEach(band => {
    h += `<details style="margin-bottom:10px">
      <summary style="cursor:pointer;background:${band.color};border-radius:12px;padding:12px 16px;font-weight:700;color:var(--night);list-style:none;display:flex;align-items:center;gap:8px">
        <span style="font-size:1.2rem">${band.icon}</span>
        <span>${esc(band.label)}</span>
        <span class="tag" style="margin-left:auto;background:rgba(0,0,0,.12);color:var(--night)">${esc(band.ageRange)}</span>
      </summary>
      <div style="padding:14px;border:2px solid ${band.color};border-top:none;border-radius:0 0 12px 12px;margin-top:-4px">
        ${_rdSection('&#127919; '+t('Learning Goals','Metas de Aprendizaje'), band.learningGoals, '#4A8BC4')}
        ${_rdSection('&#11088; '+t('Life Skills','Habilidades para la Vida'), band.lifeSkills, '#4A9E4A')}
        ${_rdSection('&#129504; '+t('Thinking Skills','Habilidades de Pensamiento'), band.thinkingSkills, '#8B4AB8')}
        ${_rdSection('&#10084; '+t('Social Skills','Habilidades Sociales'), band.socialSkills, '#E86B6B')}
        ${_rdSection('&#128200; '+t('Leadership','Liderazgo'), band.leadershipSkills, '#C8960A')}
        ${_rdSection('&#128180; '+t('Financial Literacy','Educación Financiera'), band.financialLiteracy, '#2E9E8A')}
        ${_rdSection('&#127981; '+t('Entrepreneurship','Emprendimiento'), band.entrepreneurship, '#B87828')}
        ${_rdSection('&#127912; '+t('Creativity Goals','Metas de Creatividad'), band.creativityGoals, '#D45AA0')}
      </div>
    </details>`;
  });
  return h;
}

function _rdSection(title, items, color) {
  if (!items || !items.length) return '';
  return `<div style="margin-bottom:10px">
    <p style="font-weight:700;color:${color};font-size:.85rem;margin:0 0 5px">${title}</p>
    <ul style="margin:0 0 0 16px;padding:0">
      ${items.map(i => `<li style="font-size:.82rem;color:var(--ink);margin-bottom:2px">${esc(i)}</li>`).join('')}
    </ul>
  </div>`;
}

/* ══════════════════════════════════════════════
   SECTION 11 — ENTREPRENEURSHIP & FL TEACHER VIEW
   ══════════════════════════════════════════════ */

function entPathwayView() {
  const ageKey = typeof getAgeKey === 'function' ? getAgeKey(CU.classId) : 'preschool';
  let h = `<div class="card t-gold" style="margin-bottom:14px">
    <p class="lead" style="margin-bottom:4px">&#127981; ${t('Progressive Entrepreneurship Pathway','Ruta Progresiva de Emprendimiento')}</p>
    <p style="font-size:.83rem;color:var(--muted);margin:0">${t('Developing value-creation, innovation, and business thinking from age 3 to 12.','Desarrollando el pensamiento creativo de valor, innovación y negocios de 3 a 12 años.')}</p>
  </div>`;

  ENT_PATHWAY.forEach(stage => {
    const isCurrent = (ageKey==='preschool'&&stage.stage===2)||(ageKey==='school_age'&&stage.stage===3)||(stage.stage===1&&(ageKey==='toddlers'||ageKey==='infants'));
    h += `<div class="card" style="margin-bottom:12px;border-left:5px solid ${stage.color}${isCurrent?';outline:2px solid var(--gold)':''}">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap">
        <span style="font-size:1.3rem">${stage.icon}</span>
        <b style="color:var(--night)">${esc(stage.label)}</b>
        <span class="tag" style="background:${stage.color};color:var(--night)">${esc(stage.ageRange)}</span>
        ${isCurrent ? `<span class="tag" style="background:var(--gold);color:#fff">&#9733; ${t('Your Class','Tu Clase')}</span>` : ''}
      </div>
      <p style="font-style:italic;font-size:.85rem;color:var(--muted);margin:0 0 8px">"${esc(stage.concept)}"</p>
      <p style="font-weight:700;font-size:.85rem;margin:0 0 5px;color:var(--ink)">${t('Milestones:','Hitos:')}</p>
      <ul style="margin:0 0 10px 16px;padding:0">
        ${stage.milestones.map(m=>`<li style="font-size:.82rem;margin-bottom:3px">${esc(m)}</li>`).join('')}
      </ul>
      <p style="font-weight:700;font-size:.85rem;margin:0 0 5px;color:var(--ink)">${t('Activities:','Actividades:')}</p>
      ${stage.activities.map(a=>`<div style="padding:8px 10px;background:#F8F8F8;border-radius:8px;margin-bottom:6px">
        <b style="font-size:.88rem">${esc(a.title)}</b>
        <p style="font-size:.8rem;color:var(--muted);margin:2px 0">${esc(a.desc)}</p>
        <span style="font-size:.75rem;color:var(--teal);font-weight:700">${t('Skills:','Habilidades:')} ${esc(a.skills)}</span>
      </div>`).join('')}
    </div>`;
  });
  return h;
}

function flTeacherView() {
  const kids = childrenForCurrentTeacher ? childrenForCurrentTeacher() : [];
  const selChild = C2_PORT_CHILD && kids.some(k=>k.id===C2_PORT_CHILD) ? C2_PORT_CHILD : (kids[0]||{}).id||'';
  C2_PORT_CHILD = selChild;

  let h = `<div class="card t-teal" style="margin-bottom:14px">
    <p class="lead" style="margin-bottom:4px">&#128180; ${t('Financial Literacy Framework','Marco de Educación Financiera')}</p>
    <p style="font-size:.83rem;color:var(--muted);margin:0">${t("Track each child's financial literacy milestones across 6 core domains.","Monitorea los hitos de educación financiera de cada niño en 6 dominios principales.")}</p>
  </div>`;

  if (!kids.length) return h + `<div class="empty">${t('No children in your class.','No hay niños en tu clase.')}</div>`;

  if (kids.length > 1) {
    h += `<div class="subtabs" style="padding-top:0">${kids.map(k=>
      `<button class="${k.id===selChild?'active':''}" onclick="C2_PORT_CHILD='${k.id}';renderPortal()">${esc(k.name)}</button>`
    ).join('')}</div>`;
  }

  const child = kids.find(k=>k.id===selChild);
  if (!child) return h + `<div class="empty">${t('Select a child.','Selecciona un niño.')}</div>`;

  h += `<div class="card" style="margin-bottom:10px;border-left:5px solid var(--gold)">
    <b>${esc(child.name)}</b> — ${t('Financial Literacy Progress','Progreso de Educación Financiera')}
  </div>`;

  FL_DOMAINS.forEach(domain => {
    const current = getFLMilestone(child.id, domain.id);
    const currentLevel = current ? current.level : 0;
    h += `<div class="card" style="margin-bottom:10px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:1.1rem">${domain.icon}</span>
        <b style="color:${domain.color}">${esc(domain.label)}</b>
        <span style="margin-left:auto;font-size:.8rem;color:var(--muted)">${t('Level','Nivel')} ${currentLevel} / ${domain.milestones.length}</span>
      </div>
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px">
        ${domain.milestones.map((m,i) => `<button onclick="saveFLMilestone('${child.id}','${domain.id}',${i+1})"
          style="padding:4px 10px;border-radius:20px;font-size:.72rem;font-weight:700;cursor:pointer;border:2px solid ${domain.color};background:${currentLevel>i?domain.color:'#fff'};color:${currentLevel>i?'#fff':domain.color}">
          ${i+1}. ${esc(m.label)}
        </button>`).join('')}
      </div>
      ${currentLevel > 0 ? `<div style="padding:8px;background:#F8F8F8;border-radius:8px;font-size:.82rem">
        <b>${t('Current:','Actual:')}</b> ${esc(domain.milestones[currentLevel-1].desc)}
        <span class="tag" style="margin-left:8px;background:#EEE">${esc(domain.milestones[currentLevel-1].age)}</span>
      </div>` : `<p style="font-size:.8rem;color:var(--muted);margin:0">${t('Not yet assessed','Aún no evaluado')}</p>`}
    </div>`;
  });
  return h;
}

function leadershipTeacherView() {
  const kids = childrenForCurrentTeacher ? childrenForCurrentTeacher() : [];
  const selChild = C2_PORT_CHILD && kids.some(k=>k.id===C2_PORT_CHILD) ? C2_PORT_CHILD : (kids[0]||{}).id||'';
  C2_PORT_CHILD = selChild;

  let h = `<div class="card t-night" style="margin-bottom:14px">
    <p class="lead" style="margin-bottom:4px;color:#fff">&#128200; ${t('Leadership Development','Desarrollo del Liderazgo')}</p>
    <p style="font-size:.83rem;color:#BFD4FF;margin:0">${t("Track and nurture each child's leadership competencies across 6 key domains.","Monitorea y fomenta las competencias de liderazgo de cada niño en 6 dominios clave.")}</p>
  </div>`;

  if (!kids.length) return h + `<div class="empty">${t('No children in your class.','No hay niños en tu clase.')}</div>`;
  if (kids.length > 1) {
    h += `<div class="subtabs" style="padding-top:0">${kids.map(k=>
      `<button class="${k.id===selChild?'active':''}" onclick="C2_PORT_CHILD='${k.id}';renderPortal()">${esc(k.name)}</button>`
    ).join('')}</div>`;
  }

  const child = kids.find(k=>k.id===selChild);
  if (!child) return h;

  const ageKey = getAgeGroupFromChild(child.id);

  LEADERSHIP_MODULES.forEach(mod => {
    const current = getLeadershipProgress(child.id, mod.id);
    const indicators = mod.indicators[ageKey] || mod.indicators.preschool || [];
    const levels = ['Not Started', 'Beginning', 'Developing', 'Proficient'];
    const levelsES = ['No Iniciado', 'Iniciando', 'En Desarrollo', 'Competente'];
    const curLevelIdx = current ? levels.indexOf(current.level) : 0;

    h += `<div class="card" style="margin-bottom:10px;border-left:5px solid ${mod.color}">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap">
        <span style="font-size:1.1rem">${mod.icon}</span>
        <b>${esc(mod.label)}</b>
        <span style="margin-left:auto">
          ${levels.map((lv,i) => `<button onclick="saveLeadershipProgress('${child.id}','${mod.id}','${lv}')"
            style="padding:3px 8px;font-size:.7rem;font-weight:700;border-radius:12px;cursor:pointer;border:2px solid ${mod.color};margin-left:3px;background:${curLevelIdx===i?mod.color:'#fff'};color:${curLevelIdx===i?'#fff':mod.color}">
            ${esc(typeof LANG!=='undefined'&&LANG==='es'?levelsES[i]:lv)}
          </button>`).join('')}
        </span>
      </div>
      <p style="font-size:.8rem;color:var(--muted);margin:0 0 6px;font-style:italic">${esc(mod.desc)}</p>
      ${indicators.length ? `<div style="background:#F8F8F8;padding:8px;border-radius:8px">
        <p style="font-size:.75rem;font-weight:700;color:var(--night);margin:0 0 4px">${t('Age-specific indicators:','Indicadores por edad:')}</p>
        <ul style="margin:0 0 0 14px;padding:0">${indicators.map(i=>`<li style="font-size:.78rem;margin-bottom:2px">${esc(i)}</li>`).join('')}</ul>
      </div>` : ''}
    </div>`;
  });
  return h;
}

function ctEngineView() {
  const ageKey = typeof getAgeKey === 'function' ? getAgeKey(CU.classId) : 'preschool';
  const templates = CT_TEMPLATES[ageKey] || CT_TEMPLATES.preschool;

  let h = `<div class="card t-teal" style="margin-bottom:14px">
    <p class="lead" style="margin-bottom:4px">&#129504; ${t('Critical Thinking Engine','Motor de Pensamiento Crítico')}</p>
    <p style="font-size:.83rem;color:var(--muted);margin:0">${t('A 6-phase framework that builds evidence-based reasoning from an early age.','Un marco de 6 fases que desarrolla el razonamiento basado en evidencia desde temprana edad.')}</p>
  </div>`;

  h += `<div class="card" style="margin-bottom:14px">
    <p style="font-weight:700;margin:0 0 10px;color:var(--night)">${t('The 6-Phase Critical Thinking Process','El Proceso de Pensamiento Crítico de 6 Fases')}</p>
    ${CT_PHASES.map((ph,i) => `<div style="display:flex;gap:10px;margin-bottom:8px;align-items:flex-start">
      <div style="min-width:30px;height:30px;background:${ph.color};border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:.85rem">${i+1}</div>
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
          <span>${ph.icon}</span><b style="font-size:.88rem;color:${ph.color}">${esc(ph.label)}</b>
        </div>
        <p style="font-size:.8rem;color:var(--muted);margin:0;font-style:italic">${esc(ph.prompt)}</p>
      </div>
    </div>`).join('')}
  </div>`;

  h += `<p class="lead" style="margin-bottom:8px">&#127775; ${t('Example Lesson Templates for Your Class','Plantillas de Lecciones para Tu Clase')}</p>`;
  templates.forEach(tmpl => {
    h += `<details style="margin-bottom:10px">
      <summary style="cursor:pointer;background:#F8F8F8;border:2px solid #EAE2DA;border-radius:12px;padding:10px 14px;font-weight:700;list-style:none">
        &#129504; ${esc(tmpl.title)}
      </summary>
      <div style="border:2px solid #EAE2DA;border-top:none;border-radius:0 0 12px 12px;padding:12px">
        ${CT_PHASES.map((ph,i) => `<div style="display:flex;gap:10px;margin-bottom:10px;align-items:flex-start">
          <div style="min-width:26px;height:26px;background:${ph.color};border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:.75rem">${i+1}</div>
          <div>
            <b style="font-size:.82rem;color:${ph.color}">${esc(ph.label)}</b>
            <p style="font-size:.8rem;color:var(--ink);margin:2px 0 0">${esc(tmpl.phases[i]||'')}</p>
          </div>
        </div>`).join('')}
      </div>
    </details>`;
  });
  return h;
}

/* ══════════════════════════════════════════════
   SECTION 12 — PBL PROJECT VIEWS
   ══════════════════════════════════════════════ */

function pblTeacherView() {
  const ageKey = typeof getAgeKey === 'function' ? getAgeKey(CU.classId) : 'preschool';
  const ageGroupKey = ageKey === 'school_age' ? 'school_age' : ageKey;
  const projects = PBL_PROJECTS.filter(p => C2_PBL_AGE==='all' || p.ageGroup===ageGroupKey);
  const completedIds = (DB.curriculum.projects||[]).filter(p=>p.classId===CU.classId).map(p=>p.projectId);

  let h = `<div class="card t-gold" style="margin-bottom:14px">
    <p class="lead" style="margin-bottom:4px">&#127919; ${t('Project-Based Learning','Aprendizaje Basado en Proyectos')}</p>
    <p style="font-size:.83rem;color:var(--muted);margin:0">${t('Deep learning through real-world projects. Each project connects multiple developmental domains.','Aprendizaje profundo mediante proyectos del mundo real. Cada proyecto conecta múltiples dominios del desarrollo.')}</p>
  </div>`;

  h += `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
    ${[['all',t('All Ages','Todas las Edades')],['infants',t('Infants','Infantes')],['toddlers',t('Toddlers','Pequeños')],['preschool',t('Preschool','Preescolar')],['school_age',t('School-Age','Edad Escolar')]].map(([k,l])=>
      `<button class="mini-btn ${C2_PBL_AGE===k?'in':'ghost'}" onclick="C2_PBL_AGE='${k}';renderPortal()">${esc(l)}</button>`
    ).join('')}
  </div>`;

  if (!projects.length) return h + `<div class="empty">${t('No projects for this age group.','No hay proyectos para este grupo de edad.')}</div>`;

  projects.forEach(proj => {
    const done = completedIds.includes(proj.id);
    h += `<div class="card" style="margin-bottom:12px;border-left:5px solid ${done?'var(--teal)':'#EAE2DA'}">
      <div style="display:flex;align-items:flex-start;gap:8px;flex-wrap:wrap;margin-bottom:8px">
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px">
            <b style="color:var(--night)">${esc(proj.title)}</b>
            <span class="tag">${esc(proj.ageGroup.replace('_',' '))}</span>
            ${done ? `<span class="tag paid">&#9989; ${t('Completed','Completado')}</span>` : ''}
          </div>
          <p style="font-size:.82rem;color:var(--muted);margin:0">${esc(proj.objective)}</p>
        </div>
      </div>
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px">
        ${proj.skills.map(s=>`<span style="background:#F0F4FF;color:var(--night);border-radius:20px;padding:2px 8px;font-size:.7rem;font-weight:700">${esc(s)}</span>`).join('')}
      </div>
      <details>
        <summary style="cursor:pointer;font-size:.82rem;color:var(--teal);font-weight:700">${t('View Full Project Guide','Ver Guía Completa del Proyecto')}</summary>
        <div style="padding-top:10px">
          <p style="font-size:.83rem;font-weight:700;margin:0 0 4px">${t('Materials:','Materiales:')}</p>
          <p style="font-size:.8rem;margin:0 0 8px">${esc(proj.materials.join(', '))}</p>
          <p style="font-size:.83rem;font-weight:700;margin:0 0 4px">${t('Teacher Steps:','Pasos del Maestro:')}</p>
          <ol style="margin:0 0 8px 16px;padding:0">${proj.teacherGuide.map(s=>`<li style="font-size:.8rem;margin-bottom:3px">${esc(s)}</li>`).join('')}</ol>
          <p style="font-size:.83rem;font-weight:700;margin:0 0 4px">${t('Assessment Criteria:','Criterios de Evaluación:')}</p>
          <ul style="margin:0 0 8px 16px;padding:0">${proj.assessment.map(s=>`<li style="font-size:.8rem;margin-bottom:2px">${esc(s)}</li>`).join('')}</ul>
          <p style="font-size:.83rem;font-weight:700;margin:0 0 4px">${t('Parent Summary (to share):','Resumen para Padres (para compartir):')}</p>
          <p style="font-size:.8rem;font-style:italic;color:var(--ink);background:#F8F8F8;padding:8px;border-radius:8px;margin:0 0 10px">${esc(proj.parentSummary)}</p>
          <button class="btn ${done?'btn-teal':'btn-gold'}" onclick="markPBLComplete('${proj.id}','${CU.classId}')">
            ${done ? `&#9989; ${t('Mark as Completed Again','Marcar como Completado Nuevamente')}` : `&#127775; ${t('Mark as Completed','Marcar como Completado')}`}
          </button>
        </div>
      </details>
    </div>`;
  });
  return h;
}

function markPBLComplete(projectId, classId) {
  (DB.curriculum.projects = DB.curriculum.projects||[]).push({
    id: uid(), projectId, classId, teacherId: CU?CU.id:'', date: getTodayDate()
  });
  saveDB(); renderPortal();
}

/* ══════════════════════════════════════════════
   SECTION 13 — PORTFOLIO VIEWS
   ══════════════════════════════════════════════ */

function portfolioTeacherView() {
  const kids = childrenForCurrentTeacher ? childrenForCurrentTeacher() : [];
  const selChild = C2_PORT_CHILD && kids.some(k=>k.id===C2_PORT_CHILD) ? C2_PORT_CHILD : (kids[0]||{}).id||'';
  C2_PORT_CHILD = selChild;

  let h = `<div class="card t-coral" style="margin-bottom:14px">
    <p class="lead" style="margin-bottom:4px">&#128203; ${t('Child Portfolio','Portafolio del Niño')}</p>
    <p style="font-size:.83rem;color:var(--muted);margin:0">${t('Document projects, achievements, milestones, and observations. Parents can see this in their portal.','Documenta proyectos, logros, hitos y observaciones. Los padres pueden verlo en su portal.')}</p>
  </div>`;

  if (!kids.length) return h + `<div class="empty">${t('No children in your class.','No hay niños en tu clase.')}</div>`;
  if (kids.length > 1) {
    h += `<div class="subtabs" style="padding-top:0">${kids.map(k=>
      `<button class="${k.id===selChild?'active':''}" onclick="C2_PORT_CHILD='${k.id}';renderPortal()">${esc(k.name)}</button>`
    ).join('')}</div>`;
  }

  const child = kids.find(k=>k.id===selChild);
  if (!child) return h;

  const types = [['all',t('All','Todo')],['achievement','&#127942; '+t('Achievement','Logro')],['project','&#127919; '+t('Project','Proyecto')],['milestone','&#127775; '+t('Milestone','Hito')],['observation','&#128270; '+t('Observation','Observación')]];
  h += `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
    ${types.map(([k,l])=>`<button class="mini-btn ${C2_PORT_TYPE===k?'in':'ghost'}" onclick="C2_PORT_TYPE='${k}';renderPortal()">${l}</button>`).join('')}
  </div>`;

  const items = getPortfolioItems(child.id, C2_PORT_TYPE);

  h += `<div class="card" style="margin-bottom:12px;background:#F8F8F8">
    <p style="font-weight:700;margin:0 0 8px">&#10133; ${t('Add Portfolio Entry for','Agregar Entrada al Portafolio de')} ${esc(child.name.split(' ')[0])}</p>
    <div class="field">
      <label>${t('Type','Tipo')}</label>
      <select id="pt-type">
        <option value="achievement">${t('Achievement','Logro')}</option>
        <option value="project">${t('Project','Proyecto')}</option>
        <option value="milestone">${t('Milestone','Hito')}</option>
        <option value="observation">${t('Observation','Observación')}</option>
      </select>
    </div>
    <div class="field"><label>${t('Title','Título')}</label><input id="pt-title" placeholder="${t('e.g., First time writing full name','ej., Primera vez escribiendo su nombre completo')}"></div>
    <div class="field"><label>${t('Description','Descripción')}</label><textarea id="pt-desc" rows="3" placeholder="${t('Describe what happened, what the child did, why it matters...','Describe lo que ocurrió, lo que el niño hizo, por qué es importante...')}"></textarea></div>
    <div class="field"><label>${t('Skills Demonstrated (comma-separated)','Habilidades Demostradas (separadas por coma)')}</label><input id="pt-skills" placeholder="${t('e.g., Fine Motor, Confidence, Literacy','ej., Motricidad Fina, Confianza, Lectura')}"></div>
    <button class="btn btn-teal" onclick="submitPortfolioEntry('${child.id}')">&#10133; ${t('Add to Portfolio','Agregar al Portafolio')}</button>
    <span id="pt-msg" style="font-size:.8rem;margin-left:10px"></span>
  </div>`;

  if (!items.length) {
    h += `<div class="empty">${t('No portfolio entries yet. Add the first one above!','Aún no hay entradas en el portafolio. ¡Agrega la primera arriba!')}</div>`;
  } else {
    items.slice().reverse().forEach(item => {
      const icons = {achievement:'&#127942;', project:'&#127919;', milestone:'&#127775;', observation:'&#128270;'};
      const colors = {achievement:'#FFD700', project:'#4A8BC4', milestone:'#4A9E4A', observation:'#8B4AB8'};
      h += `<div class="card" style="margin-bottom:10px;border-left:5px solid ${colors[item.type]||'#EAE2DA'}">
        <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:6px;flex-wrap:wrap">
          <span style="font-size:1.1rem">${icons[item.type]||'&#128203;'}</span>
          <div style="flex:1">
            <b>${esc(item.title)}</b>
            <p style="font-size:.8rem;color:var(--muted);margin:2px 0 0">${esc(item.date)} &middot; ${esc(item.type)}</p>
          </div>
        </div>
        <p style="font-size:.85rem;margin:0 0 6px">${esc(item.description)}</p>
        ${item.skills ? `<div style="display:flex;gap:4px;flex-wrap:wrap">
          ${item.skills.split(',').map(s=>`<span style="background:#F0F4FF;color:var(--night);border-radius:20px;padding:2px 8px;font-size:.72rem;font-weight:700">${esc(s.trim())}</span>`).join('')}
        </div>` : ''}
      </div>`;
    });
  }
  return h;
}

function submitPortfolioEntry(childId) {
  const type  = (document.getElementById('pt-type')||{}).value||'observation';
  const title = ((document.getElementById('pt-title')||{}).value||'').trim();
  const desc  = ((document.getElementById('pt-desc')||{}).value||'').trim();
  const skills= ((document.getElementById('pt-skills')||{}).value||'').trim();
  if (!title || !desc) { const el=document.getElementById('pt-msg'); if(el){el.textContent=t('Please fill in title and description.','Por favor completa el título y la descripción.');el.style.color='var(--coral)';} return; }
  addPortfolioItem(childId, type, title, desc, skills);
}

/* ══════════════════════════════════════════════
   SECTION 14 — READINESS TEACHER VIEW
   ══════════════════════════════════════════════ */

function readinessTeacherView() {
  const kids = childrenForCurrentTeacher ? childrenForCurrentTeacher() : [];
  const selChild = C2_RDNS_CHILD && kids.some(k=>k.id===C2_RDNS_CHILD) ? C2_RDNS_CHILD : (kids[0]||{}).id||'';
  C2_RDNS_CHILD = selChild;

  let h = `<div class="card t-teal" style="margin-bottom:14px">
    <p class="lead" style="margin-bottom:4px">&#127891; ${t('Readiness Assessment','Evaluación de Preparación')}</p>
    <p style="font-size:.83rem;color:var(--muted);margin:0">${t('Track school readiness AND life readiness — because success requires both.','Monitorea la preparación escolar Y la preparación para la vida — porque el éxito requiere ambas.')}</p>
  </div>`;

  if (!kids.length) return h + `<div class="empty">${t('No children in your class.','No hay niños en tu clase.')}</div>`;
  if (kids.length > 1) {
    h += `<div class="subtabs" style="padding-top:0">${kids.map(k=>
      `<button class="${k.id===selChild?'active':''}" onclick="C2_RDNS_CHILD='${k.id}';renderPortal()">${esc(k.name)}</button>`
    ).join('')}</div>`;
  }

  const child = kids.find(k=>k.id===selChild);
  if (!child) return h;

  const schoolPct = getChildReadinessAvg(child.id, 'school');
  const lifePct   = getChildReadinessAvg(child.id, 'life');

  h += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
    <div class="stat-box"><div class="stat-num">${schoolPct}%</div><div class="stat-lbl">${t('School Readiness','Preparación Escolar')}</div></div>
    <div class="stat-box"><div class="stat-num">${lifePct}%</div><div class="stat-lbl">${t('Life Readiness','Preparación para la Vida')}</div></div>
  </div>`;

  h += _readinessSectionTeacher(child.id, 'school', '&#127891; '+t('School Readiness','Preparación Escolar'), SCHOOL_READINESS, '#4A8BC4');
  h += _readinessSectionTeacher(child.id, 'life', '&#127775; '+t('Life Readiness','Preparación para la Vida'), LIFE_READINESS, '#4A9E4A');
  return h;
}

function _readinessSectionTeacher(childId, type, heading, criteria, color) {
  let h = `<div class="card" style="margin-bottom:14px;border-left:5px solid ${color}">
    <p style="font-weight:700;color:${color};margin:0 0 10px">${heading}</p>`;
  criteria.forEach(c => {
    const score = getReadinessScore(childId, c.id, type);
    const curLevel = score ? score.level : 'Not Yet';
    h += `<div style="margin-bottom:10px;padding:8px;background:#F8F8F8;border-radius:8px">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px;flex-wrap:wrap">
        <span>${c.icon}</span><b style="font-size:.85rem">${esc(c.label)}</b>
        <p style="font-size:.75rem;color:var(--muted);margin:0;flex-basis:100%">${esc(c.desc)}</p>
      </div>
      <div style="display:flex;gap:5px;flex-wrap:wrap">
        ${RDNS_LEVELS.map(lv => `<button onclick="saveReadinessScore('${childId}','${c.id}','${type}','${lv}')"
          style="padding:3px 10px;border-radius:20px;font-size:.72rem;font-weight:700;cursor:pointer;border:2px solid ${color};background:${curLevel===lv?color:'#fff'};color:${curLevel===lv?'#fff':color}">
          ${esc(rdnsLabel(lv))}
        </button>`).join('')}
      </div>
    </div>`;
  });
  h += '</div>';
  return h;
}

/* ══════════════════════════════════════════════
   SECTION 15 — PARENT VIEWS
   ══════════════════════════════════════════════ */

function parentRoadmapView(childId) {
  const rm = getRoadmapForChild(childId);
  const child = DB.children.find(c=>c.id===childId);
  if (!rm || !child) return '';

  let h = `<div class="card t-gold" style="margin-bottom:14px">
    <h3 style="margin:0 0 4px">&#127919; ${esc(child.name.split(' ')[0])}'s ${t('Learning Roadmap','Ruta de Aprendizaje')}</h3>
    <p class="soft" style="font-size:.83rem;margin:0">${esc(rm.label)} &middot; ${esc(rm.ageRange)}</p>
  </div>`;

  h += _rdSection('&#127919; '+t('What','Lo que')+' ' + esc(child.name.split(' ')[0]) + ' '+t('Is Learning','Está Aprendiendo'), rm.learningGoals, '#4A8BC4');
  h += _rdSection('&#11088; '+t('Life Skills Being Built','Habilidades para la Vida en Desarrollo'), rm.lifeSkills, '#4A9E4A');
  h += _rdSection('&#129504; '+t('Thinking Skills','Habilidades de Pensamiento'), rm.thinkingSkills, '#8B4AB8');
  h += _rdSection('&#10084; '+t('Social Skills','Habilidades Sociales'), rm.socialSkills, '#E86B6B');
  h += _rdSection('&#128200; '+t('Leadership in Development','Liderazgo en Desarrollo'), rm.leadershipSkills, '#C8960A');
  h += _rdSection('&#128180; '+t('Financial Literacy Goals','Metas de Educación Financiera'), rm.financialLiteracy, '#2E9E8A');
  h += _rdSection('&#127981; '+t('Entrepreneurship Skills','Habilidades de Emprendimiento'), rm.entrepreneurship, '#B87828');
  h += _rdSection('&#127912; '+t('Creativity Goals','Metas de Creatividad'), rm.creativityGoals, '#D45AA0');
  return h;
}

function parentPortfolioView(childId) {
  const child = DB.children.find(c=>c.id===childId);
  if (!child) return '';
  const items = getPortfolioItems(childId, 'all');

  let h = `<div class="card t-teal" style="margin-bottom:14px">
    <h3 style="margin:0 0 4px">&#128203; ${esc(child.name.split(' ')[0])}'s ${t('Portfolio','Portafolio')}</h3>
    <p style="font-size:.83rem;color:var(--muted);margin:0">${items.length} ${t("items documenting your child's growth and achievements.","elementos que documentan el crecimiento y los logros de tu hijo.")}</p>
  </div>`;

  if (!items.length) return h + `<div class="empty">${t("Your child's teacher will add portfolio items here as they achieve milestones and complete projects.","El maestro de tu hijo agregará elementos al portafolio aquí cuando logre hitos y complete proyectos.")}</div>`;

  items.slice().reverse().forEach(item => {
    const icons = {achievement:'&#127942;', project:'&#127919;', milestone:'&#127775;', observation:'&#128270;'};
    const colors = {achievement:'#FFD700', project:'#4A8BC4', milestone:'#4A9E4A', observation:'#8B4AB8'};
    h += `<div class="card" style="margin-bottom:10px;border-left:5px solid ${colors[item.type]||'#EAE2DA'}">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
        <span style="font-size:1.1rem">${icons[item.type]||'&#128203;'}</span>
        <div>
          <b>${esc(item.title)}</b>
          <p style="font-size:.78rem;color:var(--muted);margin:0">${esc(item.date)} &middot; ${esc(item.type)}</p>
        </div>
      </div>
      <p style="font-size:.85rem;margin:0 0 6px">${esc(item.description)}</p>
      ${item.skills ? `<div style="display:flex;gap:4px;flex-wrap:wrap">${item.skills.split(',').map(s=>`<span style="background:#F0F4FF;color:var(--night);border-radius:20px;padding:2px 8px;font-size:.7rem;font-weight:700">${esc(s.trim())}</span>`).join('')}</div>` : ''}
    </div>`;
  });
  return h;
}

function parentReadinessView(childId) {
  const child = DB.children.find(c=>c.id===childId);
  if (!child) return '';

  const schoolPct = getChildReadinessAvg(childId, 'school');
  const lifePct   = getChildReadinessAvg(childId, 'life');

  let h = `<div class="card t-gold" style="margin-bottom:14px">
    <h3 style="margin:0 0 4px">&#127891; ${esc(child.name.split(' ')[0])}'s ${t('Readiness Profile','Perfil de Preparación')}</h3>
    <p style="font-size:.83rem;color:var(--muted);margin:0">${t("Assessed by your child's teacher, updated regularly.","Evaluado por el maestro de tu hijo, actualizado regularmente.")}</p>
  </div>`;

  h += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
    <div class="stat-box"><div class="stat-num">${schoolPct}%</div><div class="stat-lbl">${t('School Readiness','Preparación Escolar')}</div></div>
    <div class="stat-box"><div class="stat-num">${lifePct}%</div><div class="stat-lbl">${t('Life Readiness','Preparación para la Vida')}</div></div>
  </div>`;

  h += _rdnsParentSection(childId, 'school', '&#127891; '+t('School Readiness','Preparación Escolar'), SCHOOL_READINESS, '#4A8BC4');
  h += _rdnsParentSection(childId, 'life', '&#127775; '+t('Life Readiness','Preparación para la Vida'), LIFE_READINESS, '#4A9E4A');
  return h;
}

function _rdnsParentSection(childId, type, heading, criteria, color) {
  let h = `<div class="card" style="margin-bottom:14px;border-left:5px solid ${color}">
    <p style="font-weight:700;color:${color};margin:0 0 10px">${heading}</p>`;
  criteria.forEach(c => {
    const score = getReadinessScore(childId, c.id, type);
    const curLevel = score ? score.level : 'Not Yet';
    const levelIdx = RDNS_LEVELS.indexOf(curLevel);
    const pct = Math.round((levelIdx / 3) * 100);
    h += `<div style="margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
        <span>${c.icon}</span>
        <b style="font-size:.85rem;flex:1">${esc(c.label)}</b>
        <span style="padding:2px 10px;border-radius:20px;font-size:.72rem;font-weight:700;background:${RDNS_COLORS[levelIdx]||'#EEE'};color:#333">${esc(rdnsLabel(curLevel))}</span>
      </div>
      <div style="background:#EAE2DA;border-radius:999px;height:8px;overflow:hidden">
        <div style="background:${color};width:${pct}%;height:100%;border-radius:999px;transition:width .5s"></div>
      </div>
    </div>`;
  });
  h += '</div>';
  return h;
}

function parentWeeklyView(childId) {
  const child = DB.children.find(c=>c.id===childId);
  if (!child) return '';

  // Get last 7 days of plans and notes
  const today = getTodayDate();
  const last7 = Array.from({length:7},(_,i)=>{
    const d = new Date(today);
    d.setDate(d.getDate()-i);
    return d.toISOString().split('T')[0];
  });

  const plans = (DB.curriculum.plans||[]).filter(p => p.classId===child.classId && last7.includes(p.date));
  const notes = (DB.curriculum.teacherNotes||[]).filter(n => n.childId===child.id && last7.includes(n.date));
  const portfolioThisWeek = getPortfolioItems(child.id,'all').filter(p=>last7.includes(p.date));
  const smMetrics = (DB.curriculum.successMetrics||[]).filter(m=>m.childId===child.id);

  const totalActs = plans.reduce((s,p)=>s+(p.activities||[]).length,0);
  const doneActs  = plans.reduce((s,p)=>s+(p.activities||[]).filter(a=>a.status==='completed').length,0);

  // Count domains covered
  const domainCounts = {};
  plans.forEach(p=>(p.activities||[]).forEach(a=>{
    if (a.status==='completed') domainCounts[a.catId]=(domainCounts[a.catId]||0)+1;
  }));

  let h = `<div class="card t-night" style="margin-bottom:14px">
    <h3 style="margin:0 0 4px;color:#fff">&#128197; ${t("This Week's Learning Summary","Resumen de Aprendizaje de Esta Semana")}</h3>
    <p style="font-size:.83rem;color:#BFD4FF;margin:0">${esc(child.name)} &middot; ${esc(last7[last7.length-1])} to ${esc(last7[0])}</p>
  </div>`;

  h += `<div class="stat-grid" style="margin-bottom:14px">
    <div class="stat-box"><div class="stat-num">${doneActs}</div><div class="stat-lbl">${t('Activities Done','Actividades Realizadas')}</div></div>
    <div class="stat-box"><div class="stat-num">${notes.length}</div><div class="stat-lbl">${t('Teacher Notes','Notas del Maestro')}</div></div>
    <div class="stat-box"><div class="stat-num">${portfolioThisWeek.length}</div><div class="stat-lbl">${t('Portfolio Items','Elementos del Portafolio')}</div></div>
    <div class="stat-box"><div class="stat-num">${smMetrics.length}</div><div class="stat-lbl">${t('Skills Tracked','Habilidades Rastreadas')}</div></div>
  </div>`;

  if (Object.keys(domainCounts).length) {
    h += `<div class="card" style="margin-bottom:10px">
      <p class="lead" style="margin-bottom:8px">&#129504; ${t('Domains Covered This Week','Dominios Cubiertos Esta Semana')}</p>
      ${Object.entries(domainCounts).map(([catId, count]) => {
        const cat = CURR_CATS.find(c=>c.id===catId);
        return cat ? `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <span style="color:${cat.color}">${cat.icon}</span>
          <span style="font-size:.85rem;font-weight:700;flex:1">${esc(cat.label)}</span>
          <span style="background:${cat.color}20;color:${cat.color};padding:2px 10px;border-radius:20px;font-size:.75rem;font-weight:700">${count} ${count===1?t('activity','actividad'):t('activities','actividades')}</span>
        </div>` : '';
      }).join('')}
    </div>`;
  }

  if (notes.length) {
    h += `<div class="card t-teal" style="margin-bottom:10px">
      <p class="lead" style="margin-bottom:8px">&#128203; ${t('Teacher Observations This Week','Observaciones del Maestro Esta Semana')}</p>`;
    notes.forEach(n => {
      h += `<div style="border-bottom:1px solid #EAE2DA;padding-bottom:8px;margin-bottom:8px;last-child:border-none">
        <p style="font-size:.78rem;color:var(--muted);font-weight:700;margin:0 0 4px">${esc(n.date)}</p>
        ${n.strengths ? `<p style="font-size:.82rem;margin:0 0 3px"><b>${t('Excelled at:','Excelió en:')}</b> ${esc(n.strengths)}</p>` : ''}
        ${n.moments   ? `<p style="font-size:.82rem;margin:0 0 3px"><b>${t('Special moment:','Momento especial:')}</b> ${esc(n.moments)}</p>` : ''}
        ${n.recs      ? `<p style="font-size:.82rem;margin:0"><b>${t('Try at home:','Prueba en casa:')}</b> ${esc(n.recs)}</p>` : ''}
      </div>`;
    });
    h += '</div>';
  }

  if (portfolioThisWeek.length) {
    h += `<div class="card" style="margin-bottom:10px">
      <p class="lead" style="margin-bottom:8px">&#127942; ${t('New Portfolio Items This Week','Nuevos Elementos del Portafolio Esta Semana')}</p>`;
    portfolioThisWeek.forEach(item => {
      h += `<div style="padding:8px;background:#F8F8F8;border-radius:8px;margin-bottom:6px">
        <b style="font-size:.85rem">${esc(item.title)}</b>
        <p style="font-size:.8rem;color:var(--muted);margin:2px 0 0">${esc(item.description)}</p>
      </div>`;
    });
    h += '</div>';
  }

  if (!totalActs && !notes.length) {
    h += `<div class="empty">${t("No learning data available for this week yet. Check back after your child's first full week.","Aún no hay datos de aprendizaje disponibles para esta semana. Regresa después de la primera semana completa de tu hijo.")}</div>`;
  }
  return h;
}

/* ══════════════════════════════════════════════
   SECTION 16 — ADMIN ANALYTICS VIEW
   ══════════════════════════════════════════════ */

function adminAnalyticsView2() {
  const allKids = DB.children || [];
  const allPlans = DB.curriculum.plans || [];
  const allMilestones = DB.curriculum.milestones || [];
  const allPortfolio = DB.curriculum.portfolio || [];
  const allProjects = DB.curriculum.projects || [];
  const allReadiness = DB.curriculum.readinessScores || [];
  const allFL = DB.curriculum.flMilestones || [];
  const allLeadership = DB.curriculum.leadershipProgress || [];
  const allSM = DB.curriculum.successMetrics || [];

  // Completion stats
  const totalActs   = allPlans.reduce((s,p)=>s+(p.activities||[]).length,0);
  const doneActs    = allPlans.reduce((s,p)=>s+(p.activities||[]).filter(a=>a.status==='completed').length,0);
  const completionPct = totalActs ? Math.round((doneActs/totalActs)*100) : 0;

  let h = `<div class="card t-night" style="margin-bottom:14px">
    <p class="lead" style="color:#fff;margin-bottom:4px">&#128201; ${t('Advanced Analytics Dashboard','Panel de Análisis Avanzado')}</p>
    <p style="font-size:.83rem;color:#BFD4FF;margin:0">${t('Full visibility across curriculum, milestones, readiness, portfolios, and success metrics.','Visibilidad completa del currículo, hitos, preparación, portafolios y métricas de éxito.')}</p>
  </div>`;

  h += `<div class="stat-grid" style="margin-bottom:14px">
    <div class="stat-box"><div class="stat-num">${completionPct}%</div><div class="stat-lbl">${t('Activity Completion','Finalización de Actividades')}</div></div>
    <div class="stat-box"><div class="stat-num">${allPortfolio.length}</div><div class="stat-lbl">${t('Portfolio Items','Elementos del Portafolio')}</div></div>
    <div class="stat-box"><div class="stat-num">${allProjects.length}</div><div class="stat-lbl">${t('PBL Projects Done','Proyectos PBL Completados')}</div></div>
    <div class="stat-box"><div class="stat-num">${allReadiness.length}</div><div class="stat-lbl">${t('Readiness Assessments','Evaluaciones de Preparación')}</div></div>
    <div class="stat-box"><div class="stat-num">${allFL.length}</div><div class="stat-lbl">${t('FL Milestones','Hitos de Ed. Financiera')}</div></div>
    <div class="stat-box"><div class="stat-num">${allLeadership.length}</div><div class="stat-lbl">${t('Leadership Tracked','Liderazgo Rastreado')}</div></div>
  </div>`;

  // Domain mastery heatmap
  const domainTotals = {};
  const domainDone   = {};
  allPlans.forEach(p=>(p.activities||[]).forEach(a=>{
    domainTotals[a.catId]=(domainTotals[a.catId]||0)+1;
    if(a.status==='completed') domainDone[a.catId]=(domainDone[a.catId]||0)+1;
  }));

  if (Object.keys(domainTotals).length) {
    h += `<div class="card" style="margin-bottom:14px">
      <p class="lead" style="margin-bottom:10px">&#127919; ${t('Domain Mastery Rates','Tasas de Dominio por Área')}</p>`;
    CURR_CATS.forEach(cat => {
      const total = domainTotals[cat.id]||0;
      const done  = domainDone[cat.id]||0;
      const pct   = total ? Math.round((done/total)*100) : 0;
      h += `<div style="margin-bottom:8px">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
          <span style="color:${cat.color}">${cat.icon}</span>
          <b style="font-size:.83rem;flex:1">${esc(cat.label)}</b>
          <span style="font-size:.78rem;color:var(--muted)">${done}/${total} (${pct}%)</span>
        </div>
        <div style="background:#EAE2DA;border-radius:999px;height:10px;overflow:hidden">
          <div style="background:${cat.color};width:${pct}%;height:100%;border-radius:999px;transition:width .5s"></div>
        </div>
      </div>`;
    });
    h += '</div>';
  }

  // Readiness overview per class
  if (DB.classes.length) {
    h += `<div class="card" style="margin-bottom:14px">
      <p class="lead" style="margin-bottom:10px">&#127891; ${t('Readiness Scores by Class','Puntajes de Preparación por Clase')}</p>`;
    DB.classes.forEach(cls => {
      const classKids = allKids.filter(k=>k.classId===cls.id);
      if (!classKids.length) return;
      const schoolAvgs = classKids.map(k=>getChildReadinessAvg(k.id,'school'));
      const lifeAvgs   = classKids.map(k=>getChildReadinessAvg(k.id,'life'));
      const avgSchool  = Math.round(schoolAvgs.reduce((a,b)=>a+b,0)/schoolAvgs.length);
      const avgLife    = Math.round(lifeAvgs.reduce((a,b)=>a+b,0)/lifeAvgs.length);
      h += `<div style="padding:10px;background:#F8F8F8;border-radius:10px;margin-bottom:8px">
        <b>${esc(cls.name)}</b> <span class="soft">(${classKids.length} children)</span>
        <div style="display:flex;gap:10px;margin-top:6px">
          <div style="flex:1">
            <p style="font-size:.75rem;color:var(--muted);margin:0 0 3px">${t('School Readiness','Preparación Escolar')}</p>
            <div style="background:#EAE2DA;border-radius:999px;height:8px;overflow:hidden">
              <div style="background:#4A8BC4;width:${avgSchool}%;height:100%;border-radius:999px"></div>
            </div>
            <p style="font-size:.75rem;text-align:right;margin:2px 0 0">${avgSchool}%</p>
          </div>
          <div style="flex:1">
            <p style="font-size:.75rem;color:var(--muted);margin:0 0 3px">${t('Life Readiness','Preparación para la Vida')}</p>
            <div style="background:#EAE2DA;border-radius:999px;height:8px;overflow:hidden">
              <div style="background:#4A9E4A;width:${avgLife}%;height:100%;border-radius:999px"></div>
            </div>
            <p style="font-size:.75rem;text-align:right;margin:2px 0 0">${avgLife}%</p>
          </div>
        </div>
      </div>`;
    });
    h += '</div>';
  }

  // Portfolio breakdown by type
  if (allPortfolio.length) {
    const byType = {};
    allPortfolio.forEach(p=>byType[p.type]=(byType[p.type]||0)+1);
    h += `<div class="card" style="margin-bottom:14px">
      <p class="lead" style="margin-bottom:10px">&#128203; ${t('Portfolio Distribution','Distribución del Portafolio')}</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${Object.entries(byType).map(([t,c])=>`<div class="stat-box" style="flex:1;min-width:80px">
          <div class="stat-num">${c}</div><div class="stat-lbl">${esc(t)}</div>
        </div>`).join('')}
      </div>
    </div>`;
  }

  // Financial literacy progress
  if (allFL.length) {
    const flByDomain = {};
    allFL.forEach(m=>flByDomain[m.domainId]=(flByDomain[m.domainId]||[]).concat(m.level));
    h += `<div class="card" style="margin-bottom:14px">
      <p class="lead" style="margin-bottom:10px">&#128180; ${t('Financial Literacy Progress','Progreso de Educación Financiera')}</p>`;
    FL_DOMAINS.forEach(d => {
      const levels = flByDomain[d.id]||[];
      if (!levels.length) return;
      const avg = Math.round(levels.reduce((a,b)=>a+b,0)/levels.length);
      const pct = Math.round((avg/d.milestones.length)*100);
      h += `<div style="margin-bottom:8px">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
          <span>${d.icon}</span>
          <b style="font-size:.83rem;flex:1">${esc(d.label)}</b>
          <span style="font-size:.78rem;color:var(--muted)">${levels.length} ${t('kids assessed · avg level','niños evaluados · nivel promedio')} ${avg}</span>
        </div>
        <div style="background:#EAE2DA;border-radius:999px;height:8px;overflow:hidden">
          <div style="background:${d.color};width:${pct}%;height:100%;border-radius:999px"></div>
        </div>
      </div>`;
    });
    h += '</div>';
  }

  // Leadership progress summary
  if (allLeadership.length) {
    const ldByModule = {};
    allLeadership.forEach(m=>ldByModule[m.moduleId]=(ldByModule[m.moduleId]||[]).concat(m.level));
    const levels = ['Not Started','Beginning','Developing','Proficient'];
    const levelsESAdmin = ['No Iniciado','Iniciando','En Desarrollo','Competente'];
    h += `<div class="card" style="margin-bottom:14px">
      <p class="lead" style="margin-bottom:10px">&#128200; ${t('Leadership Development Distribution','Distribución del Desarrollo del Liderazgo')}</p>`;
    LEADERSHIP_MODULES.forEach(mod => {
      const entries = ldByModule[mod.id]||[];
      if (!entries.length) return;
      const counts = {};
      entries.forEach(lv=>counts[lv]=(counts[lv]||0)+1);
      h += `<div style="margin-bottom:8px;padding:8px;background:#F8F8F8;border-radius:8px">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px">
          <span>${mod.icon}</span><b style="font-size:.83rem">${esc(mod.label)}</b>
          <span class="soft" style="font-size:.75rem">${entries.length} ${t('children','niños')}</span>
        </div>
        <div style="display:flex;gap:4px;flex-wrap:wrap">
          ${levels.map((lv,i)=>counts[lv]?`<span style="padding:2px 8px;border-radius:20px;font-size:.7rem;font-weight:700;background:${mod.color}30;color:${mod.color}">${esc(typeof LANG!=='undefined'&&LANG==='es'?levelsESAdmin[i]:lv)}: ${counts[lv]}</span>`:''). join('')}
        </div>
      </div>`;
    });
    h += '</div>';
  }

  if (!totalActs && !allPortfolio.length) {
    h += `<div class="empty">${t('Analytics will populate as teachers log activities and assessments.','Las analíticas se llenarán a medida que los maestros registren actividades y evaluaciones.')}</div>`;
  }
  return h;
}

function adminRoadmapView() { return roadmapView(true); }

function adminPBLView() {
  const completedByClass = {};
  (DB.curriculum.projects||[]).forEach(p=>{
    completedByClass[p.classId]=(completedByClass[p.classId]||0)+1;
  });

  let h = `<div class="card t-teal" style="margin-bottom:14px">
    <p class="lead" style="margin-bottom:4px">&#127919; ${t('Project-Based Learning Overview','Resumen de Aprendizaje Basado en Proyectos')}</p>
    <p style="font-size:.83rem;color:var(--muted);margin:0">${PBL_PROJECTS.length} ${t('projects available across all age groups.','proyectos disponibles en todos los grupos de edad.')}</p>
  </div>`;

  h += `<div class="stat-grid" style="margin-bottom:14px">
    <div class="stat-box"><div class="stat-num">${PBL_PROJECTS.length}</div><div class="stat-lbl">${t('Total Projects','Proyectos Totales')}</div></div>
    <div class="stat-box"><div class="stat-num">${(DB.curriculum.projects||[]).length}</div><div class="stat-lbl">${t('Completions Logged','Completados Registrados')}</div></div>
  </div>`;

  if (DB.classes.length) {
    h += `<div class="card" style="margin-bottom:14px"><p class="lead" style="margin-bottom:8px">${t('Completions by Class','Completados por Clase')}</p>`;
    DB.classes.forEach(cls => {
      h += `<div style="display:flex;align-items:center;gap:8px;padding:8px;border-radius:8px;background:#F8F8F8;margin-bottom:6px">
        <b style="flex:1">${esc(cls.name)}</b>
        <span class="tag" style="background:var(--teal);color:#fff">${completedByClass[cls.id]||0} ${t('completed','completados')}</span>
      </div>`;
    });
    h += '</div>';
  }

  h += `<p class="lead" style="margin-bottom:8px">${t('Available Projects by Age Group','Proyectos Disponibles por Grupo de Edad')}</p>`;
  ['infants','toddlers','preschool','school_age'].forEach(ag => {
    const ps = PBL_PROJECTS.filter(p=>p.ageGroup===ag);
    if (!ps.length) return;
    const agLabel = {infants:t('Infants','Infantes'),toddlers:t('Toddlers','Pequeños'),preschool:t('Preschool','Preescolar'),school_age:t('School-Age','Edad Escolar')}[ag];
    h += `<div style="margin-bottom:10px"><p style="font-weight:700;color:var(--night);margin:0 0 6px">${esc(agLabel)}</p>`;
    ps.forEach(p=>{
      h+=`<div style="padding:8px 12px;background:#F8F8F8;border-radius:8px;margin-bottom:4px">
        <b style="font-size:.88rem">${esc(p.title)}</b>
        <p style="font-size:.78rem;color:var(--muted);margin:2px 0 0">${esc(p.objective)}</p>
      </div>`;
    });
    h += '</div>';
  });
  return h;
}

/* ══════════════════════════════════════════════
   SECTION 17 — FUNCTION OVERRIDES
   Wire new tabs into existing view functions
   ══════════════════════════════════════════════ */
(function wireNewTabs() {
  /* ── Helpers ── */
  function injectTabsIntoBar(h, newTabPairs) {
    const idx = h.indexOf('</div>');
    if (idx === -1) return h;
    const buttons = newTabPairs.map(([k,l]) =>
      `<button class="${CURR_SUB===k?'active':''}" onclick="CURR_SUB='${k}';renderPortal()">${l}</button>`
    ).join('');
    return h.slice(0, idx) + buttons + h.slice(idx);
  }

  function allTabBar(allPairs) {
    return '<div class="subtabs">' + allPairs.map(([k,l]) =>
      `<button class="${CURR_SUB===k?'active':''}" onclick="CURR_SUB='${k}';renderPortal()">${l}</button>`
    ).join('') + '</div>';
  }

  /* ── Teacher ── */
  const TEACHER_ORIG_TABS = [
    ['today',     '&#128197; '+t("Today's Plan","Plan de Hoy")],
    ['milestones','&#127919; '+t('Milestones','Hitos')],
    ['success',   '&#11088; '+t('Success Metrics','Métricas de Éxito')],
    ['library',   '&#128218; '+t('Activity Library','Biblioteca de Actividades')],
    ['pathways',  '&#128197; '+t('Monthly Pathways','Rutas Mensuales')],
    ['generator', '&#9889; '+t('AI Generator','Generador IA')]
  ];
  const TEACHER_NEW_TABS = [
    ['roadmaps',    '&#127919; '+t('Roadmaps','Rutas')],
    ['ent_pathway', '&#127981; '+t('Entrepreneur','Emprendedor')],
    ['fl_tracker',  '&#128180; '+t('Fin. Literacy','Ed. Financiera')],
    ['leadership',  '&#128200; '+t('Leadership','Liderazgo')],
    ['ct_engine',   '&#129504; '+t('Critical Thinking','Pensamiento Crítico')],
    ['pbl',         '&#127919; '+t('Projects','Proyectos')],
    ['portfolio',   '&#128203; '+t('Portfolio','Portafolio')],
    ['readiness',   '&#127891; '+t('Readiness','Preparación')]
  ];

  const ALL_TEACHER_KEYS = [...TEACHER_ORIG_TABS, ...TEACHER_NEW_TABS].map(([k])=>k).concat(['coach','resources']);

  const _origTeacher = teacherCurriculumView;
  teacherCurriculumView = function() {
    const newKeys = TEACHER_NEW_TABS.map(([k])=>k);
    if (!newKeys.includes(CURR_SUB)) {
      if (!ALL_TEACHER_KEYS.includes(CURR_SUB)) CURR_SUB = 'today';
      return injectTabsIntoBar(_origTeacher(), TEACHER_NEW_TABS);
    }
    // Build full view for new tabs
    const ageKey  = typeof getAgeKey === 'function' ? getAgeKey(CU.classId) : 'preschool';
    const ageInfo = CURR_AGE_INFO[ageKey] || CURR_AGE_INFO.preschool;
    const theme   = typeof getWeekTheme === 'function' ? getWeekTheme(CU.classId) : '';

    let h = allTabBar([...TEACHER_ORIG_TABS, ...TEACHER_NEW_TABS]);
    h += `<div style="background:${ageInfo.color};border-radius:14px;padding:10px 16px;margin-bottom:14px;display:flex;align-items:center;gap:10px">
      <span style="font-size:1.5rem">${ageInfo.icon}</span>
      <div><b style="color:var(--night)">${esc(ageInfo.label)}</b> &nbsp;&#183;&nbsp; <span class="soft">${esc(ageInfo.range)}</span></div>
      <div style="margin-left:auto;font-weight:700;color:var(--night)">&#127808; ${t('Theme:','Tema:')} ${esc(theme)}</div>
    </div>`;

    if (CURR_SUB === 'roadmaps')    h += roadmapView(false);
    if (CURR_SUB === 'ent_pathway') h += entPathwayView();
    if (CURR_SUB === 'fl_tracker')  h += flTeacherView();
    if (CURR_SUB === 'leadership')  h += leadershipTeacherView();
    if (CURR_SUB === 'ct_engine')   h += ctEngineView();
    if (CURR_SUB === 'pbl')         h += pblTeacherView();
    if (CURR_SUB === 'portfolio')   h += portfolioTeacherView();
    if (CURR_SUB === 'readiness')   h += readinessTeacherView();
    return h;
  };

  /* ── Parent ── */
  const PARENT_ORIG_TABS = [
    ['today',     '&#128197; '+t("Today's Learning","Aprendizaje de Hoy")],
    ['progress',  '&#128202; '+t('Progress','Progreso')],
    ['milestones','&#127919; '+t('Milestones','Hitos')],
    ['success',   '&#11088; '+t('Success Profile','Perfil de Éxito')],
    ['report',    '&#128203; '+t('Full Report','Reporte Completo')]
  ];
  const PARENT_NEW_TABS = [
    ['roadmap',   '&#127919; '+t('Roadmap','Ruta')],
    ['weekly',    '&#128197; '+t('Weekly Summary','Resumen Semanal')],
    ['portfolio', '&#128203; '+t('Portfolio','Portafolio')],
    ['readiness', '&#127891; '+t('Readiness','Preparación')]
  ];
  const ALL_PARENT_KEYS  = [...PARENT_ORIG_TABS,  ...PARENT_NEW_TABS ].map(([k])=>k);

  const _origParent = parentLearningView;
  parentLearningView = function() {
    const kids = DB.children.filter(c => (c.parentIds||[]).includes(CU.id));
    if (!kids.length) return _origParent();

    const selChild = CURR_CHILD_SEL && kids.some(k=>k.id===CURR_CHILD_SEL) ? CURR_CHILD_SEL : kids[0].id;
    CURR_CHILD_SEL = selChild;

    const newKeys = PARENT_NEW_TABS.map(([k])=>k);
    if (!newKeys.includes(CURR_SUB)) {
      if (!ALL_PARENT_KEYS.includes(CURR_SUB)) CURR_SUB = 'today';
      return injectTabsIntoBar(_origParent(), PARENT_NEW_TABS);
    }

    let h = allTabBar([...PARENT_ORIG_TABS, ...PARENT_NEW_TABS]);
    if (kids.length > 1) {
      h += `<div class="subtabs" style="padding-top:0">${kids.map(k=>
        `<button class="${k.id===selChild?'active':''}" onclick="CURR_CHILD_SEL='${k.id}';renderPortal()">${esc(k.name)}</button>`
      ).join('')}</div>`;
    }
    if (CURR_SUB === 'roadmap')   h += parentRoadmapView(selChild);
    if (CURR_SUB === 'weekly')    h += parentWeeklyView(selChild);
    if (CURR_SUB === 'portfolio') h += parentPortfolioView(selChild);
    if (CURR_SUB === 'readiness') h += parentReadinessView(selChild);
    return h;
  };

  /* ── Admin ── */
  const ADMIN_ORIG_TABS = [
    ['overview',  '&#128202; '+t('Overview','Resumen')],
    ['themes',    '&#127808; '+t('Weekly Themes','Temas Semanales')],
    ['analytics', '&#128201; '+t('Analytics','Analíticas')],
    ['success',   '&#11088; '+t('Success Analytics','Analíticas de Éxito')],
    ['pathways',  '&#128197; '+t('Monthly Pathways','Rutas Mensuales')],
    ['library',   '&#128218; '+t('Library','Biblioteca')]
  ];
  const ADMIN_NEW_TABS = [
    ['roadmaps',    '&#127919; '+t('Roadmaps','Rutas')],
    ['analytics2',  '&#128201; '+t('Advanced Analytics','Análisis Avanzado')],
    ['pbl_admin',   '&#127919; '+t('PBL Projects','Proyectos PBL')],
  ];
  const ALL_ADMIN_KEYS   = [...ADMIN_ORIG_TABS,   ...ADMIN_NEW_TABS  ].map(([k])=>k);

  const _origAdmin = adminCurriculumView;
  adminCurriculumView = function() {
    const newKeys = ADMIN_NEW_TABS.map(([k])=>k);
    if (!newKeys.includes(CURR_SUB)) {
      if (!ALL_ADMIN_KEYS.includes(CURR_SUB)) CURR_SUB = 'overview';
      return injectTabsIntoBar(_origAdmin(), ADMIN_NEW_TABS);
    }
    let h = allTabBar([...ADMIN_ORIG_TABS, ...ADMIN_NEW_TABS]);
    if (CURR_SUB === 'roadmaps')   h += adminRoadmapView();
    if (CURR_SUB === 'analytics2') h += adminAnalyticsView2();
    if (CURR_SUB === 'pbl_admin')  h += adminPBLView();
    return h;
  };
})();

/* ══════════════════════════════════════════════
   SECTION 18 — CSS
   ══════════════════════════════════════════════ */
(function addC2Styles() {
  const style = document.createElement('style');
  style.textContent = `
    .c2-phase-step { display:flex; gap:10px; margin-bottom:10px; align-items:flex-start; }
    .c2-phase-num  { min-width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; color:#fff; font-size:.8rem; flex-shrink:0; }
    .c2-roadmap-band summary::-webkit-details-marker { display:none; }
    .c2-roadmap-band summary { list-style: none; }
    .subtabs { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .subtabs::-webkit-scrollbar { height: 3px; }
    .subtabs::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }
  `;
  document.head.appendChild(style);
})();
