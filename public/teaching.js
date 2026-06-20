/* =============================================================================
   Mini Star Child Care — Teacher Coaching & Guided Instruction System
   Version 1.0 | Architecture layer — data model, helpers, resource library,
   coaching engine UI. Activity-specific coaching data loaded separately.
   ============================================================================= */

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 1 — STATE
   ───────────────────────────────────────────────────────────────────────────── */

var COACH_ACTIVITY  = '';   // actId currently open in detail view
var COACH_DETAIL_TAB = 'prepare'; // prepare | teach | assess | report | variations
var RES_DOMAIN      = 'all';
var RES_AGE         = 'all';
var RES_ORG         = 'all';

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 2 — DATA MODEL
   Schema for a single COACHING entry (populated per-activity in activities.js)
   ───────────────────────────────────────────────────────────────────────────── */

/*
  COACHING_ENTRY = {
    intro       : string          — opening teacher script
    tips        : string[]        — 2-3 pre-activity setup tips
    prompts     : string[]        — 3 in-activity engagement prompts
    close       : string          — closing / wrap-up script
    questions   : {
      beginner  : string[]        — 2 questions for children just starting
      intermediate: string[]      — 2 questions for children making progress
      advanced  : string[]        — 2 questions for children ready for depth
      openEnded : string[]        — 2 open-ended / divergent thinking questions
    }
    responses   : {
      typical       : string      — what most children do / say
      strong        : string      — what a highly engaged child does
      shy           : string      — what a quiet or hesitant child does
      limitedLanguage: string     — what a child with limited verbal skills does
    }
    shySupport  : {
      prompts     : string[]      — 2 gentle invitation prompts
      alternatives: string[]      — 2 non-verbal / alternative ways to join
      encouragement: string[]     — 2 specific encouragement phrases
    }
    observation : string[]        — 4 specific things the teacher should watch
    rubric      : {
      beginning   : string        — observable indicator at beginning level
      developing  : string        — observable indicator while developing
      proficient  : string        — observable indicator at proficiency
      advanced    : string        — observable indicator beyond grade level
    }
    teacherNotes: string[]        — 2-3 ready-to-use professional observation notes
    parentReport: {
      example       : string      — full parent-ready report paragraph
      homeExtension : string      — 1-2 sentence home follow-up suggestion
    }
    variations  : {
      smallGroup  : string        — 2-4 children version
      wholeClass  : string        — full group version
      outdoor     : string        — outside / nature version
      indoor      : string        — rainy day / indoor version
      lowResource : string        — no-materials / minimal-materials version
    }
    classroomMgmt: {
      transitions     : string    — how to transition into/out of this activity
      disruptions     : string    — how to redirect a disruptive child
      participation   : string    — how to draw out reluctant participants
      diverseLearners : string    — how to adapt for diverse needs
    }
    materials   : {
      required  : string[]        — must-have materials
      optional  : string[]        — nice-to-have materials
      printable : string[]        — printable resource names
      digital   : string[]        — digital tool / app names
    }
  }
*/

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 3 — COACHING DATA REGISTRY
   Populated by activity coaching data file (activities coaching entries go here)
   ───────────────────────────────────────────────────────────────────────────── */

var COACHING_DATA = {};   // keyed by activity id, e.g. COACHING_DATA['il1']

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 4 — RESOURCE LIBRARY
   ───────────────────────────────────────────────────────────────────────────── */

var RESOURCE_LIBRARY = [
  {
    id: 'pbs',
    org: 'PBS Kids',
    icon: '&#128250;',
    color: '#1565C0',
    url: 'https://pbskids.org',
    desc: 'Free interactive games, videos, and printables for ages 2–8 across all learning domains.',
    domains: ['language','cognitive','creativity','social','physical'],
    ages: ['infants','toddlers','preschool'],
    resources: [
      { title:'Daniel Tiger\'s Neighborhood — Emotions Games', domain:'social',    type:'game',      url:'https://pbskids.org/daniel' },
      { title:'Sesame Street — Letter of the Day',             domain:'language',  type:'video',     url:'https://pbskids.org/sesame' },
      { title:'Curious George — Science Experiments',          domain:'cognitive', type:'activity',  url:'https://pbskids.org/curiousgeorge' },
      { title:'Wild Kratts — Animal Science',                  domain:'cognitive', type:'video',     url:'https://pbskids.org/wildkratts' },
      { title:'Splash and Bubbles — Ocean & Nature',           domain:'cognitive', type:'game',      url:'https://pbskids.org' },
      { title:'Word Girl — Vocabulary Builder',                domain:'language',  type:'game',      url:'https://pbskids.org/wordgirl' },
      { title:'Pinkalicious — Arts & Creativity',              domain:'creativity',type:'activity',  url:'https://pbskids.org' },
      { title:'Peg + Cat — Early Math Concepts',               domain:'cognitive', type:'game',      url:'https://pbskids.org/peg' }
    ]
  },
  {
    id: 'sesame',
    org: 'Sesame Street in Communities',
    icon: '&#127775;',
    color: '#E65100',
    url: 'https://sesamestreetincommunities.org',
    desc: 'Research-based educator resources including videos, activities, and family engagement tools.',
    domains: ['social','language','cognitive','life_skills','character'],
    ages: ['infants','toddlers','preschool'],
    resources: [
      { title:'Feelings & Self-Regulation Activity Kits',    domain:'social',     type:'printable', url:'https://sesamestreetincommunities.org' },
      { title:'Healthy Habits for Life — Nutrition Videos',  domain:'health',     type:'video',     url:'https://sesamestreetincommunities.org' },
      { title:'Early Literacy Storybooks & Guides',          domain:'language',   type:'printable', url:'https://sesamestreetincommunities.org' },
      { title:'Talking, Learning, and Growing Together',     domain:'language',   type:'guide',     url:'https://sesamestreetincommunities.org' },
      { title:'Mindfulness & Calming Strategies for Kids',   domain:'social',     type:'video',     url:'https://sesamestreetincommunities.org' },
      { title:'Family Engagement Tip Sheets (60+ topics)',   domain:'life_skills',type:'printable', url:'https://sesamestreetincommunities.org' },
      { title:'Kindness & Empathy Classroom Activities',     domain:'character',  type:'activity',  url:'https://sesamestreetincommunities.org' }
    ]
  },
  {
    id: 'natgeo',
    org: 'National Geographic Kids',
    icon: '&#127758;',
    color: '#F9A825',
    url: 'https://kids.nationalgeographic.com',
    desc: 'Science, nature, animals, and geography content that sparks curiosity and critical thinking.',
    domains: ['cognitive','language','creativity','health'],
    ages: ['preschool','school_age'],
    resources: [
      { title:'Animal Facts & Photo Galleries',              domain:'cognitive',  type:'article',   url:'https://kids.nationalgeographic.com/animals' },
      { title:'Science Experiments for Kids',                domain:'cognitive',  type:'activity',  url:'https://kids.nationalgeographic.com' },
      { title:'World Geography & Cultures Explorer',         domain:'cognitive',  type:'article',   url:'https://kids.nationalgeographic.com' },
      { title:'Environment & Climate Change for Kids',       domain:'character',  type:'article',   url:'https://kids.nationalgeographic.com' },
      { title:'Weird But True — Critical Thinking Facts',    domain:'cognitive',  type:'video',     url:'https://kids.nationalgeographic.com/weird-but-true' },
      { title:'Kids vs. Wild — Outdoor Skills & Survival',  domain:'physical',   type:'video',     url:'https://kids.nationalgeographic.com' },
      { title:'Nature Photography & Visual Storytelling',    domain:'creativity', type:'activity',  url:'https://kids.nationalgeographic.com' }
    ]
  },
  {
    id: 'khan',
    org: 'Khan Academy Kids',
    icon: '&#127891;',
    color: '#388E3C',
    url: 'https://khankids.org',
    desc: 'Free, personalized, curriculum-aligned learning app for ages 2–8 covering math, reading, and more.',
    domains: ['language','cognitive','life_skills'],
    ages: ['toddlers','preschool','school_age'],
    resources: [
      { title:'Early Reading & Phonics App (free)',         domain:'language',   type:'app',       url:'https://khankids.org' },
      { title:'Early Math: Counting, Shapes, Patterns',    domain:'cognitive',  type:'app',       url:'https://khankids.org' },
      { title:'Social-Emotional Learning Stories',         domain:'social',     type:'app',       url:'https://khankids.org' },
      { title:'Pre-K Reading Readiness Curriculum',        domain:'language',   type:'curriculum',url:'https://khankids.org' },
      { title:'Khan Academy — Grade K-12 Math & Reading',  domain:'cognitive',  type:'curriculum',url:'https://khanacademy.org' },
      { title:'Khan Academy — Financial Literacy Course',  domain:'life_skills',type:'course',    url:'https://khanacademy.org' },
      { title:'Computer Programming for Beginners',        domain:'cognitive',  type:'course',    url:'https://khanacademy.org/computing' }
    ]
  },
  {
    id: 'scholastic',
    org: 'Scholastic Teachers',
    icon: '&#128218;',
    color: '#C62828',
    url: 'https://teachers.scholastic.com',
    desc: 'Lesson plans, printable worksheets, book lists, and classroom activities for Pre-K through Grade 6.',
    domains: ['language','cognitive','creativity','social','character'],
    ages: ['toddlers','preschool','school_age'],
    resources: [
      { title:'Free Printable Worksheets — All Subjects',    domain:'language',   type:'printable', url:'https://teachers.scholastic.com' },
      { title:'Read-Aloud Book Lists by Theme & Age',        domain:'language',   type:'list',      url:'https://teachers.scholastic.com' },
      { title:'Story Starters — Creative Writing Prompts',   domain:'creativity', type:'printable', url:'https://teachers.scholastic.com' },
      { title:'Science & STEM Activity Database',            domain:'cognitive',  type:'activity',  url:'https://teachers.scholastic.com' },
      { title:'Social Studies — Community & Culture Kits',   domain:'character',  type:'printable', url:'https://teachers.scholastic.com' },
      { title:'Graphic Organizers for All Grade Levels',     domain:'cognitive',  type:'printable', url:'https://teachers.scholastic.com' },
      { title:'Parent-Teacher Communication Templates',      domain:'life_skills',type:'printable', url:'https://teachers.scholastic.com' },
      { title:'Classroom Management Strategy Guides',        domain:'social',     type:'guide',     url:'https://teachers.scholastic.com' }
    ]
  },
  {
    id: 'crayola',
    org: 'Crayola Education',
    icon: '&#127912;',
    color: '#7B1FA2',
    url: 'https://www.crayola.com/for-educators',
    desc: 'Arts-integrated lesson plans, creative activities, and printable templates for all grade levels.',
    domains: ['creativity','language','cognitive','character','physical'],
    ages: ['toddlers','preschool','school_age'],
    resources: [
      { title:'Lesson Plans: Art-Integrated Learning (Pre-K–Grade 5)', domain:'creativity', type:'lesson',   url:'https://www.crayola.com/for-educators' },
      { title:'Color Theory & Mixing Activities for Kids',             domain:'creativity', type:'activity', url:'https://www.crayola.com/for-educators' },
      { title:'Printable Coloring Pages by Theme',                     domain:'creativity', type:'printable',url:'https://www.crayola.com/free-coloring-pages' },
      { title:'STEAM Art Projects — Science Through Art',              domain:'cognitive',  type:'activity', url:'https://www.crayola.com/for-educators' },
      { title:'Feelings & Emotions Art Expression Activities',         domain:'social',     type:'activity', url:'https://www.crayola.com/for-educators' },
      { title:'Fine Motor Skills Art Exercises',                       domain:'physical',   type:'activity', url:'https://www.crayola.com/for-educators' },
      { title:'Community & Culture Mural Projects',                    domain:'character',  type:'project',  url:'https://www.crayola.com/for-educators' }
    ]
  },
  {
    id: 'smithsonian',
    org: 'Smithsonian Learning Lab',
    icon: '&#127981;',
    color: '#00695C',
    url: 'https://learninglab.si.edu',
    desc: 'Free educator resources using Smithsonian museum collections — history, science, art, and culture.',
    domains: ['cognitive','creativity','character','language'],
    ages: ['preschool','school_age'],
    resources: [
      { title:'Early Childhood Science Collections & Lessons', domain:'cognitive',  type:'lesson',   url:'https://learninglab.si.edu' },
      { title:'American History Primary Sources for Kids',     domain:'character',  type:'article',  url:'https://learninglab.si.edu' },
      { title:'Natural History — Animals & Ecosystems',        domain:'cognitive',  type:'collection',url:'https://learninglab.si.edu' },
      { title:'Art Appreciation — Museum Collections for Kids',domain:'creativity', type:'collection',url:'https://learninglab.si.edu' },
      { title:'Culture & Community Around the World',          domain:'character',  type:'lesson',   url:'https://learninglab.si.edu' },
      { title:'STEM & Innovation — Invention Stories',         domain:'cognitive',  type:'article',  url:'https://learninglab.si.edu' }
    ]
  },
  {
    id: 'nasa',
    org: 'NASA STEM Engagement',
    icon: '&#128640;',
    color: '#1A237E',
    url: 'https://www.nasa.gov/stem',
    desc: 'NASA-developed STEM activities, lesson plans, and videos connecting space science to classroom learning.',
    domains: ['cognitive','creativity','physical'],
    ages: ['preschool','school_age'],
    resources: [
      { title:'NASA Kids\' Club — Space Games & Activities',  domain:'cognitive',  type:'game',     url:'https://www.nasa.gov/kidsclub' },
      { title:'Space Science Lesson Plans (Pre-K–Grade 12)', domain:'cognitive',  type:'lesson',   url:'https://www.nasa.gov/stem' },
      { title:'Space Place — Planets, Stars & Universe',     domain:'cognitive',  type:'article',  url:'https://spaceplace.nasa.gov' },
      { title:'Engineering Design Challenges for Kids',      domain:'cognitive',  type:'activity', url:'https://www.nasa.gov/stem' },
      { title:'STEM in 30 — Classroom Science Videos',       domain:'cognitive',  type:'video',    url:'https://www.si.edu/stem' },
      { title:'Rocket Science Paper Models & Printables',    domain:'creativity', type:'printable',url:'https://www.nasa.gov/stem' },
      { title:'Mars Exploration — Critical Thinking Pack',   domain:'cognitive',  type:'lesson',   url:'https://www.nasa.gov/stem' }
    ]
  }
];

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 5 — DOMAIN COACHING PLAYBOOKS
   General coaching strategies for each domain — used when no activity-specific
   data exists and as context for the coaching engine.
   ───────────────────────────────────────────────────────────────────────────── */

var DOMAIN_PLAYBOOKS = {
  language: {
    label: 'Language & Literacy',
    icon: '&#128172;',
    color: '#2ABFB8',
    teacherMindset: 'Language develops through rich, responsive conversation. Your voice, expressions, and wait time matter more than any material.',
    goldRules: [
      'Wait 5–7 seconds after asking a question before prompting again — silence is thinking time',
      'Expand what children say: "dog" → "Yes, the big brown dog is running fast!"',
      'Read and reread the same books — repetition builds fluency and confidence',
      'Narrate everything you do: "Now I am opening the paint jar so we can create together"'
    ],
    redFlags: [
      'Answering your own questions before children have time to think',
      'Accepting one-word answers without gently prompting for more',
      'Only reading books once and never returning to them',
      'Focusing on decoding only — comprehension and love of reading matter equally'
    ],
    devNote: 'Language acquisition happens in zones of proximal development. Always model one step above where the child is right now.'
  },
  cognitive: {
    label: 'Cognitive Development',
    icon: '&#129504;',
    color: '#4A8BC4',
    teacherMindset: 'Children are natural scientists. Your role is to create conditions for discovery, not to deliver knowledge to passive recipients.',
    goldRules: [
      'Ask "How do you know?" more than "What is the answer?"',
      'Celebrate wrong answers — they reveal thinking and create learning moments',
      'Give children time to struggle productively before stepping in',
      'Connect every new concept to something the child already knows'
    ],
    redFlags: [
      'Showing children the answer before they have tried',
      'Only asking recall questions — push toward analysis and application',
      'Moving on too quickly when children seem to "get it" — check for deeper understanding',
      'Treating all children as being at the same cognitive level'
    ],
    devNote: 'Cognitive growth requires productive challenge. Tasks should be just beyond the child\'s independent ability — with your support they can reach it.'
  },
  social: {
    label: 'Social-Emotional Learning',
    icon: '&#10084;',
    color: '#E86B6B',
    teacherMindset: 'Social-emotional skills are the foundation of all other learning. A child who cannot self-regulate cannot learn effectively.',
    goldRules: [
      'Name emotions out loud throughout the day: "I can see you feel disappointed"',
      'Validate feelings before problem-solving: feelings come first, solutions second',
      'Model your own emotional regulation authentically',
      'Create predictable routines — security is the soil where emotional growth grows'
    ],
    redFlags: [
      'Saying "stop crying" or "you\'re fine" — this dismisses and shuts down emotional learning',
      'Only addressing negative behavior, not noticing and naming positive social skills',
      'Rushing past emotional moments to get back to academics',
      'Handling conflicts for children rather than coaching them through resolution'
    ],
    devNote: 'Children co-regulate before they self-regulate. Your calm nervous system is a teaching tool — your regulation teaches theirs.'
  },
  physical: {
    label: 'Physical Development',
    icon: '&#127939;',
    color: '#4A9E4A',
    teacherMindset: 'Physical development is not a break from learning — it IS learning. Motor skills build the brain pathways used for reading, writing, and math.',
    goldRules: [
      'Demonstrate first, slowly; then ask children to try with you watching',
      'Name body movements: "We are using our wrist to twist the sponge"',
      'Never rush fine motor tasks — they require concentration and control',
      'Celebrate effort and persistence over outcome: "You kept trying even when it was hard!"'
    ],
    redFlags: [
      'Doing fine motor tasks for children when they struggle — guide, don\'t do',
      'Setting up physical tasks that are too easy or too hard — adjust for each child',
      'Ignoring a child\'s frustration with a motor task',
      'Overlooking left-handedness — accommodate without making it notable'
    ],
    devNote: 'Fine motor skills directly predict writing readiness. Every cutting, pinching, and threading activity is pre-writing practice.'
  },
  creativity: {
    label: 'Creativity & Arts',
    icon: '&#127912;',
    color: '#C8960A',
    teacherMindset: 'Process matters more than product. A child deeply engaged in exploration learns more than one copying a teacher model.',
    goldRules: [
      'Never show a model or "example" before open-ended art — it limits imagination',
      'Ask about the process: "How did you make that texture?" not "What is it?"',
      'Display ALL children\'s work, not just the "neat" ones',
      'Give real materials and real tools — children rise to the challenge'
    ],
    redFlags: [
      'Correcting a child\'s art or music — there is no "wrong" in creative expression',
      'Rushing creative time — deep creative work requires uninterrupted exploration',
      'Only doing holiday-themed crafts — these are usually adult-directed, not creative',
      'Saying "good job" without specificity — try "I notice you layered three colors"'
    ],
    devNote: 'Creativity is a developmental skill. Children move from pure exploration → intentional expression → symbolic communication. Support each stage.'
  },
  life_skills: {
    label: 'Life Skills & Independence',
    icon: '&#11088;',
    color: '#8B4AB8',
    teacherMindset: 'Every time you do something for a child that they could do themselves (even slowly), you take away a learning opportunity.',
    goldRules: [
      'Use the phrase "You can do it yourself — I\'ll be right here" before helping',
      'Give real responsibilities — children need to feel genuinely needed',
      'Teach procedures explicitly: show, guide, watch, release',
      'Connect life skills to real purpose: "We clean up so we can find things tomorrow"'
    ],
    redFlags: [
      'Doing things for children because it\'s faster — slow down and let them try',
      'Only praising perfect completion — effort and attempt deserve recognition too',
      'Skipping the "why" — children who understand the purpose of skills maintain them',
      'Inconsistent expectations — if it\'s important Monday, it\'s important Friday'
    ],
    devNote: 'Independence builds executive function. Children who manage their environment (belongings, routines, self-care) develop stronger self-regulation.'
  },
  health: {
    label: 'Health & Wellness',
    icon: '&#127807;',
    color: '#2E9E8A',
    teacherMindset: 'Health habits established in early childhood become lifelong patterns. You are literally shaping how children will care for themselves as adults.',
    goldRules: [
      'Make health routines joyful and consistent — sing during hand washing, celebrate outdoor time',
      'Connect health to how the body feels: "Exercise makes our brain sharper too!"',
      'Model every health habit yourself — children watch everything you do',
      'Never use food as reward or punishment — this creates unhealthy food relationships'
    ],
    redFlags: [
      'Rushing hygiene routines — 20 seconds of hand washing is not optional',
      'Commenting on children\'s body sizes or food amounts — deeply harmful',
      'Treating mental health as separate from physical health — they are connected',
      'Skipping outdoor time due to mild weather — children need fresh air daily'
    ],
    devNote: 'The hand washing habit alone, if consistently taught in early childhood, prevents more illness than almost any other intervention.'
  },
  character: {
    label: 'Character & Values',
    icon: '&#127775;',
    color: '#B87828',
    teacherMindset: 'Character is caught as much as it is taught. Who you are in the classroom teaches values more powerfully than any lesson.',
    goldRules: [
      'Name character when you see it: "I noticed you chose to include Maya — that is kindness"',
      'Use literature and real situations, not lectures — stories build moral reasoning',
      'Revisit values consistently — character grows through repetition and reflection',
      'Make sure classroom rules are rooted in values, not just compliance'
    ],
    redFlags: [
      'Only addressing character when children do something wrong',
      'Modeling impatience, shortcuts, or unkindness — children mirror you',
      'Treating character lessons as a separate "subject" — weave values through everything',
      'Praising compliance as character: following rules is not the same as having values'
    ],
    devNote: 'Moral development progresses from external control → social approval → principled reasoning. Support where each child is on this journey.'
  }
};

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 6 — AGE GROUP COACHING CONTEXT
   Developmental context that informs ALL coaching for each age group
   ───────────────────────────────────────────────────────────────────────────── */

var AGE_COACHING_CONTEXT = {
  infants: {
    voice: 'Warm, slow, melodic. Use high-pitched "parentese" — it is not babyish, it is neurologically optimal for language acquisition.',
    pacing: 'Follow baby\'s lead completely. If baby disengages, pause and wait. Engagement cannot be forced.',
    key: 'Secure attachment is the curriculum. Every warm interaction builds the brain architecture that all future learning depends on.',
    watch: 'Even subtle responses — a turn of the head, a slowing of breathing, eye widening — are communication. Respond to all of it.',
    mistake: 'Overstimulating. Less is more for infants. One object, one voice, one activity at a time.'
  },
  toddlers: {
    voice: 'Enthusiastic and clear. Use simple sentences (2-4 words). Repeat key words. Use gestures to support words.',
    pacing: 'Activities of 8–12 minutes maximum. Toddlers have genuine attention limits — work with biology, not against it.',
    key: 'Autonomy is the developmental drive. Offer choices constantly: "Do you want the red crayon or the blue one?"',
    watch: 'Toddler frustration peaks at 18-24 months. A frustrated toddler is not being difficult — they are developing.',
    mistake: 'Expecting toddlers to share willingly. Parallel play comes before cooperative play. Set up the environment for success.'
  },
  preschool: {
    voice: 'Conversational and curious. Match their energy. Ask genuine questions you don\'t know the answer to.',
    pacing: '15–20 minute focused activities, then movement. Preschoolers need a physical reset every 20 minutes.',
    key: 'Preschoolers are building internal working models of the world. Their "why" questions are not annoying — they are brain construction.',
    watch: 'Play is the primary vehicle for ALL preschool learning. Academic readiness emerges FROM rich play, not instead of it.',
    mistake: 'Prioritizing sitting still and quiet over active, noisy exploration. Deep learning looks messy and loud at this age.'
  },
  school_age: {
    voice: 'Respectful, collegial. They notice and care about fairness and consistency. Mean what you say.',
    pacing: '20–30 minute focused work blocks with movement breaks. Sustained attention is developing but has real limits.',
    key: 'Industry vs. inferiority (Erikson): school-age children need to feel genuinely competent. Protect this need fiercely.',
    watch: 'Peer relationships are now as important as adult relationships for motivation. Use this — peer learning is powerful.',
    mistake: 'Underestimating what they can do. School-age children can lead, plan, problem-solve, and contribute to real community projects.'
  }
};

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 7 — HELPER FUNCTIONS
   ───────────────────────────────────────────────────────────────────────────── */

function getCoaching(actId) {
  return COACHING_DATA[actId] || null;
}

function hasCoaching(actId) {
  return !!COACHING_DATA[actId];
}

/* Find activity object from ACTIVITY_LIBRARY by id */
function getActivityById(actId) {
  if (typeof ACTIVITY_LIBRARY === 'undefined') return null;
  var ages = ['infants','toddlers','preschool','school_age'];
  for (var a = 0; a < ages.length; a++) {
    var age = ACTIVITY_LIBRARY[ages[a]];
    if (!age) continue;
    var domains = Object.keys(age);
    for (var d = 0; d < domains.length; d++) {
      var acts = age[domains[d]];
      for (var i = 0; i < acts.length; i++) {
        if (acts[i].id === actId) return { activity: acts[i], ageKey: ages[a], domain: domains[d] };
      }
    }
  }
  return null;
}

/* Get all activities for an age group + domain */
function getActivitiesForContext(ageKey, domain) {
  if (typeof ACTIVITY_LIBRARY === 'undefined') return [];
  if (!ACTIVITY_LIBRARY[ageKey]) return [];
  if (domain === 'all') {
    var all = [];
    Object.values(ACTIVITY_LIBRARY[ageKey]).forEach(function(arr){ all = all.concat(arr); });
    return all;
  }
  return ACTIVITY_LIBRARY[ageKey][domain] || [];
}

/* Get resource library entries for a domain filter */
function getResourcesForDomain(domain, ageKey) {
  return RESOURCE_LIBRARY.filter(function(org) {
    var domainOk = domain === 'all' || org.domains.includes(domain);
    var ageOk    = ageKey  === 'all' || org.ages.includes(ageKey);
    return domainOk && ageOk;
  });
}

/* Get resources from a specific org filtered by domain */
function getOrgResources(orgId, domain) {
  var org = RESOURCE_LIBRARY.find(function(o){ return o.id === orgId; });
  if (!org) return [];
  if (domain === 'all') return org.resources;
  return org.resources.filter(function(r){ return r.domain === domain; });
}

/* Build a ready-to-use parent report from coaching data */
function buildParentReport(actId, childName) {
  var c = getCoaching(actId);
  if (!c || !c.parentReport) return '';
  var text = c.parentReport.example;
  if (childName) text = text.replace(/\{childName\}/g, childName).replace(/your child/gi, childName);
  return text;
}

/* Render a rubric level badge */
function rubricBadge(level, desc) {
  var colors = { beginning:'#FFB3B3', developing:'#FFE08A', proficient:'#A8D8A8', advanced:'#4ECDC4' };
  var icons  = { beginning:'&#9634;', developing:'&#8599;', proficient:'&#9989;', advanced:'&#11088;' };
  var labelsES = { beginning:'Inicial', developing:'En Desarrollo', proficient:'Competente', advanced:'Avanzado' };
  var displayLabel = (typeof LANG !== 'undefined' && LANG === 'es' && labelsES[level]) ? labelsES[level] : (level.charAt(0).toUpperCase() + level.slice(1));
  return '<div class="rubric-row"><div class="rubric-level" style="background:' + colors[level] + '">' +
    icons[level] + ' <b>' + displayLabel + '</b></div>' +
    '<div class="rubric-desc">' + esc(desc) + '</div></div>';
}

/* Render question chips for a level */
function renderQuestionChips(questions, label, color) {
  if (!questions || !questions.length) return '';
  return '<div class="q-group"><div class="q-level-label" style="color:' + color + '">' + label + '</div>' +
    questions.map(function(q){ return '<div class="q-chip">' + esc(q) + '</div>'; }).join('') +
    '</div>';
}

/* Render a coaching script block */
function coachScript(label, script) {
  return '<div class="coach-script"><div class="cs-label">&#128172; ' + label + '</div>' +
    '<div class="cs-text">&ldquo;' + esc(script) + '&rdquo;</div></div>';
}

/* Render a tip list */
function coachTips(tips) {
  if (!tips || !tips.length) return '';
  return '<ul class="coach-tips">' + tips.map(function(t){
    return '<li>&#128161; ' + esc(t) + '</li>';
  }).join('') + '</ul>';
}

/* Render a response card */
function responseCard(label, text, color) {
  return '<div class="response-card" style="border-left-color:' + color + '">' +
    '<b>' + label + '</b><span>' + esc(text) + '</span></div>';
}

/* Render observation items */
function observationList(items) {
  if (!items || !items.length) return '';
  return '<ul class="obs-list">' + items.map(function(i){
    return '<li>&#128065; ' + esc(i) + '</li>';
  }).join('') + '</ul>';
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 8 — VIEW FUNCTIONS
   ───────────────────────────────────────────────────────────────────────────── */

/* ── 8a. Teacher Coaching Hub (coach subtab) ── */
function teacherCoachView() {
  var u = (typeof DB !== 'undefined' && DB.users && typeof CU !== 'undefined' && CU) ? DB.users.find(function(x){ return x.id === CU.id; }) : null;
  var cls = (u && typeof DB !== 'undefined') ? DB.classes.find(function(c){ return c.id === u.classId; }) : null;
  var ageKey = cls ? (typeof getAgeKey === 'function' ? getAgeKey(cls.id) : 'preschool') : 'preschool';
  var ctx = AGE_COACHING_CONTEXT[ageKey] || AGE_COACHING_CONTEXT.preschool;
  var info = (typeof CURR_AGE_INFO !== 'undefined') ? CURR_AGE_INFO[ageKey] : { label: 'Your Class', icon: '&#127912;' };

  var totalActs = getActivitiesForContext(ageKey, 'all').length;
  var coachedActs = getActivitiesForContext(ageKey, 'all').filter(function(a){ return hasCoaching(a.id); }).length;

  var cats = (typeof CURR_CATS !== 'undefined') ? CURR_CATS : [];

  var h = '<div class="portal-head">' +
    '<div><h2 style="margin-bottom:2px">&#127795; ' + t('Teaching Coach','Entrenador de Enseñanza') + '</h2>' +
    '<span class="role-chip role-teacher">&#127891; ' + esc(info.label) + ' ' + t('Program','Programa') + '</span></div>' +
    '<button class="mini-btn ghost" onclick="CURR_SUB=\'today\';renderPortal()">&#8592; ' + t('Back to Curriculum','Volver al Currículo') + '</button>' +
    '</div>';

  /* Age Context Card */
  h += '<div class="coach-context-card">' +
    '<div class="cc-top"><span class="cc-icon">' + info.icon + '</span>' +
    '<div><b class="cc-title">' + t('Coaching Context for','Contexto de Entrenamiento para') + ' ' + esc(info.label) + '</b>' +
    '<span class="cc-sub">' + t('Key insights for working with this age group','Puntos clave para trabajar con este grupo de edad') + '</span></div></div>' +
    '<div class="cc-grid">' +
    '<div class="cc-item"><b>&#128172; ' + t('Voice &amp; Tone','Voz y Tono') + '</b><p>' + esc(ctx.voice) + '</p></div>' +
    '<div class="cc-item"><b>&#128336; ' + t('Pacing','Ritmo') + '</b><p>' + esc(ctx.pacing) + '</p></div>' +
    '<div class="cc-item"><b>&#128161; ' + t('Core Principle','Principio Central') + '</b><p>' + esc(ctx.key) + '</p></div>' +
    '<div class="cc-item"><b>&#128065; ' + t('What to Watch','Qué Observar') + '</b><p>' + esc(ctx.watch) + '</p></div>' +
    '<div class="cc-item cc-item-wide"><b>&#9888; ' + t('Common Mistake','Error Común') + '</b><p>' + esc(ctx.mistake) + '</p></div>' +
    '</div></div>';

  /* Coverage bar */
  var pct = totalActs > 0 ? Math.round(coachedActs / totalActs * 100) : 0;
  h += '<div class="card" style="margin-bottom:18px;padding:18px 20px">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
    '<b style="color:var(--night)">' + t('Coaching Coverage —','Cobertura de Entrenamiento —') + ' ' + esc(info.label) + '</b>' +
    '<span style="font-size:.8rem;color:var(--muted)">' + coachedActs + ' / ' + totalActs + ' ' + t('activities coached','actividades entrenadas') + '</span></div>' +
    '<div style="background:var(--cream);border-radius:999px;height:10px;overflow:hidden">' +
    '<div style="width:' + pct + '%;height:100%;background:var(--teal);border-radius:999px;transition:width .5s"></div></div></div>';

  /* Domain Playbooks */
  h += '<div style="margin-bottom:6px"><b style="color:var(--night);font-size:1rem">&#128218; ' + t('Domain Coaching Playbooks','Manuales de Enseñanza por Dominio') + '</b>' +
    '<p class="soft" style="font-size:.82rem;margin:4px 0 10px">' + t('General strategies for every domain — read before teaching any activity in that area:','Estrategias generales para cada dominio — léelas antes de enseñar cualquier actividad en esa área:') + '</p></div>';
  h += '<div class="coach-domain-grid">';
  cats.forEach(function(cat) {
    var pb = DOMAIN_PLAYBOOKS[cat.id];
    if (!pb) return;
    h += '<div class="coach-domain-card" onclick="showDomainPlaybook(\'' + cat.id + '\')">' +
      '<span class="cdcard-ic" style="background:' + cat.color + '20;color:' + cat.color + '">' + cat.icon + '</span>' +
      '<b>' + esc(pb.label) + '</b>' +
      '<span>' + esc(pb.teacherMindset.substring(0, 60)) + '&hellip;</span>' +
      '<span class="cdcard-link">' + t('Read playbook &#8594;','Leer manual &#8594;') + '</span>' +
      '</div>';
  });
  h += '</div>';

  /* Activities by Domain */
  h += '<div style="margin-top:24px;margin-bottom:8px"><b style="color:var(--night);font-size:1rem">&#127380; ' + t('Activity Coach —','Entrenador de Actividades —') + ' ' + esc(info.label) + '</b>' +
    '<p class="soft" style="font-size:.82rem;margin:4px 0 10px">' + t('Tap any activity to open the full coaching guide, scripts, questions, and assessment tools:','Toca cualquier actividad para abrir la guía completa de entrenamiento, guiones, preguntas y herramientas de evaluación:') + '</p></div>';

  cats.forEach(function(cat) {
    var acts = getActivitiesForContext(ageKey, cat.id);
    if (!acts.length) return;
    h += '<div class="coach-domain-section">' +
      '<div class="cds-header" style="background:' + cat.color + '18;border-left:4px solid ' + cat.color + '">' +
      '<span>' + cat.icon + '</span><b style="color:var(--night)">' + esc(cat.label) + '</b>' +
      '<span class="cds-count">' + acts.length + ' ' + t('activities','actividades') + '</span></div>';
    h += '<div class="cds-list">';
    acts.forEach(function(act) {
      var coached = hasCoaching(act.id);
      h += '<div class="cds-activity" onclick="openActivityCoach(\'' + act.id + '\')">' +
        '<div class="cds-act-main">' +
        '<b style="color:var(--night)">' + esc(act.title) + '</b>' +
        '<span class="cds-dur">&#128336; ' + act.dur + ' min</span>' +
        '</div>' +
        '<span class="cds-obj soft">' + esc(act.obj) + '</span>' +
        (coached ? '<span class="coach-badge">&#127795; ' + t('Full Coach Guide','Guía Completa') + '</span>' :
                   '<span class="coach-badge pending">&#128196; ' + t('Guide Loading','Guía en Progreso') + '</span>') +
        '</div>';
    });
    h += '</div></div>';
  });

  return h;
}

/* ── 8b. Domain Playbook Detail View ── */
function showDomainPlaybook(domainId) {
  var pb = DOMAIN_PLAYBOOKS[domainId];
  if (!pb) return;
  var h = '<div class="portal-head">' +
    '<div><h2 style="margin-bottom:2px">' + pb.icon + ' ' + esc(pb.label) + '</h2>' +
    '<span class="soft" style="font-size:.84rem">' + t('Domain Coaching Playbook','Manual de Enseñanza del Dominio') + '</span></div>' +
    '<button class="mini-btn ghost" onclick="CURR_SUB=\'coach\';renderPortal()">&#8592; ' + t('Back to Coach Hub','Volver al Centro de Entrenamiento') + '</button>' +
    '</div>';

  h += '<div class="playbook-card">' +
    '<div class="pb-mindset"><span class="pb-mindset-ic">&#129504;</span>' +
    '<div><b>' + t('Teaching Mindset','Mentalidad de Enseñanza') + '</b><p>' + esc(pb.teacherMindset) + '</p></div></div>' +

    '<div class="pb-section"><b class="pb-sec-title" style="color:var(--teal)">&#9989; ' + t('Golden Rules — Always Do These','Reglas de Oro — Siempre Haz Estas') + '</b>' +
    '<ul class="pb-list">' + pb.goldRules.map(function(r){ return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></div>' +

    '<div class="pb-section"><b class="pb-sec-title" style="color:var(--coral)">&#9888; ' + t('Red Flags — Avoid These','Señales de Alerta — Evita Estas') + '</b>' +
    '<ul class="pb-list pb-red">' + pb.redFlags.map(function(r){ return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></div>' +

    '<div class="pb-dev-note"><b>&#128218; ' + t('Developmental Note','Nota de Desarrollo') + '</b><p>' + esc(pb.devNote) + '</p></div>' +
    '</div>';

  /* Activities in this domain */
  var ages = ['infants','toddlers','preschool','school_age'];
  h += '<div style="margin-top:18px"><b style="color:var(--night)">' + t('Activities in this Domain:','Actividades en este Dominio:') + '</b></div>';
  ages.forEach(function(ageKey) {
    var acts = (typeof ACTIVITY_LIBRARY !== 'undefined' && ACTIVITY_LIBRARY[ageKey]) ? (ACTIVITY_LIBRARY[ageKey][domainId] || []) : [];
    if (!acts.length) return;
    var info = (typeof CURR_AGE_INFO !== 'undefined') ? CURR_AGE_INFO[ageKey] : { label: ageKey, icon: '' };
    h += '<div class="pb-age-group">' +
      '<div class="pb-age-label">' + info.icon + ' ' + esc(info.label) + '</div>';
    acts.forEach(function(act) {
      h += '<div class="cds-activity" onclick="openActivityCoach(\'' + act.id + '\')">' +
        '<div class="cds-act-main"><b style="color:var(--night)">' + esc(act.title) + '</b>' +
        '<span class="cds-dur">&#128336; ' + act.dur + ' min</span></div>' +
        '<span class="cds-obj soft">' + esc(act.obj) + '</span>' +
        (hasCoaching(act.id) ? '<span class="coach-badge">&#127795; ' + t('Full Guide','Guía Completa') + '</span>' : '') +
        '</div>';
    });
    h += '</div>';
  });

  /* Temporarily replace coach view */
  var el = document.getElementById('portal-root');
  if (el) el.innerHTML = h;
}

/* ── 8c. Activity Coach Detail View ── */
function openActivityCoach(actId) {
  COACH_ACTIVITY = actId;
  COACH_DETAIL_TAB = 'prepare';
  var found = getActivityById(actId);
  if (!found) return;
  var act = found.activity;
  var c   = getCoaching(actId);
  var pb  = DOMAIN_PLAYBOOKS[found.domain];

  var h = '<div class="portal-head">' +
    '<div><h2 style="margin-bottom:2px">' + esc(act.title) + '</h2>' +
    '<span class="role-chip role-teacher">&#128336; ' + act.dur + ' min &nbsp;&bull;&nbsp; ' + esc(found.domain) + '</span></div>' +
    '<button class="mini-btn ghost" onclick="CURR_SUB=\'coach\';renderPortal()">&#8592; ' + t('All Activities','Todas las Actividades') + '</button>' +
    '</div>';

  /* Objective strip */
  h += '<div class="act-obj-strip"><b>' + t('Objective:','Objetivo:') + '</b> ' + esc(act.obj) + '</div>';

  /* Tab bar */
  var tabs = [
    { id:'prepare', icon:'&#127919;', label:t('Prepare','Preparar') },
    { id:'teach',   icon:'&#127795;', label:t('Teach','Enseñar')   },
    { id:'assess',  icon:'&#128202;', label:t('Assess','Evaluar')  },
    { id:'report',  icon:'&#128140;', label:t('Report','Reporte')  },
    { id:'vars',    icon:'&#128300;', label:t('Variations','Variaciones')},
    { id:'res',     icon:'&#128218;', label:t('Resources','Recursos')}
  ];
  h += '<div class="subtabs" style="margin-bottom:14px">';
  tabs.forEach(function(tab){
    h += '<button class="' + (COACH_DETAIL_TAB===tab.id?'active':'') + '" ' +
      'onclick="COACH_DETAIL_TAB=\'' + tab.id + '\';openActivityCoach(\'' + actId + '\')">' +
      tab.icon + ' ' + tab.label + '</button>';
  });
  h += '</div>';

  if (!c) {
    h += '<div class="card" style="text-align:center;padding:30px">' +
      '<div style="font-size:2rem;margin-bottom:10px">&#128197;</div>' +
      '<b style="color:var(--night)">' + t('Coaching guide for this activity is being prepared.','La guía de entrenamiento para esta actividad está en preparación.') + '</b>' +
      '<p class="soft" style="margin-top:6px">' + t('Check back soon — all activities are being fully coached.','Vuelve pronto — todas las actividades están siendo completamente entrenadas.') + '</p>' +
      (pb ? '<div class="pb-mindset" style="margin-top:14px;text-align:left"><span class="pb-mindset-ic">&#129504;</span>' +
        '<div><b>' + esc(pb.label) + ' ' + t('General Guidance','Orientación General') + '</b><p>' + esc(pb.teacherMindset) + '</p></div></div>' : '') +
      '</div>';
    var el2 = document.getElementById('portal-root');
    if (el2) el2.innerHTML = h;
    return;
  }

  /* PREPARE TAB */
  if (COACH_DETAIL_TAB === 'prepare') {
    h += '<div class="coach-section">';
    h += '<b class="coach-sec-title">&#127775; ' + t('Materials Needed','Materiales Necesarios') + '</b>';
    h += '<div class="mat-grid">';
    if (c.materials && c.materials.required && c.materials.required.length) {
      h += '<div class="mat-col"><b class="mat-label">' + t('Required','Requerido') + '</b><ul class="mat-list">' +
        c.materials.required.map(function(m){ return '<li>' + esc(m) + '</li>'; }).join('') + '</ul></div>';
    } else if (act.mats && act.mats.length) {
      h += '<div class="mat-col"><b class="mat-label">' + t('Required','Requerido') + '</b><ul class="mat-list">' +
        act.mats.map(function(m){ return '<li>' + esc(m) + '</li>'; }).join('') + '</ul></div>';
    }
    if (c.materials && c.materials.optional && c.materials.optional.length) {
      h += '<div class="mat-col"><b class="mat-label">' + t('Optional','Opcional') + '</b><ul class="mat-list mat-opt">' +
        c.materials.optional.map(function(m){ return '<li>' + esc(m) + '</li>'; }).join('') + '</ul></div>';
    }
    if (c.materials && c.materials.printable && c.materials.printable.length) {
      h += '<div class="mat-col"><b class="mat-label">&#128196; ' + t('Printable','Imprimible') + '</b><ul class="mat-list mat-print">' +
        c.materials.printable.map(function(m){ return '<li>' + esc(m) + '</li>'; }).join('') + '</ul></div>';
    }
    h += '</div>';

    h += '<b class="coach-sec-title" style="margin-top:18px">&#127775; ' + t('Setup &amp; Intro Script','Guión de Preparación e Introducción') + '</b>';
    h += coachScript(t('Say to open the activity','Di para abrir la actividad'), c.intro);
    h += coachTips(c.tips);

    if (pb) {
      h += '<div class="pb-mini"><b>&#128161; ' + esc(pb.label) + ' ' + t('Reminder','Recordatorio') + '</b>' +
        '<p>' + esc(pb.teacherMindset) + '</p></div>';
    }
    h += '</div>';
  }

  /* TEACH TAB */
  if (COACH_DETAIL_TAB === 'teach') {
    h += '<div class="coach-section">';
    h += '<b class="coach-sec-title">&#128172; ' + t('In-Activity Scripts','Guiones de la Actividad') + '</b>';
    if (c.prompts && c.prompts.length) {
      c.prompts.forEach(function(p, i) {
        h += coachScript(t('Prompt','Indicación') + ' ' + (i+1), p);
      });
    }
    if (c.close) h += coachScript(t('To conclude the activity','Para concluir la actividad'), c.close);

    h += '<b class="coach-sec-title" style="margin-top:18px">&#10067; ' + t('Question Bank','Banco de Preguntas') + '</b>';
    h += '<div class="q-bank">';
    if (c.questions) {
      h += renderQuestionChips(c.questions.beginner,     '&#128308; ' + t('Beginner','Principiante'),     '#E86B6B');
      h += renderQuestionChips(c.questions.intermediate, '&#128993; ' + t('Intermediate','Intermedio'),    '#C8960A');
      h += renderQuestionChips(c.questions.advanced,     '&#128994; ' + t('Advanced','Avanzado'),          '#4A9E4A');
      h += renderQuestionChips(c.questions.openEnded,    '&#128309; ' + t('Open-Ended','Preguntas Abiertas'), '#4A8BC4');
    }
    h += '</div>';

    h += '<b class="coach-sec-title" style="margin-top:18px">&#129488; ' + t('Expected Child Responses','Respuestas Esperadas de los Niños') + '</b>';
    h += '<div class="response-grid">';
    if (c.responses) {
      h += responseCard(t('Typical Response','Respuesta Típica'),        c.responses.typical,        '#4A8BC4');
      h += responseCard(t('Strong / Advanced','Fuerte / Avanzado'),      c.responses.strong,         '#4A9E4A');
      h += responseCard(t('Shy / Hesitant','Tímido / Dubitativo'),       c.responses.shy,            '#C8960A');
      h += responseCard(t('Limited Language','Lenguaje Limitado'),       c.responses.limitedLanguage,'#8B4AB8');
    }
    h += '</div>';

    if (c.shySupport) {
      h += '<b class="coach-sec-title" style="margin-top:18px">&#128155; ' + t('Supporting Shy &amp; Hesitant Children','Apoyo para Niños Tímidos y Dubitativos') + '</b>';
      h += '<div class="shy-grid">';
      if (c.shySupport.prompts && c.shySupport.prompts.length) {
        h += '<div class="shy-col"><b class="shy-label">' + t('Gentle Prompts','Indicaciones Suaves') + '</b>' +
          c.shySupport.prompts.map(function(p){ return '<div class="coach-script" style="margin-bottom:8px">' +
            '<div class="cs-label">&#128172; ' + t('Say','Di') + '</div><div class="cs-text">&ldquo;' + esc(p) + '&rdquo;</div></div>'; }).join('') + '</div>';
      }
      if (c.shySupport.alternatives && c.shySupport.alternatives.length) {
        h += '<div class="shy-col"><b class="shy-label">' + t('Alternative Participation','Participación Alternativa') + '</b><ul class="coach-tips">' +
          c.shySupport.alternatives.map(function(a){ return '<li>' + esc(a) + '</li>'; }).join('') + '</ul></div>';
      }
      if (c.shySupport.encouragement && c.shySupport.encouragement.length) {
        h += '<div class="shy-col"><b class="shy-label">' + t('Encouragement Phrases','Frases de Aliento') + '</b>' +
          c.shySupport.encouragement.map(function(e){ return '<div class="encourage-chip">' + esc(e) + '</div>'; }).join('') + '</div>';
      }
      h += '</div>';
    }
    h += '</div>';
  }

  /* ASSESS TAB */
  if (COACH_DETAIL_TAB === 'assess') {
    h += '<div class="coach-section">';
    h += '<b class="coach-sec-title">&#128065; ' + t('Observation Guide','Guía de Observación') + '</b>';
    h += '<p class="soft" style="margin-bottom:8px">' + t('During this activity, watch specifically for:','Durante esta actividad, observa específicamente:') + '</p>';
    if (c.observation) h += observationList(c.observation);

    if (c.classroomMgmt) {
      h += '<div class="mgmt-grid" style="margin-top:14px">';
      if (c.classroomMgmt.transitions)   h += '<div class="mgmt-item"><b>&#8651; ' + t('Transitions','Transiciones') + '</b><p>' + esc(c.classroomMgmt.transitions) + '</p></div>';
      if (c.classroomMgmt.disruptions)   h += '<div class="mgmt-item"><b>&#9889; ' + t('Disruptions','Interrupciones') + '</b><p>' + esc(c.classroomMgmt.disruptions) + '</p></div>';
      if (c.classroomMgmt.participation) h += '<div class="mgmt-item"><b>&#128075; ' + t('Participation','Participación') + '</b><p>' + esc(c.classroomMgmt.participation) + '</p></div>';
      if (c.classroomMgmt.diverseLearners) h += '<div class="mgmt-item"><b>&#127919; ' + t('Diverse Learners','Aprendices Diversos') + '</b><p>' + esc(c.classroomMgmt.diverseLearners) + '</p></div>';
      h += '</div>';
    }

    h += '<b class="coach-sec-title" style="margin-top:18px">&#128202; ' + t('Assessment Rubric','Rúbrica de Evaluación') + '</b>';
    if (c.rubric) {
      h += '<div class="rubric-grid">';
      h += rubricBadge('beginning', c.rubric.beginning);
      h += rubricBadge('developing', c.rubric.developing);
      h += rubricBadge('proficient', c.rubric.proficient);
      h += rubricBadge('advanced',   c.rubric.advanced);
      h += '</div>';
    }

    h += '<b class="coach-sec-title" style="margin-top:18px">&#128221; ' + t('Teacher Observation Note Examples','Ejemplos de Notas de Observación del Maestro') + '</b>';
    h += '<p class="soft" style="margin-bottom:8px">' + t('Copy, edit, and use these in daily reports:','Copia, edita y úsalas en los reportes diarios:') + '</p>';
    if (c.teacherNotes && c.teacherNotes.length) {
      h += '<div class="tn-list">';
      c.teacherNotes.forEach(function(note) {
        h += '<div class="tn-item">' +
          '<span class="tn-copy" onclick="copyTeacherNote(this)" title="Copy note">&#128203;</span>' +
          '<span class="tn-text">' + esc(note) + '</span></div>';
      });
      h += '</div>';
    }
    h += '</div>';
  }

  /* REPORT TAB */
  if (COACH_DETAIL_TAB === 'report') {
    h += '<div class="coach-section">';
    h += '<b class="coach-sec-title">&#128140; ' + t('Ready-to-Send Parent Report Examples','Ejemplos de Reportes para Padres Listos para Enviar') + '</b>';
    h += '<p class="soft" style="margin-bottom:10px">' + t("These are complete, professional parent-facing messages. Copy, personalise with the child's name, and send:","Estos son mensajes completos y profesionales para los padres. Copia, personaliza con el nombre del niño y envía:") + '</p>';
    if (c.parentReport) {
      h += '<div class="tn-item" style="margin-bottom:12px">' +
        '<span class="tn-copy" onclick="copyTeacherNote(this)" title="Copy report">&#128203;</span>' +
        '<span class="tn-text">' + esc(c.parentReport.example) + '</span></div>';
      h += '<div class="home-ext-card">' +
        '<b>&#127968; ' + t('Suggested Home Extension','Extensión para el Hogar Sugerida') + '</b>' +
        '<p>' + esc(c.parentReport.homeExtension) + '</p></div>';
    }
    h += '</div>';
  }

  /* VARIATIONS TAB */
  if (COACH_DETAIL_TAB === 'vars') {
    h += '<div class="coach-section">';
    h += '<b class="coach-sec-title">&#128300; ' + t('Activity Variations','Variaciones de la Actividad') + '</b>';
    if (c.variations) {
      var varLabels = { smallGroup:'&#128101; '+t('Small Group (2–4 children)','Grupo Pequeño (2-4 niños)'), wholeClass:'&#127891; '+t('Whole Class','Clase Completa'), outdoor:'&#127807; '+t('Outdoor Version','Versión al Aire Libre'), indoor:'&#127968; '+t('Indoor Version','Versión de Interior'), lowResource:'&#9878; '+t('Low-Resource / No-Materials Version','Versión con Pocos/Sin Materiales') };
      Object.keys(varLabels).forEach(function(k) {
        if (c.variations[k]) {
          h += '<div class="var-card"><b>' + varLabels[k] + '</b><p>' + esc(c.variations[k]) + '</p></div>';
        }
      });
    }
    h += '</div>';
  }

  /* RESOURCES TAB */
  if (COACH_DETAIL_TAB === 'res') {
    h += '<div class="coach-section">';
    h += '<b class="coach-sec-title">&#128218; ' + t('Recommended Resources for this Activity','Recursos Recomendados para esta Actividad') + '</b>';
    var relOrgs = getResourcesForDomain(found.domain, found.ageKey);
    if (relOrgs.length === 0) {
      h += '<p class="soft">' + t('See the full Resource Library for related materials.','Consulta la Biblioteca de Recursos completa para materiales relacionados.') + '</p>';
    } else {
      relOrgs.forEach(function(org) {
        var relRes = org.resources.filter(function(r){ return r.domain === found.domain; });
        if (!relRes.length) relRes = org.resources.slice(0, 3);
        h += '<div class="res-org-mini"><div class="rom-header" style="color:' + org.color + '">' +
          org.icon + ' <b>' + esc(org.org) + '</b></div>' +
          '<div class="rom-list">' + relRes.map(function(r){
            return '<a class="res-link" href="' + r.url + '" target="_blank" rel="noopener">' +
              '<span class="res-type-badge">' + esc(r.type) + '</span>' + esc(r.title) + ' &#8599;</a>';
          }).join('') + '</div></div>';
      });
    }
    h += '<button class="btn btn-teal" style="margin-top:14px;font-size:.85rem" onclick="CURR_SUB=\'resources\';renderPortal()">' + t('Open Full Resource Library &#8594;','Abrir Biblioteca de Recursos Completa &#8594;') + '</button>';
    h += '</div>';
  }

  var el3 = document.getElementById('portal-root');
  if (el3) el3.innerHTML = h;
}

/* ── 8d. Resource Library View ── */
function resourceLibraryView() {
  var cats = (typeof CURR_CATS !== 'undefined') ? CURR_CATS : [];

  var h = '<div class="portal-head">' +
    '<div><h2 style="margin-bottom:2px">&#128218; ' + t('Resource Library','Biblioteca de Recursos') + '</h2>' +
    '<span class="soft" style="font-size:.84rem">' + t('Curated resources from 8 leading educational organizations','Recursos seleccionados de 8 organizaciones educativas líderes') + '</span></div>' +
    '<button class="mini-btn ghost" onclick="CURR_SUB=\'coach\';renderPortal()">&#8592; ' + t('Back to Coach','Volver al Entrenador') + '</button>' +
    '</div>';

  /* Filters */
  h += '<div class="res-filters">' +
    '<div class="rf-group"><b>' + t('Domain:','Dominio:') + '</b><div class="rf-pills">' +
    '<span class="rf-pill ' + (RES_DOMAIN==='all'?'active':'') + '" onclick="RES_DOMAIN=\'all\';renderPortal()">' + t('All','Todo') + '</span>' +
    cats.map(function(c){ return '<span class="rf-pill ' + (RES_DOMAIN===c.id?'active':'') + '" onclick="RES_DOMAIN=\'' + c.id + '\';renderPortal()">' + c.icon + ' ' + esc(c.label) + '</span>'; }).join('') +
    '</div></div>' +
    '<div class="rf-group"><b>' + t('Age Group:','Grupo de Edad:') + '</b><div class="rf-pills">' +
    '<span class="rf-pill ' + (RES_AGE==='all'?'active':'') + '" onclick="RES_AGE=\'all\';renderPortal()">' + t('All Ages','Todas las Edades') + '</span>' +
    ['infants','toddlers','preschool','school_age'].map(function(a){
      var info = (typeof CURR_AGE_INFO !== 'undefined') ? CURR_AGE_INFO[a] : { label:a, icon:'' };
      return '<span class="rf-pill ' + (RES_AGE===a?'active':'') + '" onclick="RES_AGE=\'' + a + '\';renderPortal()">' + info.icon + ' ' + esc(info.label) + '</span>';
    }).join('') +
    '</div></div>' +
    '</div>';

  var orgs = getResourcesForDomain(RES_DOMAIN, RES_AGE);
  if (!orgs.length) {
    h += '<div class="empty">' + t('No resources match this filter combination.','No hay recursos que coincidan con esta combinación de filtros.') + '</div>';
  } else {
    h += '<div class="res-org-grid">';
    orgs.forEach(function(org) {
      var filteredRes = RES_DOMAIN === 'all' ? org.resources : org.resources.filter(function(r){ return r.domain === RES_DOMAIN; });
      if (!filteredRes.length) filteredRes = org.resources.slice(0, 4);
      h += '<div class="res-org-card" style="border-top:4px solid ' + org.color + '">' +
        '<div class="roc-header"><span class="roc-icon">' + org.icon + '</span>' +
        '<div><b class="roc-name" style="color:' + org.color + '">' + esc(org.org) + '</b>' +
        '<span class="roc-desc">' + esc(org.desc) + '</span></div></div>' +
        '<div class="roc-tags">' + org.domains.map(function(d){ return '<span class="roc-tag">' + d + '</span>'; }).join('') + '</div>' +
        '<div class="roc-links">' + filteredRes.map(function(r){
          return '<a class="res-link" href="' + r.url + '" target="_blank" rel="noopener">' +
            '<span class="res-type-badge">' + esc(r.type) + '</span>' + esc(r.title) + ' &#8599;</a>';
        }).join('') + '</div>' +
        '<a href="' + org.url + '" target="_blank" rel="noopener" class="btn btn-teal btn-full" style="font-size:.82rem;margin-top:12px">' + t('Visit','Visitar') + ' ' + esc(org.org) + ' &#8599;</a>' +
        '</div>';
    });
    h += '</div>';
  }

  return h;
}

/* ── 8e. Copy teacher note to clipboard ── */
function copyTeacherNote(el) {
  var text = el.nextElementSibling ? el.nextElementSibling.textContent : '';
  if (!text) return;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function(){
      el.textContent = '&#10003;';
      setTimeout(function(){ el.innerHTML = '&#128203;'; }, 2000);
    });
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 9 — PORTAL INTEGRATION
   Injects 'coach' and 'resources' subtabs into the teacher curriculum portal
   ───────────────────────────────────────────────────────────────────────────── */

(function wireTeachingTabs() {
  var _prevTeacher = (typeof teacherCurriculumView === 'function') ? teacherCurriculumView : null;

  teacherCurriculumView = function() {
    if (CURR_SUB === 'coach')     return teacherCoachView();
    if (CURR_SUB === 'resources') return resourceLibraryView();
    if (!_prevTeacher) return '<p>Curriculum loading...</p>';

    var html = _prevTeacher();
    if (typeof html !== 'string') return html;

    /* Inject new tabs into the subtabs row */
    var newBtns =
      '<button class="' + (CURR_SUB==='coach'?'active':'') + '" onclick="CURR_SUB=\'coach\';renderPortal()">&#127795; ' + t('Coach','Entrenador') + '</button>' +
      '<button class="' + (CURR_SUB==='resources'?'active':'') + '" onclick="CURR_SUB=\'resources\';renderPortal()">&#128218; ' + t('Resources','Recursos') + '</button>';

    var insertAt = html.lastIndexOf('</div>');
    var subtabsEnd = html.indexOf('</div>', html.indexOf('class="subtabs"'));
    if (subtabsEnd !== -1) {
      html = html.slice(0, subtabsEnd) + newBtns + html.slice(subtabsEnd);
    }
    return html;
  };
})();

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 10 — COACHING DATA: INFANTS
   ───────────────────────────────────────────────────────────────────────────── */
(function loadInfantCoaching() {

COACHING_DATA['il1'] = {
  intro: 'Let\'s play a naming game! I am going to show you something special and tell you what it is.',
  tips: ['Hold objects at baby\'s eye level — 8 to 12 inches from face for optimal focus','Use a calm, animated voice with clear pauses after each word','Limit to 3 objects per session to avoid overstimulation'],
  prompts: ['Look! This is a BALL. Ball. Can you see the ball?','Here is a CUP. Cup. Touch the cup!','Wonderful! You are learning so many words today!'],
  close: 'You did such a great job looking and listening! Those are real words — ball, cup, spoon. You are growing your brain right now!',
  questions: {
    beginner: ['Can you see the ball?','Where is the cup?'],
    intermediate: ['Do you want the ball or the cup?','Can you reach for it?'],
    advanced: ['Can you give me the ball?','Where did the ball go?'],
    openEnded: ['What do you think this is?','What do you want to do with it?']
  },
  responses: {
    typical: 'Baby gazes at the object, may reach toward it or vocalize in response to the name.',
    strong: 'Baby reaches intentionally toward named object or turns head when name is repeated.',
    shy: 'Baby looks away or becomes still — this is normal processing, not disinterest.',
    limitedLanguage: 'Baby communicates through gaze shifts, facial expressions, and physical movement toward objects.'
  },
  shySupport: {
    prompts: ['Take your time — I will wait right here with you.','You can just look — that is perfect!'],
    alternatives: ['Let baby hold the object instead of naming it on command','Use a mirror so baby can observe the activity from a safe distance'],
    encouragement: ['You are such a careful looker!','I love how you listen so well!']
  },
  observation: ['Does baby track the object visually as it moves?','Does baby show any response (vocalization, reach, gaze) when the object name is spoken?','Which objects generate the strongest response?','Is baby sustaining attention for the full 8-10 minutes or showing early disengagement?'],
  rubric: {
    beginning: 'Baby shows no consistent response to object names; gaze is unfocused.',
    developing: 'Baby occasionally looks at named objects when held in close proximity.',
    proficient: 'Baby consistently gazes at named object and shows anticipatory response to familiar names.',
    advanced: 'Baby reaches for or touches named object when asked, showing early receptive word understanding.'
  },
  teacherNotes: ['During Name It Game, {child} consistently turned to look at the ball when named, showing strong early receptive vocabulary development.','Today {child} reached toward the cup when I named it — a clear sign of growing word-object association.'],
  parentReport: {
    example: 'Today we played the Name It Game, where I held up common objects and named them slowly and clearly. Your child showed wonderful attention, gazing at each object as I named it. This simple activity builds the receptive vocabulary that comes before first words. At home, you can do this naturally during bath time, meals, and play — just name everything you see!',
    homeExtension: 'During bath time or meals, hold up one item at a time (cup, spoon, cloth) and say its name clearly 3 times while your baby watches. This 2-minute habit builds powerful vocabulary foundations.'
  },
  variations: {
    smallGroup: 'Sit with 2 babies on a floor mat. Show one object at a time to both, naming it while making eye contact with each baby in turn.',
    wholeClass: 'Use a large colorful object at circle time. Hold it up and have all caregivers name it simultaneously — babies learn from multiple voices.',
    outdoor: 'Use natural outdoor objects: leaf, flower, rock, stick. Name each one as baby touches or examines it.',
    indoor: 'Use household items from a basket: cup, spoon, cloth, ball. Works perfectly with no preparation.',
    lowResource: 'No materials needed — name body parts (nose, ear, hand) during diaper changes and dressing routines.'
  },
  classroomMgmt: {
    transitions: 'Begin this activity during alert, awake time — after a feed and diaper change. End before baby shows tiredness cues (eye rubbing, turning away).',
    disruptions: 'If another baby cries nearby, pause and lower your voice. Resume when the environment is calm.',
    participation: 'If baby looks away, do not redirect forcefully. Move the object gently into their line of sight or switch to a different object.',
    diverseLearners: 'For babies with visual considerations, use high-contrast black-and-white objects. For sensory-sensitive babies, choose soft textures and muted colors.'
  },
  materials: { required: ['3-5 colorful safe objects (ball, cup, spoon, board book)'], optional: ['Basket to hold objects','Mirror for self-reflection during naming','High-contrast black-and-white cards'], printable: ['Name It Game object cards','High-contrast infant visual cards'], digital: ['Sesame Street naming videos (muted, as background inspiration)'] }
};

COACHING_DATA['il2'] = {
  intro: 'We are going to sing and use our hands together! Watch my hands and listen to the words.',
  tips: ['Learn 3-4 consistent signs: MORE, ALL DONE, MILK, SLEEP — use the same sign every single time','Sing slowly enough that babies can track your face and hands simultaneously','The sign does not need to be perfect — consistency matters far more than accuracy'],
  prompts: ['More? Do you want MORE? [sign MORE] More!','All done? Are we ALL DONE? [sign ALL DONE]','Let\'s sing again! Music makes our brains grow!'],
  close: 'Beautiful singing and signing! You are learning to tell me what you need. That is such important communication!',
  questions: {
    beginner: ['Do you want more?','All done?'],
    intermediate: ['Can you show me more?','What do you need?'],
    advanced: ['Can you sign "more" to ask for another song?','What does this sign mean?'],
    openEnded: ['What do your hands want to do?','What sounds did you hear?']
  },
  responses: {
    typical: 'Baby watches face and hands with rapt attention; may vocalize during pauses.',
    strong: 'Baby begins imitating hand movements during familiar parts of the song.',
    shy: 'Baby listens quietly with fixed attention — this is deep engagement, not disengagement.',
    limitedLanguage: 'Baby communicates through body movement, reaching toward the singer, and vocalizing.'
  },
  shySupport: {
    prompts: ['You can just watch and listen — that is wonderful!','When you are ready, you can move your hands too.'],
    alternatives: ['Gently move baby\'s hands through the sign motion (only with consent and comfort)','Let baby observe from caregiver\'s lap for security'],
    encouragement: ['You are the best listener!','Your eyes are telling me you love this song!']
  },
  observation: ['Does baby vocalize during or after the song?','Does baby make any attempt to imitate hand signs?','Which songs produce the strongest engagement?','Does baby show anticipatory excitement when song begins?'],
  rubric: {
    beginning: 'Baby shows minimal response to singing; remains passive throughout.',
    developing: 'Baby makes eye contact with singer and vocalizes during the activity.',
    proficient: 'Baby shows anticipatory responses to familiar songs and attempts hand movements.',
    advanced: 'Baby imitates signs and vocalizes during pauses, demonstrating pre-verbal turn-taking.'
  },
  teacherNotes: ['During Sing and Sign, {child} clearly signed MORE when the song paused — their first intentional communication sign!','Today {child} vocalized with us during the chorus of Wheels on the Bus, showing growing participation in musical language.'],
  parentReport: {
    example: 'We practiced Sing and Sign today — pairing simple songs with hand signs for words like MORE and ALL DONE. This research-backed approach gives babies a way to communicate before they can speak words, which dramatically reduces frustration. Your child was wonderfully attentive and even tried to move their hands during the activity!',
    homeExtension: 'At home, use these two signs consistently: MORE (tap fingertips together) when asking if baby wants more food, and ALL DONE (wave hands) at the end of meals. Within 2-3 weeks, many babies begin signing back!'
  },
  variations: {
    smallGroup: 'Sit babies in a semi-circle on the floor. Use big, exaggerated movements so all babies can see. Pause for group response.',
    wholeClass: 'Whole-room song time — all caregivers sing together, creating a rich, immersive language experience.',
    outdoor: 'Sing during a stroller walk, using signs for things you see: BIRD, TREE, SUN.',
    indoor: 'Works perfectly indoors — rainy day singing circle is ideal.',
    lowResource: 'No materials needed. Body and voice are the only tools required.'
  },
  classroomMgmt: {
    transitions: 'Use a specific opening song to signal "sing and sign time" — this creates anticipation and attention.',
    disruptions: 'If a baby becomes fussy, redirect with a gentle bouncing rhythm rather than stopping entirely.',
    participation: 'Non-participating babies often benefit from being held by the caregiver during the song.',
    diverseLearners: 'For babies with hearing considerations, emphasize visual elements — exaggerate facial expressions and sign movements.'
  },
  materials: { required: ['No materials — voice and hands only'], optional: ['Simple shakers or bells for babies to hold','Song lyric cards for teacher reference'], printable: ['Baby Sign Language Quick Reference Card','Top 10 Infant Songs sheet'], digital: ['Baby Signing Time YouTube channel','PBS Kids music videos'] }
};

COACHING_DATA['il3'] = {
  intro: 'Look at this beautiful book! Let\'s sit together and read it. I will show you the pictures and tell you what I see.',
  tips: ['Choose board books with 1 clear image per page and bold, simple illustrations','Point to each picture before naming it — the pointing gesture teaches vocabulary', 'Allow baby to touch, mouth, and turn pages — this IS learning, not disruption'],
  prompts: ['Look! A DOG! Can you see the dog? He says woof!','Point to the picture: "What is this? A FLOWER! Touch the flower!"','You turned the page! You are reading!'],
  close: 'Wonderful reading together! Books are full of amazing things. We will read more stories every day.',
  questions: {
    beginner: ['Can you touch the dog?','Where is the ball?'],
    intermediate: ['What do you see on this page?','Can you find the cat?'],
    advanced: ['What sound does this animal make?','Can you show me the bird?'],
    openEnded: ['What do you see?','What is happening here?']
  },
  responses: {
    typical: 'Baby gazes at pictures, reaches toward the book, may vocalize when caregiver pauses.',
    strong: 'Baby points to or touches named pictures and vocalizes in response to animal sounds.',
    shy: 'Baby watches quietly from caregiver\'s lap — closeness and proximity is engagement.',
    limitedLanguage: 'Baby communicates through gaze direction, reaching toward pictures, and physical engagement with the book.'
  },
  shySupport: {
    prompts: ['Come sit with me — we can look at this together.','You can just watch while I read.'],
    alternatives: ['Let baby hold their own board book while you read','Read to baby during a calm, one-on-one feeding moment'],
    encouragement: ['You are such a wonderful book lover!','Those eyes are telling me you love stories!']
  },
  observation: ['Does baby sustain attention through multiple pages?','Does baby respond to expressive voice changes (animal sounds, dramatic pauses)?','Does baby reach toward or touch pictures?','Does baby anticipate favorite pages of familiar books?'],
  rubric: {
    beginning: 'Baby shows minimal engagement with book; attention drifts quickly.',
    developing: 'Baby gazes at pictures when held close and responds to caregiver\'s expressive voice.',
    proficient: 'Baby points to or touches named pictures and shows anticipation of familiar pages.',
    advanced: 'Baby independently explores the book, vocalizes in response to pictures, and participates in familiar repetitive lines.'
  },
  teacherNotes: ['During Lap Story Time, {child} reached out and touched the picture of the dog when I named it — showing strong picture-word connection.', '{child} turned three pages independently today during story time, demonstrating growing fine motor intentionality.'],
  parentReport: {
    example: 'We shared a wonderful board book together today during Lap Story Time. Your child sat in my lap while I pointed to each picture and named it clearly. Reading together is the single most impactful thing we can do for early language and literacy. Your child showed beautiful attention and even reached toward some of the pictures!',
    homeExtension: 'Read one board book together every day at bedtime — the same book repeatedly is perfectly fine and actually helps babies build deeper understanding. Point to each picture and name it simply as you go.'
  },
  variations: {
    smallGroup: 'Sit with 2 babies on a play mat, book propped open. Give each baby a board book to hold while you read aloud.',
    wholeClass: 'Use a large-format book or project images. All caregivers read together in a language-rich choral reading.',
    outdoor: 'Bring a waterproof board book outside. Read in the grass, connecting book pictures to real outdoor elements.',
    indoor: 'Ideal indoor activity. Create a cozy reading corner with soft lighting and a cushioned floor space.',
    lowResource: 'Name objects visible in the room using the same naming technique as you would with a book.'
  },
  classroomMgmt: {
    transitions: 'Signal story time with a consistent dimming of lights or a soft opening song.',
    disruptions: 'If baby grabs the book, allow it — guide baby\'s hand to point at pictures rather than redirecting.',
    participation: 'Non-reading babies can be held close or given a board book to explore during group story time.',
    diverseLearners: 'For babies with visual processing needs, use high-contrast books. For bilingual families, name pictures in both languages.'
  },
  materials: { required: ['Board books with simple, bold images'], optional: ['Soft pillow or reading corner','Multiple copies of the same book for small groups'], printable: ['Picture vocabulary cards to complement the book'], digital: ['Storyline Online (read-aloud videos)','PBS Kids story resources'] }
};

COACHING_DATA['il4'] = {
  intro: 'I have something for you to hear! Listen carefully — what do you think that sound is?',
  tips: ['Start with strong, clear sounds (bell, shaker) before subtle ones (crinkle, soft rattle)','Always name the sound immediately after making it: "That is a BELL!"','Watch for baby\'s head turn toward the sound — this is a critical developmental milestone'],
  prompts: ['[Shake rattle behind baby] Did you hear that? That is a RATTLE!','[Ring bell softly] Listen! A bell! Can you find where the sound is coming from?','You found it! Your ears work so well! You are a great listener!'],
  close: 'What amazing ears you have! You heard all those different sounds. Listening is one of the most important things we learn.',
  questions: {
    beginner: ['Did you hear that?','Where is the sound?'],
    intermediate: ['Which sound is louder — this one or that one?','Do you like this sound?'],
    advanced: ['Can you make a sound?','Is that sound the same or different?'],
    openEnded: ['What does that sound remind you of?','What sounds do you hear right now?']
  },
  responses: {
    typical: 'Baby stills and turns head or eyes toward the sound source within 2-3 seconds.',
    strong: 'Baby immediately localizes the sound, reaches toward the source, and vocalizes in response.',
    shy: 'Baby shows a subtle startle response or slight widening of eyes — still a valid auditory response.',
    limitedLanguage: 'Baby responds through physical stilling, head turning, or facial expression changes.'
  },
  shySupport: {
    prompts: ['That sound is okay — it is just a little bell. I will hold it for you.','You can touch it when you are ready.'],
    alternatives: ['Use softer sounds for sensitive babies — crinkle paper instead of bells','Allow baby to make the sound themselves with support'],
    encouragement: ['Your ears heard it right away!','You are such a careful listener!']
  },
  observation: ['Does baby localize sound by turning toward the source?','How quickly does baby respond to sound? (immediate vs. delayed)','Does baby show different responses to different sounds (loud vs. soft)?','Does baby attempt to reach toward or touch the sound-making object?'],
  rubric: {
    beginning: 'Baby shows minimal auditory localization; does not consistently turn toward sounds.',
    developing: 'Baby stills in response to sounds and occasionally turns toward the source.',
    proficient: 'Baby consistently localizes sound sources and shows differential response to varied sounds.',
    advanced: 'Baby reaches toward sound sources, anticipates familiar sounds, and vocalizes in response to auditory stimulation.'
  },
  teacherNotes: ['During Sound Discovery, {child} immediately turned toward the bell sound even when it was behind them — excellent auditory localization.', 'Today {child} reached toward the shaker after hearing it, demonstrating intentional auditory-motor connection.'],
  parentReport: {
    example: 'Today we explored Sound Discovery, using bells, shakers, and soft squeaky toys to develop your child\'s auditory awareness. Your child showed wonderful listening skills — turning toward sounds and reacting to different volumes and pitches. This auditory development is foundational for language and communication.',
    homeExtension: 'During daily routines, describe sounds around you: "That is the refrigerator humming," "The rain is hitting the window." This sound narration builds your child\'s auditory vocabulary naturally.'
  },
  variations: {
    smallGroup: 'Give each baby one sound-making toy. Alternate who makes sounds — babies begin to notice each other\'s sounds.',
    wholeClass: 'Create a "sound parade" where caregivers walk around the room making different instrument sounds. Babies track sound movement.',
    outdoor: 'Listen to natural sounds outside: birds, wind, traffic, rain. Name each sound as you hear it.',
    indoor: 'Use kitchen sounds safely: tap a wooden spoon on a pot, crinkle paper, ring a small bell.',
    lowResource: 'Use only voice — whisper, speak normally, sing loudly, then softly. Voice modulation is the most powerful sound tool.'
  },
  classroomMgmt: {
    transitions: 'Begin this activity in a quiet room where ambient noise is minimal.',
    disruptions: 'If a sound causes distress, immediately reassure baby by holding them close and speaking soothingly.',
    participation: 'Babies who are asleep should not be awakened for this activity — alert, awake state is essential.',
    diverseLearners: 'For babies with suspected hearing concerns, document all observations carefully and discuss with the lead teacher. Amplify visual cues alongside all sounds.'
  },
  materials: { required: ['Shakers or rattles','Small bell','Squeaky toy'], optional: ['Crinkle materials','Soft chime ball','Nature sound recordings'], printable: ['Sound Discovery observation log'], digital: ['Nature sound app for calm background audio'] }
};

})(); // end loadInfantCoaching Part 1

(function loadInfantCoaching2() {

COACHING_DATA['ic1'] = {
  intro: 'Where did I go? Peek-a-boo! Let\'s play our favorite hiding game together!',
  tips: ['Start by hiding YOUR face — babies find it less distressing than objects disappearing', 'Use consistent language: "Where did I go?" then "PEEK-A-BOO!" every time', 'Progress slowly: face hiding → toy under cloth → toy hidden in container'],
  prompts: ['[Cover face] Where did I go? Where is the teacher? [Reveal] PEEK-A-BOO!', '[Hide toy under cloth] Where is the ball? Is it under there? [Lift cloth] There it is!', 'You found it! The ball was hiding — but it was there the WHOLE time!'],
  close: 'Even when things hide, they are still there! Your brain is learning something very important today — things exist even when we cannot see them.',
  questions: {
    beginner: ['Where did I go?', 'Is it there?'],
    intermediate: ['Where is the ball hiding?', 'Can you find it?'],
    advanced: ['What is under the cloth?', 'Where do you think I should hide it next?'],
    openEnded: ['Where do you think it went?', 'How did you know where it was?']
  },
  responses: {
    typical: 'Baby laughs or smiles at the reveal; begins to anticipate the "peek-a-boo" moment.',
    strong: 'Baby pulls the cloth away themselves to find the hidden toy, showing active object permanence.',
    shy: 'Baby watches quietly with focused attention; may show a small smile at reveal.',
    limitedLanguage: 'Baby communicates through laughter, body tension before reveal, and reaching toward hidden objects.'
  },
  shySupport: {
    prompts: ['I am still here — I am just hiding for a moment!', 'You can hide your own face too if you want!'],
    alternatives: ['Start with a partial hide — just cover half your face', 'Let baby initiate the hide by placing cloth on your face'],
    encouragement: ['You found me! You are so smart!', 'Your eyes never miss anything!']
  },
  observation: ['Does baby search for the hidden object or wait passively?', 'Does baby show anticipatory excitement before the reveal?', 'Can baby pull the cloth away to find the object?', 'Does baby laugh or smile at the reveal — showing social understanding of the game?'],
  rubric: {
    beginning: 'Baby shows no search behavior; when object disappears, attention moves elsewhere.',
    developing: 'Baby shows brief searching gaze where the object was but does not actively search.',
    proficient: 'Baby pulls cloth away to find hidden object; shows anticipatory excitement before reveal.',
    advanced: 'Baby initiates hiding game; hides their own face or places cloth on caregiver\'s face to create the game.'
  },
  teacherNotes: ['{child} pulled the cloth away to find the hidden ball today — a clear demonstration of developing object permanence.', 'During Peek-A-Boo, {child} showed strong anticipatory laughter before each reveal, indicating memory for the game sequence.'],
  parentReport: {
    example: 'We played Peek-A-Boo today — and this is much more than just a fun game! When your child laughs in anticipation and searches for the hidden toy, they are demonstrating "object permanence" — the understanding that things still exist even when hidden. This is a foundational cognitive milestone. Your child is showing excellent development in this area!',
    homeExtension: 'Play Peek-A-Boo during diaper changes, bath time, or any quiet moment. Progress to hiding a toy under a small cloth and watching if your child reaches for it — this tiny search behavior is a big cognitive milestone!'
  },
  variations: {
    smallGroup: 'Take turns hiding face with different caregivers while babies observe — builds social awareness of multiple people.',
    wholeClass: 'All caregivers and babies play simultaneously — creates a joyful, socially connected group moment.',
    outdoor: 'Hide behind a tree trunk partially: "Where is the teacher? Here I am!" Uses real environment for object permanence.',
    indoor: 'Perfect indoor activity. Use a scarf, cloth diaper, or fabric piece as the hiding material.',
    lowResource: 'Only need hands to cover the face — no materials required.'
  },
  classroomMgmt: {
    transitions: 'Use peek-a-boo as a transition ritual between activities — it signals a change in a playful, non-stressful way.',
    disruptions: 'If baby cries during hiding (separation anxiety), reveal immediately and reassure. Shorten hiding durations.',
    participation: 'Some babies need repeated exposures before they engage actively — be patient and consistent.',
    diverseLearners: 'For babies showing separation anxiety, keep hiding durations very short (1-2 seconds) and build gradually.'
  },
  materials: { required: ['Soft cloth or lightweight blanket','Small toy to hide (ball or soft animal)'], optional: ['Cardboard box for bigger hiding','Pop-up peek toy'], printable: ['Object Permanence observation checklist'], digital: [] }
};

COACHING_DATA['ic2'] = {
  intro: 'I have some special things for you to feel today! Each one feels a little different. Ready to explore?',
  tips: ['Present one texture at a time with a 30-second pause between them', 'Use descriptive language as baby touches: "Soft! That is SO soft!"', 'Never force baby\'s hand onto a texture — allow baby to reach willingly'],
  prompts: ['[Guide hand to soft fabric] Feel this! SOFT. So soft and smooth.', '[Offer rough texture] Oh! This is different! BUMPY. Can you feel the bumps?', 'Every texture tells us something different about the world around us!'],
  close: 'You touched so many different things today! Your hands are learning about the world. Smooth, bumpy, soft, rough — you felt them all!',
  questions: {
    beginner: ['Is that soft?', 'What does that feel like?'],
    intermediate: ['Is this the same or different from before?', 'Which do you like more?'],
    advanced: ['Can you find the smooth one?', 'What else feels like this?'],
    openEnded: ['Tell me about what your hands feel.', 'What is your favorite texture?']
  },
  responses: {
    typical: 'Baby reaches toward texture, grasps or pats it, and shows facial reaction to the tactile experience.',
    strong: 'Baby shows clear differential reactions to different textures — excitement, curiosity, or mild aversion — and returns to favorites.',
    shy: 'Baby observes the texture without touching — allow visual exploration as a valid form of engagement.',
    limitedLanguage: 'Baby communicates through facial expression, body leaning toward or away from textures.'
  },
  shySupport: {
    prompts: ['You can just look at it first — that is perfect.', 'I will touch it first and show you it is safe.'],
    alternatives: ['Place texture on the floor and let baby choose to approach it independently', 'Touch your own hand with the texture while baby watches'],
    encouragement: ['You are such a brave explorer!', 'Your hands are learning so much right now!']
  },
  observation: ['Does baby reach willingly toward new textures?', 'What facial expressions accompany different textures?', 'Does baby show preference or aversion for specific textures?', 'Does baby mouth or bring textures to face (typical developmental exploration)?'],
  rubric: {
    beginning: 'Baby shows minimal interest in textures; reaches rarely and shows flat affect.',
    developing: 'Baby reaches toward textures when placed in proximity and shows facial responses to differences.',
    proficient: 'Baby clearly distinguishes between textures through differential responses and return to preferred textures.',
    advanced: 'Baby actively explores multiple textures, moves between them, and demonstrates preference — showing early categorization.'
  },
  teacherNotes: ['{child} showed clear facial preference for the soft velvet texture over the rough burlap during Texture Exploration today.', 'During texture play, {child} reached independently toward every new texture offered — showing strong sensory curiosity.'],
  parentReport: {
    example: 'Today we explored different textures — soft, smooth, rough, and bumpy materials for your child to touch and discover. This sensory exploration is critical for cognitive development, building the brain pathways that support learning, attention, and fine motor skills. Your child showed wonderful curiosity and reached eagerly toward each new texture!',
    homeExtension: 'Create a simple texture board at home using fabric swatches, sandpaper, velvet, and bubble wrap glued to cardboard. Let your child explore it during tummy time — this is a powerful brain-building activity that costs almost nothing.'
  },
  variations: {
    smallGroup: 'Each baby gets their own texture set in a small basket. Narrate what each baby is feeling and compare: "Liam likes the soft one too!"',
    wholeClass: 'Create a texture wall at baby level with different materials attached safely. Babies explore during free play.',
    outdoor: 'Use nature: smooth rock, rough bark, soft grass, bumpy pinecone. Nature provides the richest texture library.',
    indoor: 'Gather 5 household textures: cotton cloth, wooden spoon, smooth plastic, textured mat, crinkle paper.',
    lowResource: 'Use your own hands — touch baby gently with fingertip, full palm, and light scratch for texture variation.'
  },
  classroomMgmt: {
    transitions: 'Texture exploration works well as a settling activity after feeding or before nap.',
    disruptions: 'If a baby cries at a texture, remove it immediately and comfort. Note which textures cause distress for developmental records.',
    participation: 'Babies who only observe are still learning. Do not force — observation is valid engagement.',
    diverseLearners: 'For babies with sensory sensitivities (hypersensitive), start with the softest textures only. Progress very gradually.'
  },
  materials: { required: ['Fabric swatches (soft, rough, smooth, bumpy)','Safe natural textures (smooth rock, pinecone)'], optional: ['Commercial sensory texture board','Water beads in a sealed bag'], printable: ['Sensory texture vocabulary cards'], digital: ['Zero to Three sensory development guide'] }
};

COACHING_DATA['ic3'] = {
  intro: 'Look at these containers and blocks! I wonder if we can put the block inside the container. Let\'s find out!',
  tips: ['Demonstrate clearly and slowly before baby tries','Choose containers with openings much larger than the objects initially','Celebrate every attempt — not just successful insertions'],
  prompts: ['Watch me! I put the block IN the container. [drop] It fits! Now you try!', 'Can the big block fit in the little cup? Let\'s see — oh! It does not fit. Let\'s try another one!', 'You put it in! You solved the problem all by yourself!'],
  close: 'Your brain figured out a puzzle today! Some things fit and some things do not — and you are learning to tell the difference. That is real thinking!',
  questions: {
    beginner: ['Can it fit?', 'Where did it go?'],
    intermediate: ['Which container is bigger?', 'Will this one fit?'],
    advanced: ['Why do you think it will not fit?', 'Which one should we try next?'],
    openEnded: ['What do you think will happen?', 'What did you discover?']
  },
  responses: {
    typical: 'Baby attempts to place blocks in container, may use trial and error. Shows delight when successful.',
    strong: 'Baby deliberately selects the right container for each block, showing early spatial reasoning.',
    shy: 'Baby watches teacher demonstration carefully before attempting independently.',
    limitedLanguage: 'Baby communicates through motor action — persistent attempts, handing objects to teacher, pointing.'
  },
  shySupport: {
    prompts: ['Watch me do it first, then you can try.', 'Would you like to hold the container while I put the block in?'],
    alternatives: ['Place the container in baby\'s hands and guide the block toward it', 'Use a favorite object (not a standard block) to increase motivation'],
    encouragement: ['You are trying so hard — that is exactly right!', 'Look — it went in! You did that!']
  },
  observation: ['Does baby show problem-solving behavior (trial-and-error) when block does not fit?', 'Does baby show frustration tolerance when the object does not fit?', 'Does baby repeat the action multiple times showing emerging persistence?', 'Does baby look to teacher for help or continue independently?'],
  rubric: {
    beginning: 'Baby holds object but shows no intentional container insertion behavior.',
    developing: 'Baby attempts to place object in container with assistance; celebrates when successful.',
    proficient: 'Baby independently inserts objects into containers using trial-and-error problem solving.',
    advanced: 'Baby selects appropriately-sized containers for different objects, showing emergent spatial reasoning.'
  },
  teacherNotes: ['{child} tried 3 different containers before finding one that fit the large block — excellent early problem-solving and persistence.', 'During Container Play, {child} independently transferred 5 blocks to the container without assistance, showing strong fine motor intentionality.'],
  parentReport: {
    example: 'We played with containers and blocks today, exploring what fits and what does not. This simple activity builds spatial reasoning — the ability to understand size, shape, and how objects relate to each other in space. This is a foundational math and engineering skill! Your child showed wonderful persistence and a delightful "aha!" moment when a block finally fit.',
    homeExtension: 'Give your child a plastic container (like a storage bowl) and 4-5 large safe objects to fill and dump. This fill-and-dump play seems simple but is developing critical spatial reasoning and fine motor skills — let it happen freely!'
  },
  variations: {
    smallGroup: 'Give each baby their own container set. Compare what fits: "Sofia fits a big block! Liam fits a little ball!"',
    wholeClass: 'Create a "fill station" that babies can access during free play with multiple container sizes.',
    outdoor: 'Use buckets and natural objects — fill a bucket with rocks, sticks, or leaves.',
    indoor: 'Nesting cups, stacking rings, and shape sorters are all container play variations perfect for indoor use.',
    lowResource: 'An empty cardboard box and large building blocks — the simplest version of this activity.'
  },
  classroomMgmt: {
    transitions: 'This activity works well as a center activity between more social or language-focused sessions.',
    disruptions: 'If baby bangs containers loudly, redirect by demonstrating the quiet "placing" motion.',
    participation: 'Babies who only dump (not fill) are also learning — the dump action teaches about containers and gravity.',
    diverseLearners: 'For babies with fine motor challenges, use larger containers with very wide openings. Gradually reduce the opening size over weeks.'
  },
  materials: { required: ['Safe containers of varying sizes','Large soft blocks or balls'], optional: ['Nesting cups','Sorting basket','Transparent containers so baby can see inside'], printable: ['Spatial Reasoning development checklist'], digital: [] }
};

COACHING_DATA['ic4'] = {
  intro: 'Look at this amazing mirror! Do you know what you see in there? Let\'s find out together!',
  tips: ['Use an unbreakable baby-safe mirror — never a glass mirror on the floor', 'Initially, babies recognize the "interesting baby" without knowing it is themselves (usually until 15-18 months)', 'Name body parts clearly while pointing at them in the reflection'],
  prompts: ['Look! Who is that? That is YOU! That is [baby\'s name]!', '[Point to nose in mirror] Here is your nose! Can you touch your nose? [Touch your own nose too]', 'You are smiling! Look — the baby in the mirror is smiling too! That is because it is YOU!'],
  close: 'You have the most wonderful face, and now you know what you look like! That baby in the mirror — that is always YOU looking back.',
  questions: {
    beginner: ['Who is that?', 'Can you touch your nose?'],
    intermediate: ['Where are your eyes?', 'Can you make a funny face?'],
    advanced: ['Is that you or me in the mirror?', 'What do you see on your face?'],
    openEnded: ['What do you notice about yourself?', 'What face do you want to make?']
  },
  responses: {
    typical: 'Baby gazes intently at reflection, reaches toward it, and may vocalize at the "other baby."',
    strong: 'Baby touches own face after touching the reflection — showing early self-recognition development.',
    shy: 'Baby watches the reflection with careful, focused attention without reaching — still valid engagement.',
    limitedLanguage: 'Baby communicates through gaze, reaching toward reflection, and mimicking movements seen in mirror.'
  },
  shySupport: {
    prompts: ['Look — I am in the mirror too! See? There is the teacher!', 'You can just look at the mirror — it is very friendly!'],
    alternatives: ['Sit next to baby looking in the mirror together — your familiar face provides security', 'Use a smaller handheld mirror for a less overwhelming experience'],
    encouragement: ['I see the most beautiful face in that mirror!', 'Look at those amazing eyes!']
  },
  observation: ['Does baby show recognition response (stilling, reaching, or social smile) at the reflection?', 'Does baby touch their own face in response to seeing the reflection touch its face?', 'Does baby look between caregiver and reflection — making the connection?', 'Any self-referential behavior (touching a mark on their own face that is visible in the mirror)?'],
  rubric: {
    beginning: 'Baby does not respond differently to mirror reflection versus any other visual stimulus.',
    developing: 'Baby gazes at reflection with social interest — smiling, vocalizing at the "other baby."',
    proficient: 'Baby reaches toward reflection and shows differential response when own face changes expression.',
    advanced: 'Baby begins touching own body parts after seeing them in reflection — emerging self-recognition.'
  },
  teacherNotes: ['{child} smiled and reached toward their reflection in the mirror today — showing strong social self-awareness development.', 'During Mirror Discovery, {child} touched their own nose after seeing it in the mirror — an exciting early self-recognition marker.'],
  parentReport: {
    example: 'Today we explored the mirror together — and this activity is much more developmentally meaningful than it appears! Self-recognition in mirrors is a cognitive milestone that develops between 15-18 months. Right now, your child is fascinated by that "interesting baby" in the mirror, which is building their social brain, face recognition, and early identity. They showed wonderful engagement today!',
    homeExtension: 'Put a safe baby mirror on the floor during tummy time. Your child will be motivated to lift their head to see their own reflection — combining a cognitive milestone with a physical one!'
  },
  variations: {
    smallGroup: 'Use a large mirror at baby level so multiple babies can see themselves and each other — builds peer awareness.',
    wholeClass: 'Use wall-mounted mirrors at floor level during free play time.',
    outdoor: 'Use a handheld mirror outside — reflect sunlight (safely, away from eyes) onto surfaces to add wonder.',
    indoor: 'A full-length unbreakable mirror propped safely against a wall is ideal.',
    lowResource: 'No mirror? Use a large metal baking sheet (smooth side) as a simple low-cost reflective surface.'
  },
  classroomMgmt: {
    transitions: 'Mirror play works well during alert, social times after feeding. End naturally when baby disengages.',
    disruptions: 'If baby bangs the mirror, redirect by holding it steady and guiding baby\'s hand to touch gently.',
    participation: 'Some babies need multiple sessions before showing active self-recognition behavior — this is developmentally normal.',
    diverseLearners: 'For babies with visual processing differences, hold the mirror very close (6-10 inches) for a clearer, stronger image.'
  },
  materials: { required: ['Safe unbreakable baby-safe mirror'], optional: ['Mirror tiles (floor-level, secured safely)','Small handheld mirror'], printable: ['Self-recognition developmental milestone tracker'], digital: [] }
};

})(); // end loadInfantCoaching2

(function loadInfantCoaching3() {

COACHING_DATA['is1'] = {
  intro: 'Let\'s look at some feelings together! Faces tell us so much about how someone feels inside.',
  tips: ['Use real, genuine expressions rather than exaggerated theatrical ones', 'Hold cards at baby\'s eye level and allow several seconds of gazing per card', 'Mirror back any emotion baby shows: if baby smiles, say "You are happy!"'],
  prompts: ['[Show happy face card] This face is HAPPY! Can you see the smile? [Make a happy face]', '[Make a sad face] This is SAD. Sometimes we feel sad. That is okay.', 'Look — you are smiling! Your face is HAPPY! I can read your face!'],
  close: 'Faces tell us so much! Happy, sad, surprised — every feeling shows on our face. You are learning to read feelings, and that is so important.',
  questions: { beginner: ['Are you happy?','Look at the happy face!'], intermediate: ['Is this face happy or sad?','What does your face feel like right now?'], advanced: ['Can you make a surprised face?','How does this person feel?'], openEnded: ['What do you think this face is saying?','When do you feel like that?'] },
  responses: { typical: 'Baby gazes at emotion cards and mirrors some expressions back to the teacher.', strong: 'Baby actively imitates facial expressions shown and vocalizes in response to emotional faces.', shy: 'Baby watches quietly but with focused visual tracking of the emotion cards.', limitedLanguage: 'Baby communicates through imitating facial expressions and changing their own face in response.' },
  shySupport: { prompts: ['I will make the face first — watch!','You can just look at the pictures.'], alternatives: ['Use a mirror together — make faces side by side','Place emotion cards on the floor for baby to crawl toward'], encouragement: ['I saw you smile — your face is HAPPY!','You are learning to read feelings — that is amazing!'] },
  observation: ['Does baby mirror any emotions shown?','Does baby show differential response to different emotion cards?','Does baby make spontaneous emotional expressions during the activity?','Does baby seem to understand the emotional "meaning" of different faces?'],
  rubric: { beginning: 'Baby shows minimal response to emotion cards; flat affect throughout.', developing: 'Baby gazes at cards and shows occasional mirroring of clear emotions like happiness.', proficient: 'Baby consistently responds to emotion cards with mirroring and vocalizations.', advanced: 'Baby makes deliberate emotional expressions in response to cards and shows recognition of emotional states.' },
  teacherNotes: ['{child} mirrored a happy face expression today when shown the happy emotion card — beautiful early emotional literacy.', 'During Emotion Faces, {child} made a clear sad face when shown the sad card, showing early empathic emotional recognition.'],
  parentReport: { example: 'Today we explored emotion faces together using pictures of different expressions. This builds "emotional literacy" — the ability to recognize and name feelings, which is foundational for empathy, communication, and social skills. Your child showed wonderful engagement, studying each face carefully!', homeExtension: 'Make funny and expressive faces with your baby during daily routines — surprised, happy, silly! This face-to-face time builds emotional recognition and social bonding simultaneously.' },
  variations: { smallGroup: 'Babies watch each other\'s reactions to emotion cards — early peer emotional awareness.', wholeClass: 'All caregivers make the same emotion face simultaneously for a powerful whole-room experience.', outdoor: 'Point out expressions of people passing by (from a safe distance): "That person is smiling — they look happy!"', indoor: 'Ideal as a calm, floor-based activity anytime.', lowResource: 'Make emotion faces yourself — no cards needed. Your face is the best emotion resource.' },
  classroomMgmt: { transitions: 'Use this as a calming activity before nap or after a transition.', disruptions: 'If baby grabs cards, let them hold and explore — name the emotion on the card they are holding.', participation: 'Non-responding babies often need the caregiver to make more exaggerated, clear expressions.', diverseLearners: 'For babies with limited facial muscle control, focus on vocal tone of emotion rather than facial expression cards.' },
  materials: { required: ['Emotion picture cards (happy, sad, surprised, calm)'], optional: ['Baby-safe unbreakable mirror','Photo cards of real baby faces showing emotions'], printable: ['Emotion faces flashcard set'], digital: ['Sesame Street feelings videos'] }
};

COACHING_DATA['is2'] = {
  intro: 'We are going to have some special gentle time together. I am going to touch you so gently and tell you what I am doing.',
  tips: ['Always narrate every touch: "I am touching your hand so gently"', 'Follow baby\'s cues completely — if they pull away, pause and reconnect through voice first', 'Use consistent, warm eye contact throughout the entire routine'],
  prompts: ['[Gentle hand touch] Here is your hand. Such a sweet little hand. I am touching it gently.', '[Name body part as you touch] Foot! There is your foot. I am patting your foot so softly.', 'You are so calm and safe. This is a time for us to be close and gentle together.'],
  close: 'That was our gentle time together. You are safe, you are loved, and I will always take good care of you.',
  questions: { beginner: ['Does that feel good?','Is this your hand?'], intermediate: ['Can you squeeze my finger?','Where is your foot?'], advanced: ['Can you touch my hand?','What do you feel?'], openEnded: ['How does that feel?','Where do you want me to touch next?'] },
  responses: { typical: 'Baby relaxes during gentle touch, makes eye contact with caregiver, and vocalizes softly.', strong: 'Baby reaches toward caregiver\'s hands and initiates physical connection, showing secure attachment.', shy: 'Baby stiffens slightly at first but relaxes into the routine as it becomes familiar.', limitedLanguage: 'Baby communicates through muscle relaxation, turning toward caregiver, and sustained eye contact.' },
  shySupport: { prompts: ['I will be very gentle — just like this.','You are completely safe with me.'], alternatives: ['Begin with gentle touch to a less sensitive area (hand or arm) before moving to other areas', 'Let baby hold your finger first before beginning touch routine'], encouragement: ['You are so relaxed and safe!','I love this special time with you!'] },
  observation: ['Does baby relax into the touch or show tension throughout?', 'Does baby maintain eye contact during the routine?', 'Does baby show any self-soothing behaviors?', 'Does baby vocalize during gentle touch — indicating communication and bonding?'],
  rubric: { beginning: 'Baby shows tension or discomfort during gentle touch; does not settle into routine.', developing: 'Baby tolerates touch routine and shows intermittent eye contact and vocalization.', proficient: 'Baby consistently relaxes into touch routine and maintains engaged eye contact.', advanced: 'Baby initiates touch connection with caregiver and shows clear signs of secure attachment.' },
  teacherNotes: ['{child} maintained eye contact and smiled throughout the Gentle Touch Routine today — a beautiful indicator of secure attachment.', 'During gentle time, {child} reached for my hand and held it — showing strong social bonding and trust.'],
  parentReport: { example: 'We had a special Gentle Touch Routine today — a time of caring, quiet physical connection where I touched baby gently and narrated each action. This kind of responsive, loving touch is one of the most important things we can do for infant brain development. It builds secure attachment, reduces stress hormones, and supports healthy development across every domain.', homeExtension: 'During bath time or after diaper changes, try 2-3 minutes of gentle massage using safe lotion or just bare hands. Narrate what you are doing: "I am rubbing your little foot." This builds trust, language, and bonding all at once.' },
  variations: { smallGroup: 'Individual gentle time with each baby in sequence while others nap or rest.', wholeClass: 'Each caregiver does simultaneous gentle time with their assigned babies.', outdoor: 'Gentle touch during outdoor carrier time — narrate what baby can feel (breeze, warmth, movement).', indoor: 'Ideal activity for quiet indoor time, especially before nap.', lowResource: 'No materials needed — only warm, present, gentle hands.' },
  classroomMgmt: { transitions: 'This is an excellent transition INTO nap time — it calms the nervous system naturally.', disruptions: 'If baby is dysregulated, use gentle touch to co-regulate before other activities.', participation: 'Every baby can participate — this is the most universally accessible infant activity.', diverseLearners: 'For babies who are sensory-sensitive, use only very light touch and shorter duration. Build tolerance gradually.' },
  materials: { required: ['Soft cloth','Caregiver\'s warm, caring presence'], optional: ['Gentle baby-safe lotion','Soft music in the background'], printable: ['Secure Attachment observation guide'], digital: ['Zero to Three secure attachment resources'] }
};

COACHING_DATA['is3'] = {
  intro: 'It is floor time together! All our babies are going to be near each other. Let\'s see what happens!',
  tips: ['Position babies close enough to see each other but not so close that they accidentally grab or disturb each other', 'Narrate peer interactions: "Look! Noah is reaching for Sofia!"', 'Allow organic interaction rather than engineering it — observation is the primary goal'],
  prompts: ['Look! That is your friend Mia! Can you see Mia? She is right over there!', 'Oh! Liam is looking at you! He thinks you are very interesting!', 'You are all playing near each other — that is how friendships begin!'],
  close: 'You spent time near your friends today. That is the beginning of friendship — just being together and noticing each other.',
  questions: { beginner: ['Do you see your friend?','Who is that?'], intermediate: ['What is your friend doing?','Do you want to look at your friend?'], advanced: ['Can you show your friend your toy?','Is your friend happy?'], openEnded: ['What do you notice about the babies around you?','What do you want to do near your friends?'] },
  responses: { typical: 'Babies gaze at each other, may reach toward the other baby, and vocalize when the peer vocalizes.', strong: 'Baby reaches toward peer, offers a toy, or imitates the other baby\'s movements or sounds.', shy: 'Baby observes peer closely from a comfortable distance without reaching.', limitedLanguage: 'Baby communicates interest through sustained gazing, leaning toward peers, and parallel vocalizations.' },
  shySupport: { prompts: ['You can just look at your friends from here — that is perfect.','Your friend is very kind — they will not bother you.'], alternatives: ['Position shy baby slightly apart but with clear sightline to peers', 'Caregiver sits between baby and group as a "bridge"'], encouragement: ['You are watching your friends so carefully!','You are part of this group even when you are being quiet!'] },
  observation: ['Does baby notice and orient toward peers?', 'Does baby show positive social interest in peers (smiling, reaching)?', 'Does baby engage in any "protoconversation" with peers (back-and-forth vocalizations)?', 'Does baby show any distress at peer proximity (this is also normal and important to note)?'],
  rubric: { beginning: 'Baby does not orient toward or notice nearby peers.', developing: 'Baby gazes at peers when they vocalize or move but shows no active social approach.', proficient: 'Baby orients to peers, smiles at them, and shows clear peer social interest.', advanced: 'Baby reaches toward peers, offers objects, and engages in reciprocal peer interaction.' },
  teacherNotes: ['{child} reached toward a nearby peer and offered their rattle today — an extraordinary early social gesture.', 'During Group Floor Time, {child} consistently watched their peer and smiled when the peer made sounds — excellent social responsiveness.'],
  parentReport: { example: 'Today your child spent floor play time near their classroom peers. This group time is more important than it might appear — even at this age, babies are building the earliest foundations of peer awareness and social interest. Your child showed wonderful curiosity about their friends, watching them carefully and responding to their vocalizations.', homeExtension: 'Arrange play dates with other babies close in age. Even 30 minutes of parallel floor play near another baby builds critical peer social awareness.' },
  variations: { smallGroup: 'Place 2-3 babies on a large play mat — optimal ratio for observed interaction.', wholeClass: 'Whole-group floor circle — all babies positioned on a large mat together.', outdoor: 'Blanket on the grass with all babies — outdoor environment adds rich sensory context.', indoor: 'A large padded play mat in a clear floor area works perfectly.', lowResource: 'No materials needed beyond a safe floor space and proximity.' },
  classroomMgmt: { transitions: 'Group floor time works well after individual one-on-one activities as a social transition.', disruptions: 'If babies grab each other, narrate gently: "We use gentle hands with our friends" and physically guide gentle touch.', participation: 'All babies participate simply by being present — even sleeping babies near peers are experiencing the social environment.', diverseLearners: 'For babies who become overwhelmed by peer proximity, start at greater distances and gradually move closer over many sessions.' },
  materials: { required: ['Large play mat','Soft toys placed around the mat'], optional: ['Mirror at baby level so babies can see themselves and each other','Soft music playing in background'], printable: ['Peer Social Development observation guide'], digital: [] }
};

COACHING_DATA['is4'] = {
  intro: 'I am listening to YOU now. Every sound you make tells me something. Talk to me!',
  tips: ['Respond to every vocalization — even the smallest coo — within 2-3 seconds', 'Imitate baby\'s exact sounds back to them rather than replacing with adult speech', 'Wait 5-7 seconds after your response to allow baby\'s turn — resist filling the silence'],
  prompts: ['[Wait for baby to vocalize] Oh! "Aaaa!" You said something! "Aaaa!" [imitate back]', '[After baby\'s response] Now it\'s my turn. Ba ba ba. [pause] Your turn!', 'We are having a real conversation! You talk, I listen. I talk, you listen. That is how all conversations work!'],
  close: 'What a wonderful conversation we had! Every time you make a sound, I will always answer. That is my promise to you.',
  questions: { beginner: ['What do you want to say?','Can you talk to me?'], intermediate: ['What sound can you make?','Can you copy my sound?'], advanced: ['Can you make a new sound?','What are you trying to tell me?'], openEnded: ['I am listening — what do you have to say?','What is the most important thing you want me to know?'] },
  responses: { typical: 'Baby vocalizes in response to caregiver\'s imitation and pauses to listen when caregiver speaks.', strong: 'Baby takes clear communicative turns — vocalize, pause, listen, vocalize — showing intentional dialogue structure.', shy: 'Baby vocalizes softly or shows communicative gazes rather than sounds — all valid communication.', limitedLanguage: 'Baby uses gaze, facial expression, and body movement as their "words" in the conversation.' },
  shySupport: { prompts: ['I am right here listening to whatever you want to say.','Even your eyes are talking to me right now!'], alternatives: ['Accept gaze and gesture as valid conversation turns', 'Narrate what baby seems to be "saying" through their body language'], encouragement: ['I heard everything you said!','You are the best conversationalist!'] },
  observation: ['Does baby pause and look at caregiver after vocalizing — showing turn-taking awareness?', 'Does baby vocalize more when caregiver responds versus when caregiver is silent?', 'Does baby imitate any specific sounds back to caregiver?', 'Does baby use gaze shifts to initiate or maintain conversational turns?'],
  rubric: { beginning: 'Baby vocalizes but shows no awareness of turn-taking; continues vocalizing without listening.', developing: 'Baby pauses occasionally after vocalizing, making brief eye contact before vocalizing again.', proficient: 'Baby shows clear communicative turn-taking — vocalize, wait, listen, respond — with consistent eye contact.', advanced: 'Baby deliberately varies vocalizations in response to caregiver\'s sounds, showing early imitation and creative communication.' },
  teacherNotes: ['{child} engaged in a beautiful 4-turn vocal conversation today — clear evidence of emerging communicative turn-taking.', 'During Call and Response, {child} imitated the "ba ba" sound back to me twice — exciting early imitation and language development.'],
  parentReport: { example: 'Today we practiced Call and Response — taking turns vocalizing and listening with your child. This conversational turn-taking is one of the most important foundations of language development. When caregivers respond consistently to baby\'s sounds, babies learn that communication works — their words have power and people listen. Your child is a wonderful communicator!', homeExtension: 'During diaper changes, meals, and bath time, have "conversations" with your baby — respond to every sound they make, then wait for their response. These brief vocal exchanges build the language architecture that supports all future communication.' },
  variations: { smallGroup: 'Each caregiver takes turns having a brief one-on-one "conversation" with each baby while others observe.', wholeClass: 'Group vocalization circle — all babies and caregivers vocalize together, then listen together.', outdoor: 'Have a "nature conversation" — make the sounds of things you see: bird chirping, wind, water.', indoor: 'Perfect quiet activity during any indoor awake time.', lowResource: 'No materials needed — voice and presence only.' },
  classroomMgmt: { transitions: 'Use call-and-response as a transition signal — a specific sound that means "we are moving to something new."', disruptions: 'Loud disruptions from nearby activities can interrupt this delicate interaction. Seek a quieter corner of the room.', participation: 'All babies can participate. Even babies who are very quiet communicate through gaze and gesture.', diverseLearners: 'For babies with hearing differences, emphasize visual communication — facial expression, gesture, and touch as conversation.' },
  materials: { required: ['No materials needed — voice and attention are the only tools'], optional: ['Quiet calming music as a background'], printable: ['Communicative Turn-Taking observation checklist'], digital: ['Zero to Three communication milestones guide'] }
};

})(); // end loadInfantCoaching3

(function loadInfantPhysicalCreativity() {

COACHING_DATA['ip1'] = {
  intro: 'Tummy time! Let\'s put you on your belly and see how strong you are getting!',
  tips: ['Always stay within arm\'s reach during tummy time — never leave baby unattended', 'Place a rolled towel under baby\'s chest if they struggle — a small support makes a big difference', 'Build up from 1-2 minutes to 10 minutes as strength develops over weeks'],
  prompts: ['Look up here! Can you lift your head? You are so strong!', '[Place toy just out of reach] Can you reach for it? Look — your favorite toy!', 'You lifted your head! Your neck muscles are getting SO strong!'],
  close: 'Amazing tummy time! Your head came up and your back got stronger today. Every second on your tummy is making you stronger and smarter.',
  questions: { beginner: ['Can you lift your head?','Look up here!'], intermediate: ['Can you reach the toy?','How high can you look?'], advanced: ['Can you push up on your arms?','Which way do you want to look?'], openEnded: ['What can you see from up there?','What do you want to reach for?'] },
  responses: { typical: 'Baby lifts head 45 degrees, holds for several seconds, then rests. Shows motivation when toy is placed in view.', strong: 'Baby pushes up on arms, holds head high, and turns to look in both directions.', shy: 'Baby rests head down initially but lifts briefly when caregiver\'s voice or toy catches attention.', limitedLanguage: 'Baby communicates through physical action — lifting, turning, reaching, and vocalizing with effort.' },
  shySupport: { prompts: ['I am right here with you. You are doing great.','Rest when you need to — then we will try again!'], alternatives: ['Prop on caregiver\'s lap (lying on chest) before floor tummy time', 'Use a Boppy pillow for supported tummy time'], encouragement: ['Look at you! You are lifting your whole head!','Every second you hold your head up makes you stronger!'] },
  observation: ['How many seconds does baby sustain head lift?', 'Does baby turn head to both sides during tummy time?', 'Does baby push up on forearms (emerging upper body strength)?', 'Does baby reach toward objects placed in front during tummy time?'],
  rubric: { beginning: 'Baby rests head on mat; minimal or no head lifting.', developing: 'Baby lifts head briefly (1-5 seconds) when motivated by voice or toy.', proficient: 'Baby lifts head 45 degrees and holds for 10+ seconds; turns in both directions.', advanced: 'Baby pushes up on forearms, lifts head to 90 degrees, and reaches toward objects during tummy time.' },
  teacherNotes: ['{child} held their head up for 15 seconds during tummy time today — strongest session yet!', '{child} turned to look left and right during tummy time, showing excellent bilateral neck development.'],
  parentReport: { example: 'We did tummy time today, and your child showed wonderful progress! Tummy time builds the neck and back muscles essential for sitting, crawling, and eventually walking. It also prevents positional head flattening. Every minute of tummy time is an investment in your child\'s physical development.', homeExtension: 'Aim for 3-5 tummy time sessions per day at home — even 2-3 minutes each adds up! Do it right after a diaper change when baby is alert and comfortable. Always stay right there with them.' },
  variations: { smallGroup: 'Two babies side by side on a mat — seeing each other motivates both to lift heads!', wholeClass: 'Group tummy time with soft music and colorful toys in a circle — social and physical development together.', outdoor: 'Tummy time on a blanket in the grass — the new sensory experience (feeling the ground through the blanket) is highly motivating.', indoor: 'Use a firm, flat play mat away from hazards. Place colorful toys or a mirror in front.', lowResource: 'No special equipment needed — a firm, flat surface and a motivated baby is all you need.' },
  classroomMgmt: { transitions: 'Schedule tummy time 30 minutes after feeding — not immediately after, to avoid spit-up discomfort.', disruptions: 'If baby cries persistently after 2 minutes, pick up and comfort. Never force extended tummy time.', participation: 'Babies who hate tummy time on the floor may tolerate it on caregiver\'s chest — same developmental benefits.', diverseLearners: 'For babies with medical conditions affecting tummy time (reflux, etc.), consult with parents and follow medical guidance.' },
  materials: { required: ['Firm play mat','Colorful toys to place in front of baby'], optional: ['Rolled towel for chest support','Boppy pillow','Baby-safe mirror placed in front'], printable: ['Tummy Time progress tracker'], digital: [] }
};

COACHING_DATA['ip2'] = {
  intro: 'I have something wonderful right up here for you to reach for! Can your hand find it?',
  tips: ['Position the toy just outside baby\'s current reach — not so far it is frustrating, not so close there is no challenge', 'Allow 30+ seconds of reaching attempts before any assistance', 'Celebrate the ATTEMPT as much as the success — effort is the developmental goal'],
  prompts: ['Look! Can you reach it? Stretch! Stretch your arm!', 'You almost have it! Reach just a little more — you can do it!', '[Baby grasps] YOU GOT IT! Your hand found it! Amazing!'],
  close: 'Your hands learned something important today — they can reach out and GRAB what they want! That is the beginning of everything.',
  questions: { beginner: ['Can you grab it?','Reach for it!'], intermediate: ['Which hand will you use?','Can you hold it with two hands?'], advanced: ['Can you pass it from one hand to the other?','What will you do with it now?'], openEnded: ['What do you want to reach for next?','How does it feel in your hand?'] },
  responses: { typical: 'Baby extends arm toward object, may swipe before grasping accurately.', strong: 'Baby reaches directly and accurately, grasps object, and brings it to mouth to explore.', shy: 'Baby looks at the object with intense interest but reaches tentatively.', limitedLanguage: 'Baby communicates through sustained reaching, gaze at object, and vocalizing during effort.' },
  shySupport: { prompts: ['You can reach for it — your hand knows how!','Take your time — it will wait for you.'], alternatives: ['Move object slightly closer to within easier reach to build confidence first', 'Gently shake the object to increase its visual appeal and motivation'], encouragement: ['You reached for it — that is AMAZING!','Your hand knows exactly what to do!'] },
  observation: ['Is baby reaching accurately (directly to object) or swiping broadly?', 'Does baby use a whole-hand grasp or are beginning pincer signs emerging?', 'Does baby transfer objects between hands?', 'Does baby look at the object before reaching (eye-hand coordination)?'],
  rubric: { beginning: 'Baby does not reach intentionally toward objects; swipes randomly.', developing: 'Baby reaches toward objects in close proximity, may contact but not grasp consistently.', proficient: 'Baby reaches accurately and grasps objects placed within arm\'s reach.', advanced: 'Baby reaches precisely, grasps with emerging differentiated finger use, and transfers between hands.' },
  teacherNotes: ['{child} reached directly for the ring with clear intentional accuracy today — excellent eye-hand coordination development.', 'During Reach and Grasp, {child} transferred the object from right to left hand — a fine motor milestone typically seen at 5-6 months.'],
  parentReport: { example: 'Today we practiced reaching and grasping — hanging toys at just the right distance for your child to reach for. This builds eye-hand coordination, intentional motor control, and the hand muscles needed for all future fine motor skills including writing. Your child showed wonderful persistence and excitement when they grasped the toy!', homeExtension: 'Dangle a colorful toy (like a rattle or ring) above your baby during floor play — just within reach. Watch how long they try! This motivated reaching is powerful brain and muscle development.' },
  variations: { smallGroup: 'Give each baby a dangling toy on a play gym. Compare reaching strategies across the group.', wholeClass: 'Set up a row of play gyms during active play time so all babies can practice simultaneously.', outdoor: 'Hang colorful streamers from a tree branch at baby\'s reach level while in a carrier or on a blanket.', indoor: 'Baby gym or bouncy seat with overhead toys is ideal.', lowResource: 'Hang a colorful ribbon from a doorway at the right height — simplest version with no cost.' },
  classroomMgmt: { transitions: 'This works well as an alert-time activity during natural awake periods.', disruptions: 'If baby becomes frustrated, move the object to within easy grasp and celebrate that success before gradually moving it back.', participation: 'All physically capable infants can participate — adjust object distance based on each baby\'s current reach range.', diverseLearners: 'For babies with motor considerations, consult with occupational therapist on appropriate positioning and support.' },
  materials: { required: ['Dangling toys or rings at reaching distance','Baby gym or play mat'], optional: ['Wrist rattles','High-contrast dangling objects'], printable: ['Fine Motor Development milestone tracker'], digital: [] }
};

COACHING_DATA['ip3'] = {
  intro: 'Let\'s practice sitting up! I am going to help support you while you use your strong belly muscles.',
  tips: ['Use your hands or a Boppy pillow to provide just enough support — reduce support as strength grows', 'Place toys at the sides to encourage weight shifting and lateral movement', 'Watch for fatigue signs (slumping, fussiness) and always end before baby tires'],
  prompts: ['There you are — sitting up and looking at the world! What can you see from up here?', '[Place toy to the side] Can you reach over here? Turn to look!', 'You are using your belly muscles right now. Strong core, strong everything!'],
  close: 'You sat up and saw the world from a whole new angle today! Every minute of sitting builds the muscles you need for crawling, standing, and walking.',
  questions: { beginner: ['Can you sit up?','Look over here!'], intermediate: ['Can you reach for the toy without falling?','Which way do you want to look?'], advanced: ['Can you sit without my hands?','What do you want to reach for?'], openEnded: ['What do you see from up there?','How does it feel to be sitting?'] },
  responses: { typical: 'Baby maintains supported sitting for 10-30 seconds before tiring; reaches for nearby toys.', strong: 'Baby sits independently with only minimal support needed, turning to track objects.', shy: 'Baby sits passively, looking around without active reaching — still valid core development.', limitedLanguage: 'Baby communicates through motor action — sustained sitting, weight shifting, reaching.' },
  shySupport: { prompts: ['I am right here behind you — you will not fall.','You are safe — I have you.'], alternatives: ['Use a floor seat or Boppy for less intimidating initial supported sitting', 'Begin with baby against a wall or couch corner with caregiver immediately in front'], encouragement: ['You are sitting! Look how strong you are!','Your core is getting so strong every day!'] },
  observation: ['How long does baby sustain supported sitting?', 'Does baby show protective arm extension (arms out to catch themselves)?', 'Does baby lean and reach without completely losing balance?', 'Is baby beginning to sit independently (tripod sitting — two hands on floor)?'],
  rubric: { beginning: 'Baby collapses immediately without full support; no head/trunk control in sitting.', developing: 'Baby holds a supported sit for 10-20 seconds with assistance.', proficient: 'Baby maintains supported sitting for 30+ seconds and reaches for objects without losing balance.', advanced: 'Baby sits independently (tripod or full unsupported) for 10+ seconds.' },
  teacherNotes: ['{child} sat with only minimal back support for 45 seconds today — an impressive core strength milestone.', 'During Supported Sitting, {child} reached to the right to grab a toy without losing their sitting balance — excellent postural control.'],
  parentReport: { example: 'We practiced supported sitting today, building the core strength your child needs for independent sitting, crawling, and eventually walking. We used a Boppy pillow and gradually reduced support as your child\'s muscles engaged. Your child showed excellent trunk strength and balance today!', homeExtension: 'Help your baby practice sitting between your outstretched legs on the floor. Place toys just out of reach to encourage leaning and weight shifting. Even 5 minutes twice a day builds significant core strength.' },
  variations: { smallGroup: 'Babies sit in a circle with toys in the center — motivates reaching and weight shifting.', wholeClass: 'Group sitting time on a large mat — visual social motivation to maintain position.', outdoor: 'Supported sitting on a blanket in the yard — tactile surface change engages trunk muscles differently.', indoor: 'Use a variety of supported surfaces: floor, Boppy, bouncy seat, in caregiver lap.', lowResource: 'Caregiver lap or V-sit between caregiver\'s legs is the simplest, most available support.' },
  classroomMgmt: { transitions: 'Supported sitting works well as a transition between floor play and social interaction.', disruptions: 'Never leave a baby unsupported in sitting — always spot them actively.', participation: 'Build sitting duration gradually. 5 seconds is a victory for a 4-month-old.', diverseLearners: 'For babies with hypotonia or physical concerns, follow physical therapist guidance on positioning and support levels.' },
  materials: { required: ['Boppy pillow or firm support','Toys placed to sides to encourage reaching'], optional: ['Floor seat','Rolled blanket for side support'], printable: ['Gross Motor sitting milestone tracker'], digital: [] }
};

COACHING_DATA['ip4'] = {
  intro: 'Let\'s see how strong those legs are! Can you kick? Kick kick kick!',
  tips: ['Position toy bar or target at exactly the right distance for foot contact — too far reduces success', 'Narrate the cause and effect: "Your foot kicked and the toy moved! YOU did that!"', 'Let baby make the connection between their kick and the toy\'s movement — this is a profound cognitive AND motor moment'],
  prompts: ['[Baby kicks toy] You kicked it! Did you see that? Your foot made it move!', 'Kick kick kick! Those legs are so strong! Can you kick it again?', '[Count kicks] One kick! Two kicks! Three kicks! Look at those powerful legs!'],
  close: 'What powerful legs you have! You made that toy move all by yourself with your kicks. Your legs are going to take you everywhere!',
  questions: { beginner: ['Can you kick it?','Kick kick kick!'], intermediate: ['Can you kick harder?','Can you kick with the other foot?'], advanced: ['Can you kick it two times in a row?','What happens when you kick?'], openEnded: ['What does kicking feel like?','Where do you think your legs will take you?'] },
  responses: { typical: 'Baby kicks rhythmically and shows delight when the toy moves in response.', strong: 'Baby kicks intentionally and repeatedly to make the toy move — clear cause-effect understanding.', shy: 'Baby moves legs but with less force; may watch the toy rather than actively kick toward it.', limitedLanguage: 'Baby communicates through physical action — kicking, squealing with effort, and gaze at the moving toy.' },
  shySupport: { prompts: ['Kick gently — just like that! You did it!','Look at what your feet can do!'], alternatives: ['Move the toy closer so any leg movement makes contact', 'Start with caregiver gently tapping the soles of baby\'s feet to activate kicking reflex'], encouragement: ['Look at those legs go!','Every kick makes you stronger!'] },
  observation: ['Are kicks becoming more intentional and directed (toward the target) over time?', 'Does baby show delight response when kick makes toy move — showing cause-effect understanding?', 'Does baby repeat the kick action to reproduce the effect?', 'Are kicks bilateral (both legs) or showing preference for one side?'],
  rubric: { beginning: 'Baby kicks reflexively without apparent intentionality or awareness of the toy.', developing: 'Baby kicks in the direction of the toy and shows brief pleasure when it moves.', proficient: 'Baby kicks intentionally to make the toy move and repeats the action deliberately.', advanced: 'Baby kicks with clear intent, aims for specific parts of the toy, and shows growing leg strength and control.' },
  teacherNotes: ['{child} kicked the toy bar 8 times in sequence today — demonstrating clear intentional cause-effect kicking behavior.', 'During Kicking Play, {child} watched the toy move from their kick and immediately kicked again to recreate the effect — excellent cognitive-motor development.'],
  parentReport: { example: 'Today we did Kicking Play with a hanging toy bar, and it was wonderful to watch! Your child is developing intentional leg strength and the understanding that their own actions cause things to happen in the world. That "kick → toy moves" connection is a profound cause-and-effect discovery. Your child showed great delight and persistence today!', homeExtension: 'Tie a colorful ribbon to a sock on baby\'s foot during playtime. As they kick, they will see the ribbon move — this creates the same cause-effect learning at home with no special equipment.' },
  variations: { smallGroup: 'Side-by-side babies with individual kick toys — babies motivate each other with their vocalizations of delight.', wholeClass: 'Group kicking time during activity play — caregivers facilitate at each baby\'s station.', outdoor: 'Baby in a bouncy seat outdoors kicks at leaves or streamers hung within reach.', indoor: 'Baby gym bar with hanging toys is the classic version.', lowResource: 'Hold a lightweight toy (like a soft ball) at baby\'s foot level and let them kick it away — then return it.' },
  classroomMgmt: { transitions: 'Kicking play is ideal for alert, active time — not recommended close to nap time.', disruptions: 'Keep the environment calm — loud distractions reduce baby\'s focus on the kicking-movement connection.', participation: 'All babies with typical leg movement can participate. Duration should match baby\'s alertness.', diverseLearners: 'For babies with limited leg movement, consult with physical therapist. Focus on whatever intentional movement IS present.' },
  materials: { required: ['Hanging toy bar or soft target for baby to kick'], optional: ['Activity gym','Colorful streamers at foot level'], printable: ['Gross Motor Kicking milestone checklist'], digital: [] }
};

COACHING_DATA['icr1'] = {
  intro: 'Listen! Do you hear the music? Let\'s move to the music together!',
  tips: ['Choose music with a clear, steady beat — not too fast or too loud', 'Move baby\'s limbs gently in time to the music — this is a shared dance', 'Include both familiar and novel songs — familiar songs build anticipation, novel songs build attention'],
  prompts: ['[Move baby\'s arms to music] Hear the beat? Our arms are dancing to the music!', '[Shake a rattle in time] Shake shake shake! The music and our rattle are making music together!', 'You love music! I can see it in your face — music makes you happy!'],
  close: 'Music and movement together — that is one of the most joyful things we can do! Your brain is building connections to music that will last your whole life.',
  questions: { beginner: ['Do you hear the music?','Let\'s dance!'], intermediate: ['Is the music fast or slow?','Can you move your arms to the beat?'], advanced: ['Can you tap the beat?','What do you want to dance to?'], openEnded: ['How does the music make you feel?','What does this music remind you of?'] },
  responses: { typical: 'Baby shows clear physical response to music — stilling to listen, then moving limbs with the beat.', strong: 'Baby anticipates musical phrases, bobs head rhythmically, and shows delight during favorite songs.', shy: 'Baby listens very quietly but with rapt attention — this focused listening is deep music processing.', limitedLanguage: 'Baby communicates through body movement response to music, facial expressions of pleasure, and vocalizing during songs.' },
  shySupport: { prompts: ['You can just listen — listening to music is wonderful!','I will dance first, and you can watch.'], alternatives: ['Hold baby close and sway — the physical rhythm bridges the musical experience', 'Use quieter, gentler music for babies who seem overwhelmed by louder sounds'], encouragement: ['I can see you love this music!','Your whole body is listening!'] },
  observation: ['Does baby show distinct behavioral change when music starts (increased alertness, movement)?', 'Does baby move rhythmically in response to music?', 'Does baby show preference for specific songs or musical styles?', 'Does baby vocalize (coo, babble) along with musical sounds?'],
  rubric: { beginning: 'Baby shows no differential response to music versus other sounds.', developing: 'Baby stills and attends when music begins; shows occasional rhythmic movement.', proficient: 'Baby shows clear joy response to music with rhythmic movement and vocalization.', advanced: 'Baby anticipates musical phrases, bobs rhythmically, and responds differentially to tempo and volume changes.' },
  teacherNotes: ['{child} bobbed their head clearly to the beat during music time today — showing impressive early rhythmic awareness.', 'During Music and Movement, {child} vocalized along with the song during the chorus — a beautiful example of musical communication.'],
  parentReport: { example: 'Today we had Music and Movement time, and your child responded beautifully! Music activates more areas of the brain simultaneously than almost any other activity. Moving to music builds rhythm, coordination, auditory processing, and joy — all at the same time. Your child showed wonderful musical awareness today!', homeExtension: 'Sing to your child throughout the day — during diaper changes, meals, bath, and car rides. Your voice is their favorite instrument. Repetition of the same songs builds vocabulary, memory, and musical pattern recognition.' },
  variations: { smallGroup: 'All babies dance together with a caregiver each — social musical joy.', wholeClass: 'Whole-room music circle with all babies and all caregivers dancing together.', outdoor: 'Dance outdoors to birdsong or a portable speaker — nature + music combination.', indoor: 'Circle time music is perfect — daily consistency makes it a beloved ritual.', lowResource: 'Sing a cappella — no instruments or devices needed. Your voice is the most powerful musical tool.' },
  classroomMgmt: { transitions: 'Use music transitions: one specific song signals activity end, another signals a new activity beginning.', disruptions: 'If a baby becomes overstimulated, reduce volume and tempo or hold baby close during music.', participation: 'All babies participate simply by hearing the music — no active movement is required.', diverseLearners: 'For babies with auditory sensitivities, reduce volume significantly and use softer instruments like bells or light percussion.' },
  materials: { required: ['Music player with varied children\'s music','Soft rattles or shakers for babies to hold'], optional: ['Small drum','Wrist bells for babies','Musical mobile'], printable: ['Music and Movement song list for infants'], digital: ['Spotify playlist: Infant Lullabies and Rhythms','PBS Kids music resources'] }
};

COACHING_DATA['icr2'] = {
  intro: 'Look at this special bag! There are beautiful colors inside. Can you touch it?',
  tips: ['Double-seal the bag and tape ALL edges firmly to the table — safety is paramount', 'Use gel or paint that contrasts clearly — bright colors on white background', 'Let baby explore at their own pace — do not direct the movement'],
  prompts: ['Look at the colors! Push the bag and see what happens!', '[Baby smears paint] You made a mark! Look what you created!', 'Red and blue — what do you see? Colors everywhere!'],
  close: 'You are an artist! You moved the colors and made something beautiful. Art begins with curiosity — and you have so much of it!',
  questions: { beginner: ['What colors do you see?','You made that!'], intermediate: ['Can you push the blue paint over here?','What happened when you touched it?'], advanced: ['Can you make a circle?','What color did you make when they mixed?'], openEnded: ['What do you see in the colors?','What do you want to do with the bag?'] },
  responses: { typical: 'Baby pats, pushes, and smears paint through the sealed bag, watching the colors move.', strong: 'Baby makes intentional marks and repeats movements that create interesting visual effects.', shy: 'Baby touches bag tentatively at first; caregiver modeling increases confidence.', limitedLanguage: 'Baby communicates through the physical exploration — pushing, patting, and visual tracking of color movement.' },
  shySupport: { prompts: ['Watch — I will touch it first. See? It is smooth and fun!','You can touch it with just one finger.'], alternatives: ['Start with the bag in caregiver\'s hands so baby can observe before touching', 'Place the bag on the floor for baby to find naturally during free exploration'], encouragement: ['You touched it! Look at the colors move!','You are making art right now!'] },
  observation: ['Does baby engage in purposeful visual-motor exploration (not just random hitting)?', 'Does baby repeat actions that produce interesting visual effects?', 'Does baby show positive affect (pleasure) during the sensory art experience?', 'Any early mark-making intentionality (specific gesture repeated to create a pattern)?'],
  rubric: { beginning: 'Baby touches bag briefly with flat affect; does not re-engage.', developing: 'Baby explores bag with both hands and shows interest in the moving colors.', proficient: 'Baby engages in sustained, purposeful color exploration and shows delight at creating effects.', advanced: 'Baby makes repeated, specific movements to create particular visual effects — early intentional mark-making.' },
  teacherNotes: ['{child} spent 12 full minutes exploring the sensory art bag today — extraordinary sustained attention for this age group.', 'During sensory art, {child} repeatedly drew a line across the bag and watched it reform — showing early understanding of cause and effect.'],
  parentReport: { example: 'Today we explored sensory art with a safely sealed bag of colored paint! Your child pressed and moved the paint through the bag, watching colors mix and swirl. This activity builds visual processing, cause-effect thinking, fine motor control, and early creative expression — all safely with no mess at all!', homeExtension: 'Make a sensory bag at home: put hair gel and food coloring in a zip-lock bag, seal with strong tape, and tape to a table or the floor. Add glitter or small beads for added visual interest. Your child can safely explore colors and textures.' },
  variations: { smallGroup: 'Each baby gets their own taped bag — compare the different designs they create.', wholeClass: 'Create a large shared sensory bag using a gallon bag — one baby at a time explores it.', outdoor: 'Take the sensory bag outside on a picnic table — sunlight through the bag creates beautiful color effects.', indoor: 'Tape to a low table or the floor for best stability.', lowResource: 'Use only water with a few drops of food coloring — beautiful and even cheaper than paint.' },
  classroomMgmt: { transitions: 'Place the sensory art bag on a table as an invitation — babies naturally gravitate toward it during free exploration.', disruptions: 'If a baby tries to bite or tear the bag, redirect immediately with a safer object.', participation: 'This is a naturally motivating activity — most babies engage quickly and willingly.', diverseLearners: 'For babies with visual processing differences, use high-contrast colors (black and white or red and blue).' },
  materials: { required: ['Zip-lock bag (gallon size)','Non-toxic colored paint or gel','Strong packing tape'], optional: ['Glitter inside bag','Multiple color bags','Metallic paint'], printable: ['Early mark-making developmental guide'], digital: [] }
};

COACHING_DATA['icr3'] = {
  intro: 'Shhh... listen. Do you hear that? That is the sound of rain/birds/the ocean. Let\'s listen together.',
  tips: ['Use high-quality recordings — cheap recordings with static can be overstimulating', 'Keep volume low — nature sounds should feel like background, not performance', 'Match the sound to the time of day: rain sounds for nap transitions, birds for morning alertness'],
  prompts: ['[Play birdsong] Listen! Those are birds. They are singing to us.', '[Play rain] Do you hear the rain? Pit-pit-pat. Rain makes everything grow.', 'Nature has such beautiful sounds. Your brain loves these sounds — they are very old and very calming.'],
  close: 'Nature is always making music — birds, rain, waves, wind. Now you know those sounds. You are part of nature too.',
  questions: { beginner: ['Do you hear the birds?','Listen...'], intermediate: ['What sound do you hear?','Is it loud or quiet?'], advanced: ['What animal do you think that is?','Does this sound remind you of anything?'], openEnded: ['What do you hear?','How does that sound make you feel?'] },
  responses: { typical: 'Baby stills and orients toward the sound; shows visible calming effect.', strong: 'Baby vocalizes in response to nature sounds — particularly birdsong — as if responding to the "conversation."', shy: 'Baby listens with complete stillness — this is deep sensory engagement.', limitedLanguage: 'Baby communicates through physical calming, changed breathing, and orientation toward the sound source.' },
  shySupport: { prompts: ['Just listen — the sounds will come to you.','This is a very gentle, safe sound.'], alternatives: ['Hold baby close while sounds play for added security', 'Use nature sounds during feeding for a combined calming experience'], encouragement: ['Your ears heard every single sound!','You are such a wonderful listener!'] },
  observation: ['Does baby calm in response to nature sounds?', 'Does baby vocalize in response to any specific sounds (particularly bird calls)?', 'Does baby orient toward the sound source?', 'Any differential responses between different types of nature sounds?'],
  rubric: { beginning: 'Baby shows no differential response to nature sounds versus other ambient sound.', developing: 'Baby shows calming or orienting response when nature sounds begin.', proficient: 'Baby consistently responds to nature sounds with attention, calming, or vocalization.', advanced: 'Baby vocalizes in response to sounds and shows differential responses to different nature soundscapes.' },
  teacherNotes: ['{child} calmed immediately when the rain sounds began — we will use this as a transition support before nap going forward.', 'During Nature Sounds, {child} vocalized clearly in response to the birdsong — as if having a conversation with the birds!'],
  parentReport: { example: 'Today we listened to nature sounds together — birdsong, gentle rain, and ocean waves. Nature sounds activate the calming parts of the brain and support healthy stress regulation. Many babies also show fascinating vocal responses to birdsong! This is a simple, beautiful activity for home too.', homeExtension: 'Play nature sounds (free on YouTube or Spotify) during quiet time, feeding, or before nap. Open a window to let real nature sounds in whenever weather allows — real birds and wind are the most authentic experience.' },
  variations: { smallGroup: 'Small group listening circle — babies sit on a blanket while caregivers play and describe different nature sounds.', wholeClass: 'Nature sounds as a whole-room calming environment during rest transition.', outdoor: 'Listen to REAL nature sounds outside — far richer and more varied than any recording.', indoor: 'Perfect indoor quiet activity, especially on rainy days or before rest time.', lowResource: 'Open a window and listen to real outdoor sounds — free, authentic, and highly effective.' },
  classroomMgmt: { transitions: 'Use a specific nature soundscape to signal nap transition — creates Pavlovian calming response over time.', disruptions: 'Nature sounds can be played during other activities as a calming layer without disrupting the primary activity.', participation: 'All babies participate simply by being in the space where sounds play.', diverseLearners: 'For babies with auditory sensitivities, nature sounds at very low volume can be more calming than silence.' },
  materials: { required: ['Quality speaker','Nature sounds recordings or app'], optional: ['Multiple soundscape recordings (birds, rain, ocean, forest)','White noise machine'], printable: ['Recommended nature sounds playlist'], digital: ['Calm app (infant mode)','YouTube: Nature Sounds for Babies'] }
};

})(); // end loadInfantPhysicalCreativity

(function loadInfantLifeHealthCharacter() {

COACHING_DATA['ils1'] = {
  intro: 'It is time to clean up! Listen for our special clean-up song — that means we are all done!',
  tips: ['Use the EXACT same song or phrase every single time — consistency creates the association', 'Demonstrate physically putting one toy away while singing', 'Keep clean-up moments brief and celebratory — not serious or stressful'],
  prompts: ['[Sing clean-up song] Clean up, clean up, everybody clean up!', 'The toy goes in the basket — [gesture] like this! Can you help?', 'We did it! Clean-up is all done! What wonderful helpers we are!'],
  close: 'Every time you hear our special song, you know it is clean-up time. You are already learning our routine — and that is so smart!',
  questions: { beginner: []  , intermediate: ['Are we all done?','Where does the toy go?'], advanced: ['Can you put it in the basket?','What comes after clean-up?'], openEnded: ['Why do we clean up?','How do you feel when things are tidy?'] },
  responses: { typical: 'Baby quiets and attends when the clean-up song begins; may grasp objects being collected.', strong: 'Baby hands a toy toward the basket when prompted during the song.', shy: 'Baby watches the clean-up process quietly — observational learning is valid.', limitedLanguage: 'Baby communicates through attending, watching caregiver\'s hands, and becoming calm during the ritual.' },
  shySupport: { prompts: ['Watch me put this away — can you see?','You can hold this while I put the other one away.'], alternatives: ['Give baby one specific toy to hold near the basket as part of the ritual', 'Use a consistent gesture alongside the song for non-verbal learners'], encouragement: ['You helped with clean-up!','You remembered the song! Smart baby!'] },
  observation: ['Does baby show a behavioral shift (stilling, attending) when the clean-up song begins?', 'Is baby developing an anticipatory response — recognizing what comes next when the song plays?', 'Does baby make any gesture toward the clean-up process (reaching toward basket)?', 'Does baby seem calmer or more settled after the clean-up ritual?'],
  rubric: { beginning: 'Baby does not respond differently to clean-up song versus other environmental sounds.', developing: 'Baby occasionally stills when clean-up song begins — early signal recognition.', proficient: 'Baby consistently responds to clean-up song as a routine signal with attention and calming.', advanced: 'Baby anticipates the clean-up routine and makes gestures toward participating in it.' },
  teacherNotes: ['{child} stilled and looked toward the toy basket when the clean-up song began today — showing early routine recognition.'],
  parentReport: { example: 'We use a special Clean-Up Signal song every day to signal the end of playtime. Even at this young age, babies develop routine awareness — they begin to feel what is coming next through consistent signals. This builds the sense of predictability and security that supports all healthy development.', homeExtension: 'Create your own family clean-up song at home — even humming the same tune every time you put toys away teaches your baby that routines are predictable and safe.' },
  variations: { smallGroup: 'All caregivers sing simultaneously with all babies — the shared ritual is powerful.', wholeClass: 'Whole-room clean-up song is a beautiful community ritual when done consistently.', outdoor: 'Same song signals the end of outdoor play and the transition inside.', indoor: 'Works in any indoor environment.', lowResource: 'No materials needed — only the consistent use of a specific song or phrase.' },
  classroomMgmt: { transitions: 'This IS a transition tool — use it consistently before every activity change.', disruptions: 'If a baby protests the end of play, acknowledge their feeling before singing: "I know you are not ready — and it is still time to clean up."', participation: 'All babies participate through observation of the ritual.', diverseLearners: 'Use a consistent visual gesture alongside the song for babies who are developing visual routines.' },
  materials: { required: ['Consistent clean-up song (same melody every time)'], optional: ['Small basket or bin to put toys in'], printable: ['Clean-Up Song lyrics card for caregiver reference'], digital: [] }
};

COACHING_DATA['ils2'] = {
  intro: 'It is snack time! Let\'s see what wonderful things we have on your tray today. You get to try them!',
  tips: ['Ensure all finger foods are age-appropriate, soft, and correctly sized (no choking hazards)', 'Stay within arm\'s reach and watch continuously during self-feeding — never turn away', 'Resist the urge to feed the baby yourself — the messy attempt IS the developmental goal'],
  prompts: ['Look! There is a little piece of banana on your tray. Can you pick it up?', '[Baby picks up food] You picked it up! You are feeding yourself!', 'Every food you taste teaches you something new. This is pear — sweet and soft!'],
  close: 'You fed yourself today! That is a big important step. Your hands know how to feed your body — and that is something to be very proud of.',
  questions: { beginner: ['Yummy! What are you eating?','Can you pick it up?'], intermediate: ['Is it sweet or salty?','Do you like it?'], advanced: ['Can you pick up the little piece?','What does it taste like?'], openEnded: ['Tell me what you are tasting.','What is your favorite food so far?'] },
  responses: { typical: 'Baby reaches for food on tray, may use raking grasp initially before developing pincer grip.', strong: 'Baby uses developing pincer grip, selects specific pieces, and brings food to mouth with accuracy.', shy: 'Baby touches food but may not bring it to mouth immediately — sensory exploration of food texture is valid.', limitedLanguage: 'Baby communicates through food exploration — touching, smelling, and eventually tasting.' },
  shySupport: { prompts: ['It is okay to just touch it first and smell it.','I will touch it too — see? Safe and yummy!'], alternatives: ['Offer food on a spoon first while working toward full self-feeding', 'Start with foods baby is very familiar with before introducing new textures'], encouragement: ['You put it in your mouth! YOU did that!','Your hands are learning to feed your body!'] },
  observation: ['What type of grasp does baby use? (raking, radial-palmar, beginning pincer)', 'Does baby show food preference (reaching toward some foods more than others)?', 'Does baby explore food texturally before eating it?', 'Any oral-motor concerns (difficulty managing texture, gagging)?'],
  rubric: { beginning: 'Baby does not reach for food independently; requires caregiver to place food directly in mouth.', developing: 'Baby uses raking grasp to gather food and brings to mouth with some success.', proficient: 'Baby uses consistent self-feeding with good food-to-mouth accuracy and emerging pincer grip.', advanced: 'Baby uses pincer grip to pick up individual small pieces and feeds themselves independently and tidily.' },
  teacherNotes: ['{child} used a developing pincer grasp to pick up individual banana pieces today — a fine motor milestone emerging right on schedule!', 'During Self-Feeding Exploration, {child} explored each food texture carefully before eating — showing thoughtful sensory processing.'],
  parentReport: { example: 'Today we practiced self-feeding with age-appropriate soft finger foods on the high chair tray. This messy but important activity builds fine motor skills (the pincer grip that later holds pencils), independence, food exploration, and healthy food attitudes. Your child tried several new textures today and showed wonderful curiosity!', homeExtension: 'Offer soft finger foods on the high chair tray at home: small banana pieces, soft pear, well-cooked pasta pieces. Stay right there and let your child explore and self-feed. The mess is worth the enormous developmental benefits.' },
  variations: { smallGroup: 'High chairs arranged in a semi-circle so babies can see each other eating — social eating from the start.', wholeClass: 'Group meal time with all babies self-feeding simultaneously — social mealtime modeling.', outdoor: 'Picnic-style snack outside in safe conditions — novel environment makes the experience extra enriching.', indoor: 'High chair at a stable, clean surface.', lowResource: 'Soft ripe banana pieces — the most universally available, perfectly textured finger food.' },
  classroomMgmt: { transitions: 'Establish a pre-meal hand-washing ritual as a consistent transition into mealtime.', disruptions: 'Food throwing is normal exploratory behavior at this age. Redirect calmly: "Food stays on the tray."', participation: 'All babies at appropriate developmental stage participate. Check with parents about any allergies or food restrictions first.', diverseLearners: 'For babies with oral-motor challenges or feeding difficulties, follow speech-language pathologist guidance. Never force food.' },
  materials: { required: ['Age-appropriate soft finger foods','High chair with clean tray'], optional: ['Suction bowl','Soft-tipped spoon available','Bib or smock'], printable: ['Age-appropriate finger food checklist'], digital: ['USDA infant feeding guidelines'] }
};

COACHING_DATA['ih1'] = {
  intro: 'It is time to wash our hands! Let\'s go to the sink together. Washing hands keeps us healthy!',
  tips: ['Sing a consistent 20-second hand-washing song every single time — habit is built through repetition', 'Narrate every step as you do it: "Now we get the soap... now we scrub..."', 'Make it joyful — never rushed or punitive'],
  prompts: ['Water on! [guide hands under water] We are getting our hands wet first!', '[Apply soap] Soap makes the bubbles that take the germs away. Scrub scrub scrub!', 'Rinse! All the bubbles wash away. Now dry! Clean hands!'],
  close: 'Clean hands! That is how we stay healthy. Every time we wash our hands, we are being so kind to our bodies.',
  questions: { beginner: ['Are we clean now?','Can you feel the water?'], intermediate: ['What does the soap feel like?','Are our hands clean now?'], advanced: ['Why do we wash our hands?','How long do we wash for?'], openEnded: ['What do you notice about the water?','How do clean hands feel different from dirty hands?'] },
  responses: { typical: 'Baby allows hands to be washed passively and shows interest in the water and bubbles.', strong: 'Baby moves hands under water actively and shows clear anticipatory excitement for the routine.', shy: 'Baby accepts the routine when it is gentle and sung to — singing reduces any resistance.', limitedLanguage: 'Baby communicates through physical cooperation, watching the water, and vocalizing during the routine.' },
  shySupport: { prompts: ['The water is warm and gentle — feel it!','I will hold your hands the whole time.'], alternatives: ['Use a basin at a comfortable level rather than an elevated sink', 'Let baby splash in the water before beginning the washing process'], encouragement: ['Your hands are so clean and healthy!','You washed your hands — that is taking care of your body!'] },
  observation: ['Does baby show increasing comfort with the hand-washing routine over time?', 'Does baby begin to anticipate steps of the routine (reaching for soap, reaching for towel)?', 'Any signs of sensory aversion to the water or soap?', 'Does baby attempt to rub their own hands together during the washing?'],
  rubric: { beginning: 'Baby resists or shows no engagement with hand-washing routine.', developing: 'Baby tolerates hand-washing when assisted; remains passive throughout.', proficient: 'Baby cooperates willingly with hand-washing routine and shows familiarity with sequence.', advanced: 'Baby reaches toward sink, moves hands under water, and shows clear anticipation of steps in sequence.' },
  teacherNotes: ['{child} reached toward the soap dispenser during hand-washing today — showing routine sequence awareness.'],
  parentReport: { example: 'We wash hands together multiple times every day as a health routine, using a fun 20-second song. At this young age, babies are building the habit memory that will make hand-washing automatic as they grow. Your child is showing increasing familiarity and comfort with this important hygiene routine.', homeExtension: 'Wash hands together before meals and after outdoor play every day. Use the same song each time. By 18-24 months, children who have this early routine often begin reaching for the sink independently — the habit takes root early!' },
  variations: { smallGroup: 'Line up babies at the sink in sequence — each baby watches the others, which accelerates learning.', wholeClass: 'Establish a consistent before-meal hand-washing line as a whole-class routine.', outdoor: 'Use a portable water bin outside for outdoor hand-washing experiences.', indoor: 'Sink at baby-accessible height is ideal; a supported position at standard sink also works.', lowResource: 'A basin with clean warm water and small amounts of gentle soap works perfectly.' },
  classroomMgmt: { transitions: 'Hand-washing IS a transition activity — it signals the move from one activity to another (especially to mealtime).', disruptions: 'Never force or rush hand-washing. A 2-minute gentle routine is far more developmentally valuable than a 10-second forced wipe.', participation: 'All babies participate — this is a daily health non-negotiable.', diverseLearners: 'For babies with tactile sensitivities, use unscented soap and lukewarm (not hot) water. Build tolerance gradually.' },
  materials: { required: ['Warm water','Gentle baby-safe unscented soap','Soft paper towels'], optional: ['Hand-washing song displayed on wall','Step stool for older infants'], printable: ['Hand-washing steps poster for babies'], digital: [] }
};

COACHING_DATA['ih2'] = {
  intro: 'We are going outside! Fresh air and sunshine — your body and brain love being outdoors!',
  tips: ['Check weather and temperature before going out — dress baby appropriately', 'Narrate constantly: "I see a bird! Feel the breeze! The leaves are moving!"', 'Allow multi-sensory engagement: feel the grass, touch a leaf, feel the sun on the face'],
  prompts: ['Feel the wind! [blow gently] The wind is touching your face. That is the air moving!', 'Look — a bird! It is flying up in the sky. Can you see it?', 'The sky is SO blue today. And the trees are GREEN. What colors do you see?'],
  close: 'Fresh air and nature — your body loved being outside today! We will come outside every day because nature is one of the best things for growing brains and growing bodies.',
  questions: { beginner: ['Do you feel the wind?','Look at the tree!'], intermediate: ['What colors do you see?','Is it warm or cool outside?'], advanced: ['Where do you think that bird is going?','What sounds do you hear outside?'], openEnded: ['What do you notice outdoors?','How does the outside air feel different from inside?'] },
  responses: { typical: 'Baby widens eyes and shows increased alertness in the outdoor environment; reaches toward interesting objects.', strong: 'Baby tracks moving objects (birds, leaves, clouds) actively and vocalizes in response to outdoor stimulation.', shy: 'Baby absorbs the outdoor environment quietly from caregiver\'s arms — sensory absorption is valid.', limitedLanguage: 'Baby communicates through orientation toward interesting objects, physical excitement (kicking, arm movement), and vocalizations.' },
  shySupport: { prompts: ['I have you — feel the nice fresh air.','Look at that! Way up there!'], alternatives: ['Stay in caregiver\'s arms or carrier rather than on a blanket for more sensitive babies', 'Find a quieter outdoor spot away from too much visual noise for easily overwhelmed babies'], encouragement: ['You are exploring the whole big world!','Fresh air is the best thing for your brain!'] },
  observation: ['Does baby show increased alertness and sensory engagement outdoors vs. indoors?', 'Does baby track moving outdoor objects (birds, leaves) with eyes?', 'Does baby reach toward or attempt to touch outdoor elements?', 'Any adverse reactions to outdoor stimuli that need monitoring?'],
  rubric: { beginning: 'Baby shows minimal sensory engagement outdoors; same alertness level as indoors.', developing: 'Baby shows brief increased attention to outdoor stimuli — tracks movement, responds to wind.', proficient: 'Baby consistently shows heightened alertness outdoors and engages actively with environmental stimuli.', advanced: 'Baby actively explores outdoor environment, tracks multiple stimuli, reaches toward objects, and vocalizes in response to nature.' },
  teacherNotes: ['{child} tracked a bird in flight across the entire visual field during outdoor time today — extraordinary visual tracking development.'],
  parentReport: { example: 'We spent time outside today for Fresh Air and Nature time. Outdoor experiences provide uniquely rich sensory stimulation — light, wind, sound, texture, and movement — that supports neurological development in ways indoor environments cannot fully replicate. Your child was wonderfully alert and engaged by everything the outdoors offered!', homeExtension: 'Take your baby outside for at least 15-20 minutes daily when weather allows. Point out and name everything you see: birds, clouds, flowers, trees, neighbors. This daily outdoor language narration is incredibly valuable for development.' },
  variations: { smallGroup: 'Small stroller walk with 2-3 babies — each baby has a different view and different things to point out.', wholeClass: 'Whole-class outdoor time on a safe blanket area in the yard.', outdoor: 'This IS the outdoor activity! Vary location: garden, sidewalk walk, nature trail.', indoor: 'On days when outdoor time is not safe, open windows and describe what you see and hear outside.', lowResource: 'No equipment needed — your arms or a blanket on the ground is enough.' },
  classroomMgmt: { transitions: 'Outdoor time has a consistent start and end signal so babies develop time awareness.', disruptions: 'If weather changes suddenly, have a plan for quick indoor transition.', participation: 'All babies should have outdoor time unless specifically restricted by medical condition.', diverseLearners: 'For babies with skin or respiratory sensitivities, follow medical guidance on appropriate outdoor exposure.' },
  materials: { required: ['Stroller or carrier','Weather-appropriate clothing'], optional: ['Blanket for ground play','Sunhat','Sunscreen if appropriate'], printable: ['Outdoor learning observation guide'], digital: [] }
};

COACHING_DATA['ich1'] = {
  intro: 'Let\'s be so gentle together. Gentle and kind — that is how we treat each other and our toys.',
  tips: ['Model gentleness with exaggerated, slow, tender movements', 'Narrate the emotional impact: "The bear is happy because we are being so gentle"', 'Use a consistent phrase like "gentle hands" as a cue throughout the day'],
  prompts: ['Pet the bear very gently — like this. [demonstrate] Soft soft soft.', 'The bear says "ouch" if we are too rough. And "thank you" when we are gentle!', 'You are being so KIND to the bear. Kindness feels good — for the bear AND for us!'],
  close: 'Gentle and kind — that is who you are. Every time we treat others gently, we are practicing kindness. And kindness is the most important thing.',
  questions: { beginner: ['Can you be gentle?','Touch it softly.'], intermediate: ['Is this gentle or rough?','How does the bear feel when we are gentle?'], advanced: ['Why should we be gentle?','Can you show me gentle touch on my hand?'], openEnded: ['What does being gentle look like?','Who do you want to be gentle with?'] },
  responses: { typical: 'Baby pats the stuffed animal; if initial touch is rough, softens with caregiver guidance.', strong: 'Baby shows gentle, careful touch independently and looks to caregiver for affirmation.', shy: 'Baby observes the gentle interaction before attempting — models caregiver behavior carefully.', limitedLanguage: 'Baby communicates through their touch — initially exploring force boundaries, gradually learning gentle pressure.' },
  shySupport: { prompts: ['Watch me — gentle like this. Can you try?','Your hand can be so gentle — just like that!'], alternatives: ['Let baby touch caregiver\'s hand first before the stuffed animal', 'Model on a baby doll while baby watches'], encouragement: ['That was SO gentle! The bear loves that!','Your hands are so kind!'] },
  observation: ['Does baby modulate force when guided toward gentle touch?', 'Does baby transfer gentle touch behavior to interactions with peers?', 'Does baby respond to "gentle hands" verbal cue over time?', 'Does baby show empathic response to the stuffed animal\'s "feelings"?'],
  rubric: { beginning: 'Baby uses forceful, unmodulated touch; does not adjust pressure when prompted.', developing: 'Baby softens touch when verbally cued with "gentle" — brief compliance.', proficient: 'Baby consistently uses gentle touch with toys and peers when reminded.', advanced: 'Baby initiates gentle touch independently and narrates it: patting gently without prompting.' },
  teacherNotes: ['{child} used gentle hands with the stuffed animal today without prompting — an early and encouraging sign of emerging kindness behavior.'],
  parentReport: { example: 'Today we practiced being Gentle and Kind, using a stuffed animal to model tender, careful touch. We talk about the animal\'s feelings and how our touch affects others. This early practice of physical kindness is the foundation of empathy and compassionate behavior that will grow with your child throughout life.', homeExtension: 'When you have a pet, younger sibling, or special stuffed animal at home, practice "gentle touch" together with your baby. Say "gentle" softly and guide their hand to model the right pressure. This consistent teaching pays off enormously.' },
  variations: { smallGroup: 'Pass a stuffed animal around the group with each baby and caregiver practicing gentle touch.', wholeClass: 'Circle time with a class teddy bear — all practice gentle touch in sequence.', outdoor: 'Model gentle touch with flowers, leaves, and grass outdoors — nature teaches gentleness beautifully.', indoor: 'Use any safe stuffed animal or doll.', lowResource: 'No materials needed — model gentle touch on caregiver\'s own arm for baby to observe and imitate.' },
  classroomMgmt: { transitions: 'Use "gentle hands" as a consistent phrase during all transitions involving touching other babies, materials, or animals.', disruptions: 'When baby is rough with others, redirect immediately and calmly with "we use gentle hands with friends."', participation: 'All babies participate — gentleness teaching begins from the first day.', diverseLearners: 'For sensory-seeking babies who are naturally forceful, provide sensory alternatives (squeezing a stress ball) to channel the need for strong touch appropriately.' },
  materials: { required: ['Stuffed animal or soft doll'], optional: ['Pet visit (with supervision)','Various animals to practice gentle touch with'], printable: ['Kindness development observation guide'], digital: ['Sesame Street kindness videos'] }
};

COACHING_DATA['ich2'] = {
  intro: 'Thank you! Let\'s practice our thank yous today. Saying thank you is one of the kindest things we can do.',
  tips: ['Say "thank you" sincerely in natural, everyday moments — not only as a scripted exercise', 'Pair the verbal thank you with a consistent gesture: a wave, nod, or open-palm gesture', 'Express genuine gratitude yourself throughout the day — babies absorb your authenticity'],
  prompts: ['[Hand baby a toy] And... thank you! Can you say thank you with your hand? [wave]', 'When someone helps us or gives us something, we say THANK YOU. That is kindness.', 'You waved thank you! That is beautiful. You are already so polite!'],
  close: 'Thank you is one of the most important things we can learn to say. Every thank you is a small gift of kindness to someone else.',
  questions: { beginner: ['Can you say thank you?','Wave thank you!'], intermediate: ['When do we say thank you?','How does it feel when someone thanks you?'], advanced: ['What are you thankful for today?','How can you show thank you without words?'], openEnded: ['Who do you want to thank today?','Why is thank you important?'] },
  responses: { typical: 'Baby watches the thank-you gesture and may attempt a hand wave or open-palm gesture.', strong: 'Baby spontaneously makes the thank-you gesture when given something without being prompted.', shy: 'Baby watches the thank-you ritual carefully but does not imitate yet — this is still learning.', limitedLanguage: 'Baby communicates through gaze, gesture approximations, and vocalizations in the spirit of the exchange.' },
  shySupport: { prompts: ['Can you just wave? Even a little wave is a thank you!','I know you are saying thank you with your eyes!'], alternatives: ['Accept any social gesture (eye contact, smile) as a thank-you approximation', 'Model the thank-you exchange between two caregivers for baby to observe'], encouragement: ['That was your thank you! I heard it!','You are so kind and grateful!'] },
  observation: ['Does baby make any gesture approximation toward thank-you when prompted?', 'Does baby show anticipatory social behavior (smiling, reaching) during giving/receiving exchanges?', 'Does baby watch attentively when caregivers model thank-you exchanges?', 'Does baby spontaneously show any gratitude-adjacent behavior during daily routines?'],
  rubric: { beginning: 'Baby shows no social response to giving/receiving exchanges.', developing: 'Baby makes eye contact or smiles during giving/receiving interactions.', proficient: 'Baby imitates the thank-you gesture when prompted and shows positive affect during the exchange.', advanced: 'Baby initiates the thank-you gesture spontaneously when given something, without prompting.' },
  teacherNotes: ['{child} waved a "thank you" without prompting when given their snack today — a wonderful early social courtesy emerging.'],
  parentReport: { example: 'Every day we practice our Thank You Ritual — modeling sincere gratitude in natural, real moments throughout the day. At this age, babies are watching everything we do. When they see us express genuine gratitude, they begin to internalize it as part of social exchange. Your child is watching carefully and building the foundation for lifelong courtesy and appreciation.', homeExtension: 'Say "thank you" sincerely and clearly every time someone gives your baby something, helps them, or does something kind. Over time (usually by 12-18 months), babies begin imitating this. The earlier and more consistently you model it, the stronger the foundation.' },
  variations: { smallGroup: 'Practice giving-and-receiving exchanges between babies with caregiver facilitation.', wholeClass: 'Morning gratitude ritual: each caregiver says one "thank you" during circle time.', outdoor: 'Thank the tree for shade, the sun for warmth, the bird for its song — environmental gratitude.', indoor: 'Embed thank-you practice in every natural giving/receiving moment throughout the day.', lowResource: 'No materials needed — only genuine, consistent modeling of gratitude in daily life.' },
  classroomMgmt: { transitions: 'Say "thank you" to children at the end of every activity as a transition signal.', disruptions: 'When babies grab from each other, use it as a teaching moment: "Say thank you to your friend!"', participation: 'All babies participate through observation of modeled gratitude.', diverseLearners: 'For babies with communication challenges, accept any communicative gesture as their version of thank you.' },
  materials: { required: ['No materials needed — caregiver\'s genuine gratitude is the resource'], optional: ['Small objects to give and receive in a thank-you exchange game'], printable: ['Gratitude and courtesy developmental guide'], digital: ['Sesame Street courtesy and manners videos'] }
};

})(); // end loadInfantLifeHealthCharacter

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 11 — COACHING DATA: TODDLERS
   ───────────────────────────────────────────────────────────────────────────── */
(function loadToddlerCoaching() {

COACHING_DATA['tl1'] = {
  intro: 'Good morning! Today we have a very special word. Are you ready? Our word today is... BUTTERFLY!',
  tips: ['Choose words that are slightly above current vocabulary but connected to real experience or upcoming themes', 'Use the word naturally throughout the ENTIRE day — not just during circle time', 'Pair the word with a picture, a gesture, and ideally a real object'],
  prompts: ['BUTTERFLY! Say it with me — but-ter-fly! That is a beautiful word!', '[Show picture] This is a butterfly. It has wings and it flies. Can you say butterfly?', 'At lunch, the teacher might say: "What did our word sound like? But...ter...fly!"'],
  close: 'You learned our Word of the Day today — BUTTERFLY! That word is now in your brain. Say it one more time with me: butterfly!',
  questions: { beginner: ['Can you say butterfly?','What does a butterfly do?'], intermediate: ['What color is our butterfly?','Where do butterflies live?'], advanced: ['How is a butterfly different from a bird?','Where do butterflies come from?'], openEnded: ['If you were a butterfly, where would you fly?','What do you think butterflies are thinking about?'] },
  responses: { typical: 'Toddler attempts the word, may produce a simplified version ("butter-fwy") — celebrate this fully.', strong: 'Child says the word clearly, uses it in a sentence later in the day without prompting.', shy: 'Child listens attentively but does not attempt the word vocally — show the picture and accept pointing as a valid response.', limitedLanguage: 'Child points to the picture, gestures, or vocalizes an approximation — all are valid vocabulary responses.' },
  shySupport: { prompts: ['Can you just point to the butterfly?','You do not have to say it — just show me you know it!'], alternatives: ['Accept pointing to the picture card as the vocabulary response', 'Whisper the word instead of saying it aloud — some children are more willing to whisper'], encouragement: ['You said it! Even a little bit counts!','I heard "butterfly" in there!'] },
  observation: ['Does child attempt to say the word (even imperfectly)?','Does child show the word picture card to others later in the day?','Does child use the word in spontaneous speech during the day?','Is child connecting the word to the real concept (not just repeating sounds)?'],
  rubric: { beginning: 'Child does not attempt word or engage with the picture.', developing: 'Child repeats an approximation of the word when directly prompted.', proficient: 'Child says the word, identifies the picture, and uses it at least once without prompting during the day.', advanced: 'Child uses the word correctly in original sentences, explaining the concept to peers or asking further questions about it.' },
  teacherNotes: ['{child} used "butterfly" in original speech during outdoor play today: "Look! It might be a butterfly!" — outstanding word of the day transfer.', '{child} pointed to the butterfly card on the wall and said the word independently during lunch — excellent daily vocabulary retention.'],
  parentReport: { example: 'Today our Word of the Day was BUTTERFLY! We learned this word through a picture, a gesture, and using it throughout the entire day. By the end of the day your child had heard this word more than 30 times in natural, meaningful contexts. This is how vocabulary is built — repetition and connection to real meaning. Ask your child tonight: "What was our special word today?"', homeExtension: 'Ask your child about their Word of the Day every evening. If they can tell you, celebrate and use the word in your dinner conversation. This home reinforcement doubles vocabulary retention.' },
  variations: { smallGroup: 'Small circle: each child says the word in sequence. Use it in a sentence for each child: "Sofia, what is our word? Can you put it in a sentence?"', wholeClass: 'Morning circle introduction with the full group — then intentionally use the word all day in every context.', outdoor: 'Hunt for the word outdoors: "Find a real butterfly!" or find something related to the word theme.', indoor: 'Post the word card at eye level in the room so children encounter it throughout the day.', lowResource: 'No materials needed — a consistent daily word practice requires only intentional language.' },
  classroomMgmt: { transitions: 'Use the word during transitions: "While we walk to the bathroom, can you say our word?"', disruptions: 'If children are distracted during word introduction, tie the word to their current interest: "A butterfly would love this flower you drew!"', participation: 'Multiple repetitions throughout the day mean even non-engaged children during circle time encounter the word in natural contexts.', diverseLearners: 'For ELL children, provide the word in their home language alongside English to build bilingual bridges.' },
  materials: { required: ['Picture card of the daily word','Word displayed in large print somewhere in the room'], optional: ['Real object related to the word','Gesture or body movement paired with the word'], printable: ['Word of the Day card template','Monthly vocabulary word calendar'], digital: ['PBS Kids vocabulary games','Sesame Street "Word of the Day" segments'] }
};

COACHING_DATA['tl2'] = {
  intro: 'We are going to practice using two words together today! Ready? Let me show you how!',
  tips: ['Model the target two-word phrase naturally, not as a drill: "big ball" said casually, not commanded', 'Expand single words immediately: child says "dog" → you say "Yes! Big dog! Brown dog running!"', 'Wait 5 seconds after a question before prompting — toddlers need processing time'],
  prompts: ['[Hold up large ball] This ball is BIG! Big ball! Can you say "big ball"?', '[Dog runs by in yard] Dog run! The dog is running! What is the dog doing?', 'You said two words! "Big ball!" Those two words together tell us SO much more than one word!'],
  close: 'Two words together are more powerful than one! You are learning to build sentences. That is real language — you are a real speaker!',
  questions: { beginner: ['What is this?','What is it doing?'], intermediate: ['How big is it?','What color is it?'], advanced: ['Can you describe this in two whole words?','What else can you tell me about it?'], openEnded: ['What do you want to say about this?','Tell me about what you see.'] },
  responses: { typical: 'Child produces two-word combinations when prompted; may need a model to imitate.', strong: 'Child produces two-word phrases spontaneously and begins stringing three words together.', shy: 'Child uses single words or gestures; is building toward two-word combinations internally.', limitedLanguage: 'Child points and vocalizes; teacher models the two-word phrase for what child seems to communicate.' },
  shySupport: { prompts: ['You can just point and I will say the words.','Whisper it to me if you want!'], alternatives: ['Accept gesture + vocalization as a two-word communication', 'Allow child to use home language if bilingual — celebrate bilingual two-word phrases'], encouragement: ['You said TWO words! That is a whole sentence starting!','I love how you talk to me!'] },
  observation: ['Is child producing one-word, two-word, or multi-word utterances at baseline?','Does child expand their utterances when teacher models the expansion?','Does child initiate two-word communication unprompted during play?','Are two-word combinations expanding to three-word phrases for advanced learners?'],
  rubric: { beginning: 'Child uses single words or only gestures to communicate.', developing: 'Child imitates two-word combinations when modeled by teacher.', proficient: 'Child independently produces two-word phrases to communicate wants, observations, and ideas.', advanced: 'Child produces three-word and longer phrases, using descriptive and action words accurately.' },
  teacherNotes: ['{child} produced "big truck" unprompted when watching a truck through the window today — independent two-word phrase in natural context.', 'During Two-Word Conversations, {child} expanded "dog" to "dog run fast" when teacher modeled the expansion — excellent language responsiveness.'],
  parentReport: { example: 'Today we practiced Two-Word Conversations, focusing on combining words to say more. Children at this age are moving from single words to short phrases, and the bridge is meaningful, responsive conversation. Your child showed wonderful language growth today, combining words to communicate more complex ideas.', homeExtension: 'When your child says a single word, respond with the expanded two-word version: they say "milk" → you say "more milk? Yes, here is your cold milk!" This expansion method is one of the most research-proven ways to accelerate language development.' },
  variations: { smallGroup: 'Go around the circle: each child makes a two-word description of the same picture card.', wholeClass: 'Two-word circle: each child describes their morning using two words. Teacher expands each.', outdoor: 'Outdoor two-word observation: "big tree, green leaf, fast bird, muddy puddle!"', indoor: 'Two-word naming of everything visible in the classroom.', lowResource: 'No materials needed — only attentive, expansive language throughout the day.' },
  classroomMgmt: { transitions: 'During transitions, narrate in two-word phrases: "Coat on! Shoes tied! Line up!"', disruptions: 'If a child is frustrated, accept their single-word communication while modeling the expanded version warmly.', participation: 'Some children participate through listening and will begin producing phrases independently later — be patient.', diverseLearners: 'For ELL children, accept home-language two-word combinations as valid language development and celebrate them.' },
  materials: { required: ['Common toys and objects for naming and describing'], optional: ['Picture cards','Two-word phrase chart on the wall'], printable: ['Two-Word Phrase Activity Cards'], digital: ['PBS Kids language games'] }
};

COACHING_DATA['tl3'] = {
  intro: 'Story time! Let\'s read this wonderful book together. I want to hear what YOU think about it!',
  tips: ['Read with genuine enthusiasm and varied voice — if you sound bored, they become bored', 'Stop 3-4 times per book for prediction questions and connection questions — not just at the end', 'Let children turn pages and hold the book — physical ownership increases engagement'],
  prompts: ['[Pause mid-story] Wait — what do YOU think will happen next? What do you think the dog will do?', '[Point to character\'s face] How does she FEEL right now? What does her face tell us?', 'Has this ever happened to YOU? Did you ever feel like this character feels?'],
  close: 'What an amazing story! We talked about it, thought about it, and connected it to our own lives. That is what powerful readers do.',
  questions: { beginner: ['What do you see here?','How does the dog feel?'], intermediate: ['What will happen next?','Why do you think she did that?'], advanced: ['What is the main message of this story?','Has this ever happened to you?'], openEnded: ['What would YOU do if you were in this story?','What do you think happens after the book ends?'] },
  responses: { typical: 'Child points to pictures and provides simple answers; builds a narrative thread when prompted.', strong: 'Child makes unprompted connections to their own life and asks their own questions about the story.', shy: 'Child points to pictures without verbal response — pointing IS comprehension engagement.', limitedLanguage: 'Child communicates through pointing, facial expressions, and gesture to show story comprehension.' },
  shySupport: { prompts: ['Can you just point to what you think will happen?','You do not have to say it — show me!'], alternatives: ['Allow child to listen from caregiver\'s lap without pressure to respond', 'Use a wordless picture book so comprehension can be shown through gesture and expression alone'], encouragement: ['You knew what would happen! You were right!','Your brain was thinking so hard during that story!'] },
  observation: ['Does child track pictures and print with their eyes across the page?','Does child respond meaningfully to comprehension questions?','Does child make text-to-self connections (relating story to personal experience)?','Does child show physical book engagement (wanting to hold/turn pages)?'],
  rubric: { beginning: 'Child shows minimal engagement; wanders attention or does not respond to questions.', developing: 'Child answers literal comprehension questions and tracks pictures.', proficient: 'Child predicts story events, identifies character feelings, and makes text-to-self connections.', advanced: 'Child analyzes story events, evaluates character choices, and makes sophisticated connections across books and experiences.' },
  teacherNotes: ['{child} predicted the dog would find the bone before the page turned — and was right! Excellent narrative prediction and inferencing.', 'During story time, {child} connected the book\'s theme of missing a friend to their own experience: "Like when my grandma is far away." Beautiful empathic connection.'],
  parentReport: { example: 'We had a wonderful Interactive Story Time today! We do not just read stories — we predict, discuss, and connect them to our own lives. This deep engagement with books builds vocabulary, comprehension, critical thinking, and most importantly, a genuine love of reading. Your child showed wonderful story engagement and made meaningful personal connections today!', homeExtension: 'When reading with your child tonight, stop at 2-3 key moments and ask: "What do you think will happen?" Then after the page turn: "Were you right?" This prediction habit makes reading interactive and builds critical thinking.' },
  variations: { smallGroup: '3-4 children with one book — each child answers a different comprehension question.', wholeClass: 'Shared reading with a big book displayed so all can see illustrations clearly.', outdoor: 'Read a book outdoors connected to nature: "Let\'s read about trees while we sit under one!"', indoor: 'Cozy reading corner with dim lights creates an inviting, focused reading environment.', lowResource: 'Any picture book works — or create a wordless story using magazine pictures.' },
  classroomMgmt: { transitions: 'Signal story time with a consistent opening ritual: "Story time hat on!" or a specific song.', disruptions: 'If a child cannot sit during group story time, offer a personal book to hold quietly nearby.', participation: 'Children who seem inattentive often absorb more than they show — keep the story engaging rather than redirecting.', diverseLearners: 'For ELL children, choose books with strong, clear illustrations that tell the story visually even without the text.' },
  materials: { required: ['Age-appropriate picture books with clear illustrations'], optional: ['Big Book format for large groups','Related props or puppets'], printable: ['Story Discussion Question cards','Comprehension observation guide'], digital: ['Storyline Online read-aloud videos','PBS Kids story resources'] }
};

COACHING_DATA['tl4'] = {
  intro: 'Let\'s sing our favorite songs today! Get your bodies ready to move because these songs are going to make us MOVE!',
  tips: ['Sing slowly enough that children can anticipate and fill in words — not so fast that they cannot keep up', 'Pause dramatically before fill-in words: "The wheels on the bus go round and ___"', 'Repeat songs until children know them well enough to lead them — repetition builds mastery'],
  prompts: ['[Sing Wheels on the Bus] The wheels on the bus go... ROUND AND ROUND! Everyone show me the motion!', '[Pause before familiar word] "If you\'re happy and you know it clap your ___..." HANDS! You knew it!', 'You filled in the word! Your brain remembered! That is memory AND language together!'],
  close: 'Beautiful singing! You sang every word with me. Songs help us remember words, learn rhythm, and feel joyful all at the same time.',
  questions: { beginner: ['What comes next?','Can you show me the motion?'], intermediate: ['Can you sing a part by yourself?','What do the wheels do?'], advanced: ['Can you make up a new verse?','Why do we do this motion for this part?'], openEnded: ['What is your favorite song? Why?','If you could make up a new verse, what would it say?'] },
  responses: { typical: 'Children attempt motions enthusiastically and fill in familiar words or syllables during pauses.', strong: 'Children sing complete verses independently and ask for specific songs by name.', shy: 'Children perform motions but sing very quietly or just mouth the words — still fully participating.', limitedLanguage: 'Children communicate through motions and approximations of words — all valid musical participation.' },
  shySupport: { prompts: ['You can just do the motions — that is singing with your body!','I love how your hands are singing even when your voice is quiet!'], alternatives: ['Let shy child stand next to teacher during songs for proximity comfort', 'Allow child to choose the next song to increase ownership and motivation'], encouragement: ['Your body knows every move to this song!','You sang right along with me!'] },
  observation: ['Are children able to fill in predictable words in familiar songs?','Do children initiate familiar songs independently during free play?','Are children transferring action vocabulary from songs to real contexts?','Do children show anticipation of upcoming motions and words?'],
  rubric: { beginning: 'Child shows minimal engagement with songs; does not attempt motions or words.', developing: 'Child performs some motions and vocalizes during songs when prompted or led.', proficient: 'Child performs all motions and fills in key words independently during familiar songs.', advanced: 'Child sings complete songs independently, makes up new verses, and teaches songs to peers.' },
  teacherNotes: ['{child} sang the entire chorus of "Wheels on the Bus" independently today without any teacher model — clear song internalization.', 'During Action Songs, {child} spontaneously began singing "If You\'re Happy" during free play — showing song transfer to independent play context.'],
  parentReport: { example: 'We sang Action Songs today — songs where we move our bodies to the words! This is much more than fun: action songs build vocabulary, memory, sequencing, and phonological awareness simultaneously. Your child joined in enthusiastically and clearly knows these songs well. Keep singing together at home!', homeExtension: 'Sing action songs during car rides and bath time: "Head, Shoulders, Knees and Toes," "If You\'re Happy," and "Wheels on the Bus." Pause before the fill-in words and let your child complete them — this builds vocabulary and memory beautifully.' },
  variations: { smallGroup: 'Small group performance: each child leads a verse of a familiar song.', wholeClass: 'Full group singing with all children performing motions — joyful and socially connecting.', outdoor: 'Sing outdoors in a movement space where children can run and jump during energetic songs.', indoor: 'Indoor singing circle with a clear space for movement.', lowResource: 'No materials needed — voice and body are the only instruments required.' },
  classroomMgmt: { transitions: 'Use specific songs as transition signals: one song for lining up, one for clean-up, one for settling.', disruptions: 'If children become too wild during energetic songs, transition to a slower, calmer song.', participation: 'Children who do not sing may still be deeply engaged — never pressure reluctant singers.', diverseLearners: 'For ELL children, songs are particularly powerful — the melody supports word learning better than spoken language alone.' },
  materials: { required: ['Space to move','Knowledge of 4-6 action songs'], optional: ['Simple rhythm instruments','Song lyric charts on the wall'], printable: ['Top 10 Action Songs for Toddlers list'], digital: ['Spotify: Toddler Action Songs playlist','YouTube: Super Simple Songs channel'] }
};

})(); // end loadToddlerCoaching

(function loadToddlerCoaching2() {

COACHING_DATA['tc1'] = {
  intro: 'Look at this shape sorter! We are going to figure out which shapes go in which holes. Ready to be a problem solver?',
  tips: ['Name each shape clearly BEFORE attempting to insert it: "This is a CIRCLE. It has no corners."', 'Give 30 seconds of independent struggle before offering a hint — productive struggle is essential', 'Celebrate the problem-solving process: "You tried three times! That is how we learn!"'],
  prompts: ['This is a CIRCLE — it is round with no corners. Find the round hole! Which hole is round?', '[Child tries wrong hole] Hmm, that did not fit. What can you try differently? Try turning it!', 'It FITS! You figured it out! Your brain solved a problem just now!'],
  close: 'You sorted all the shapes! Your brain now knows circles, squares, and triangles — and your hands know exactly where they go!',
  questions: { beginner: ['What shape is this?','Which hole does it fit?'], intermediate: ['How is a circle different from a square?','Why do you think this one does not fit there?'], advanced: ['Can you find the circle hole WITHOUT trying? Just look!','How many sides does a square have?'], openEnded: ['Where do you see circles in real life?','What would happen if all shapes were the same?'] },
  responses: { typical: 'Child uses trial and error to find the correct hole; celebrates when it fits and tries again when it does not.', strong: 'Child identifies the correct hole visually before attempting insertion; names shapes accurately.', shy: 'Child attempts shapes quietly without verbalizing; may look to teacher for confirmation before trying.', limitedLanguage: 'Child communicates through action — persistent trying, pointing to correct holes, and celebrating success physically.' },
  shySupport: { prompts: ['Try it! It is okay if it does not fit the first time — that is how we learn!','Just try — there is no wrong answer, only discovering!'], alternatives: ['Work alongside child as a "problem-solving partner" rather than observer', 'Use just 2 shapes (circle and square) before adding more complexity'], encouragement: ['You kept trying! That is exactly what problem solvers do!','Your brain figured it out!'] },
  observation: ['Does child use systematic trial and error or random guessing?','Does child self-correct when a shape does not fit?','Does child name shapes spontaneously or only when asked?','Does child show frustration tolerance during multi-attempt problem solving?'],
  rubric: { beginning: 'Child cannot sort any shapes without physical hand-over-hand assistance.', developing: 'Child sorts familiar shapes (circle, square) with occasional prompting.', proficient: 'Child independently identifies and sorts circle, square, triangle into correct holes.', advanced: 'Child sorts all shapes by both name and hole, corrects errors independently, and teaches peers the shape names.' },
  teacherNotes: ['{child} identified the triangle hole visually before attempting insertion today — showing shape recognition beyond trial-and-error.', 'During Shape Sorting, {child} named all four shapes correctly without prompting — vocabulary and conceptual understanding are solidly developed.'],
  parentReport: { example: 'We did Shape Sorting today, and it was much more than just a toy activity! Sorting shapes builds spatial reasoning, problem-solving persistence, mathematical vocabulary, and fine motor control. Your child worked through the challenge with wonderful determination today!', homeExtension: 'At home, shape sorters are excellent toys for this skill. Alternatively, use cookie cutters to trace shapes, or point out shapes in everyday environments: "The clock is a circle! The book is a rectangle!"' },
  variations: { smallGroup: 'Each child gets a shape sorter. Race (friendly) to complete — social motivation.', wholeClass: 'Giant shape sorting with large foam shapes and matching areas on the floor.', outdoor: 'Shape hunt outside: "Find something that is a circle outdoors! Find a rectangle shape!"', indoor: 'Shape sorting center during learning centers time.', lowResource: 'Cut shapes from cardboard and create matching outlines drawn on paper as a free homemade version.' },
  classroomMgmt: { transitions: 'Shape sorter activity works well as a calm transition between more active experiences.', disruptions: 'If children use the sorter as a percussion instrument, redirect: "These shapes go IN — let\'s find their homes!"', participation: 'Allow children to choose which shapes they want to sort first — agency increases engagement.', diverseLearners: 'For children with fine motor challenges, use shape sorters with larger openings and shapes.' },
  materials: { required: ['Shape sorter toy'], optional: ['Large foam shapes for floor sorting','Shape vocabulary cards'], printable: ['Shape names and pictures chart','Shape hunt checklist'], digital: ['PBS Peg + Cat math games'] }
};

COACHING_DATA['tc2'] = {
  intro: 'Look at this beautiful puzzle! Let\'s take it apart carefully and then put it back together.',
  tips: ['Show the completed puzzle first, THEN take it apart — give children the target to work toward', 'Take apart one piece at a time, letting child replace each piece before removing the next', 'Use spatial language consistently: "Turn it. Flip it. Try the other way."'],
  prompts: ['[Completed puzzle] See the whole picture? Now we take it apart — [remove piece] now you put THIS piece back!', 'Look at the shape of the hole — what shape is your piece? Does it match?', '[Child succeeds] Yes! You did it! You looked at the hole AND the piece — that is problem solving!'],
  close: 'You finished the puzzle! Your brain used shapes, colors, and spatial thinking all at the same time. That is an amazing workout for your mind.',
  questions: { beginner: ['Where does this piece go?','What do you see on this piece?'], intermediate: ['What shape is the hole? What shape is the piece?','Do they look the same?'], advanced: ['How did you know that piece went there?','What would happen if you tried to put it in upside down?'], openEnded: ['How do you decide where a piece goes?','What is the picture building into?'] },
  responses: { typical: 'Child uses visual matching and trial-and-error with growing accuracy across the session.', strong: 'Child completes puzzle with minimal attempts, using visual analysis rather than only trial-and-error.', shy: 'Child attempts puzzle carefully and quietly; prefers not to be watched too closely.', limitedLanguage: 'Child communicates through action — sustained attempts, handing pieces to teacher, and pointing to where piece goes.' },
  shySupport: { prompts: ['Just try any piece you want — there is no wrong start!','I am here if you get stuck. You have lots of time.'], alternatives: ['Begin with a 2-piece puzzle to build confidence before progressing to 4-piece', 'Turn puzzle pieces face-down to remove color clue — rebuild confidence with shape-only thinking'], encouragement: ['You figured it out with just your eyes!','Every piece you place is a win!'] },
  observation: ['Does child scan the puzzle space before placing (planning before acting)?','Does child use spatial rotation strategies (turning pieces)?','Does child show growing accuracy across multiple attempts within one session?','Does child transfer puzzle skills to new puzzles independently?'],
  rubric: { beginning: 'Child places pieces randomly; cannot complete even 2-piece puzzle independently.', developing: 'Child completes 2-piece puzzle independently; needs significant help with 4-piece puzzle.', proficient: 'Child completes 4-piece puzzle independently using visual matching and trial-and-error.', advanced: 'Child completes 6+ piece puzzle with planning strategy — scans image, identifies key pieces, and places accurately.' },
  teacherNotes: ['{child} rotated a puzzle piece three times to find the correct orientation before placing it — excellent spatial reasoning strategy.', 'During Simple Puzzles, {child} completed a 4-piece puzzle in under 2 minutes independently — fastest completion time yet, showing strong spatial development.'],
  parentReport: { example: 'We worked on puzzles today, and this activity is a powerful brain-builder! Puzzles develop spatial reasoning (which predicts math ability), problem-solving, visual discrimination, and persistence. Your child showed wonderful focus and problem-solving strategies today.', homeExtension: 'Puzzles are one of the best investments you can make for your toddler\'s cognitive development. Start with 2-piece, then 4-piece, then 6-piece as success grows. Work side by side rather than doing it for them.' },
  variations: { smallGroup: 'Pair children on a single puzzle — they must communicate about where pieces go.', wholeClass: 'Giant floor puzzle that the whole class builds together over multiple days.', outdoor: 'Puzzle race on an outdoor picnic table — fresh air and challenge combined.', indoor: 'Puzzle center as part of a learning centers rotation.', lowResource: 'Cut a magazine picture into 4 pieces — instant puzzle for free.' },
  classroomMgmt: { transitions: 'Puzzles are excellent self-directed transition activities while other children are arriving or departing.', disruptions: 'If a child sweeps the puzzle onto the floor in frustration, calmly collect pieces and offer a simpler puzzle.', participation: 'Some children need many exposure sessions before engaging. Never force puzzle completion.', diverseLearners: 'For children with fine motor challenges, use knob puzzles where each piece has a handle for easier gripping.' },
  materials: { required: ['2-4 piece simple wooden or foam puzzles'], optional: ['Knob puzzles for developing fine motor skills','Puzzle frame for stability'], printable: ['Puzzle Skills development checklist'], digital: [] }
};

COACHING_DATA['tc3'] = {
  intro: 'Memory game time! First let\'s look at ALL the cards with pictures. Then we are going to find the matches!',
  tips: ['Start with all cards face UP for a visual matching warm-up before introducing the memory challenge', 'For the memory game version, use only 3-4 pairs maximum for toddlers (6-8 cards total)', 'Name what you see on each card as it is flipped — language and memory together'],
  prompts: ['[Face-up version] Find the other dog! Both dogs go together — they match!', '[Face-down version] I am going to flip this one — a CAT! Can you remember where the other cat is?', '[Match found] You remembered! You held that picture in your brain the whole time — that is MEMORY!'],
  close: 'Amazing memory work today! Your brain held those pictures inside even when you could not see them. That is memory — and it gets stronger every time you practice.',
  questions: { beginner: ['Do they match?','Are they the same?'], intermediate: ['Can you remember where you saw the other one?','Which ones go together?'], advanced: ['If I flip this one, what will you remember to look for?','How do you remember where things are?'], openEnded: ['How does it feel when you remember right?','What tricks help you remember?'] },
  responses: { typical: 'Child finds visible matches easily; attempts memory version with occasional success.', strong: 'Child accurately remembers previously flipped card locations across multiple turns.', shy: 'Child plays quietly and carefully; prefers not to make mistakes publicly.', limitedLanguage: 'Child communicates through pointing and gesturing toward matching cards; celebrates success physically.' },
  shySupport: { prompts: ['Take your turn — even if you do not find the match, that is okay!','Remember where you saw it — trust your brain!'], alternatives: ['Play the visible-cards version only — still builds visual discrimination without memory pressure', 'Allow child to look at face-down cards longer before turning them over'], encouragement: ['You remembered! Your brain held that picture perfectly!','Great try — now you know where THAT one is for next time!'] },
  observation: ['Does child show strategic memory behavior (returning to previously seen cards)?','Does child name pictures as they are flipped?','Does child show frustration tolerance during non-matching turns?','How many card pairs can child track in working memory simultaneously?'],
  rubric: { beginning: 'Child cannot consistently find visible matches; shows no memory for face-down cards.', developing: 'Child finds all visible matches; occasionally finds memory matches within 2 turns of seeing a card.', proficient: 'Child consistently uses memory strategy to find matches; tracks 2-3 pair locations.', advanced: 'Child tracks 4+ card locations accurately and develops verbal or gestural memory strategies.' },
  teacherNotes: ['{child} correctly remembered the location of a card from 4 turns earlier during Matching Pairs today — impressive working memory capacity.', 'During the visible matching version, {child} categorized cards by type without prompting — going beyond matching to conceptual grouping.'],
  parentReport: { example: 'We played Matching Memory today — beginning with visible cards and building toward a face-down memory challenge. Memory games build working memory, visual discrimination, concentration, and strategy. These skills underpin learning in reading, math, and all academic domains. Your child showed wonderful memory ability today!', homeExtension: 'A simple homemade memory game: take 6 pairs of small pictures (cut from magazines), glue onto cardboard squares, and you have a toddler memory game! Play together face-up first, then face-down for the challenge.' },
  variations: { smallGroup: 'Two children take turns — waiting for the other\'s turn builds patience alongside memory.', wholeClass: 'Giant floor version with large picture cards — whole-class memory challenge.', outdoor: 'Natural object matching on a blanket: find two identical leaves, two similar rocks.', indoor: 'Memory game center during learning centers rotation.', lowResource: 'Match pairs of identical stickers placed on index cards.' },
  classroomMgmt: { transitions: 'Memory game is excellent for quiet focus time between more active learning blocks.', disruptions: 'If a child peeks at face-down cards, redirect gently: "We wait for our turn to flip — can you remember in your brain?"', participation: 'Start all children with the face-up version — ensure success before adding the memory challenge.', diverseLearners: 'For children with attention challenges, reduce the number of pairs to 2-3 and keep the game very short.' },
  materials: { required: ['Simple matching cards: animals, colors, or shapes'], optional: ['Commercial memory game','Homemade photo pairs of classroom friends'], printable: ['Memory card sets: animals, colors, shapes','Visual memory observation guide'], digital: ['PBS Kids memory games'] }
};

COACHING_DATA['tc4'] = {
  intro: 'Today we are going to find the BIG ones and the LITTLE ones! Are you ready to sort?',
  tips: ['Exaggerate size language with your hands: hold arms wide for BIG, pinch fingers together for little', 'Use real objects alongside picture comparisons — physical size comparison is more concrete', 'Challenge children with questions before telling: "Which do YOU think is bigger?"'],
  prompts: ['[Hold up two balls] This ball is BIG! This one is little. Can you feel the difference?', '[Sorting activity] Put the BIG things here — and the little things there. Ready to sort?', 'Look at this — you sorted them! All the big things are together and all the little things are together!'],
  close: 'Big and little — you know those now! You are thinking like a mathematician. Comparing things is one of the most important math skills there is.',
  questions: { beginner: ['Which is bigger?','Find the little one!'], intermediate: ['Are these the same size?','Put them in order from big to little!'], advanced: ['How many little ones make one big one?','Which is bigger — a cat or a dog?'], openEnded: ['What do you notice about the sizes?','When is it important to know if something is big or little?'] },
  responses: { typical: 'Child correctly identifies big/little for clear size differences; may struggle with subtle size differences.', strong: 'Child sorts accurately, orders by size, and uses size language spontaneously in play.', shy: 'Child sorts correctly but quietly; may need confirmation before placing objects in bins.', limitedLanguage: 'Child communicates through sorting action; placing big objects in big bin and little objects in little bin.' },
  shySupport: { prompts: ['Which feels bigger in your hands? Trust what you feel!','Just try — you can always move it if you change your mind!'], alternatives: ['Allow child to sort individually at a quiet table away from group observation', 'Use very dramatic size differences (tiny toy vs. large block) to make decisions easier initially'], encouragement: ['You sorted every single one correctly!','Your eyes measured those sizes perfectly!'] },
  observation: ['Does child accurately identify big/little for objects with clear size differences?','Does child begin to seriate (order by size from smallest to biggest)?','Does child use size language spontaneously in other contexts (dramatic play, snack)?','Any confusion between big/little and other attributes (tall/short, heavy/light)?'],
  rubric: { beginning: 'Child cannot consistently sort objects by size even with guidance.', developing: 'Child correctly sorts objects with very clear size differences into big/little categories.', proficient: 'Child accurately sorts all objects, uses size language spontaneously, and orders by size.', advanced: 'Child serializes multiple objects by size, compares sizes across different object types, and uses mathematical size vocabulary (larger, smaller, biggest, smallest).' },
  teacherNotes: ['{child} ordered 5 nesting cups from biggest to smallest independently today — impressive size seriation for this age.', 'During Big and Little Sorting, {child} used "bigger" and "smaller" spontaneously — moving beyond big/little to comparative vocabulary.'],
  parentReport: { example: 'Today we sorted objects by size — BIG ones and little ones! This mathematical activity builds comparison skills, mathematical vocabulary, and the early understanding of measurement. Your child showed excellent size awareness today and sorted confidently.', homeExtension: 'When putting away groceries, compare sizes together: "Which orange is bigger? Which apple is smaller?" This natural size comparison builds mathematical vocabulary in real-world context.' },
  variations: { smallGroup: 'Each child gets a set of mixed sizes. Compare across children: "Who has the biggest one?"', wholeClass: 'Stand up and compare heights: "Who is tallest? Who is shorter?" — size comparison with real bodies.', outdoor: 'Nature size sort: find the biggest leaf, the littlest rock, the tallest plant.', indoor: 'Size sorting center with manipulatives during learning centers.', lowResource: 'Use shoes of various sizes from the dress-up box — dramatic size differences, built-in interest.' },
  classroomMgmt: { transitions: 'Use size language during transitions: "Walk in a little line please" / "Make a big circle!"', disruptions: 'If children throw objects, redirect: "We are comparing sizes — show me the big one!"', participation: 'Have enough objects for each child to have their own sorting set — reduces conflict.', diverseLearners: 'For children with visual processing considerations, use very high-contrast size differences and a tactile (hands-on) approach.' },
  materials: { required: ['Big and small versions of same objects (balls, blocks, stuffed animals)'], optional: ['Nesting cups or stacking rings','Size sorting tray'], printable: ['Big/Little activity worksheet','Size vocabulary cards'], digital: ['Peg+Cat size and measurement games'] }
};

})(); // end loadToddlerCoaching2

(function loadToddlerCoaching3() {

COACHING_DATA['ts1'] = {
  intro: 'Good morning! How is everyone feeling today? Let\'s check in with our feelings!',
  tips: ['Model vulnerability by sharing your own feelings first: "I feel happy today because..."', 'Accept ALL feelings without trying to change them — "I hear that you feel sad. Sad is okay."', 'Return to the feelings chart throughout the day when real emotions arise'],
  prompts: ['[Show feelings chart] Look at these faces — how are each of them feeling?', '[Child points to an emotion] You feel happy! What makes you feel happy today?', 'All feelings are okay — happy, sad, scared, mad. They are ALL real and ALL important.'],
  close: 'Every one of you told me how you feel today, and every single feeling was just right. Our feelings help us understand ourselves and take care of each other.',
  questions: { beginner: ['How do you feel?','What does happy look like?'], intermediate: ['Why do you feel that way?','What helps when you feel sad?'], advanced: ['Can you feel two feelings at once?','How do you know what someone else is feeling?'], openEnded: ['What do you do when you feel mad?','What makes your feelings change?'] },
  responses: { typical: 'Children point to an emotion on the chart and may offer a brief explanation.', strong: 'Children name their emotion, explain why, and connect it to a physical sensation or event.', shy: 'Children point to the emotion card without verbal explanation — valid emotional check-in.', limitedLanguage: 'Children point to or touch the emotion card that represents their feeling; may show it on their own face.' },
  shySupport: { prompts: ['You can just point to how you feel — no words needed!','I will share mine first and then it is your turn.'], alternatives: ['Offer a private feelings check-in with just the teacher if group check-in is too exposing', 'Allow children to show feelings using their own face expression rather than the chart'], encouragement: ['Thank you for telling me how you feel!','I am so glad you shared that with me!'] },
  observation: ['Can children identify and name at least 3-4 emotions?','Are children connecting emotions to causes ("I am sad because...")?','Are children recognizing emotions in others or only in themselves?','Do children return to the feelings chart on their own during the day?'],
  rubric: { beginning: 'Child cannot identify emotions from pictures; shows undifferentiated emotional responses.', developing: 'Child identifies happy and sad reliably; beginning to name other basic emotions.', proficient: 'Child names 4+ emotions accurately, identifies them in pictures and in peers, and connects emotions to causes.', advanced: 'Child identifies complex emotions (excited, frustrated, disappointed), connects them to body sensations, and shows empathy for peers\' feelings.' },
  teacherNotes: ['{child} identified "frustrated" from the feelings chart today and explained "because the puzzle was hard" — sophisticated emotional literacy for this age.', 'During Feelings Check-In, {child} noticed a peer was showing a sad expression and said "Are you sad?" — beautiful early empathic behavior.'],
  parentReport: { example: 'We started our day with a Feelings Check-In today! This daily ritual teaches children to identify and name their emotions — a skill called "emotional literacy" that research shows is one of the strongest predictors of academic success and healthy relationships. Your child participated meaningfully and showed wonderful emotional awareness!', homeExtension: 'Create a family feelings check-in at dinner: "What feeling did you have today? What made you feel that way?" Modeling your own emotional vocabulary is the most powerful teacher.' },
  variations: { smallGroup: 'Intimate feelings circle — each child shares and the group responds with empathy.', wholeClass: 'Morning circle feelings check-in as a daily ritual to begin every school day.', outdoor: 'Feelings check-in outdoors: "The sun is out — does that change how you feel?"', indoor: 'Feelings chart prominently displayed where children can access it throughout the day.', lowResource: 'Draw simple emoji-style faces on paper — happy, sad, mad, scared — as an instant feelings chart.' },
  classroomMgmt: { transitions: 'Do a feelings check-in at key transition points: arrival, after nap, before departure.', disruptions: 'When a child is dysregulated, bring the feelings chart to them: "Let\'s find the right word for how you feel right now."', participation: 'Never force a child to share — offer the choice and accept pointing as full participation.', diverseLearners: 'For ELL children, use photographs of real faces alongside drawn emotions for cross-language emotional recognition.' },
  materials: { required: ['Feelings chart with visual emotion faces'], optional: ['Feelings card set','Mirror for making emotion faces','Feelings dice'], printable: ['Feelings chart (print and laminate)','Emotion vocabulary cards'], digital: ['Sesame Street Feelings videos','Daniel Tiger\'s Neighborhood emotions resources'] }
};

COACHING_DATA['ts2'] = {
  intro: 'Today we are going to practice taking turns! Turns are how we make sure everyone gets a chance.',
  tips: ['Use a visual timer — seeing time pass is far more concrete for toddlers than being told to wait', 'Coach the specific language of turns: "First Sofia, THEN Maya" — the THEN is crucial for hope', 'Stay nearby and narrate the waiting: "You are waiting so patiently! Two more seconds..."'],
  prompts: ['[Set timer] Sofia has the truck for 2 minutes. When the timer beeps, it is Maya\'s turn!', '[Timer beeps] Time! Maya\'s turn now! Sofia, you are waiting SO patiently — that is amazing!', 'Sharing is how we show our friends that we care about them.'],
  close: 'Everyone got a turn today! Waiting is hard — but you ALL did it. That is one of the most important skills you will ever learn.',
  questions: { beginner: ['Whose turn is it?','How does it feel to wait?'], intermediate: ['What can you do while you wait?','How did it feel when it was finally your turn?'], advanced: ['Why is taking turns important?','How could we make waiting easier?'], openEnded: ['How did it feel to share?','What happens in a group when no one takes turns?'] },
  responses: { typical: 'Children protest briefly when waiting but comply when teacher coaches; smile with satisfaction when their turn arrives.', strong: 'Children wait willingly and remind peers it is their turn using the language teacher modeled.', shy: 'Children wait quietly without protest but seem uncertain — reassure their turn IS coming.', limitedLanguage: 'Children communicate desire through reaching, pointing, and body language toward the desired object.' },
  shySupport: { prompts: ['Your turn is coming — I promise! The timer is almost done.','Can you count to 5 with me while you wait? Then it is your turn!'], alternatives: ['Offer a similar but different toy to occupy the waiting child', 'Give the shy child the first turn to build confidence and reduce anxiety'], encouragement: ['You waited so patiently! Now it is your turn!','Look — you shared! That was so kind!'] },
  observation: ['How long can each child wait before becoming distressed?','Does child use language to negotiate turns ("My turn now!") or only physical means?','Does child understand the concept of "THEN" — your turn is coming?','Does child show satisfaction/pride when they successfully wait and share?'],
  rubric: { beginning: 'Child cannot wait for turns; grabs objects from peers; becomes highly distressed during wait.', developing: 'Child waits briefly with significant teacher support; accepts turn-over when timer signals.', proficient: 'Child waits appropriately for turns with visual timer support and coaches the language "first/then" with peers.', advanced: 'Child independently manages turn-taking, uses "first/then" language spontaneously, and shows empathy for waiting peers.' },
  teacherNotes: ['{child} waited a full 3 minutes for the truck using the visual timer without teacher prompting — significant patience development.', 'During Turn-Taking Timer, {child} told a peer "Your turn is coming soon!" — using teacher modeled language independently.'],
  parentReport: { example: 'We practiced Turn-Taking with a visual timer today — and this is one of the most important social skills we teach! Learning to wait, share, and trust that "my turn will come" develops patience, empathy, and the kind of impulse control that predicts academic success. Your child showed wonderful growth in this area today!', homeExtension: 'Use a visual timer at home for turn-taking with siblings or during shared activities. The key phrase is "First [sibling], THEN you" — the THEN gives hope and makes waiting more bearable.' },
  variations: { smallGroup: '3-child turn rotation with visual timer — each child gets 3 turns with the coveted toy.', wholeClass: 'Whole-class turn system for special jobs, tools, or roles during structured activities.', outdoor: 'Turn-taking on the slide or swing — real-life high-stakes turn practice.', indoor: 'Turn-taking with any popular toy or station during free play.', lowResource: 'Use any timer (phone, sand timer) and any single popular toy. No special materials needed.' },
  classroomMgmt: { transitions: 'Turn-taking BECOMES the transition: "When the timer beeps, it is also time to switch centers!"', disruptions: 'When a child grabs, calmly return the object and restart the timer: "We use our words and the timer."', participation: 'All children participate in daily life turn-taking — embed in every group activity.', diverseLearners: 'For children with impulsivity challenges, shorten wait times initially and gradually extend as success grows.' },
  materials: { required: ['Popular toy or object','Visual timer (sand timer or digital)'], optional: ['Waiting mat or spot to stand on during wait','Special waiting activity bag'], printable: ['Turn-Taking social story','First/Then visual board'], digital: ['Daniel Tiger turn-taking episodes','Visual timer apps'] }
};

COACHING_DATA['ts3'] = {
  intro: 'We are going to catch something invisible today — KINDNESS! When you see kindness, we put it in our jar!',
  tips: ['Catch kindness in the moment — the immediate recognition is far more powerful than end-of-day review', 'Be specific: "Maya helped pick up Noah\'s blocks — that is kindness!"', 'Notice the full range of kind acts: helping, sharing, comforting, including, encouraging'],
  prompts: ['[Child helps a peer] Wait — did everyone see what just happened? Sofia helped Noah! That is KINDNESS!', '[Add to jar] Let\'s add Sofia\'s kindness to our jar. Every act of kindness makes our class stronger.', 'Kindness feels good for the person who GIVES it AND the person who receives it. Did you feel it, Sofia?'],
  close: 'Look at our Kindness Jar — it is filling up! Our classroom is becoming kinder every single day because of each one of you.',
  questions: { beginner: ['Was that kind?','How did your friend feel when you helped?'], intermediate: ['What kinds of things are kind?','How does being kind feel?'], advanced: ['Why is kindness important?','Can you think of someone who might need kindness today?'], openEnded: ['What is the kindest thing someone has ever done for you?','How can kindness change how a day feels?'] },
  responses: { typical: 'Children become alert to recognizing kindness and begin pointing it out to the teacher.', strong: 'Children spontaneously perform kind acts and announce them: "I was kind — I helped put away the toys!"', shy: 'Children perform quiet, unannounced kind acts; teacher catches and celebrates these.', limitedLanguage: 'Children communicate kindness through action — bringing a toy to a crying peer, offering a hug.' },
  shySupport: { prompts: ['I saw what you did — that was so kind!','You do not have to say it out loud — I am putting your kindness in the jar!'], alternatives: ['Privately write the shy child\'s kind act on a slip and add it to the jar with a knowing smile', 'Let child draw their kind act rather than verbally report it'], encouragement: ['You are one of the kindest people in this classroom!','Your kindness makes the whole class better!'] },
  observation: ['Are children beginning to self-identify and report their own kind acts?','Are children performing kind acts without teacher prompting?','Do children respond emotionally to receiving kindness from peers?','Is the frequency of kind acts in the classroom increasing over time?'],
  rubric: { beginning: 'Child does not notice or name kindness acts in self or others.', developing: 'Child identifies kind acts when teacher points them out and names them.', proficient: 'Child notices kind acts independently, reports them to the teacher, and performs deliberate kind acts.', advanced: 'Child actively generates ideas for kind acts, advocates for kind treatment of peers, and models kindness for younger children.' },
  teacherNotes: ['{child} brought a tissue to a crying peer without any adult prompting today — an unprompted act of compassion and kindness.', 'During Kindness Catcher, {child} identified three different acts of kindness during a 20-minute play session — exceptional prosocial awareness.'],
  parentReport: { example: 'We are building a Kindness Jar in our classroom — every act of kindness gets recognized and celebrated! This activity teaches children to notice, value, and perform kindness as a habitual practice. Research shows that children who develop prosocial habits early maintain them into adulthood. Your child showed wonderful kindness today!', homeExtension: 'Start a family Kindness Jar at home. Every evening at dinner, each family member names one kind thing they did or saw. After a week, read all the slips together — you will be amazed by what your child notices!' },
  variations: { smallGroup: 'Small group discussion: "What kind things can we do for each other today?"', wholeClass: 'Whole-class kindness challenge: fill the jar to the top in one week.', outdoor: 'Outdoor kindness: help a friend on the climbing structure, pick up litter together.', indoor: 'Kindness Jar visible in the classroom as a constant visual reminder.', lowResource: 'Any jar and paper slips — or draw kind acts on sticky notes on the classroom wall.' },
  classroomMgmt: { transitions: 'Begin each day with "What kind act will you do today?" End each day reviewing the jar.', disruptions: 'When unkind behavior occurs, pivot to the kindness framework: "That was not kind. What could you do instead?"', participation: 'All children are capable of kind acts — catch every single one regardless of size.', diverseLearners: 'For children with social challenges, help them identify their own kind behaviors that they may not recognize as kindness.' },
  materials: { required: ['Kindness jar (any clear container)','Small paper slips and crayons or markers'], optional: ['Special "Kindness Keeper" stickers','Kindness chart on the wall'], printable: ['Kindness vocabulary cards','Kindness challenge ideas list'], digital: ['Sesame Street kindness episodes'] }
};

COACHING_DATA['ts4'] = {
  intro: 'Everyone gets their own special space today! This hoop/mat is YOUR space. Let\'s explore what personal space means!',
  tips: ['Begin with clear visual boundaries (hula hoop or carpet square) before the abstract concept', 'Frame it positively: personal space protects YOU and respects others — it is a gift, not a punishment', 'Practice the ASK first: "May I come into your space?" before entering — model this consistently'],
  prompts: ['This is YOUR space! No one can come in without asking first. How does that feel?', '[Role play] "May I sit in your space?" — now you can say YES or NO. Your choice! Your space!', 'When we respect each other\'s space, everyone feels safe. Safety is kindness.'],
  close: 'You all have a personal space — and you are learning to respect each other\'s space. That is a really grown-up and important thing to understand.',
  questions: { beginner: ['Is this your space or mine?','How do we ask to join someone?'], intermediate: ['How does it feel when someone respects your space?','How close is too close?'], advanced: ['Why do people need personal space?','When might you want to share your space?'], openEnded: ['How do you know when someone needs more space?','What would school look like if no one had personal space?'] },
  responses: { typical: 'Children enjoy having their own defined space; may be territorial initially about others entering.', strong: 'Children independently use "May I come in?" language and wait for a yes before entering another\'s space.', shy: 'Children are often relieved to have defined personal space — it provides a social boundary they needed.', limitedLanguage: 'Children communicate through body language — moving away when space is violated, nodding when asked to join.' },
  shySupport: { prompts: ['Your space is right here — I will make sure no one comes in without asking.','You can say no if you do not want someone in your space — that is YOUR right.'], alternatives: ['Give shy children their hoop before explaining the activity — let them settle into the security first', 'Pair shy children with a trusted friend for the space-sharing practice'], encouragement: ['You asked permission! That was so respectful!','You said yes and let your friend in — that was kind!'] },
  observation: ['Are children beginning to use "May I...?" language spontaneously?','Do children respect the space of others when asked?','Are children comfortable asserting their own space needs?','Any children who struggle with spatial boundaries (too close or too far)?'],
  rubric: { beginning: 'Child does not show awareness of self/other spatial boundaries; invades or withdraws to extremes.', developing: 'Child understands own hoop as personal space; needs reminders about others\' space.', proficient: 'Child uses "May I?" language, respects peer spaces, and comfortably asserts their own space needs.', advanced: 'Child independently teaches peers the personal space concept and models asking permission as a consistent social habit.' },
  teacherNotes: ['{child} used "May I come sit with you?" for the first time today without prompting — a significant social language milestone.', 'During Space Awareness, {child} told a peer "Please ask first — this is my space" calmly and appropriately — excellent self-advocacy.'],
  parentReport: { example: 'We practiced Personal Space Awareness today, using hula hoops to give children a concrete visual of their own space. Understanding personal space is essential for healthy social relationships, body autonomy, and emotional safety. Your child engaged wonderfully and began using the language of consent spontaneously!', homeExtension: 'Practice the "May I?" question at home: knock on a sibling\'s door, ask before giving a hug, ask before sitting next to someone. These small consent practices build enormous respect for self and others.' },
  variations: { smallGroup: 'Small group space navigation: "Walk around each other without entering anyone\'s hoop!"', wholeClass: 'Whole class hoop activity in the gym or outdoors — everyone has their own hoop island.', outdoor: 'Run and freeze — when frozen, make a personal space circle with your arms.', indoor: 'Carpet squares define personal space during circle time and quiet work.', lowResource: 'Chalk circles drawn on the floor or circles of tape work as free personal space markers.' },
  classroomMgmt: { transitions: 'Use personal space awareness during line-ups: "Everyone is in their own bubble — no bubbles touching!"', disruptions: 'When personal space is violated, use it as an immediate, calm teaching moment: "Let\'s practice — did you ask first?"', participation: 'All children benefit from and need personal space education — include every child every time.', diverseLearners: 'For children with spatial sensory differences (who need more or less space than peers), honor their needs while teaching the concept.' },
  materials: { required: ['Hula hoops or carpet squares (one per child)'], optional: ['Tape to mark permanent spaces on the floor','Personal space poem or song'], printable: ['Personal Space social story','Body boundaries visual guide'], digital: ['Daniel Tiger personal space episode'] }
};

})(); // end loadToddlerCoaching3

(function loadToddlerCoaching4() {

COACHING_DATA['tp1'] = {
  intro: 'Obstacle course time! We are going to crawl, jump, and balance today! Let me show you the course first.',
  tips: ['Walk through the entire course WITH children before they do it independently','Narrate the movement: "We crawl THROUGH the tunnel, then JUMP over the pillow!"','Adjust difficulty by adding or removing elements based on individual children\'s skill level'],
  prompts: ['Crawl through the tunnel! Get on your hands and knees and GO!','Now JUMP over the pillow! Two feet together — jump!','Walk on the balance beam — arms out to help you balance! You are doing it!'],
  close: 'You did the WHOLE obstacle course! Crawling, jumping, balancing — your body can do amazing things. The more we practice, the stronger we get.',
  questions: { beginner: ['Can you crawl through?','Jump over the pillow!'], intermediate: ['How do you keep your balance on the beam?','Which part was hardest for you?'], advanced: ['Can you do it backwards?','How could we make the course more challenging?'], openEnded: ['How does your body feel after the course?','Which movement is your favorite and why?'] },
  responses: { typical: 'Children complete course with varying amounts of teacher support at challenging sections.', strong: 'Children complete course independently and ask to repeat with modifications.', shy: 'Children watch the first run-through carefully before attempting; may need encouragement at each station.', limitedLanguage: 'Children communicate through physical action — attempting each element, gesturing for help at difficult spots.' },
  shySupport: { prompts: ['Watch first — then when you are ready, you can try!','I will be right here at every part of the course.'], alternatives: ['Complete the course alongside the child the first time','Reduce the number of elements for first attempt'], encouragement: ['You did it! Look what your body can do!','Every time you practice, your body gets stronger and braver!'] },
  observation: ['Which elements of the course present the greatest challenge for each child?','Is child developing balance (walking the beam) over multiple sessions?','Are gross motor skills (jumping, crawling) age-appropriate?','Does child show growing confidence with repeated practice?'],
  rubric: { beginning: 'Child cannot complete most course elements independently; requires hand-over-hand support.', developing: 'Child completes most elements with verbal cuing and occasional physical support.', proficient: 'Child independently completes the full course and attempts all elements with good form.', advanced: 'Child completes course with speed and coordination, supports peers, and suggests new course challenges.' },
  teacherNotes: ['{child} completed the full obstacle course independently for the first time today — including the balance beam without any support!', 'During the obstacle course, {child} helped a younger child through the tunnel by modeling the correct technique.'],
  parentReport: { example: 'We ran an Obstacle Course today! This builds gross motor coordination, balance, strength, body awareness, and persistence. Obstacle courses also build confidence — children see themselves accomplishing physical challenges they thought were hard. Your child showed wonderful physical development today!', homeExtension: 'Create a simple obstacle course at home: crawl under a table, jump over a pillow, balance along a strip of tape. Change it each week to keep the challenge fresh. Even 10 minutes of obstacle course play is significant gross motor development.' },
  variations: { smallGroup: '2-3 children race through the course — friendly competition adds motivation.', wholeClass: 'Sequential line — children complete the course one at a time while peers cheer from the side.', outdoor: 'Outdoor course using playground structures, jump ropes on the ground, and natural features.', indoor: 'Indoor course using pillows, tunnels, tape lines, and balance boards.', lowResource: 'Tape a line on the floor (balance beam), stack two pillows to jump over, crawl under a table — free obstacle course.' },
  classroomMgmt: { transitions: 'Use obstacle course as an energizer between focused academic activities.', disruptions: 'If children push at the course, add more spacing and clarify "wait your turn at each station."', participation: 'Modify each element to ensure every child can access and succeed in some way.', diverseLearners: 'Adapt each element: lower beam height, shorter crawl tunnel, smaller jump distance based on individual need.' },
  materials: { required: ['Pillows or soft obstacles','Tunnel (commercial or blanket over chairs)','Balance beam or tape line on floor','Cones or markers'], optional: ['Balance board','Hop scotch markers','Parachute for group element'], printable: ['Gross Motor Obstacle Course planning guide'], digital: [] }
};

COACHING_DATA['tp2'] = {
  intro: 'We are going to use these tongs today to pick up cotton balls and move them! Ready to be very precise?',
  tips: ['Demonstrate correct tong grip slowly and clearly before children try', 'Choose tongs sized appropriately for small hands — kitchen tongs are often too large', 'The activity should feel slightly challenging but achievable — adjust cotton ball size as needed'],
  prompts: ['Squeeze the tong handles together! [demonstrate] Squeeze... pick up... move... release!', '[Child struggles] Try squeezing harder — your hand muscles are doing the work right now!', 'You picked it up! All the way across to the other bowl! You used your hand muscles to do that!'],
  close: 'Your hands are SO much stronger than when we started! Those tong exercises are building the exact muscles you will use for writing.',
  questions: { beginner: ['Can you pick it up?','Squeeze the tongs!'], intermediate: ['How many can you move before dropping one?','Which way do you hold the tongs for best control?'], advanced: ['Can you pick up the smaller object now?','Can you do it with your non-dominant hand?'], openEnded: ['What else could you pick up with tongs?','How does using tongs feel different from using your fingers?'] },
  responses: { typical: 'Children squeeze tongs and pick up cotton balls with varying success — dropping is normal and expected.', strong: 'Children develop a controlled tong grip and successfully transfer 8-10 cotton balls with minimal drops.', shy: 'Children attempt the task carefully and quietly; may want their own private tong station.', limitedLanguage: 'Children communicate through persistent practice, gesturing for help when stuck, and showing results to teacher.' },
  shySupport: { prompts: ['Take your time — there is no rush at all!','Even trying to squeeze is building your hand muscles!'], alternatives: ['Start with fingers-only transfer to build success before introducing tongs', 'Use spring-loaded tongs (squeeze to open) which are easier for some children'], encouragement: ['Look how many you moved!','Your hand is getting so strong!'] },
  observation: ['Which tong grip does child use — correct scissor grip or whole fist?','Does accuracy improve within the session with practice?','Which hand does child favor — does hand dominance appear consistent?','Is child developing hand strength (better squeeze) over multiple sessions?'],
  rubric: { beginning: 'Child cannot maintain tong grip; drops objects immediately upon grasping.', developing: 'Child uses tongs to pick up cotton balls with occasional success; drops frequently.', proficient: 'Child transfers 5+ cotton balls successfully with consistent tong grip and growing control.', advanced: 'Child transfers smaller objects with tongs, uses bilateral coordination (one hand holds bowl, other uses tongs), and shows clear hand dominance.' },
  teacherNotes: ['{child} transferred 12 cotton balls in a row without dropping — significant hand strength and control development.', 'During Tong Transfer, {child} switched to the smaller pompoms independently for a greater challenge — showing initiative and confidence.'],
  parentReport: { example: 'Today we used tongs to transfer cotton balls between bowls. This fine motor activity builds the exact hand muscles and pincer coordination needed for writing, drawing, and self-care skills. Your child showed great focus and persistence today!', homeExtension: 'Use kitchen tongs with slightly larger objects (grapes, small crackers) during meal prep supervision. Or use child-sized plastic tongs from a dollar store for a weekly fine motor "tong challenge" at home.' },
  variations: { smallGroup: 'Fine motor station: each child has their own bowl set. Compare speeds or distances.', wholeClass: 'Tong activity during stations time — rotates through several fine motor skill stations.', outdoor: 'Use tongs to pick up natural objects: pinecones, pebbles, leaves — outdoor fine motor adventure.', indoor: 'Fine motor center as part of a daily station rotation.', lowResource: 'No tongs? Use clothespins to pinch and transfer items — same hand muscles, different tool.' },
  classroomMgmt: { transitions: 'Fine motor work is ideal as an arrival activity while all children are transitioning in.', disruptions: 'If children throw cotton balls, redirect: "Cotton balls go from bowl to bowl — let\'s focus!"', participation: 'Individual work — all children participate simultaneously at their own stations.', diverseLearners: 'For children with fine motor challenges, use larger tongs and larger objects. For advanced children, use tweezers and smaller objects.' },
  materials: { required: ['Child-sized tongs','Cotton balls or pompoms (2 colors)','Two small bowls'], optional: ['Sorting tray','Timer for challenge mode','Smaller objects for advanced practice'], printable: ['Fine Motor Skills development checklist'], digital: [] }
};

COACHING_DATA['tp3'] = {
  intro: 'Dance and Freeze time! When the music plays, we dance. When the music stops... FREEZE!',
  tips: ['Use music with clear strong beats for easy dancing — and cut it suddenly for dramatic freezes', 'Call out body positions: "Freeze like a tall tree!" "Freeze like a tiny mouse!" — adds cognitive layer', 'Shorten freeze duration for younger toddlers; extend it as self-regulation develops'],
  prompts: ['[Music plays] DANCE! Move your whole body! Shake your arms! Move your feet!', '[Music stops] FREEZE! Nobody move! What is your body doing right now?', '[Music plays again] And DANCE! You froze so beautifully! Now dance again!'],
  close: 'Your bodies listened so well to the music! Dancing AND freezing — that is listening with your whole body. That is a superpower.',
  questions: { beginner: ['Can you freeze?','What is your body doing right now?'], intermediate: ['Can you freeze like a statue?','Which is harder — dancing or freezing?'], advanced: ['Can you freeze in a ballet pose?','How does your body know to stop?'], openEnded: ['What does freezing feel like in your body?','If you could freeze in any pose, what would it be?'] },
  responses: { typical: 'Children dance enthusiastically and freeze with various degrees of stillness when music stops.', strong: 'Children freeze instantly and with complete stillness; demonstrate creative, intentional dance movements.', shy: 'Children move with smaller, quieter movements; freeze reliably — often FREEZE is easier for shy children.', limitedLanguage: 'Children communicate through their dancing and freezing — movement IS communication in this activity.' },
  shySupport: { prompts: ['Even tiny movements count as dancing!','You can dance quietly near me if you want.'], alternatives: ['Allow shy child to control the music — giving agency to the controller role', 'Stand near shy child during dancing so proximity provides comfort'], encouragement: ['That was a PERFECT freeze!','I love how your body was dancing just then!'] },
  observation: ['How long can each child sustain a freeze? This indicates self-regulation capacity.','Are children making creative dance choices or only copying teacher?','Does freezing quality improve (stillness, control) across the session?','Are children showing body control and spatial awareness during movement?'],
  rubric: { beginning: 'Child cannot freeze for even 2 seconds; continues moving when music stops.', developing: 'Child freezes briefly (2-5 seconds) with teacher support and reminders.', proficient: 'Child freezes for 10+ seconds with full body control and strong listening to music cues.', advanced: 'Child freezes with complete stillness, holds creative poses, and immediately resumes dancing when music starts — perfect music cue listening.' },
  teacherNotes: ['{child} held a freeze for 20 seconds with complete stillness today — extraordinary self-regulation for this age group.', 'During Dance and Freeze, {child} invented creative freeze poses: "a sleeping dog" and "a rocket launching" — showing wonderful creative thinking.'],
  parentReport: { example: 'We played Dance and Freeze today! Dancing builds coordination, body awareness, and joy. FREEZING is what makes this uniquely developmental — it builds listening skills, impulse control, and self-regulation, which are foundational executive function skills that predict school readiness. Your child showed excellent body control today!', homeExtension: 'Play Dance and Freeze at home during free play time! Use any music and take turns being the "music controller." The child who controls the music builds executive function AND social power at the same time.' },
  variations: { smallGroup: 'Small group freeze challenge — last one still dancing is out (friendly version).', wholeClass: 'Whole-room Dance and Freeze — high energy, joyful whole-class physical activity.', outdoor: 'Outdoor dancing on the grass or blacktop — extra space for big movements.', indoor: 'Indoor dance circle — push furniture to the sides for a clear movement space.', lowResource: 'Any music source will work — even clapping a beat and stopping.' },
  classroomMgmt: { transitions: 'Use Dance and Freeze as a physical reset between focused academic activities.', disruptions: 'If children are too wild, reduce music volume and slow the tempo — pace matches energy.', participation: 'All children can participate at their own movement level.', diverseLearners: 'For children with physical mobility differences, adapt freeze poses to their accessible range of motion.' },
  materials: { required: ['Music player with varied music','Clear movement space'], optional: ['Scarves or ribbons for dancing props','Freeze cards with pose illustrations'], printable: ['Freeze pose idea cards','Music and Movement observation guide'], digital: ['Spotify: Toddler Dance and Freeze playlist','Go Noodle freeze dance videos'] }
};

COACHING_DATA['tp4'] = {
  intro: 'Playdough time! Today we are going to squeeze, roll, and create with our playdough!',
  tips: ['Put out playdough with a few tools (no model or example) and let children explore first — 5 minutes of pure exploration before any prompts', 'Name the hand actions: "You are using your whole PALM to roll" — builds motor vocabulary', 'Celebrate the process completely over any product — "that squeezing is SO strong!"'],
  prompts: ['Squeeze it as hard as you can! Feel how it changes shape? Your hands did that!', '[Rolling] Back and forth, back and forth — can you make it into a long snake?', 'What are you making? Tell me about your creation!'],
  close: 'Your hands worked SO hard today! Squeezing, rolling, poking — every single thing you did was making your hand muscles stronger.',
  questions: { beginner: ['What are you making?','Squeeze it hard!'], intermediate: ['Can you make it flat?','How many pieces did you make?'], advanced: ['Can you make a letter with the playdough?','What would you need to make your playdough look like a dog?'], openEnded: ['Tell me about what you created.','What else could you make with playdough?'] },
  responses: { typical: 'Children explore playdough through squeezing, poking, rolling, and beginning to create simple shapes or figures.', strong: 'Children create intentional representations ("a pizza," "a snake," "my house") and narrate their work.', shy: 'Children engage deeply and quietly with playdough — this is often a highly engaging activity for introverted children.', limitedLanguage: 'Children communicate through their creations and by showing teacher what they have made.' },
  shySupport: { prompts: ['You can make whatever you want — there are no rules with playdough!','I would love to make something together if you want a partner.'], alternatives: ['Offer individual playdough portions at separate spaces for children who prefer privacy', 'Allow children to take playdough home if this increases their motivation'], encouragement: ['Look at the amazing things your hands made!','Your hands are getting so strong from this work!'] },
  observation: ['Are children developing more controlled hand movements over multiple sessions?','Do children apply multiple fine motor actions (roll, squeeze, poke, pinch, flatten)?','Are children making intentional representations or purely exploring?','Which hand actions are most developed and which need more practice?'],
  rubric: { beginning: 'Child squeezes and pokes playdough with whole-hand, uncontrolled movements.', developing: 'Child uses multiple actions (squeeze, roll, poke) and begins to make simple intended shapes.', proficient: 'Child uses varied fine motor actions with control; creates representational objects and narrates what they are making.', advanced: 'Child uses precise pinching, smoothing, and shaping; creates detailed figures; incorporates tools with skill.' },
  teacherNotes: ['{child} rolled a perfect snake, cut it into pieces, and arranged them as a "worm family" — extraordinary intentional fine motor and narrative play.', 'During playdough, {child} used the rolling pin to flatten a sheet and used cookie cutters independently — strong tool use and fine motor precision.'],
  parentReport: { example: 'We had Playdough Workshop today! Playdough is one of the most powerful fine motor development tools available. Squeezing, rolling, and pinching strengthens the same hand muscles used for writing, scissors, and self-care tasks. Your child showed wonderful creativity AND strong hand muscles today!', homeExtension: 'Make homemade playdough together: 2 cups flour, 1 cup salt, water, food coloring. It is a great activity AND free! Keep it in an airtight container for weeks. Let your child play freely without a model — process exploration is the goal.' },
  variations: { smallGroup: 'Collaborative playdough project: "Let\'s build a garden together!"', wholeClass: 'Free exploration at a playdough center during stations time.', outdoor: 'Outdoor mud play (with parent consent) provides the same fine motor benefits.', indoor: 'Playdough center available daily as a choice during free exploration.', lowResource: 'Homemade dough (flour, salt, water) is essentially free and just as effective as commercial playdough.' },
  classroomMgmt: { transitions: 'Signal playdough clean-up with a song: "Put the playdough away, away, away!"', disruptions: 'If children throw playdough, state clearly: "Playdough stays on the table. If it gets thrown, playdough time ends."', participation: 'Nearly universal engagement — playdough is one of the most intrinsically motivating materials.', diverseLearners: 'For children with tactile sensitivities to playdough, offer gloves or tools (so hands never touch dough). Work toward bare-hand tolerance gradually.' },
  materials: { required: ['Playdough (commercial or homemade)','Rolling pins','Cookie cutters'], optional: ['Texture stamps','Clay tools','Toothpicks for detail work','Gemstones or buttons for embellishment'], printable: ['Homemade playdough recipe to send home','Fine motor skills development guide'], digital: [] }
};

})(); // end loadToddlerCoaching4

(function loadToddlerCoaching5() {

COACHING_DATA['tcr1'] = {
  intro: 'Today we are going to be color scientists! We are going to MIX colors and discover what happens!',
  tips: ['Use only the three primary colors (red, blue, yellow) — all mixing discoveries come from these three', 'Let children mix completely freely — resist directing what they should make', 'Express genuine wonder and surprise even when YOU know what will happen'],
  prompts: ['Put the red and the yellow together — swirl them around — what is happening?! ORANGE! You made orange!', 'What do YOU want to mix? Which two colors are you curious about?', '[Child makes a muddy color] What happened? What do you think made that color? What did you learn?'],
  close: 'You made NEW colors today from just three starting colors! Red, blue, and yellow can make every color in the whole rainbow. YOU discovered that today.',
  questions: { beginner: ['What color did you make?','What happens if we add more blue?'], intermediate: ['Why do you think those two colors made purple?','What color would red and yellow make?'], advanced: ['Can you make the color lighter? How?','How could you make brown?'], openEnded: ['What other colors can you imagine?','If you could create a brand new color, what would you name it?'] },
  responses: { typical: 'Children mix colors enthusiastically; show delight and surprise at the new colors they create.', strong: 'Children hypothesize before mixing ("I think red and blue will make purple!") and test their predictions.', shy: 'Children mix quietly and with intense focus — color mixing is often deeply absorbing for introverted children.', limitedLanguage: 'Children communicate through showing their color creations to the teacher and peers.' },
  shySupport: { prompts: ['Try any two colors you want — there is no right or wrong mix!','What color are you curious about making?'], alternatives: ['Provide individual paint sets so children are not watching others','Use eyedroppers for a more controlled, gentle mixing method'], encouragement: ['You made that color! No one else has that exact color — you created it!','Your color mixing is beautiful!'] },
  observation: ['Are children mixing intentionally (testing ideas) or randomly?','Do children show surprise and delight at color discoveries?','Are children developing color vocabulary (orange, purple, green)?','Do children transfer knowledge from one mix to predict the next?'],
  rubric: { beginning: 'Child mixes colors randomly with no prediction or connection to results.', developing: 'Child mixes and notices new colors with excitement; beginning to name the results.', proficient: 'Child predicts some color mixes, names all three primary and most secondary colors, and explains what mixing does.', advanced: 'Child hypothesizes before mixing, explains why a color formed, and invents systematic experiments with color.' },
  teacherNotes: ['{child} said "I predict red and yellow makes orange" before mixing today — demonstrating scientific prediction language in an art context.', 'During Color Mixing, {child} created 7 distinct secondary and tertiary colors and named most of them accurately.'],
  parentReport: { example: 'We did Color Mixing Magic today! This activity builds creative thinking, scientific reasoning (cause and effect), color vocabulary, and pure joy of discovery. Your child showed wonderful curiosity and scientific thinking — making predictions and testing them through mixing!', homeExtension: 'Mix food coloring in ice cube trays with water — your child can create their own color laboratory safely and cheaply! Or mix watercolor paints on wet paper. Name the new colors together and celebrate every discovery.' },
  variations: { smallGroup: 'Color mixing partners: each pair has two colors to mix and shares their discovery with the group.', wholeClass: 'Class color wheel: each small group mixes one secondary color and adds it to a shared color wheel.', outdoor: 'Outdoor mudpainting: mix soil, water, and natural materials for earthy color exploration.', indoor: 'Color mixing center with paints, eyedroppers, or watercolors.', lowResource: 'Two cups of water with food coloring and a third empty cup — the most minimal color mixing setup imaginable.' },
  classroomMgmt: { transitions: 'Announce clean-up time with 5-minute and 1-minute warnings — color mixing can be hard to stop!', disruptions: 'If children paint each other or the table, calmly redirect: "Paint goes on the paper."', participation: 'All children can participate at any level — even the most reluctant children often engage with color mixing.', diverseLearners: 'For children with tactile sensitivities, use eyedroppers or brushes so hands do not touch paint.' },
  materials: { required: ['Red, blue, and yellow paint','White paper','Brushes or eyedroppers'], optional: ['Mixing trays','Smocks','Additional materials: salt, glue, texture additives'], printable: ['Color wheel reference card','Color mixing experiment recording sheet'], digital: ['PBS Design Squad color science activities'] }
};

COACHING_DATA['tcr2'] = {
  intro: 'Look at all these instruments! Today we are going to make music together — rhythm instruments!',
  tips: ['Demonstrate one instrument at a time before distributing them — sensory overload from simultaneous introduction is overwhelming', 'Clap a simple 4-beat pattern and have children copy before adding instruments', 'Fast/slow and loud/soft are the two key musical concepts — practice both every session'],
  prompts: ['Listen to this beat: 1-2-3-4 [clap]. Can you copy it with your instrument?', 'Let\'s play LOUD! [crash] Now very QUIET! [tap] Our instruments have different voices.', 'Now let\'s create our own class rhythm together — everyone listen to each other!'],
  close: 'You made music together today! Everyone listened to each other, played together, and created something beautiful. That is what musicians do.',
  questions: { beginner: ['Can you copy my beat?','Play it fast! Now slow!'], intermediate: ['How is the drum sound different from the shaker sound?','Can you make up your own beat?'], advanced: ['How do you make music louder without changing the beat?','Can you hear when someone is playing off the beat?'], openEnded: ['What mood does this rhythm create?','What stories could you tell with only your instrument?'] },
  responses: { typical: 'Children play rhythmically and copy simple beat patterns; show joy in producing sound.', strong: 'Children play in tempo with the group, adjust dynamics on request, and create original patterns.', shy: 'Children play their instrument more quietly; may prefer to tap rather than strike firmly.', limitedLanguage: 'Children communicate through playing — volume, tempo, and rhythm choice tell us their musical intent.' },
  shySupport: { prompts: ['There is no wrong way to play your instrument — make any sound you want!','You can play quietly — quiet music is beautiful too!'], alternatives: ['Let shy child choose their own instrument from the available options', 'Allow shy child to keep their instrument during the whole session rather than switching'], encouragement: ['I love how you play that drum!','Your rhythm is so steady and strong!'] },
  observation: ['Can children maintain a steady beat?','Do children adjust tempo and volume when instructed?','Are children listening to the group and adjusting their playing?','Does any child show exceptional rhythmic aptitude?'],
  rubric: { beginning: 'Child bangs instrument randomly; cannot copy a simple beat pattern.', developing: 'Child copies 2-3 beat patterns and responds to fast/slow instructions.', proficient: 'Child maintains a steady beat, copies varied patterns, and adjusts dynamics (loud/soft) on request.', advanced: 'Child leads the group rhythm, maintains tempo while others adjust dynamics, and creates complex original beat patterns.' },
  teacherNotes: ['{child} held a steady 4-beat rhythm for 30 seconds while the rest of the group experimented with speed — extraordinary rhythmic steadiness.', 'During Rhythm Instruments, {child} invented a cross-body arm pattern to play the drum that was more sophisticated than the teacher-modeled approach.'],
  parentReport: { example: 'We played Rhythm Instruments today — drums, shakers, bells, and homemade instruments! Music-making builds rhythm, listening, coordination, mathematical pattern recognition, and teamwork. Your child showed wonderful musical engagement and creativity today!', homeExtension: 'Make a homemade rhythm band: oatmeal containers become drums, dried beans in a sealed container become shakers, pot lids become cymbals. Play music and march around the house — joyful, free, and enormously valuable!' },
  variations: { smallGroup: 'Small group ensemble: give each child a different instrument and create a band together.', wholeClass: 'Whole-class rhythm circle — all playing together building toward a unified rhythmic performance.', outdoor: 'Outdoor drum circle on the grass — bigger movements, louder sounds, joyful freedom.', indoor: 'Music center with rotating instrument access during free play.', lowResource: 'Body percussion: clap, stomp, pat knees, snap — no instruments needed.' },
  classroomMgmt: { transitions: 'Use the group rhythm as a transition signal: "When we all play together and then STOP — that means transition time!"', disruptions: 'If noise becomes overwhelming, slow the tempo dramatically and lower the volume — children naturally follow.', participation: 'Instrument play is nearly universally motivating.', diverseLearners: 'For children with auditory sensitivities, offer soft instruments (cloth drums, fabric shakers) and allow them to sit slightly apart from the main group.' },
  materials: { required: ['Drums, shakers, bells, or homemade instruments (one per child)'], optional: ['Xylophone','Rhythm sticks','Downloadable rhythm cards'], printable: ['Rhythm pattern cards','Musical vocabulary chart'], digital: ['YouTube: Toddler music and movement videos','Spotify: Children\'s World Percussion'] }
};

COACHING_DATA['tcr3'] = {
  intro: 'We are going to draw our story today! After we read, you will draw what YOU saw in the story.',
  tips: ['Read the story first without interruption for full enjoyment, THEN ask for drawing', 'Accept all marks and scribbles as story representations — never correct or interpret incorrectly', 'Write the child\'s exact words on their paper (not your interpretation) as dictation'],
  prompts: ['What happened in the story that you want to draw? Close your eyes and see the pictures in your head!', '[Child draws] Tell me about your picture. I want to write YOUR words on it.', '[Writing dictation] You said: "The dog was running." I am writing YOUR exact words. This is YOUR story.'],
  close: 'Look — you drew your own version of the story! And your words are written right there. You are an author and illustrator.',
  questions: { beginner: ['What did you draw?','Tell me about your picture.'], intermediate: ['Which part of the story did you choose to draw?','What is happening in your picture?'], advanced: ['Can you draw the beginning, middle, and end?','What would happen next in your version of the story?'], openEnded: ['If you could change the story, what would you change?','What part of the story stuck in your head?'] },
  responses: { typical: 'Children draw scribbles or simple shapes representing story elements; narrate their drawing to the teacher.', strong: 'Children draw recognizable figures from the story and narrate a detailed retelling.', shy: 'Children draw privately and are more willing to narrate their picture one-on-one than in a group.', limitedLanguage: 'Children communicate through their drawing and non-verbal gestures when asked about what they drew.' },
  shySupport: { prompts: ['You can just draw whatever comes to your mind — nothing has to look exactly right!','Can you just show me with your finger what you want to draw?'], alternatives: ['Read the story one-on-one with a shy child for a more intimate story-drawing experience', 'Allow child to trace or add to a simple outline rather than starting from scratch'], encouragement: ['Your drawing tells a whole story!','I could see the whole story in what you drew!'] },
  observation: ['Are children drawing representationally or still at scribble stage?','Are children making narrative connections between the book and their drawing?','Are children narrating their drawing (early oral storytelling)?','Any children showing letter-like forms or early writing attempts?'],
  rubric: { beginning: 'Child makes random marks with no narrative connection to the story.', developing: 'Child creates marks or shapes they identify as story elements; narrates briefly when prompted.', proficient: 'Child draws recognizable figures or scenes from the story and narrates a 3+ sentence story about their drawing.', advanced: 'Child creates a multi-scene illustration with characters and setting from the story; narrates an original extension of the plot.' },
  teacherNotes: ['{child} drew the main character from our story with recognizable facial features and narrated: "She was scared but then she was brave" — extraordinary narrative comprehension and illustration.', 'During Story Drawing, {child} drew a sequence of three events from the book in correct order — demonstrating clear story sequence understanding.'],
  parentReport: { example: 'We did Story Drawing today — after reading a picture book together, children drew their version of the story. This builds comprehension, narrative thinking, drawing skills, and the connection between visual and verbal storytelling — all foundational literacy skills. Your child created a wonderful story drawing today!', homeExtension: 'After reading a bedtime story, ask your child to draw their favorite part. Write their EXACT words as a caption. These "child author books" are treasures that document reading growth and build enormous literacy motivation.' },
  variations: { smallGroup: 'Each child draws a different part of the story — then assemble the drawings into a class storybook.', wholeClass: 'Shared drawing: large paper on the floor, all children add to a group mural of the story.', outdoor: 'Draw the story with chalk on the playground blacktop.', indoor: 'Story drawing at tables with varied media: crayons, markers, collage materials.', lowResource: 'Any paper and crayons. The story is the most important material — books are free from the library.' },
  classroomMgmt: { transitions: 'Move from story reading directly to drawing time with minimal gap to maintain narrative in memory.', disruptions: 'If children say "I can\'t draw," respond: "There is no wrong way to draw — just put something on the paper and tell me about it!"', participation: 'All children can participate at their developmental drawing stage — scribbles are full participation.', diverseLearners: 'For children with fine motor challenges, offer larger paper and fatter drawing tools. Accept any mark-making as valid story drawing.' },
  materials: { required: ['Picture books','Paper','Crayons or markers'], optional: ['Watercolors','Collage materials','Story response journal'], printable: ['Story drawing response template','My Story Drawing book cover template'], digital: ['Storyline Online for book inspiration'] }
};

// Toddler Life Skills, Health, Character
COACHING_DATA['tls1'] = {
  intro: 'We are going to set our table for lunch today! Everyone helps in our classroom family.',
  tips: ['Show the table diagram first — where does each item belong?', 'Assign one item per child initially — not all items at once', 'Genuine community purpose matters: "When we set the table, EVERYONE gets to eat"'],
  prompts: ['The cup goes at the TOP of the plate — can you put your cup right there?', 'One plate goes at each chair — how many plates do we need? Let\'s count the chairs!', 'Table is set! Look what we did TOGETHER. Everyone helped and now everyone can eat.'],
  close: 'You set the table today! When you help your classroom family, you are being a real community member. That is something to be very proud of.',
  questions: { beginner: ['Where does the cup go?','What comes next?'], intermediate: ['How many plates do we need?','Where does the napkin go?'], advanced: ['Can you set the whole table yourself?','What would happen if we forgot the forks?'], openEnded: ['Why does it matter that everyone helps?','How does it feel to help get the table ready?'] },
  responses: { typical: 'Children place items correctly with verbal guidance; take pride in their contribution.', strong: 'Children independently set their assigned place correctly and assist peers.', shy: 'Children perform their task quietly but with clear investment in doing it right.', limitedLanguage: 'Children communicate through action — placing items and gesturing for confirmation.' },
  shySupport: { prompts: ['I will show you where it goes first.','You can do just your spot — right there!'], alternatives: ['Give shy child the simplest item (napkin) to build success before larger tasks', 'Allow child to work near a trusted peer for confidence'], encouragement: ['You set it perfectly!','You helped our whole class eat today!'] },
  observation: ['Does child understand one-to-one correspondence (one plate per person)?','Can child follow the table setting sequence without reminders?','Does child show ownership and pride in their community responsibility?','Is child transferring table-setting skills to independent home reports?'],
  rubric: { beginning: 'Child places items randomly with no sequence or correspondence understanding.', developing: 'Child places their assigned item correctly with clear guidance.', proficient: 'Child independently places all assigned items correctly and in sequence.', advanced: 'Child sets the entire table independently including counting chairs and adjusting for number of diners.' },
  teacherNotes: ['{child} set four plates correctly without any prompting today — counting chairs and matching to plates independently.'],
  parentReport: { example: 'We set the table for lunch together today! This life skill activity builds one-to-one correspondence (a math skill!), sequencing, responsibility, and community contribution. Your child participated with pride and careful attention.', homeExtension: 'Assign a table-setting role at home (napkins, cups, forks) and let your child do it independently before meals. The pride of contributing to the family table is enormously motivating.' },
  variations: { smallGroup: 'Small group sets one table together with role assignments.', wholeClass: 'Whole-class table setting — every child has a job for every meal.', outdoor: 'Set up a picnic table outside — tablecloth, plates, and cups for an outdoor meal.', indoor: 'Daily pre-lunch routine — part of the classroom schedule.', lowResource: 'Paper plates and paper napkins work perfectly for this practice.' },
  classroomMgmt: { transitions: 'Table setting IS a transition into mealtime — signals and prepares the whole class.', disruptions: 'If plates are used as frisbees, calmly redirect: "Plates are for eating — let\'s put them on the table."', participation: 'Every child gets a table-setting job every day.', diverseLearners: 'For children with motor challenges, start with unbreakable large items (plastic plates, napkins).' },
  materials: { required: ['Plates, cups, napkins for each child'], optional: ['Child-safe utensils','Table setting diagram card'], printable: ['Table Setting diagram for reference'], digital: [] }
};

COACHING_DATA['tls2'] = {
  intro: 'Let\'s practice getting dressed! These buttons and zippers are going to be our friends today.',
  tips: ['Start with the LARGEST fasteners — big buttons, large zippers — and move to smaller ones as skill develops', 'Sit behind the child when helping so they see the same angle as when doing it themselves', 'Celebrate EVERY attempt, not just completions — "You got it halfway zipped! That is amazing!"'],
  prompts: ['See this button? It needs to go THROUGH the hole. Push it through — nice and firm!', '[Zipper practice] Hold the bottom still with this hand, pull UP with the other — ready?', 'You did it! You fastened your own clothes! That is getting dressed all by yourself!'],
  close: 'Getting dressed by yourself is one of the most powerful things you can learn to do. Every time you practice, you are becoming more independent.',
  questions: { beginner: ['Can you do it yourself?','Pull the zipper up!'], intermediate: ['Which hand holds still? Which hand pulls?','What is the hardest fastener for you?'], advanced: ['Can you do it with your eyes closed?','Can you teach your friend how to button?'], openEnded: ['Why is it important to dress yourself?','How does it feel when you do it by yourself?'] },
  responses: { typical: 'Children attempt fasteners with concentration and varying success; show visible pride when they succeed.', strong: 'Children complete fasteners independently and spontaneously help peers.', shy: 'Children practice intensely but privately; prefer not to be watched during struggle.', limitedLanguage: 'Children communicate through persistent attempts, showing teacher completed fasteners, and gesturing for help.' },
  shySupport: { prompts: ['Take your time — I am not going anywhere!','I am going to sit right here in case you need me.'], alternatives: ['Allow practice at a "dress-up" station rather than with real clothing for privacy', 'Let child practice on a dressing board before applying to clothing'], encouragement: ['You did it ALL BY YOURSELF!','Look at your hands — they know how to do this!'] },
  observation: ['Which fasteners are within the child\'s current skill level?','Is bilateral coordination (using both hands together) developing?','Does child show persistence through difficulty or give up quickly?','Is hand dominance consistent?'],
  rubric: { beginning: 'Child cannot manipulate any fastener independently.', developing: 'Child attempts large-button fasteners with occasional success; needs support with zippers.', proficient: 'Child independently fastens large buttons and zippers; attempts smaller buttons.', advanced: 'Child independently manages all common fasteners (buttons, zippers, velcro, snaps) with confidence.' },
  teacherNotes: ['{child} zipped their own coat for the first time independently today — a significant self-care milestone celebrated by the whole class!'],
  parentReport: { example: 'We practiced dressing skills today — buttoning, zipping, and velcro! Self-dressing builds fine motor control, bilateral coordination, independence, and self-confidence. These are all significant developmental milestones. Your child worked hard and showed wonderful persistence today!', homeExtension: 'Let your child dress themselves every morning even if it takes longer — the extra 5 minutes is an investment in independence. Start with the easiest fastener and give them time to struggle productively before stepping in.' },
  variations: { smallGroup: 'Dress-up relay race: team dresses and undresses the same dress-up outfit.', wholeClass: 'Before-outdoor-time coat practice: all children put on their own coats before going outside.', outdoor: 'Practice before going outside — genuine, meaningful context for fastening skills.', indoor: 'Dressing board or dress-up center available daily.', lowResource: 'Old shirts or coats with large buttons sourced from donations — free practice materials.' },
  classroomMgmt: { transitions: 'Use coat-putting-on as a transition ritual to outdoor time — purposeful and skill-building.', disruptions: 'Never do the fastening FOR the child unless genuinely necessary — guide hands instead.', participation: 'All children participate through daily routines — this is embedded in every arrival and departure.', diverseLearners: 'For children with fine motor challenges, start with velcro, then progress through graduated fastener difficulty.' },
  materials: { required: ['Large-button shirts','Zip-practice boards or actual zippers','Velcro shoes or straps'], optional: ['Dressing boards','Dress-up clothing with varied fasteners'], printable: ['Dressing sequence visual cards'], digital: [] }
};

COACHING_DATA['tls3'] = {
  intro: 'Clean-up time! And today we have a new way to do it — matching our toys to the picture labels on the bins!',
  tips: ['Ensure picture labels on bins are clear, bright, and at child eye level', 'Make it a MATCHING game — "Find the picture that matches your toy!"', 'Never rush clean-up — hurrying teaches carelessness; slowness teaches care'],
  prompts: ['Find the picture label that matches your toy! Where does the car go? Find the car picture!', '[Child matches correctly] You found the match! The car goes in the car bin. You sorted it!', 'Our room is organized! When we know where things belong, we can always find them tomorrow.'],
  close: 'Everything has a home in our classroom. When we put things in their homes, we are taking care of our space and our community.',
  questions: { beginner: ['Where does the block go?','Find the matching picture!'], intermediate: ['Why does each toy have its own special place?','What would happen if we did not clean up?'], advanced: ['Can you clean up your whole area independently?','What if a toy does not have a bin?'], openEnded: ['How does a tidy room make you feel?','What is the best part of our classroom when it is all organized?'] },
  responses: { typical: 'Children match toys to picture labels with occasional prompting and growing accuracy.', strong: 'Children match accurately and independently, assisting peers who are uncertain where things go.', shy: 'Children clean up quietly and thoroughly — often the most careful cleaners.', limitedLanguage: 'Children match through visual-motor action — comparing toy to picture and placing correctly.' },
  shySupport: { prompts: ['Can you find the matching picture? Look carefully!','You are such a good helper with clean-up!'], alternatives: ['Pair shy child with a familiar peer for team clean-up', 'Give shy child one specific bin to be "in charge of" during clean-up'], encouragement: ['You found every match!','Our room is so beautiful because of your help!'] },
  observation: ['Are children matching picture labels correctly and consistently?','Are children developing automaticity with the routine (needing fewer reminders)?','Do children take pride in the organized result?','Are children problem-solving when a toy does not match an existing bin?'],
  rubric: { beginning: 'Child needs hand-over-hand guidance to match toys to bins.', developing: 'Child correctly matches most toys to their bins with verbal reminders.', proficient: 'Child independently matches all toys to correct bins and cleans their area without prompting.', advanced: 'Child completes own clean-up and supports peers; identifies organizational improvements ("We need a bin for the markers!").' },
  teacherNotes: ['{child} completed their entire clean-up area independently without any teacher prompting today — exemplary responsibility.'],
  parentReport: { example: 'We practiced Picture Label Clean-Up today — matching each toy to its bin\'s picture label before putting it away. This builds visual matching skills, organizational habits, and personal responsibility for community space. Your child showed wonderful care and attention to their environment today!', homeExtension: 'Add simple picture labels to toy bins at home (cut pictures from the toy boxes or draw simple images). Let your child help you label them — then they will own the organizational system and be more motivated to maintain it.' },
  variations: { smallGroup: 'Team clean-up: each team is responsible for one section of the room.', wholeClass: 'Whole-class clean-up with music: everyone has their section and the room transforms in one song.', outdoor: 'Outdoor toy and garden tool clean-up with matching tool outlines on the storage board.', indoor: 'Daily routine — embedded in every activity transition.', lowResource: 'Draw pictures on masking tape labels and stick to bins — free, flexible labeling system.' },
  classroomMgmt: { transitions: 'Clean-up IS a transition — from one activity to the next. Make it consistent and musical.', disruptions: 'If children resist clean-up, offer a specific job: "You are in charge of the block bin!"', participation: 'All children participate in daily community care.', diverseLearners: 'For children with processing challenges, simplify by reducing number of bins initially.' },
  materials: { required: ['Labeled bins with picture labels (one per toy category)'], optional: ['Clean-up song playlist','Timer for clean-up challenge'], printable: ['Printable bin label pictures'], digital: [] }
};

COACHING_DATA['th1'] = {
  intro: 'Time to wash our hands! We are going to sing our special song the whole time — 20 seconds of scrubbing!',
  tips: ['Use the exact same song every single time — "Happy Birthday" twice, ABC song, or a custom hand-washing song', 'Check that water temperature is warm but not hot before children wash', 'Make the soap bubbles magical: "The bubbles are chasing the germs away!"'],
  prompts: ['Water on! Wet our hands first — all the way wet!', '[Song] Now SOAP — squirt the soap and we scrub while we sing! Palms, backs, between fingers!', 'Rinse! Watch the bubbles go away — and the germs went with them! Now dry!'],
  close: 'Clean hands save lives — that is actually true! Every time we wash our hands for 20 seconds, we stop germs from making us sick. You did something powerful just now.',
  questions: { beginner: ['Did we get all the germs?','Why do we wash our hands?'], intermediate: ['How long do we wash?','What do germs do if they get inside our bodies?'], advanced: ['When are the most important times to wash your hands?','Is rinsing alone enough?'], openEnded: ['Why do you think soap works better than just water?','What would happen if nobody ever washed their hands?'] },
  responses: { typical: 'Children follow hand-washing steps and sing along; developing automaticity with the routine.', strong: 'Children complete the full routine independently and remind peers when they forget.', shy: 'Children wash thoroughly and quietly; may not engage verbally but technique is excellent.', limitedLanguage: 'Children communicate through action — following each washing step with growing independence.' },
  shySupport: { prompts: ['Just sing the song quietly with me!','Your hands know exactly what to do!'], alternatives: ['Stand beside shy child at the sink for supportive proximity', 'Allow child to watch one peer before going themselves if nervous about the sink'], encouragement: ['Your hands are so clean and healthy!','You did the whole 20 seconds perfectly!'] },
  observation: ['Are children completing all steps (wet, soap, scrub all surfaces, rinse, dry)?','Is hand-washing duration reaching 20 seconds?','Are children washing independently without step-by-step reminders?','Are children washing at appropriate times without prompting (before meals, after outdoor play)?'],
  rubric: { beginning: 'Child needs complete guidance through every hand-washing step.', developing: 'Child completes hand-washing with verbal step-by-step reminders.', proficient: 'Child washes hands independently for 20 seconds including all surfaces when reminded.', advanced: 'Child washes hands independently at appropriate times without reminders and teaches others the correct technique.' },
  teacherNotes: ['{child} reminded a peer to wash their hands before snack time today without any teacher prompting — health habit ownership achieved!'],
  parentReport: { example: 'We washed hands today using our 20-second hand-washing song! This single hygiene habit prevents more illness than almost any other early childhood health practice. Your child is developing this important habit beautifully — please reinforce it at home with the same song if you can.', homeExtension: 'Use the same song at home that we use at school for the most powerful habit transfer. Post a small reminder card at your home sink with pictures of the steps: wet, soap, scrub, rinse, dry.' },
  variations: { smallGroup: 'Hand-washing line: children form a line at the sink and rotate through.', wholeClass: 'Before every meal — the most natural and important real-world context.', outdoor: 'Portable hand-washing station for outdoor use after nature play.', indoor: 'Before all meals and snacks, after bathroom, after sensory activities.', lowResource: 'Warm water, gentle soap, paper towels — nothing else needed.' },
  classroomMgmt: { transitions: 'Hand-washing is the transition INTO meal time — consistent and non-negotiable.', disruptions: 'Never skip hand-washing for time reasons — it sets a dangerous precedent about health habits.', participation: 'All children wash hands before meals every day without exception.', diverseLearners: 'For children with tactile sensitivities, use unscented soap and test water temperature carefully beforehand.' },
  materials: { required: ['Sink with warm water','Gentle unscented soap','Paper towels'], optional: ['Hand-washing steps poster','Timer or sand timer for 20 seconds'], printable: ['Hand-washing steps visual chart'], digital: ['CDC handwashing video for children'] }
};

COACHING_DATA['th2'] = {
  intro: 'Look at all these beautiful colors — on FOOD! Today we are going to make a rainbow on our plate!',
  tips: ['Use real food samples whenever possible — seeing AND tasting creates the strongest learning', 'Connect color to the specific nutrients it represents: "Orange foods are great for our eyes!"', 'Never pressure children to eat new foods — exposure and familiarity is the goal, not consumption'],
  prompts: ['Red strawberries, orange carrots, yellow bananas, green broccoli — look at our food rainbow!', 'Different colors mean different healthy things inside! Orange gives us something called vitamin A for our eyes!', 'Which color do you see on your plate? Is it a food rainbow?'],
  close: 'Every color on your plate is your body getting something it needs to be healthy and strong. A rainbow plate is a happy, healthy body!',
  questions: { beginner: ['What color is this food?','Is this food healthy?'], intermediate: ['Why do you think we should eat different colors?','Which color food do you like most?'], advanced: ['What happens to your body when you eat colorful foods?','Can you name one food from every color?'], openEnded: ['If you could add one new color food to your diet, which would it be?','Why do you think nature made food so many colors?'] },
  responses: { typical: 'Children identify colors of foods and show curiosity about new colorful options.', strong: 'Children name specific nutrients and explain which body part is supported by each color food.', shy: 'Children observe and listen; may taste a new food privately without public comment.', limitedLanguage: 'Children communicate through pointing to colors, tasting, and facial expressions of taste reactions.' },
  shySupport: { prompts: ['You just have to look — you do not have to eat anything today!','Which colors can you spot on the table?'], alternatives: ['Focus entirely on color identification without any eating pressure', 'Let shy child be the "color detective" who finds and labels all the colors'], encouragement: ['You named every color! Amazing!','You are such a healthy food explorer!'] },
  observation: ['Can children identify 5+ food colors?','Are children showing curiosity about trying new colorful foods?','Are children connecting color to health concepts?','Any food aversions to note for dietary considerations?'],
  rubric: { beginning: 'Child cannot identify food colors or shows no interest in the nutrition concept.', developing: 'Child identifies 3-4 food colors and relates them to healthy eating.', proficient: 'Child identifies all food colors, connects color to general health benefits, and chooses colorful foods at snack time.', advanced: 'Child names specific nutrients by color, advocates for colorful meals, and teaches peers about rainbow eating.' },
  teacherNotes: ['{child} arranged their snack plate into a rainbow pattern independently today — demonstrating internalized nutrition concepts.'],
  parentReport: { example: 'We learned about Rainbow Eating today — the idea that eating many colors of fruits and vegetables gives our bodies many different healthy nutrients. Your child showed wonderful engagement and even tried tasting a new colorful food!', homeExtension: 'Challenge your family to put 3 different colors of fruits or vegetables on the dinner plate tonight! Make it a rainbow plate challenge and let your child be the color expert.' },
  variations: { smallGroup: 'Small group food color sorting: sort pictures of foods into color groups.', wholeClass: 'Snack time rainbow challenge: each child contributes one color food for a shared rainbow platter.', outdoor: 'Garden tour: find growing foods and identify their colors.', indoor: 'Rainbow plate activity during nutrition education.', lowResource: 'Use pictures from magazines to make a food rainbow collage — no real food needed.' },
  classroomMgmt: { transitions: 'This works naturally as a pre-lunch or snack discussion activity.', disruptions: 'Never shame food choices; approach all nutrition education with a positive, curiosity frame.', participation: 'All children can participate in color identification — eating is optional.', diverseLearners: 'For children with food allergies or restrictions, ensure color examples do not include restricted foods.' },
  materials: { required: ['Pictures of colorful fruits and vegetables or real samples'], optional: ['Rainbow plate sorting mat','Taste-testing samples of colorful foods'], printable: ['Rainbow Foods chart','My Rainbow Plate template'], digital: ['USDA MyPlate for Kids resources'] }
};

COACHING_DATA['tch1'] = {
  intro: 'Today we are going to read about something really important — honesty. What does it mean to tell the truth?',
  tips: ['Choose a story with a character who lies and then tells the truth — seeing both choices matters', 'Avoid moralizing during the story — let the narrative do the work, debrief afterward', 'Connect to real, gentle toddler scenarios: the dropped toy, the spilled paint'],
  prompts: ['What did the character do that was not honest? Why do you think he chose that?', 'When he told the truth, how did everyone feel? How did HE feel?', 'What would YOU do? That is the real question — and only you know the answer.'],
  close: 'Telling the truth is sometimes hard — but it always feels better in the end. And it keeps our friendships and trust strong.',
  questions: { beginner: ['Why did he tell the truth?','How did his friends feel?'], intermediate: ['Why is it hard to tell the truth sometimes?','What happens to trust when we lie?'], advanced: ['When might telling the truth feel scary?','What is the difference between a lie and a mistake?'], openEnded: ['When is it hard for you to tell the truth?','How does honesty feel compared to lying?'] },
  responses: { typical: 'Children engage with the story narrative and identify the character\'s feeling after telling the truth.', strong: 'Children connect the story to their own experiences and articulate why honesty matters.', shy: 'Children listen carefully but may not share personal connections publicly.', limitedLanguage: 'Children communicate through pointing to characters, nodding, and showing facial responses to story events.' },
  shySupport: { prompts: ['You can just listen — you do not have to share.','What did YOU notice in the story?'], alternatives: ['Follow up privately: "Was there a time when telling the truth was hard for you?"', 'Use puppets to re-enact the story scenario for a more distanced processing experience'], encouragement: ['You listened so carefully to that whole story!','Thank you for thinking about that so hard!'] },
  observation: ['Can children identify the moral of the story?','Are children making personal connections to honesty experiences?','Do children use honesty language ("truth," "lie," "trust") appropriately?','Are children showing increased honesty behavior in the classroom following the lesson?'],
  rubric: { beginning: 'Child cannot identify what honesty or lying means from the story context.', developing: 'Child identifies the honest/dishonest choices in the story but cannot explain why it matters.', proficient: 'Child explains the story\'s honesty theme, connects it to personal experience, and articulates why honesty matters.', advanced: 'Child applies honesty concept to complex nuanced scenarios (white lies, kindness vs. honesty tension) and advocates for truth-telling with peers.' },
  teacherNotes: ['{child} said "I told the truth one time and it was hard but then I felt better" during the honesty discussion — meaningful personal connection to the concept.'],
  parentReport: { example: 'We read and discussed a story about honesty today! Understanding honesty — why it matters, why it can be hard, and how it feels when we choose it — is a foundational character development goal. Your child engaged thoughtfully and made meaningful personal connections to the story.', homeExtension: 'When your child tells you the truth about something difficult, name it: "Thank you for being honest with me. That took courage. I am so proud of you." This response builds a lifetime of honest communication.' },
  variations: { smallGroup: 'Small group role play: one character tells a lie, one tells the truth — act out both endings.', wholeClass: 'Shared read-aloud with whole-group discussion and connection sharing.', outdoor: 'Honesty scenarios during outdoor play: "What would you do if your ball hit the neighbor\'s window?"', indoor: 'Story time circle with follow-up discussion.', lowResource: 'Tell a teacher-created verbal story about honesty — no book needed.' },
  classroomMgmt: { transitions: 'This is a natural circle-time activity that ends with the whole class sharing one truth about themselves.', disruptions: 'If a child shares something concerning during the honesty discussion, note it for follow-up rather than shutting it down in the moment.', participation: 'All can listen and respond at their comfort level — never force sharing of personal honesty experiences.', diverseLearners: 'Be culturally sensitive — honesty norms can vary across cultures. Focus on impact rather than absolute rules.' },
  materials: { required: ['Book about honesty or a teacher-told story'], optional: ['Puppets for role play','Honesty poster'], printable: ['Discussion question cards for honesty theme'], digital: ['Daniel Tiger honesty episodes'] }
};

COACHING_DATA['tch2'] = {
  intro: 'Today we are planting something and practicing one of the most important things — PATIENCE! Ready?',
  tips: ['The planting experience is powerful: actually getting hands in soil, planting a real seed, and waiting for real results', 'Revisit the plant EVERY day — the daily check-in is where patience is actually practiced', 'Connect the plant\'s growth to the child\'s own growth: "Just like you, the plant needs time and care"'],
  prompts: ['Push the seed into the soil — not too deep! It needs light to find.', '[Daily check] Has it grown yet? Let\'s look carefully... not yet! What do we do? We wait.', '[When sprout appears] You waited and waited — and look! It was growing the WHOLE TIME, even when we could not see it!'],
  close: 'You learned patience by taking care of this plant. Wonderful things are growing all around you — and some of the most important ones, like this plant, need time.',
  questions: { beginner: ['Has it grown yet?','Why do we need to wait?'], intermediate: ['What does the plant need to grow?','How do you feel while you are waiting?'], advanced: ['How long do you think it will take?','What is happening inside the seed that we cannot see?'], openEnded: ['What else in life needs patience?','How do you make waiting easier for yourself?'] },
  responses: { typical: 'Children eagerly check the plant each day; show genuine excitement when growth appears.', strong: 'Children track growth over days, make predictions about speed of growth, and connect plant care to their patience.', shy: 'Children tend to the plant privately and carefully; showing caretaking rather than verbal engagement.', limitedLanguage: 'Children communicate through physically checking, pointing at emerging growth, and expression of excitement.' },
  shySupport: { prompts: ['Do you want to be the plant waterer today?','Tell me what you notice about our plant today.'], alternatives: ['Give each shy child their own personal plant to care for privately', 'Let shy child make daily drawings of the plant as a non-verbal tracking activity'], encouragement: ['You have been so patient and so caring!','Look — YOUR patience helped this plant grow!'] },
  observation: ['Are children developing delay of gratification (checking the plant without expecting immediate results)?','Are children making connections between care (watering) and growth outcomes?','Do children show increasing investment in the plant\'s health over time?','Any children who lose patience quickly — important developmental data point?'],
  rubric: { beginning: 'Child shows no patience; becomes immediately frustrated when plant shows no growth.', developing: 'Child checks plant daily and accepts "not yet" with occasional reminders.', proficient: 'Child waits with equanimity across multiple days, tracks growth observations, and connects patience to outcomes.', advanced: 'Child predicts growth timelines, explains the plant\'s growth needs, and teaches peers about waiting as an investment.' },
  teacherNotes: ['{child} said "It needs more time — like me when I am growing" while checking the plant today — extraordinary developmental analogy.'],
  parentReport: { example: 'We planted a seed today and began our patience practice! Watching a plant grow is one of the most concrete ways to teach delayed gratification — a skill strongly associated with life success. Your child will be checking this plant every day and practicing patience with every visit.', homeExtension: 'Plant a fast-growing seed at home (radishes, beans, or grass) in a small cup with your child. Check it every morning together. When the first sprout appears, celebrate the wait that made it possible!' },
  variations: { smallGroup: 'Each child plants their own seed and tracks their own plant\'s growth.', wholeClass: 'Class garden where different children take turns as the daily "plant caretaker."', outdoor: 'Outdoor garden bed — most authentic real-world plant patience experience.', indoor: 'Windowsill garden with good light access.', lowResource: 'Bean seed in a wet paper towel in a clear zip-lock bag taped to the window — free, visible, fast-growing.' },
  classroomMgmt: { transitions: 'Plant check-in becomes a daily transition ritual: "Before morning circle, let\'s check our plant!"', disruptions: 'If children overwater or mishandle the plant, use it as a teaching moment about balance and care.', participation: 'All children participate in daily plant check-ins.', diverseLearners: 'For children who struggle with waiting, use a visual growth chart to make the "invisible growth" more concrete and trackable.' },
  materials: { required: ['Seeds','Small cups or pots','Soil','Water'], optional: ['Magnifying glass for daily observation','Growth tracking chart'], printable: ['Plant growth observation journal page'], digital: [] }
};

COACHING_DATA['tch3'] = {
  intro: 'Let\'s end our day with gratitude! What are you thankful for today? I will share mine first!',
  tips: ['Always share your OWN genuine gratitude first — modeling authenticity is the most powerful teaching', 'Accept ANY response as a valid gratitude: "I am thankful for my goldfish" is just as valid as "my family"', 'Avoid evaluating responses — never say "that is small" or push for a "bigger" answer'],
  prompts: ['I will start: I am thankful for our amazing class today. Now who wants to share?', '[Child shares] Tell us more — WHY are you grateful for that?', 'When we think about things we are thankful for, our brain actually feels happier. That is science!'],
  close: 'Every one of you named something you are grateful for today. Gratitude is like a muscle — the more we practice, the stronger it gets, and the happier we feel.',
  questions: { beginner: ['What are you thankful for today?','How does it feel to think about that?'], intermediate: ['Why are you grateful for that?','Who are you most thankful for?'], advanced: ['What is something small you are grateful for that you never noticed before?','Can gratitude change how a hard day feels?'], openEnded: ['If gratitude were a color, what color would it be?','What would life be like without the thing you are most grateful for?'] },
  responses: { typical: 'Children share concrete, personal gratitude ("my dog," "lunch," "my mom").', strong: 'Children share and explain their gratitude, connecting it to specific memories or feelings.', shy: 'Children may pass or whisper their gratitude to the teacher privately.', limitedLanguage: 'Children show their gratitude through expression, gesture, or showing something meaningful to them.' },
  shySupport: { prompts: ['You can just think it in your heart — you do not have to say it out loud.','Would you like to whisper it to me instead?'], alternatives: ['Accept a drawn or gestured gratitude response', 'Allow child to share during a private moment rather than the group circle'], encouragement: ['Thank you for sharing that beautiful thought!','Your gratitude just made our whole circle warmer!'] },
  observation: ['Are children\'s gratitude statements becoming more specific over time (from "stuff" to specific people or experiences)?','Do children show increased positive affect after the gratitude practice?','Are children spontaneously expressing gratitude outside the circle?','Are children\'s gratitudes reflecting growing awareness of others\' contributions to their lives?'],
  rubric: { beginning: 'Child cannot name anything they are grateful for; passes or gives random response.', developing: 'Child names one concrete thing they are grateful for with prompting.', proficient: 'Child readily names multiple gratitudes with specific explanations and shows genuine positive affect.', advanced: 'Child identifies nuanced, non-material gratitudes; connects gratitude to happiness; spontaneously expresses gratitude throughout the day.' },
  teacherNotes: ['{child} said "I am thankful for our class because we help each other" today — showing gratitude for community rather than only personal possessions.'],
  parentReport: { example: 'We practiced our Gratitude Circle today — ending the day by each sharing what we are thankful for. Research consistently shows that a regular gratitude practice increases happiness, resilience, and positive relationships in both children and adults. Your child participated beautifully and shared something genuinely meaningful.', homeExtension: 'Start a family gratitude practice at dinner tonight: each person shares one thing they are grateful for. Within 2-3 weeks, children begin spontaneously expressing gratitude during the day — the habit takes root quickly.' },
  variations: { smallGroup: 'Intimate small-group gratitude sharing where deeper conversation is possible.', wholeClass: 'End-of-day class gratitude circle — daily closing ritual.', outdoor: 'Gratitude for nature: "What in our outdoor space are you grateful for today?"', indoor: 'Daily closing circle ritual.', lowResource: 'No materials needed — only open hearts and genuine presence.' },
  classroomMgmt: { transitions: 'Gratitude circle is the transition OUT of school into home — perfect closing ritual.', disruptions: 'If a child gives a silly gratitude, accept it graciously: "I am grateful for that too!" — silliness often hides discomfort that genuine modeling will eventually reach.', participation: 'Never force gratitude sharing; offer the choice and accept silence as also valid.', diverseLearners: 'Gratitude practices can be adapted to any ability level — even the most non-verbal child can gesture toward something they appreciate.' },
  materials: { required: ['No materials needed — only time and authentic presence'], optional: ['Gratitude journal for drawing','Gratitude jar for written entries'], printable: ['Gratitude prompts list for teachers'], digital: ['Greater Good Science Center: gratitude for kids resources'] }
};

})(); // end loadToddlerCoaching5

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 12 — COACHING DATA: PRESCHOOL
   ───────────────────────────────────────────────────────────────────────────── */
(function loadPreschoolCoaching() {

COACHING_DATA['pl1'] = {
  intro: 'Today we are going to read this book in a really special way — we are going to THINK about it together while we read!',
  tips: ['Read the book through once for pure enjoyment before the "deep dive" re-read', 'Stop at key story moments and genuinely wait for children\'s thinking — 7-10 seconds of silence is OK', 'Follow children\'s lines of thinking even when they diverge from your plan — genuine thinking is the goal'],
  prompts: ['[Pause before page turn] What do you PREDICT is going to happen? Think carefully before you answer.', '[After emotional scene] How does this character feel? What in the picture tells you that?', 'You said something very smart. Can you tell us more? Why do you think that?'],
  close: 'The best readers do not just read the words — they THINK about the story, ask questions, and connect it to their own lives. You did all three of those things today!',
  questions: { beginner: ['What do you think will happen?','How does the character feel?'], intermediate: ['Why did the character make that choice?','Has this ever happened to you?'], advanced: ['What is the author trying to teach us?','What would have happened if the character chose differently?'], openEnded: ['What question does this story leave you with?','What would YOU do differently if you were in this story?'] },
  responses: { typical: 'Children predict story events, identify basic character emotions, and make literal text connections.', strong: 'Children make inferential connections, question author motivations, and relate story themes to their own moral understanding.', shy: 'Children whisper responses or only respond when called on — invite private thinking before group sharing.', limitedLanguage: 'Children communicate through pointing to illustrations, facial expressions mirroring characters, and single-word responses that teacher expands.' },
  shySupport: { prompts: ['Think about it first — you can share when you are ready.','Turn to your neighbor and tell them your prediction!'], alternatives: ['Use think-pair-share before whole-group discussion to give shy children a safe first audience', 'Accept pointing to the illustration as a complete comprehension response'], encouragement: ['That prediction was exactly right!','Your thinking is so deep — I love how you question everything!'] },
  observation: ['Are children making predictions based on evidence (picture, prior knowledge) vs. random guessing?','Are children identifying multiple character emotions in a single moment?','Are children making text-to-self connections unprompted?','Is vocabulary expanding through context discussion?'],
  rubric: { beginning: 'Child does not engage with comprehension questions; shows attention only to pictures.', developing: 'Child answers literal questions and makes basic predictions.', proficient: 'Child makes evidence-based predictions, identifies character motivation, and makes personal connections.', advanced: 'Child evaluates author choices, identifies themes, makes intertextual connections, and asks their own analytical questions.' },
  teacherNotes: ['{child} asked "Why did the author not show us what the monster looked like?" during Read-Aloud Deep Dive today — extraordinary authorial awareness.', 'During discussion, {child} connected the book\'s theme of courage to "when I started at this school" — powerful personal text connection.'],
  parentReport: { example: 'We did a Read-Aloud Deep Dive today — reading a book with deep discussion, prediction, and personal connection. This builds critical thinking, vocabulary, comprehension, and the love of reading that is the foundation of all literacy success. Your child engaged with remarkable depth today!', homeExtension: 'At bedtime reading, try these three prompts: "What do you predict will happen?" (before reading), "How does this character feel?" (during), and "What would you do?" (after). These three questions transform any book into a critical thinking experience.' },
  variations: { smallGroup: 'Book club format: 4-5 children with the same book, teacher facilitates deep discussion.', wholeClass: 'Shared reading with large-format book or projected text — whole-class literary discussion.', outdoor: 'Read outdoors and connect book themes to the natural environment around you.', indoor: 'Cozy reading circle on a rug with children gathered closely.', lowResource: 'Any picture book from the library works — the discussion technique is the resource, not the book.' },
  classroomMgmt: { transitions: 'Signal reading time with a consistent opening ritual: dim lights, gather on the rug.', disruptions: 'If children call out answers, introduce a "thinking hand" — raise hand when you have a thought.', participation: 'Use think-pair-share to ensure every child engages, not just the most vocal.', diverseLearners: 'For ELL children, choose books with clear, detailed illustrations that carry the story visually.' },
  materials: { required: ['Age-appropriate picture book with rich illustrations and engaging story'], optional: ['Character emotion cards','Story sequence organizer'], printable: ['Story Discussion Question cards','Reading Response template'], digital: ['Storyline Online read-alouds','Reading Rockets comprehension strategies'] }
};

COACHING_DATA['pl2'] = {
  intro: 'Our letter of the week is B! B says /b/ — like BALL, BEAR, and BUS! Let\'s hear it everywhere today!',
  tips: ['Use the sound /b/ not the letter name "bee" for the hunt — phonemic awareness is the goal', 'Connect the letter to its visual form: "B has a big belly on the bottom and a smaller belly on top!"', 'Make the hunt multi-sensory: sound it, say it, find it, write it, clap for it'],
  prompts: ['/B/ says B! Ball starts with /b/! [stretch the sound] Bbbball! Hear the /b/?', '[Object hunt] You found a BOOK! Does book start with /b/? Bbbbook! YES!', 'Now let\'s write it — here is how a B looks: tall line on the left, two bumps on the right!'],
  close: 'Today we learned that B says /b/ and you found it EVERYWHERE! Letters are hiding in every word — and now you know how to find them!',
  questions: { beginner: ['What sound does B make?','Does ball start with B?'], intermediate: ['Find something in this room that starts with /b/!','Can you hear the /b/ sound in "beach"?'], advanced: ['Are there any words that END with /b/?','Can you think of a name that starts with /b/?'], openEnded: ['Why do you think it is important to know what sound each letter makes?','What would reading be like if we did not know letter sounds?'] },
  responses: { typical: 'Children correctly identify the letter-sound connection and participate in the object hunt with enthusiasm.', strong: 'Children generate multiple words independently, identify the letter in print around the room, and begin blending with the sound.', shy: 'Children point to objects rather than naming them aloud — valid phonemic awareness demonstration.', limitedLanguage: 'Children point to objects beginning with the sound; teacher provides the word "Yes! Bucket — /b/ucket!"' },
  shySupport: { prompts: ['Can you just point to something that starts with our letter?','Whisper it to me — what did you find?'], alternatives: ['Allow child to bring teacher something that starts with the sound rather than naming it verbally', 'Use alphabet books alongside the hunt for visual confirmation'], encouragement: ['You found a /b/ word! Your ears are amazing!','You hear sounds that other people miss!'] },
  observation: ['Can children isolate the initial sound in words?','Can children generate words beginning with the target sound without visual prompts?','Are children beginning to notice the letter in environmental print?','Do children apply phonemic knowledge outside the formal lesson?'],
  rubric: { beginning: 'Child cannot isolate initial sounds; identifies objects by name but not by sound.', developing: 'Child correctly identifies target sound when teacher articulates it; beginning to hunt for the sound.', proficient: 'Child generates multiple words with the target initial sound independently and identifies the letter in print.', advanced: 'Child identifies initial, final, and medial positions of the target sound; begins reading simple CVC words with the letter.' },
  teacherNotes: ['{child} found 8 objects starting with /b/ during the hunt and read the word "ball" from the label on the shelf — strong phonics development emerging.', 'During Letter Sound Hunt, {child} noticed their own name begins with /b/ and wrote a B independently — outstanding real-world phonics connection.'],
  parentReport: { example: 'Our letter of the week is B, and we did a Letter Sound Hunt today — searching for objects that start with the /b/ sound! This phonological awareness activity is directly connected to reading readiness. Children who can hear and isolate sounds in words learn to read more easily. Your child showed excellent sound awareness today!', homeExtension: 'During car rides and walks, play "I Spy something that starts with /b/!" Phonological awareness games are powerful — and they are free, require nothing, and can be played anywhere.' },
  variations: { smallGroup: 'Small group letter book creation: each child contributes one /b/ picture.', wholeClass: 'Class-wide letter hunt where children tag found /b/ objects with sticky notes.', outdoor: 'Outdoor letter hunt: "Find 5 things outside that start with /b/!"', indoor: 'Environmental print walk: find the letter B in classroom labels, book covers, and materials.', lowResource: 'Letter sound games are free — they need only voices and attention, no materials.' },
  classroomMgmt: { transitions: 'Use the letter of the week during transitions: "Line up if your name starts with /b/!"', disruptions: 'Keep the hunt active — movement prevents distraction during phonological awareness work.', participation: 'Multiple access points: children can point, say, write, or draw the letter sound.', diverseLearners: 'For ELL children, connect to equivalent sounds in their home language — cross-linguistic phonological awareness.' },
  materials: { required: ['Letter of the week card','Objects beginning with that letter'], optional: ['Alphabet anchor chart','Letter sound manipulatives (Bingo chips for sound segmentation)'], printable: ['Letter B book template','Sound sorting cards'], digital: ['Starfall reading phonics app','PBS Kids letter sound games'] }
};

COACHING_DATA['pl3'] = {
  intro: 'Today is Show and Tell! You get to be the TEACHER for 2 minutes! Everyone is going to listen to you!',
  tips: ['Set up sentence starters on a card: "My item is... It feels... It is important to me because..."', 'Model the whole Show and Tell procedure yourself first with your own item', 'Coach the audience as much as the presenter: "Eyes on the speaker, ears ready, hands in your lap"'],
  prompts: ['Tell us your name and your item first. What did you bring?', 'Now describe it — what does it look, feel, smell, sound, or taste like? Use those details!', 'Your turn audience: who has a question for [child\'s name]? Three question rule!'],
  close: 'Everyone was a teacher and everyone was a respectful listener today. Public speaking is a skill that will open every door in your life — and you practiced it today!',
  questions: { beginner: ['What is it?','What does it feel like?'], intermediate: ['Why did you bring it today?','What makes it special to you?'], advanced: ['How long have you had it?','What would you like us to know about it?'], openEnded: ['What is the most important thing you want us to understand about your item?','What question would you ask yourself about this item?'] },
  responses: { typical: 'Children describe item with basic information; show comfort with familiar peers and teacher support.', strong: 'Children narrate detailed descriptions, field audience questions confidently, and make cultural or personal connections to their item.', shy: 'Children may hold item close, speak very quietly, or only answer direct questions — this is still a win.', limitedLanguage: 'Children show and gesture about their item; teacher provides language scaffold: "It looks like you are telling us it is soft?"' },
  shySupport: { prompts: ['Just show us your item first — you do not have to say anything yet.','Can you tell me one small thing about it and I will help share the rest?'], alternatives: ['Allow shy child to share with teacher only before trying the full group', 'Let shy child share with a partner before the whole class — partner shares on their behalf if preferred'], encouragement: ['You just spoke in front of the whole class! That is so brave!','Every time you share, speaking gets a little easier!'] },
  observation: ['Does child use descriptive language (adjectives, sensory words) during presentation?','Does child maintain eye contact with the audience?','Can child field audience questions without teacher scaffolding?','Is child\'s presentation volume audible to the whole group?'],
  rubric: { beginning: 'Child cannot present item; becomes silent or withdraws; needs full teacher support.', developing: 'Child presents item with basic information and answers one direct question with support.', proficient: 'Child presents with descriptions, fields 2-3 questions, and maintains audience engagement.', advanced: 'Child presents fluently with rich detail, uses transitional phrases, fields questions confidently, and speaks at appropriate volume to the whole group.' },
  teacherNotes: ['{child} presented their item for 90 seconds with descriptive language, eye contact, and answered 3 audience questions confidently — outstanding public speaking for preschool level.', 'During Show and Tell, {child} connected their item to a family memory and invited the class to share similar experiences — natural social facilitation.'],
  parentReport: { example: 'We had Show and Tell today — your child presented an item to the whole class! This builds public speaking skills, descriptive language, active listening, and confidence. These are foundational communication skills that matter in every area of life. Your child showed wonderful courage and communication today!', homeExtension: 'Practice "Home Show and Tell" — ask your child to teach you about something they love for 2 minutes. Listen with full attention, ask 3 questions, and applaud! This home rehearsal builds confidence for school performance.' },
  variations: { smallGroup: 'Small group Show and Tell with only 3-4 listeners — less intimidating, deeper questions possible.', wholeClass: '2-3 presenters per day so Show and Tell is a frequent, practiced ritual.', outdoor: 'Nature Show and Tell: bring one found natural object from home to describe.', indoor: 'Standard classroom circle format.', lowResource: 'No special materials — children bring items from home.' },
  classroomMgmt: { transitions: 'Show and Tell at a consistent time daily creates anticipation and routine.', disruptions: 'Teach and enforce audience behavior explicitly: "We give the speaker 100% of our eyes and ears."', participation: 'All children present on rotation — never optional, but always supported.', diverseLearners: 'For ELL children, item can connect to home culture — celebrate all cultural items equally.' },
  materials: { required: ['Children bring own items from home'], optional: ['Presentation sentence starters card','Microphone prop for confidence'], printable: ['Show and Tell sentence starters','Audience behavior reminder card'], digital: [] }
};

COACHING_DATA['pl4'] = {
  intro: 'Time for Rhyme Time! We are going to find words that SOUND alike at the END — those are rhymes!',
  tips: ['Exaggerate the rhyming ending when producing pairs: "cat... HAT! The AT part sounds the same!"', 'Use silly nonsense rhymes freely — "cat, hat, splat, frat" — nonsense rhymes show phonological flexibility', 'Clap the rime part (ending) so children feel the rhythm of what rhymes'],
  prompts: ['Cat and hat — listen to the ENDING! /at/ and /at/ — the same! They RHYME!', '[Completion] "I see a dog sitting on a ___" — what rhymes with dog? Log! Fog! Hog! Frog!', 'Make a silly rhyme with your name! My name is [teacher] — what rhymes with it?'],
  close: 'You made rhymes! Your ears can hear when words match at the end. That is a superpower for reading — rhyming ears help us read!',
  questions: { beginner: ['Do these words rhyme?','What rhymes with dog?'], intermediate: ['How many words can you rhyme with "cat"?','Is "hat" a real rhyme or a silly rhyme?'], advanced: ['Can you make a rhyming sentence?','What part of the word rhymes?'], openEnded: ['Make a silly rhyme!','What is your favorite rhyming pair and why?'] },
  responses: { typical: 'Children identify rhymes correctly when heard together and produce simple rhyming words with some prompting.', strong: 'Children spontaneously generate multiple rhymes, distinguish real from nonsense rhymes, and create original rhyming couplets.', shy: 'Children mouth rhymes or whisper them; point to correct rhyming pictures.', limitedLanguage: 'Children clap along to rhyme rhythm; point to rhyming pictures; make sound approximations of rhyming words.' },
  shySupport: { prompts: ['Whisper your rhyme — I will share it!','You can clap when you hear the rhyme!'], alternatives: ['Provide rhyming picture cards so children can point rather than produce verbally', 'Play the role of "rhyme detector" — child just signals thumbs up/down for rhyme/not a rhyme'], encouragement: ['Your ears heard that rhyme perfectly!','You know so many rhyming words!'] },
  observation: ['Can children identify rhyming pairs by sound (not meaning)?','Can children generate novel rhyming words?','Do children distinguish real from nonsense rhymes?','Are children beginning to notice rhyme in environmental text (book titles, names)?'],
  rubric: { beginning: 'Child cannot identify rhyming pairs; responds to word meaning rather than sound.', developing: 'Child identifies obvious rhyming pairs (cat/hat) when heard together.', proficient: 'Child identifies and generates rhymes, distinguishes real from nonsense rhymes, and creates 2-word rhyming pairs independently.', advanced: 'Child produces extended rhyme chains, creates original rhyming verses, and analyzes the structural rime in word families.' },
  teacherNotes: ['{child} generated 7 words that rhyme with "cat" independently today — excellent phonological flexibility and fluency.', 'During Rhyme Time, {child} created an original 4-line rhyming poem during free verse time — extraordinary language creativity for this age.'],
  parentReport: { example: 'We had Rhyme Time today — identifying, generating, and creating rhymes! Rhyming ability is one of the strongest early predictors of reading success because it shows children can attend to the sounds of words (phonological awareness) rather than just their meanings. Your child showed wonderful rhyming ability!', homeExtension: 'Read rhyming books together (Dr. Seuss is perfect). Pause before the rhyming word and let your child predict it. Then play "rhyme chains" in the car: "cat — hat — bat — fat — mat..." — first person stuck loses!' },
  variations: { smallGroup: 'Rhyming card matching in small groups — pair children and deal rhyming picture cards to match.', wholeClass: 'Rhyme circle: each child adds a rhyme to the chain. "Cat... hat... bat... who has the next one?"', outdoor: 'Rhyme scavenger hunt: find something that rhymes with each prompt.', indoor: 'Rhyming center with picture cards and rhyming books.', lowResource: 'No materials needed — rhyme games are pure voice activities.' },
  classroomMgmt: { transitions: 'Use a transition rhyme: "Time to put our stuff away, it\'s the end of the school day!"', disruptions: 'Silly nonsense rhymes in the classroom are ENCOURAGED during rhyme activities — celebrate them!', participation: 'Chain rhyming ensures every child gets a turn.', diverseLearners: 'For ELL children, rhyme in their home language alongside English — bilingual phonological awareness is transferable.' },
  materials: { required: ['Rhyming books or cards'], optional: ['Rhyming picture pairs','Rhyming word wall'], printable: ['Rhyming pair cards (print and cut)','Word family rhyme wheels'], digital: ['Starfall rhyming activities','PBS Kids phonics games'] }
};

COACHING_DATA['pc1'] = {
  intro: 'Today we are going to make PATTERNS — repeating things in order. Watch: red, blue, red, blue — what comes next?',
  tips: ['Always start with AB patterns (two elements) before moving to ABC or AABB', 'Use physical objects first (blocks) before abstract pictures or symbols', 'Have children PREDICT the next element rather than telling them — prediction is the cognitive work'],
  prompts: ['Red, blue, red, blue — what comes NEXT? Don\'t tell me yet — think first!', 'You found the pattern! Now copy it with YOUR blocks. Make the SAME pattern.', 'Now make YOUR OWN pattern! Any pattern you can think of — then I will try to figure it out!'],
  close: 'Patterns are EVERYWHERE — in music, in math, in nature, in art. Now that your brain can see them, you will start noticing them everywhere!',
  questions: { beginner: ['What comes next?','Can you see the pattern?'], intermediate: ['How do you know what comes next?','What is the rule of this pattern?'], advanced: ['Can you make an ABC pattern with three colors?','How is your pattern different from mine?'], openEnded: ['Where else have you seen patterns today?','What is the most interesting pattern you can imagine?'] },
  responses: { typical: 'Children copy AB patterns accurately and begin to extend them with teacher guidance.', strong: 'Children extend patterns, create original patterns, and identify the rule underlying a pattern.', shy: 'Children work quietly and precisely with physical materials; excellent pattern accuracy.', limitedLanguage: 'Children communicate through physical pattern creation — arranging blocks/cards in correct sequence.' },
  shySupport: { prompts: ['Show me the next one — which block comes next?','You can use your finger to point to what comes next.'], alternatives: ['Allow individual pattern work at their own pace without group observation', 'Use child\'s favorite colors or objects to increase motivation for pattern creation'], encouragement: ['You found the pattern!','You made that pattern all by yourself — I have to figure it out!'] },
  observation: ['Can child extend an existing AB pattern?','Can child create an original AB pattern?','Is child progressing to ABC or AABB patterns?','Can child identify the rule of a pattern verbally ("It goes red, blue, red, blue")?'],
  rubric: { beginning: 'Child cannot replicate even a simple AB pattern; places materials randomly.', developing: 'Child replicates and extends AB patterns with visual model present.', proficient: 'Child extends and creates AB patterns independently; beginning to create ABC patterns.', advanced: 'Child creates complex original patterns (AABB, ABC, ABBC), identifies pattern rules, and finds patterns in the natural environment.' },
  teacherNotes: ['{child} created a three-element ABC pattern with red, blue, and yellow blocks independently today and explained the rule correctly.', 'During Pattern Making, {child} noticed the brick wall pattern in the classroom photo and said "that is an AB pattern!" — real-world transfer.'],
  parentReport: { example: 'We explored Pattern Making today — a foundational mathematical skill! Recognizing, extending, and creating patterns develops the algebraic thinking that underlies all higher mathematics. Your child showed wonderful mathematical thinking today!', homeExtension: 'Pattern hunt at home: arrange breakfast foods in a pattern (cereal, fruit, cereal, fruit), then have your child continue it. Or find patterns on clothing, tiles, and nature. Pattern awareness transforms everywhere!' },
  variations: { smallGroup: 'Pattern detective: one child creates a pattern, others must figure out the rule.', wholeClass: 'Human pattern line: children line up in color-of-shirt patterns.', outdoor: 'Nature patterns: leaf, rock, leaf, rock — extend the pattern with found objects.', indoor: 'Pattern center with manipulatives during learning stations.', lowResource: 'Use crayons or markers in color patterns — free and always available.' },
  classroomMgmt: { transitions: 'Use a body pattern as a transition: clap, stomp, clap, stomp — children follow and the rhythm moves them into the next activity.', disruptions: 'If children destroy each other\'s patterns, ensure sufficient materials for each child to have their own set.', participation: 'Patterns at multiple levels ensure all children can access — from AB to complex ABC patterns.', diverseLearners: 'Use tactile materials (textured tiles, sensory beads) for children who benefit from touch-based patterns.' },
  materials: { required: ['Colored blocks or pattern tiles','Pattern cards for reference'], optional: ['Bead stringing sets','Nature objects for patterns','Pattern worksheets'], printable: ['Pattern extension worksheets','Pattern rule recording sheet'], digital: ['Peg+Cat pattern games','Khan Academy Kids early math'] }
};

COACHING_DATA['pc2'] = {
  intro: 'We are scientists today! Scientists look very carefully at things and ask questions. Ready to investigate?',
  tips: ['Ask "What do you NOTICE?" before "What do you SEE?" — notice is a deeper word that invites more careful observation', 'Resist answering children\'s questions — redirect with "What do YOU think? How could we find out?"', 'Document observations in a class science journal — writing scientific thinking validates and extends it'],
  prompts: ['Use your magnifying glass and look VERY carefully. What do you notice about this leaf?', '[Child makes observation] Excellent! You noticed the veins in the leaf. Why do you think the leaf has veins?', 'That is a scientific question! How could we find the answer? Let\'s investigate!'],
  close: 'Scientists are people who look carefully and ask questions. Today, all of you were real scientists. Your questions and observations matter.',
  questions: { beginner: ['What do you see?','Why do you think that happens?'], intermediate: ['What do you notice that is surprising?','How is this leaf different from that one?'], advanced: ['What would happen if...?','What pattern do you see across all the leaves?'], openEnded: ['What question does this make you want to ask?','What would a scientist do next?'] },
  responses: { typical: 'Children describe observable features and begin to ask why/what if questions with teacher scaffolding.', strong: 'Children make comparative observations, generate testable hypotheses, and record observations in drawing/writing.', shy: 'Children observe quietly with great intensity; often the most careful observers in the group.', limitedLanguage: 'Children communicate through drawing observations, pointing to features, and using science tools (magnifying glass) with clear interest.' },
  shySupport: { prompts: ['What do you see through the magnifying glass? Just tell me one thing.','You can draw what you see instead of saying it.'], alternatives: ['Pair shy child with a science "lab partner" for shared investigation', 'Use a science journal for recording observations privately before sharing with the group'], encouragement: ['You noticed something no one else saw!','That is an amazing scientific observation!'] },
  observation: ['Are children using scientific vocabulary (observe, predict, notice, wonder, investigate)?','Are children generating their own questions based on observations?','Do children show persistence in investigation beyond surface-level observation?','Are children making comparative observations (this one vs. that one)?'],
  rubric: { beginning: 'Child names obvious features of natural objects but does not go beyond surface description.', developing: 'Child makes careful observations and asks basic why questions.', proficient: 'Child makes detailed observations, generates testable questions, and compares multiple specimens.', advanced: 'Child designs mini-investigations, records data in a science journal, and forms and tests hypotheses systematically.' },
  teacherNotes: ['{child} asked "Why do some leaves have smooth edges and some have jagged edges?" during nature exploration — a genuinely scientific question that led to a 10-minute investigation.', 'During Nature Science Exploration, {child} noticed that all three seeds were shaped differently and predicted "maybe they grow into different plants" — excellent hypothesis formation.'],
  parentReport: { example: 'We did Nature Science Exploration today — examining leaves, rocks, and seeds with magnifying glasses and recording observations! This builds scientific thinking: careful observation, questioning, and investigation. Your child showed wonderful scientific curiosity and asked genuinely good questions today!', homeExtension: 'Give your child a magnifying glass and a small patch of your yard or a potted plant to investigate. Ask "What do you notice? What do you wonder?" Write down their questions — then look up the answers together!' },
  variations: { smallGroup: 'Science investigation station: 2-3 children share materials and compare observations.', wholeClass: 'Class science journal: all children contribute one observation each.', outdoor: 'Full outdoor nature investigation on school grounds.', indoor: 'Bring nature inside: leaves, rocks, seeds, flowers in small bowls for indoor investigation.', lowResource: 'Paper, crayons, and a window are enough for basic nature observation. Magnifying glasses cost $1-3 each.' },
  classroomMgmt: { transitions: 'Science centers are natural exploratory transitions between structured activities.', disruptions: 'Redirect rough handling: "Scientists handle specimens gently to preserve them for study."', participation: 'Science exploration is broadly appealing. Ensure all children have their own specimen.', diverseLearners: 'Provide a variety of specimen types so children with different sensory preferences can find their entry point.' },
  materials: { required: ['Magnifying glasses','Natural objects: leaves, rocks, seeds'], optional: ['Science journals','Tweezers','Sorting trays','Camera for documentation'], printable: ['Science observation recording sheet','My Investigation journal page'], digital: ['National Geographic Kids science videos','Smithsonian learning lab collections'] }
};

COACHING_DATA['pc3'] = {
  intro: 'Number sense time! We are going to count, compare, and really UNDERSTAND numbers today — not just say them!',
  tips: ['Emphasis: counting while TOUCHING each object — one-to-one correspondence is the critical skill', '"How many?" question should always be answered with a count, then the number name, then a comparison', 'Use 10-frames consistently — they build the conceptual understanding of quantity to 10 and beyond'],
  prompts: ['Touch each one as you count. Touch and COUNT. How many altogether?', '[After counting] So there are 7! Seven bears! Now — are there MORE bears or MORE fish? How do you KNOW?', 'How do you know which group has more WITHOUT counting? Just look — what do your eyes tell you?'],
  close: 'Numbers are not just words — they mean something real. 7 means this many [show]. 7 is MORE than 6 and LESS than 8. Now you know what numbers really mean.',
  questions: { beginner: ['How many?','Which group has more?'], intermediate: ['How do you know there are more?','Count backwards from 10!'], advanced: ['Can you count by 2s?','How much more is 8 than 6?'], openEnded: ['If I added 2 more, how many would there be?','When do we need to count things in real life?'] },
  responses: { typical: 'Children count objects with one-to-one correspondence; accurately identify which group has more when difference is clear.', strong: 'Children count fluently to 20+, compare sets with one more/one less, and begin to subitize small quantities (see quantity without counting).', shy: 'Children count quietly and accurately; may be reluctant to share answers aloud.', limitedLanguage: 'Children demonstrate counting through touch and gesture; show comparison understanding by pointing to "more."' },
  shySupport: { prompts: ['Can you count them for me quietly?','Show me with your fingers how many.'], alternatives: ['Allow private counting before group sharing', 'Use counting to help shy child transition: "Count to 5 with me while we walk to the next activity!"'], encouragement: ['You counted every single one!','Your counting is so accurate!'] },
  observation: ['Does child maintain one-to-one correspondence through counting collections of 10+?','Does child give a cardinal count (says the last number is "how many")?','Does child subitize quantities to 5 without counting?','Does child understand that the quantity stays the same regardless of arrangement (conservation of number)?'],
  rubric: { beginning: 'Child counts by rote but without one-to-one correspondence; cannot tell which group has more.', developing: 'Child counts with one-to-one correspondence to 10; identifies more/less for clear differences.', proficient: 'Child counts to 20+ with accuracy, compares sets, and begins to subitize small quantities.', advanced: 'Child counts forward and backward, compares sets using one-more/one-less relationships, subitizes to 6, and begins addition reasoning.' },
  teacherNotes: ['{child} subitized a set of 5 bears immediately without counting today — demonstrating developing quantity recognition beyond one-to-one counting.', 'During Number Sense, {child} independently arranged two groups to compare "one more" — showing deep cardinality understanding.'],
  parentReport: { example: 'We worked on Number Sense today — not just counting, but deeply understanding what numbers mean. We touched and counted, compared sets, and used 10-frames. This deep number sense is the foundation of all mathematical thinking. Your child showed excellent mathematical reasoning today!', homeExtension: 'Count real things at home — grapes on the plate, steps to the door, socks in the drawer. After counting, ask "are there MORE socks or MORE grapes?" This comparison deepens number sense more than any worksheet.' },
  variations: { smallGroup: 'Counting collections: each small group gets a bag of objects and counts, records, and compares.', wholeClass: 'Number sense circle: daily counting routine including subitizing warm-up.', outdoor: 'Count and compare objects found outside: leaves, rocks, sticks.', indoor: 'Math manipulative center with 10-frames and counting collections.', lowResource: 'Buttons, dried beans, or pasta pieces — any small objects for counting collections.' },
  classroomMgmt: { transitions: 'Use counting during every transition: "Count how many steps it takes to get to the bathroom!"', disruptions: 'If children scatter counting objects, use containers with lids.', participation: 'Individual counting collections ensure every child has their own materials.', diverseLearners: 'For children with fine motor challenges, use larger objects and non-slip mats. For advanced counters, provide larger collections and addition tasks.' },
  materials: { required: ['Counting manipulatives (bears, cubes, buttons)','10-frame mats'], optional: ['Dice','Number cards','Sorting containers'], printable: ['10-frame recording sheets','Number comparison worksheets'], digital: ['Khan Academy Kids math app','Peg+Cat counting games'] }
};

COACHING_DATA['pc4'] = {
  intro: 'Memory challenge! I am going to build something with blocks — you will see it for 5 seconds — then build it from memory!',
  tips: ['Start with 2-3 blocks only — add complexity only when children consistently succeed at the current level', 'After revealing the hidden structure, ask children to visualize before rebuilding: "Close your eyes and see it in your mind first"', 'The PROCESS of rebuilding (spatial thinking, self-correction) is more valuable than perfect accuracy'],
  prompts: ['Watch carefully — look at EVERY part. [show 5 seconds] Ready? I am hiding it now. Build it from your memory!', '[Child rebuilds] Now let\'s compare! [reveal original] Was your memory right? What is different?', '[Self-correction] You noticed the difference yourself! That is what good thinkers do — they check their own work!'],
  close: 'Your memory just held a picture in your mind and used it to build something real. That is working memory — one of the most important brain skills there is.',
  questions: { beginner: ['What did you see?','How many blocks were there?'], intermediate: ['What color was on top?','Can you close your eyes and describe it to me?'], advanced: ['What strategies help you remember better?','How is your version different from the original?'], openEnded: ['What does it feel like to hold a picture in your memory?','When else do you use this memory skill in real life?'] },
  responses: { typical: 'Children rebuild with 2-3 blocks accurately; lose accuracy with 4+ blocks initially.', strong: 'Children recall 4-5 block structures accurately, using strategic looking behavior (systematic scanning rather than random glancing).', shy: 'Children rebuild carefully and privately; dislike being compared or evaluated.', limitedLanguage: 'Children communicate through rebuilding action; gesture toward the hidden model when comparing.' },
  shySupport: { prompts: ['Close your eyes first and see it in your mind before you build.','It is okay if it is not exactly right — the trying is what matters!'], alternatives: ['Allow private comparison rather than public review of accuracy', 'Begin with children describing verbally what they saw before rebuilding'], encouragement: ['Your memory is incredible!','You remembered every single detail!'] },
  observation: ['What complexity level (number of blocks) can each child recall accurately?','Do children use strategic looking behavior?','Do children self-monitor and correct during rebuilding?','Does working memory capacity increase with practice over weeks?'],
  rubric: { beginning: 'Child cannot accurately recall even a 2-block structure.', developing: 'Child accurately recalls 2-3 block structures with one viewing.', proficient: 'Child accurately recalls 4-5 block structures and begins using strategic looking strategies.', advanced: 'Child recalls 6+ block structures, describes them verbally before building, and self-corrects comparison errors independently.' },
  teacherNotes: ['{child} accurately reconstructed a 6-block structure today — extraordinary working memory capacity for preschool age.', 'During Memory Challenge, {child} said "I am going to look at the colors first, then the shape" — impressive self-regulated memory strategy.'],
  parentReport: { example: 'We did a Memory Challenge today — building structures from memory after a brief viewing! This builds working memory — the brain\'s ability to hold and use information in the moment. Working memory is one of the strongest predictors of academic success. Your child showed impressive memory capacity today!', homeExtension: 'Play "What changed?" at home: arrange 5 small objects on a table, child closes eyes, you remove one, child opens eyes and identifies what is missing. This simple game powerfully builds working memory.' },
  variations: { smallGroup: 'Partners: one builds the structure, the other memorizes and rebuilds — collaborative working memory.', wholeClass: 'Class challenge: teacher shows a complex arrangement, all children rebuild simultaneously.', outdoor: 'Outdoor arrangement memory: arrange 5 natural objects, have children recreate from memory.', indoor: 'Working memory center as part of cognitive skills rotation.', lowResource: 'Any 4-6 identical household objects arranged in a pattern work perfectly.' },
  classroomMgmt: { transitions: 'Brief memory games work as mental engagement during otherwise passive transition moments.', disruptions: 'If children look while hiding, add a privacy screen or use a cloth to cover the model.', participation: 'Tiered challenge: some children do 2-3 blocks while others do 5-6 — all experience appropriate challenge.', diverseLearners: 'For children with working memory challenges, reduce complexity and increase exposure time gradually.' },
  materials: { require: ['Colored blocks (4-8 per child)','Tray to build on'], optional: ['Visual screen/divider','Timer for viewing duration'], printable: ['Working Memory progression tracker'], digital: [] }
};

})(); // end loadPreschoolCoaching Part 1

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 13 — COACHING DATA: PRESCHOOL SOCIAL, PHYSICAL, CREATIVITY,
                LIFE SKILLS, HEALTH & CHARACTER
   ───────────────────────────────────────────────────────────────────────────── */
(function loadPreschoolCoaching2() {

/* ── PRESCHOOL SOCIAL ── */
COACHING_DATA['ps1'] = {
  intro: 'Today we are learning something really important — what to do when we have a disagreement with a friend. Let me show you our Peace Corner.',
  tips: ['Introduce the Peace Corner before any conflict occurs — familiarity is essential','Practice the process when children are calm, not mid-conflict','Use a calm, low voice in the Peace Corner — it signals emotional regulation through modeling'],
  prompts: ['Let\'s try the Peace Corner! Tell me: how do YOU feel right now using our feelings chart.','Now it is ___\'s turn to share without interrupting. We listen even when it is hard.','What is ONE thing you both agree you want to happen? Let\'s find that common ground.'],
  close: 'You just solved a real problem together using words — that is one of the most important skills any person can learn. I am so proud of how you both worked through that.',
  questions: { beginner: ['How do you feel right now?','What do you need?'], intermediate: ['What happened that made you feel that way?','What does your friend need?'], advanced: ['What solution would be fair for both of you?','How could you have handled this differently from the start?'], openEnded: ['What does it feel like to solve a problem with words instead of getting upset?','When is it hardest for you to stay calm during a disagreement?'] },
  responses: { typical: 'Children need significant teacher scaffolding; begin identifying feelings with chart support.', strong: 'Children articulate both their own feelings and make guesses about the peer\'s perspective.', shy: 'Children participate minimally verbally but comply with the process structure.', limitedLanguage: 'Children point to feelings chart and gesture toward preferred outcomes.' },
  shySupport: { prompts: ['You can just point to how you feel on the chart — that is enough.','I will say the words for you if you show me on the chart.'], alternatives: ['Allow writing or drawing the conflict before verbal sharing','Practice conflict resolution with puppets in private before group use'], encouragement: ['You stayed so calm in there — that is incredibly mature.','Solving problems is hard work and you did it!'] },
  observation: ['Can children identify their own emotions using the feelings chart?','Do children wait their turn to speak without interrupting?','Do children show any empathy for the other child\'s perspective?','Does the resolution hold after leaving the Peace Corner?'],
  rubric: { beginning: 'Child cannot articulate feelings or engage in the structured process without significant adult direction.', developing: 'Child identifies own feelings and listens to the process with adult scaffolding throughout.', proficient: 'Child uses the Peace Corner process with minimal prompting; generates at least one solution.', advanced: 'Child initiates the Peace Corner independently, demonstrates genuine empathy for peer, and generates mutually acceptable solutions.' },
  teacherNotes: ['{child} successfully used the Peace Corner independently today, identifying feelings and proposing a solution without adult prompting — a significant milestone.', 'During conflict resolution practice, {child} surprised us by asking "How do you feel?" to their peer before speaking — showing genuine perspective-taking.'],
  parentReport: { example: 'Today we practiced using our Peace Corner — a structured space where children work through disagreements using feelings identification and collaborative problem-solving. Your child participated meaningfully and is developing the language of emotions that makes real conflict resolution possible. These skills take time, but every practice session builds the social-emotional brain pathways that will serve them throughout life.', homeExtension: 'At home, when a conflict arises, try the simple sequence: "Tell me how you feel. Now listen to how they feel. What can you both agree on?" This models the same structure in a familiar environment.' },
  variations: { smallGroup: 'Role-play a conflict scenario with 3 children as an audience — build shared understanding of the process.', wholeClass: 'Class discussions about peace, fairness, and conflict resolution using book characters who face similar situations.', outdoor: 'Practice calming strategies (deep breathing, walking) outdoors as part of the Peace Corner emotional toolkit.', indoor: 'Designate a permanent, cozy Peace Corner in the classroom with calming tools always accessible.', lowResource: 'A simple feelings chart and two chairs facing each other are all that is needed.' },
  classroomMgmt: { transitions: 'When a conflict arises, calmly say "Peace Corner" and walk there yourself — children follow the body language.', disruptions: 'Never send children to the Peace Corner as a punishment — it must remain a safe, voluntary space.', participation: 'Model the process yourself with a co-teacher periodically so children see adults using these skills too.', diverseLearners: 'For children with limited verbal language, use picture boards showing the conflict resolution steps.' },
  materials: { required: ['Peace Corner with feelings chart','Calm-down jar or sensory tools','Two chairs facing each other'], optional: ['Peace wand (only speaker holds it)','Breathing visual cards','Conflict resolution step poster'], printable: ['Feelings chart — preschool version','Peace Corner process steps card'], digital: ['Sesame Street — Conflict resolution videos','Daniel Tiger conflict episodes'] }
};

COACHING_DATA['ps2'] = {
  intro: 'Today your team has one important job: build something together. The secret? You have to agree on every decision before you build it.',
  tips: ['Assign the challenge clearly in writing on the board — ambiguity creates conflict, not creativity','Float between groups and ask process questions, not solution questions: "How are you deciding?" not "Try stacking those"','Let groups struggle productively for 5+ minutes before offering any support'],
  prompts: ['Before you start building, take 2 minutes to PLAN. What will you build? Who does what?', 'I see your team has different ideas. What is one way you could combine both ideas into something even better?', 'Your team just made a decision together — I saw you negotiate. That is real leadership.'],
  close: 'What you just did — plan, disagree, work through it, and build something together — that is exactly what teams do in the real world. You are already learning teamwork that adults sometimes struggle with.',
  questions: { beginner: ['What is your team building?','What is your job in the team?'], intermediate: ['How did you decide what to build?','What happened when you disagreed?'], advanced: ['What would you do differently next time?','What did your teammate do that helped the team succeed?'], openEnded: ['What makes a team strong versus weak?','What is the hardest part of working with others? Why?'] },
  responses: { typical: 'Groups require adult facilitation to navigate disagreements; final structures show combined ideas.', strong: 'Groups self-organize roles, negotiate disagreements independently, and produce complex structures with explanations.', shy: 'Shy children contribute ideas quietly to trusted partners; may have strong unexpressed ideas worth drawing out.', limitedLanguage: 'Children communicate through gesture, building action, and showing — all valid collaboration modes.' },
  shySupport: { prompts: ['What do YOU think should go here? Your idea counts!','Tell your team your idea — I think they would really like it.'], alternatives: ['Give shy child a specific role (materials manager) that involves building contribution without verbal leadership', 'Pair shy child with a patient, inclusive peer'], encouragement: ['That idea made the whole project better!','Your team needed your thinking right there!'] },
  observation: ['Do children assign roles or naturally take different functions?','How do groups handle disagreement — compromise, vote, or one person dominating?','Does every child contribute to the build, or are some passive?','How do children explain their structure to the class?'],
  rubric: { beginning: 'Child cannot participate in group without constant adult mediation; shows no collaborative behavior.', developing: 'Child contributes physically to the build; requires adult support to navigate disagreements.', proficient: 'Child negotiates roles, shares materials, and contributes ideas while listening to peers.', advanced: 'Child actively facilitates group process, encourages quieter peers, and leads the presentation with credit to all team members.' },
  teacherNotes: ['{child} stepped back during disagreement to let a quieter peer\'s idea be heard — extraordinary social-emotional maturity for preschool.', 'During Cooperative Building, {child} said "Let\'s try both ideas and see which one works" — a sophisticated conflict resolution strategy.'],
  parentReport: { example: 'Today your child worked in a small team to design and build a structure together. This required negotiating, compromising, listening, and sharing — skills that are harder than they sound! Your child showed real maturity in working through disagreements and contributed meaningfully to the team\'s creation. These collaborative skills are among the most important we build at this age.', homeExtension: 'Try a family building challenge at home: give everyone the same set of blocks and challenge the family to build one thing together. Notice how you negotiate — you are modeling collaboration for your child in real time.' },
  variations: { smallGroup: 'Pairs or triads — smaller groups allow more individual voice and reduce social complexity.', wholeClass: 'Class architecture challenge: every child contributes one block to a giant class structure.', outdoor: 'Build using natural materials: sticks, rocks, leaves — no resource constraints, endless creativity.', indoor: 'Any construction material works: LEGO, magna-tiles, cardboard boxes, unit blocks.', lowResource: 'Recyclable materials: cardboard, toilet rolls, newspaper — free and highly creative.' },
  classroomMgmt: { transitions: 'Allow extra cleanup time — building projects require care in dismantling.', disruptions: 'If one child dominates, gently give other children specific roles that restore contribution.', participation: 'Take photos during the process and show groups what collaboration looked like — visual feedback is powerful.', diverseLearners: 'Ensure physically accessible building materials for children with fine motor challenges. Verbal contributors are equally valued.' },
  materials: { required: ['Blocks or construction materials','Written challenge card displayed visibly'], optional: ['Timer visible to children','Planning paper and crayons','Camera to document process'], printable: ['Team planning worksheet','Cooperative building challenge cards'], digital: ['PBS Design Squad — engineering challenges for kids'] }
};

COACHING_DATA['ps3'] = {
  intro: 'I want to introduce you to someone who needs our help today. [Hold up puppet] This is Finn the Puppy. And Finn is feeling something very strong right now...',
  tips: ['Use a distinct, consistent voice for the puppet — children must believe in the character to engage emotionally','Pause after presenting the puppet\'s situation and genuinely wait for children\'s emotional responses','Never resolve the puppet\'s problem too quickly — sustained empathic engagement is the learning, not the solution'],
  prompts: ['Finn\'s tail is down and he is very quiet. What do you think he might be feeling right now?', 'Finn just heard what you said. How do you think that made him feel? What do you see in his face?', 'If you could sit next to Finn right now and say ONE thing, what would it be? Really think about it.'],
  close: 'Today you thought about how someone else feels — that is called empathy. Empathy is what makes friendships real, and you all showed so much of it for Finn today.',
  questions: { beginner: ['How does the puppy feel?','What would you do?'], intermediate: ['Why does the puppy feel that way?','What would you want someone to do for you if you felt like that?'], advanced: ['What is the difference between feeling sorry for someone and actually helping them?','Have you ever felt the way Finn feels?'], openEnded: ['What does it feel like inside when you help someone who is sad?','How do you think the world would be different if everyone showed empathy?'] },
  responses: { typical: 'Children identify clear emotions in the puppet and offer concrete comforting actions.', strong: 'Children connect the puppet\'s experience to their own feelings and generate nuanced emotional support strategies.', shy: 'Children show empathy through facial expression and proximity to the puppet rather than verbal expression.', limitedLanguage: 'Children gesture toward the puppet, pat it gently, or demonstrate comfort actions.' },
  shySupport: { prompts: ['You can just show Finn how you feel by your face.','You can pat Finn on the head if you want to show you care.'], alternatives: ['Let shy child hold the puppet while others speak — physical closeness facilitates emotional connection', 'Draw a picture of what you would do to help Finn instead of speaking aloud'], encouragement: ['Finn saw your face and knew you cared!','You just showed real kindness — that is empathy!'] },
  observation: ['Do children accurately identify the puppet\'s emotional state from contextual cues?','Do children make connection between puppet\'s experience and their own experiences?','What helping strategies do children suggest — are they realistic and caring?','Do children show physical empathy responses (reaching, soft voice, gentle touch)?'],
  rubric: { beginning: 'Child cannot identify the puppet\'s emotion or shows no empathic response to the scenario.', developing: 'Child identifies the basic emotion and offers one comforting strategy with prompting.', proficient: 'Child identifies emotion accurately, connects to personal experience, and generates multiple caring responses.', advanced: 'Child shows sophisticated perspective-taking, advocates for the puppet\'s feelings, and transfers empathy skills to real peer situations immediately after.' },
  teacherNotes: ['{child} said "Finn feels scared because he doesn\'t have any friends and I felt like that once" — a profound connection between the puppet\'s experience and their own.', 'During Empathy Role Play, {child} spontaneously patted the puppet and said "It\'s going to be okay" — showing genuine prosocial comfort behavior.'],
  parentReport: { example: 'Today we practiced empathy using a puppet named Finn who was experiencing a difficult moment. Your child showed beautiful emotional intelligence — identifying how Finn felt and suggesting caring ways to help. Empathy is one of the most important social skills we develop, and your child showed real capability today. These skills are built through practice and loving modeling — you are clearly doing both at home.', homeExtension: 'When your child sees someone else feeling sad or upset (in real life, books, or TV), pause and ask: "How do you think they feel? What might help them?" This 30-second conversation builds empathy more powerfully than any lesson.' },
  variations: { smallGroup: 'Each child takes a turn moving the puppet through the emotional scenario — deepening role-taking.', wholeClass: 'Group discussion of shared experiences of feeling lonely, scared, or left out — builds class empathy culture.', outdoor: 'Observe animals (birds, insects) and discuss what they might be experiencing — extends empathy to living creatures.', indoor: 'Puppet center available during free play for independent empathy role-play.', lowResource: 'A sock puppet or hand alone works — the character and the scenario matter more than the puppet quality.' },
  classroomMgmt: { transitions: 'Use the puppet to signal transitions: "Finn says it is time to clean up!"; builds buy-in and positive association.', disruptions: 'If a child is unkind to the puppet, gently model appropriate care: "Let me show you how we hold Finn."', participation: 'Children who do not speak verbally can still participate by nodding, showing facial empathy, or gently touching the puppet.', diverseLearners: 'For children with difficulty reading facial expressions, pair visual emotion cues with the puppet\'s body language for multi-modal support.' },
  materials: { required: ['Puppets or dolls','Simple prepared scenario script'], optional: ['Multiple puppets for peer role-play','Emotion cards to supplement puppet facial expressions'], printable: ['Empathy role-play scenario cards','Feelings identification chart'], digital: ['Daniel Tiger episodes about empathy and kindness'] }
};

COACHING_DATA['ps4'] = {
  intro: 'Everyone feels big feelings sometimes — feelings that feel too big to handle. Today we are going to learn our Calming Toolbox — 5 amazing tools you can use anytime.',
  tips: ['Practice all calming strategies during calm times, not crisis moments — the brain cannot learn new skills under acute stress','Keep the toolbox visual always accessible (wall chart) so children can self-reference without teacher help','Use the strategies yourself visibly and name them: "I am feeling stressed so I am doing my box breathing"'],
  prompts: ['Let\'s try our first tool — box breathing! Breathe in 4, hold 4, out 4. Ready? In... 2, 3, 4...', '[After practicing a strategy] How does your body feel right now compared to 2 minutes ago? What changed?', 'When you feel a big feeling coming, your job is to CATCH it early and choose a tool. Which tool might you use?'],
  close: 'You now have 5 powerful tools that belong to YOU — nobody can take them away. Your Calming Toolbox goes with you everywhere, forever.',
  questions: { beginner: ['Which strategy helps you most?','Take 3 deep breaths with me.'], intermediate: ['How does your body feel after using a calming strategy?','When do you think you might use the squeeze tool?'], advanced: ['Why do you think calming our body helps us think better?','Which strategy would you choose for which type of feeling?'], openEnded: ['What does it feel like in your body when a big feeling is coming?','How do you think having a calming toolbox might change your day?'] },
  responses: { typical: 'Children engage with physical strategies (breathing, squeezing) more readily than cognitive ones initially.', strong: 'Children identify which strategy fits which type of feeling and can explain the physical sensation of calming.', shy: 'Children prefer quiet strategies (breathing, drawing) over physical ones (jumping) — honor individual preference.', limitedLanguage: 'Children demonstrate understanding through physical strategy use, even without verbal explanation.' },
  shySupport: { prompts: ['You can do the breathing very quietly just for yourself.','I will do it with you so neither of us is doing it alone.'], alternatives: ['Let child hold a calming object (stress ball, smooth stone) as a concrete anchor', 'Use a quiet corner for children who need private strategy practice'], encouragement: ['I saw you take that deep breath when you were frustrated — you used your toolbox!','You just calmed yourself down. That is incredible self-control!'] },
  observation: ['Do children remember to use strategies without adult prompting during emotional moments?','Which strategies do individual children gravitate toward — does it vary by emotion type?','Do children\'s regulation skills improve over repeated weeks of practice?','Are children beginning to offer strategies to peers ("Try the breathing") ?'],
  rubric: { beginning: 'Child cannot identify or use any calming strategy independently; escalates without adult intervention.', developing: 'Child uses one calming strategy when directly prompted by an adult.', proficient: 'Child uses 2-3 strategies with minimal prompting and shows visible calming effect within 3-4 minutes.', advanced: 'Child uses strategies proactively at early signs of upset, selects strategy appropriate to feeling type, and coaches peers on strategy use.' },
  teacherNotes: ['{child} spontaneously went to the calm-down corner and used the glitter jar today when frustrated — independent self-regulation in action.', 'During the Calming Toolbox review, {child} added their own strategy: "I think about my dog and it helps me." Personal strategies represent advanced internalization.'],
  parentReport: { example: 'Today we built our Calming Toolbox — a set of 5 research-backed strategies for managing big feelings: box breathing, counting to 10, a calm-down squeeze, a quiet corner moment, and thinking of a happy place. Your child engaged actively with each tool. These strategies work best when practiced daily at HOME too — the more they are used across settings, the more automatic they become.', homeExtension: 'Try this: tonight before bed, practice ONE calming strategy together. Simply say "Let\'s try our box breathing — breathe in 4, hold 4, out 4" and do it as a family. Two minutes of daily practice builds the regulation skill faster than anything else.' },
  variations: { smallGroup: 'Personalized Calming Toolboxes: each child identifies and decorates their own top 3 strategies.', wholeClass: 'Daily 3-minute calming practice at morning circle — builds habit through routine.', outdoor: 'Nature calming: listen to sounds, feel the breeze, ground feet on grass — powerfully regulating.', indoor: 'Calm-down corner always available with sensory tools, breathing visuals, and comfort items.', lowResource: 'Deep breathing, counting, and self-hugging require no materials whatsoever.' },
  classroomMgmt: { transitions: 'Use a calming strategy to transition INTO quiet activities: "Let\'s take 3 breaths before we begin writing."', disruptions: 'When a child is escalating, calmly name the tool: "It looks like you might need your squeeze. I will get it for you."', participation: 'Some children regulate best through movement — honor this by including movement-based calming strategies.', diverseLearners: 'Adapt for sensory needs: some children need deep pressure input (heavy blanket), others need stillness — know your individual children.' },
  materials: { required: ['Glitter calm-down jar','Breathing visual cards','Feelings chart'], optional: ['Stress balls or putty','Personal toolbox cards for each child','Calm-down corner with sensory items'], printable: ['My Calming Toolbox personal card','5 calming strategies poster'], digital: ['GoNoodle calm breathing videos','Cosmic Kids Yoga calm-down sessions'] }
};

/* ── PRESCHOOL PHYSICAL ── */
COACHING_DATA['pp1'] = {
  intro: 'Today we are going to practice something that takes real concentration — using scissors. Let me show you the right way to hold them, and then you get to try!',
  tips: ['Explicitly teach the correct thumb position (thumb on top, fingers on bottom) before any cutting begins','Pre-draw thick, bold lines for initial practice — thin lines are too challenging and cause frustration','Celebrate the PROCESS of trying, not the precision of the cut — frustration tolerance matters more than the product initially'],
  prompts: ['Hold your scissors like a little mouth opening and closing — open, close, open, close. Just practice the motion first.', 'Now try to cut right on the line — go slowly, you have all the time you need.', 'Your scissors stayed right on the line! Look at how carefully your hand moved there!'],
  close: 'Your hands just learned something new today. Every time you practice, your fingers get stronger and your cuts get straighter. This takes time, and you are doing exactly right.',
  questions: { beginner: ['Are your fingers in the right holes?','Can you make your scissors open and close?'], intermediate: ['Can you cut exactly on the line?','What helps you cut more straight?'], advanced: ['What happens when you slow down versus rush?','How could you cut a curve without stopping?'], openEnded: ['What could you cut out and create with your new scissor skill?','How does it feel in your hand when the scissors are working well?'] },
  responses: { typical: 'Children can open and close scissors with correct grip; cutting on lines requires multiple sessions of practice.', strong: 'Children cut on straight lines accurately and begin attempting gentle curves with control.', shy: 'Children are often perfectionist about scissor work; provide extra encouragement around the attempt, not the outcome.', limitedLanguage: 'Children demonstrate understanding through correct grip formation and cutting attempts regardless of verbal communication.' },
  shySupport: { prompts: ['Your scissors do not have to be perfect — just try!','I will hold the paper very still for you while you cut.'], alternatives: ['Tear paper first as a confidence-building precursor to cutting', 'Start with playdough snipping — builds hand strength without the anxiety of paper work'], encouragement: ['You just made your first cut — that is a real skill!','Look how straight that line is getting!'] },
  observation: ['Does child use correct scissor grip (thumb up) or revert to fist grip?','Is the dominant hand clearly established, or is child still switching?','Can child cut a straight line without drifting off significantly?','Does child show frustration tolerance during difficult sections or stop immediately?'],
  rubric: { beginning: 'Child cannot hold scissors correctly or make any intentional cut on paper.', developing: 'Child holds scissors correctly and makes some cuts, though with significant deviation from the line.', proficient: 'Child cuts along straight lines with minimal deviation; beginning to attempt gentle curves.', advanced: 'Child cuts complex shapes accurately, self-corrects drift, and uses scissors for creative purposes independently.' },
  teacherNotes: ['{child} held scissors correctly without reminders today and cut a complete straight line independently — significant fine motor milestone.', 'During Scissor Skills Station, {child} showed exceptional frustration tolerance — restarted the cut three times to get it right without being prompted to persist.'],
  parentReport: { example: 'Today we practiced scissor skills — an important fine motor milestone that directly supports future writing readiness. Your child worked on correct grip and cutting along lines. This requires significant hand strength, bilateral coordination, and concentration. Your child showed great effort today! Fine motor skills develop through repetition — the more opportunities to practice, the faster progress comes.', homeExtension: 'Give your child old magazines and safety scissors to cut freely at home. Free-cutting (without lines) builds hand strength and confidence equally well. Save interesting cut pieces for a collage project together!' },
  variations: { smallGroup: 'Cutting stations: different line types (straight, wave, zigzag) for differentiated challenge.', wholeClass: 'Whole-class cutting project: each child cuts one piece that becomes part of a collaborative class art piece.', outdoor: 'Cut natural materials: stems, flat leaves (safe, soft ones) — different textures build grip strength.', indoor: 'Scissor skills center with scaffolded challenge progression: straight lines → curves → shapes.', lowResource: 'Paper strips from old newspapers or junk mail — infinite cutting practice at zero cost.' },
  classroomMgmt: { transitions: 'Establish a clear "scissors stay at the table" rule before every session — safety and consistency.', disruptions: 'If scissors are used unsafely, calmly remove them and revisit the safety rules before returning.', participation: 'Children who find scissors genuinely difficult can use adaptive scissors (spring-loaded) to build success experience.', diverseLearners: 'Left-handed children need left-handed scissors — right-handed scissors held in the left hand are ineffective and frustrating. Keep both available.' },
  materials: { required: ['Child safety scissors','Pre-drawn cutting lines — straight, then curves, then shapes'], optional: ['Adaptive spring-loaded scissors','Playdough for pre-strengthening','Lacing cards for hand strength building'], printable: ['Progressive scissor skills practice sheets','Scissor grip visual reference card'], digital: [] }
};

COACHING_DATA['pp2'] = {
  intro: 'Today we are going to move our bodies in a new way — like yoga! Each pose has an animal name. Are you ready to become the animals?',
  tips: ['Do every pose yourself alongside children — your modeling is the most powerful instruction','Never correct a child\'s pose beyond basic safety — effort and exploration matter infinitely more than perfect form','Use the breath as the anchor of every pose: "Feel your breath going in and out while you hold the tree"'],
  prompts: ['Let\'s become a cat! Round your back like a C, look down, breathe slowly in and out.', 'Tree pose! Find a still point to look at. Feel your one foot pushing into the ground. You are a tree in a gentle breeze.', 'Notice how your body feels right now. Quieter? Stronger? Calmer? That is what yoga does inside.'],
  close: 'Your body knows how to be strong AND calm. Every time you do yoga, you are teaching your brain and your body to work together.',
  questions: { beginner: ['Can you balance like a tree in the wind?','Take a deep breath in this pose.'], intermediate: ['How does your body feel after this pose?','Which pose was hardest for you?'], advanced: ['What helps you balance longer?','How is your breathing different in yoga versus running?'], openEnded: ['What animal does your body want to be today?','What does it feel like to be completely still?'] },
  responses: { typical: 'Children engage enthusiastically with animal poses; balance is inconsistent but effort is high.', strong: 'Children hold poses with stillness, deep breathing, and can narrate what they feel in their bodies.', shy: 'Children appreciate the individual nature of yoga — there is no peer comparison, which builds confidence.', limitedLanguage: 'Children communicate through movement — mirroring, attempting, and showing physical engagement.' },
  shySupport: { prompts: ['There is no right or wrong in yoga — every body does it a little differently.','Just try whatever feels comfortable for you.'], alternatives: ['Allow children to do adapted versions of poses (e.g., tree with two feet) without correction', 'Pair with a friend for partner yoga versions — builds trust and reduces performance anxiety'], encouragement: ['Your tree was so strong today!','I saw your breath slow down — that is the whole point of yoga!'] },
  observation: ['Are children connecting breath to movement?','Do children show improved balance over repeated sessions?','Are children calmer at the END of a yoga session than the beginning?','Do any children spontaneously use yoga strategies during emotional moments later in the day?'],
  rubric: { beginning: 'Child cannot hold any pose for more than 1 second; shows no intentional breathing.', developing: 'Child attempts most poses with effort; holds for 2-3 seconds with visible wobbling.', proficient: 'Child holds 4-5 poses for 5 breath counts each; uses breath intentionally.', advanced: 'Child demonstrates strong balance, narrates body experience during poses, and leads peers through familiar poses independently.' },
  teacherNotes: ['{child} held Tree Pose for a full 10 breaths today with exceptional stillness — significant balance and concentration development.', 'After our yoga session, {child} said "I feel peaceful inside now" — showing mind-body awareness well beyond typical preschool development.'],
  parentReport: { example: 'Today we did Kids Yoga — practicing 5 animal poses with mindful breathing. Yoga at this age builds balance, body awareness, flexibility, and most importantly the mind-body connection that supports emotional regulation. Your child showed genuine engagement and even demonstrated some of the poses to their friends. Yoga is a skill for life!', homeExtension: 'Search for "Cosmic Kids Yoga" on YouTube — these free, story-based yoga videos are designed for young children and can be done on any floor space at home. Even 10 minutes together once a week builds meaningful body-mind connection.' },
  variations: { smallGroup: 'Partner yoga: child-friendly poses that require two people — builds trust and cooperative body awareness.', wholeClass: 'Class yoga flow: everyone moves through the sequence together — powerful for community connection and calm.', outdoor: 'Garden yoga: mountain pose, tree pose, flower pose — connecting body to nature is especially grounding.', indoor: 'Works perfectly on carpet squares or any clear floor space.', lowResource: 'No mats needed — bare feet on carpet or clean floor works equally well.' },
  classroomMgmt: { transitions: 'Use 3-pose micro-yoga (mountain, tree, child\'s pose) as a 2-minute transition calming tool.', disruptions: 'Children who are disruptive during yoga often need MORE movement, not less — try giving them a leadership role.', participation: 'Yoga is never forced — children who observe are welcome; they often join within 2-3 sessions.', diverseLearners: 'All poses can be adapted: chair yoga for children with mobility considerations; sensory modifications for hypersensitive children.' },
  materials: { required: ['Yoga mats or carpet squares','Animal pose visual cards'], optional: ['Soft background music','Nature sounds recording'], printable: ['5-pose Kids Yoga sequence card','Breathing buddy visual'], digital: ['Cosmic Kids Yoga — YouTube','GoNoodle yoga and movement'] }
};

COACHING_DATA['pp3'] = {
  intro: 'Today we practice throwing and catching! Before we start, let me show you the secret: WATCH THE BALL, not the person throwing it.',
  tips: ['Start with the largest, softest ball available — success builds confidence for smaller ball challenges','Model the underhand throw explicitly: "Start low, release at eye level, follow through with fingers pointing at target"','Praise the attempt and form, never the success or failure of the outcome'],
  prompts: ['Hold your hands out like a shelf, elbows bent. Watch the ball all the way into your hands!', 'Good throw! Now the secret — look at where you want the ball to go BEFORE you throw, not while you throw.', 'That was a miss — and that is completely fine. What will you adjust on the next one?'],
  close: 'Ball skills take thousands of practice throws. Every single one today made you better, even the misses. Especially the misses — because your brain learned from each one.',
  questions: { beginner: ['Use two hands to catch!','Are you ready? Watch the ball!'], intermediate: ['What helps you catch more often?','What is different when you throw to a far target?'], advanced: ['What body part drives the power in your throw?','How does catching a big ball feel different from a small ball?'], openEnded: ['What do you notice about how your throw changes when you focus?','What is the hardest part of catching? Why?'] },
  responses: { typical: 'Children catch large balls at close range with 2-3 out of 5 attempts; throwing mechanics are variable.', strong: 'Children catch at medium distance with accuracy and can self-correct throwing mechanics after feedback.', shy: 'Children are sometimes embarrassed by misses — establish a genuine "misses are learning" culture explicitly.', limitedLanguage: 'Children demonstrate entirely through movement — observe form, persistence, and improvement as primary assessment data.' },
  shySupport: { prompts: ['You can practice with me one-on-one first before we join the group.','Missing is how EVERYONE learns — even professional athletes miss thousands of times in practice.'], alternatives: ['Start with rolling a ball back and forth — equally valid skill foundation', 'Use a balloon for catching practice — slower and forgiving, builds success experience'], encouragement: ['You adjusted your hands — you are self-coaching!','That catch was solid — you watched it all the way in!'] },
  observation: ['Is child using correct two-handed catching form or swatting with one hand?','Does child track the ball visually from thrower\'s hands to catch point?','Is dominant hand established for throwing?','Does child show improvement in catch success rate over repeated sessions?'],
  rubric: { beginning: 'Child cannot catch a large ball at short range; throws without directional control.', developing: 'Child catches a large ball at short range with 2+ attempts; throws forward with some control.', proficient: 'Child catches consistently at medium range; uses correct underhand throw form with directional accuracy.', advanced: 'Child catches varied ball sizes at varying distances; adjusts throwing power intentionally; begins trying overhand throw.' },
  teacherNotes: ['{child} caught 4 out of 5 large ball tosses today at medium range — significant improvement from the beginning of the month and excellent hand-eye coordination.', 'During Ball Skills Circuit, {child} independently coached their partner on watching the ball — transferring learned technique to peer teaching.'],
  parentReport: { example: 'Today we practiced throwing and catching in our Ball Skills Circuit. These skills build hand-eye coordination, timing, and athletic confidence — and they develop through repetition. Your child showed real focus today and made visible improvements over the session. Ball skills support children in physical education, team sports, and even the fine motor control needed for writing.', homeExtension: 'Roll or toss a ball back and forth for 10 minutes at home — this is one of the highest-value physical development activities for this age. Keep it fun: count consecutive catches, vary the distance, try sitting down.' },
  variations: { smallGroup: 'Partner catch — 2 children face each other and practice consecutive catches, building cooperative momentum.', wholeClass: 'Ball skills circuit: multiple stations with different size balls and skill challenges.', outdoor: 'Outdoor ball skills are ideal — more space, no breakable items, and natural motivation.', indoor: 'Use soft foam balls indoors to prevent damage and reduce fear of impact.', lowResource: 'A rolled-up pair of socks makes a perfectly adequate indoor practice ball.' },
  classroomMgmt: { transitions: 'Collect all balls before transitioning — create a predictable retrieval ritual.', disruptions: 'If a child throws a ball at a peer intentionally, immediately separate and reset safety expectations.', participation: 'Children with low athletic confidence benefit from private one-on-one practice before group integration.', diverseLearners: 'Use beanbags for children with tracking difficulties — slower, softer, and land without rolling away.' },
  materials: { required: ['Soft balls of varying sizes (large to medium)'], optional: ['Targets for throwing accuracy','Balloon for extra-slow catching practice','Hula hoops as catching targets'], printable: ['Ball skills progress tracker'], digital: ['PE Central: ball skills activities for preschool'] }
};

COACHING_DATA['pp4'] = {
  intro: 'Today we practice the strokes that your hands will use every time you write a letter. Let me show you each one slowly, then you try!',
  tips: ['Always start strokes from the TOP — this builds the correct directionality habit from the very first attempt','Sand trays allow mistakes to be instantly erased — they reduce perfectionism and build willingness to try','Use verbal chanting for each stroke: "Down from the sky" (vertical), "Across the clouds" (horizontal), "Around the apple" (circle)'],
  prompts: ['Start at the top! Make a line going all the way down, like rain falling. Top to bottom — go!', 'Now across: start left, slide right, like a train on a track. Left to right — go!', 'Your hand is learning something it will use for the rest of your life. Each time you practice, the path gets clearer.'],
  close: 'Every letter in the alphabet is made from those strokes you just practiced. You have already learned the building blocks of all writing!',
  questions: { beginner: ['Which way does this line go?','Can you make it smooth and even?'], intermediate: ['What do you notice about how your hand feels when you draw a smooth line?','Which stroke is hardest for you?'], advanced: ['Can you find these strokes inside actual letters?','What happens when you slow down — is the stroke better or worse?'], openEnded: ['What letter do you most want to write? Let\'s see if we can build it from these strokes.','What would writing be like without lines and circles?'] },
  responses: { typical: 'Children can form vertical and horizontal strokes; circles require multiple sessions for smooth form.', strong: 'Children connect strokes to letters independently and begin forming their name using correct stroke sequence.', shy: 'Sand tray eliminates perfectionism anxiety — many shy children are more willing in sand than on paper.', limitedLanguage: 'Children demonstrate through stroke formation — observe directionality, pressure control, and stroke consistency.' },
  shySupport: { prompts: ['You can draw in the sand first where no one can see — it disappears every time!','There is no wrong way to practice — every mark makes your hand stronger.'], alternatives: ['Large muscle version: practice strokes in the air using whole arm first, then scale down to hand', 'Trace over dotted line templates to provide structure without blank-page anxiety'], encouragement: ['That vertical line went perfectly straight!','Look at your circle — it is getting smoother each time!'] },
  observation: ['Does child form strokes from correct starting point (top for verticals, left for horizontals)?','Is pressure on the writing instrument appropriate (not too heavy/light)?','Are circles formed counterclockwise (correct for letter formation) or clockwise?','Is dominant hand consistently used, or still switching?'],
  rubric: { beginning: 'Child cannot form intentional strokes; marks are random scribbles without directionality.', developing: 'Child forms vertical and horizontal strokes with guidance; circles are not yet closed.', proficient: 'Child independently forms all four stroke types with correct directionality and reasonable smoothness.', advanced: 'Child connects strokes to letter formation, writes multiple letters using correct sequence, and shows consistency across media (sand, chalk, paper).' },
  teacherNotes: ['{child} formed vertical, horizontal, and circular strokes on the chalkboard today with consistent correct directionality — ready for letter formation practice.', 'During Pre-Writing Practice, {child} drew a vertical stroke and said "That is the letter I!" — making the stroke-to-letter connection independently.'],
  parentReport: { example: 'Today we practiced pre-writing strokes — the building blocks of all letter formation. Using sand trays, chalk, and fat crayons, your child practiced vertical lines, horizontal lines, circles, and diagonal strokes. All 26 letters of the alphabet are combinations of these four strokes. Your child showed excellent focus and concentration today!', homeExtension: 'Let your child draw large shapes with chalk on the driveway or sidewalk — this builds the same pre-writing muscles in a fun, low-pressure way. Draw dots and let them connect them — dotted lines provide just enough support for confident stroke formation.' },
  variations: { smallGroup: 'Pre-writing stations: sand, chalk, paint, large paper — rotate for varied sensory input.', wholeClass: 'Air-writing: all children practice strokes together in the air using large arm movements.', outdoor: 'Chalk on pavement — large-scale strokes build shoulder stability as well as hand control.', indoor: 'Sand tray, rice tray, or whiteboard — erasable surfaces build confidence and willingness to attempt.', lowResource: 'A tray of sand or sugar, or a finger on a foggy window — no materials needed beyond a surface.' },
  classroomMgmt: { transitions: 'Sand tray warm-up works as a focusing transition before any writing or fine motor activity.', disruptions: 'If children use sand trays inappropriately, remove briefly and reestablish the purposeful use protocol.', participation: 'Children who resist writing often respond to the sand tray when paper feels threatening — meet them where they are.', diverseLearners: 'For children with hypotonia or low hand strength, build strength first with clay, playdough, and pegs before introducing writing instruments.' },
  materials: { required: ['Sand trays','Chalkboard or large chalk','Large chalk or fat crayons'], optional: ['Dotted-line practice sheets','Vertical surfaces (easel) for different muscle engagement'], printable: ['Pre-writing stroke practice sheets','Letter formation chants reference card'], digital: [] }
};

/* ── PRESCHOOL CREATIVITY ── */
COACHING_DATA['pcr1'] = {
  intro: 'Today the art table is set up with lots of different materials. There is no plan, no model, no example — just YOU and the materials. Let\'s see what you create!',
  tips: ['Do NOT show any example or model before open-ended art — an example limits imagination immediately','Avoid hovering — check in briefly but allow children sustained uninterrupted creative time','Ask only process questions: "How did you make that texture?" never "What is it supposed to be?"'],
  prompts: ['What materials are you most interested in trying first? Just start there and see where it takes you.', 'Tell me about your process — how did you make that part?', 'You made a choice to use that color there. What made you decide that?'],
  close: 'What happened here today is real art. Not because it looks a certain way, but because YOUR ideas came through YOUR hands into the world. That is creativity.',
  questions: { beginner: ['Tell me about what you made.','What did you enjoy making?'], intermediate: ['How did you do that part?','What would you do differently next time?'], advanced: ['What were you trying to express or create?','How did you solve the problem of that texture not sticking?'], openEnded: ['What would happen if you added just one more element?','If you could title this piece, what would you call it?'] },
  responses: { typical: 'Children explore several materials without a predetermined product in mind; describe their work in physical terms ("I put blue here").', strong: 'Children work with clear intention and can articulate creative decisions and problem-solving that occurred during creation.', shy: 'Children often produce rich work but are reluctant to discuss it — accept "I don\'t know" and celebrate the work without pushing verbal reflection.', limitedLanguage: 'Children communicate through the art itself — point to elements and narrate what you observe to validate their expression.' },
  shySupport: { prompts: ['You don\'t have to explain it — I am just going to look at it with you.','What is your favorite part of what you made?'], alternatives: ['Allow completely silent art time for children who find verbal reflection pressuring', 'Write down their exact words if they whisper — showing their voice matters'], encouragement: ['This piece is completely, uniquely yours.','I can see your thinking in this work.'] },
  observation: ['Does child experiment with multiple materials or stick exclusively to familiar ones?','Is child working with intention (making decisions) or purely randomly?','Does child show problem-solving when materials don\'t cooperate as intended?','Does child make connections between their creation and real-world experiences?'],
  rubric: { beginning: 'Child uses only one material in a repetitive way; shows no decision-making or exploration.', developing: 'Child explores 2-3 materials with some intentionality; can name what they made after completion.', proficient: 'Child actively experiments across materials, makes deliberate choices, and articulates at least one creative decision.', advanced: 'Child works with clear aesthetic intention, solves creative problems independently, and can articulate the concept or feeling their work expresses.' },
  teacherNotes: ['{child} spent the full 20 minutes fully absorbed in the process art invitation — only the most engaged learners sustain this level of focus in free exploration.', 'During Process Art Studio, {child} mixed two unexpected materials (paint and sand) deliberately to create a new texture, showing sophisticated creative problem-solving.'],
  parentReport: { example: 'Today your child participated in our Process Art Studio — open-ended art where there is no model or expectation, just creative exploration. Research consistently shows that process-focused art (focused on the experience of creating rather than the product) builds creative confidence, risk-taking, and divergent thinking. Your child was deeply absorbed in the work and created something entirely original.', homeExtension: 'Set up a simple "yes space" on a table — old magazines to tear, glue sticks, crayons, and any scraps of paper. Say "create whatever you want" and then leave them to it. Resist asking what it is — just say "I love watching you create."' },
  variations: { smallGroup: 'Small groups allow richer material variety and opportunity for collaborative discussion about creative choices.', wholeClass: 'Large group collaborative process art: one enormous shared surface where every child contributes.', outdoor: 'Nature process art: dirt, water, flowers, leaves, stones — entirely open-ended and endlessly rich.', indoor: 'Process art center available daily as a choice during center time.', lowResource: 'Torn paper, water and food coloring, and mud are among the richest process art materials — they cost nothing.' },
  classroomMgmt: { transitions: 'Allow extra time for cleanup after process art — it is almost always messier than expected, and that means it worked.', disruptions: 'If children use materials unsafely, calmly name safety expectations and offer alternatives.', participation: 'Some children need permission to make a "mess" — explicitly say "it is okay to be messy here." This changes everything.', diverseLearners: 'Provide adaptive tools for children with fine motor considerations: thick-handled brushes, spray bottles instead of brushes, sponge applicators.' },
  materials: { required: ['Varied art materials: paint, collage pieces, clay or playdough, fabric scraps'], optional: ['Unusual materials: bubble wrap, textured papers, natural elements','Photography to document the process'], printable: ['Process vs. product art guide for teachers'], digital: ['Crayola Education: process art guides for educators'] }
};

COACHING_DATA['pcr2'] = {
  intro: 'Welcome to our Dramatic Play World! Today you can be ANYONE and do ANYTHING. What world do you want to create?',
  tips: ['Enrich the environment, not the play — add a prop, not a direction; let children\'s imagination lead completely','Enter play as a co-player, not a director: accept the role children assign you and follow their lead','Narrate to enrich language and extend the narrative: "I see the doctor is very busy today — there are many patients."'],
  prompts: ['I notice the grocery store is open — what is on special today? I am looking for something for dinner.', '[In role as patient] Hmm, doctor, I am not sure what is wrong with me. What do you think might help?', '[To extend narrative] Oh no — a problem has arrived! The store is out of milk. What can we do?'],
  close: 'In dramatic play, you were the author, the director, and the actor all at once. Every story you created today used real skills: language, imagination, problem-solving, and cooperation.',
  questions: { beginner: ['What is happening in your story?','Who are you today?'], intermediate: ['What happens next in the story?','How does your character feel right now?'], advanced: ['How did you solve that problem in the story?','What would your character do if something went wrong?'], openEnded: ['If your story could go anywhere from here, where would you take it?','What does your character believe about the world?'] },
  responses: { typical: 'Children create familiar real-world scenarios (doctor, grocery store, family); narrate in character with teacher support.', strong: 'Children sustain extended narrative arcs with multiple characters, plot complications, and resolutions; teacher\'s role is minimal.', shy: 'Children prefer peripheral roles (patient, customer) rather than lead roles — these are equally valid and important for story-building.', limitedLanguage: 'Children communicate through action, gesture, and prop use — just as valid as verbal communication in dramatic play.' },
  shySupport: { prompts: ['You can be my helper in the story — you do not have to be in charge.','What prop do you want to use? Just pick it up and see where the story takes you.'], alternatives: ['Offer a supporting role that requires minimal speech but full participation (the nurse who hands instruments)', 'Allow child to observe from within the space first — proximity leads to participation naturally'], encouragement: ['You just solved a big problem in our story!','Your character made the story so much more interesting!'] },
  observation: ['Does child sustain an imaginative scenario for extended periods (10+ minutes)?','Does child use language fluently in role, including vocabulary appropriate to the scenario?','Does child negotiate roles and plot with peers?','Does child show ability to problem-solve within the narrative context?'],
  rubric: { beginning: 'Child holds a prop but shows no narrative; cannot maintain any role or engage in story-building.', developing: 'Child participates in an established scenario with teacher support; responds to plot but rarely initiates.', proficient: 'Child initiates and sustains narrative, assigns roles to peers, and problem-solves within the story context.', advanced: 'Child creates complex multi-character narratives with plot structure, emotional depth, and creative problem resolution; sustains play across multiple days.' },
  teacherNotes: ['{child} maintained the "veterinarian" role for 25 uninterrupted minutes today, using remarkable medical vocabulary and creating a complete story arc — extraordinary dramatic play engagement.', 'During Dramatic Play World, {child} assigned roles, solved a "story problem" when the pharmacy ran out of medicine, and incorporated three different peers into the narrative — sophisticated play leadership.'],
  parentReport: { example: 'Today your child spent time in our Dramatic Play World — a rich imaginative environment with themed props for storytelling. Dramatic play is the primary curriculum for preschool-age children: it develops language, narrative thinking, social negotiation, emotional processing, and creative problem-solving all simultaneously. Your child showed remarkable imagination and language use today!', homeExtension: 'Set up a simple dramatic play invitation at home: a few scarves, some kitchen items, and a stuffed animal are enough. Say "Let\'s play" and follow your child\'s lead — even 15 minutes of imaginative play together is powerfully developmental.' },
  variations: { smallGroup: 'Intimate small group allows deeper character development and more complex negotiated storylines.', wholeClass: 'Class dramatic play performance: children share their story with an audience — builds confidence and narrative structure.', outdoor: 'Outdoor dramatic play: sticks become wands, cardboard becomes castles, dirt becomes ingredients — nature is the best prop supply.', indoor: 'Permanent dramatic play center available daily — rotating themes maintain engagement across the year.', lowResource: 'Scarves, hats, and household items — the best dramatic play props cost almost nothing.' },
  classroomMgmt: { transitions: 'Give a 5-minute warning before dramatic play ends — abrupt endings are genuinely disruptive to complex imaginary worlds.', disruptions: 'If play becomes aggressive or unsafe, enter in role to redirect: "My character would never act that way in this story."', participation: 'Children who resist joining can always begin as audience or narrator — adjacent participation leads to full participation.', diverseLearners: 'Social stories about dramatic play themes help children with social communication challenges enter and navigate play scenarios.' },
  materials: { required: ['Dress-up clothes','Themed props (grocery, doctor, kitchen, construction, etc.)'], optional: ['Photography/video for portfolio documentation','Props from children\'s home cultures to increase authenticity'], printable: ['Dramatic play vocabulary cards by theme','Dramatic play story-starting scenario cards'], digital: [] }
};

COACHING_DATA['pcr3'] = {
  intro: 'Today WE are going to create an original song — our very own class song that did not exist before today. Let\'s write it together!',
  tips: ['Start with a simple, catchy melody — 4-8 notes that repeat; the simpler the better for children to build on','Accept ALL contributions: every word a child offers can be incorporated or shaped — never reject ideas outright','Record the final song immediately on any device — children need to hear their creation to fully own it'],
  prompts: ['I will give us a starting melody: [sing simple 4-note pattern]. Now — what is our song going to be about?', 'We need a word that rhymes with "sun" here. What words rhyme with sun? Shout them all out!', '[After a new verse is added] Listen — this is our class singing something we created from nothing. How does that feel?'],
  close: 'This song did not exist this morning. You made it. Every word, every rhyme — that was your class brain creating something brand new. That is what composers do.',
  questions: { beginner: ['What should our song be about?','What rhymes with sun?'], intermediate: ['What should happen in the next verse?','How should this line feel — happy, exciting, mysterious?'], advanced: ['How could we change the rhythm to make this part feel different?','What word would make this line land harder?'], openEnded: ['If our song could sound any way — fast, slow, loud, whispered — what would it sound like?','What feeling do you want people to have when they hear our song?'] },
  responses: { typical: 'Children contribute rhyming words enthusiastically; teacher weaves contributions into a cohesive structure.', strong: 'Children suggest not just words but lines, structural ideas, and even rhythmic variations.', shy: 'Children contribute by nodding, smiling, and choosing from teacher-offered options — all participation is genuine.', limitedLanguage: 'Children can hum the melody, clap the rhythm, and choose words through pointing or gesture.' },
  shySupport: { prompts: ['You can just hum along — that is part of the song too!','What word sounds good right here? You can just say any word and I will try it!'], alternatives: ['Offer a choice of two words for the shy child to select — lowers the bar while maintaining genuine contribution', 'Give shy child the job of "melody keeper" — they hum when others forget the tune'], encouragement: ['That word made the whole line come alive!','Your voice is part of this song now forever!'] },
  observation: ['Do children show phonological awareness through spontaneous rhyme generation?','Do children sustain musical engagement through the full songwriting session?','Do children show ownership of the class song — singing it independently later?','Does the collaborative creative process build class community?'],
  rubric: { beginning: 'Child shows no engagement with songwriting; cannot generate rhyming words even with strong scaffolding.', developing: 'Child contributes 1-2 rhyming words with prompting; sings the melody with the group.', proficient: 'Child contributes multiple rhymes, suggests topic ideas, and sings the completed song confidently.', advanced: 'Child contributes complete lines of lyrics, suggests rhythmic and melodic variations, and leads sections of the group singing.' },
  teacherNotes: ['{child} suggested three consecutive rhyming lines for our class song today — showing sophisticated phonological awareness and creative language.', 'During Original Song Making, {child} clapped out a new rhythm for a verse and the class adopted it — powerful creative leadership for preschool age.'],
  parentReport: { example: 'Today we wrote an original song together as a class! Your child contributed lyrics, rhymes, and ideas that became part of our class creation. This activity builds phonological awareness (rhyming), creativity, language expression, and community — all at once. Song-making is one of the richest literacy activities we can do at this age. Ask your child to sing it for you — they will be so proud!', homeExtension: 'Try making up a silly song about something your family does — brushing teeth, making breakfast, going to the park. Let your child contribute the words and ideas while you provide the melody. Recorded on your phone, it becomes a family treasure.' },
  variations: { smallGroup: 'Smaller groups allow every child more contribution time and deeper creative investment.', wholeClass: 'Whole-class songwriting is a powerful community-building experience; record and replay the song at the end of the week.', outdoor: 'Nature inspiration: write a song about what children see, hear, and feel outside.', indoor: 'Perfect as a whole-group gathering activity before transitions or after an exciting event.', lowResource: 'Voice and clapping are the only instruments needed. Body percussion adds rich rhythm without any materials.' },
  classroomMgmt: { transitions: 'The class song becomes a powerful transition tool — sing it to signal cleanup time, circle time, or goodbye.', disruptions: 'If children call out disruptively, channel their energy: "That\'s a great sound — can you make it on purpose for the song?"', participation: 'Provide a "lyric card" role: one child holds the paper with the growing lyrics so everyone feels ownership.', diverseLearners: 'Children with speech sound differences can contribute melody, rhythm, and choosing — not only words.' },
  materials: { required: ['Simple instrument or beat (clapping, drum)','Recording device for the final song'], optional: ['Written lyrics on chart paper','Simple percussion instruments for accompaniment'], printable: ['Class song lyric recording sheet'], digital: ['GarageBand (iPad) for recording','Voice memos on any phone'] }
};

/* ── PRESCHOOL LIFE SKILLS ── */
COACHING_DATA['pls1'] = {
  intro: 'Today you are getting a very important job — a real job that our classroom actually needs done. Without you doing this job, something will not happen. Ready to find out what it is?',
  tips: ['Teach the job procedure explicitly before the child takes it on independently — show, guide, watch, then release','Refer to the job by the child\'s name: "Aria\'s job today is to water the plant" — this creates genuine ownership','Always thank the job holder at the end of the day on behalf of the whole class — the work matters to everyone'],
  prompts: ['This is your job today. It is real and it matters. Without you doing it, the class will not have what it needs.', 'How did your job go today? What happened when you did it?', 'The whole class wants to thank you for doing your job. Raise your hand to thank [name] for [job]. Ready? Thank you!'],
  close: 'Responsible people do their jobs even when no one is watching. Today you showed us what responsibility looks like in real life.',
  questions: { beginner: ['What is your job today?','Did you complete your job?'], intermediate: ['Why are classroom jobs important?','What would happen if nobody did their job?'], advanced: ['How does having a job make you feel about our class?','What would you improve about how the job is done?'], openEnded: ['What jobs do you do at home that help your family?','What do you think is the most important job in our whole school?'] },
  responses: { typical: 'Children take classroom jobs seriously when they feel genuine ownership; pride is visible in completed work.', strong: 'Children complete jobs before being reminded and add quality touches beyond the minimum required.', shy: 'Classroom jobs give shy children a recognized, valued role in the community — often transformative for social confidence.', limitedLanguage: 'Children demonstrate responsibility through action — completing the job speaks louder than any verbal response.' },
  shySupport: { prompts: ['Your job is just between you and our class. Nobody has to watch you do it.','I will check in with you quietly to see how your job is going.'], alternatives: ['Assign a job that can be done independently without peer interaction initially', 'Pair with a "job buddy" for shy children who need social scaffolding to find confidence'], encouragement: ['I noticed you did your job before I reminded you — that is genuine responsibility.','The whole class benefited from what you did today.'] },
  observation: ['Does child complete the job without reminders?','Does child take pride in the quality of their job completion?','Does child remind others when their job affects others\' work?','Does responsibility in classroom jobs transfer to other self-management behaviors?'],
  rubric: { beginning: 'Child cannot remember their job without adult reminders and does not complete it consistently.', developing: 'Child completes their job when reminded; shows some pride in completion.', proficient: 'Child completes job independently and reliably; shows genuine investment in quality.', advanced: 'Child completes job proactively, improves the procedure, and reminds peers about their jobs in a supportive (not bossy) way.' },
  teacherNotes: ['{child} watered the plant, checked the soil with their finger, and reported back that it "needed a little more water" — showing initiative well beyond the basic job requirements.', 'During Classroom Jobs, {child} was absent yesterday and immediately asked about "their job" upon return — showing deep ownership and responsibility.'],
  parentReport: { example: 'Today your child held a classroom job — a real role that our classroom genuinely depends on. Classroom jobs at this age build responsibility, self-efficacy, and the understanding that communities function because everyone contributes. Your child took their role seriously and completed it with real care. You can support this at home by giving your child real household responsibilities that matter to your family.', homeExtension: 'Give your child one real home job this week — feeding a pet, setting the table, watering a plant. The key is that it must be REAL — children know when jobs are pretend, and real responsibility has completely different impact on development.' },
  variations: { smallGroup: 'Team jobs: two children share a more complex job and must coordinate.', wholeClass: 'Full classroom job rotation: every child has a job; post the board prominently.', outdoor: 'Outdoor jobs: litter pickup, garden watering, bird feeder refilling — connecting responsibility to nature.', indoor: 'Any classroom function works: plant care, attendance taking, materials distribution, book sorting.', lowResource: 'Job chart can be handwritten; no printed materials needed.' },
  classroomMgmt: { transitions: 'Jobs become a positive transition ritual: job time signals end of one activity and preparation for the next.', disruptions: 'If a child does not complete their job, discuss privately — do not shame publicly; explore what blocked them.', participation: 'Design jobs so every child has a role that matches their current capability — no child should feel set up to fail.', diverseLearners: 'Adapt jobs for ability: a child with fine motor challenges might have a verbal job (announcer, greeter) rather than a physical one.' },
  materials: { required: ['Job chart with name cards and picture labels'], optional: ['Individual job badges or lanyards','Photographic job instructions for non-readers'], printable: ['Classroom Jobs Chart with pictures','Job completion tracker'], digital: [] }
};

COACHING_DATA['pls2'] = {
  intro: 'Today at lunch, I am NOT helping unless you ask. You are going to do every step of lunch yourself. Let\'s walk through what that means.',
  tips: ['Do the explicit walk-through of every step BEFORE lunch, not during — preparation enables independence','Resist helping before being asked: wait twice as long as feels comfortable; then wait more','When a child struggles, ask "What could you try?" before helping — most children can solve it themselves'],
  prompts: ['Walk me through it: what do you need to do first when lunch arrives?', '[Child is struggling] Before I help, what is one thing you could try to open that?', 'You opened your lunch box, poured your own water, and cleaned up your own space. How does that feel?'],
  close: 'Everything you did at lunch today — you did yourself. That is what growing up looks like. Your hands are learning to take care of YOU.',
  questions: { beginner: ['Can you open that yourself?','What comes next in our routine?'], intermediate: ['What do you do when you cannot do something?','How do you know when your space is really clean?'], advanced: ['What parts of lunch are still hard for you? How could we practice those?','What is the difference between giving up and asking for help?'], openEnded: ['When do you feel most independent?','What does taking care of yourself mean to you?'] },
  responses: { typical: 'Children can manage most lunch independence with minimal reminders after explicit procedure teaching.', strong: 'Children complete all lunch steps independently and assist willing peers without being asked.', shy: 'Routine-based independence is often easier for shy children — predictability reduces anxiety.', limitedLanguage: 'Children demonstrate independence through action; narrate what you observe to build vocabulary connection.' },
  shySupport: { prompts: ['You can do this step — I will be right here, but you try first.','Show me how you do it; I want to watch you.'], alternatives: ['Practice each step of the routine individually before the whole routine is expected', 'Use a visual routine card that children can reference independently'], encouragement: ['You did that yourself — that is real independence!','I did not have to help once today. You are so capable!'] },
  observation: ['Can child open their own lunch box?','Can child manage their own napkin and table space independently?','Does child clean up without prompting?','Does child ask for help appropriately versus give up silently?'],
  rubric: { beginning: 'Child requires adult assistance for most lunch steps; cannot open containers or manage space.', developing: 'Child manages 3-4 lunch steps independently; requires assistance with difficult openings or spills.', proficient: 'Child completes all lunch routine steps independently and manages minor spills without adult help.', advanced: 'Child completes the routine with ease, assists struggling peers appropriately, and problem-solves novel lunch challenges independently.' },
  teacherNotes: ['{child} independently opened a difficult thermos lid by using the table edge for leverage — creative problem-solving and self-sufficiency in action.', 'During Independent Lunch Routine, {child} spilled and then calmly got paper towels, cleaned their space, and continued eating without any adult intervention — extraordinary self-management.'],
  parentReport: { example: 'Today we practiced our Independent Lunch Routine — every step of lunch managed by the children themselves. This builds practical self-care, sequential thinking, and genuine independence. Your child showed impressive capability! The more we allow children to do for themselves (even slowly), the more capable they become. Resist the urge to help faster than necessary — that patience is one of the greatest gifts you can give.', homeExtension: 'This week, let your child do at least three things at mealtime independently that you normally do for them: pouring their own drink, spreading their own butter, clearing their own plate. The mess is worth it. Competence is built through practice.' },
  variations: { smallGroup: 'Small group independence coaching: practice specific challenging steps (opening containers, pouring) in small groups.', wholeClass: 'Class independence challenge: who can complete the full lunch routine independently? Build a class success chart.', outdoor: 'Picnic lunch: children carry, set up, eat, and clean up their own picnic space.', indoor: 'Daily lunch routine — repeated practice is what builds genuine independence.', lowResource: 'No special materials needed beyond the children\'s actual lunch supplies.' },
  classroomMgmt: { transitions: 'Lunch routine completion signals the transition to rest time — create a clear, consistent signal.', disruptions: 'Spills are learning moments, not discipline moments — calmly narrate the cleanup process.', participation: 'Some children need explicit step-by-step visual support to build independence — use picture routine cards.', diverseLearners: 'For children with fine motor challenges, adaptive lids and containers enable the same independence as peers.' },
  materials: { required: ['Children\'s own lunch boxes and containers'], optional: ['Visual routine card','Extra napkins and paper towels for spill management'], printable: ['Lunch routine visual sequence card'], digital: [] }
};

COACHING_DATA['pls3'] = {
  intro: 'I am going to teach you something powerful today — a 4-step thinking process that works for ANY problem. Are you ready?',
  tips: ['Teach the 4 steps (Stop, Think, Choose, Do) when children are calm, not mid-problem — the brain cannot learn under stress','Display the poster at child eye level so children can reference it independently','Narrate your own problem-solving using the 4 steps throughout the day — modeling is the most powerful teaching'],
  prompts: ['STOP first! What is the problem exactly? Name it.', 'Now THINK: what are 3 things you could do? Even silly ideas count — let\'s list them all.', '[After exploring options] Which choice do you think will work best AND is kind? That is your CHOOSE step. Now DO it.'],
  close: 'You just used a tool that scientists, doctors, engineers, and leaders use every single day. The only difference is, they have been doing it longer. You are already learning it.',
  questions: { beginner: ['What is the problem?','What can you do?'], intermediate: ['Which choice is the best one?','What do you think will happen if you choose that?'], advanced: ['What happened when you tried your plan? Did it work?','What would you do differently next time?'], openEnded: ['When is it hardest to STOP before you react?','What happens in your body when you are in the middle of a problem?'] },
  responses: { typical: 'Children can name the problem and generate 1-2 solutions with teacher facilitation of the process.', strong: 'Children move through all 4 steps with minimal prompting and evaluate the outcome after attempting their plan.', shy: 'Children often think of solutions but need encouragement to verbalize them; written or drawn responses build confidence.', limitedLanguage: 'Children demonstrate problem-solving through action; the process can be observed even without verbal narration.' },
  shySupport: { prompts: ['Whisper your idea to me — it does not have to be out loud.','Draw what you could do — sometimes pictures show thinking better than words.'], alternatives: ['Allow written responses on a dry-erase board before verbal sharing', 'Use puppet characters to externalize the problem-solving process before applying to personal situations'], encouragement: ['That solution worked — your thinking made that happen.','You thought of something nobody else thought of. That is creative problem-solving!'] },
  observation: ['Can child independently identify what the "problem" is without adult naming it?','Does child generate more than one solution option?','Does child evaluate solution effectiveness after implementation?','Does child transfer the framework to new problems independently over time?'],
  rubric: { beginning: 'Child cannot identify the problem or generate any solution; requires complete adult direction.', developing: 'Child identifies the problem and generates one solution with significant adult scaffolding.', proficient: 'Child moves through all 4 steps with minimal prompting; generates 2-3 solutions and chooses among them.', advanced: 'Child uses the framework independently, evaluates solutions, adjusts when first attempt fails, and teaches the steps to peers.' },
  teacherNotes: ['{child} used the Stop-Think-Choose-Do poster independently during a peer conflict today without adult prompting — framework internalization complete.', 'During Problem Solving Steps practice, {child} generated 5 solutions to a classroom problem including two that no one else had thought of — creative divergent thinking.'],
  parentReport: { example: 'Today we learned a 4-step problem-solving framework: Stop, Think, Choose, Do. This structured approach gives children a reliable mental tool for any challenge they face. Your child practiced with real classroom situations and showed excellent critical thinking. This framework, used consistently at home too, can transform how children approach frustrating situations.', homeExtension: 'When your child faces a problem at home — a toy that won\'t work, a conflict with a sibling — walk through the 4 steps together: "Let\'s stop and name the problem. What could you do? Which choice is best? Let\'s try it." You will be amazed at the solutions they generate.' },
  variations: { smallGroup: 'Each small group tackles a different class problem and presents solutions — builds investment in real outcomes.', wholeClass: 'Class problem-solving council: tackle a real classroom challenge using the 4-step process together.', outdoor: 'Outdoor problem scenarios: "The only ball available is broken — what do we do for recess?"', indoor: 'Role-play classic preschool problems with puppets as characters to practice the framework.', lowResource: 'The framework itself is the tool — just the poster and genuine problems are all that is needed.' },
  classroomMgmt: { transitions: 'Teach the 4 steps as a general transition conflict tool: "Let\'s stop and think about this."', disruptions: 'When conflicts occur, physically point to the poster and say "Step 1 — what is the problem?" rather than intervening directly.', participation: 'Even very young or language-limited children can participate in STOP (pausing) and DO (acting on a suggested solution).', diverseLearners: 'Visual problem-solving supports (picture cards showing each step) allow non-readers to use the framework independently.' },
  materials: { required: ['Problem-solving poster: Stop, Think, Choose, Do — displayed at child eye level'], optional: ['Problem-solving journal for drawing solutions','Scenario cards for practice'], printable: ['My Problem-Solving Steps personal card','Classroom Problem Solving poster'], digital: ['PBS Kids problem-solving character episodes'] }
};

/* ── PRESCHOOL HEALTH ── */
COACHING_DATA['ph1'] = {
  intro: 'Today we are going to learn about something amazing — our OWN body — and how to take care of it really well.',
  tips: ['Frame hygiene as self-care and body respect, not as "removing germs" (which can create anxiety)','Let children complete the body care steps themselves even when slower — the independence is the point','Connect each practice to how it FEELS: "Your teeth feel smooth and clean after brushing"'],
  prompts: ['Point to your teeth. What do we do to take care of our teeth every single day?', 'Let\'s practice brushing — circle motion, every tooth, front and back. 2 minutes is the rule!', 'What do you notice about how your body feels when you take good care of it?'],
  close: 'Your body is the only one you will ever have. Taking care of it every day — teeth, hair, hands, skin — is one of the best things you can do for yourself.',
  questions: { beginner: ['How do we take care of our teeth?','Why is it important to wash our hair?'], intermediate: ['What happens if we do not take care of a part of our body?','Which body care step do you find hardest to remember?'], advanced: ['Why do different body parts need different types of care?','What would happen to your health over time without good hygiene?'], openEnded: ['What body care habit do you feel really good about?','If you could design the perfect toothbrush for yourself, what would it be like?'] },
  responses: { typical: 'Children can name body parts and associated hygiene practice; may require help remembering all steps.', strong: 'Children explain the purpose of each hygiene practice and connect it to health outcomes.', shy: 'Body care topics can feel private — normalize by framing as universal human needs everyone shares.', limitedLanguage: 'Children point to body parts and demonstrate care actions — fully valid participation.' },
  shySupport: { prompts: ['You can just show me on your body outline drawing where the care goes.','This is something everyone does — every single person in our class does these same things.'], alternatives: ['Use an anonymous body outline for practice instead of referring to personal body', 'Let child demonstrate on a doll or stuffed animal to reduce personal exposure'], encouragement: ['You remembered every step — that shows real body awareness!','Taking care of yourself is one of the most important skills you are learning!'] },
  observation: ['Can children name hygiene practices for all major body parts?','Do children understand the WHY behind hygiene (health, comfort, respect)?','Are children making connections between body care and how they feel physically?','Does classroom hygiene practice improve after this activity?'],
  rubric: { beginning: 'Child cannot name body parts or associated hygiene practices; requires adult assistance for all body care.', developing: 'Child names 3-4 body parts and their care practices; performs hygiene steps with adult reminders.', proficient: 'Child names and explains care practices for all major body areas; performs daily hygiene routines independently.', advanced: 'Child understands health rationale behind hygiene practices, makes connections to overall health, and models correct routines for peers.' },
  teacherNotes: ['{child} explained that "we brush our teeth to keep the sugar from making holes" during Body Care Connection — excellent health literacy for preschool age.', 'During the hygiene practice session, {child} corrected their own brushing technique mid-activity — metacognitive self-monitoring and health skill internalization.'],
  parentReport: { example: 'Today we connected body awareness to health habits in Body Care Connection. Your child learned about caring for different body parts — teeth, hair, skin, hands — and why each matters for health. Your child showed wonderful body awareness and engagement. Consistent hygiene routines at home reinforce these habits powerfully. The most important hygiene habits become automatic when practiced daily at both school and home.', homeExtension: 'Create a simple bathroom routine chart with your child tonight: pictures of each hygiene step in order. Let your child check off each step themselves. This builds independence and makes the routine feel like their own responsibility rather than something imposed on them.' },
  variations: { smallGroup: 'Hygiene role-play stations: small groups practice each hygiene step with props.', wholeClass: 'Morning arrival hygiene routine: whole class practices hand washing together upon arrival.', outdoor: 'Outdoor hygiene: sunscreen application, water bottle use, washing dirty hands after gardening.', indoor: 'Practice hygiene steps at a learning center with mirrors and props for each body part.', lowResource: 'Dry toothbrush practice, hand washing with water only — practice is the goal, not supplies.' },
  classroomMgmt: { transitions: 'Hygiene routine as transition (wash hands after outdoor play, before snack) builds habit through repetition.', disruptions: 'If hygiene topics lead to giggles or inappropriate remarks, calmly normalize: "These are things every person does."', participation: 'All children participate in hygiene discussions regardless of home practice differences — frame school as learning, not judging.', diverseLearners: 'Adaptive tools: electric toothbrushes for children with fine motor challenges; large-handled brushes; sensory-friendly toothpaste options.' },
  materials: { required: ['Body outline drawing','Toothbrushes for practice (individual, never shared)'], optional: ['Mirrors for self-observation during practice','Real hygiene products for show-and-tell'], printable: ['My Daily Body Care Chart','Body parts and hygiene matching activity'], digital: ['Sesame Street: Elmo\'s healthy habits videos'] }
};

COACHING_DATA['ph2'] = {
  intro: 'Today we are learning about safety — what keeps us safe and what can put us in danger. This is one of the most important lessons we have all year.',
  tips: ['Keep tone calm and matter-of-fact — fear-based safety teaching creates anxiety rather than knowledge','Give children agency: "You are learning these rules so YOU can keep yourself safe" — not "so bad things don\'t happen"','Role-play each safety scenario actively — knowledge without practice does not transfer to real situations'],
  prompts: ['Look at this picture. Is this situation safe or not safe? How do you know?', 'What should [character in scenario] do right now? Let\'s walk through it step by step.', 'Now let\'s practice: I will be the grown-up, you practice the safe response. Ready?'],
  close: 'Safety rules are not to scare you — they are tools that keep you strong and protected. Now you know what to do, and that knowledge belongs to you.',
  questions: { beginner: ['Is this safe or not safe?','What should we do?'], intermediate: ['Why is this rule important?','What would happen if someone ignored this safety rule?'], advanced: ['How would you help a friend who was in an unsafe situation?','What is the difference between a safe secret and an unsafe secret?'], openEnded: ['What makes YOU feel safe?','What is one safety rule that you think is MOST important and why?'] },
  responses: { typical: 'Children can identify obvious safety situations from picture cards; need practice applying knowledge to novel scenarios.', strong: 'Children explain safety rationale, apply rules to novel situations, and role-play correct responses confidently.', shy: 'Safety topics can feel anxiety-producing for some children — maintain calm, matter-of-fact framing.', limitedLanguage: 'Children indicate safe/unsafe through pointing, facial expression, and thumbs up/down — all valid participation.' },
  shySupport: { prompts: ['You can just point — safe or not safe?','You can whisper to me what you think.'], alternatives: ['Written or drawn response to safety scenarios rather than verbal', 'Individual practice of safety role-play in private before group setting'], encouragement: ['You knew the right thing to do!','That safety knowledge belongs to you now.'] },
  observation: ['Can children distinguish safe from unsafe situations with reasonable accuracy?','Do children know specific actions to take (tell an adult, say no, leave the situation)?','Are children developing personal safety decision-making independence?','Do children show ability to apply safety knowledge to novel situations not specifically taught?'],
  rubric: { beginning: 'Child cannot identify basic safety situations or recall any safety rules.', developing: 'Child identifies obvious safe/unsafe situations and recalls 2-3 specific safety rules.', proficient: 'Child identifies and explains 5+ safety rules, role-plays appropriate responses, and applies rules to novel scenarios.', advanced: 'Child demonstrates personal safety decision-making, teaches safety rules to peers, and shows understanding of why safety rules exist (not just what they are).' },
  teacherNotes: ['{child} role-played walking away from an unsafe situation and finding a trusted adult — with remarkably calm, confident execution of the safety response.', 'During Safety Rules Circle, {child} asked "What if the trusted adult is not there?" — sophisticated safety thinking that prompted an important discussion about backup plans.'],
  parentReport: { example: 'Today we practiced Safety Rules in our Safety Rules Circle. Your child learned to identify safe and unsafe situations and practiced appropriate responses through role-play. Personal safety knowledge is most effective when discussed calmly and practiced, not just told. Your child engaged thoughtfully. We encourage you to continue these conversations at home — "what would you do if..." questions are wonderful dinner-table discussions.', homeExtension: 'Talk with your child about your family\'s specific safety rules: who their trusted adults are, what their full name and your phone number is, what to do if they get separated from you. These specific details transform general safety knowledge into personal safety skills.' },
  variations: { smallGroup: 'Safety scenario role-play in small groups allows more individual practice and deeper discussion.', wholeClass: 'Safety rules pledge: class creates and signs their own safety pledge document displayed in classroom.', outdoor: 'Outdoor safety rules: traffic, stranger, playground, water safety — contextualized to real outdoor risks.', indoor: 'Safety scenario stations: different safety topics at different tables for rotation.', lowResource: 'Safety discussions require only conversation and imagination — no materials needed for the core teaching.' },
  classroomMgmt: { transitions: 'Pair safety rules with relevant transitions: "Before we go outside, let\'s say our outdoor safety rule together."', disruptions: 'If children become anxious during safety discussions, acknowledge: "These things might seem scary, but knowing what to do makes you safer."', participation: 'Every child can participate at their level — pointing, nodding, role-playing, or verbally explaining.', diverseLearners: 'Safety social stories support children with social communication challenges; visual scenario cards support non-readers.' },
  materials: { required: ['Safety picture cards (various safety scenarios)'], optional: ['Role-play props for practice scenarios','Community helper visit (firefighter, police officer, paramedic)'], printable: ['Safety rules picture cards','Our Family\'s Trusted Adults planning sheet'], digital: ['PBS Kids: safety for kids resources','McGruff safety videos'] }
};

/* ── PRESCHOOL CHARACTER ── */
COACHING_DATA['pch1'] = {
  intro: 'Today I have a special chart just for you. It shows every responsibility you have in our class — things that make our classroom work because YOU do them.',
  tips: ['Frame every item on the responsibility chart as something that MATTERS to the group — not just a rule to follow','Notice and name responsible behavior specifically throughout the day: "I see you pushed your chair in — that is responsibility"','Weekly celebration of responsible behavior must be specific and genuine, not generic praise'],
  prompts: ['Walk me through your responsibility chart. What do you notice at the start of your day that you need to do?', 'You hung up your backpack without being reminded. Tell me: why does that matter to our class?', 'At the end of the day, before you leave — let\'s look at your chart together. What did you accomplish?'],
  close: 'Responsible people do not need someone to watch them or remind them. They know what needs to be done and they do it because they care. That is exactly who you are becoming.',
  questions: { beginner: ['Did you complete your responsibilities today?','How does it feel to be responsible?'], intermediate: ['Which responsibility is hardest to remember?','What helps you remember your responsibilities?'], advanced: ['What happens to our class when everyone is responsible?','Can you think of something that you do responsibly that is NOT on your chart?'], openEnded: ['What does responsibility mean to you?','How is being responsible at school different from being responsible at home?'] },
  responses: { typical: 'Children take chart responsibilities seriously when given genuine ownership; pride in completion is visible.', strong: 'Children complete all responsibilities proactively, add items to their chart they have identified themselves, and remind peers.', shy: 'Visual chart allows shy children to feel accomplished without requiring public performance of responsibility.', limitedLanguage: 'Children demonstrate responsibility through action — the chart becomes a private, visual record of genuine accomplishment.' },
  shySupport: { prompts: ['Your chart shows everything you accomplished today without you having to say a word.','I noticed all of these things you did — nobody had to tell me, I just saw.'], alternatives: ['One-on-one chart review rather than public sharing', 'Photographic documentation of responsibilities completed — child\'s portfolio evidence'], encouragement: ['Your chart is almost complete — look at everything you did today!','Responsible behavior does not always get noticed, but I notice yours.'] },
  observation: ['Does child complete responsibilities without reminders?','Does child understand the purpose of each responsibility (not just the action)?','Does child show pride in responsibility completion (vs. indifference)?','Does responsible classroom behavior generalize to home behavior (parent report)?'],
  rubric: { beginning: 'Child cannot remember responsibilities or complete any without constant adult prompting.', developing: 'Child completes 2-3 responsibilities when reminded; shows emerging understanding of their purpose.', proficient: 'Child completes all responsibilities independently; can explain WHY each one matters.', advanced: 'Child completes responsibilities proactively, identifies additional self-imposed responsibilities, and positively encourages peers.' },
  teacherNotes: ['{child} completed every item on their responsibility chart today without a single reminder — the first full independent completion of the week, a meaningful milestone.', 'During Responsibility Stars check-in, {child} said "I feel proud of myself when I do all my jobs" — intrinsic motivation for responsibility fully internalized.'],
  parentReport: { example: 'Today your child worked with their personal Responsibility Stars chart — tracking daily classroom responsibilities they own and complete independently. Your child showed real care for their responsibilities and genuine pride in completion. Responsibility is one of the foundational character traits we build at this age, and it develops fastest when children have REAL responsibilities that genuinely matter.', homeExtension: 'Create a simple home responsibility chart with your child tonight. Let THEM choose 3 things they want to be responsible for at home. Children who choose their responsibilities are far more likely to own them. Check in together each evening — celebrate the completion, gently revisit any misses without shame.' },
  variations: { smallGroup: 'Small group responsibility reflection: children share their top accomplished responsibility of the day.', wholeClass: 'Class responsibility celebration: weekly whole-class recognition of the most responsible moments observed.', outdoor: 'Outdoor responsibilities: leaving the outdoor space better than you found it.', indoor: 'Daily routine integration: responsibility chart checked at arrival and departure every day.', lowResource: 'Handwritten charts are equally effective; no printing needed.' },
  classroomMgmt: { transitions: 'Responsibility chart check-in at the start and end of every day — creates bookending ritual of accountability.', disruptions: 'When a responsibility is missed, address privately: "I noticed X wasn\'t done. What got in the way? What will tomorrow look like?"', participation: 'Adapt charts for individual children — some may need 2 items, some may handle 8.', diverseLearners: 'Pictorial responsibility charts with photos of the child doing the action allow non-readers to self-monitor.' },
  materials: { required: ['Personal responsibility chart for each child'], optional: ['Star stickers for completion marking','Portfolio binder for collecting completed charts over time'], printable: ['My Responsibility Stars chart','Daily responsibility checklist'], digital: [] }
};

COACHING_DATA['pch2'] = {
  intro: 'What does respect mean? Today we are going to decide together — because these words should come from YOU, not just from me.',
  tips: ['The pledge must be CO-CREATED with children — children comply with rules; they own pledges','Display the pledge prominently at adult AND child eye level — it should be referenced daily','Catch and name respect publicly: "That is exactly what our pledge means — you showed it just now"'],
  prompts: ['Before I tell you what respect is, I want to ask you: what does it feel like when someone treats you with respect?', 'What should our promise to each other say? I will write down every single word you give me.', '[During the day] I just saw you wait for your friend to finish speaking. That is the exact respect in our pledge. Thank you.'],
  close: 'The words in our pledge came from YOU. That means you already know what respect is. Now the work is showing it every single day — not just when it is easy.',
  questions: { beginner: ['What does respect mean to you?','How do you show respect?'], intermediate: ['Was that respectful? How do you know?','When is it hardest to be respectful?'], advanced: ['Is respect always easy? When is it hard?','What is the difference between respect and being nice?'], openEnded: ['What would our class be like if we all showed respect 100% of the time?','Can you respect someone you disagree with?'] },
  responses: { typical: 'Children can name surface-level respect behaviors (listening, being kind); ownership of the pledge grows over weeks.', strong: 'Children cite the specific pledge language during conflicts and use it as a behavioral reference.', shy: 'Pledge recitation at morning circle gives shy children a shared class voice without individual performance pressure.', limitedLanguage: 'Children demonstrate respect through action — physical contributions to the pledge creation (nodding, showing) are valid.' },
  shySupport: { prompts: ['You can just nod if you agree with what someone says — that counts as contributing.','Your behavior already shows respect — I will tell the class what I noticed you doing.'], alternatives: ['Draw rather than verbalize your definition of respect', 'Point to classroom examples of respect behaviors rather than defining verbally'], encouragement: ['You showed respect without being asked — that is the highest form of it.','I see our pledge living in how you treat people today.'] },
  observation: ['Do children spontaneously reference the pledge during conflict situations?','Does classroom respect culture improve over the course of the term?','Can children distinguish respectful from disrespectful behaviors in novel situations?','Do children show genuine internalization versus surface compliance?'],
  rubric: { beginning: 'Child cannot define respect or identify respectful behaviors; pledge language has no behavioral impact.', developing: 'Child can recite parts of the pledge and identifies clear respectful/disrespectful scenarios with support.', proficient: 'Child demonstrates consistent respectful behavior and references pledge when explaining behavioral choices.', advanced: 'Child shows nuanced understanding of respect in complex situations, advocates for respectful treatment of peers, and demonstrates respect even when challenged.' },
  teacherNotes: ['{child} reminded a peer that "our pledge says we listen when someone is talking" during a class discussion today — pledge language fully internalized as behavioral guide.', 'During Class Respect Pledge morning recitation, {child} made eye contact with every single classmate while speaking — modeling the very respect they were pledging.'],
  parentReport: { example: 'Today your child helped create our Class Respect Pledge — a set of words your class chose together to describe how they will treat each other. Research shows that values children choose themselves are far more binding than rules imposed on them. Your child contributed meaningful ideas to the pledge and showed wonderful understanding of what respect means and looks like.', homeExtension: 'Consider creating a short Family Respect Pledge together at home — each person shares one way they commit to showing respect to others in the family. Posted on the refrigerator and referenced during disagreements, it becomes a powerful family touchstone.' },
  variations: { smallGroup: 'Respect scenario discussion in small groups: "Was this respectful? Why or why not?"', wholeClass: 'Daily pledge recitation at morning circle — the most important 60 seconds of the school day.', outdoor: 'Respect for nature: outdoor respect rules connect character values to environmental stewardship.', indoor: 'Pledge displayed at the classroom entrance so every person who enters sees it.', lowResource: 'Large paper and marker to write the pledge is all that is needed.' },
  classroomMgmt: { transitions: 'Pledge recitation IS a transition tool — it resets group culture between activities.', disruptions: 'When disrespect occurs, reference the pledge calmly: "Our pledge says ___. What would that look like right now?"', participation: 'All children can participate in pledge creation — verbal, gestural, or visual contributions are all valid.', diverseLearners: 'Pictorial pledge versions allow non-readers to use it as an independent behavioral reference.' },
  materials: { required: ['Large paper for creating the class pledge','Markers for writing children\'s exact words'], optional: ['Decorative frame for displaying the pledge','Individual pledge copies for each child'], printable: ['My Class Respect Pledge individual copy template'], digital: ['Sesame Street: respect and kindness videos'] }
};

COACHING_DATA['pch3'] = {
  intro: 'Today we are not just going to TALK about compassion — we are actually going to DO something compassionate for a real person or living thing that needs our help.',
  tips: ['The helping action must be REAL and connected to something children genuinely care about — authenticity is everything','Prepare the logistics in advance so children can focus on the compassion, not the practical hurdles','Reflection afterward ("How did that feel?") is as important as the action itself for character development'],
  prompts: ['Who or what needs our help right now? Let\'s look around our community. [Listen deeply to children\'s answers]', 'Now that we know who we are helping — what is the exact plan? What will each of us do?', '[After the helping action] Before we move on — sit for one moment. How do you feel right now? Where do you feel it in your body?'],
  close: 'What you did today changed something — made something better — in the actual world. That is compassion in action. You are people who do something when someone needs help.',
  questions: { beginner: ['How can we help?','How did it feel to help someone?'], intermediate: ['Why is compassion important?','How do you think the person or thing you helped feels now?'], advanced: ['What is the difference between feeling sorry for someone and actually helping them?','How can one small act of compassion grow into something bigger?'], openEnded: ['What did you learn about yourself by helping today?','If you could help one more thing in the world, what would it be?'] },
  responses: { typical: 'Children engage enthusiastically with hands-on helping; reflection requires adult facilitation to go beyond surface responses.', strong: 'Children connect the helping action to longer-term impact and identify how they want to continue helping.', shy: 'Hands-on helping activities often draw out shy children — doing together removes the pressure of speaking.', limitedLanguage: 'Children communicate through the helping action itself and through facial expression during reflection.' },
  shySupport: { prompts: ['You just showed compassion through what you DID — you do not have to explain it.','What does your body feel like right now after helping?'], alternatives: ['Draw or paint the helping action as the reflection activity', 'Photo documentation of the helping action creates a concrete artifact of compassion for portfolio'], encouragement: ['You did not just FEEL compassion — you acted on it. That is what makes a difference.','The world is actually better because of what you did today.'] },
  observation: ['Do children identify real needs in their community with teacher guidance?','Do children plan AND execute the helping action (not just discuss it)?','Do children show genuine emotional response (satisfaction, pride, warmth) after the helping action?','Does compassion practice influence classroom peer behavior in the following days?'],
  rubric: { beginning: 'Child cannot identify a need or shows no emotional response to others\' distress.', developing: 'Child identifies a need and participates in helping with adult direction; shows minimal emotional response.', proficient: 'Child identifies need, contributes meaningfully to the helping plan and action, and shows genuine emotional satisfaction.', advanced: 'Child initiates compassionate action independently, recruits peers to join, and can articulate the sustained impact of their helping beyond the immediate moment.' },
  teacherNotes: ['{child} suggested writing cards for residents at the senior center near the school — unprompted, genuine compassion identification and action initiation.', 'During Compassion in Action, {child} held the hand of a younger child who was crying in the hallway without being asked — spontaneous compassionate action from character education learning.'],
  parentReport: { example: 'Today we did something real and meaningful for someone in our community during Compassion in Action. Your child helped identify a need, plan the response, and carry it out. The look on their face afterward said it all — the profound satisfaction of genuine compassion in action. This is character education at its most powerful: not talked about, but lived. Your child showed beautiful heart today.', homeExtension: 'This week, invite your child to find one way to help someone in your family or neighborhood — a real need, a real action. Ask afterward: "How did that feel?" The emotional experience of helping is what makes it stick as a character value for life.' },
  variations: { smallGroup: 'Small group planning committees: divide the helping project into roles across small groups.', wholeClass: 'Class compassion project: larger impact, stronger community identity — e.g., food drive, care packages, community garden.', outdoor: 'Outdoor compassion: picking up litter, caring for school garden, creating a bird habitat.', indoor: 'Writing letters, drawing pictures, creating care packages for someone who needs support.', lowResource: 'A handwritten note, a drawn picture, or 10 minutes spent with someone lonely — compassion costs nothing.' },
  classroomMgmt: { transitions: 'Compassion actions can be woven into transitions — brief acts of care during natural breaks.', disruptions: 'If children are not taking the helping action seriously, connect more deeply to WHO is being helped: make the recipient real.', participation: 'Every child has a role in compassion projects — from planning to execution to reflection.', diverseLearners: 'Compassion can be expressed in any modality — art, physical help, presence, preparation. Match expression mode to individual strengths.' },
  materials: { required: ['Varies by helping activity — plan in advance'], optional: ['Photography for documentation','Materials for care packages, letters, or art gifts'], printable: ['Compassion planning worksheet','Our Class Compassion Action documentation card'], digital: ['Sesame Street: kindness and helping others episodes'] }
};

})(); // end loadPreschoolCoaching2

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 14 — COACHING DATA: SCHOOL AGE — LANGUAGE & COGNITIVE
   ───────────────────────────────────────────────────────────────────────────── */
(function loadSchoolAgeCoaching1() {

COACHING_DATA['sal1'] = {
  intro: 'Reading Workshop starts now. For the next 20 minutes, you read independently. Choose a book you genuinely want to read — that is the only rule.',
  tips: ['Book selection is critical — spend 5 minutes helping every child find a book they are actually interested in before independent reading begins', 'Confer with 3-4 individual readers during each session using the "teach one thing" model', 'Reading response journals should be low-stakes and genuinely reflective — not comprehension quizzes in disguise'],
  prompts: ['Tell me about what you are reading. What is happening? Where do you think it is going?', 'What did you write in your response journal? Read me your most powerful sentence.', 'You just read for 18 minutes without stopping. That is reading stamina. How does it feel?'],
  close: 'The best readers read every day because they want to, not because they have to. What you built today — reading stamina, a response, a recommendation — that is real reading work.',
  questions: { beginner: ['What happened in your book?','What was the main message?'], intermediate: ['What is the most interesting thing you noticed about how the author wrote this?','Would you recommend this book? To whom? Why?'], advanced: ['What question would you ask the author if you could?','How does this book connect to something real in your life or the world?'], openEnded: ['What did this book make you think about that you had not thought about before?','If you could change one thing about this story, what would it be and why?'] },
  responses: { typical: 'Students read for 12-15 minutes before attention drifts; responses are plot summary rather than reflection.', strong: 'Students sustain reading for the full session, write reflective journal entries that go beyond plot, and articulate specific author craft observations.', shy: 'Reading Workshop is often a relief for shy children — it is inherently private and individual.', limitedLanguage: 'Students benefit from books in both English and their home language — bilingual reading is equally valid and powerful.' },
  shySupport: { prompts: ['Your journal is just for you — unless you want to share.', 'Tell me the one thing you are most curious about in your book right now.'], alternatives: ['Allow drawing as an alternative to written journal entries', 'Paired reading with a trusted peer reduces reading anxiety'], encouragement: ['Your reading stamina is growing every single week.', 'The insight you wrote in your journal is something many adults would not have noticed.'] },
  observation: ['How long can individual students sustain independent reading before needing redirection?', 'Are response journal entries moving from plot summary toward reflection and interpretation?', 'Which students are choosing appropriate challenge-level books?', 'Which students need book recommendations and conferring support most urgently?'],
  rubric: { beginning: 'Student cannot sustain independent reading for more than 5 minutes; avoids reading or flips pages without reading.', developing: 'Student reads for 10-12 minutes; response journal is basic plot summary.', proficient: 'Student reads for the full session; response journal shows genuine reflection, connection, or question.', advanced: 'Student reads beyond the session, writes rich analytical responses, makes cross-text connections, and recommends books to peers with compelling rationale.' },
  teacherNotes: ['{child} read for the full 20-minute session without a single distraction and wrote three questions for the author in their response journal — extraordinary reading engagement.', 'During Reading Workshop, {child} recommended their book to a peer and described the specific moment that made them love it — reading community in action.'],
  parentReport: { example: 'Today your child participated in Reading Workshop — 20 minutes of independent reading followed by journaling and sharing. Reading stamina is a skill that develops through daily practice, and your child showed real growth today. The most powerful thing you can do at home is read yourself where your child can see you — modeling that reading is what capable adults do for pleasure.', homeExtension: 'Establish a 15-20 minute family reading time 3-4 evenings per week where everyone reads their own book simultaneously. No phones, no TV — just reading together in the same space. This single habit, sustained for one month, transforms reading attitudes dramatically.' },
  variations: { smallGroup: 'Book clubs: small groups reading the same text meet weekly to discuss, debate, and respond together.', wholeClass: 'Read-aloud with discussion: teacher models fluent, expressive reading and think-alouds about comprehension.', outdoor: 'Outdoor reading: books and journals taken outside — nature reading is relaxing and motivating.', indoor: 'Cozy reading nooks throughout the classroom create psychological space for deep reading engagement.', lowResource: 'Public library cards and audiobooks are free resources that open entire reading worlds.' },
  classroomMgmt: { transitions: 'Signal reading workshop with a specific routine: lights dimmed, soft music, everyone to their reading spot.', disruptions: 'Confer privately with students who are not reading; often book mismatch (too hard/easy/uninteresting) is the cause.', participation: 'A student who truly cannot read independently needs a read-along audio version or partner reading — never shamed.', diverseLearners: 'Audiobooks, graphic novels, hi-lo readers, and bilingual texts all count as reading. Accessibility is the goal.' },
  materials: { required: ['Books at varied reading levels', 'Reading response journals'], optional: ['Reading goal trackers', 'Sticky notes for text marking', 'Book recommendation wall'], printable: ['Reading response journal prompts', 'Independent reading log'], digital: ['Epic! reading app (free for educators)', 'Audible and Libby for audiobooks', 'Storyline Online'] }
};

COACHING_DATA['sal2'] = {
  intro: 'Today is Writing Workshop. We start with a 5-minute mini-lesson on one skill, then you write for 15 minutes. After that, we share. Let\'s begin.',
  tips: ['One skill per mini-lesson — trying to teach three things simultaneously means children learn none of them', 'Share your own writing as a model, including your own drafts with cross-outs and revisions visible', 'Peer sharing with a specific feedback protocol ("I noticed... I wonder...") is far more powerful than teacher-only feedback'],
  prompts: ['Mini-lesson focus today: specific, sensory detail. Instead of "the dog ran," try "the muddy golden retriever bolted across the wet grass." Hear the difference?', 'Write for 15 minutes. If you get stuck, write what you cannot figure out how to write yet — keep the pen moving.', 'Share your most powerful sentence. Just one — the one you are most proud of. Read it slowly.'],
  close: 'Every great writer wrote terrible first drafts. What matters is that you wrote, you tried, and you revised. That is the whole job.',
  questions: { beginner: ['What is your story about?', 'How can you add more specific detail?'], intermediate: ['What is the emotion you want the reader to feel in this part?', 'Where could you add a detail that makes this scene feel real?'], advanced: ['Read your most powerful sentence. Why does it work?', 'If you could cut 20% of your draft, what would you cut and why?'], openEnded: ['What truth are you trying to tell in this piece?', 'What is the one thing you want a reader to remember after finishing?'] },
  responses: { typical: 'Students write 2-4 sentences in 15 minutes; share plot summaries rather than polished prose.', strong: 'Students write a full paragraph with intentional craft choices they can explain; revision is genuine rather than surface-level.', shy: 'Writing can be a powerful outlet for shy children — they often produce rich, authentic work without verbal performance pressure.', limitedLanguage: 'Bilingual writing (mixing languages) is a sophisticated skill that should be honored rather than corrected.' },
  shySupport: { prompts: ['You never have to share unless you want to. What you write is yours.', 'Read just one word or phrase — whatever you feel okay sharing.'], alternatives: ['Written sharing via a class blog or posted anonymously removes verbal performance pressure', 'Drawing a scene before writing it provides scaffolding for reluctant writers'], encouragement: ['That sentence just made me feel something real. That is real writing.', 'You said you could not write but you just filled half a page — you are a writer.'] },
  observation: ['Are students writing for the full 15 minutes or stopping and waiting?', 'Are students revising or only adding length?', 'Are students using the mini-lesson skill in their actual writing (not just in isolation)?', 'Are students developing a writing identity — do they see themselves as writers?'],
  rubric: { beginning: 'Student writes less than 2 sentences; cannot sustain writing or apply any craft elements independently.', developing: 'Student writes a paragraph with basic story structure; applies mini-lesson skill with significant scaffolding.', proficient: 'Student writes 2+ paragraphs with intentional craft choices; revises specific sections based on peer or teacher feedback.', advanced: 'Student produces polished prose with sophisticated craft elements, revises globally (not just surface corrections), and provides substantive feedback to peers.' },
  teacherNotes: ['{child} revised a paragraph three times today, each version demonstrably stronger — revision is the mark of a serious writer and {child} is becoming one.', 'During Writing Workshop, {child} used an unexpected metaphor that stopped the sharing circle — genuine literary voice emerging.'],
  parentReport: { example: 'Today was Writing Workshop day. Your child worked on a piece of writing using a specific craft skill — today\'s focus was sensory detail. After writing, they shared with a partner using a structured feedback protocol. Your child produced something genuinely their own. Writing develops through practice and real audience — ask your child to read you what they wrote today.', homeExtension: 'Keep a family journal where each person writes one sentence about their day at dinner. No corrections, no grammar feedback — just authentic expression. Read them aloud at the end of the week. This builds writing habit and family story simultaneously.' },
  variations: { smallGroup: 'Writing conferences: teacher meets with 2-3 students to look at drafts and teach one specific revision skill.', wholeClass: 'Gallery walk: finished pieces posted, students give sticky-note feedback using the protocol.', outdoor: 'Nature writing: go outside for 10 minutes of observation, then write from sensory notes taken outdoors.', indoor: 'Writing center with diverse prompt cards, vocabulary references, and mentor text excerpts.', lowResource: 'All you need is paper and a pencil — writing is the most resource-minimal literacy activity possible.' },
  classroomMgmt: { transitions: 'Signal writing time with a consistent ritual: "Pens and pencils ready. Timer starts now."', disruptions: 'Students who cannot start benefit from an oral rehearsal: "Tell me your story out loud first, then write what you just said."', participation: 'Students who resist writing often have undiagnosed writing challenges — refer for assessment while providing scaffolded alternatives.', diverseLearners: 'Dictation technology, graphic organizers, sentence frames, and word walls dramatically level the writing playing field.' },
  materials: { required: ['Writing journals', 'Writing prompt cards (optional — student topics preferred)'], optional: ['Mentor text excerpts', 'Vocabulary anchor charts', 'Editing checklists'], printable: ['Writing craft mini-lesson reference cards', 'Peer feedback protocol ("I noticed... I wonder...")'], digital: ['Google Docs for collaborative writing', 'Book Creator for multimedia stories'] }
};

COACHING_DATA['sal3'] = {
  intro: 'Today we are doing something harder than most tests — we are going to discuss a real question together and disagree respectfully. Ready?',
  tips: ['Choose discussion topics that genuinely have multiple defensible positions — there should be no single right answer', 'Explicitly teach the language of respectful disagreement before the first discussion: "I see it differently because..."', 'Your job during discussion is to ask follow-up questions and track thinking, not to share your own opinion'],
  prompts: ['Think about the question for 2 minutes before you speak — put your thoughts in order.', 'You just shared an opinion. What is your EVIDENCE? What makes you think that?', '[To another student] You heard what Ana said. Do you agree, disagree, or see it a different way? Explain your thinking.'],
  close: 'You just did something that most adults struggle with: you disagreed with each other and stayed respectful. You listened even when you wanted to talk. That is civic discourse, and it is one of the most important skills in a democracy.',
  questions: { beginner: ['What do you think? Why?', 'Does anyone see it differently?'], intermediate: ['What evidence supports your view?', 'What is the strongest argument for the OPPOSITE position?'], advanced: ['How has your thinking changed after listening to others?', 'What would it take to change your mind on this?'], openEnded: ['What is the most interesting thing someone said that you had not thought of before?', 'What question does this discussion leave you with?'] },
  responses: { typical: 'Students share opinions without evidence; switch positions when socially pressured rather than intellectually persuaded.', strong: 'Students offer evidence-based arguments, engage with opposing views, and track how their thinking has evolved.', shy: 'Think-pair-share before whole-group discussion gives shy students a rehearsal space and greatly increases participation.', limitedLanguage: 'Sentence frames for discussion participation ("I think... because...", "I agree with ___ and want to add...") dramatically increase access.' },
  shySupport: { prompts: ['You can pass if you are not ready. I will come back to you.', 'You whispered a great point to your partner — would you share just that one thing?'], alternatives: ['Written response shared by teacher anonymously: "Someone in our class had this interesting thought..."', 'Fishbowl format: smaller inner circle discussion while others observe — reduces exposure anxiety'], encouragement: ['You just changed your mind based on evidence — that is intellectual honesty and intellectual courage.', 'Your point shifted the whole discussion. That is what strong thinkers do.'] },
  observation: ['Are students providing evidence or only opinions?', 'Are students genuinely listening to peers or just waiting to speak?', 'Are students changing their positions based on new evidence (good) or social pressure (problematic)?', 'Who is dominating and who is silent — how to redistribute voice?'],
  rubric: { beginning: 'Student cannot participate in discussion; either refuses to speak or cannot stay on topic.', developing: 'Student shares an opinion; struggles to provide evidence; is not yet responsive to peers\' ideas.', proficient: 'Student offers evidence, responds directly to peers\' arguments, and uses respectful disagreement language.', advanced: 'Student synthesizes multiple viewpoints, identifies logical weaknesses in arguments including their own, and helps facilitate the discussion for others.' },
  teacherNotes: ['{child} said "I changed my mind after what James said — I had not thought about that side" during our discussion — the pinnacle of structured discourse.', 'During Structured Discussion, {child} asked a follow-up question to a peer\'s argument that pushed the whole discussion to a deeper level — sophisticated facilitative thinking.'],
  parentReport: { example: 'Today your child participated in a Structured Discussion — sharing opinions, providing evidence, and practicing respectful disagreement with peers. This is one of the most important academic and civic skills we develop. Your child showed real intellectual courage today. Dinner-table discussions about current events or ethical questions are among the best ways to deepen these skills at home.', homeExtension: 'Once a week at dinner, introduce a "discussion question" — something with no single right answer. Encourage everyone to share their view and one piece of evidence. Model respectful disagreement: "I see it differently — here is why." You are building critical thinking and civic discourse at the kitchen table.' },
  variations: { smallGroup: 'Socratic seminar in groups of 6-8: more voice time for each student than whole-class discussion.', wholeClass: 'Fishbowl discussion: 6 students discuss in the center while others observe and then swap.', outdoor: 'Walking discussion: walking in pairs discussing a question — movement reduces inhibition.', indoor: 'Circle arrangement is essential — all students must be able to see each other to have genuine dialogue.', lowResource: 'Only a good question is needed. No materials required.' },
  classroomMgmt: { transitions: 'Give 2 minutes of written thinking time before discussion — this ensures all students enter with a position.', disruptions: 'If one student dominates, use a talking token system — each student gets 2-3 tokens and must spend them when they speak.', participation: 'Cold-calling without prior thinking time is anxiety-producing — always give thinking time first.', diverseLearners: 'Discussion sentence frames should be posted visually during every discussion; they benefit all students, not only those with language challenges.' },
  materials: { required: ['Discussion topic card displayed where all can read it'], optional: ['Talking tokens', 'Discussion stem anchor chart', 'Discussion observation form for teacher'], printable: ['Discussion sentence frames poster', 'Self-assessment: How did I participate today?'], digital: [] }
};

COACHING_DATA['sal4'] = {
  intro: 'Today we become vocabulary detectives. Our job: encounter words we do not know and figure them out using the clues the author left us.',
  tips: ['Model the detective process explicitly with 2-3 examples before students work independently', 'Context clues work at multiple levels: word-level (surrounding words), sentence-level, and passage-level — teach all three', 'Vocabulary journals should be owned by students — they choose which words to record beyond the required 3-5'],
  prompts: ['Here is the word: "The children were famished by the time the long hike ended." What clues do you see around "famished"?', 'Now check your guess with the dictionary. How close were your context clues? What did the clues tell you? What did they miss?', 'Write your own sentence using "famished" — one that gives the reader context clues about its meaning without defining it directly.'],
  close: 'You will encounter tens of thousands of new words in your reading life. Now you have a tool that works every single time — even without a dictionary nearby.',
  questions: { beginner: ['What do you think this word means?', 'What clues helped you figure it out?'], intermediate: ['What in the surrounding text pointed you toward that meaning?', 'How confident are you in your guess — and why?'], advanced: ['What would be a more precise definition based on the context?', 'How does knowing this word change your understanding of the passage?'], openEnded: ['Which strategy helped most: the word itself, the sentence, or the paragraph?', 'What is the most interesting word you have encountered this month and why?'] },
  responses: { typical: 'Students use immediate surrounding words for context clues; dictionary confirmation helps build accuracy.', strong: 'Students synthesize multiple levels of context clues and can articulate their reasoning strategy explicitly.', shy: 'Vocabulary detective work is individual and non-performative — well-suited to shy students.', limitedLanguage: 'Cognate strategy (Spanish/English word families) is a powerful tool for bilingual students — teach it explicitly.' },
  shySupport: { prompts: ['Write your guess in your journal before sharing — that way you already have an answer when I ask.', 'Your guess does not have to be perfect. A close guess IS the skill.'], alternatives: ['Partner vocabulary detective work reduces individual performance pressure', 'Allow drawing the meaning as a first step before writing a definition'], encouragement: ['Your context clue reasoning was exactly right — your detective skills are strong.', 'You were the closest of anyone to the actual definition. How did you know?'] },
  observation: ['Are students making evidence-based guesses versus random guesses?', 'Are students using multiple levels of context (not just adjacent words)?', 'Are students retaining vocabulary across days and applying new words in their own speech/writing?', 'Which students need explicit decoding support before vocabulary strategy can be applied?'],
  rubric: { beginning: 'Student guesses word meanings randomly with no reference to context; does not use any strategy.', developing: 'Student identifies adjacent context clues and makes a partially accurate guess; confirms with dictionary.', proficient: 'Student uses multi-level context clues to generate an accurate definition; records new words and uses them in original sentences.', advanced: 'Student transfers strategy to all independent reading, owns a rich vocabulary journal, and uses sophisticated new words accurately in speaking and writing.' },
  teacherNotes: ['{child} used a sentence-level context clue AND a root word analysis to arrive at the precise definition of "tenacious" — metacognitive vocabulary strategy at the highest level.', 'During Vocabulary Detective, {child} said "I can tell it means something bad because of the character\'s face in the illustration" — cross-modal context clue use.'],
  parentReport: { example: 'Today we practiced our Vocabulary Detective strategy — using context clues to figure out unfamiliar words without a dictionary. Your child worked through several real words from authentic text and became increasingly accurate. This strategy is one of the highest-leverage reading skills because it works in any book, any subject, forever. Reading rich texts at home (not just easy comfortable ones) gives this strategy its fuel.', homeExtension: 'When you encounter an unfamiliar word in conversation or reading together, stop and say "Vocabulary detective time — what do the clues tell us about what this word means?" Turn it into a game rather than a lesson. The hunt is more fun than the answer.' },
  variations: { smallGroup: 'Vocabulary detective teams: small groups tackle the same passage and compare reasoning strategies.', wholeClass: 'Class vocabulary wall: new discovered words added collectively — builds shared vocabulary and ownership.', outdoor: 'Nature walk vocabulary: signs, plant labels, environmental print — apply context clue strategy to real-world text.', indoor: 'Vocabulary detective centers with varied genre texts for application across reading domains.', lowResource: 'Any text with rich vocabulary works. Library books, magazines, and even packaging labels are sufficient.' },
  classroomMgmt: { transitions: 'Vocabulary journal time works as a productive transition warm-up at the start of each language block.', disruptions: 'Students who feel overwhelmed by unknown words often have underlying decoding challenges — assess and address the root.', participation: 'Pair students strategically: one strong context clue user with one developing one — peer teaching accelerates both.', diverseLearners: 'Provide vocabulary organizers with sentence frames for definition writing; audio versions of texts for students who need decoding support.' },
  materials: { required: ['Text with rich vocabulary (authentic literature or non-fiction)', 'Vocabulary journals'], optional: ['Class dictionary', 'Word root reference cards', 'Vocabulary graphic organizers'], printable: ['Vocabulary detective graphic organizer', 'Root words and affixes reference chart'], digital: ['Vocabulary.com', 'Merriam-Webster online dictionary'] }
};

/* ── SCHOOL AGE COGNITIVE ── */
COACHING_DATA['sac1'] = {
  intro: 'Engineers solve problems by thinking carefully, building something, testing it, and improving it. Today you are engineers. Here is your challenge.',
  tips: ['Read the challenge card together and answer every clarifying question before the build begins — ambiguity wastes time and creates frustration', 'The planning phase is as important as the build: require a drawn plan before any material is touched', 'A failed test is the best possible outcome — it gives data. Celebrate failures as information, not defeat'],
  prompts: ['Before you touch any materials: draw your plan. What will you build? How will you build it? What might fail?', '[During testing] It did not hold. That is information! What did you learn from that failure? What do you adjust?', 'What would you do differently if you had twice as much time? That is your growth edge as an engineer.'],
  close: 'What you did today is exactly what engineers do: they plan, build, test, fail, learn, and redesign. The best engineers are the ones who fail most productively.',
  questions: { beginner: ['What was your plan?', 'What worked well?'], intermediate: ['What would you change next time?', 'Why did it fail where it failed?'], advanced: ['What forces were acting on your structure that you had to account for?', 'How did your team\'s design differ from others, and why?'], openEnded: ['What does engineering have in common with problem-solving in everyday life?', 'If you could build anything to improve our school, what would it be?'] },
  responses: { typical: 'Groups build with enthusiasm but limited planning; fail on first test; need prompting to engage with the failure productively.', strong: 'Groups plan carefully, anticipate failure points, test systematically, and redesign based on specific observations.', shy: 'STEM challenges often reveal hidden strengths in shy children — they build quietly and often produce the most thoughtful designs.', limitedLanguage: 'Engineering is deeply non-verbal — building, pointing, gesturing, and demonstrating are all valid participation modes.' },
  shySupport: { prompts: ['You do not have to present — you could be the builder while others explain.', 'Tell me quietly what your idea is — I want to make sure your team hears it.'], alternatives: ['Written design journal role — shy student documents the process photographically or in writing', 'Design role: shy student draws the plan while extroverted peers execute — valid creative contribution'], encouragement: ['Your idea is in that structure — I can see your thinking in what was built.', 'You solved the weight distribution problem that stumped everyone else. That is engineering.'] },
  observation: ['Are students planning before building (vs. building impulsively)?', 'How do groups handle failure — frustration, giving up, or productive analysis?', 'Are students applying science concepts (force, weight, balance) to their engineering decisions?', 'Are all group members contributing, or are some passive while others dominate?'],
  rubric: { beginning: 'Student builds without planning; gives up after first failure; cannot explain the design.', developing: 'Student contributes to group plan; participates in build; describes what worked and what did not.', proficient: 'Student creates a drawn plan, builds systematically, uses failure data for redesign, and explains engineering choices.', advanced: 'Student leads design process, applies science concepts explicitly, conducts multiple test-redesign cycles, and articulates transferable engineering principles.' },
  teacherNotes: ['{child} predicted the exact failure point of the group\'s first tower design before it was tested — extraordinary analytical engineering thinking.', 'During STEM Engineering Challenge, {child} insisted the group try a third redesign iteration when others were satisfied with the second — growth mindset and engineering persistence.'],
  parentReport: { example: 'Today your child participated in a STEM Engineering Challenge — designing, building, testing, and improving a structure under specific constraints. This develops engineering thinking, productive failure tolerance, creative problem-solving, and teamwork. Your child was an engaged contributor today. Engineering thinking is a life skill far broader than building structures — it is how capable people approach any complex problem.', homeExtension: 'Give your child a building challenge at home: "Using only 10 popsicle sticks and glue, build the strongest possible bridge between two chairs." Watch the design process, the testing, and especially how they respond to failure. Ask "what would you change?" rather than "fix it."' },
  variations: { smallGroup: 'Smaller teams (2-3) ensure more equitable contribution and clearer individual accountability.', wholeClass: 'Class challenge with public testing: all designs tested simultaneously — builds community investment in each other\'s outcomes.', outdoor: 'Outdoor engineering: natural materials only (sticks, leaves, mud, stones) — removes the technological scaffold.', indoor: 'Maker station available throughout the week for continued iteration beyond the single session.', lowResource: 'Paper, tape, and index cards are the only materials needed for a rich engineering challenge.' },
  classroomMgmt: { transitions: 'Clean-up engineering is its own challenge: "How can we put all materials away in under 3 minutes?"', disruptions: 'Students who destroy others\' work need immediate private intervention and possible role reassignment.', participation: 'Assign specific roles before the challenge: Lead Designer, Materials Manager, Recorder, Presenter.', diverseLearners: 'Tactile, spatial, and kinesthetic learners often excel at STEM challenges — this is their curriculum home.' },
  materials: { required: ['Building materials: straws, tape, index cards, cups', 'Written challenge card'], optional: ['Timer', 'Scale for measuring weight in structural challenges', 'Camera for documenting iterations'], printable: ['Engineering design journal page', 'STEM challenge card templates'], digital: ['PBS Design Squad engineering challenges', 'NASA STEM activities for kids'] }
};

COACHING_DATA['sac2'] = {
  intro: 'Today math leaves the textbook and enters the real world. We solve one problem that actually matters to someone.',
  tips: ['Choose word problems set in contexts genuinely relevant to your students\' lives — motivation is the first lever of mathematical engagement', 'Require students to identify what they KNOW and what they need to FIND before any calculating begins', 'Insist on showing work: the mathematical communication is as important as the answer'],
  prompts: ['Read the problem again slowly. What information do you know? Write it all down first.', 'Before you calculate — what kind of answer are we looking for? A number of people? A price? A distance? What unit?', 'You have an answer. Does it make sense? Is it reasonable given the situation? How do you know?'],
  close: 'Every word problem you solved today was a real-world situation wearing a math costume. This is what math is actually for.',
  questions: { beginner: ['What information do you know?', 'What are you trying to find?'], intermediate: ['Does your answer make sense?', 'How did you decide which operation to use?'], advanced: ['Is there another strategy that would also work?', 'What would change in the math if the numbers in the problem changed?'], openEnded: ['Where do you see this kind of math in real life outside school?', 'What makes a math problem feel relevant and interesting to you?'] },
  responses: { typical: 'Students rush to calculate before identifying what is known and needed; answers are often correct but reasoning is unclear.', strong: 'Students identify known information, choose strategy deliberately, calculate accurately, and verify reasonableness of answer.', shy: 'Partner math is well-suited to shy students — they often prefer thinking aloud to one trusted peer rather than the whole class.', limitedLanguage: 'Word problems in bilingual versions dramatically increase access; allowing first-language thinking before English explanation is legitimate mathematical process.' },
  shySupport: { prompts: ['Work it through in your journal — bring it to me when you are ready and walk me through your thinking.', 'Pair with a partner: you solve, they check. Then switch.'], alternatives: ['Allow drawing or diagramming the problem before solving numerically', 'Reduce language complexity of word problem while maintaining mathematical complexity'], encouragement: ['Your strategy worked — and you explained it clearly. That is mathematical communication.', 'You checked your answer to see if it was reasonable. That is what mathematicians do.'] },
  observation: ['Are students reading problems multiple times before solving?', 'Are students identifying the unknown before calculating?', 'Are students choosing appropriate strategies or defaulting to the first that comes to mind?', 'Are students checking answers for reasonableness?'],
  rubric: { beginning: 'Student cannot identify what the problem is asking; guesses at calculation without reasoning.', developing: 'Student identifies the basic operation needed; calculates correctly but cannot explain reasoning.', proficient: 'Student identifies known and unknown, chooses strategy deliberately, calculates accurately, and verifies reasonableness.', advanced: 'Student solves using multiple strategies, explains mathematical reasoning clearly, creates their own real-world problem using the same mathematical structure.' },
  teacherNotes: ['{child} solved the problem using two different strategies and compared the answers to verify correctness — sophisticated mathematical metacognition.', 'During Real-World Math, {child} said "This doesn\'t make sense because no store would charge that much" and caught their own calculation error — real-world reasonableness checking.'],
  parentReport: { example: 'Today your child worked on Real-World Math — solving problems set in authentic contexts that require identifying what is known, choosing a strategy, and verifying that the answer makes sense. This kind of mathematical thinking is what life actually requires. Your child engaged thoughtfully. You can reinforce this at home by involving your child in real math: calculating change, doubling recipes, estimating distances.', homeExtension: 'Include your child in real family math: grocery budget estimation, calculating a tip, measuring for a home project. "How much will this cost?" and "How much is left?" are more powerful math teachers than any worksheet.' },
  variations: { smallGroup: 'Math talks: small groups share multiple strategies for the same problem and compare efficiency.', wholeClass: 'Number talks: brief, whole-class mental math discussions build mathematical reasoning and number sense simultaneously.', outdoor: 'Measurement challenges outside: estimate, measure, and calculate real distances, areas, and quantities.', indoor: 'Math stations: different problem types at different stations for differentiated simultaneous practice.', lowResource: 'Paper, pencil, and a good word problem are all that is needed.' },
  classroomMgmt: { transitions: 'Mental math challenges as class transitions between activities: "Calculate 36 times 4 as we line up — be ready with your answer."', disruptions: 'Students who give up early on word problems often need the language complexity reduced, not the math.', participation: 'Partner strategies mean every student is actively engaged, not just the quickest finishers.', diverseLearners: 'Manipulatives (blocks, counters, number lines) remain valid supports at all grade levels for all learners.' },
  materials: { required: ['Word problem cards', 'Scratch paper or math journals'], optional: ['Manipulatives for concrete modeling', 'Calculator for computation-heavy problems (to focus on reasoning, not arithmetic)'], printable: ['Real-world math problem card sets', 'Mathematical reasoning graphic organizer'], digital: ['Khan Academy real-world math problems', 'Desmos classroom activities'] }
};

COACHING_DATA['sac3'] = {
  intro: 'Scientists do not just read about the world — they investigate it. Today we run an investigation using the exact same process real scientists use.',
  tips: ['The question must come from genuine student curiosity when possible — bought-in scientists ask better questions', 'Hypothesis formation is the most important step to teach explicitly: a hypothesis is a testable prediction with reasoning, not a guess', 'Data recording must be specific and measurable: teach students to record what they OBSERVE, not what they interpret'],
  prompts: ['Before we start — what do we predict will happen? Write your hypothesis: "I think ___ will happen because ___."', '[During observation] Write exactly what you SEE, not what you think it means. Observations are facts; interpretations come after.', 'Was your hypothesis correct? Whether yes or no — what did you actually learn?'],
  close: 'Scientists are wrong about half the time. A wrong hypothesis that teaches you something new is more valuable than a correct guess that teaches you nothing.',
  questions: { beginner: ['What is your hypothesis?', 'What did you observe?'], intermediate: ['Was your prediction correct? Why or why not?', 'What would you change about your experiment to get better data?'], advanced: ['What variables could have affected your results?', 'How would you design a follow-up investigation?'], openEnded: ['What does this result make you wonder about?', 'What would have to be true for your original hypothesis to be correct?'] },
  responses: { typical: 'Students make predictions without reasoning; record interpretations rather than observations; accept first results without questioning.', strong: 'Students write reasoned hypotheses, record precise observational data, identify variables, and propose follow-up investigations.', shy: 'Lab work is excellent for shy students — focus on the natural world rather than social performance.', limitedLanguage: 'Scientific observation can be recorded through drawing, labeling, and measurement — not exclusively through written prose.' },
  shySupport: { prompts: ['Your job right now is just to watch very carefully and record what you see.', 'Draw what you observe — detailed scientific drawings are how many scientists communicate.'], alternatives: ['Allow lab partner to record while shy student directs the observation', 'Photo documentation as a legitimate scientific recording method'], encouragement: ['You noticed something nobody else noticed. That is what great scientists do.', 'Your data was the most precise in the class. Scientific precision is a real skill.'] },
  observation: ['Are students forming reasoned hypotheses or random guesses?', 'Are students recording observations vs. interpretations?', 'Are students identifying variables that could affect results?', 'Are students showing intellectual honesty when results contradict their hypothesis?'],
  rubric: { beginning: 'Student cannot form a hypothesis or record observations systematically; conflates observation with interpretation.', developing: 'Student forms a basic hypothesis; records some observations; identifies whether hypothesis was correct.', proficient: 'Student writes a reasoned hypothesis; records systematic observations; identifies variables; draws evidence-based conclusions.', advanced: 'Student designs controlled experiment, identifies confounding variables, proposes follow-up investigations, and demonstrates intellectual honesty about limitations.' },
  teacherNotes: ['{child} designed a control condition for their experiment without being prompted — sophisticated experimental thinking at this age.', 'During Scientific Investigation, {child} said "Our data doesn\'t support our hypothesis but I think I know why — the temperature changed" — authentic scientific reasoning in action.'],
  parentReport: { example: 'Today your child ran a scientific investigation using the complete scientific method — question, hypothesis, experiment, observation, and conclusion. This builds analytical thinking, intellectual honesty, and the understanding that knowledge is built through testing, not assertion. Your child was a focused, engaged investigator today. Science at home is everywhere: cooking, gardening, watching weather, observing animal behavior.', homeExtension: 'Run a simple kitchen science investigation together: "Does water boil faster with or without a lid? What is your hypothesis? Let\'s test it." The process — predict, test, observe, conclude — is far more valuable than any specific result.' },
  variations: { smallGroup: 'Lab partner pairs: two students increase discussion and reduce individual pressure while maintaining accountability.', wholeClass: 'Whole-class investigation with individual hypothesis and data — shared experiment, personal scientific thinking.', outdoor: 'Outdoor science: ecology, weather, plant growth, soil composition — living labs available in every schoolyard.', indoor: 'Science stations with varied investigations for differentiated challenge and interest.', lowResource: 'Vinegar, baking soda, water, and a thermometer can power dozens of investigations at essentially zero cost.' },
  classroomMgmt: { transitions: 'Lab setup and cleanup are part of the scientific routine — build these into the time allocation.', disruptions: 'Students who rush to the "answer" need explicit coaching in slowing down to observe. Process before conclusion.', participation: 'Assign lab roles: observer, recorder, materials manager — ensures every student has an active function.', diverseLearners: 'Adapted recording tools (voice recording, drawing, digital photography) allow full investigation participation for diverse learners.' },
  materials: { required: ['Experiment materials (vary by investigation)', 'Science notebooks for recording'], optional: ['Magnifying glasses', 'Measuring tools', 'Camera for documentation'], printable: ['Scientific method graphic organizer', 'Lab report template'], digital: ['PBS Learning Media science resources', 'NASA science activities for kids'] }
};

COACHING_DATA['sac4'] = {
  intro: 'Today we start with a question: what is a computer? Not what it looks like — what does it actually DO? Everything it does, humans can describe in steps.',
  tips: ['Unplugged coding activities (human robots, paper algorithms) build computational thinking without technology barriers', 'Debugging (finding and fixing errors) is the core skill — celebrate every bug found as a success', 'Connect coding concepts to everyday procedures: a recipe is an algorithm; morning routines are sequential programs'],
  prompts: ['Write step-by-step instructions for making a sandwich — instructions that a robot who has never eaten would understand. Be EXACT.', '[After the "robot" fails] The robot did exactly what the instructions said. Who made the mistake — the robot or the programmer? Fix the bug.', 'You just found and fixed a bug in your code. Debugging is what programmers spend most of their time doing. You are doing real programming work.'],
  close: 'Every app, every website, every game was built from exactly what you practiced today: precise instructions given to a machine that does exactly what it is told — nothing more, nothing less.',
  questions: { beginner: ['What instruction comes first?', 'What happened when you ran that code?'], intermediate: ['How do you find and fix the bug?', 'What does a loop instruction do?'], advanced: ['Why is precision so important in programming?', 'What happens if a step is in the wrong order?'], openEnded: ['What problem in your life would you solve with code if you could?', 'What do you think programming will look like in 20 years?'] },
  responses: { typical: 'Students underestimate the precision required; first algorithms have multiple bugs; fixing bugs is satisfying when framed as detective work.', strong: 'Students write precise, bug-free algorithms; transfer computational thinking to non-coding contexts; debug efficiently using systematic testing.', shy: 'Coding and computational thinking often appeal strongly to shy, detail-oriented students.', limitedLanguage: 'Coding is fundamentally universal — code works the same in every human language context.' },
  shySupport: { prompts: ['You do not need to ask for help yet — try to find the bug yourself first.', 'Show me what your code does, step by step.'], alternatives: ['Pair programming: one "driver," one "navigator" — collaborative but structured', 'Unplugged coding activities require no verbal performance'], encouragement: ['You found that bug in under two minutes. That is efficient debugging.', 'Your algorithm worked perfectly on the first run. That takes real precision and care.'] },
  observation: ['Are students approaching bugs with curiosity or frustration?', 'Are students testing systematically or randomly?', 'Are students transferring algorithmic thinking to non-coding contexts?', 'Which students show natural aptitude for computational thinking?'],
  rubric: { beginning: 'Student cannot write a multi-step algorithm; gives up when first attempt does not work.', developing: 'Student writes a basic algorithm with 2-3 steps; identifies bugs with teacher guidance.', proficient: 'Student writes a complete, precise algorithm; independently identifies and fixes bugs; explains computational thinking concepts.', advanced: 'Student writes efficient algorithms with loops and conditionals; debugs systematically; applies computational thinking to diverse non-coding challenges.' },
  teacherNotes: ['{child} debugged their sandwich algorithm by testing each step against the "robot\'s" literal interpretation — systematic debugging methodology emerging.', 'During Coding session, {child} recognized that a loop would make their code significantly shorter and rewrote it unprompted — abstraction and efficiency thinking.'],
  parentReport: { example: 'Today your child explored coding and computational thinking — writing precise step-by-step algorithms and debugging errors. These skills are increasingly essential in nearly every career field, and the underlying thinking (breaking problems into precise steps, testing systematically, fixing errors) is universally valuable. Your child showed real aptitude today. Free coding resources are available at Code.org for home exploration.', homeExtension: 'Try the "robot game" at home: your child gives you step-by-step instructions to make a snack, and you follow them literally — do exactly what they say, nothing more. When it goes wrong (and it will), they debug the instructions. It is hilarious and genuinely powerful computational thinking practice.' },
  variations: { smallGroup: 'Paired programming: consistent pairs rotate between driver and navigator roles.', wholeClass: 'Whole-class unplugged algorithm: class writes one algorithm together on the board for the "human robot" to execute.', outdoor: 'Outdoor coding grid: create a life-size coding grid with tape; students navigate it using written directional code.', indoor: 'Coding center with tablets for Scratch Jr., Code.org, or Tynker alongside unplugged activities.', lowResource: 'Unplugged coding with paper, pencil, and human robots requires no technology at all.' },
  classroomMgmt: { transitions: 'Save and close protocols for digital work need explicit teaching — use a consistent shutdown routine.', disruptions: 'Students who use devices inappropriately need offline alternatives immediately available.', participation: 'Pair programming ensures no student can be passive while also providing social support for struggling coders.', diverseLearners: 'Block coding (Scratch, Blockly) removes typing barriers; unplugged activities remove technology access barriers entirely.' },
  materials: { required: ['Unplugged coding cards or tablets with Scratch/Code.org'], optional: ['Life-size coding grid materials', 'Robot toy for directional coding practice'], printable: ['Algorithm writing templates', 'Debugging checklist'], digital: ['Code.org free curriculum', 'Scratch (scratch.mit.edu)', 'Tynker for kids'] }
};

})(); // end loadSchoolAgeCoaching1

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 15 — COACHING DATA: SCHOOL AGE — SOCIAL, PHYSICAL, CREATIVITY,
                LIFE SKILLS, HEALTH & CHARACTER
   ───────────────────────────────────────────────────────────────────────────── */
(function loadSchoolAgeCoaching2() {

/* ── SCHOOL AGE SOCIAL ── */
COACHING_DATA['sas1'] = {
  intro: 'Today we practice a 4-step conflict resolution protocol. Real conflicts happen — this is the tool that makes them productive instead of destructive.',
  tips: ['Both parties must feel heard before any solution is sought — rushing to solutions without genuine listening creates resentment, not resolution', 'Role-play the protocol with fictional scenarios first; applying a new tool to a real, emotionally charged conflict is too difficult initially', 'Debrief every real conflict resolution attempt within 24 hours: "That protocol you used — how did it feel? Did it work?"'],
  prompts: ['Step 1: Everyone calms down first. 30 seconds of deep breathing before any words.', 'Step 2: Each person shares their perspective completely without interruption. I will time it. [Set timer for 60 seconds each]', 'Step 3: Find common ground. What do you BOTH want to be true after this? Start there.'],
  close: 'You now have a tool that professional mediators, therapists, and diplomats use. The protocol is the same — the stakes just get bigger as you grow.',
  questions: { beginner: ['How do you feel?', 'What does the other person need?'], intermediate: ['What solution works for everyone involved?', 'What would you do differently to prevent this in the future?'], advanced: ['What was the underlying need driving the conflict?', 'How do you resolve a conflict with someone who does not want to use the protocol?'], openEnded: ['What is the hardest step of the protocol for you personally? Why?', 'What would school look like if everyone used this protocol consistently?'] },
  responses: { typical: 'Students can follow the protocol with adult facilitation; common ground identification is the hardest step.', strong: 'Students use the protocol independently, identify underlying needs behind stated positions, and reach genuinely satisfying resolutions.', shy: 'The structured nature of the protocol can actually help shy students by giving them a clear script and equal time.', limitedLanguage: 'The protocol can be supported with sentence frames for each step; a bilingual support person helps in acute conflicts.' },
  shySupport: { prompts: ['During your turn, you have the full 60 seconds and nobody can interrupt you.', 'You can write what you want to say before speaking — that is a valid preparation strategy.'], alternatives: ['Written exchange before verbal protocol for students who need composure time', 'Mediator role for shy student: facilitating others\' conflicts builds skills without personal exposure'], encouragement: ['You stayed in the protocol even when it was hard — that takes real maturity.', 'You found the common ground that made the resolution possible.'] },
  observation: ['Are students reaching the calming step before speaking (not skipping straight to arguments)?', 'Are students genuinely listening during the other\'s sharing turn?', 'Are resolutions durable — do they hold beyond the immediate session?', 'Are students applying the protocol spontaneously without adult prompting?'],
  rubric: { beginning: 'Student cannot engage in protocol; escalates or withdraws during conflict.', developing: 'Student participates in protocol with full adult facilitation; can state own perspective.', proficient: 'Student moves through all 4 steps with minimal adult support; reaches a resolution that satisfies both parties.', advanced: 'Student uses protocol independently, identifies underlying needs beyond stated positions, and facilitates peers through conflicts as a student mediator.' },
  teacherNotes: ['{child} used the conflict resolution protocol independently in the hallway today without any adult present — protocol fully internalized as a self-management tool.', 'During Conflict Resolution Protocol practice, {child} identified that the conflict was about needing to feel heard rather than the stated issue — sophisticated emotional intelligence.'],
  parentReport: { example: 'Today your child learned and practiced a structured 4-step conflict resolution protocol: calm down, share perspectives, find common ground, make a plan. This gives students a reliable tool for navigating peer conflicts rather than escalating or withdrawing. Your child engaged seriously with the practice. Using similar language at home ("What is the common ground here?") reinforces the same framework.', homeExtension: 'When sibling or peer conflicts arise at home, introduce the protocol calmly: "Let\'s do it in steps. First — does everyone feel calm enough to talk? Good. Now, one at a time — nobody interrupts." You do not need all 4 steps every time; even the first two (calm + listen) transform most conflicts.' },
  variations: { smallGroup: 'Mediation training: one student facilitates a role-played conflict between two others — builds facilitation skills.', wholeClass: 'Class problem solving: use the protocol for whole-class issues (noise, cleanup, fairness) — builds community governance.', outdoor: 'Apply the protocol to real conflicts that arise during outdoor play — in-the-moment practice is most powerful.', indoor: 'Conflict resolution roleplay center: scenario cards for independent practice during free time.', lowResource: 'The protocol itself is the only resource needed — paper for the plan-making step is optional.' },
  classroomMgmt: { transitions: 'Post the 4-step protocol visually where it can be referenced during actual conflicts — permanence matters.', disruptions: 'When conflict occurs, the teacher\'s first words are: "Protocol. Step 1." — calm, consistent, non-reactive.', participation: 'Students who refuse the protocol may need private relationship repair first — sometimes protocol feels like a trap to students with negative experiences of adult mediation.', diverseLearners: 'Visual protocol cards that students can carry in their binders allow independent reference anytime, anywhere.' },
  materials: { required: ['4-step conflict resolution poster'], optional: ['Talking timer', 'Agreement form for written resolution', 'Student mediator badges'], printable: ['Conflict resolution protocol card (student size)', 'Agreement form template'], digital: ['Second Step social-emotional learning resources'] }
};

COACHING_DATA['sas2'] = {
  intro: 'Your team has been given a real problem — something in our class or school that could actually be better. Today you plan how to fix it.',
  tips: ['The project must address a real, observable problem — invented or hypothetical problems produce invested planning but disengaged execution', 'Assign formal roles with accountability: a team without clear roles defaults to one dominant voice', 'Public presentation with genuine audience (another class, a parent, the principal) is far more motivating than presenting only to the teacher'],
  prompts: ['First: name the specific problem. Not "our school needs improvement" — the SPECIFIC thing you are going to fix. Write it exactly.', 'Assign every role now before you plan: who is the Lead, the Recorder, the Materials Manager, the Presenter?', 'Your team just made a decision by voting with three people overruled. How will the minority members stay committed to the plan?'],
  close: 'The leadership you practiced today — listening, deciding, following through, presenting — that is the same skill set needed to lead a team, run a business, or change a community.',
  questions: { beginner: ['What is your leadership role?', 'How will you guide your team?'], intermediate: ['What challenges did your team overcome?', 'How did your team make decisions when you disagreed?'], advanced: ['What would you do differently as a leader next time?', 'How did you ensure every voice was heard in your planning process?'], openEnded: ['What does it mean to lead for the benefit of the group rather than yourself?', 'What leadership skill do you want to develop most and why?'] },
  responses: { typical: 'Teams plan enthusiastically but execution reveals more complexity than anticipated; presentation quality varies widely.', strong: 'Teams complete the full project cycle with evidence of genuine leadership distribution and sophisticated reflection on process.', shy: 'Assigned roles that are not "public speaker" (researcher, designer, recorder) allow shy students to contribute meaningfully without front-facing pressure.', limitedLanguage: 'Leadership can be demonstrated through planning, designing, and organizing — not exclusively through verbal presentation.' },
  shySupport: { prompts: ['What is the part of the project that you could lead? Even if it is a behind-the-scenes role.', 'Your recorder notes are what the whole team will use to present. That role is essential.'], alternatives: ['Design or visual communication roles allow non-verbal leadership contribution', 'Allow written presentation component as an alternative to fully verbal delivery'], encouragement: ['Your contribution made this project possible — the team could not have executed without your work.', 'I saw you lead your team back on track when things got off course. That is quiet leadership and it matters enormously.'] },
  observation: ['Is leadership being distributed or concentrated in one student?', 'Are students following through on project commitments between sessions?', 'Is the presentation reflecting the full team\'s contribution or primarily one voice?', 'Are students reflecting on the process as well as the product?'],
  rubric: { beginning: 'Student cannot maintain focus on a project across multiple sessions; leadership role is passive or absent.', developing: 'Student contributes to planning and execution with teacher scaffolding; takes one defined role.', proficient: 'Student fulfills a clear leadership role, contributes substantively to the project, and presents their portion with confidence.', advanced: 'Student distributes leadership across the team, navigates interpersonal challenges, executes a high-quality project, and provides sophisticated reflection on their leadership growth.' },
  teacherNotes: ['{child} stepped back from leading when they noticed a teammate\'s idea was better than their own — extraordinary leadership maturity for this age.', 'During Leadership Project, {child} checked in with every team member daily to ensure nobody felt left behind — servant leadership emerging.'],
  parentReport: { example: 'Today your child worked as part of a Leadership Project team — identifying a real problem, planning a solution, assigning roles, and beginning execution. Leadership at this age is about learning to listen, decide together, and follow through. Your child showed real initiative and maturity. Ask them what their specific role is and what the team is working on — they will light up talking about it.', homeExtension: 'Give your child a real family project to lead: planning a family outing, organizing a closet, or creating a meal plan for the week. Give them real authority and step back. Debrief afterward: "What was the hardest part of being in charge? What would you do differently?"' },
  variations: { smallGroup: 'Smaller teams (3-4) ensure every member holds a clear, essential role with no passengers.', wholeClass: 'Class improvement project: larger scope, stronger impact, more powerful sense of shared accomplishment.', outdoor: 'Outdoor improvement project: school garden, trail maintenance, outdoor furniture design and build.', indoor: 'Classroom improvement: library organization, bulletin board redesign, welcome system for new students.', lowResource: 'Many powerful projects require only time, effort, and communication — no materials budget needed.' },
  classroomMgmt: { transitions: 'Project work sessions need clear start, checkpoint, and close rituals to maintain momentum.', disruptions: 'Off-task teams usually need clearer role definition — return to role assignment and specific next action.', participation: 'Daily 60-second standing check-in: each person reports what they completed yesterday and what they will do today.', diverseLearners: 'Ensure project roles match individual strengths — a student with strong visual-spatial thinking may be the best designer rather than the best presenter.' },
  materials: { required: ['Project planning template', 'Materials vary by project'], optional: ['Presentation tools (poster, slides, props)', 'Project timeline chart'], printable: ['Leadership project planning template', 'Role responsibility cards'], digital: ['Google Slides for presentations', 'Canva for design elements'] }
};

COACHING_DATA['sas3'] = {
  intro: 'Today you have a special job: you are going to help someone younger than you. Your knowledge and care can make a real difference to them today.',
  tips: ['Prepare the mentor carefully beforehand: what to expect from the younger child, how to explain things simply, how to be patient without being condescending', 'The structured activity should be genuinely appropriate for both ages — the mentor needs to be engaged, not just waiting', 'Debrief with the mentor immediately after: "What did you learn? What surprised you?"'],
  prompts: ['Before you go to your buddy: what do you think they need from you today? How will you make them feel welcome and comfortable?', '[During session] What are you noticing about how your buddy learns? Are they a watcher first? A doer? Follow their lead.', '[After session] What did your buddy teach YOU? I guarantee they taught you something even if it was not what you expected.'],
  close: 'Mentoring is one of the most powerful relationships in human development — for the mentee AND the mentor. You grew today by teaching someone else.',
  questions: { beginner: ['How did you help your buddy today?', 'What did you learn from someone younger than you?'], intermediate: ['What was harder than you expected about mentoring?', 'How did you explain something in a way they could understand?'], advanced: ['How is explaining something to a younger child different from explaining it to a peer?', 'What does this experience tell you about how YOU learn?'], openEnded: ['What do you wish someone had been for you when you were younger?', 'How does being a mentor change how you see yourself?'] },
  responses: { typical: 'Mentors are enthusiastic but underestimate the skill of simplification; learn more about their own understanding by trying to teach.', strong: 'Mentors differentiate their communication based on real-time observation of the younger child\'s responses; develop genuine relationship.', shy: 'One-on-one mentoring with a younger child often draws out shy older students — the power differential removes their anxiety.', limitedLanguage: 'Cross-language mentoring can be powerfully connecting; shared activities transcend language barriers.' },
  shySupport: { prompts: ['You are the expert here — your buddy is looking to YOU for guidance.', 'You do not have to be entertaining. You just have to be genuinely present and kind.'], alternatives: ['Pair shy mentor with a particularly warm, receptive younger mentee', 'Activity-based mentoring (building, reading, drawing together) reduces verbal pressure'], encouragement: ['Your buddy did not want to leave. That tells you everything about the connection you built.', 'You explained that in a way I could not have said better. Teaching is your strength.'] },
  observation: ['Is the mentor genuinely adapting their communication to the younger child\'s level?', 'Is the mentor demonstrating patience and empathy during the session?', 'Is the younger child (mentee) engaged and benefiting from the interaction?', 'Is the mentor reflecting on their own learning and growth after the session?'],
  rubric: { beginning: 'Student cannot sustain the mentoring role; becomes impatient or disengaged quickly.', developing: 'Student maintains the mentoring role for the session duration; shows basic patience and care.', proficient: 'Student adapts communication effectively, builds genuine rapport with the younger child, and reflects substantively on the experience.', advanced: 'Student shows sophisticated differentiation of instruction, demonstrates genuine empathy and investment in the younger child\'s growth, and articulates specific insights about their own learning from the experience.' },
  teacherNotes: ['{child} instinctively simplified their vocabulary during the mentoring session without any coaching — remarkable natural teaching instinct.', 'During Peer Mentoring, {child} said "I understand math better now because I had to explain it to someone who didn\'t know" — articulating the deepest truth about teaching as learning.'],
  parentReport: { example: 'Today your child served as a peer mentor to a younger student — guiding them through an activity, explaining concepts, and practicing patience and empathy. Research consistently shows that peer tutoring and mentoring benefits the mentor as much as the mentee — explaining content deepens understanding, and caring for a younger child builds emotional intelligence and leadership. Your child stepped up beautifully today.', homeExtension: 'If you have younger siblings, cousins, or neighbors, encourage your child to "teach" them something this week — a game, a skill, a book. Prompt them afterward: "What did you have to think about to explain it in a way they could understand?" That metacognitive question unlocks the deepest learning from teaching.' },
  variations: { smallGroup: 'Small mentor groups (one older, two younger) build peer relationships while maintaining the mentoring dynamic.', wholeClass: 'Cross-class buddy system: every student in the class has a buddy in a younger class.', outdoor: 'Outdoor mentoring: nature exploration where older students lead younger ones on a discovery walk.', indoor: 'Reading buddy program: most impactful and easiest to implement cross-age mentoring structure.', lowResource: 'Reading aloud together costs nothing and benefits both children in measurable, documented ways.' },
  classroomMgmt: { transitions: 'Preparation and debrief time must be built into every mentoring session — the bookends are as important as the middle.', disruptions: 'If a mentoring pair is struggling, observe before intervening — often children work through initial awkwardness naturally.', participation: 'Every student can be a mentor to someone — there is always a younger child who needs what this student can offer.', diverseLearners: 'Match mentoring pairs thoughtfully: a student with a reading challenge can mentor in a domain where they are genuinely strong.' },
  materials: { required: ['Paired mentor-mentee activity materials (vary by activity)'], optional: ['Buddy reading books', 'Shared project materials', 'Mentor reflection journal'], printable: ['Mentoring session planning card', 'Mentor reflection prompts'], digital: [] }
};

/* ── SCHOOL AGE PHYSICAL ── */
COACHING_DATA['sap1'] = {
  intro: 'Before we play today, I want to ask: what does sportsmanship actually mean? Not what the word says — what does it look like in real life?',
  tips: ['Spend as much time teaching sportsmanship norms as teaching the sport itself — the values are the curriculum', 'Debrief after every game: identify specific sportsmanship moments — both exemplary and missed — using real names and real moments', 'Never tolerate any form of exclusion, shaming, or gloating — address it immediately and specifically'],
  prompts: ['Before the game: what is one specific sportsmanship behavior you are going to focus on today? Name it.', '[During game] I see two possible fouls happening right now. How are you going to handle this with your team?', '[After game] Name one sportsmanship moment you saw today — either positive or a growth opportunity. Be specific.'],
  close: 'The score today is not the lesson. How you played — how you treated teammates, opponents, and officials — that is the lesson that lasts.',
  questions: { beginner: ['How did your team work together?', 'What sportsmanship did you see?'], intermediate: ['What did you do when something felt unfair?', 'How did you encourage a teammate who made a mistake?'], advanced: ['What is the difference between competing hard and playing dirty?', 'How does your attitude when losing reflect your character?'], openEnded: ['What does your behavior during a game reveal about who you are as a person?', 'Why does sportsmanship matter when the only people watching are your classmates?'] },
  responses: { typical: 'Students focus on winning; sportsmanship requires explicit prompting; conflict over perceived unfairness is common.', strong: 'Students self-police sportsmanship, acknowledge errors, and prioritize team over individual performance voluntarily.', shy: 'Team sports can be challenging for shy students — ensure safe, included roles for all levels of ability and comfort.', limitedLanguage: 'Sport is universal — physical participation transcends verbal communication; ensure rules are taught visually and through demonstration.' },
  shySupport: { prompts: ['Every position on this team is important — including yours.', 'You do not have to be the most vocal player to be the most valuable.'], alternatives: ['Score-keeping or referee roles allow participation without physical performance pressure', 'Small group game (4 vs. 4) before full game reduces anonymity and increases safety'], encouragement: ['You encouraged a teammate who made an error — that is exactly what this team needs.', 'You played hard the whole game even when the score was against you. That is sportsmanship.'] },
  observation: ['Are students encouraging or criticizing teammates who make mistakes?', 'How do students respond to losing — specifically, what do they say and do?', 'Are all students included and participating, or are some marginalized?', 'Are students applying game rules fairly or bending them when advantageous?'],
  rubric: { beginning: 'Student cannot participate appropriately; argues with officials, criticizes teammates, or excludes others.', developing: 'Student participates cooperatively with reminders; shows basic positive sportsmanship in easy situations.', proficient: 'Student demonstrates consistent positive sportsmanship, encourages teammates after errors, and handles losing with grace.', advanced: 'Student actively builds team culture, calls out poor sportsmanship constructively, advocates for fair play, and models outstanding behavior especially when the game is not going their way.' },
  teacherNotes: ['{child} shook hands with the opposing team after a close loss and said "good game" without any prompting — authentic sportsmanship internalization.', 'During Team Sports, {child} called a penalty on their own team that the official missed — integrity in action under competitive pressure.'],
  parentReport: { example: 'Today your child worked on Team Sports with a specific focus on sportsmanship — how we treat teammates, opponents, and officials regardless of the score. Sport is one of the most powerful character development contexts available to children. Your child showed real growth today. The values modeled in sports at this age — integrity, encouragement, grace in losing — become deeply embedded character traits.', homeExtension: 'Watch a sport together (any level — school, professional, neighborhood) and discuss the sportsmanship you observe specifically: "That player just argued with the official. What do you think about that?" or "Did you see how she responded when her team scored? What did you notice?" Building a sportsmanship vocabulary together matters enormously.' },
  variations: { smallGroup: 'Small-sided games (3 vs. 3) maximize individual touches, decision-making, and sportsmanship practice per player.', wholeClass: 'Modified games with rotating teams ensure everyone plays with and against everyone — breaks cliques.', outdoor: 'Outdoor sport in its natural context — wind, sun, uneven terrain teach physical adaptability alongside sportsmanship.', indoor: 'Gym games, indoor soccer, non-elimination tag — indoor alternatives for weather days.', lowResource: 'Many team sports can be played with a single ball and a safe open space.' },
  classroomMgmt: { transitions: 'Equipment distribution and collection must be ritualized — assign roles and stick to them.', disruptions: 'Remove a student from play immediately and privately for sportsmanship violations; rejoin only after brief reflection conversation.', participation: 'Modified participation options (reduced contact, smaller playing area, walking pace) ensure inclusion for all ability levels.', diverseLearners: 'Adapted equipment and modified rules allow full participation without separating any student from the group.' },
  materials: { required: ['Sport-appropriate equipment (ball, goals, markers)'], optional: ['Scoreboard', 'Pinnies for team identification', 'Timer'], printable: ['Sportsmanship self-assessment card', 'Team agreements form'], digital: [] }
};

COACHING_DATA['sap2'] = {
  intro: 'Today we track our personal fitness — not to compare with anyone else, but to know our own starting point. Only YOU compete against you here.',
  tips: ['Establish a "personal best" culture explicitly from the first session — any comparison to peers immediately undermines the developmental goal', 'Teach the WHY behind each exercise: "Wall push-ups build the shoulder strength you need for writing and throwing"', 'Personal records should be celebrated specifically and privately — avoid public comparison even of positive data'],
  prompts: ['Before we start: what is ONE personal goal for today? Just one thing you want to do better than last time.', '[At a station] Tell me what you feel in your muscles right now. That feeling is your body getting stronger.', 'You beat your personal record by two reps. What did you do differently this time?'],
  close: 'Physical fitness is not a competition with others — it is a conversation with your own body. Today you learned to have that conversation.',
  questions: { beginner: ['How does exercise make you feel?', 'Can you beat your personal best from last week?'], intermediate: ['Which muscle group does this exercise work?', 'What is the connection between this exercise and your everyday physical ability?'], advanced: ['How does regular exercise affect your mood and thinking?', 'What fitness habit would you want to carry into adult life? Why?'], openEnded: ['What does it feel like to push through the moment when your body wants to stop?', 'If exercise were completely optional for you personally, would you still do it? Why or why not?'] },
  responses: { typical: 'Students are motivated by personal record tracking; fatigue and proper form require consistent coaching throughout.', strong: 'Students track their own data accurately, adjust effort based on personal goals, and connect exercise to broader health outcomes.', shy: 'Individual fitness tracking removes peer comparison — many shy students thrive in this format.', limitedLanguage: 'Fitness circuit is largely non-verbal — demonstration and visual station cards allow full participation.' },
  shySupport: { prompts: ['Your data is just for you — nobody else sees your personal record unless you share it.', 'Focus on your own body, your own effort, your own time. That is the whole assignment.'], alternatives: ['Allow private personal record tracking without public sharing', 'Partner option: two students support each other through each station'], encouragement: ['Your effort today was real and measurable. You are physically stronger than when we started.', 'You stayed at the station when it got hard. That decision is the fitness habit forming.'] },
  observation: ['Are students using correct form at each station (safety priority)?', 'Are students working at genuine personal challenge level or coasting?', 'Are students tracking personal data accurately and celebrating personal improvement?', 'Are students making connections between physical activity and mental/emotional wellbeing?'],
  rubric: { beginning: 'Student cannot complete most stations safely; shows no engagement with personal tracking.', developing: 'Student completes all stations with some form coaching; records basic data.', proficient: 'Student completes circuit with correct form, records personal data accurately, and sets meaningful next-session goals.', advanced: 'Student demonstrates excellent form and full engagement at every station, shows measurable personal improvement over time, sets progressive goals, and can articulate the health rationale for each exercise.' },
  teacherNotes: ['{child} beat their personal record at the wall push-up station and immediately set a higher goal for next session — intrinsic motivation and growth mindset in physical development.', 'During Personal Fitness Circuit, {child} helped a classmate with wall sit form without being asked — leadership and care integrated into physical education.'],
  parentReport: { example: 'Today your child completed a Personal Fitness Circuit — tracking their own performance at 5-7 exercise stations designed to build strength, endurance, and flexibility. We emphasize personal improvement rather than peer comparison. Your child showed real effort and is building physical habits that support both health and academic performance — exercise is one of the most evidence-based interventions for learning, mood, and focus.', homeExtension: 'Try a 10-minute family fitness challenge once a week — everyone does the same simple circuit (jumping jacks, wall push-ups, balance stands, stretching) and tracks their own personal record. Even once a week, done consistently for a month, builds meaningful physical habit and family connection.' },
  variations: { smallGroup: 'Partner fitness: two students move through circuit together, motivating and monitoring each other.', wholeClass: 'Class fitness challenges: group records (total class push-ups, longest collective plank) build community through physical achievement.', outdoor: 'Outdoor circuit using nature features: tree trunk jumps, hill sprints, log balance walks.', indoor: 'Circuit stations clearly marked around the room with written instructions and visual form guides.', lowResource: 'All exercises in a basic fitness circuit require only body weight — no equipment is necessary.' },
  classroomMgmt: { transitions: 'Rotation signals must be clear and consistent — timer, bell, or music.', disruptions: 'Students who cannot participate appropriately at a station move to an observation role briefly.', participation: 'Every student participates at their own level; modified exercises available at every station.', diverseLearners: 'Station instruction cards with visual form guides allow independent setup without verbal explanation.' },
  materials: { required: ['Fitness station cards with written instructions'], optional: ['Timer', 'Fitness tracking journals', 'Resistance bands or light weights for older students'], printable: ['Personal fitness circuit tracker', 'Fitness station instruction cards with illustrations'], digital: ['GoNoodle fitness videos', 'YouTube Kids Fitness for warm-up or instruction'] }
};

/* ── SCHOOL AGE CREATIVITY ── */
COACHING_DATA['sacr1'] = {
  intro: 'Today you are going to create a complete story — and you will use art, your voice, and technology to tell it in a way no book can.',
  tips: ['Students need a complete story arc plan (beginning, middle, end) before creating any media — planning saves hours of production confusion', 'Voice recording is often the most intimidating element — normalize it by recording yourself first and sharing the raw take', 'The creative review stage (watching/listening to their own work) produces the most authentic quality improvement motivation'],
  prompts: ['Plan first: what is your story about? Who are the characters? What happens in the beginning, middle, and end? Write it all before you create any art.', 'Record your narration as if you are telling it to someone who cares — not reading it, TELLING it. Your voice should be you, not a robot.', '[After initial recording] Listen to it. What is the moment that is strongest? What is the moment that needs another take?'],
  close: 'You just created something that did not exist this morning using your imagination, your hands, your voice, and technology. That ability is one of the most powerful things you will ever develop.',
  questions: { beginner: ['What is your story about?', 'How does your artwork tell the story?'], intermediate: ['How does your voice bring your story to life differently than the pictures alone?', 'What would you change if you had another hour?'], advanced: ['What specific creative decisions did you make that you are most proud of?', 'How is this story connected to something real in your life or the world?'], openEnded: ['What emotion do you want your audience to feel?', 'How does combining different creative mediums (art + voice + technology) change what the story can do?'] },
  responses: { typical: 'Students are ambitious in planning but underestimate production time; final products are often incomplete but genuine.', strong: 'Students complete a polished multimedia project with intentional creative decisions across every medium.', shy: 'Voice recording can be deeply challenging for shy students — normalize multiple takes and private recording sessions.', limitedLanguage: 'Multilingual storytelling (narrative in home language, captions in English) is a sophisticated and celebrated creative choice.' },
  shySupport: { prompts: ['You can record as many takes as you want — only the final one matters.', 'Your story is worth hearing. I will be the first audience and I genuinely want to hear it.'], alternatives: ['Written narration alongside art as an alternative to audio recording', 'Music-only soundtrack (no voice) as a valid creative choice'], encouragement: ['Your voice in that recording is completely authentic. That is a creative asset, not a flaw.', 'The moment in the middle where the story shifts — I felt that. That is effective storytelling.'] },
  observation: ['Does the student have a clear narrative structure before beginning production?', 'Is the artwork doing communicative work (telling story) or is it decorative?', 'Is the voice recording natural and expressive or flat and robotic?', 'Does the student revise when reviewing their own work?'],
  rubric: { beginning: 'Student cannot complete a story plan; production elements are disjointed with no clear narrative.', developing: 'Student creates a basic story with beginning, middle, and end; multimedia elements are present but loosely connected.', proficient: 'Student produces a complete multimedia story with intentional use of art, voice, and technology; the elements work together.', advanced: 'Student produces a polished, purposeful multimedia narrative with sophisticated creative decisions; revises based on self-review; story is emotionally resonant and technically skilled.' },
  teacherNotes: ['{child} wrote a story based on their own family immigration experience — courageous personal storytelling and sophisticated creative choice of topic.', 'During Multimedia Storytelling, {child} recorded their narration 5 times until the emotional tone matched their intention — artistic perfectionism and growth mindset combined.'],
  parentReport: { example: 'Today your child began a Multimedia Storytelling project — planning a story, creating original artwork, recording their own voice narration, and combining elements digitally. This builds creativity, narrative thinking, technological literacy, and communication skills simultaneously. Your child is creating something genuine and original. Ask to see it when it is finished — you will be genuinely moved by what they have made.', homeExtension: 'Encourage your child to record a "story" on any phone or tablet — just their voice telling something that happened, real or imagined. Even 60 seconds. Play it back together. Most children are surprised by how compelling their own voice sounds when telling a story they care about.' },
  variations: { smallGroup: 'Collaborative storytelling: small groups each contribute a chapter to a shared multimedia story.', wholeClass: 'Class story project: shared narrative with each student contributing one multimedia scene.', outdoor: 'Outdoor photography walk: nature photographs become the visual backbone of a multimedia nature story.', indoor: 'Multimedia creation center with dedicated devices, art supplies, and quiet recording space.', lowResource: 'Paper illustrations + phone voice recording — completely free and surprisingly high-quality.' },
  classroomMgmt: { transitions: 'Save often! Establish a consistent save protocol before every session close — nothing kills creative momentum like lost work.', disruptions: 'Unproductive device use requires immediate transition to offline planning or creation components.', participation: 'Every student can contribute at their comfort level — art-only, voice-only, or planning-only are all valid first-session contributions.', diverseLearners: 'Text-to-speech and alternative recording methods remove barriers for students with writing or speaking challenges.' },
  materials: { required: ['Drawing materials', 'Recording device (tablet, phone, or computer with microphone)'], optional: ['Book Creator app', 'GarageBand for music', 'Scanner for artwork digitization'], printable: ['Multimedia story planning template', 'Story arc graphic organizer'], digital: ['Book Creator (bookcreator.com)', 'Adobe Spark for Education', 'Seesaw portfolio app'] }
};

COACHING_DATA['sacr2'] = {
  intro: 'Every invention started with someone who saw a problem and refused to accept that it could not be solved. Today you are that person.',
  tips: ['The problem identification phase is the most important — students must choose problems they genuinely care about, not problems they think the teacher wants', 'Prototypes do not need to work — they need to SHOW an idea; the thinking made physical is the assessment, not the functioning device', 'Presentation must include the problem, the invention, how it works, and what you would change in version 2 — this structure makes reflection automatic'],
  prompts: ['Name a problem you have actually experienced. Not a world hunger problem — a real, specific thing in YOUR life that is annoying, hard, or unfair.', 'Now draw your invention. Do not worry about whether it works yet — draw what you are IMAGINING.', '[During testing] It did not work as expected. Name one specific thing you learned from that failure. What does version 2 look like?'],
  close: 'Every invention in the world started as exactly what you just did — a person with a problem, a drawing, and a prototype. The only difference between you and Thomas Edison is time.',
  questions: { beginner: ['What problem are you solving?', 'How does your invention work?'], intermediate: ['What would you improve in the next version?', 'What did you learn from testing your prototype?'], advanced: ['What was the biggest design constraint you had to work around?', 'What real existing inventions informed your design?'], openEnded: ['What does inventing feel like compared to other kinds of creating?', 'What problem in the world do you most want someone to solve? Could it be you?'] },
  responses: { typical: 'Students identify creative but impractical inventions initially; prototype testing reveals real-world constraints that improve the next iteration.', strong: 'Students identify genuine problems, iterate multiple prototype versions based on specific testing feedback, and present with sophistication.', shy: 'Invention work is personal and individual — shy students often produce some of the most original, thoughtful inventions.', limitedLanguage: 'Invention communication through detailed labeled drawing is equally rigorous to verbal presentation.' },
  shySupport: { prompts: ['You do not have to present to the whole class — a one-on-one presentation to me is a valid option.', 'Draw every detail of your invention — the drawing IS the presentation if you prefer.'], alternatives: ['Written inventor\'s journal entry as primary assessment instead of oral presentation', 'Display-style presentation (poster visible, student available for questions) rather than front-of-class talk'], encouragement: ['Your invention solves a real problem in a genuinely original way. I had never thought of that approach.', 'This drawing shows sophisticated thinking about how things work — you are thinking like an engineer.'] },
  observation: ['Is the problem identified genuinely the student\'s own or is it generic and teacher-pleasing?', 'Does the student iterate (improve based on feedback) or defend the original without revision?', 'Does the student articulate why their invention solves the problem better than existing solutions?', 'Does the student show transfer of design thinking to problems outside the explicit invention task?'],
  rubric: { beginning: 'Student cannot identify a genuine problem or create any prototype; no design thinking process visible.', developing: 'Student identifies a problem and creates a basic prototype; cannot explain design decisions clearly.', proficient: 'Student identifies a genuine problem, builds a prototype, tests it, revises based on feedback, and presents with clear explanation of design decisions.', advanced: 'Student identifies a nuanced problem, creates multiple prototype iterations with documented reasoning, conducts genuine testing, presents sophisticated design thinking, and articulates how version 3 would work.' },
  teacherNotes: ['{child} designed an invention to help their grandmother with arthritis — deeply personal problem identification that shows empathy-driven design.', 'During Invention Convention, {child} created three different prototypes and compared their performance systematically — engineering methodology at its most rigorous.'],
  parentReport: { example: 'Today your child participated in Invention Convention — identifying a real problem, designing a solution, building a prototype, testing it, and preparing to present. This develops creative thinking, engineering mindset, problem-solving, and communication. Your child showed wonderful originality today. Ask them: "What problem are you solving? How does your invention work? What would you change in version 2?" You will be amazed by their depth of thinking.', homeExtension: 'Challenge your child: "What is the most annoying thing about our house? Design an invention to fix it — on paper first." Give them 20 minutes and cardboard, tape, and whatever is in the recycling bin. The kitchen-table invention session is one of the highest-yield creative experiences you can offer.' },
  variations: { smallGroup: 'Co-invention: pairs tackle the same problem and compare divergent solutions — building understanding that multiple good solutions can exist.', wholeClass: 'Class invention fair: every student presents to the class; peer questions asked and answered.', outdoor: 'Outdoor invention challenge: invent something using only natural and found materials to solve a specific outdoor problem.', indoor: 'Maker station available throughout the week for iterative prototype development.', lowResource: 'Recyclable materials (cardboard, tape, cups, rubber bands) are the richest invention materials available.' },
  classroomMgmt: { transitions: 'Invention materials management: clear storage, labeled bins, consistent put-away protocol.', disruptions: 'Students who use materials destructively return to the planning/drawing phase until they are ready to use materials responsibly.', participation: 'Every student can contribute at the design level even if physical prototype building is challenging.', diverseLearners: 'Digital invention tools (drawing apps, 3D design tools) allow students with fine motor challenges to design without physical construction barriers.' },
  materials: { required: ['Recyclable materials: cardboard, tape, cups, rubber bands', 'Design journals'], optional: ['Maker tools: scissors, hole punch, wire', 'Camera for documentation', 'Display boards for presentations'], printable: ['Inventor\'s journal template', 'Design thinking process poster'], digital: ['Tinkercad (3D design)', 'Google Drawings for digital invention sketching'] }
};

/* ── SCHOOL AGE LIFE SKILLS ── */
COACHING_DATA['sals1'] = {
  intro: 'Today we learn about something most adults wish they had learned as children: how to think about money. Ready to become financially smart?',
  tips: ['Use real play money throughout — physical engagement with money objects is more impactful than abstract discussion', 'The four concepts must be introduced in sequence: Earn first, then Save, then Spend, then Give — each builds on the previous', 'Connect every concept to a real goal: "What are you saving up for?" makes saving feel purposeful rather than arbitrary'],
  prompts: ['Before money exists, it has to be earned. Today you earn your classroom dollars by completing real tasks. Ready?', 'You have earned $10. Here are your choices: spend it all now, save some for later, or give some away. What will you do? Why?', 'Let\'s visit the classroom store. You have $6. This item costs $8. What are you going to do? What are your options?'],
  close: 'Earn, save, spend, give. Four words. The people who understand these four words and practice them live very differently from people who do not. Now you know them.',
  questions: { beginner: ['What is the difference between needs and wants?', 'How much change do you get?'], intermediate: ['What would you save up for?', 'Why might someone choose to give some money away?'], advanced: ['What happens if you spend all your money before you earn more?', 'How does interest help or hurt people?'], openEnded: ['What would you do with $100 today versus $100 in 10 years?', 'What does it mean to be rich? Is it always about money?'] },
  responses: { typical: 'Students spend impulsively in the classroom store then regret it when a preferred item appears later — this is the best possible learning experience.', strong: 'Students create personal spending plans, defer gratification for specific goals, and articulate saving rationale.', shy: 'Financial literacy activities are largely non-verbal and individual — well-suited to shy students.', limitedLanguage: 'Play money and physical transactions transcend language barriers; financial concepts are universal.' },
  shySupport: { prompts: ['Your financial decisions are private — you do not have to share your choices if you do not want to.', 'What would YOU do with this money — just tell me.'], alternatives: ['Written financial plan as alternative to verbal sharing of decisions', 'One-on-one classroom store transaction before group shopping to build confidence'], encouragement: ['You saved enough for the item you wanted. That took patience and planning — those are real financial skills.', 'You chose to give some away. That decision shows a kind of wealth that money alone cannot measure.'] },
  observation: ['Do students understand the difference between needs and wants?', 'Do students make deliberate spending decisions or impulsive ones?', 'Do students connect saving to a specific goal?', 'Do students show any natural giving behavior when given the choice?'],
  rubric: { beginning: 'Student cannot distinguish needs from wants; spends immediately without any planning.', developing: 'Student identifies needs vs. wants; makes spending decisions with some rationale; can make basic change.', proficient: 'Student applies all four concepts (earn, save, spend, give); makes deliberate financial decisions with explained reasoning; calculates costs and change accurately.', advanced: 'Student creates a personal budget, sets and executes a savings goal, makes reasoned decisions across all four categories, and can explain basic banking concepts.' },
  teacherNotes: ['{child} divided their earnings into three envelopes labeled "spend," "save," and "give" without prompting — spontaneous application of all four financial literacy concepts.', 'During Financial Literacy simulation, {child} calculated that buying the cheaper item would allow them to save toward a larger goal — sophisticated delayed gratification and opportunity cost reasoning.'],
  parentReport: { example: 'Today your child participated in our Financial Literacy lesson — earning classroom dollars, making spending and saving decisions in a classroom store simulation, and exploring the concept of giving. These foundational financial concepts are among the most important we teach because most adults report wishing they had learned them earlier. Your child showed genuine engagement and made some very thoughtful financial decisions.', homeExtension: 'Start a simple allowance system this week — even $1-2 per week — with three jars labeled SPEND, SAVE, GIVE. Let your child decide how to divide it. This simple, physical system teaches financial decision-making more powerfully than any curriculum. The first time they save long enough for something they want, the lesson is complete.' },
  variations: { smallGroup: 'Small group financial scenario discussions: what would you do if you found $20? Lost your wallet?', wholeClass: 'Classroom economy: sustained across weeks with earning, saving, and a real classroom auction or store event.', outdoor: 'Simulated farmers market or outdoor store with earned currency.', indoor: 'Classroom store and banking system sustained as a background classroom economy.', lowResource: 'Paper "classroom dollars" cost nothing and are equally effective as printed currency.' },
  classroomMgmt: { transitions: 'Classroom economy management becomes its own life skill — storing money safely, tracking earnings.', disruptions: 'Students who counterfeit or steal currency receive an immediate, real consequence in the classroom economy.', participation: 'Every student participates — financial literacy applies universally.', diverseLearners: 'Visual price tags, calculator use, and physical coin/bill manipulation support diverse mathematical learners.' },
  materials: { required: ['Play money', 'Simple classroom store setup with price-tagged items'], optional: ['Saving jars or envelopes', 'Banking ledger sheets', 'Auction items for end-of-unit'], printable: ['My Earn-Save-Spend-Give plan sheet', 'Classroom store price list'], digital: ['Khan Academy: financial literacy for kids', 'Practical Money Skills games'] }
};

COACHING_DATA['sals2'] = {
  intro: 'Today we talk about something every person who uses the internet or a phone needs to understand: how to be safe, smart, and kind online.',
  tips: ['The "never share" list must be memorized, not just heard — use call-and-response to drill: "Would you share your password? NEVER!"', 'Cyberbullying scenarios must be realistic to your students\' actual platforms — abstract hypotheticals do not transfer to real decision-making', 'The digital citizenship pledge must be written in students\' own language, not copied from a poster — ownership comes from authorship'],
  prompts: ['Before we start: list everything you know about yourself that exists online. (Pause.) Now — who can see all of that?', 'Here is the cyberbullying scenario: [read real situation]. What would you do in exactly that moment? Not what you should do — what would you actually do?', 'Write your digital citizenship pledge in YOUR words. What do YOU commit to online?'],
  close: 'The internet does not forget. Every choice you make online is permanent. The values you bring to digital spaces are the same ones you bring everywhere else — your character travels with you.',
  questions: { beginner: ['Is this information safe to share online?', 'What would you do if someone was unkind to you online?'], intermediate: ['What would you do if you witnessed cyberbullying but were not the target?', 'What is the difference between being unkind in person and online? Why does it feel different?'], advanced: ['How do online platforms make money from your attention and data?', 'What are the long-term consequences of a permanently digital record of youthful mistakes?'], openEnded: ['What kind of digital citizen do you want to be — not what you should be, what you WANT to be?', 'If the internet disappeared tomorrow, what would you miss most? What would you not miss?'] },
  responses: { typical: 'Students know the "right" digital citizenship answers but admit to different actual behavior — this gap is the teaching moment.', strong: 'Students articulate sophisticated understanding of digital permanence, privacy trade-offs, and upstander responsibility.', shy: 'Online spaces can feel safer than physical ones for shy students — this makes digital safety especially personally relevant.', limitedLanguage: 'Many digital safety concepts (privacy, kindness, reporting) apply identically across cultures and languages.' },
  shySupport: { prompts: ['You can write your response to the scenario before we discuss — that gives you a position to share.', 'Have you ever seen something online that made you feel uncomfortable? You do not have to share what it was.'], alternatives: ['Anonymous scenario responses via paper slips — privacy-protected sharing', 'Written digital citizenship pledge rather than verbal sharing'], encouragement: ['Your instinct in that scenario was exactly right — trust that instinct online too.', 'Your pledge is one of the most thoughtful ones I have read.'] },
  observation: ['Do students distinguish between safe and unsafe information to share with genuine discernment?', 'Can students identify cyberbullying and articulate specific upstander responses?', 'Do students show awareness of digital permanence in their reasoning?', 'Are students articulating digital citizenship as a value (not just a rule)?'],
  rubric: { beginning: 'Student cannot identify basic online safety rules; cannot distinguish safe from unsafe sharing.', developing: 'Student identifies the "never share" list; recognizes cyberbullying; knows to tell a trusted adult.', proficient: 'Student demonstrates nuanced privacy judgment, articulates upstander responsibility, and writes a meaningful personal digital citizenship pledge.', advanced: 'Student understands data economy, digital permanence, and the ethics of online spaces; makes sophisticated privacy decisions; advocates for digital kindness in real peer situations.' },
  teacherNotes: ['{child} said "the reason cyberbullying feels worse than in-person bullying is that you can\'t escape it even at home" — sophisticated analysis of online harm dynamics.', 'During Digital Citizenship lesson, {child} asked "but what if the company that has my data sells it?" — showing awareness of digital privacy beyond basic personal safety.'],
  parentReport: { example: 'Today your child explored digital citizenship — internet safety, cyberbullying identification and response, privacy protection, and responsible online communication. Your child engaged seriously with some genuinely complex scenarios. Digital citizenship is as important as physical safety skills today, and the conversations you have at home about online behavior are the most important supplement to what we teach at school.', homeExtension: 'Have one honest conversation this week: "Show me what apps you use most. What do you see on them? Has anything made you uncomfortable?" Listen without immediately problem-solving. The conversation itself is the intervention — children who know they can tell parents about online problems are dramatically safer than those who do not.' },
  variations: { smallGroup: 'Small group scenario analysis: groups work through different digital dilemmas and present their reasoning.', wholeClass: 'Digital citizenship pledge creation and signing ceremony — public commitment to digital values.', outdoor: 'Screen-free outdoor play time: the experience of being fully present without devices is itself a digital citizenship lesson.', indoor: 'Actual device practice: navigate real privacy settings and identify real tracking cookies on education sites.', lowResource: 'Scenario cards and discussion cost nothing.' },
  classroomMgmt: { transitions: 'Device storage and phone-free periods need clear, consistent, calm routines.', disruptions: 'Inappropriate device use is redirected immediately and privately — never publicly shamed.', participation: 'Every student uses technology and needs these skills — universal and urgent topic.', diverseLearners: 'Visual scenario cards and simplified safety rules ensure accessibility across reading levels.' },
  materials: { required: ['Tablets or computers (or printed scenarios if no devices available)'], optional: ['Device usage agreement', 'Privacy settings guide for common platforms'], printable: ['My Digital Citizenship Pledge template', 'Online safety checklist'], digital: ['Common Sense Media digital citizenship curriculum (free)', 'NetSmart Kids resources'] }
};

COACHING_DATA['sals3'] = {
  intro: 'Today we make a real snack. You will plan it, prepare it safely, and eat it together. Every step is real — including cleaning up.',
  tips: ['Teach knife safety explicitly before any cutting: "sharp end down, curl fingers like a claw, slow and in control"', 'Every student must wash hands before starting — no exceptions, no shortcuts', 'Connect every ingredient to its nutrient: "this protein keeps your muscles strong for the whole afternoon"'],
  prompts: ['Before we cook: what food groups do we need to include to make this snack genuinely balanced?', '[During preparation] What is a safe way to cut that without risking a cut to your finger?', 'Taste it. Now name one nutrient in what you just tasted and what it does for your body.'],
  close: 'You just made something real that your body can use. Every time you make your own food, you make a health choice rather than just accepting what someone else decided for you. That is a power worth having.',
  questions: { beginner: ['What makes this snack healthy and balanced?', 'What would you add or change next time?'], intermediate: ['Which food group is missing from our snack? How could we fix that?', 'What is the difference between a snack that gives you energy for an hour versus energy for the afternoon?'], advanced: ['What does the nutrition label tell you that you cannot see just by looking at the food?', 'How do your food choices affect your mood, focus, and energy?'], openEnded: ['If you could design the perfect school lunch, what would it include and why?', 'What is one food habit you could change that would make a real difference to how you feel?'] },
  responses: { typical: 'Students are enthusiastic about cooking; knife skills and portion estimation are the primary areas needing coaching.', strong: 'Students make nutritionally informed ingredient choices, demonstrate safe food handling, and articulate health rationale for each choice.', shy: 'Hands-on cooking is often accessible to shy students — the focus on the food rather than performance reduces social anxiety.', limitedLanguage: 'Cooking is a cultural bridge — students may have deep home expertise with foods from their own culture that becomes a leadership opportunity.' },
  shySupport: { prompts: ['You can have any role — chopper, mixer, plater, cleaner. What do you want to do?', 'You can taste first before we discuss what you notice — tasting before talking is completely fine.'], alternatives: ['Specific role assignment (plating, measuring) allows full participation without requiring the most visible tasks', 'Connect to home cooking traditions — invite shy students to share dishes from their culture'], encouragement: ['You just made something from scratch that is good for your body. That is a real life skill you own now.', 'Your cutting was slow, controlled, and safe — exactly the right approach.'] },
  observation: ['Are students making genuinely health-informed ingredient choices or choosing by preference alone?', 'Are students using safe food handling practices (hand washing, knife safety, cross-contamination awareness)?', 'Can students identify nutrients in the foods they prepare?', 'Are students connecting food choices to energy, mood, and health outcomes?'],
  rubric: { beginning: 'Student cannot identify food groups; uses tools unsafely; cannot articulate any health connection.', developing: 'Student identifies most food groups; uses tools safely with reminders; makes basic health connections.', proficient: 'Student makes nutritionally informed choices, uses tools safely and independently, identifies specific nutrients, and connects food to health outcomes.', advanced: 'Student designs a balanced snack from scratch with documented nutritional rationale, demonstrates excellent food safety practices, and can teach the preparation process to peers.' },
  teacherNotes: ['{child} noticed we had no protein in our snack and independently suggested adding hummus — nutritional awareness initiated by the student.', 'During Meal Prep, {child} taught two classmates the "claw grip" knife technique they had learned at home — culturally connected cooking knowledge shared as class leadership.'],
  parentReport: { example: 'Today your child planned and prepared a healthy snack as part of our Meal Prep and Nutrition lesson. They practiced food safety, identified nutrients, and made health-informed choices. These practical life skills are increasingly rare — and incredibly valuable. Your child showed genuine engagement and produced something genuinely healthy and delicious. Cooking together at home even once a week produces dramatic long-term health and life-skill outcomes.', homeExtension: 'This weekend, give your child one meal to plan and help prepare. Let them choose the menu (within basic nutritional parameters you set), help shop for ingredients, and participate in preparation. The ownership they feel for food they made themselves changes their relationship with healthy eating permanently.' },
  variations: { smallGroup: 'Small group cooking rotations: each group prepares one component of a larger shared meal.', wholeClass: 'Class potluck: each student prepares one item from home (with family) to share — celebrates food diversity.', outdoor: 'Outdoor cooking: safe no-heat preparations (salads, wraps, trail mix) in the outdoor space.', indoor: 'Cooking station with clear safety protocols and all materials prepared in advance.', lowResource: 'No-cook options (trail mix, salads, fruit platters) are just as nutritionally instructive as cooked foods.' },
  classroomMgmt: { transitions: 'Cleanup is a full part of the cooking lesson — 10 minutes must be allocated and enforced.', disruptions: 'Unsafe food handling requires immediate correction and, if repeated, reassignment to a non-tool task.', participation: 'Food allergies and dietary restrictions must be reviewed before every cooking session — safety is non-negotiable.', diverseLearners: 'Adapted cutting tools, alternative preparation methods, and tactile engagement with ingredients support diverse learners in full participation.' },
  materials: { required: ['Simple, safe ingredients for the chosen snack', 'Age-appropriate kitchen tools (safety knives, cutting boards, bowls)'], optional: ['Nutrition label examples for comparison', 'Kitchen scale for measuring'], printable: ['Snack nutrition planning worksheet', 'Food safety checklist'], digital: ['Nutrition.gov food group guide', 'USDA MyPlate resources'] }
};

/* ── SCHOOL AGE HEALTH ── */
COACHING_DATA['sah1'] = {
  intro: 'Today we talk about mental health. Not because something is wrong — because mental health is part of overall health, just like physical health, and everyone has it.',
  tips: ['Normalize before anything else: "Every person in this room, including me, has mental health — just like every person has physical health"', 'Never put any student on the spot about their personal mental health experience — create a culture of voluntary sharing', 'The coping strategy list must be personal and specific — "my dog helps me" is more actionable than generic strategies'],
  prompts: ['Mental health just means how we feel emotionally and how well we can handle life. When your body is sick, you take care of it. What about when your mind is struggling?', 'Name 5 things that help YOU specifically when you are stressed, overwhelmed, or sad. Not what should help — what actually helps you personally.', 'Who is one safe person you can talk to when you are struggling? Having one answer to that question matters enormously.'],
  close: 'Asking for help when you are struggling is not weakness. It is exactly what strong, self-aware people do. You now know five strategies and one person to reach. That is a mental health toolkit.',
  questions: { beginner: ['What does mental health mean to you?', 'What helps you when you feel stressed or overwhelmed?'], intermediate: ['What is the difference between feeling sad sometimes and needing support?', 'Who is someone safe you can talk to?'], advanced: ['How does physical health and mental health affect each other?', 'What prevents people from seeking help for mental health challenges?'], openEnded: ['What would a truly mentally healthy school look like?', 'If mental health was treated exactly like physical health, what would be different?'] },
  responses: { typical: 'Students engage thoughtfully when mental health is normalized and not stigmatized; personal coping strategies are highly individual.', strong: 'Students articulate sophisticated understanding of the mind-body connection, identify warning signs, and know clearly when and how to seek help.', shy: 'Journaling as the primary expression format allows shy students to engage deeply without public exposure.', limitedLanguage: 'Mental health concepts are universal; culturally specific expressions of wellbeing should be honored and included.' },
  shySupport: { prompts: ['Your journal is completely private. Write what is true for you without worrying about what I will think.', 'You do not have to share. You just need to have your own answers for yourself.'], alternatives: ['Anonymous questions submitted on paper — teacher addresses them without attributing to any student', 'Drawing as mental health expression rather than verbal or written'], encouragement: ['The honesty in what you wrote is brave. You understand yourself well.', 'You named a person you can go to. That connection is one of the most protective mental health factors that exists.'] },
  observation: ['Do students show comfort and normalcy around mental health as a topic?', 'Are students identifying personally relevant (not generic) coping strategies?', 'Can students identify trusted adults they can turn to?', 'Are students showing any shift in willingness to discuss mental health without stigma?'],
  rubric: { beginning: 'Student shows discomfort or refusal to engage with mental health topic; cannot name any coping strategy.', developing: 'Student engages with basic mental health concepts; names 1-2 coping strategies; shows emerging destigmatization.', proficient: 'Student articulates mental health as a universal condition; names 5 personal coping strategies; identifies a trusted adult; knows when to seek help.', advanced: 'Student demonstrates sophisticated mind-body awareness, advocates for mental health destigmatization, and takes responsibility for maintaining their own mental health proactively.' },
  teacherNotes: ['{child} shared "I talk to my grandmother when I\'m struggling because she never makes me feel bad for feeling bad" — profound insight into the quality of mental health support relationships.', 'During Mental Health Matters, {child} asked "Can teachers have bad mental health days too?" — opening a discussion that visibly normalized the topic for the whole class.'],
  parentReport: { example: 'Today your child participated in a Mental Health Matters lesson — discussing mental health as a normal part of overall health, identifying personal coping strategies, and naming safe people to turn to. This topic is addressed directly and positively. Your child engaged thoughtfully. The most powerful thing you can do at home is model mental health awareness: share (appropriately) when you are stressed, name your feelings, and show how you cope and seek support.', homeExtension: 'Share one real mental health moment with your child this week: "I had a stressful day today — I felt overwhelmed. So I [your actual coping strategy]." Modeling that adults have mental health experiences AND strategies normalizes help-seeking more than any lesson ever could.' },
  variations: { smallGroup: 'Small group mental health discussion: 4-6 students with a very specific discussion prompt.', wholeClass: 'Class mental health affirmations: establish a daily or weekly class wellbeing check-in ritual.', outdoor: 'Outdoor mindfulness and nature therapy: direct experience of natural stress reduction.', indoor: 'Journaling, mindfulness practice, and guided discussion in a calm, safe classroom environment.', lowResource: 'Discussion and journaling are the core materials — both cost nothing.' },
  classroomMgmt: { transitions: 'Mental health check-in as a brief daily ritual at morning meeting — one word or emoji representing current state.', disruptions: 'Students who become emotional during mental health discussions need immediate private check-in — never managed publicly.', participation: 'No student is required to share personal mental health information — voluntary sharing in a safe culture is the goal.', diverseLearners: 'Be aware of cultural variations in mental health expression and help-seeking behavior — no single framework is universal.' },
  materials: { required: ['Personal journals', 'Discussion prompts'], optional: ['Mindfulness audio recordings', 'Wellness wheel visuals', 'Calming sensory items'], printable: ['My 5 Coping Strategies personal card', 'Mental health continuum visual'], digital: ['Headspace for Kids', 'Calm app student version', 'Greater Good Science Center for Schools'] }
};

COACHING_DATA['sah2'] = {
  intro: 'Today we become nutrition label detectives. These labels are on almost everything you eat — and most people never learn to read them. After today, you will.',
  tips: ['Bring real food labels — students engage far more deeply with actual products than with worksheets about hypothetical foods', 'Teach serving size first — everything else on the label only makes sense relative to serving size', 'The comparison activity (choosing between two similar foods using only the label) is the culminating application and must not be skipped'],
  prompts: ['Look at the serving size first — always. Everything else on this label is based on that. How many servings are in this whole package?', 'Find the added sugar line. Not total sugar — ADDED sugar. That is the number to watch. What does this amount represent in teaspoons?', 'You have two cereals side by side. Using only the labels, which is the better choice? Write your recommendation and your evidence.'],
  close: 'Food companies spend billions designing labels that look healthy without being healthy. You now have the skills to read past the marketing and make real choices. That knowledge belongs to you.',
  questions: { beginner: ['Which food has less added sugar?', 'What is a realistic serving size?'], intermediate: ['Would you choose this food? Why or why not?', 'What does 15% Daily Value for sodium mean in practical terms?'], advanced: ['What does the ingredient list tell you that the nutrition facts panel does not?', 'How does the front of a package often mislead a person about what is actually inside?'], openEnded: ['Who is responsible for the health of your food choices — you, your parents, or food companies?', 'If you could change one thing about how food products are labeled, what would it be and why?'] },
  responses: { typical: 'Students are surprised by added sugar amounts; serving size revelation is the most impactful moment for most students.', strong: 'Students read labels with sophistication, make evidence-based food comparisons, and begin applying label literacy to real food choices at home.', shy: 'Label reading is individual and analytical — works well for shy students who prefer independent investigation to group discussion.', limitedLanguage: 'Nutrition labels are international; many of the same concepts appear on food from any country.' },
  shySupport: { prompts: ['Work through the label analysis yourself first — bring your findings to me when you are ready.', 'You can write your comparison recommendation rather than sharing it verbally.'], alternatives: ['Independent label analysis with written recommendation rather than group comparison discussion', 'Photo documentation of interesting label findings for private portfolio rather than class sharing'], encouragement: ['Your comparison analysis was the most detailed in the class — you read every line.', 'You caught the serving size trick that most adults miss. That is nutritional literacy.'] },
  observation: ['Can students locate and read the key elements: serving size, calories, added sugar, sodium, protein, vitamins?', 'Can students apply the data to make a reasoned food comparison?', 'Are students developing genuine skepticism about front-of-package marketing claims?', 'Are students articulating the relevance of nutrition literacy to their real food choices?'],
  rubric: { beginning: 'Student cannot locate or read basic nutrition label elements.', developing: 'Student can read serving size and 2-3 key nutrients; makes basic food comparisons with support.', proficient: 'Student reads a complete nutrition label, identifies added sugar vs. total sugar, makes an evidence-based food comparison, and articulates reasoning.', advanced: 'Student reads both nutrition facts and ingredients list, identifies misleading front-of-package marketing, makes sophisticated multi-factor comparisons, and applies label literacy to real shopping decisions.' },
  teacherNotes: ['{child} compared the ingredient list to the nutrition facts panel and noticed discrepancies that revealed hidden sugars — analytical reading at a sophisticated level.', 'During Nutrition Label Investigation, {child} converted added sugar grams to teaspoons for every product and was audibly shocked by one result — genuine nutritional literacy moment.'],
  parentReport: { example: 'Today your child investigated real nutrition labels — learning to read serving sizes, added sugar, sodium, protein, and vitamins, and then making an evidence-based food comparison. This nutritional literacy skill is one we hope students carry for life. The most powerful reinforcement is to pause at the grocery store together: "Which of these would you choose based on the label? Why?" One minute of applied label literacy beats any lesson.', homeExtension: 'Pull three items from your pantry this week and read the labels together. Ask your child to identify: serving size, added sugar, and one surprising finding. You will likely discover something surprising together — and that shared discovery makes the lesson stick.' },
  variations: { smallGroup: 'Nutrition comparison tournament: groups compare assigned products and present their findings.', wholeClass: 'Supermarket simulation: multiple "products" to choose between using label literacy.', outdoor: 'Farmers market visit or garden exploration: where food comes from before it has a label.', indoor: 'Nutrition label center with 8-10 real product labels and comparison task cards.', lowResource: 'Empty food packages collected from home are free and authentic.' },
  classroomMgmt: { transitions: 'Label collection homework: students bring 3 labels from home — builds investment and provides authentic materials.', disruptions: 'Students who are food-insecure may find this topic sensitive — frame all discussions around choice-empowerment, not judgment.', participation: 'Every student eats and is affected by food choices — universal relevance and urgency.', diverseLearners: 'Simplified label versions with key elements highlighted support students with reading challenges.' },
  materials: { required: ['Food labels from 4-6 different packaged products (real or printed)'], optional: ['Scale for measuring serving sizes', 'Teaspoon for converting sugar grams to spoons'], printable: ['Nutrition label reading guide', 'Food comparison analysis worksheet'], digital: ['Nutritionix food database for reference', 'USDA FoodData Central'] }
};

/* ── SCHOOL AGE CHARACTER ── */
COACHING_DATA['sach1'] = {
  intro: 'Today we do something that matters beyond our classroom walls. We identified a real community need — and today we start actually doing something about it.',
  tips: ['The service project must address a genuine need that students have identified themselves — assigned service produces compliance, not character development', 'Plan for real impact, not performance: a single hour of genuine community service done well beats a week of performative activity', 'Debrief must be individual and specific: "What did YOU specifically contribute? What changed because of what YOU did?"'],
  prompts: ['Before we start: name the specific community need we are addressing. Why does this matter? Who benefits?', '[During service] Stay present — this is real work for real people. What do you notice while you are doing it?', '[After service] What is one thing that is actually different in the world today because of what our class did?'],
  close: 'You changed something. It may be small in the scale of the world — but it is real, and it matters to the person or place you helped. And you discovered that you are capable of making things better. That never leaves you.',
  questions: { beginner: ['Why does this matter to you?', 'How did it feel to contribute to your community?'], intermediate: ['What did you learn about yourself by doing this?', 'What would happen if nobody did service like this?'], advanced: ['What systemic issue underlies the immediate need you addressed?', 'What would need to change so this service project would no longer be necessary?'], openEnded: ['What is the relationship between service and power?', 'What is one thing you could commit to doing consistently, even when there is no assignment or credit?'] },
  responses: { typical: 'Students begin with varying levels of commitment; authentic engagement increases dramatically as real impact becomes visible.', strong: 'Students show genuine investment in the quality of service, understand the systemic context, and commit to continued involvement beyond the assignment.', shy: 'Service work often draws out shy students who are deeply caring but non-performative — action suits their character better than speaking.', limitedLanguage: 'Service transcends language — action, care, and presence communicate across every barrier.' },
  shySupport: { prompts: ['You do not need to speak to make a difference. Your presence and your work here are the contribution.', 'Tell me quietly: what did you do today that mattered? Even one small thing.'], alternatives: ['Behind-the-scenes project roles: organizing, preparing, packaging rather than face-to-face service', 'Written reflection rather than verbal debrief for processing the experience'], encouragement: ['The person who received what you made may never know your name, but your care is in what you did. That matters.', 'You worked quietly and seriously the whole time. The people who do the work without needing the recognition — they are the ones who change the world.'] },
  observation: ['Are students present and genuinely engaged or performing engagement for teacher evaluation?', 'Do students understand the context and need behind the service, not just the task?', 'Do students articulate personal growth or insight from the service experience?', 'Do any students show spontaneous commitment to continued involvement?'],
  rubric: { beginning: 'Student participates minimally or only when directly supervised; cannot articulate why the service matters.', developing: 'Student participates appropriately; can name the need being addressed; reflects superficially on the experience.', proficient: 'Student participates fully and genuinely; understands the community need and their specific contribution; reflects meaningfully on what they learned about themselves.', advanced: 'Student contributes leadership to the service project, understands systemic context, makes genuine personal commitment to continued involvement, and articulates how this experience shapes their identity as a community member.' },
  teacherNotes: ['{child} stayed an extra 15 minutes to finish the task after the official session ended — intrinsic motivation and genuine civic commitment.', 'During Community Service, {child} said "I want to keep doing this even when there is no school project — how do I?" — the deepest possible outcome of service-learning education.'],
  parentReport: { example: 'Today your child participated in a Community Service Project — identifying a real need, planning, and executing meaningful service. Community service at this age builds civic responsibility, compassion, and the understanding that individuals have the power to make real differences. Your child showed genuine engagement and care. Service opportunities in your community — food banks, neighborhood cleanups, care packages — are powerful family experiences beyond the classroom.', homeExtension: 'Find one family service activity in the next month: a food bank volunteer shift, a neighborhood cleanup, a visit to a senior center. The family experience of service together is among the most formative experiences children cite in adulthood. Even one hour, done genuinely, matters.' },
  variations: { smallGroup: 'Small groups tackle different components of a larger service project — building shared ownership.', wholeClass: 'Class service as community: the shared experience builds class identity around contribution.', outdoor: 'Environmental service: trail restoration, tree planting, park cleanup — connects civic responsibility to environmental stewardship.', indoor: 'Care package assembly, letter writing, collection drives — all high-impact without leaving the classroom.', lowResource: 'Writing letters to isolated community members costs nothing and produces profound real-world impact.' },
  classroomMgmt: { transitions: 'Service preparation and cleanup are themselves service — build them into the project scope.', disruptions: 'Students disengaged from service may need a more personal connection to the beneficiary — make it real.', participation: 'Every student has capacity to serve — differentiate roles to match ability and maximize genuine contribution.', diverseLearners: 'Service projects must include roles accessible to all ability levels — the goal is authentic contribution, not identical task.' },
  materials: { required: ['Project materials (vary by service project)'], optional: ['Documentation camera', 'Project timeline', 'Thank-you note materials for the class to receive'], printable: ['Service project planning guide', 'Individual service reflection journal page'], digital: [] }
};

COACHING_DATA['sach2'] = {
  intro: 'I am going to read you a situation that does not have a clear right answer. Your job is to think through it — not perform the right answer, but actually think.',
  tips: ['Choose dilemmas that are genuinely difficult — situations where multiple defensible positions exist — not moral no-brainers that produce fake thinking', 'Small group discussion before full class sharing is essential — students develop and test their thinking in safer social conditions first', 'The teacher must be willing to share their own genuine ethical uncertainty — modeling intellectual honesty is more important than modeling certainty'],
  prompts: ['Read the dilemma. Before you say anything — think. What is the tension here? What two things are in conflict?', 'Small groups for 4 minutes: argue a position, then argue the OPPOSITE position. You need to understand both sides.', 'Full class: what is the most HONEST answer — not the one that sounds best, but what you would actually do? Why?'],
  close: 'Integrity is not just knowing what is right. It is doing what is right when it costs you something — when no one is watching, when the wrong choice is easier. That is the work of a lifetime.',
  questions: { beginner: ['What would the right thing be?', 'Why does integrity matter even when it is hard?'], intermediate: ['What would YOU actually do in that situation?', 'What makes an ethical choice harder than just knowing what is right?'], advanced: ['What ethical principles are in conflict in this dilemma?', 'What factors would change your decision, and why?'], openEnded: ['When have you made a decision you were proud of that nobody else knew about?', 'What is the relationship between who you are when no one is watching and who you really are?'] },
  responses: { typical: 'Students initially give the "right" answer; deeper questioning surfaces genuine complexity and honest uncertainty.', strong: 'Students engage with genuine ethical complexity, hold multiple perspectives simultaneously, and articulate principled positions with intellectual honesty about difficulty.', shy: 'Small group reasoning before full class sharing significantly increases shy student participation in ethics discussions.', limitedLanguage: 'Scenario cards with visual support increase accessibility; many ethical principles are culturally universal.' },
  shySupport: { prompts: ['Write your thinking first — you do not need to share unless you want to.', 'What would YOUR character do in this situation? Just tell me.'], alternatives: ['Anonymous written responses shared by teacher without attribution', 'One-on-one ethical discussion as alternative to group setting'], encouragement: ['You said something that the rest of us needed to hear. Thank you for that honesty.', 'You changed your mind based on someone\'s argument. That takes intellectual courage.'] },
  observation: ['Are students genuinely grappling with the dilemma or performing expected answers?', 'Are students considering multiple perspectives or defending a single position?', 'Do students show intellectual honesty about uncertainty?', 'Do students transfer ethical reasoning from scenarios to real classroom situations afterward?'],
  rubric: { beginning: 'Student gives a simple, unconsidered answer; cannot engage with the complexity or hear other perspectives.', developing: 'Student engages with the dilemma; takes a position; can name one counter-argument with prompting.', proficient: 'Student articulates a principled position with genuine reasoning; engages substantively with opposing views; shows intellectual honesty about difficulty.', advanced: 'Student identifies the underlying ethical principles in tension, holds genuine complexity without false resolution, changes position when presented with compelling argument, and articulates how ethical reasoning transfers to everyday decisions.' },
  teacherNotes: ['{child} said "I know what I should do but I am being honest — I am not sure I would actually do it" — the most intellectually honest response possible.', 'During Integrity Dilemmas, {child} argued both sides of the dilemma with equal force and then said "this is why integrity is hard" — moral sophistication beyond their years.'],
  parentReport: { example: 'Today your child participated in Integrity Dilemmas — discussing complex ethical scenarios where multiple positions are defensible. This builds moral reasoning, the ability to consider multiple perspectives, and intellectual honesty about the difficulty of ethical choices. Character is not built by knowing the right answers — it is built by practicing honest thinking in safe conditions. Your child engaged with real depth today.', homeExtension: 'Share a real ethical dilemma from your own life (age-appropriately) with your child. "I was in this situation and had to decide between X and Y — what would you have done?" Then share what you actually chose and why. Modeling your own ethical reasoning is the most powerful character education available.' },
  variations: { smallGroup: 'Socratic seminar format: structured small group ethical discussion with specific roles.', wholeClass: 'Full class debate: formal positions argued by assigned sides regardless of personal belief — builds perspective-taking.', outdoor: 'Ethical dilemmas observed in nature: resource competition, cooperation, predator/prey — connect to human ethical questions.', indoor: 'Ethics corner: a regular classroom space where dilemma cards are posted and students can discuss throughout the week.', lowResource: 'Scenario cards are the only material needed; great ethics discussions require nothing but genuine questions and willing thinkers.' },
  classroomMgmt: { transitions: 'Ethics discussions need clear opening and closing rituals — they are emotionally complex and need psychological safety.', disruptions: 'Personal attacks in ethics discussions are addressed immediately: "We are discussing ideas, not judging people."', participation: 'All participation modes are valid: verbal, written, nodding, questioning — the goal is genuine thinking, not performance.', diverseLearners: 'Scenario cards in home language support bilingual ethical reasoning; visual scenario supports non-readers.' },
  materials: { required: ['Age-appropriate scenario cards'], optional: ['Ethics discussion recording form', 'Personal integrity pledge card'], printable: ['Integrity dilemma scenario set', 'My Ethical Reasoning worksheet'], digital: [] }
};

COACHING_DATA['sach3'] = {
  intro: 'Today we start a habit that researchers have found increases happiness, improves sleep, strengthens relationships, and even improves physical health. It takes about 3 minutes per day.',
  tips: ['Model your own genuine gratitude first, every single time — not a model gratitude, an ACTUAL one from your real life today', 'The specificity requirement ("not just food — which specific food and why") transforms gratitude from a list to a practice', 'Never evaluate or grade a gratitude — any genuine response is right; any performed response is the only wrong answer'],
  prompts: ['I will start. Today I am genuinely grateful for [specific authentic gratitude]. Not because it is a big thing — because it is real.', 'Your turn. Not what you think I want to hear — what you actually felt grateful for today. Specific. Real.', '[After several shares] Look at this room. We all found something real. Gratitude is not about having a perfect life — it is about noticing the good that already exists in your real one.'],
  close: 'Gratitude is not pretending everything is fine. It is choosing to notice what is good even when everything is not. That choice, practiced daily, changes how your brain processes your life.',
  questions: { beginner: ['What are you genuinely grateful for today?', 'How does thinking about gratitude affect your mood?'], intermediate: ['What is the difference between being grateful and being satisfied with injustice?', 'Has gratitude ever changed how you experienced a hard day?'], advanced: ['How can you be genuinely grateful while also working to change things that are wrong?', 'What does neuroscience tell us about how gratitude changes the brain?'], openEnded: ['What would you have never been grateful for before but are now? What changed?', 'Is it possible to be grateful for a hard experience? Has that ever happened to you?'] },
  responses: { typical: 'Students begin with material gratitudes (food, games, phone); over weeks, shift toward relational and experiential gratitudes with practice.', strong: 'Students articulate nuanced gratitudes that include challenges, growth experiences, and other people\'s actions; show genuine positive affect shift during the practice.', shy: 'Written gratitude before verbal sharing ensures every student has something when called upon; private journaling is equally valid.', limitedLanguage: 'Gratitude is culturally universal; home-language journal entries are equally valid expressions of genuine gratitude.' },
  shySupport: { prompts: ['You can just share the word — not the whole explanation. One word about what you are grateful for is enough.', 'Your journal gratitude is just for you. You never have to share it.'], alternatives: ['Gratitude drawing rather than written or verbal expression', 'Gratitude letter to a specific person (never necessarily shared) as a deep alternative practice'], encouragement: ['What you said stopped me for a second — that was a really beautiful gratitude.', 'You are doing this practice genuinely, not just going through the motions. That is the difference that matters.'] },
  observation: ['Are student gratitudes becoming more specific and less generic over time?', 'Do students show genuine positive affect during the practice (not just compliance)?', 'Are students spontaneously expressing gratitude outside the formal practice?', 'Are students making connections between gratitude and their overall wellbeing?'],
  rubric: { beginning: 'Student cannot name anything they are grateful for; participates without engagement.', developing: 'Student names one generic gratitude with prompting; shows minimal affect change.', proficient: 'Student consistently names specific, genuine gratitudes; shows positive affect shift; begins expressing gratitude spontaneously outside the practice.', advanced: 'Student maintains a rich gratitude journal, articulates sophisticated connections between gratitude and wellbeing, practices gratitude independently at home, and demonstrates observable positive affect and relationship quality improvements over time.' },
  teacherNotes: ['{child} wrote in their gratitude journal "I am grateful that I have a teacher who takes us seriously" — a spontaneous, specific, relational gratitude that shows deep practice internalization.', 'During Gratitude Journal time, {child} said "Can I be grateful for something bad that turned out to help me?" — showing awareness of growth-from-adversity gratitude, the most sophisticated form.'],
  parentReport: { example: 'Today your child began our Daily Gratitude Journal practice — writing three specific things they are genuinely grateful for each day. Research from positive psychology consistently shows this simple practice increases happiness, resilience, and relationship quality across all ages. Your child engaged authentically today. The most powerful complement to this at home is to try it yourself, alongside your child — even once per week at dinner.', homeExtension: 'Start a family gratitude practice tonight: at dinner, each person shares one specific thing they are grateful for today. Not "my family" — one specific, real, named thing. Do this for 30 days. Research suggests 21 days of consistent practice creates a measurable shift in how the brain scans for positive experiences throughout the day.' },
  variations: { smallGroup: 'Gratitude partner share: pairs read one entry to each other — builds connection alongside practice.', wholeClass: 'Morning circle gratitude: 3-4 shares to open the school day — sets emotional tone for everything that follows.', outdoor: 'Gratitude walk: find 5 things in nature to be grateful for during a mindful outdoor walk.', indoor: 'Gratitude jar: all class entries collected weekly; a few read aloud anonymously to build community appreciation.', lowResource: 'Gratitude requires nothing but a moment of genuine attention — no materials whatsoever.' },
  classroomMgmt: { transitions: 'Gratitude journal as the end-of-day closing ritual — closes the emotional experience of the day with positive orientation.', disruptions: 'Silly gratitude entries are accepted without judgment; genuine silliness often transitions to genuine gratitude within the same session.', participation: 'Gratitude is never forced; silent, written participation is always a valid alternative to verbal sharing.', diverseLearners: 'Drawing, digital entry, voice recording, or verbal sharing — any expression mode is valid for the gratitude practice.' },
  materials: { required: ['Personal gratitude journals'], optional: ['Gratitude jar for class', 'Prompts for stuck days: "A person, an experience, something in nature"'], printable: ['Gratitude journal prompts set', 'My Gratitude Journal personal pages'], digital: ['Greater Good in Education: gratitude science resources', 'Headspace or Calm mindfulness apps'] }
};

})(); // end loadSchoolAgeCoaching2
