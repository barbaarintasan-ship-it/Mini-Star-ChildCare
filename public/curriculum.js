/* =================================================================
   Mini Star Child Care — Curriculum & Child Development System v1.0
   Research-based | Culturally Inclusive | Developmentally Appropriate
   Aligned with NAEYC DAP Guidelines & child development research
   ================================================================= */

/* ══════════════════════════════════════════════
   SECTION 1 — CONSTANTS & STATE
   ══════════════════════════════════════════════ */

const CLS_TO_AGE = {
  'Infants':    'infants',
  'Toddlers':   'toddlers',
  'Preschool':  'preschool',
  'School-Age': 'school_age'
};

const CURR_AGE_INFO = {
  infants:    { label: 'Infants',    range: '0–12 months', icon: '&#128118;', color: '#FFD9C4' },
  toddlers:   { label: 'Toddlers',   range: '1–3 years',   icon: '&#128105;', color: '#C8F0C8' },
  preschool:  { label: 'Preschool',  range: '3–5 years',   icon: '&#127912;', color: '#C4DDFF' },
  school_age: { label: 'School Age', range: '5–12 years',  icon: '&#128218;', color: '#E8D4FF' }
};

const CURR_CATS = [
  { id: 'language',    label: 'Language',         icon: '&#128172;', color: '#2ABFB8' },
  { id: 'cognitive',   label: 'Cognitive',         icon: '&#129504;', color: '#4A8BC4' },
  { id: 'social',      label: 'Social-Emotional',  icon: '&#10084;',  color: '#E86B6B' },
  { id: 'physical',    label: 'Physical',           icon: '&#127939;', color: '#4A9E4A' },
  { id: 'creativity',  label: 'Creativity & Arts',  icon: '&#127912;', color: '#C8960A' },
  { id: 'life_skills', label: 'Life Skills',         icon: '&#11088;',  color: '#8B4AB8' },
  { id: 'health',      label: 'Health & Wellness',  icon: '&#127807;', color: '#2E9E8A' },
  { id: 'character',   label: 'Character',           icon: '&#127775;', color: '#B87828' }
];

const ML_LEVELS = ['Beginning', 'Emerging', 'Developing', 'Proficient', 'Advanced'];
const ML_LEVELS_ES = ['Inicial', 'Emergente', 'En desarrollo', 'Competente', 'Avanzado'];
function mlLabel(l) { const i = ML_LEVELS.indexOf(l); return typeof LANG !== 'undefined' && LANG === 'es' && i >= 0 ? ML_LEVELS_ES[i] : l; }
const ML_COLORS  = ['#DDD', '#F7C4C4', '#FFE08A', '#A8D8A8', '#4ECDC4'];

const CURR_THEMES = [
  'All About Me','My Family & Friends','Animals & Nature','Colors & Shapes',
  'Numbers & Counting','Seasons & Weather','Food & Nutrition','Community Helpers',
  'Plants & Growing','Water & Science','Music & Movement','Feelings & Emotions',
  'Transportation','Insects & Bugs','Ocean & Sea Life','Space & Stars',
  'Sports & Exercise','Holidays Around the World','STEM & Technology','Kindness & Compassion'
];

const STATUS_OPTS = [
  { val: 'pending',   label: 'Not Started', es: 'No Iniciado', icon: '&#9634;',  cls: '' },
  { val: 'completed', label: 'Completed',   es: 'Completado',  icon: '&#9989;',  cls: 'success' },
  { val: 'partial',   label: 'Partial',     es: 'Parcial',     icon: '&#9888;',  cls: 'warn' },
  { val: 'skipped',   label: 'Skipped',     es: 'Omitido',     icon: '&#10006;', cls: 'muted' }
];

let CURR_SUB       = 'today';
let CURR_DATE_VIEW = '';
let CURR_CHILD_SEL = '';
let CURR_LIB_CAT   = 'all';
let CURR_LIB_AGE   = 'all';
let CURR_GEN_AGE   = '';
let CURR_GEN_THEME = '';
let CURR_GEN_RESULT = null;

/* ══════════════════════════════════════════════
   SECTION 2 — ACTIVITY LIBRARY
   ══════════════════════════════════════════════ */

function act(id, title, obj, mats, steps, qs, benefits, dur, diff) {
  return { id, title, obj, mats, steps, qs, benefits, dur, diff };
}

const ACTIVITY_LIBRARY = {

  /* ─── INFANTS ─── */
  infants: {
    language: [
      act('il1','Name It Game','Build receptive vocabulary through naming',['Colorful toys','Common objects'],['Hold up an object at baby\'s eye level','Say its name clearly and slowly 3 times','Pause and watch for baby\'s response','Repeat with 3 different objects'],['Can you see the ball?','Where is the cup?'],'Early word association, listening, and language foundations',10,1),
      act('il2','Sing & Sign','Introduce early words through song and gesture',['No materials needed'],['Sing simple songs with repeated words','Add hand gestures for key words: more, all done, milk','Pause and wait for any baby response','Celebrate any attempt to communicate'],['Do you want more?','All done?'],'Pre-verbal communication and early language development',10,1),
      act('il3','Lap Story Time','Expose baby to language rhythm and book concepts',['Board books with simple pictures'],['Sit baby in lap facing book','Point to pictures and name each one','Use expressive voice and facial expressions','Let baby touch and turn board book pages'],['What do you see?','Can you touch the dog?'],'Early literacy, vocabulary, and bonding through shared reading',10,1),
      act('il4','Sound Discovery','Develop auditory awareness and discrimination',['Shakers','Bells','Squeaky toys'],['Make a sound near baby and wait for reaction','Name each sound: "That is a bell!"','Vary volume, pitch, and distance','Watch for baby to locate the sound source'],['Did you hear that?','Where is the sound coming from?'],'Auditory processing and early cause-and-effect understanding',8,1)
    ],
    cognitive: [
      act('ic1','Peek-A-Boo','Develop object permanence and anticipation',['Soft cloth or blanket'],['Hide face behind cloth','Ask: "Where did I go?"','Reveal face with "Peek-a-boo!"','Try hiding a toy under the cloth too'],['Where did it go?','Is it there?'],'Object permanence, memory, and social-cognitive development',8,1),
      act('ic2','Texture Exploration','Stimulate sensory-cognitive learning',['Fabric swatches: soft, rough, smooth','Safe natural textures'],['Present one texture at a time','Guide baby hand gently to feel it','Name the texture: "Soft! Bumpy!"','Watch and narrate facial reactions'],['Is that soft?','What does that feel like?'],'Sensory processing, cognitive curiosity, and tactile learning',12,1),
      act('ic3','Container Play','Build cause-effect and spatial reasoning',['Safe containers','Large soft blocks or balls'],['Demonstrate putting a block into the container','Let baby try independently','Cheer every attempt no matter the result','Try different sized containers'],['Can it fit?','Where did it go?'],'Spatial reasoning, problem solving, and fine motor planning',10,1),
      act('ic4','Mirror Discovery','Develop self-recognition and social awareness',['Safe unbreakable baby mirror'],['Hold baby in front of mirror','Point to reflection: "That is you!"','Make funny faces together','Name body parts seen in mirror'],['Who is that?','Can you touch your nose?'],'Self-awareness, identity, and social-cognitive development',8,1)
    ],
    social: [
      act('is1','Emotion Faces','Introduce basic emotional vocabulary',['Emotion picture cards'],['Make a happy face: "Happy!"','Make a sad face: "Sad!"','Let baby touch the cards','Mirror any expression baby makes'],['Are you happy?','Look at the happy face!'],'Emotional recognition, social bonding, and early empathy',8,1),
      act('is2','Gentle Touch Routine','Build trust through caring interaction',['Soft cloth','Gentle lotion if appropriate'],['Engage in gentle massage or touch play','Name body parts being touched','Talk soothingly throughout','Follow baby cues for comfort and pace'],['Does that feel good?','Is this your hand?'],'Secure attachment, trust, body awareness, and well-being',10,1),
      act('is3','Group Floor Time','Build early peer awareness',['Play mat','Soft toys'],['Place babies on play mat together','Let babies notice each other','Name each baby: "Look, that is Mia!"','Facilitate gentle safe interactions'],['Do you see your friend?'],'Early peer awareness, social interest, and group belonging',15,1),
      act('is4','Call and Response','Build secure attachment through communication',['No materials needed'],['Wait for baby to vocalize or gesture','Respond immediately and warmly','Imitate baby sounds back to them','Take turns in a back-and-forth "conversation"'],[],'Secure attachment, communication, trust, and language turn-taking',10,1)
    ],
    physical: [
      act('ip1','Tummy Time','Strengthen neck and core muscles',['Play mat','Colorful toys placed in front'],['Place baby on tummy on mat','Place bright toy slightly ahead to motivate lifting','Encourage baby to lift head to look','Keep session to 5-10 minutes; watch for fatigue'],['Can you reach the toy?','Look up here!'],'Neck strength, back muscles, head control, and motor foundations',10,1),
      act('ip2','Reach & Grasp','Develop fine motor control and hand-eye coordination',['Dangling toys or rings at reaching distance'],['Position baby on back','Hold toy just within reach','Encourage reaching and grasping','Let baby bring to mouth safely'],['Can you grab it?','Reach for it!'],'Fine motor skills, hand-eye coordination, and intentional movement',8,1),
      act('ip3','Supported Sitting','Build core strength for independent sitting',['Boppy pillow or caregiver lap support'],['Support baby in seated position','Let baby explore while sitting','Place toys at sides to encourage turning','Gradually reduce support as strength grows'],['Can you sit up?','Look over here!'],'Core strength, balance, postural control, and spatial awareness',10,1),
      act('ip4','Kicking Play','Strengthen leg muscles and motor control',['Hanging toy bar or soft target for baby to kick'],['Place baby on back under toy bar','Encourage kicking with feet','Name the action: "You are kicking!"','Let baby feel the reward of making the toy move'],['Can you kick it?','Kick kick kick!'],'Leg strength, intentional motor control, and cause-effect joy',8,1)
    ],
    creativity: [
      act('icr1','Music & Movement','Introduce rhythm, music, and joyful movement',['Soft music player','Rattles or shakers'],['Play gentle music','Move baby arms and legs gently to rhythm','Use rattles to add sounds','Sing simple songs throughout'],['Do you hear the music?','Let\'s dance!'],'Auditory processing, rhythm awareness, and joy of music',10,1),
      act('icr2','Sensory Art Bag','Safe visual-creative exploration',['Zip-lock bag sealed with colored paint inside','Tape to secure bag flat'],['Tape sealed paint bag to flat surface','Let baby push and smear paint through bag safely','Name colors: "Red! Blue!"','Celebrate marks baby makes'],['What colors do you see?','You made that!'],'Visual tracking, sensory processing, and early cause-effect creativity',10,1),
      act('icr3','Nature Sounds','Introduce natural sounds and calm',['Recordings of birds, rain, or ocean waves'],['Play nature sounds softly during rest or play time','Comment on what you hear: "That is rain!"','Watch baby\'s reactions and name them','Vary sounds across the week'],['Do you hear the birds?','Listen...'],'Auditory awareness, calm regulation, and connection to nature',10,1)
    ],
    life_skills: [
      act('ils1','Clean Up Signal','Introduce routine and transition awareness',['Consistent clean-up song or phrase'],['Sing the same "clean up" song every time','Demonstrate putting one toy away','Guide baby hand in the motion','Make it celebratory: "We did it!"'],[],'Routine understanding, transition skills, and early responsibility',5,1),
      act('ils2','Self-Feeding Exploration','Develop early independence with eating',['Age-appropriate finger foods','High chair'],['Offer safe finger foods on tray','Let baby pick up and bring to mouth','Name each food clearly','Praise any self-feeding attempt warmly'],['Yummy! What are you eating?'],'Self-care independence, fine motor control, and healthy eating attitudes',15,1)
    ],
    health: [
      act('ih1','Wash Hands Together','Introduce hygiene routines early',['Warm water','Gentle baby-safe soap'],['Hold baby at sink','Wash hands together as a pair','Say: "We are washing our hands!"','Make it playful with a song or counting'],['Are we clean now?'],'Lifelong hygiene habits and routine familiarity',5,1),
      act('ih2','Outdoor Fresh Air','Provide fresh air and nature connection',['Stroller or carrier','Weather-appropriate clothing'],['Take baby outside in safe weather','Describe what you see: trees, sky, birds','Let baby feel a gentle breeze','Point out colors, sounds, and movement'],['Do you feel the wind?','Look at the tree!'],'Physical health, vitamin D, sensory awareness, and nature connection',15,1)
    ],
    character: [
      act('ich1','Gentle & Kind','Model gentleness and caring through play',['Stuffed animal'],['Show gentle touch with stuffed animal','Say: "We are being gentle and kind"','Guide baby in gentle petting motion','Model care: "The bear is happy because we are kind!"'],['Can you be gentle?'],'Empathy, kindness, and gentle behavioral foundations',8,1),
      act('ich2','Thank You Ritual','Introduce gratitude through daily modeling',['No materials needed'],['Say "Thank you!" sincerely when giving or receiving','Model a wave or clap as a "thank you"','Celebrate when baby imitates the gesture','Make it warm, real, and consistent daily'],['Can you say thank you?'],'Gratitude, social courtesy, and positive relationship foundations',5,1)
    ]
  },

  /* ─── TODDLERS ─── */
  toddlers: {
    language: [
      act('tl1','Word of the Day','Expand vocabulary with daily new word',['Picture card or real object'],['Introduce one new word in morning circle','Say slowly: "Today\'s word is BUTTERFLY"','Show a picture or the real object','Use the word all day; review at close'],['Can you say butterfly?','What do butterflies do?'],'Vocabulary building, memory, and daily language enrichment',10,1),
      act('tl2','Two-Word Conversations','Practice two-word phrases in context',['Common toys and objects'],['Model two-word phrases: "Big ball!" "More juice!"','Ask questions that invite two-word answers','Wait patiently for the child\'s response','Expand what child says: "dog run" → "Yes, the dog is running!"'],['What is this?','What is it doing?'],'Expressive language, sentence construction, and communication confidence',10,1),
      act('tl3','Interactive Storytime','Build listening comprehension and narrative understanding',['Picture books'],['Read with enthusiasm and expression','Point to pictures and name everything','Ask: "What happens next?"','Let children turn pages and connect story to real life'],['What do you see here?','How does the dog feel?','Has that happened to you?'],'Comprehension, vocabulary, narrative understanding, and reading joy',12,2),
      act('tl4','Action Songs','Connect movement to language learning',['Space to move'],['Teach action songs: Wheels on the Bus, If You\'re Happy','Sing slowly with exaggerated movements','Pause so children can fill in the words','Repeat until children anticipate words'],['What comes next?','Can you show me the motion?'],'Vocabulary, memory, sequencing, and love of language through song',10,1)
    ],
    cognitive: [
      act('tc1','Shape Sorting','Develop shape recognition and problem solving',['Shape sorter toy'],['Name each shape: "This is a circle"','Let child try to fit each shape independently','Give hints if stuck: "Try turning it"','Celebrate every success warmly'],['What shape is this?','Which hole does it fit?','Can you find the circle?'],'Shape recognition, problem solving, spatial reasoning, and persistence',12,2),
      act('tc2','Simple Puzzles','Build problem solving and visual-spatial skills',['2-4 piece puzzles'],['Show completed puzzle first','Take apart one piece at a time','Let child replace each piece','Give visual clues: "Look at the shape of the space"'],['Where does this piece go?','What do you see on this piece?'],'Spatial reasoning, persistence, problem solving, and confidence',15,2),
      act('tc3','Matching Pairs','Build memory and visual discrimination',['Simple matching cards: animals, colors, shapes'],['Lay all cards face up first','Practice matching with visible cards','Turn face down for memory challenge','Take turns flipping cards'],['Do they match?','Are they the same?','Can you remember where it is?'],'Visual memory, discrimination, and concentration skills',12,2),
      act('tc4','Big & Little Sorting','Develop size concepts and comparison',['Big and small versions of same objects'],['Present big and small objects side by side','Say: "This one is BIG! This one is little"','Let child sort into big/little groups','Compare: "Which is bigger?"'],['Which is bigger?','Find the little one!','Are these the same size?'],'Comparative thinking, sorting, and early mathematical concepts',10,1)
    ],
    social: [
      act('ts1','Feelings Check-In','Build emotional vocabulary and self-awareness',['Feelings faces chart'],['Show feelings chart in morning circle','Ask each child: "How do you feel today?"','Name the feeling: "You feel happy!"','Validate all feelings: "It is OK to feel that way"'],['How do you feel?','What does happy look like?','Why do you feel that way?'],'Emotional vocabulary, self-awareness, and emotional acceptance',10,1),
      act('ts2','Turn-Taking Timer','Practice sharing and patience',['Popular toy','Visual timer'],['Introduce: "We share in our class!"','Use visual timer for turns','Coach: "First Sofia, then it is Maya\'s turn"','Praise sharing: "You shared! That was so kind!"'],['Whose turn is it?','How does it feel to wait?','How did it feel to share?'],'Sharing, patience, cooperation, and social negotiation',15,2),
      act('ts3','Kindness Catcher','Notice and celebrate acts of kindness',['Kindness jar','Small paper slips'],['Introduce the Kindness Jar','Notice kind acts throughout the day','Write or draw the kind act on paper','Add to jar: "Maya helped pick up! That is kindness!"'],['Was that kind?','How did your friend feel when you helped?'],'Empathy, kindness awareness, and prosocial behavior development',5,1),
      act('ts4','My Space Awareness','Develop body boundaries and personal space',['Hula hoops or carpet squares'],['Give each child a hoop or mat: "This is your space"','Practice moving without entering others\' space','Role-play asking permission: "May I sit with you?"','Discuss: "How does it feel when someone respects your space?"'],['Is this your space or mine?','How do we ask to join someone?'],'Personal boundaries, spatial awareness, and social respect',10,1)
    ],
    physical: [
      act('tp1','Obstacle Course','Build gross motor coordination and balance',['Pillows, tunnels, balance beams, cones'],['Set up simple course: crawl, jump, walk on line','Demonstrate each step clearly','Guide child through the course','Adjust difficulty as child masters each section'],['Can you crawl through?','Jump over the pillow!','Walk on the line!'],'Gross motor skills, coordination, balance, and physical confidence',20,2),
      act('tp2','Tong Transfer','Develop hand strength and fine motor control',['Tongs','Cotton balls','Two bowls'],['Demonstrate using tongs to pick up cotton balls','Let child practice at their own pace','Transfer cotton balls from bowl to bowl','Progress to smaller objects as skill grows'],['Can you pick it up?','Squeeze the tongs!'],'Hand strength, pincer grip, fine motor precision, and focus',12,2),
      act('tp3','Dance & Freeze','Develop body control and listening skills',['Music player'],['Play music and let children dance freely','Stop music suddenly: children freeze!','Call body positions: "Freeze like a tree!"','Restart music and repeat'],['Can you freeze?','What is your body doing right now?'],'Body awareness, motor control, listening, and self-regulation',12,1),
      act('tp4','Playdough Workout','Strengthen hand and finger muscles',['Playdough','Rolling pins','Cookie cutters'],['Roll, squeeze, poke, and flatten playdough','Use rolling pin to flatten','Cut with cookie cutters','Make simple shapes, animals, and objects'],['What are you making?','Squeeze it hard!','Can you make it flat?'],'Fine motor strength, hand-eye coordination, and creative expression',15,1)
    ],
    creativity: [
      act('tcr1','Color Mixing Magic','Explore color creation through mixing',['Red, blue, yellow paint','White paper','Brushes'],['Put two primary colors on paper','Let child mix with brush or fingers','Name the new color: "Red and blue makes purple!"','Explore all color combinations together'],['What color did you make?','What happens if we add more blue?'],'Creativity, cause-effect thinking, and color knowledge',15,1),
      act('tcr2','Rhythm Instruments','Explore beat, rhythm, and music making',['Drums, shakers, bells, or homemade instruments'],['Give each child an instrument','Clap a simple beat; children copy','Play fast/slow, loud/soft alternating','Create a group rhythm together'],['Can you copy my beat?','Play it fast! Now slow!'],'Musical awareness, rhythm, listening skills, and creative joy',12,1),
      act('tcr3','Story Drawing','Express stories through drawing',['Paper','Crayons'],['Tell or read a short story together','Ask children to draw what happened','Let each child narrate their drawing','Write their exact words on the paper for them'],['What did you draw?','Tell me about your picture'],'Creative expression, narrative skills, and early literacy connection',15,2)
    ],
    life_skills: [
      act('tls1','Table Setting','Practice responsibility and daily life routines',['Plates, cups, napkins'],['Show where each item belongs','Give one item to place at a time','Praise effort: "You placed the cup perfectly!"','Make it part of daily routine'],['Where does the cup go?','What comes next?'],'Responsibility, sequencing, independence, and community contribution',8,1),
      act('tls2','Dress Self Practice','Build dressing independence and fine motor skills',['Large-button shirts','Zip practice boards','Velcro shoes'],['Start with large zippers or buttons','Demonstrate slowly, step by step','Let child try fully independently','Celebrate any attempt: "You did it yourself!"'],['Can you do it yourself?','Pull the zipper up!'],'Self-care independence, persistence, and fine motor development',10,2),
      act('tls3','Picture Label Clean-Up','Build responsibility and organizational matching',['Labeled bins with picture labels'],['Sing clean-up song to signal time','Show where each toy goes with picture labels','Child matches toy to the picture label on bin','High five for completing clean-up'],['Where does the block go?','Find the matching picture!'],'Responsibility, visual matching, and organizational habits',8,1)
    ],
    health: [
      act('th1','Hand Washing Song','Build proper hand washing as a lifelong habit',['Sink','Soap','Paper towels'],['Sing a 20-second hand washing song together','Scrub all parts: palms, backs, between fingers','Rinse thoroughly and dry','Practice before meals, after outdoor play, after bathroom'],['Did we get all the germs?','Why do we wash our hands?'],'Hygiene habits, germ prevention, and health independence',5,1),
      act('th2','Rainbow on My Plate','Introduce healthy food variety and nutrition',['Pictures of colorful fruits and vegetables or real samples'],['Show a rainbow of colored fruits and vegetables','Name each food and its color','Explain: "Different colors give us different healthy things!"','Let children share their favorites'],['What color is this food?','Is this food healthy?','Which color do you like most?'],'Nutritional awareness, healthy food attitudes, and food variety appreciation',10,1)
    ],
    character: [
      act('tch1','Honesty Story','Teach the value of honesty through narrative',['Book about honesty or teacher-told story'],['Tell a story about a character who tells the truth even when it is hard','Discuss how it made everyone feel','Ask: "What would YOU do?"','Practice saying honest statements in role play'],['Why did he tell the truth?','How did his friends feel?','When is it hard to be honest?'],'Honesty, trust, integrity, and moral development',12,2),
      act('tch2','Patience Garden','Practice patience through plant care',['Seeds','Small cups','Soil','Water'],['Plant a seed together','Explain: "It needs time to grow"','Check on it together every day','Connect to life: "Some wonderful things need patience"'],['Has it grown yet?','Why do we need to wait?','What are you waiting patiently for?'],'Patience, responsibility, delayed gratification, and nature connection',15,1),
      act('tch3','Gratitude Circle','Practice daily gratitude',['No materials needed'],['In afternoon circle, each child shares one thing they are thankful for','Teacher models: "I am thankful for our wonderful class!"','Validate all responses warmly','Connect gratitude to feelings of happiness'],['What are you thankful for today?','How does it feel to think about that?'],'Gratitude, positive mindset, and emotional well-being',8,1)
    ]
  },

  /* ─── PRESCHOOL (3–5 years) ─── */
  preschool: {
    language: [
      act('pl1','Read-Aloud Deep Dive','Build comprehension and critical thinking through books',['Age-appropriate picture book'],['Read with expression and enthusiasm','Stop at key moments for prediction questions','Discuss characters, feelings, and events','Retell the story together in sequence','Connect story to children\'s own lives'],['What do you think will happen?','How does the character feel?','Has this ever happened to you?','What would YOU do?'],'Deep comprehension, vocabulary, critical thinking, and love of books',15,2),
      act('pl2','Letter Sound Hunt','Develop phonological awareness and reading readiness',['Letter of the week card','Objects beginning with that letter'],['Introduce the letter of the week with its sound: "/B/ for Ball!"','Show the letter in print','Hunt around the room for objects starting with that sound','Sort objects by beginning sound'],['What sound does B make?','Does ball start with B?','Find something that starts with /s/!'],'Phonological awareness, letter-sound connections, and early reading readiness',15,2),
      act('pl3','Show & Tell Circle','Build presentation and communication confidence',['Each child brings one special item from home'],['Each child has 2 minutes to show and describe their item','Class asks 3 questions','Teacher models active listening','Celebrate every presenter'],['What is it?','What does it feel like?','Why did you bring it today?'],'Speaking confidence, listening skills, descriptive language, and community sharing',20,2),
      act('pl4','Rhyme Time Workshop','Build phonological awareness through rhyme play',['Rhyming books or cards'],['Read a rhyming book or poem together','Identify rhyming pairs: "Cat/Hat — do they rhyme?"','Complete rhymes: "I see a cat sitting on a ___"','Create silly rhymes together as a group'],['Do these words rhyme?','What rhymes with dog?','Make a silly rhyme!'],'Phonological awareness, memory, prediction, and early literacy foundations',12,2)
    ],
    cognitive: [
      act('pc1','Pattern Making','Develop mathematical pattern recognition',['Colored blocks','Pattern cards'],['Create a simple AB pattern: red, blue, red, blue','Ask child to copy the pattern','Ask: "What comes next?"','Create ABC patterns for advanced learners'],['What comes next?','Can you see the pattern?','Make your own pattern!'],'Mathematical thinking, sequencing, prediction, and algebraic reasoning',15,2),
      act('pc2','Nature Science Exploration','Build scientific observation and inquiry',['Magnifying glasses','Natural objects: leaves, rocks, seeds'],['Give each child a magnifying glass','Examine natural objects up close and describe','Ask open-ended observation questions','Record findings through drawing in a science journal'],['What do you see?','Why do you think that happens?','What would happen if...?'],'Scientific thinking, observation skills, and curiosity-driven inquiry',20,2),
      act('pc3','Number Sense Practice','Build deep counting and number understanding',['Counting manipulatives','10-frame mats'],['Set up counting collections of 10-20 items','Count together, touching each object once','Sort into groups and compare','Ask: "Which group has more? How do you know?"'],['How many?','Which group has more?','Can you count backwards from 10?'],'Number sense, one-to-one correspondence, cardinality, and comparison',15,2),
      act('pc4','Memory Challenge','Strengthen working memory and attention',['Colored blocks','Tray'],['Build a simple 3-block structure on a tray','Show it for 5 seconds, then cover it','Child rebuilds from memory','Gradually increase complexity each session'],['What did you see?','How many blocks were there?','What color was on top?'],'Working memory, attention, spatial recall, and concentration',12,3)
    ],
    social: [
      act('ps1','Peace Corner Practice','Teach structured conflict resolution',['Peace corner with calming tools','Feelings chart','Calm-down jar'],['Introduce the peace corner: "A place to calm down and solve problems"','When conflict occurs, go to the peace corner','Use I-messages: "I feel ___ when ___ because ___"','Work toward a solution together'],['How do you feel?','What do you need right now?','How can we solve this together?'],'Conflict resolution, emotional regulation, problem-solving, and empathy',15,3),
      act('ps2','Cooperative Building','Develop teamwork and shared decision making',['Blocks or construction materials'],['Assign pairs or small groups','Give a building challenge: "Build a bridge strong enough to hold a book"','Must plan and build together','Present and explain the finished project'],['How will you work together?','Who will do what?','What happened when you disagreed?'],'Cooperation, communication, leadership, and creative teamwork',20,3),
      act('ps3','Empathy Role Play','Build perspective-taking and empathy through puppets',['Puppets or dolls'],['Use puppets to act out relatable scenarios','Example: "The new puppy is scared and alone"','Ask: "How does the puppy feel?"','What could we do to help?'],['How does the puppy feel?','What would you do?','How would YOU feel if that happened to you?'],'Empathy, perspective-taking, prosocial behavior, and emotional intelligence',15,2),
      act('ps4','Calming Toolbox','Teach self-regulation strategies for big feelings',['Glitter calm-down jar','Breathing visuals','Calm music'],['Introduce 4-5 calming strategies: deep breathing, counting, hugging, squeezing hands','Practice each strategy when children are calm','Reference toolbox when upset occurs','Practice together daily at check-in time'],['Which strategy helps you most?','Take 3 deep breaths with me','What helps you feel calm again?'],'Emotional self-regulation, coping strategies, and emotional independence',12,2)
    ],
    physical: [
      act('pp1','Scissor Skills Station','Develop fine motor precision and cutting control',['Child safety scissors','Pre-drawn lines and shapes on paper'],['Demonstrate correct scissor grip clearly','Practice opening and closing scissors','Cut along straight lines first','Progress to gentle curves, then shapes'],['Are your fingers in the right holes?','Can you cut exactly on the line?'],'Fine motor control, hand dominance, bilateral coordination, and precision',15,3),
      act('pp2','Kids Yoga Flow','Develop balance, flexibility, and body mindfulness',['Yoga mats or carpet squares'],['Teach 5 animal poses: cat, dog, tree, butterfly, cobra','Hold each pose for 5 deep breaths','Flow between poses smoothly','Connect poses to a nature story narrative'],['Can you balance like a tree in the wind?','Take a deep breath in this pose'],'Balance, flexibility, body awareness, mindfulness, and calm focus',15,2),
      act('pp3','Ball Skills Circuit','Develop throwing, catching, and hand-eye coordination',['Soft balls of varying sizes'],['Start with large ball, short distance','Practice underhand throw with proper form','Catch with two hands extended','Progress to smaller balls and longer distances'],['Use two hands to catch!','Are you ready?','Great catch!'],'Hand-eye coordination, motor timing, athletic confidence, and persistence',15,2),
      act('pp4','Pre-Writing Practice','Develop the foundational strokes needed for writing',['Sand trays','Chalkboard','Large chalk or fat crayons'],['Practice vertical strokes: top to bottom','Horizontal strokes: left to right','Circles: counterclockwise','Diagonal strokes: top-right to bottom-left, top-left to bottom-right'],['Which way does this line go?','Try to make it smooth and even'],'Pre-writing skills, pencil control, directionality, and fine motor precision',15,2)
    ],
    creativity: [
      act('pcr1','Process Art Studio','Encourage creative expression without a product focus',['Varied art materials: paint, collage, clay, fabric'],['Set up an open art invitation','Show NO model or example — let children create freely','Children explore materials in their own way','Ask about their process, not the product'],['Tell me about what you made','What did you enjoy making?','How did you do that?'],'Creative confidence, self-expression, risk-taking, and artistic joy',20,1),
      act('pcr2','Dramatic Play World','Develop imagination and social skills through role play',['Dress-up clothes','Themed props: grocery store, doctor office, kitchen'],['Set up themed dramatic play environment','Introduce the theme and available props','Children create their own scenarios freely','Teacher narrates to extend and enrich play'],['What is happening in your story?','Who are you today?','What happens next?'],'Imagination, language development, social skills, and creative problem-solving',25,1),
      act('pcr3','Original Song Making','Create original music, words, and rhythm as a class',['Instrument or simple beat'],['Teach a simple repeating melody','Change words to create a new class song','Let children volunteer new verses','Record and celebrate the group creation'],['What should our song be about?','What rhymes with sun?'],'Creativity, phonological awareness, musical expression, and group collaboration',15,2)
    ],
    life_skills: [
      act('pls1','Classroom Jobs Board','Build responsibility through meaningful classroom roles',['Job chart with name cards and picture labels'],['Assign daily classroom job: door holder, plant waterer, line leader, messenger','Explain the responsibilities clearly','Child completes job independently throughout the day','Whole class thanks the job holder at end of day'],['What is your job today?','Did you complete your job?','Why are classroom jobs important?'],'Personal responsibility, community contribution, and self-efficacy',5,1),
      act('pls2','Independent Lunch Routine','Build meal independence and sequential self-care',['Lunch boxes and napkins'],['Children open their own lunch boxes','Spread their own napkins independently','Self-serve when possible','Clean up their own space after eating'],['Can you open that yourself?','What comes next in our routine?'],'Independence, self-care, sequential thinking, and personal responsibility',20,2),
      act('pls3','Problem Solving Steps','Teach a systematic problem-solving framework',['Problem-solving poster: Stop, Think, Choose, Do'],['Introduce the 4 steps: Stop, Think, Choose, Do','Role-play a simple daily problem','Walk through each step slowly','Practice throughout the day with real situations'],['What is the problem?','What can you do?','Which choice is the best one?'],'Independent problem-solving, critical thinking, and decision-making skills',12,3)
    ],
    health: [
      act('ph1','Body Care Connection','Learn body parts and corresponding hygiene practices',['Body outline drawing','Toothbrushes for practice'],['Review major body parts','Connect each to how we care for it: teeth→brush, hair→wash','Practice brushing teeth with toothbrushes','Create a personal body care chart together'],['How do we take care of our teeth?','Why is it important to wash our hair?'],'Health literacy, personal hygiene habits, and body autonomy',15,2),
      act('ph2','Safety Rules Circle','Learn and practice basic personal safety',['Safety picture cards'],['Discuss one safety rule at a time','Show what safe and unsafe looks like using cards','Role-play realistic situations','Create a class safety rules chart together'],['Is this safe or not safe?','What should we do?','Why is this rule important?'],'Safety awareness, personal judgment, and self-protection skills',15,2)
    ],
    character: [
      act('pch1','Responsibility Stars','Develop personal responsibility awareness',['Personal responsibility chart for each child'],['Each child has a daily chart of responsibilities: backpack hung, chair pushed in, etc.','Children check off completed items throughout the day','Weekly celebration of responsible behavior','Discuss: "Why does being responsible matter?"'],['Did you complete your responsibilities today?','How does it feel to be responsible?'],'Self-responsibility, intrinsic motivation, and personal accountability',5,2),
      act('pch2','Class Respect Pledge','Build a classroom culture of mutual respect',['Respect pledge displayed prominently on classroom wall'],['Create the class respect pledge together as a group','Recite together each morning','Notice and name specific respectful behaviors throughout the day','Discuss: "What is respect? How do we show it?"'],['What does respect mean to you?','How do you show respect?','Was that respectful?'],'Mutual respect, community values, and a positive classroom culture',8,2),
      act('pch3','Compassion in Action','Practice compassion through real helping',['Varies by helping activity'],['Identify someone or something that needs help','Plan together how to help','Carry out the helping action','Reflect: "How did that feel? What difference did we make?"'],['How can we help?','How did it feel to help someone?','Why is compassion important?'],'Compassion, empathy, civic-mindedness, and community connection',15,2)
    ]
  },

  /* ─── SCHOOL AGE (5–12 years) ─── */
  school_age: {
    language: [
      act('sal1','Reading Workshop','Build fluency, comprehension, and love of reading',['Books at varied reading levels','Reading response journals'],['Independent reading time 15-20 minutes','Reading response journal entry after reading','Share favorite part or insight with a partner','Weekly reading challenge or goal setting'],['What happened in your book?','What was the main message?','Would you recommend it? Why?'],'Reading fluency, comprehension, stamina, and love of reading',20,3),
      act('sal2','Creative Writing Workshop','Develop written voice and expressive writing',['Writing journals','Writing prompt cards'],['Mini-lesson on one writing skill: voice, detail, dialogue, or structure','Write for 15 minutes independently','Share with writing partner for feedback','Revise one specific section using feedback'],['What is your story about?','How can you add more specific detail?','Read your most powerful sentence'],'Written expression, voice, revision skills, and communication',25,3),
      act('sal3','Structured Discussion','Develop critical thinking and respectful oral discourse',['Age-appropriate discussion topic card'],['Present an engaging question: "Should school lunches be free for everyone?"','Give 2 minutes of thinking time','Share opinions with supporting reasons','Practice respectful disagreement: "I see it differently because..."'],['What do you think? Why?','Does anyone see it differently?','What evidence supports your view?'],'Critical thinking, oral communication, civic discourse, and respectful debate',20,4),
      act('sal4','Vocabulary Detective','Build academic vocabulary through context clue strategies',['Text with rich vocabulary','Vocabulary journals'],['Read a rich text together','Identify 3-5 unfamiliar words in context','Use context clues to guess meanings','Confirm with dictionary; use each word in an original sentence'],['What do you think this word means?','What clues helped you figure it out?'],'Academic vocabulary, independent word-learning strategies, and reading depth',15,3)
    ],
    cognitive: [
      act('sac1','STEM Engineering Challenge','Develop engineering thinking and creative problem solving',['Building materials: straws, tape, index cards, cups','Written challenge card'],['Present challenge: "Build the tallest free-standing tower using only these materials"','Plan stage: 5 minutes to draw and discuss plan','Build stage: 15 minutes','Test and evaluate: does it meet the challenge?','Redesign based on what you learned'],['What was your plan?','What worked well?','What would you change next time?','Why did it fail?'],'Engineering thinking, creative problem-solving, resilience, and design process',30,4),
      act('sac2','Real-World Math','Apply mathematical thinking to authentic contexts',['Word problem cards','Manipulatives or scratch paper'],['Read word problem aloud together','Identify: "What do you know? What do you need to find?"','Choose a strategy and show your thinking','Solve, then explain your reasoning to a partner'],['What information do you know?','What are you trying to find?','Does your answer make sense?'],'Mathematical reasoning, real-world application, and mathematical communication',20,4),
      act('sac3','Scientific Investigation','Practice the complete scientific method',['Experiment materials vary','Science notebooks'],['Question: "What do we want to find out?"','Hypothesis: "What do we predict will happen?"','Experiment: "Let\'s test it!"','Observe and record data carefully','Conclude: "What did we actually learn?"'],['What is your hypothesis?','What did you observe?','Was your prediction correct? Why or why not?'],'Scientific thinking, inquiry, analytical reasoning, and intellectual honesty',30,4),
      act('sac4','Coding & Computational Thinking','Build logical and algorithmic thinking skills',['Unplugged coding cards or tablets with Scratch/Code.org'],['Explain: "Coding is giving precise instructions to a computer"','Unplugged activity: give step-by-step instructions to a "human robot"','Try a beginner coding platform: Scratch Jr, Code.org','Debug a simple error: what went wrong?'],['What instruction comes first?','What happened when you ran that code?','How do you find and fix the bug?'],'Computational thinking, logic, sequencing, and technology literacy',25,3)
    ],
    social: [
      act('sas1','Conflict Resolution Protocol','Master structured peer conflict resolution',['4-step conflict resolution poster'],['Teach 4-step protocol: (1) Calm down, (2) Each person shares their perspective, (3) Find common ground, (4) Make a plan','Practice with realistic role-play scenarios','Apply in real conflicts as they arise','Reflect on outcomes: what worked?'],['How do you feel?','What does the other person need?','What solution works for everyone involved?'],'Conflict resolution, empathy, communication, and relationship skills',20,4),
      act('sas2','Leadership Project','Develop leadership, planning, and community responsibility',['Project planning template','Materials vary by project'],['Small groups identify a real class or school improvement project','Assign roles: leader, recorder, presenter','Plan and execute the project together','Present to class with reflection'],['What is your leadership role?','How will you guide your team?','What challenges did you overcome?'],'Leadership, teamwork, civic engagement, planning, and public speaking',45,4),
      act('sas3','Peer Mentoring','Build empathy and leadership through mentoring younger children',['Paired mentor-mentee activity'],['Pair older children with younger peers','Older child reads to or guides younger child through an activity','Structured activity designed for both ages','Reflect: "What did you learn from each other?"'],['How did you help your buddy today?','What did you learn from someone younger than you?'],'Empathy, leadership, responsibility, patience, and community connection',20,3)
    ],
    physical: [
      act('sap1','Team Sports & Sportsmanship','Develop athletic skills, teamwork, and sportsmanship',['Sport-appropriate equipment'],['Teach basic rules of one team sport','Practice individual skills in small groups','Play a modified game with focus on sportsmanship','Debrief: "What teamwork moments stood out today?"'],['How did your team work together?','What sportsmanship did you see?'],'Teamwork, athletic skills, sportsmanship, cooperation, and physical health',30,3),
      act('sap2','Personal Fitness Circuit','Build fitness habits and health awareness',['Fitness station cards with written instructions'],['5-7 stations: jumping jacks, wall push-ups, balance, stretching, etc.','45 seconds at each station with rest between','Track and celebrate personal records','Discuss: "Why does regular exercise matter for our health and brain?"'],['How does exercise make you feel?','Can you beat your personal best from last week?'],'Physical fitness, goal-setting, health awareness, and lifelong active habits',25,3)
    ],
    creativity: [
      act('sacr1','Multimedia Storytelling','Create stories using multiple creative and digital modes',['Tablets or computers','Drawing materials','Audio recording option'],['Plan story arc: beginning, middle, end','Create visual art to illustrate the story','Record narration in child\'s own voice','Combine into a complete multimedia presentation'],['What is your story about?','How does your artwork tell the story?','How does your voice bring it to life?'],'Creativity, technology skills, narrative thinking, and multimedia communication',45,4),
      act('sacr2','Invention Convention','Design solutions to real problems using creative thinking',['Recyclable materials','Design journals','Tape, scissors, glue'],['Step 1: Identify a real problem you care about','Step 2: Brainstorm multiple solutions','Step 3: Build a prototype','Step 4: Test, evaluate, and improve','Step 5: Present your invention to the class'],['What problem are you solving?','How does your invention work?','What would you improve in the next version?'],'Creative thinking, engineering mindset, innovation, and presentation skills',45,5)
    ],
    life_skills: [
      act('sals1','Financial Literacy','Introduce responsible money management concepts',['Play money','Simple classroom "store" setup'],['Teach the 4 key concepts: earn, save, spend, give','Run a classroom "store" simulation','Practice making change and calculating costs','Discuss saving for goals vs. impulse spending'],['What is the difference between needs and wants?','How much change do you get?','What would you save up for?'],'Financial literacy, math application, decision-making, and future planning',25,3),
      act('sals2','Digital Citizenship','Practice responsible, safe, and kind technology use',['Tablets or computers'],['Discuss internet safety rules: what to share, what never to share','Identify cyberbullying: what it is, how to respond, who to tell','Practice kind and constructive online communication','Create a personal digital citizenship pledge'],['Is this information safe to share online?','What would you do if someone was unkind to you online?','How can we be a good digital citizen?'],'Digital citizenship, online safety, responsible technology use, and kindness online',20,3),
      act('sals3','Meal Prep & Nutrition','Build nutrition knowledge and practical cooking skills',['Simple, safe ingredients','Age-appropriate kitchen tools'],['Plan a healthy balanced snack together','Prepare it safely with appropriate tools','Identify the nutrients and food groups in each ingredient','Share and enjoy the meal together as a class'],['What makes this snack healthy and balanced?','What would you add or change next time?'],'Nutrition literacy, practical cooking skills, health habits, and independence',30,3)
    ],
    health: [
      act('sah1','Mental Health Matters','Build emotional health literacy and coping skills',['Discussion prompts','Personal journals'],['Discuss mental health as an essential part of overall health','Normalize hard feelings: everyone has difficult days','Introduce and practice 5 healthy coping strategies','Journaling: "How I am feeling and what helps me"'],['What does mental health mean to you?','What helps you when you feel stressed or overwhelmed?','Who is someone safe you can talk to?'],'Mental health awareness, coping skills, help-seeking, and emotional resilience',20,3),
      act('sah2','Nutrition Label Investigation','Develop nutritional literacy and informed food choices',['Food labels from 4-6 different packaged products'],['Learn to read a nutrition label: what each number means','Find: calories, added sugar, protein, vitamins, serving size','Compare two similar foods side by side','Make an informed choice and explain your reasoning'],['Which food has less added sugar?','What is a realistic serving size?','Would you choose this food? Why or why not?'],'Nutritional literacy, analytical thinking, informed food choices, and health advocacy',20,3)
    ],
    character: [
      act('sach1','Community Service Project','Develop civic responsibility and meaningful compassion',['Project materials vary by service project'],['Identify a real community need together','Plan a concrete, achievable service project','Execute the project as a team','Reflect: "What impact did we make? What did we learn about ourselves?"'],['Why does this matter to you?','How did it feel to contribute to your community?','What did you learn about yourself?'],'Civic responsibility, compassion, community connection, and leadership in action',60,4),
      act('sach2','Integrity Dilemmas','Practice ethical reasoning and principled decision-making',['Age-appropriate scenario cards'],['Present an ethical dilemma: "Your friend asks you to lie for them. What do you do?"','Students discuss in small groups first','Share different perspectives respectfully','Conclude together: "What does acting with integrity look like here?"'],['What would the right thing be?','Why does integrity matter even when it is hard?','What would YOU actually do?'],'Moral reasoning, integrity, ethical decision-making, and principled action',20,4),
      act('sach3','Daily Gratitude Journal','Build a daily gratitude practice and growth mindset',['Personal gratitude journals'],['Write 3 specific things grateful for each day','Vary the prompts: a person, an experience, something in nature','Share one entry with a partner each week','Discuss: "How does practicing gratitude change how we feel?"'],['What are you genuinely grateful for today?','How does thinking about gratitude affect your mood?'],'Gratitude, positive thinking, growth mindset, and emotional well-being',10,2)
    ]
  }
};

/* ══════════════════════════════════════════════
   SECTION 3 — DEVELOPMENTAL MILESTONES
   ══════════════════════════════════════════════ */

const MILESTONES_DB = {
  infants: {
    language:    [{id:'iml1',skill:'Responds to own name'},{id:'iml2',skill:'Babbles and coos'},{id:'iml3',skill:'Imitates sounds'},{id:'iml4',skill:'Responds to familiar voices'}],
    cognitive:   [{id:'imc1',skill:'Object permanence'},{id:'imc2',skill:'Cause and effect awareness'},{id:'imc3',skill:'Explores objects with senses'},{id:'imc4',skill:'Sustained attention to faces'}],
    social:      [{id:'ims1',skill:'Social smile'},{id:'ims2',skill:'Secure caregiver attachment'},{id:'ims3',skill:'Stranger awareness'},{id:'ims4',skill:'Emotional signaling'}],
    physical:    [{id:'imp1',skill:'Head control'},{id:'imp2',skill:'Reach and grasp'},{id:'imp3',skill:'Rolling over'},{id:'imp4',skill:'Sits with support'}],
    creativity:  [{id:'imcr1',skill:'Responds to music'},{id:'imcr2',skill:'Vocalizes with delight'}],
    life_skills: [{id:'imls1',skill:'Self-feeding attempts'},{id:'imls2',skill:'Recognizes daily routines'}],
    health:      [{id:'imh1',skill:'Sleep self-soothing begins'},{id:'imh2',skill:'Clear hunger and fullness cues'}],
    character:   [{id:'imch1',skill:'Reciprocal back-and-forth interaction'},{id:'imch2',skill:'Shows trust in caregivers'}]
  },
  toddlers: {
    language:    [{id:'tml1',skill:'Uses 2-word phrases'},{id:'tml2',skill:'50+ word vocabulary'},{id:'tml3',skill:'Follows 2-step directions'},{id:'tml4',skill:'Names familiar people and objects'}],
    cognitive:   [{id:'tmc1',skill:'Sorts by shape or color'},{id:'tmc2',skill:'Completes simple 4-piece puzzle'},{id:'tmc3',skill:'Engages in symbolic play'},{id:'tmc4',skill:'Matches identical pictures'}],
    social:      [{id:'tms1',skill:'Parallel play with peers'},{id:'tms2',skill:'Shows empathy for others'},{id:'tms3',skill:'Turn-taking with support'},{id:'tms4',skill:'Expresses needs verbally'}],
    physical:    [{id:'tmp1',skill:'Runs without falling'},{id:'tmp2',skill:'Climbs stairs holding railing'},{id:'tmp3',skill:'Scribbles and makes marks'},{id:'tmp4',skill:'Stacks 6+ blocks'}],
    creativity:  [{id:'tmcr1',skill:'Engages in pretend play'},{id:'tmcr2',skill:'Sings parts of familiar songs'},{id:'tmcr3',skill:'Uses materials creatively'}],
    life_skills: [{id:'tmls1',skill:'Self-feeds with spoon'},{id:'tmls2',skill:'Helps put toys away'},{id:'tmls3',skill:'Attempts to put on clothing'}],
    health:      [{id:'tmh1',skill:'Washes hands with support'},{id:'tmh2',skill:'Names 5+ body parts'}],
    character:   [{id:'tmch1',skill:'Uses please and thank you with reminders'},{id:'tmch2',skill:'Notices when others are sad or hurt'}]
  },
  preschool: {
    language:    [{id:'pml1',skill:'Speaks in 5-6 word sentences'},{id:'pml2',skill:'Identifies beginning sounds'},{id:'pml3',skill:'Retells a simple 3-event story'},{id:'pml4',skill:'Asks why and how questions'}],
    cognitive:   [{id:'pmc1',skill:'Counts objects 1-to-1 up to 10'},{id:'pmc2',skill:'Recognizes most letters'},{id:'pmc3',skill:'Creates and extends patterns'},{id:'pmc4',skill:'Classifies by multiple attributes'}],
    social:      [{id:'pms1',skill:'Cooperative play with 2-3 peers'},{id:'pms2',skill:'Uses words to manage emotions'},{id:'pms3',skill:'Shows genuine empathy'},{id:'pms4',skill:'Follows classroom rules independently'}],
    physical:    [{id:'pmp1',skill:'Uses safety scissors on a line'},{id:'pmp2',skill:'Writes own first name'},{id:'pmp3',skill:'Catches a large ball'},{id:'pmp4',skill:'Balances on one foot 5 seconds'}],
    creativity:  [{id:'pmcr1',skill:'Draws recognizable human figure'},{id:'pmcr2',skill:'Sustained dramatic play with peers'},{id:'pmcr3',skill:'Creates original artwork with intent'}],
    life_skills: [{id:'pmls1',skill:'Completes classroom jobs independently'},{id:'pmls2',skill:'Manages personal belongings'},{id:'pmls3',skill:'Problem-solves with peers verbally'}],
    health:      [{id:'pmh1',skill:'Washes hands independently'},{id:'pmh2',skill:'Identifies healthy vs. unhealthy foods'},{id:'pmh3',skill:'Demonstrates basic safety awareness'}],
    character:   [{id:'pmch1',skill:'Takes responsibility for belongings'},{id:'pmch2',skill:'Understands and applies fairness'},{id:'pmch3',skill:'Expresses genuine gratitude'}]
  },
  school_age: {
    language:    [{id:'saml1',skill:'Reads grade-level text with comprehension'},{id:'saml2',skill:'Writes organized paragraphs'},{id:'saml3',skill:'Participates meaningfully in discussions'},{id:'saml4',skill:'Uses academic vocabulary appropriately'}],
    cognitive:   [{id:'samc1',skill:'Solves multi-step problems'},{id:'samc2',skill:'Applies STEM and engineering thinking'},{id:'samc3',skill:'Evaluates information critically'},{id:'samc4',skill:'Understands basic computational thinking'}],
    social:      [{id:'sams1',skill:'Resolves conflicts without adult help'},{id:'sams2',skill:'Takes positive leadership roles'},{id:'sams3',skill:'Collaborates effectively in groups'},{id:'sams4',skill:'Uses coping strategies under stress'}],
    physical:    [{id:'samp1',skill:'Participates positively in team sports'},{id:'samp2',skill:'Understands components of physical fitness'},{id:'samp3',skill:'Uses tools with precision and control'}],
    creativity:  [{id:'samcr1',skill:'Creates multimedia projects'},{id:'samcr2',skill:'Applies design thinking to real problems'}],
    life_skills: [{id:'samls1',skill:'Understands earn, save, spend, give'},{id:'samls2',skill:'Practices responsible and safe technology use'},{id:'samls3',skill:'Manages time to complete assignments'}],
    health:      [{id:'samh1',skill:'Recognizes emotions and knows when to seek help'},{id:'samh2',skill:'Makes informed food choices'}],
    character:   [{id:'samch1',skill:'Makes ethical choices when not observed'},{id:'samch2',skill:'Participates in community service'},{id:'samch3',skill:'Demonstrates growth mindset'}]
  }
};

/* ══════════════════════════════════════════════
   SECTION 4 — DAILY SCHEDULE TEMPLATES
   ══════════════════════════════════════════════ */

const DAILY_SCHEDULE = {
  infants: [
    {time:'7:00–8:00',  name:'Arrival & Settling',         type:'routine', cat:null,        script:'Greet each baby and caregiver warmly by name. Review parent notes. Help baby transition with familiar comfort items.'},
    {time:'8:00–8:30',  name:'Morning Feeding',            type:'care',    cat:'health',    script:'Feed each baby per their individual schedule. Talk and sing softly during feeding. Burp and comfort after.'},
    {time:'8:30–9:15',  name:'Tummy Time & Sensory Exploration',type:'learning',cat:'physical',script:'Place babies on play mat. Facilitate tummy time. Offer sensory toys. Narrate what babies are doing and discovering.'},
    {time:'9:15–10:15', name:'Morning Nap',                type:'care',    cat:null,        script:'Follow individual sleep schedules. Maintain a calm, safe sleep environment with dim light and soft sound.'},
    {time:'10:15–10:45',name:'Language & Music Time',      type:'learning',cat:'language',  script:'Sing welcome songs. Read board books aloud. Name objects and faces. Use clear gestures and animated expressions.'},
    {time:'10:45–11:30',name:'Active Exploration Play',    type:'learning',cat:'cognitive', script:'Set out age-appropriate exploration materials. Get on the floor with babies. Follow their lead and interests.'},
    {time:'11:30–12:00',name:'Feeding & Diapering',        type:'care',    cat:'health',    script:'Midday feeding and diaper changes. Continue talking and connecting meaningfully throughout routine care.'},
    {time:'12:00–2:00', name:'Afternoon Nap',              type:'care',    cat:null,        script:'Individual nap schedules respected. Create a quiet, safe, calm sleep environment.'},
    {time:'2:00–2:30',  name:'Outdoor Time',               type:'learning',cat:'health',    script:'Take babies outside in strollers or carriers. Describe what you see. Let babies feel gentle breeze and sunlight.'},
    {time:'2:30–4:00',  name:'Afternoon Social Play',      type:'learning',cat:'social',    script:'Floor play together. Peek-a-boo. Cause-effect toys. Sing songs. Additional tummy time for those who need it.'},
    {time:'4:00–5:30',  name:'Feeding & Departure',        type:'care',    cat:null,        script:'Afternoon feeding. Share daily report with parents warmly. Individual, warm goodbye rituals with each baby.'}
  ],
  toddlers: [
    {time:'7:00–8:30',  name:'Arrival & Free Exploration', type:'routine', cat:null,        script:'Welcome each child by name with warmth. Allow free exploration of learning centers. Observe peer interactions.'},
    {time:'8:30–9:00',  name:'Morning Circle',             type:'learning',cat:'language',  script:'Welcome song. Attendance. Calendar and weather. Word of the Day. Feelings check-in. Preview the day.'},
    {time:'9:00–9:50',  name:'Learning Centers',           type:'learning',cat:null,        script:'Children rotate: Art, Sensory, Books, Building, Dramatic Play. Teacher facilitates and enriches at each center.'},
    {time:'9:50–10:10', name:'Snack Time',                 type:'care',    cat:'health',    script:'Hand washing first. Name foods and nutrition. Practice courtesy: "May I have more please?" Model healthy eating.'},
    {time:'10:10–11:00',name:'Outdoor Play',               type:'learning',cat:'physical',  script:'Gross motor play: run, climb, balance. Teacher narrates and extends play. Notice and name nature.'},
    {time:'11:00–11:30',name:'Curriculum Activity Block',  type:'learning',cat:null,        script:'Today\'s planned curriculum activity. Small groups. Teacher-guided learning. Observe and document development.'},
    {time:'11:30–11:45',name:'Story Time',                 type:'learning',cat:'language',  script:'Read aloud with expression. Predict, discuss, and connect to children\'s real lives. Build vocabulary.'},
    {time:'11:45–12:15',name:'Lunch',                      type:'care',    cat:'health',    script:'Independence practice. Name foods. Social conversation. Clean up together as a community.'},
    {time:'12:15–2:30', name:'Rest & Nap',                 type:'care',    cat:null,        script:'Calm music. Individual rest needs respected. Quiet activities for non-nappers.'},
    {time:'2:30–3:00',  name:'Afternoon Snack & Sharing',  type:'routine', cat:'social',    script:'Snack. Each child shares one thing from their day. Practice gratitude together.'},
    {time:'3:00–4:30',  name:'Afternoon Activities',       type:'learning',cat:null,        script:'Art project, music, movement, or outdoor play. Free choice with teacher facilitation and enrichment.'},
    {time:'4:30–5:30',  name:'Departure Routine',          type:'routine', cat:null,        script:'Pack up belongings. Share daily highlight with families. Individual warm goodbyes.'}
  ],
  preschool: [
    {time:'7:00–8:30',  name:'Arrival & Morning Work',     type:'routine', cat:null,        script:'Welcome! Hang up backpack (responsibility practice). Sign in (writing practice). Choose morning invitation activity.'},
    {time:'8:30–9:00',  name:'Morning Circle',             type:'learning',cat:'language',  script:'Song. Attendance. Calendar, weather, and patterns. Sharing time. Present learning goals. Character value of the week.'},
    {time:'9:00–9:50',  name:'Learning Centers',           type:'learning',cat:null,        script:'5-6 centers: Reading, Writing, Math, Science, Art, Dramatic Play. Children self-select. Teacher assesses and enriches.'},
    {time:'9:50–10:00', name:'Clean-Up & Transition',      type:'routine', cat:'life_skills',script:'Clean-up song. Each center cleaned and organized by children. Responsible choices celebrated.'},
    {time:'10:00–10:20',name:'Snack',                      type:'care',    cat:'health',    script:'Healthy snack time. Nutrition conversation. Practice social conversation skills. Independence with routine.'},
    {time:'10:20–11:10',name:'Outdoor Play',               type:'learning',cat:'physical',  script:'Gross motor activities. Teacher-facilitated games. Obstacle course. Nature exploration and investigation.'},
    {time:'11:10–11:45',name:'Curriculum Focus Block',     type:'learning',cat:null,        script:'Small group instruction: literacy, math, science, or social studies. Embedded assessment of skills.'},
    {time:'11:45–12:00',name:'Story & Vocabulary',         type:'learning',cat:'language',  script:'Read-aloud connected to weekly theme. Deep discussion questions. Vocabulary building and comprehension.'},
    {time:'12:00–12:30',name:'Lunch',                      type:'care',    cat:'health',    script:'Independent lunch. Healthy eating conversations. Social connection. Clean-up responsibilities.'},
    {time:'12:30–2:30', name:'Rest Time',                  type:'care',    cat:null,        script:'Nap or rest. Quiet activities for non-nappers. Individual needs respected.'},
    {time:'2:30–3:15',  name:'Afternoon Creative Activity',type:'learning',cat:'creativity',script:'Art, music, movement, STEM exploration, or free creative choice with teacher support.'},
    {time:'3:15–4:00',  name:'Reflection & Gratitude Circle',type:'routine',cat:'character',script:'Snack. Gratitude sharing. Reflect on day\'s learning. Preview tomorrow. Pack up.'},
    {time:'4:00–5:30',  name:'Extended Care',              type:'routine', cat:null,        script:'Free play. Homework support. Parent share-out. Individual warm goodbyes.'}
  ],
  school_age: [
    {time:'7:00–8:30',  name:'Arrival & Homework Help',    type:'routine', cat:null,        script:'Welcome. Homework assistance available. Morning reading or independent activity. Social connection time.'},
    {time:'8:30–9:00',  name:'Morning Meeting',            type:'learning',cat:'social',    script:'Greeting activity. Sharing circle. Group challenge activity. Morning message with academic content embedded.'},
    {time:'9:00–9:50',  name:'Academic Block',             type:'learning',cat:'cognitive', script:'Reading, writing, or mathematics focus. Differentiated instruction. Small groups. Project-based work.'},
    {time:'9:50–10:40', name:'STEM & Science Time',        type:'learning',cat:'cognitive', script:'STEM challenge, coding, science investigation, or math exploration. Inquiry-based, student-driven learning.'},
    {time:'10:40–11:00',name:'Snack & Movement Break',     type:'care',    cat:'health',    script:'Healthy snack. Active movement break: yoga, dancing, or stretching. Mental health check-in.'},
    {time:'11:00–11:45',name:'Creative Arts & Enrichment', type:'learning',cat:'creativity',script:'Art, music, drama, creative writing, or project-based learning. Creativity, expression, and innovation.'},
    {time:'11:45–12:15',name:'Lunch',                      type:'care',    cat:'health',    script:'Social lunch with peers. Nutrition conversations. Leadership: older children mentor younger ones if applicable.'},
    {time:'12:15–12:45',name:'Physical Education',         type:'learning',cat:'physical',  script:'Team sports, fitness circuit, yoga, or outdoor exploration. Focus on sportsmanship and personal growth.'},
    {time:'12:45–1:30', name:'Character & Life Skills',    type:'learning',cat:'character', script:'Character education, financial literacy, digital citizenship, community service, or life skills practice.'},
    {time:'1:30–2:30',  name:'Project-Based Learning',     type:'learning',cat:'cognitive', script:'Small group projects. Research, planning, creation, and presentation. Real-world application and collaboration.'},
    {time:'2:30–3:30',  name:'Reflection & Goal Setting',  type:'routine', cat:'character', script:'Reflection circle. Share project highlights. Gratitude practice. Set a personal goal for tomorrow.'},
    {time:'3:30–5:30',  name:'Homework & Extended Care',   type:'routine', cat:null,        script:'Dedicated homework time. Free choice activities. Parent pick-up with daily highlight shared.'}
  ]
};

/* ══════════════════════════════════════════════
   SECTION 5 — DB HELPERS
   ══════════════════════════════════════════════ */

function initCurriculumDB() {
  if (!DB) return;
  if (!DB.curriculum) DB.curriculum = { plans: [], milestones: [], teacherNotes: [], weekThemes: [] };
  DB.curriculum.plans       = DB.curriculum.plans       || [];
  DB.curriculum.milestones  = DB.curriculum.milestones  || [];
  DB.curriculum.teacherNotes= DB.curriculum.teacherNotes|| [];
  DB.curriculum.weekThemes  = DB.curriculum.weekThemes  || [];
  delete DB.curriculum.lessonPlans; // cleanup old key if present
}

function getAgeKey(classId) {
  const cls = DB.classes.find(c => c.id === classId);
  if (!cls) return 'preschool';
  return CLS_TO_AGE[cls.name] || 'preschool';
}

function getChildAgeKey(childId) {
  const child = DB.children.find(c => c.id === childId);
  if (!child) return 'preschool';
  return getAgeKey(child.classId);
}

function getWeekTheme(classId) {
  const weekStart = getWeekStart();
  const found = DB.curriculum.weekThemes.find(w => w.classId === classId && w.weekStart === weekStart);
  return found ? found.theme : CURR_THEMES[0];
}

function getWeekStart() {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() + 1);
  return d.toISOString().split('T')[0];
}

function getTodayDate() { return typeof today === 'function' ? today() : new Date().toISOString().split('T')[0]; }

function getPlan(classId, date) {
  return DB.curriculum.plans.find(p => p.classId === classId && p.date === date) || null;
}

function getOrCreatePlan(classId, date) {
  let plan = getPlan(classId, date);
  if (!plan) {
    const ageKey = getAgeKey(classId);
    const theme  = getWeekTheme(classId);
    plan = generatePlan(classId, ageKey, theme, date);
    DB.curriculum.plans.push(plan);
    saveDB();
  }
  return plan;
}

function generatePlan(classId, ageKey, theme, date) {
  const acts = ACTIVITY_LIBRARY[ageKey] || ACTIVITY_LIBRARY.preschool;
  const sched = DAILY_SCHEDULE[ageKey] || DAILY_SCHEDULE.preschool;
  const selectedActivities = [];
  CURR_CATS.forEach(cat => {
    const pool = acts[cat.id] || [];
    if (pool.length > 0) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      selectedActivities.push({ catId: cat.id, activityId: pick.id, status: 'pending', notes: '' });
    }
  });
  return {
    id: typeof uid === 'function' ? uid() : 'plan_' + Date.now(),
    classId, date, ageKey, theme,
    activities: selectedActivities,
    schedule: sched.map((s, i) => ({ ...s, status: 'pending', slotIndex: i })),
    generatedAt: new Date().toISOString()
  };
}

function getMilestones(childId) {
  return DB.curriculum.milestones.filter(m => m.childId === childId);
}

function getChildProgress(childId) {
  const ageKey = getChildAgeKey(childId);
  const milestoneData = MILESTONES_DB[ageKey] || {};
  const childMilestones = getMilestones(childId);
  const progress = {};
  CURR_CATS.forEach(cat => {
    const total = (milestoneData[cat.id] || []).length;
    if (!total) { progress[cat.id] = 0; return; }
    let points = 0;
    (milestoneData[cat.id] || []).forEach(m => {
      const tracked = childMilestones.find(cm => cm.skillId === m.id);
      if (tracked) points += ML_LEVELS.indexOf(tracked.level) + 1;
    });
    const maxPoints = total * ML_LEVELS.length;
    progress[cat.id] = Math.round((points / maxPoints) * 100);
  });
  return progress;
}

function getTeacherNote(childId, date) {
  return DB.curriculum.teacherNotes.find(n => n.childId === childId && n.date === date) || null;
}

/* ══════════════════════════════════════════════
   SECTION 6 — MAIN CURRICULUM PORTAL VIEW
   ══════════════════════════════════════════════ */

function curriculumPortalView() {
  if (!CU) return '';
  if (CU.role === 'admin')   return adminCurriculumView();
  if (CU.role === 'teacher') return teacherCurriculumView();
  if (CU.role === 'parent')  return parentLearningView();
  return '';
}

/* ══════════════════════════════════════════════
   SECTION 7 — TEACHER CURRICULUM DASHBOARD
   ══════════════════════════════════════════════ */

function teacherCurriculumView() {
  const kids = DB.children.filter(c => c.classId === CU.classId);
  const ageKey = getAgeKey(CU.classId);
  const ageInfo = CURR_AGE_INFO[ageKey] || CURR_AGE_INFO.preschool;
  const dateStr = CURR_DATE_VIEW || getTodayDate();
  const theme = getWeekTheme(CU.classId);

  const tabs = [
    ['today',    '&#128197; '+t("Today's Plan","Plan de Hoy")],
    ['milestones','&#127919; '+t('Milestones','Hitos')],
    ['success',  '&#11088; '+t('Success Metrics','Metricas de Exito')],
    ['library',  '&#128218; '+t('Activity Library','Biblioteca de Actividades')],
    ['pathways', '&#128197; '+t('Monthly Pathways','Rutas Mensuales')],
    ['generator','&#9889; '+t('AI Generator','Generador IA')]
  ];
  let h = '<div class="subtabs">' + tabs.map(([k, l]) =>
    `<button class="${CURR_SUB===k?'active':''}" onclick="CURR_SUB='${k}';renderPortal()">${l}</button>`
  ).join('') + '</div>';

  h += `<div style="background:${ageInfo.color};border-radius:14px;padding:10px 16px;margin-bottom:14px;display:flex;align-items:center;gap:10px">
    <span style="font-size:1.5rem">${ageInfo.icon}</span>
    <div><b style="color:var(--night)">${esc(ageInfo.label)}</b> &nbsp;&#183;&nbsp; <span class="soft">${esc(ageInfo.range)}</span></div>
    <div style="margin-left:auto;font-weight:700;color:var(--night)">&#127808; ${t('Theme:','Tema:')} ${esc(theme)}</div>
  </div>`;

  /* ── TODAY'S LESSON PLAN ── */
  if (CURR_SUB === 'today') {
    const plan = getOrCreatePlan(CU.classId, dateStr);
    h += `<div class="card" style="margin-bottom:14px">
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <b>${esc(fmtDateC(dateStr))}</b>
        <input type="date" value="${dateStr}" style="border:2px solid #EAE2DA;border-radius:10px;padding:6px 10px;font-size:.88rem"
          onchange="CURR_DATE_VIEW=this.value;renderPortal()">
        <span class="tag" style="background:var(--gold);color:#fff">&#127808; ${esc(theme)}</span>
        <button class="mini-btn ghost" onclick="regeneratePlan('${CU.classId}','${dateStr}')">&#8635; ${t('Regenerate Plan','Regenerar Plan')}</button>
      </div>
    </div>`;

    /* Daily Schedule */
    h += `<p class="lead" style="margin-bottom:8px">&#128198; ${t('Daily Schedule','Horario Diario')}</p>`;
    h += `<div style="overflow-x:auto;margin-bottom:18px">`;
    plan.schedule.forEach((slot, i) => {
      if (slot.type === 'care') return;
      const catInfo = CURR_CATS.find(c => c.id === slot.cat);
      h += `<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:10px;margin-bottom:6px;background:#FAFAF8;border:1.5px solid #EAE2DA">
        <span style="font-size:.78rem;color:var(--muted);min-width:90px">${esc(slot.time)}</span>
        ${catInfo ? `<span style="background:${catInfo.color};color:#fff;border-radius:20px;padding:2px 8px;font-size:.72rem;font-weight:700">${catInfo.icon} ${esc(catInfo.label)}</span>` : ''}
        <b style="font-size:.9rem;flex:1">${esc(slot.name)}</b>
        <span class="tag ${slot.type === 'learning' ? '' : 'navy'}" style="font-size:.72rem">${slot.type}</span>
      </div>`;
    });
    h += `</div>`;

    /* Activity Cards by Category */
    h += `<p class="lead" style="margin-bottom:8px">&#127919; ${t("Today's Learning Activities","Actividades de Aprendizaje de Hoy")}</p>`;
    plan.activities.forEach((entry, idx) => {
      const catInfo = CURR_CATS.find(c => c.id === entry.catId) || {};
      const actPool = (ACTIVITY_LIBRARY[ageKey] || {})[entry.catId] || [];
      const act_obj = actPool.find(a => a.id === entry.activityId) || actPool[0];
      if (!act_obj) return;
      const statusOpt = STATUS_OPTS.find(s => s.val === entry.status) || STATUS_OPTS[0];
      h += `<div class="card" style="border-left:5px solid ${catInfo.color || 'var(--teal)'};margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px">
          <span style="font-size:1.1rem">${catInfo.icon || ''}</span>
          <b style="color:var(--night)">${esc(catInfo.label || '')}</b>
          <span class="tag">&#128337; ${act_obj.dur} min</span>
          <div style="margin-left:auto;display:flex;gap:6px">
            ${STATUS_OPTS.map(s => `<button class="mini-btn ${s.cls||'ghost'}" style="${entry.status===s.val?'outline:2px solid var(--night)':''}"
              onclick="setCurrActivityStatus('${plan.id}',${idx},'${s.val}')">${s.icon} ${t(s.label,s.es)}</button>`).join('')}
          </div>
        </div>
        <h3 style="margin:0 0 4px;font-size:1rem">${esc(act_obj.title)}</h3>
        <p class="soft" style="font-size:.85rem;margin:0 0 8px">&#127919; ${esc(act_obj.obj)}</p>
        <details style="margin-bottom:8px">
          <summary style="cursor:pointer;font-size:.85rem;font-weight:700;color:var(--teal)">${t('View Full Instructions','Ver Instrucciones Completas')}</summary>
          <div style="padding-top:8px">
            <p style="font-size:.83rem;margin-bottom:6px"><b>&#128203; ${t('Materials:','Materiales:')}</b> ${esc((act_obj.mats||[]).join(', '))}</p>
            <div style="font-size:.83rem;margin-bottom:6px"><b>&#128295; ${t('Steps:','Pasos:')}</b>
              <ol style="margin:4px 0 0 18px;padding:0">${(act_obj.steps||[]).map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
            </div>
            ${act_obj.qs && act_obj.qs.length ? `<p style="font-size:.83rem;margin-bottom:6px"><b>&#10067; ${t('Ask Children:','Preguntas para los Ninos:')}</b> ${esc(act_obj.qs.join(' | '))}</p>` : ''}
            <p style="font-size:.83rem;margin-bottom:6px"><b>&#127807; ${t('Benefits:','Beneficios:')}</b> ${esc(act_obj.benefits||'')}</p>
          </div>
        </details>
        <div class="field" style="margin:0"><label style="font-size:.78rem">${t('Teacher Notes for this Activity','Notas del Maestro para esta Actividad')}</label>
          <input style="font-size:.83rem" placeholder="${t('What happened? What did you observe?','Que ocurrio? Que observo?')}"
            value="${esc(entry.notes||'')}"
            onchange="setCurrActivityNote('${plan.id}',${idx},this.value)">
        </div>
      </div>`;
    });

    /* Milestone Quick-Check */
    if (kids.length) {
      h += `<p class="lead" style="margin-bottom:8px">&#127919; ${t('Quick Milestone Check','Verificacion Rapida de Hitos')}</p>`;
      const selChild = CURR_CHILD_SEL && kids.some(k=>k.id===CURR_CHILD_SEL) ? CURR_CHILD_SEL : kids[0].id;
      CURR_CHILD_SEL = selChild;
      if (kids.length > 1) {
        h += `<div class="subtabs" style="padding-top:0">${kids.map(k=>
          `<button class="${k.id===selChild?'active':''}" onclick="CURR_CHILD_SEL='${k.id}';renderPortal()">${esc(k.name)}</button>`
        ).join('')}</div>`;
      }
      h += quickMilestoneWidget(selChild, ageKey);
      h += teacherNoteWidget(selChild, dateStr);
    }
  }

  /* ── MILESTONES TRACKER ── */
  if (CURR_SUB === 'milestones') {
    h += `<p class="soft" style="margin-bottom:10px">${t("Track each child's developmental progress across all learning domains.","Siga el progreso de desarrollo de cada nino en todos los dominios.")}</p>`;
    if (!kids.length) { h += `<div class="empty">${t('No children in your classroom yet.','Aun no hay ninos en su salon.')}</div>`; return h; }
    const selChild = CURR_CHILD_SEL && kids.some(k=>k.id===CURR_CHILD_SEL) ? CURR_CHILD_SEL : kids[0].id;
    CURR_CHILD_SEL = selChild;
    h += `<div class="subtabs" style="padding-top:0">${kids.map(k=>
      `<button class="${k.id===selChild?'active':''}" onclick="CURR_CHILD_SEL='${k.id}';renderPortal()">${esc(k.name)}</button>`
    ).join('')}</div>`;
    h += fullMilestoneTracker(selChild, ageKey, true);
  }

  /* ── ACTIVITY LIBRARY ── */
  if (CURR_SUB === 'library') {
    h += activityLibraryView(ageKey);
  }

  /* ── AI CURRICULUM GENERATOR ── */
  if (CURR_SUB === 'generator') {
    h += aiGeneratorView(ageKey);
  }

  /* ── SUCCESS METRICS ── */
  if (CURR_SUB === 'success') {
    h += `<p class="soft" style="margin-bottom:10px">${t("Track each child's growth in creativity, leadership, resilience, and other non-academic success areas.","Siga el crecimiento en creatividad, liderazgo, resiliencia y otras areas no academicas.")}</p>`;
    if (!kids.length) { h += `<div class="empty">${t('No children in your classroom yet.','Aun no hay ninos en su salon.')}</div>`; return h; }
    const selChild2 = CURR_CHILD_SEL && kids.some(k => k.id === CURR_CHILD_SEL) ? CURR_CHILD_SEL : kids[0].id;
    CURR_CHILD_SEL = selChild2;
    if (kids.length > 1) {
      h += `<div class="subtabs" style="padding-top:0">${kids.map(k =>
        `<button class="${k.id===selChild2?'active':''}" onclick="CURR_CHILD_SEL='${k.id}';renderPortal()">${esc(k.name)}</button>`
      ).join('')}</div>`;
    }
    if (typeof successMetricsView === 'function') h += successMetricsView(selChild2, true);
  }

  /* ── MONTHLY PATHWAYS ── */
  if (CURR_SUB === 'pathways') {
    if (typeof monthlyPathwayView === 'function') h += monthlyPathwayView();
  }

  return h;
}

/* ══════════════════════════════════════════════
   SECTION 8 — PARENT LEARNING VIEW
   ══════════════════════════════════════════════ */

function parentLearningView() {
  const kids = DB.children.filter(c => (c.parentIds||[]).includes(CU.id));
  if (!kids.length) return `<div class="empty">${t('Your children have not been linked to your account yet.','Sus hijos aun no han sido vinculados a su cuenta.')}<br>${t('Contact Mini Star:','Contacte a Mini Star:')} <a href="tel:+12062554000" style="color:var(--gold)">(206) 255-4000</a></div>`;

  const tabs = [
    ['today',     '&#128197; '+t("Today's Learning","Aprendizaje de Hoy")],
    ['progress',  '&#128202; '+t('Progress','Progreso')],
    ['milestones','&#127919; '+t('Milestones','Hitos')],
    ['success',   '&#11088; '+t('Success Profile','Perfil de Exito')],
    ['report',    '&#128203; '+t('Full Report','Reporte Completo')]
  ];
  let h = '<div class="subtabs">' + tabs.map(([k, l]) =>
    `<button class="${CURR_SUB===k?'active':''}" onclick="CURR_SUB='${k}';renderPortal()">${l}</button>`
  ).join('') + '</div>';

  const selChild = CURR_CHILD_SEL && kids.some(k=>k.id===CURR_CHILD_SEL) ? CURR_CHILD_SEL : kids[0].id;
  CURR_CHILD_SEL = selChild;
  if (kids.length > 1) {
    h += `<div class="subtabs" style="padding-top:0">${kids.map(k=>
      `<button class="${k.id===selChild?'active':''}" onclick="CURR_CHILD_SEL='${k.id}';renderPortal()">${esc(k.name)}</button>`
    ).join('')}</div>`;
  }

  const child = DB.children.find(c => c.id === selChild);
  const ageKey = getChildAgeKey(selChild);
  const dateStr = getTodayDate();
  const plan = getPlan(child.classId, dateStr);

  /* ── TODAY'S LEARNING ── */
  if (CURR_SUB === 'today') {
    const theme = getWeekTheme(child.classId);
    h += `<div class="card t-gold" style="margin-bottom:14px">
      <h3 style="margin:0 0 4px">&#127775; ${t("Today my child learned","Mi hijo aprendio hoy")}</h3>
      <p class="soft" style="font-size:.85rem;margin:0">${esc(fmtDateC(dateStr))} &nbsp;&#183;&nbsp; &#127808; ${t('Theme:','Tema:')} <b>${esc(theme)}</b></p>
    </div>`;

    if (plan) {
      const completedActs = plan.activities.filter(a => a.status === 'completed' || a.status === 'partial');
      if (completedActs.length) {
        completedActs.forEach(entry => {
          const catInfo = CURR_CATS.find(c => c.id === entry.catId) || {};
          const actPool = (ACTIVITY_LIBRARY[ageKey] || {})[entry.catId] || [];
          const act_obj = actPool.find(a => a.id === entry.activityId);
          if (!act_obj) return;
          h += `<div class="card" style="border-left:5px solid ${catInfo.color||'var(--teal)'};margin-bottom:10px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span>${catInfo.icon||''}</span>
              <b style="font-size:.9rem">${esc(catInfo.label||'')}</b>
              <span class="tag ${entry.status==='completed'?'paid':'unpaid'}">${entry.status==='completed'?'&#9989; '+t('Completed','Completado'):'&#9888; '+t('Partial','Parcial')}</span>
            </div>
            <h4 style="margin:0 0 4px;color:var(--night)">${esc(act_obj.title)}</h4>
            <p style="font-size:.83rem;margin:0 0 4px;color:var(--ink)">&#127919; ${esc(act_obj.obj)}</p>
            <p style="font-size:.8rem;margin:0;color:var(--muted)">&#127807; ${esc(act_obj.benefits)}</p>
            ${entry.notes ? `<div style="margin-top:8px;padding:8px;background:#FFF8F4;border-radius:8px;font-size:.82rem"><b>&#128203; ${t('Teacher Note:','Nota del Maestro:')}</b> ${esc(entry.notes)}</div>` : ''}
          </div>`;
        });
      } else {
        h += `<div class="card"><p class="soft" style="margin:0">${t('No activities marked as completed yet today. Check back later!','Aun no hay actividades completadas hoy. Vuelva mas tarde.')}</p></div>`;
      }
    } else {
      h += `<div class="card"><p class="soft" style="margin:0">${t("Today's learning report is not yet available. Check back after class!","El reporte de aprendizaje de hoy aun no esta disponible. Vuelva despues de clase.")}</p></div>`;
    }

    /* Teacher notes for the day */
    const notes = DB.curriculum.teacherNotes.filter(n => n.date === dateStr && n.childId === selChild);
    if (notes.length) {
      notes.forEach(note => {
        h += `<div class="card t-teal" style="margin-top:10px">
          <p class="lead" style="margin-bottom:8px">&#128203; ${t('Teacher Notes for Today','Notas del Maestro de Hoy')}</p>
          ${note.strengths  ? `<div style="margin-bottom:6px"><b>&#11088; ${t('Strengths observed:','Fortalezas observadas:')}</b><br><span style="font-size:.88rem">${esc(note.strengths)}</span></div>` : ''}
          ${note.areas      ? `<div style="margin-bottom:6px"><b>&#127919; ${t('Areas to support:','Areas de apoyo:')}</b><br><span style="font-size:.88rem">${esc(note.areas)}</span></div>` : ''}
          ${note.moments    ? `<div style="margin-bottom:6px"><b>&#128149; ${t('Positive moments:','Momentos positivos:')}</b><br><span style="font-size:.88rem">${esc(note.moments)}</span></div>` : ''}
          ${note.recs       ? `<div style="margin-bottom:0"><b>&#127968; ${t('Try at home:','Para practicar en casa:')}</b><br><span style="font-size:.88rem">${esc(note.recs)}</span></div>` : ''}
        </div>`;
      });
    }
  }

  /* ── SUCCESS PROFILE (parent view) ── */
  if (CURR_SUB === 'success') {
    const selKid = DB.children.find(c => c.id === selChild);
    h += `<div class="card t-gold" style="margin-bottom:14px">
      <p class="lead" style="margin-bottom:4px">&#11088; ${esc(selKid ? selKid.name.split(' ')[0] : t('Your Child','Su Hijo'))}'s ${t('Success Profile','Perfil de Exito')}</p>
      <p style="font-size:.83rem;color:var(--ink);margin:0">${t('We measure growth through creativity, leadership, resilience, and real-world skills — not just academic scores.','Medimos el crecimiento en creatividad, liderazgo, resiliencia y habilidades practicas, no solo en calificaciones.')}</p>
    </div>`;
    if (typeof successMetricsView === 'function') h += successMetricsView(selChild, false);
  }

  /* ── FULL LEARNING REPORT (parent view) ── */
  if (CURR_SUB === 'report') {
    if (typeof parentLearningReport === 'function') h += parentLearningReport(selChild, dateStr);
  }

  /* ── PROGRESS ── */
  if (CURR_SUB === 'progress') {
    const progress = getChildProgress(selChild);
    const ageInfo  = CURR_AGE_INFO[ageKey] || CURR_AGE_INFO.preschool;
    h += `<div class="card" style="background:${ageInfo.color};margin-bottom:14px">
      <h3 style="margin:0 0 4px">${esc(child.name)} — ${t('Development Overview','Resumen del Desarrollo')}</h3>
      <p class="soft" style="font-size:.83rem;margin:0">${esc(ageInfo.label)} &middot; ${esc(ageInfo.range)}</p>
    </div>`;
    CURR_CATS.forEach(cat => {
      const pct = progress[cat.id] || 0;
      h += `<div style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <span style="font-size:.9rem;font-weight:700">${cat.icon} ${esc(cat.label)}</span>
          <span style="font-size:.85rem;font-weight:800;color:var(--night)">${pct}%</span>
        </div>
        <div style="background:#EAE2DA;border-radius:999px;height:14px;overflow:hidden">
          <div style="background:${cat.color};width:${pct}%;height:100%;border-radius:999px;transition:width .5s"></div>
        </div>
      </div>`;
    });
    h += `<p class="soft" style="font-size:.8rem;text-align:center;margin-top:8px">${t("Progress is calculated based on milestones assessed by your child's teacher.","El progreso se calcula segun los hitos evaluados por el maestro de su hijo.")}</p>`;
  }

  /* ── MILESTONES (read-only for parent) ── */
  if (CURR_SUB === 'milestones') {
    h += fullMilestoneTracker(selChild, ageKey, false);
  }

  return h;
}

/* ══════════════════════════════════════════════
   SECTION 9 — ADMIN CURRICULUM VIEW
   ══════════════════════════════════════════════ */

function adminCurriculumView() {
  const tabs = [
    ['overview',  '&#128202; '+t('Overview','Resumen')],
    ['themes',    '&#127808; '+t('Weekly Themes','Temas Semanales')],
    ['analytics', '&#128201; '+t('Analytics','Analiticas')],
    ['success',   '&#11088; '+t('Success Analytics','Analiticas de Exito')],
    ['pathways',  '&#128197; '+t('Monthly Pathways','Rutas Mensuales')],
    ['library',   '&#128218; '+t('Library','Biblioteca')]
  ];
  let h = '<div class="subtabs">' + tabs.map(([k, l]) =>
    `<button class="${CURR_SUB===k?'active':''}" onclick="CURR_SUB='${k}';renderPortal()">${l}</button>`
  ).join('') + '</div>';

  /* ── OVERVIEW ── */
  if (CURR_SUB === 'overview') {
    const totalPlans = DB.curriculum.plans.length;
    const todayPlans = DB.curriculum.plans.filter(p => p.date === getTodayDate()).length;
    const completedActs = DB.curriculum.plans.reduce((s, p) =>
      s + (p.activities||[]).filter(a => a.status === 'completed').length, 0);
    const totalMilestones = DB.curriculum.milestones.length;
    h += `<div class="stat-grid" style="margin-bottom:14px">
      <div class="stat-box"><div class="stat-num">${totalPlans}</div><div class="stat-lbl">${t('Lesson Plans','Planes de Clase')}</div></div>
      <div class="stat-box"><div class="stat-num">${todayPlans}</div><div class="stat-lbl">${t('Plans Today','Planes Hoy')}</div></div>
      <div class="stat-box"><div class="stat-num">${completedActs}</div><div class="stat-lbl">${t('Activities Done','Actividades Completadas')}</div></div>
      <div class="stat-box"><div class="stat-num">${totalMilestones}</div><div class="stat-lbl">${t('Milestones Tracked','Hitos Registrados')}</div></div>
    </div>`;
    h += `<div class="card"><p class="lead">${t('Curriculum System Overview','Resumen del Sistema de Curriculo')}</p><ul class="star-list">
      <li><b>${Object.values(ACTIVITY_LIBRARY).reduce((s,ag)=>s+Object.values(ag).reduce((ss,cat)=>ss+cat.length,0),0)}</b> ${t('activities across all age groups','actividades en todos los grupos de edad')}</li>
      <li><b>${Object.values(MILESTONES_DB).reduce((s,ag)=>s+Object.values(ag).reduce((ss,cat)=>ss+cat.length,0),0)}</b> ${t('developmental milestones tracked','hitos del desarrollo registrados')}</li>
      <li><b>4</b> ${t('age groups: Infants, Toddlers, Preschool, School-Age','grupos de edad: Bebes, Ninos Pequenos, Preescolar, Edad Escolar')}</li>
      <li><b>8</b> ${t('development domains: Language, Cognitive, Social-Emotional, Physical, Creativity, Life Skills, Health, Character','dominios: Lenguaje, Cognitivo, Social-Emocional, Fisico, Creatividad, Habilidades de Vida, Salud, Caracter')}</li>
      <li>${t('AI-generated daily lesson plans with activity library','Planes de clase diarios generados por IA con biblioteca de actividades')}</li>
    </ul></div>`;
    DB.classes.forEach(cls => {
      const ageKey = CLS_TO_AGE[cls.name] || 'preschool';
      const theme  = getWeekTheme(cls.id);
      const teachers = DB.users.filter(u => u.role === 'teacher' && u.classId === cls.id);
      const todayPlan = getPlan(cls.id, getTodayDate());
      const done = todayPlan ? (todayPlan.activities||[]).filter(a=>a.status==='completed').length : 0;
      const total = todayPlan ? (todayPlan.activities||[]).length : 0;
      h += `<div class="card" style="margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <b>${esc(cls.name)}</b>
          <span class="tag">${esc(CURR_AGE_INFO[ageKey]?.label||ageKey)}</span>
          <span class="tag navy">&#127808; ${esc(theme)}</span>
          ${teachers.map(te=>`<span class="soft" style="font-size:.82rem">&#129489; ${esc(te.name)}</span>`).join('')}
          <div style="margin-left:auto">
            ${total ? `<span style="font-size:.85rem;color:var(--teal);font-weight:700">${done}/${total} ${t('activities today','actividades hoy')}</span>` : `<span class="soft" style="font-size:.82rem">${t('No plan today','Sin plan hoy')}</span>`}
          </div>
        </div>
        ${total ? `<div style="background:#EAE2DA;border-radius:999px;height:8px;margin-top:8px;overflow:hidden">
          <div style="background:var(--teal);width:${Math.round((done/total)*100)}%;height:100%;border-radius:999px"></div>
        </div>` : ''}
      </div>`;
    });
  }

  /* ── WEEKLY THEMES ── */
  if (CURR_SUB === 'themes') {
    h += `<p class="soft" style="margin-bottom:10px">${t('Assign a weekly learning theme to each classroom. This guides the AI lesson plan generator.','Asigne un tema semanal de aprendizaje a cada salon. Esto guia el generador de planes de clase.')}</p>`;
    const weekStart = getWeekStart();
    DB.classes.forEach(cls => {
      const current = getWeekTheme(cls.id);
      h += `<div class="card" style="margin-bottom:10px">
        <b>${esc(cls.name)}</b>
        <div class="field" style="margin-top:8px;margin-bottom:0">
          <label>${t("This Week's Theme","Tema de Esta Semana")} (${t('starting','desde')} ${weekStart})</label>
          <select onchange="setWeekTheme('${cls.id}','${weekStart}',this.value)">
            ${CURR_THEMES.map(th=>`<option value="${esc(th)}" ${th===current?'selected':''}>${esc(th)}</option>`).join('')}
          </select>
        </div>
      </div>`;
    });
  }

  /* ── ANALYTICS ── */
  if (CURR_SUB === 'analytics') {
    h += `<p class="soft" style="margin-bottom:10px">${t('Child development analytics across all classrooms.','Analiticas del desarrollo infantil en todos los salones.')}</p>`;
    const allKids = DB.children;
    if (!allKids.length) { h += `<div class="empty">${t('No children enrolled yet.','Aun no hay ninos inscritos.')}</div>`; return h; }
    CURR_CATS.forEach(cat => {
      const allProgress = allKids.map(child => {
        const ageKey = getChildAgeKey(child.id);
        const prog = getChildProgress(child.id);
        return prog[cat.id] || 0;
      });
      const avg = allProgress.length ? Math.round(allProgress.reduce((s,v)=>s+v,0)/allProgress.length) : 0;
      h += `<div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;margin-bottom:3px">
          <span style="font-size:.88rem;font-weight:700">${cat.icon} ${esc(cat.label)}</span>
          <span style="font-size:.85rem;color:var(--night);font-weight:700">${avg}% ${t('avg across all children','promedio de todos los ninos')}</span>
        </div>
        <div style="background:#EAE2DA;border-radius:999px;height:12px;overflow:hidden">
          <div style="background:${cat.color};width:${avg}%;height:100%;border-radius:999px"></div>
        </div>
      </div>`;
    });
    h += `<p class="soft" style="font-size:.8rem;text-align:center">${t('Based on','Basado en')} ${DB.curriculum.milestones.length} ${t('milestone assessments recorded by teachers.','evaluaciones de hitos registradas por maestros.')}</p>`;
  }

  /* ── LIBRARY (admin view) ── */
  if (CURR_SUB === 'library') {
    h += activityLibraryView('all');
  }

  /* ── SUCCESS ANALYTICS (admin view) ── */
  if (CURR_SUB === 'success') {
    h += `<p class="soft" style="margin-bottom:10px">${t('Non-academic success metrics across all children.','Metricas de exito no academico en todos los ninos.')}</p>`;
    const allKids = DB.children;
    if (!allKids.length) { h += `<div class="empty">${t('No children enrolled yet.','Aun no hay ninos inscritos.')}</div>`; return h; }
    if (typeof SUCCESS_METRICS !== 'undefined') {
      SUCCESS_METRICS.forEach(metric => {
        const allTracked = (DB.curriculum.successMetrics || []).filter(m => m.metricId === metric.id);
        const levelCounts = {};
        SM_LEVELS.forEach(l => { levelCounts[l] = 0; });
        allTracked.forEach(m => { if (m.level) levelCounts[m.level] = (levelCounts[m.level] || 0) + 1; });
        const total = allTracked.length;
        h += `<div style="margin-bottom:12px;padding:10px 14px;border-radius:14px;background:#fff;border:1.5px solid #EAE2DA">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span>${metric.icon}</span>
            <b style="font-size:.9rem;color:var(--night)">${esc(metric.label)}</b>
            <span class="soft" style="font-size:.78rem;margin-left:auto">${total}/${allKids.length} assessed</span>
          </div>
          <div style="display:flex;gap:4px;height:14px">
            ${SM_LEVELS.map((l, i) => {
              const count = levelCounts[l] || 0;
              return `<div style="flex:${Math.max(count,1)};height:14px;background:${SM_COLORS[i]};border-radius:3px" title="${l}: ${count}"></div>`;
            }).join('')}
          </div>
          <div style="display:flex;gap:8px;margin-top:4px;flex-wrap:wrap">
            ${SM_LEVELS.map((l, i) => `<span style="font-size:.68rem;color:var(--muted)"><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${SM_COLORS[i]};margin-right:3px"></span>${esc(smLabel(l))}: ${levelCounts[l]||0}</span>`).join('')}
          </div>
        </div>`;
      });
    }
  }

  /* ── MONTHLY PATHWAYS (admin view) ── */
  if (CURR_SUB === 'pathways') {
    if (typeof monthlyPathwayView === 'function') h += monthlyPathwayView();
  }

  return h;
}

/* ══════════════════════════════════════════════
   SECTION 10 — ACTIVITY LIBRARY VIEW
   ══════════════════════════════════════════════ */

function activityLibraryView(defaultAge) {
  if (!CURR_LIB_AGE) CURR_LIB_AGE = defaultAge || 'preschool';
  let h = `<div class="card" style="margin-bottom:14px">
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
      <div class="field" style="margin:0;flex:1;min-width:140px">
        <label>${t('Age Group','Grupo de Edad')}</label>
        <select onchange="CURR_LIB_AGE=this.value;renderPortal()">
          ${defaultAge==='all'?`<option value="all">${t('All Ages','Todas las Edades')}</option>`:''}
          ${Object.entries(CURR_AGE_INFO).map(([k,v])=>`<option value="${k}" ${CURR_LIB_AGE===k?'selected':''}>${esc(v.label)}</option>`).join('')}
        </select>
      </div>
      <div class="field" style="margin:0;flex:1;min-width:140px">
        <label>${t('Domain','Dominio')}</label>
        <select onchange="CURR_LIB_CAT=this.value;renderPortal()">
          <option value="all">${t('All Domains','Todos los Dominios')}</option>
          ${CURR_CATS.map(c=>`<option value="${c.id}" ${CURR_LIB_CAT===c.id?'selected':''}>${c.icon} ${esc(c.label)}</option>`).join('')}
        </select>
      </div>
    </div>
  </div>`;

  const ageKeys = CURR_LIB_AGE === 'all' ? Object.keys(CURR_AGE_INFO) : [CURR_LIB_AGE];
  let count = 0;
  ageKeys.forEach(ak => {
    const ageLib = ACTIVITY_LIBRARY[ak] || {};
    const ageInfo = CURR_AGE_INFO[ak];
    const catKeys = CURR_LIB_CAT === 'all' ? Object.keys(ageLib) : [CURR_LIB_CAT];
    catKeys.forEach(catId => {
      const activities = ageLib[catId] || [];
      const catInfo = CURR_CATS.find(c => c.id === catId);
      activities.forEach(a => {
        count++;
        h += `<div class="card" style="border-left:5px solid ${catInfo?.color||'var(--teal)'};margin-bottom:10px">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px">
            <span>${catInfo?.icon||''}</span>
            <b style="font-size:.88rem;color:var(--night)">${esc(catInfo?.label||catId)}</b>
            <span class="tag" style="background:${ageInfo?.color||'#EEE'};color:var(--night)">${esc(ageInfo?.label||ak)}</span>
            <span class="tag">&#128337; ${a.dur} min</span>
            <span class="tag">${t('Difficulty','Dificultad')} ${a.diff}/5</span>
          </div>
          <h4 style="margin:0 0 3px">${esc(a.title)}</h4>
          <p class="soft" style="font-size:.83rem;margin:0 0 6px">&#127919; ${esc(a.obj)}</p>
          <details>
            <summary style="cursor:pointer;font-size:.82rem;color:var(--teal);font-weight:700">&#128203; ${t('View Full Activity','Ver Actividad Completa')}</summary>
            <div style="padding-top:8px">
              <p style="font-size:.82rem;margin-bottom:5px"><b>${t('Materials:','Materiales:')}</b> ${esc((a.mats||[]).join(', '))}</p>
              <div style="font-size:.82rem;margin-bottom:5px"><b>${t('Steps:','Pasos:')}</b>
                <ol style="margin:4px 0 0 18px;padding:0">${(a.steps||[]).map(s=>`<li style="margin-bottom:2px">${esc(s)}</li>`).join('')}</ol>
              </div>
              ${a.qs&&a.qs.length?`<p style="font-size:.82rem;margin-bottom:5px"><b>${t('Ask Children:','Preguntas para los Ninos:')}</b> ${esc(a.qs.join(' | '))}</p>`:''}
              <p style="font-size:.82rem;margin-bottom:0"><b>&#127807; ${t('Benefits:','Beneficios:')}</b> ${esc(a.benefits||'')}</p>
            </div>
          </details>
        </div>`;
      });
    });
  });
  if (!count) h += `<div class="empty">${t('No activities found for this filter.','No se encontraron actividades para este filtro.')}</div>`;
  else h = `<p class="soft" style="font-size:.83rem;margin-bottom:10px">${count} ${count===1?t('activity found','actividad encontrada'):t('activities found','actividades encontradas')}</p>` + h;
  return h;
}

/* ══════════════════════════════════════════════
   SECTION 11 — MILESTONE TRACKER WIDGETS
   ══════════════════════════════════════════════ */

function quickMilestoneWidget(childId, ageKey) {
  const milestoneData = MILESTONES_DB[ageKey] || {};
  const childMilestones = getMilestones(childId);
  let h = `<div class="card" style="margin-bottom:14px">
    <p class="lead" style="margin-bottom:10px">&#127919; ${t('Quick Milestone Update','Actualizacion Rapida de Hitos')}</p>`;
  const cat = CURR_CATS[0]; // show language by default
  const skills = (milestoneData[cat.id] || []).slice(0, 3);
  skills.forEach(m => {
    const tracked = childMilestones.find(cm => cm.skillId === m.id);
    const lvl = tracked ? tracked.level : '';
    h += `<div style="margin-bottom:10px">
      <div style="font-size:.85rem;font-weight:700;margin-bottom:4px">${cat.icon} ${esc(m.skill)}</div>
      <div style="display:flex;gap:4px;flex-wrap:wrap">
        ${ML_LEVELS.map((l,i)=>`<button class="mini-btn ${l===lvl?'success':'ghost'}"
          onclick="saveChildMilestoneEntry('${childId}','${cat.id}','${m.id}','${l}')"
          style="font-size:.72rem;padding:3px 8px">${esc(mlLabel(l))}</button>`).join('')}
      </div>
    </div>`;
  });
  h += `<button class="btn btn-teal" onclick="CURR_SUB='milestones';renderPortal()">${t('View All Milestones','Ver Todos los Hitos')} &#8594;</button></div>`;
  return h;
}

function fullMilestoneTracker(childId, ageKey, canEdit) {
  const milestoneData = MILESTONES_DB[ageKey] || {};
  const childMilestones = getMilestones(childId);
  const child = DB.children.find(c => c.id === childId);
  const progress = getChildProgress(childId);
  let h = '';

  /* Progress Overview */
  h += `<div class="card" style="margin-bottom:14px">
    <p class="lead" style="margin-bottom:10px">${t('Development Progress','Progreso del Desarrollo')} — ${child ? esc(child.name) : ''}</p>
    ${CURR_CATS.map(cat => {
      const pct = progress[cat.id] || 0;
      return `<div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;margin-bottom:3px">
          <span style="font-size:.83rem;font-weight:700">${cat.icon} ${esc(cat.label)}</span>
          <span style="font-size:.8rem;font-weight:800;color:var(--night)">${pct}%</span>
        </div>
        <div style="background:#EAE2DA;border-radius:999px;height:10px;overflow:hidden">
          <div style="background:${cat.color};width:${pct}%;height:100%;border-radius:999px;transition:width .5s"></div>
        </div>
      </div>`;
    }).join('')}
  </div>`;

  /* Milestones by Category */
  CURR_CATS.forEach(cat => {
    const skills = milestoneData[cat.id] || [];
    if (!skills.length) return;
    h += `<div class="card" style="margin-bottom:10px">
      <p style="font-weight:800;margin-bottom:8px">${cat.icon} ${esc(cat.label)}</p>`;
    skills.forEach(m => {
      const tracked = childMilestones.find(cm => cm.skillId === m.id);
      const lvl = tracked ? tracked.level : null;
      const lvlIdx = lvl ? ML_LEVELS.indexOf(lvl) : -1;
      h += `<div style="margin-bottom:10px">
        <div style="font-size:.85rem;font-weight:700;margin-bottom:4px">${esc(m.skill)}</div>
        <div style="display:flex;gap:4px;flex-wrap:wrap">
          ${ML_LEVELS.map((l,i) => {
            const active = l === lvl;
            const past   = i <= lvlIdx;
            if (!canEdit) {
              return `<span style="padding:3px 10px;border-radius:20px;font-size:.72rem;font-weight:700;background:${active?ML_COLORS[i]:'#F5F5F5'};color:${active?'#333':'#AAA'}">${esc(mlLabel(l))}</span>`;
            }
            return `<button class="mini-btn" style="font-size:.72rem;padding:3px 9px;background:${active?ML_COLORS[i]:'#F5F5F5'};border-color:${active?'#999':'#DDD'};color:${active?'#333':'#AAA'}"
              onclick="saveChildMilestoneEntry('${childId}','${cat.id}','${m.id}','${l}')">${esc(mlLabel(l))}</button>`;
          }).join('')}
        </div>
        ${tracked && tracked.date ? `<p style="font-size:.72rem;color:var(--muted);margin:3px 0 0">${t('Last assessed:','Ultima evaluacion:')} ${esc(tracked.date)}</p>` : ''}
      </div>`;
    });
    h += `</div>`;
  });
  return h;
}

/* ══════════════════════════════════════════════
   SECTION 12 — TEACHER NOTES WIDGET
   ══════════════════════════════════════════════ */

function teacherNoteWidget(childId, date) {
  const existing = getTeacherNote(childId, date);
  const child = DB.children.find(c => c.id === childId);
  return `<div class="card" style="margin-bottom:14px">
    <p class="lead" style="margin-bottom:10px">&#128203; ${t('Teacher Notes','Notas del Maestro')} — ${child ? esc(child.name) : ''}</p>
    <div class="field"><label>&#11088; ${t('Strengths Observed Today','Fortalezas Observadas Hoy')}</label>
      <textarea id="tn-strengths" placeholder="${t('What did this child do well today?','Que hizo bien este nino hoy?')}">${esc((existing||{}).strengths||'')}</textarea></div>
    <div class="field"><label>&#127919; ${t('Areas Needing Support','Areas que Necesitan Apoyo')}</label>
      <textarea id="tn-areas" placeholder="${t('Where does this child need additional help or encouragement?','Donde necesita este nino mas ayuda o motivacion?')}">${esc((existing||{}).areas||'')}</textarea></div>
    <div class="field"><label>&#128149; ${t('Positive Moments to Share','Momentos Positivos para Compartir')}</label>
      <textarea id="tn-moments" placeholder="${t('A special moment, interaction, or achievement to share with the family...','Un momento especial, interaccion o logro para compartir con la familia...')}">${esc((existing||{}).moments||'')}</textarea></div>
    <div class="field"><label>&#127968; ${t('Recommendations for Home','Recomendaciones para el Hogar')}</label>
      <textarea id="tn-recs" placeholder="${t('What can the family do at home to support learning?','Que puede hacer la familia en casa para apoyar el aprendizaje?')}">${esc((existing||{}).recs||'')}</textarea></div>
    <button class="btn btn-teal" onclick="saveTeacherCurrNote('${childId}','${date}')">&#9989; ${t('Save Notes','Guardar Notas')}</button>
    <div class="form-msg" id="tn-msg"></div>
  </div>`;
}

/* ══════════════════════════════════════════════
   SECTION 13 — AI CURRICULUM GENERATOR
   ══════════════════════════════════════════════ */

function aiGeneratorView(defaultAge) {
  let h = `<div class="card" style="margin-bottom:14px">
    <p class="lead">&#9889; ${t('AI Curriculum Generator','Generador de Curriculo IA')}</p>
    <p class="soft" style="font-size:.85rem;margin-bottom:12px">${t('Generate a complete, research-based daily lesson plan aligned to developmental milestones and your weekly theme.','Genera un plan de clase diario completo basado en investigacion, alineado con los hitos del desarrollo y el tema semanal.')}</p>
    <div class="field"><label>${t('Age Group','Grupo de Edad')}</label>
      <select id="gen-age">
        ${Object.entries(CURR_AGE_INFO).map(([k,v])=>`<option value="${k}" ${k===defaultAge?'selected':''}>${esc(v.label)} (${esc(v.range)})</option>`).join('')}
      </select>
    </div>
    <div class="field"><label>${t('Weekly Learning Theme','Tema Semanal de Aprendizaje')}</label>
      <select id="gen-theme">
        ${CURR_THEMES.map(th=>`<option value="${esc(th)}">${esc(th)}</option>`).join('')}
      </select>
    </div>
    <button class="btn btn-night" onclick="runCurriculumGenerator()">&#9889; ${t('Generate Lesson Plan','Generar Plan de Clase')}</button>
  </div>`;

  if (CURR_GEN_RESULT) {
    const result = CURR_GEN_RESULT;
    const ageInfo = CURR_AGE_INFO[result.ageKey] || {};
    h += `<div class="card t-gold" style="margin-bottom:14px">
      <h3 style="margin:0 0 4px">&#127775; ${t('Generated Lesson Plan','Plan de Clase Generado')}</h3>
      <p class="soft" style="font-size:.83rem;margin:0">${esc(ageInfo.label)} &middot; ${t('Theme:','Tema:')} <b>${esc(result.theme)}</b></p>
    </div>`;
    result.activities.forEach(entry => {
      const catInfo = CURR_CATS.find(c => c.id === entry.catId) || {};
      const actPool = (ACTIVITY_LIBRARY[result.ageKey] || {})[entry.catId] || [];
      const act_obj = actPool.find(a => a.id === entry.activityId) || actPool[0];
      if (!act_obj) return;
      h += `<div class="card" style="border-left:5px solid ${catInfo.color||'var(--teal)'};margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;flex-wrap:wrap">
          <span>${catInfo.icon||''}</span>
          <b style="font-size:.88rem">${esc(catInfo.label||'')}</b>
          <span class="tag">&#128337; ${act_obj.dur} min</span>
        </div>
        <h4 style="margin:0 0 3px">${esc(act_obj.title)}</h4>
        <p class="soft" style="font-size:.83rem;margin:0 0 6px">&#127919; ${esc(act_obj.obj)}</p>
        <details>
          <summary style="cursor:pointer;font-size:.82rem;color:var(--teal);font-weight:700">${t('View Full Activity','Ver Actividad Completa')}</summary>
          <div style="padding-top:8px">
            <p style="font-size:.82rem;margin-bottom:5px"><b>${t('Materials:','Materiales:')}</b> ${esc((act_obj.mats||[]).join(', '))}</p>
            <div style="font-size:.82rem;margin-bottom:5px"><b>${t('Steps:','Pasos:')}</b>
              <ol style="margin:4px 0 0 18px;padding:0">${(act_obj.steps||[]).map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
            </div>
            ${act_obj.qs&&act_obj.qs.length?`<p style="font-size:.82rem;margin-bottom:5px"><b>${t('Ask Children:','Preguntas para los Ninos:')}</b> ${esc(act_obj.qs.join(' | '))}</p>`:''}
            <p style="font-size:.82rem;margin-bottom:0"><b>${t('Benefits:','Beneficios:')}</b> ${esc(act_obj.benefits||'')}</p>
          </div>
        </details>
      </div>`;
    });
  }
  return h;
}

/* ══════════════════════════════════════════════
   SECTION 14 — ACTION FUNCTIONS
   ══════════════════════════════════════════════ */

function setCurrActivityStatus(planId, idx, status) {
  const plan = DB.curriculum.plans.find(p => p.id === planId);
  if (!plan || !plan.activities[idx]) return;
  plan.activities[idx].status = status;
  saveDB();
  renderPortal();
}

function setCurrActivityNote(planId, idx, note) {
  const plan = DB.curriculum.plans.find(p => p.id === planId);
  if (!plan || !plan.activities[idx]) return;
  plan.activities[idx].notes = note;
  saveDB();
}

function regeneratePlan(classId, date) {
  if (!confirm(t("Regenerate today's lesson plan? Current activity notes will be lost.","Regenerar el plan de hoy? Se perderan las notas de actividades."))) return;
  DB.curriculum.plans = DB.curriculum.plans.filter(p => !(p.classId === classId && p.date === date));
  saveDB();
  renderPortal();
}

function setWeekTheme(classId, weekStart, theme) {
  const existing = DB.curriculum.weekThemes.find(w => w.classId === classId && w.weekStart === weekStart);
  if (existing) existing.theme = theme;
  else DB.curriculum.weekThemes.push({ classId, weekStart, theme });
  saveDB();
  if (typeof msg === 'function') msg('', '', true);
}

function saveChildMilestoneEntry(childId, catId, skillId, level) {
  const existing = DB.curriculum.milestones.find(m => m.childId === childId && m.skillId === skillId);
  if (existing) { existing.level = level; existing.date = getTodayDate(); existing.teacherId = CU ? CU.id : ''; }
  else DB.curriculum.milestones.push({ id: typeof uid==='function'?uid():'ml_'+Date.now(), childId, catId, skillId, level, date: getTodayDate(), teacherId: CU ? CU.id : '' });
  saveDB();
  renderPortal();
}

function saveTeacherCurrNote(childId, date) {
  const strengths = (document.getElementById('tn-strengths')||{}).value || '';
  const areas     = (document.getElementById('tn-areas')||{}).value || '';
  const moments   = (document.getElementById('tn-moments')||{}).value || '';
  const recs      = (document.getElementById('tn-recs')||{}).value || '';
  const existing  = DB.curriculum.teacherNotes.find(n => n.childId === childId && n.date === date);
  if (existing) { existing.strengths = strengths; existing.areas = areas; existing.moments = moments; existing.recs = recs; }
  else DB.curriculum.teacherNotes.push({ id: typeof uid==='function'?uid():'tn_'+Date.now(), childId, date, teacherId: CU?CU.id:'', strengths, areas, moments, recs });
  saveDB();
  if (typeof msg === 'function') msg('tn-msg', 'Notes saved!', true);
}

function runCurriculumGenerator() {
  const ageKey = (document.getElementById('gen-age')||{}).value || 'preschool';
  const theme  = (document.getElementById('gen-theme')||{}).value || CURR_THEMES[0];
  const acts = ACTIVITY_LIBRARY[ageKey] || ACTIVITY_LIBRARY.preschool;
  const activities = [];
  CURR_CATS.forEach(cat => {
    const pool = acts[cat.id] || [];
    if (pool.length) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      activities.push({ catId: cat.id, activityId: pick.id });
    }
  });
  CURR_GEN_RESULT = { ageKey, theme, activities };
  renderPortal();
}

function fmtDateC(s) {
  if (!s) return '';
  try { return new Date(s + 'T00:00').toLocaleDateString(typeof LANG !== 'undefined' && LANG === 'es' ? 'es-US' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }); }
  catch(e) { return s; }
}

/* ══════════════════════════════════════════════
   SECTION 15 — CURRICULUM CSS
   ══════════════════════════════════════════════ */

(function injectCurriculumCSS() {
  const style = document.createElement('style');
  style.textContent = `
    .cur-badge { display:inline-block; padding:3px 10px; border-radius:20px; font-size:.72rem; font-weight:700; margin-right:4px; }
    .cur-card  { border-radius:14px; border:2px solid #EAE2DA; padding:14px; margin-bottom:12px; background:#fff; }
    .cur-prog-bar { background:#EAE2DA; border-radius:999px; height:12px; overflow:hidden; margin-top:4px; }
    .cur-prog-fill { height:100%; border-radius:999px; transition: width .5s ease; }
  `;
  document.head.appendChild(style);
})();

/* ══════════════════════════════════════════════
   SECTION 16 — INIT
   ══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
  if (typeof initCurriculumDB === 'function' && typeof DB !== 'undefined' && DB) initCurriculumDB();
});

/* ══════════════════════════════════════════════
   SECTION 17 — EXTENDED CURRICULUM PHILOSOPHY
   New domains: Financial Literacy, Entrepreneurship,
   Critical Thinking, Innovation, Leadership
   ══════════════════════════════════════════════ */

const EXTENDED_CATS = [
  { id: 'financial_literacy', label: 'Financial Literacy',  icon: '&#128176;', color: '#2E8B57' },
  { id: 'entrepreneurship',   label: 'Entrepreneurship',    icon: '&#128640;', color: '#B87828' },
  { id: 'critical_thinking',  label: 'Critical Thinking',   icon: '&#129504;', color: '#4A5EC4' },
  { id: 'innovation',         label: 'Innovation & Design', icon: '&#128161;', color: '#C8760A' },
  { id: 'leadership',         label: 'Leadership',          icon: '&#11088;',  color: '#8B4AB8' }
];

// Merge extended categories into the main CURR_CATS array
EXTENDED_CATS.forEach(ec => {
  if (!CURR_CATS.find(c => c.id === ec.id)) CURR_CATS.push(ec);
});

/* ══════════════════════════════════════════════
   SECTION 18 — FINANCIAL LITERACY ACTIVITIES
   ══════════════════════════════════════════════ */

const FL_INFANTS = [
  act('ifl1','Mine & Yours','Introduce the concept of ownership and sharing',['Two identical safe objects'],['Give baby one object clearly saying "yours!"','Hold another and say "mine!"','Practice giving and receiving','Narrate every exchange warmly'],[],'Early understanding of ownership, sharing, and turn-taking',8,1),
  act('ifl2','Give & Receive','Build gratitude and the joy of giving',['Small wrapped surprise object'],['Wrap a simple object','Present it: "This is a gift for you!"','Help baby open it slowly','Celebrate and name what was given'],[],'Gratitude, generosity, and social-emotional development through giving',8,1)
];

const FL_TODDLERS = [
  act('tfl1','Needs vs. Wants','Introduce the most important financial concept: needs vs. wants',['Picture cards of food, clothing, toys, candy, shelter, water'],['Show each card and ask: "Do we NEED this or do we WANT it?"','Sort cards into two groups together','Examples: food = need; candy = want','Discuss: "What would happen if we only had our needs?'],['Do we need this or want it?','Can we live without it?','What is a need at our house?'],'Financial thinking foundation: needs vs. wants, decision-making',12,1),
  act('tfl2','Piggy Bank Practice','Introduce saving as a habit and a value',['Clear piggy bank or jar','Play coins'],['Show coins and name them','Drop coins in jar one at a time while counting','Talk about saving: "We keep this money for later"','Set a simple savings goal: new book next week'],['Where is the money going?','What are we saving for?','What happens when we save?'],'Saving habits, counting, goal-setting, and delayed gratification',10,1),
  act('tfl3','Classroom Store','Experience buying and selling in a safe play environment',['Play money','Simple items to "sell": stickers, crayons, small objects','Price tags'],['Set up a simple classroom store','Give each child the same amount of play money','Children choose what to buy based on their money','Count change together as a class'],['How much does this cost?','Do you have enough money?','What happens if something costs more than you have?'],'Budgeting, counting, choice-making, and real-world math application',20,2),
  act('tfl4','Value of Work','Introduce the concept that money comes from work',['Simple tasks: sorting, stacking, cleaning up'],['Assign a classroom job','Reward job completion with a play coin or sticker','Discuss: "You worked, so you earned this!"','Compare: "If you do not work, you do not earn"'],['Why did you earn this?','What did you do to get it?','What work did you do?'],'Work ethic, value creation, cause-effect, and earning concept',10,1)
];

const FL_PRESCHOOL = [
  act('pfl1','Earn Save Spend Give','Teach the four pillars of financial wisdom',['4 jars labeled: Earn, Save, Spend, Give','Play money'],['Role-play earning: complete a classroom task, receive play money','Show the 4 jars','Divide earned money among all 4 jars','Discuss each jar\'s purpose'],['Why do we save some?','Who do we give to when we Give?','What do you want to spend your Spend money on?'],'Complete financial literacy foundation: earning, saving, spending, giving',20,2),
  act('pfl2','Making Change','Practice basic math in a financial context',['Play money in different denominations','Simple price tags'],['Show an item priced at 5 coins','Child pays with 10 coins','Calculate change together: "10 minus 5 is 5 — here is your change!"','Reverse roles: child plays shopkeeper'],['How much does it cost?','How much did you pay?','How much change do you get back?'],'Subtraction in context, real-world math, and financial calculation',15,2),
  act('pfl3','Delayed Gratification Game','Practice the powerful skill of waiting for a bigger reward',['2 marshmallows or stickers','Visual timer'],['Offer child 1 sticker now or 2 stickers if they wait 5 minutes','Set a visible timer','Discuss: "Waiting can mean getting more!"','Debrief: "How did it feel to wait? Was it worth it?"'],['What happened when you waited?','Was waiting hard?','What bigger thing would you wait for?'],'Delayed gratification, patience, goal-setting, and future thinking',15,2),
  act('pfl4','Budget Challenge','Experience real-world spending decisions with limited resources',['10 play coins per child','Catalog of picture items with prices 1-5 coins'],['Give each child 10 coins','Show catalog of choices','Children must plan and choose: they cannot buy everything','Share choices and reasoning'],['Why did you choose that?','What did you decide NOT to buy? Why?','Did you have enough for everything you wanted?'],'Budgeting, prioritization, trade-offs, and financial decision-making',20,3),
  act('pfl5','Create & Sell','Introduction to entrepreneurship through creation and selling',['Art supplies','Simple items to make: bookmarks, drawings, origami'],['Children make a product','Set a price together','Hold a mini classroom market day','Count "earnings" at the end'],['What did you make?','How much did you charge?','What would you make next time?'],'Value creation, pricing basics, entrepreneurship, and creative commerce',25,2)
];

const FL_SCHOOL_AGE = [
  act('safl1','Budget Simulation','Manage a monthly budget with income, expenses, and goals',['Budget worksheet','Play money or budgeting spreadsheet template'],['Give each student a monthly "income" (e.g., 100 units)','List fixed expenses: rent, food, transportation','Optional expenses: entertainment, eating out','Set a savings goal and see if it fits'],['What must you pay first?','What did you have to give up?','How did you decide what was worth the cost?'],'Budgeting, prioritization, financial planning, and trade-off analysis',30,4),
  act('safl2','Investment Basics','Introduce the concept of money growing over time',['Simple interest visual with coins','Graph showing compound interest over time'],['Explain: "When you save in a bank, your money grows!"','Show: 100 coins today vs. 110 next year vs. 121 the year after','Discuss: "This is called interest — money working for you"','Compare: spend now vs. invest and grow'],['What happens to money in a bank?','Why is saving early so powerful?','What would you invest in if you could?'],'Investment basics, compound interest, delayed gratification, and wealth-building',25,4),
  act('safl3','Real-World Receipts','Analyze real purchase receipts for math and decision-making',['Actual or simulated grocery/store receipts'],['Give each student a receipt','Identify: what was bought, what it cost, any taxes','Calculate: total, average item price, biggest purchase','Evaluate: "Was this a need or a want? Was it a good value?"'],['What is tax?','What was the most expensive item?','Would you have bought the same things?'],'Math in context, consumer literacy, and critical financial thinking',20,3),
  act('safl4','Entrepreneurship Project','Design, create, and sell a real product or service',['Project planning template','Materials vary by product','Mini market day setup'],['Week 1: Identify a problem people have','Week 2: Design a solution (product or service)','Week 3: Create the product or plan the service','Week 4: Market day — present, pitch, and sell'],['What problem are you solving?','Who is your customer?','How much will you charge and why?','What did you learn about running a business?'],'Entrepreneurship, problem-solving, math, communication, and real-world value creation',120,5),
  act('safl5','Needs vs. Wants vs. Values','Deep exploration of how values guide financial decisions',['Personal values cards','Budget scenario cards'],['Identify personal values: family, adventure, creativity, security, service','Show budget scenarios','Ask: "How do your values change what you spend on?"','Discuss: "There is no wrong answer — values guide money choices"'],['What do you value most?','How does that affect what you spend money on?','What would you NOT spend money on because it conflicts with your values?'],'Values clarification, financial philosophy, and personal responsibility',20,4),
  act('safl6','Understanding Income','Explore different ways people earn money',['Career picture cards','Income comparison chart'],['Discuss: what is a salary vs. hourly vs. freelance vs. business income?','Look at different jobs and their approximate income ranges','Discuss: "Education and skills affect income"','Ask: "What do you want to do, and how will it support your life?"'],['What are different ways to earn money?','Why do some jobs pay more than others?','What skills help people earn more?'],'Career awareness, income literacy, and connection between skills and earning',20,3)
];

/* ══════════════════════════════════════════════
   SECTION 19 — ENTREPRENEURSHIP ACTIVITIES
   ══════════════════════════════════════════════ */

const ENT_TODDLERS = [
  act('tent1','Builder Challenge','Introduce creation and building as the foundation of entrepreneurship',['Blocks, boxes, cardboard'],['Present a simple problem: "We need a garage for our toy car"','Let children design and build the solution','Test: does it work? What would make it better?','Celebrate the solution'],['What did you build?','Does it solve the problem?','What would you change?'],'Problem-solving, creative construction, and solution thinking',15,1),
  act('tent2','Helper Store','Introduce the concept of offering services that help others',['Classroom setup with simple helping roles'],['Each child picks a way to help: water plants, stack books, clean table','Others "hire" them with a play token','Child completes the service and receives payment','Celebrate: "You provided a service!"'],['What service did you provide?','How did you help?','Did your customer like your work?'],'Service concept, helping others, work and reward, and community contribution',12,1)
];

const ENT_PRESCHOOL = [
  act('pent1','Problem Finders','Teach children to see problems as opportunities',['Problem journal'],['Go on a classroom "problem walk" — notice what is broken, missing, or could be better','List the problems found','Choose one: "Which problem bothers you most?"','Ask: "What could we do about it?"'],['What problems did you find?','Which one matters most to you?','What could you do to fix it?'],'Problem identification, entrepreneurial mindset, and solution orientation',15,2),
  act('pent2','Mini Market Day','Experience creating and selling simple products',['Art supplies','Simple materials for making items','Play money'],['Each child creates one item to sell (drawing, bookmark, bracelet)','Set a price: 2-3 play coins','Set up classroom marketplace','Children sell to each other and to teacher'],['What did you make and why?','How did you decide on the price?','Would you make something different next time?'],'Value creation, pricing, selling, creativity, and entrepreneurship practice',30,3),
  act('pent3','Customer Service','Learn that great businesses care deeply about customers',['Two toy stores: one with a friendly helper, one without'],['Role-play: one store ignores customers, one is warm and helpful','Children experience both as customers','Discuss: "Which store would you go back to? Why?"','Practice great customer service as the store owner'],['How did you feel at the good store vs. the bad store?','What did the helpful store owner do differently?','How would you treat YOUR customers?'],'Customer service, empathy, business fundamentals, and social skills',15,2),
  act('pent4','Lemonade Stand Math','Apply math and business concepts in a classic project',['Play lemonade stand materials','Simple ingredient cost chart','Play money'],['Discuss costs: lemons, sugar, cups, sign','Set a price','Simulate making and selling lemonade','Calculate: did you make money? Was it enough?'],['What did it cost to make lemonade?','How much did you charge?','Did you make a profit?'],'Business math, cost vs. revenue, profit concept, and real-world application',25,3)
];

const ENT_SCHOOL_AGE = [
  act('saent1','Business Plan Basics','Learn the core elements of a business plan',['Business plan template','Research materials'],['Define: What problem does your business solve?','Define: Who is your customer?','Define: What is your product or service?','Define: How will you make money? What will you charge?','Define: How will you tell people about it?'],['What problem does your business solve?','Who specifically will buy it?','How will you reach your customers?'],'Business planning, strategic thinking, and entrepreneurial framework',40,4),
  act('saent2','Pitch It!','Develop the ability to persuasively communicate a business idea',['Business idea cards','Timer for 60-second pitches'],['Teach: What is a pitch? Why does it matter?','Elements of a great pitch: problem, solution, why you, call to action','Practice 60-second pitches in pairs','Class votes on most persuasive pitch'],['What problem are you solving?','Why should someone choose YOUR solution?','What do you want your audience to do?'],'Public speaking, persuasion, communication, and entrepreneurial confidence',30,4),
  act('saent3','Market Research','Understand customers before building',['Survey template','Interview script','Graph paper for data'],['Create a 5-question survey about a problem','Survey at least 5 classmates','Analyze results: what do most people want?','Adjust business idea based on real data'],['What did customers say they actually need?','How did the data change your plan?','Why is knowing your customer important?'],'Research skills, data analysis, customer empathy, and evidence-based decisions',35,4),
  act('saent4','Product Design Challenge','Design, prototype, test, and improve a physical product',['Recyclable materials','Design journal','Tape, scissors, glue'],['Step 1: Identify the problem your product solves','Step 2: Sketch 3 different design ideas','Step 3: Build the best design with available materials','Step 4: Test it — does it work?','Step 5: Get feedback and improve it'],['What problem does your product solve?','How did testing change your design?','What would version 2 look like?'],'Design thinking, prototyping, iteration, engineering, and problem-solving',60,5),
  act('saent5','Community Problem Solver','Apply entrepreneurship to real community needs',['Community issue research materials','Presentation template'],['Research a real problem in your community or school','Design a solution (product, service, or campaign)','Create a presentation or prototype','Present to class or even to school leadership'],['What problem affects your community?','What is YOUR solution?','How would you get people to use it?'],'Civic entrepreneurship, community impact, leadership, and real-world problem-solving',60,5),
  act('saent6','Innovation vs. Invention','Understand the difference and practice both',['Existing product for improvement','Design journal'],['Explain: Invention = something new. Innovation = improving something existing','Examples: the phone → smartphone; horse → car → electric car','Task: pick any everyday object and design an improved version','Present improved design and explain the innovation'],['What already exists that you improved?','What problem does the improvement solve?','How is innovation different from invention?'],'Innovation mindset, creative thinking, and design improvement skills',25,3)
];

/* ══════════════════════════════════════════════
   SECTION 20 — CRITICAL THINKING ACTIVITIES
   ══════════════════════════════════════════════ */

const CT_TODDLERS = [
  act('tct1','Why Game','Develop the habit of asking why',['Any object or picture'],['Point to something and ask: "Why do you think that is there?"','Accept all answers warmly','Ask: "Why do you think THAT?"','Keep asking why 2-3 times deeper'],['Why do you think so?','What makes you say that?'],'Questioning, causal thinking, and intellectual curiosity',8,1),
  act('tct2','What Is Different?','Develop visual discrimination and analytical thinking',['Two similar but slightly different pictures or objects'],['Show both pictures side by side','Ask: "What is different between these two?"','Look carefully together: "I see something you might have missed!"','Count all the differences found'],['What do you see that is different?','Are you sure? Look again!','How many differences did we find?'],'Analytical observation, attention to detail, and critical comparison',10,1)
];

const CT_PRESCHOOL = [
  act('pct1','Fact or Opinion?','Introduce one of the most important critical thinking skills',['Statement cards: some facts, some opinions'],['Explain: "A fact can be proven. An opinion is what someone thinks or feels."','Read each statement card','Children vote: fact or opinion?','Explain the reasoning for each answer'],['Can we check if this is true?','Is this something everyone agrees on?','What is the difference between what IS true and what someone THINKS?'],'Fact vs. opinion, evidence-based thinking, and intellectual honesty',15,2),
  act('pct2','Evidence Hunt','Practice supporting claims with evidence',['Science observation cards','Magnifying glasses'],['Make a claim: "I think the rock is heavier than the ball"','Ask: "How can we find out? What evidence would prove this?"','Test and collect evidence','Report: "Our evidence shows..."'],['How do we know?','What is the evidence?','What would prove you are right?'],'Evidence gathering, scientific thinking, and claim-evidence reasoning',20,2),
  act('pct3','Think Before You Agree','Practice independent thinking and questioning authority',['Statement cards with statements to question'],['Read a statement: "Everyone likes chocolate ice cream"','Ask: "Is this true? How do we know? Should we just believe it?"','Encourage respectful disagreement: "I disagree because..."','Celebrate independent thinking: "Great question! You thought for yourself!"'],['Is that really true?','Does everyone agree?','What do YOU think — not what someone told you to think?'],'Independent thinking, skepticism, questioning, and intellectual courage',12,2),
  act('pct4','Cause & Effect Thinking','Understand that actions have consequences',['Cause-effect picture sequence cards'],['Show a cause: "The child left their bike in the rain"','Ask: "What might happen next? What is the effect?"','Chain it further: "And then what happens?"','Role-play: "If you do X, what happens?"'],['What caused that?','What will happen because of this?','What could you do differently to get a better result?'],'Causal reasoning, consequence thinking, and decision-making through prediction',15,2)
];

const CT_SCHOOL_AGE = [
  act('sact1','Socratic Seminar','Develop deep reasoning and respectful intellectual discourse',['Thought-provoking text or question'],['Present a challenging question: "Is it ever right to break a rule?"','Students prepare by writing their initial position','Conduct structured discussion: speak with evidence, respond to peers','No raised hands — students build on each other organically'],['What is your position and why?','What evidence supports your view?','How do you respond to what your classmate just said?','Has anyone changed their mind? Why?'],'Critical discourse, evidence-based reasoning, listening, and intellectual humility',30,5),
  act('sact2','Media Literacy Analysis','Evaluate information sources critically',['Two articles on the same topic from different sources'],['Read both articles on the same topic','Identify: author, source, date, evidence provided','Compare: what do they agree on? What do they disagree on?','Evaluate: which seems more credible? Why?'],['What is the author trying to persuade you of?','What evidence do they provide?','What might they be leaving out?','Would you trust this source? Why or why not?'],'Media literacy, source evaluation, bias recognition, and informed thinking',25,4),
  act('sact3','Logical Fallacy Detectives','Identify flawed reasoning in everyday arguments',['Fallacy examples cards: strawman, ad hominem, slippery slope, etc.'],['Teach 3-4 common fallacies with examples','Read sample arguments','Students identify the fallacy used','Discuss: "Why is this reasoning flawed?"'],['What is wrong with this argument?','Is the conclusion really supported by the evidence?','What would a stronger argument look like?'],'Logical reasoning, argument analysis, and intellectual rigor',25,5),
  act('sact4','Devil\'s Advocate','Practice seeing all sides of an issue',['Controversial topic appropriate for age'],['Present a topic','Assign students to argue for a position they personally disagree with','Students research and prepare arguments for that side','Debrief: "Did arguing the other side teach you anything?"'],['What is the strongest argument for the other side?','Can you understand why people believe that?','Did this change how you think about the issue?'],'Perspective-taking, empathy, intellectual flexibility, and argumentation',30,4),
  act('sact5','Question Everything','Practice asking increasingly deeper questions',['Any interesting text or phenomenon'],['Read or observe something together','Students write one question per level: surface, deeper, deepest','Share the deepest questions','Vote on the most interesting question to explore'],['What do you want to know more about?','Why does that matter?','What deeper question is hiding underneath?'],'Inquiry skills, intellectual curiosity, and question generation',20,3)
];

/* ══════════════════════════════════════════════
   SECTION 21 — INNOVATION & DESIGN ACTIVITIES
   ══════════════════════════════════════════════ */

const INV_TODDLERS = [
  act('tinv1','Build It Better','First introduction to improvement through iteration',['Blocks','One already-built simple structure'],['Show a simple block structure','Ask: "Can we make it taller? More stable? More colorful?"','Let children modify it','Ask: "Is it better now? Why?"'],['How did you improve it?','What could we do to make it even better?'],'Improvement mindset, building skills, and iterative thinking',10,1)
];

const INV_PRESCHOOL = [
  act('pinv1','Design Thinking Introduction','Learn the design thinking process through experience',['Paper','Drawing supplies','Simple materials'],['Step 1 — Empathize: "What problem does someone you know have?"','Step 2 — Define: "What exactly is the problem?"','Step 3 — Ideate: Draw 3 possible solutions','Step 4 — Prototype: Build the best idea','Step 5 — Test: Does it work?'],['What is the problem?','Who has this problem?','What is your best idea to solve it?','How do you know if it worked?'],'Design thinking, empathy, creativity, and structured problem-solving',30,3),
  act('pinv2','Upcycle Challenge','Create something new and useful from something old',['Used cardboard boxes, tubes, containers','Tape, glue, markers'],['Show collection of "trash" materials','Challenge: "Can you turn trash into treasure?"','Children design and build freely','Share creations and explain what they made'],['What did you create from the materials?','How did you decide what to make?','What new use did you find for old things?'],'Resourcefulness, creativity, environmental thinking, and innovation mindset',25,2),
  act('pinv3','STEAM Challenge','Apply multiple disciplines to one creative challenge',['Mixed materials: building blocks, art supplies, simple tools'],['Present challenge: "Build a bridge that can hold 5 books"','Children plan: draw their design first','Build using available materials','Test, evaluate, rebuild'],['What was your plan?','What did not work?','How did you change your design?'],'STEAM integration, engineering process, resilience, and collaborative problem-solving',30,3)
];

const INV_SCHOOL_AGE = [
  act('sainv1','Rapid Prototyping','Build, test, and improve ideas quickly',['Varied materials','Timer for 20-minute build'],['Present challenge: solve a specific simple problem','20 minutes to build any solution','Test it immediately','Improve it in 10 more minutes — what changed?'],['What did you learn from testing?','What was your biggest mistake?','How did version 2 improve on version 1?'],'Rapid iteration, failure tolerance, learning from mistakes, and design thinking',40,4),
  act('sainv2','Biomimicry Lab','Discover how nature inspires innovation',['Nature images and objects','Research on biomimicry inventions'],['Learn: Velcro was inspired by burdock seeds. Bullet trains by kingfisher beaks.','Observe nature images: "How does this solve a problem?"','Challenge: design something inspired by nature to solve a human problem','Present inventions to class'],['What problem in nature does this organism solve?','How could humans use the same approach?','What would your nature-inspired invention look like?'],'Observation, analogical thinking, scientific inquiry, and creative innovation',35,4),
  act('sainv3','Future City Design','Design a better, more sustainable future community',['Large paper','Drawing supplies','Research on smart cities, sustainability'],['Research: "What problems do cities have today?"','Groups design a future city that solves those problems','Include: energy, transportation, food, community, technology','Present and defend the design choices'],['What problem did your city design solve?','How did you balance different needs?','What makes your city better than today\'s cities?'],'Systems thinking, urban design, sustainability, innovation, and collaboration',60,5),
  act('sainv4','Technology Ethics','Examine both the power and responsibility of innovation',['Case studies of technology with positive and negative impacts'],['Study a technology: social media, AI, smartphones','Explore the benefits: "How does it help people?"','Explore the risks: "What problems has it created?"','Debate: "How should we use this technology responsibly?"'],['What are the benefits of this technology?','What are the unintended consequences?','How should society govern this technology?'],'Technology ethics, critical thinking, systems thinking, and responsible innovation',30,4)
];

/* ══════════════════════════════════════════════
   SECTION 22 — LEADERSHIP ACTIVITIES
   ══════════════════════════════════════════════ */

const LEAD_TODDLERS = [
  act('tlead1','Line Leader Pride','Introduce leadership as a role with responsibility',['Line leader badge or crown'],['Select line leader for the day with ceremony','Explain: "The line leader helps keep everyone safe and together"','Line leader leads the class transition','Reflect: "How did it feel to be the leader?"'],['How does a good leader help the group?'],'Leadership responsibility, role awareness, and community contribution',5,1),
  act('tlead2','Decision Maker','Practice making simple group decisions',['Two options to choose from for the whole class'],['Present two choices for the class: "Should we play blocks or paint?"','Children vote','Leader announces the decision','All respect the group decision'],['How did it feel to vote?','What if your choice did not win?','Why do we respect group decisions?'],'Democratic process, leadership, community, and respecting others\' choices',8,1)
];

const LEAD_PRESCHOOL = [
  act('plead1','Class Captain Responsibilities','Experience leadership through real classroom responsibility',['Captain chart with daily duties'],['Rotate Captain role weekly','Captain duties: lead morning circle, be first line leader, announce lunch, help newcomers','Brief class on Captain\'s role at start of each week','Captain gives a short end-of-week report'],['What did you do as captain?','How did you help your classmates?','What was hardest about being a leader?'],'Leadership practice, responsibility, public speaking, and community service',5,2),
  act('plead2','Team Builder Games','Develop leadership through cooperative challenges',['Teamwork games: human knot, group puzzle, carry the ball together'],['Explain: "Great leaders help their TEAM succeed, not just themselves"','Play cooperative challenge where everyone must contribute','Identify natural leadership behaviors during play','Debrief: "Who helped the team? What did they do?"'],['What did the leader do that helped?','When did someone else help lead?','How can everyone be a leader in different ways?'],'Teamwork, shared leadership, communication, and cooperative problem-solving',20,2),
  act('plead3','Speak Up, Stand Up','Develop the courage to speak one\'s mind respectfully',['Discussion circle'],['Present a situation where the right thing is unpopular: "Everyone is leaving out a classmate. Do you say something?"','Discuss: "What would YOU do?"','Practice speaking up with kind, assertive words','Celebrate courage: "That took bravery!"'],['What did you say to help?','Why is it hard to speak up?','What happens when no one speaks up?'],'Courage, advocacy, assertiveness, and leadership under social pressure',15,3),
  act('plead4','Goal Setting Workshop','Learn to set and pursue personal goals',['Goal planning sheet','Star stickers for milestone celebrations'],['Discuss: "What do you want to get better at?"','Set one S.M.A.R.T. goal: specific, measurable, achievable, relevant, time-bound','Plan how to reach it: what steps?','Check in weekly and celebrate progress'],['What is your goal?','What is your first step?','How will you know when you reach it?'],'Goal setting, self-direction, planning, and growth mindset',15,2)
];

const LEAD_SCHOOL_AGE = [
  act('salead1','Leadership Styles Workshop','Understand different leadership styles and when to use each',['Leadership style cards: democratic, servant, visionary, coaching'],['Explore 4 leadership styles with real examples','Identify a leader who used each style','Discuss: "Is one style always best? When would you use each?"','Identify your own natural leadership style'],['What style do you naturally use?','When would servant leadership be best?','Can you use different styles in different situations?'],'Leadership self-awareness, flexibility, and understanding of leadership diversity',25,4),
  act('salead2','Mentor a Younger Child','Develop leadership through real responsibility for others',['Paired activity with younger student'],['Match each older child with a younger buddy','Older child teaches the younger one something they know well','Plan: what will you teach? How will you explain it?','Reflect: what did you learn about leading by teaching?'],['How did you explain it so they could understand?','What did you learn from teaching?','How does being responsible for someone else change how you act?'],'Mentorship, leadership through teaching, responsibility, and empathy',30,3),
  act('salead3','Run a Meeting','Practice the real skills of running an effective meeting',['Meeting agenda template','Role assignments: facilitator, note-taker, timekeeper'],['Students plan and run a real class meeting','Agenda: welcome, updates, discussion topic, decisions, close','Rotate roles','Debrief: what made the meeting effective? What could be better?'],['How did the facilitator keep the meeting on track?','Was everyone heard?','What decisions did the group make?'],'Facilitation, meeting management, decision-making, and professional communication',30,4),
  act('salead4','Personal Mission Statement','Define your values, strengths, and purpose',['Mission statement template','Reflection questions'],['Explore: "What do you value most? What are your strengths?"','Identify: "What do you want to contribute to the world?"','Draft a personal mission statement: 2-3 sentences','Share with a trusted partner for reflection'],['What do you stand for?','What unique strengths do you bring?','What do you want to be known for?'],'Identity, values clarification, purpose, and leadership foundation',25,4),
  act('salead5','Change Maker Project','Lead a real positive change in school or community',['Project planning template','Presentation materials'],['Identify: "What needs to change in our school or community?"','Plan: Who needs to be involved? What steps are required?','Execute: lead the project with a small team','Present: share the change made and lessons learned'],['What change did you make?','Who did it help?','What would you do differently?'],'Leadership in action, civic engagement, systems change, and real-world impact',120,5)
];

/* ══════════════════════════════════════════════
   SECTION 23 — MERGE EXTENDED ACTIVITIES INTO LIBRARY
   ══════════════════════════════════════════════ */

(function mergeExtendedActivities() {
  const merge = (ageKey, catId, acts) => {
    if (!ACTIVITY_LIBRARY[ageKey]) ACTIVITY_LIBRARY[ageKey] = {};
    if (!ACTIVITY_LIBRARY[ageKey][catId]) ACTIVITY_LIBRARY[ageKey][catId] = [];
    ACTIVITY_LIBRARY[ageKey][catId].push(...acts);
  };

  // Financial Literacy
  merge('infants',    'financial_literacy', FL_INFANTS);
  merge('toddlers',   'financial_literacy', FL_TODDLERS);
  merge('preschool',  'financial_literacy', FL_PRESCHOOL);
  merge('school_age', 'financial_literacy', FL_SCHOOL_AGE);

  // Entrepreneurship
  merge('toddlers',   'entrepreneurship', ENT_TODDLERS);
  merge('preschool',  'entrepreneurship', ENT_PRESCHOOL);
  merge('school_age', 'entrepreneurship', ENT_SCHOOL_AGE);

  // Critical Thinking
  merge('toddlers',   'critical_thinking', CT_TODDLERS);
  merge('preschool',  'critical_thinking', CT_PRESCHOOL);
  merge('school_age', 'critical_thinking', CT_SCHOOL_AGE);

  // Innovation
  merge('toddlers',   'innovation', INV_TODDLERS);
  merge('preschool',  'innovation', INV_PRESCHOOL);
  merge('school_age', 'innovation', INV_SCHOOL_AGE);

  // Leadership
  merge('toddlers',   'leadership', LEAD_TODDLERS);
  merge('preschool',  'leadership', LEAD_PRESCHOOL);
  merge('school_age', 'leadership', LEAD_SCHOOL_AGE);
})();

/* ══════════════════════════════════════════════
   SECTION 24 — EXTENDED MILESTONES
   ══════════════════════════════════════════════ */

(function mergeExtendedMilestones() {
  const ext = {
    toddlers: {
      financial_literacy: [{id:'tflm1',skill:'Understands needs vs. wants with examples'},{id:'tflm2',skill:'Practices saving coins in a container'},{id:'tflm3',skill:'Can name at least 2 things that cost money'}],
      entrepreneurship:   [{id:'tentm1',skill:'Can identify a simple problem to solve'},{id:'tentm2',skill:'Creates a product to share or trade'}],
      critical_thinking:  [{id:'tctm1',skill:'Asks "why" questions regularly'},{id:'tctm2',skill:'Notices differences between two things'}],
      innovation:         [{id:'tinvm1',skill:'Tries to improve or change what they build'}],
      leadership:         [{id:'tleadm1',skill:'Takes turns being leader without conflict'},{id:'tleadm2',skill:'Makes a group decision and respects the outcome'}]
    },
    preschool: {
      financial_literacy: [{id:'pflm1',skill:'Sorts needs vs. wants correctly'},{id:'pflm2',skill:'Understands saving means keeping money for later'},{id:'pflm3',skill:'Has experienced earning and spending with play money'},{id:'pflm4',skill:'Can describe what delayed gratification means'}],
      entrepreneurship:   [{id:'pentm1',skill:'Can identify a problem and suggest a solution'},{id:'pentm2',skill:'Has created and "sold" a product in classroom market'},{id:'pentm3',skill:'Understands basic customer service means helping and being kind'}],
      critical_thinking:  [{id:'pctm1',skill:'Distinguishes facts from opinions'},{id:'pctm2',skill:'Asks evidence-based questions'},{id:'pctm3',skill:'Can respectfully disagree with a reason'}],
      innovation:         [{id:'pinvm1',skill:'Completes full design-build-test cycle'},{id:'pinvm2',skill:'Improves a prototype after testing'}],
      leadership:         [{id:'pleadm1',skill:'Leads morning circle with confidence'},{id:'pleadm2',skill:'Sets and tracks a personal goal'},{id:'pleadm3',skill:'Speaks up respectfully when something is unfair'}]
    },
    school_age: {
      financial_literacy: [{id:'saflm1',skill:'Creates a basic budget with income and expenses'},{id:'saflm2',skill:'Understands interest and how savings grow over time'},{id:'saflm3',skill:'Has completed an entrepreneurship project with pricing and profit'},{id:'saflm4',skill:'Connects personal values to financial decisions'}],
      entrepreneurship:   [{id:'saentm1',skill:'Can write a basic business plan'},{id:'saentm2',skill:'Has delivered a persuasive 60-second pitch'},{id:'saentm3',skill:'Conducted market research and adjusted idea based on data'},{id:'saentm4',skill:'Designed, built, and presented a prototype'}],
      critical_thinking:  [{id:'sactm1',skill:'Participates meaningfully in Socratic seminars'},{id:'sactm2',skill:'Can evaluate sources for credibility and bias'},{id:'sactm3',skill:'Identifies logical fallacies in arguments'},{id:'sactm4',skill:'Argues multiple sides of a complex issue'}],
      innovation:         [{id:'sainvm1',skill:'Applies full design thinking process'},{id:'sainvm2',skill:'Uses biomimicry or analogical thinking to innovate'},{id:'sainvm3',skill:'Understands technology ethics and responsible use'}],
      leadership:         [{id:'saleadm1',skill:'Understands and applies different leadership styles'},{id:'saleadm2',skill:'Has mentored a younger child successfully'},{id:'saleadm3',skill:'Has run an effective group meeting as facilitator'},{id:'saleadm4',skill:'Written and shared a personal mission statement'},{id:'saleadm5',skill:'Led a real positive change project in school or community'}]
    }
  };

  Object.entries(ext).forEach(([ageKey, cats]) => {
    if (!MILESTONES_DB[ageKey]) MILESTONES_DB[ageKey] = {};
    Object.entries(cats).forEach(([catId, milestones]) => {
      if (!MILESTONES_DB[ageKey][catId]) MILESTONES_DB[ageKey][catId] = [];
      MILESTONES_DB[ageKey][catId].push(...milestones);
    });
  });
})();

/* ══════════════════════════════════════════════
   SECTION 25 — SUCCESS METRICS SYSTEM
   Non-academic success tracking:
   Creativity, Leadership, Initiative, Problem-Solving,
   Communication, Emotional Regulation, Resilience,
   Financial Understanding, Practical Life Skills
   ══════════════════════════════════════════════ */

const SUCCESS_METRICS = [
  { id: 'creativity',          label: 'Creativity',                icon: '&#127912;', color: '#C8760A',
    desc: 'Generates original ideas; approaches problems in novel ways; expresses themselves through art, music, building, or storytelling.' },
  { id: 'leadership',          label: 'Leadership',                icon: '&#11088;',  color: '#8B4AB8',
    desc: 'Takes initiative; motivates and guides peers; accepts responsibility; shows courage in difficult situations.' },
  { id: 'initiative',          label: 'Initiative',                icon: '&#128640;', color: '#2E8B57',
    desc: 'Starts tasks without being told; volunteers; identifies what needs to be done and does it.' },
  { id: 'problem_solving',     label: 'Problem-Solving',           icon: '&#129504;', color: '#4A5EC4',
    desc: 'Faces challenges without giving up; tries multiple strategies; asks for help when appropriate; learns from failure.' },
  { id: 'communication',       label: 'Communication',             icon: '&#128172;', color: '#2ABFB8',
    desc: 'Expresses ideas clearly; listens actively; adjusts communication style for audience; resolves conflicts through talking.' },
  { id: 'emotional_regulation',label: 'Emotional Regulation',      icon: '&#10084;',  color: '#E86B6B',
    desc: 'Manages strong emotions; uses coping strategies; recovers from disappointment; shows empathy for others.' },
  { id: 'resilience',          label: 'Resilience',                icon: '&#127807;', color: '#4A9E4A',
    desc: 'Bounces back from setbacks; maintains positive attitude under challenge; does not give up easily; grows from mistakes.' },
  { id: 'financial_understanding', label: 'Financial Understanding', icon: '&#128176;', color: '#2E8B57',
    desc: 'Understands needs vs. wants; saving concepts; basic money math; value creation; age-appropriate business concepts.' },
  { id: 'practical_skills',    label: 'Practical Life Skills',     icon: '&#127968;', color: '#B87828',
    desc: 'Manages belongings and time; completes responsibilities independently; applies knowledge to real-world situations.' }
];

const SM_LEVELS = ['Not Yet', 'Beginning', 'Developing', 'Consistent', 'Exceptional'];
const SM_LEVELS_ES = ['Aun no', 'Iniciando', 'En desarrollo', 'Consistente', 'Excepcional'];
function smLabel(l) { const i = SM_LEVELS.indexOf(l); return typeof LANG !== 'undefined' && LANG === 'es' && i >= 0 ? SM_LEVELS_ES[i] : l; }
const SM_COLORS = ['#DDD', '#F7C4C4', '#FFE08A', '#A8D8A8', '#4ECDC4'];

function getSuccessMetrics(childId) {
  if (!DB.curriculum.successMetrics) DB.curriculum.successMetrics = [];
  return DB.curriculum.successMetrics.filter(m => m.childId === childId);
}

function saveSuccessMetric(childId, metricId, level, note) {
  if (!DB.curriculum.successMetrics) DB.curriculum.successMetrics = [];
  const existing = DB.curriculum.successMetrics.find(m => m.childId === childId && m.metricId === metricId);
  const entry = { childId, metricId, level, note: note || '', date: getTodayDate(), teacherId: CU ? CU.id : '' };
  if (existing) Object.assign(existing, entry);
  else DB.curriculum.successMetrics.push({ id: typeof uid === 'function' ? uid() : 'sm_' + Date.now(), ...entry });
  saveDB();
  renderPortal();
}

function successMetricsView(childId, canEdit) {
  const child = DB.children.find(c => c.id === childId);
  const metrics = getSuccessMetrics(childId);
  let h = `<div class="card" style="margin-bottom:14px">
    <p class="lead" style="margin-bottom:6px">&#11088; ${t('Success Metrics','Metricas de Exito')} — ${child ? esc(child.name) : ''}
      <span class="soft" style="font-size:.78rem;font-weight:400"> — ${t('Beyond Academic Performance','Mas Alla del Rendimiento Academico')}</span>
    </p>
    <p style="font-size:.82rem;color:var(--muted);margin:0 0 14px">${t('We measure success through creativity, leadership, resilience, and character — not just academic scores.','Medimos el exito en creatividad, liderazgo, resiliencia y caracter, no solo en calificaciones.')}</p>`;
  SUCCESS_METRICS.forEach(m => {
    const tracked = metrics.find(x => x.metricId === m.id);
    const lvl = tracked ? tracked.level : null;
    const lvlIdx = lvl ? SM_LEVELS.indexOf(lvl) : -1;
    h += `<div style="margin-bottom:14px;padding:10px 14px;border-radius:14px;background:#FAFAF8;border:1.5px solid #EAE2DA">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
        <span style="font-size:1.1rem">${m.icon}</span>
        <b style="color:var(--night);font-size:.95rem">${esc(m.label)}</b>
        ${lvl ? `<span style="margin-left:auto;padding:2px 10px;border-radius:20px;font-size:.7rem;font-weight:700;background:${SM_COLORS[SM_LEVELS.indexOf(lvl)]};color:#333">${esc(lvl)}</span>` : ''}
      </div>
      <p style="font-size:.78rem;color:var(--muted);margin:0 0 8px">${esc(m.desc)}</p>`;
    if (canEdit) {
      h += `<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px">
        ${SM_LEVELS.map((l, i) =>
          `<button class="mini-btn" style="font-size:.7rem;padding:3px 8px;background:${l===lvl?SM_COLORS[i]:'#F5F5F5'};border-color:${l===lvl?'#999':'#DDD'};color:${l===lvl?'#333':'#AAA'}"
            onclick="saveSuccessMetric('${childId}','${m.id}','${l}')">${esc(smLabel(l))}</button>`
        ).join('')}
      </div>`;
      h += `<input style="width:100%;font-size:.78rem;border:1.5px solid #EAE2DA;border-radius:8px;padding:6px 10px"
        placeholder="${t('Observation notes (optional)...','Notas de observacion (opcional)...')}"
        value="${esc(tracked && tracked.note ? tracked.note : '')}"
        onchange="(function(el){const t=DB.curriculum.successMetrics.find(x=>x.childId==='${childId}'&&x.metricId==='${m.id}');if(t)t.note=el.value;saveDB();})(this)">`;
    } else {
      h += `<div style="display:flex;gap:4px;flex-wrap:wrap">
        ${SM_LEVELS.map((l, i) =>
          `<span style="padding:2px 10px;border-radius:20px;font-size:.7rem;font-weight:700;background:${l===lvl?SM_COLORS[i]:'#F5F5F5'};color:${l===lvl?'#333':'#AAA'}">${esc(smLabel(l))}</span>`
        ).join('')}
      </div>`;
      if (tracked && tracked.note) {
        h += `<p style="font-size:.78rem;color:var(--ink);margin:6px 0 0;font-style:italic">"${esc(tracked.note)}"</p>`;
      }
    }
    h += `</div>`;
  });
  h += `</div>`;
  return h;
}

/* ══════════════════════════════════════════════
   SECTION 26 — WEEKLY & MONTHLY LEARNING PATHWAYS
   ══════════════════════════════════════════════ */

const MONTHLY_PATHWAYS = [
  {
    month: 'September', theme: 'All About Me & My Community',
    focus: 'Identity, belonging, classroom community, rules, and friendships',
    domains: ['social', 'language', 'character', 'leadership'],
    highlights: ['Name and identity activities', 'Classroom rules co-creation', 'First friendships', 'Personal goal-setting introduction']
  },
  {
    month: 'October', theme: 'Curiosity & Exploration',
    focus: 'Science, nature, questions, investigation, and discovery',
    domains: ['cognitive', 'critical_thinking', 'language', 'physical'],
    highlights: ['Nature walks and observation journals', 'Simple science experiments', 'Asking big questions', 'Fall season exploration']
  },
  {
    month: 'November', theme: 'Gratitude & Giving',
    focus: 'Gratitude, generosity, financial giving, community service',
    domains: ['character', 'financial_literacy', 'social', 'life_skills'],
    highlights: ['Daily gratitude practice', 'Earn-Save-Give introduction', 'Community helper project', 'Thankfulness storytelling']
  },
  {
    month: 'December', theme: 'Creativity & Innovation',
    focus: 'Art, music, invention, creative problem-solving, cultural celebrations',
    domains: ['creativity', 'innovation', 'language', 'social'],
    highlights: ['Holiday traditions from around the world', 'Original art creation', 'Mini invention challenge', 'Musical performance']
  },
  {
    month: 'January', theme: 'Goals & Growth',
    focus: 'New beginnings, goal-setting, growth mindset, personal development',
    domains: ['leadership', 'character', 'life_skills', 'resilience'],
    highlights: ['Personal goal-setting workshop', 'Growth mindset lessons', 'New skills challenges', 'Reflection on the past year']
  },
  {
    month: 'February', theme: 'Relationships & Kindness',
    focus: 'Empathy, friendship, conflict resolution, emotional intelligence',
    domains: ['social', 'character', 'leadership', 'critical_thinking'],
    highlights: ['Kindness campaigns', 'Peer conflict resolution practice', 'Empathy perspective activities', 'Community service']
  },
  {
    month: 'March', theme: 'Entrepreneurship & Problem-Solving',
    focus: 'Identify problems, create solutions, business basics, market day',
    domains: ['entrepreneurship', 'financial_literacy', 'critical_thinking', 'innovation'],
    highlights: ['Problem identification walk', 'Mini business projects', 'Market day', 'Pitch competition (school-age)']
  },
  {
    month: 'April', theme: 'Earth, Science & Sustainability',
    focus: 'Environment, ecology, sustainable thinking, STEM investigation',
    domains: ['cognitive', 'innovation', 'character', 'physical'],
    highlights: ['Earth Day projects', 'Sustainability design challenges', 'Gardening and plant care', 'Recycled art projects']
  },
  {
    month: 'May', theme: 'Leadership & Community Impact',
    focus: 'Student leadership, community projects, public speaking, civic engagement',
    domains: ['leadership', 'entrepreneurship', 'language', 'character'],
    highlights: ['Student-led class sessions', 'Community impact projects', 'Public speaking practice', 'Peer mentoring (school-age)']
  },
  {
    month: 'June', theme: 'Celebration & Reflection',
    focus: 'Celebrate growth, reflect on learning, set summer goals, transition preparation',
    domains: ['social', 'character', 'life_skills', 'leadership'],
    highlights: ['Portfolio review and reflection', 'Sharing personal growth with families', 'Summer learning goal-setting', 'Transition preparation for next year']
  }
];

function monthlyPathwayView() {
  const currentMonth = new Date().toLocaleString('en-US', {month: 'long'});
  let h = `<div class="card" style="margin-bottom:14px">
    <p class="lead">&#128197; ${t('Monthly Learning Pathways','Rutas de Aprendizaje Mensual')}</p>
    <p style="font-size:.85rem;color:var(--muted);margin:0">${t('A 10-month learning journey building whole-child development.','Un recorrido de aprendizaje de 10 meses para el desarrollo integral del nino.')}</p>
  </div>`;
  MONTHLY_PATHWAYS.forEach(mp => {
    const isCurrent = mp.month === currentMonth;
    h += `<div class="card" style="margin-bottom:10px;border-left:5px solid ${isCurrent?'var(--gold)':'#EAE2DA'}">
      <div style="display:flex;align-items:flex-start;gap:8px;flex-wrap:wrap;margin-bottom:6px">
        <b style="color:var(--night)">${esc(mp.month)}</b>
        ${isCurrent ? `<span class="tag" style="background:var(--gold);color:#fff">${t('Current Month','Mes Actual')}</span>` : ''}
      </div>
      <p style="font-weight:700;color:var(--ink);margin:0 0 4px">${esc(mp.theme)}</p>
      <p style="font-size:.82rem;color:var(--muted);margin:0 0 8px">${esc(mp.focus)}</p>
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px">
        ${mp.domains.map(d => {
          const cat = CURR_CATS.find(c => c.id === d);
          return cat ? `<span style="background:${cat.color}20;color:${cat.color};border-radius:20px;padding:2px 10px;font-size:.7rem;font-weight:700">${cat.icon} ${esc(cat.label)}</span>` : '';
        }).join('')}
      </div>
      <details>
        <summary style="cursor:pointer;font-size:.82rem;color:var(--teal);font-weight:700">&#128197; ${t('Monthly Highlights','Puntos Destacados del Mes')}</summary>
        <ul style="margin:8px 0 0 18px;padding:0;font-size:.82rem">
          ${mp.highlights.map(h => `<li style="margin-bottom:3px">${esc(h)}</li>`).join('')}
        </ul>
      </details>
    </div>`;
  });
  return h;
}

/* ══════════════════════════════════════════════
   SECTION 27 — PARENT LEARNING SUMMARY REPORT
   ══════════════════════════════════════════════ */

function parentLearningReport(childId, date) {
  const child = DB.children.find(c => c.id === childId);
  if (!child) return '';
  const ageKey = getChildAgeKey(childId);
  const plan = getPlan(child.classId, date);
  const note = getTeacherNote(childId, date);
  const progress = getChildProgress(childId);
  const smMetrics = getSuccessMetrics(childId);

  let h = `<div class="card t-gold" style="margin-bottom:14px">
    <h3 style="margin:0 0 4px">&#127775; ${esc(child.name)} — ${t('Learning Report','Reporte de Aprendizaje')}</h3>
    <p class="soft" style="font-size:.83rem;margin:0">${esc(date ? new Date(date + 'T00:00').toLocaleDateString('en-US', {weekday:'long',month:'long',day:'numeric',year:'numeric'}) : 'Today')}</p>
  </div>`;

  // Today's completed activities
  if (plan) {
    const done = plan.activities.filter(a => a.status === 'completed' || a.status === 'partial');
    if (done.length) {
      h += `<div class="card" style="margin-bottom:10px">
        <p class="lead" style="margin-bottom:8px">&#127919; ${t('What We Did Today','Lo Que Hicimos Hoy')}</p>`;
      done.forEach(entry => {
        const catInfo = CURR_CATS.find(c => c.id === entry.catId);
        const actPool = (ACTIVITY_LIBRARY[ageKey] || {})[entry.catId] || [];
        const a = actPool.find(x => x.id === entry.activityId);
        if (!a) return;
        h += `<div style="margin-bottom:10px;padding:10px;border-radius:10px;background:#F8F8F8;border:1.5px solid #EAE2DA">
          <div style="display:flex;gap:6px;align-items:center;margin-bottom:4px">
            ${catInfo ? `<span style="color:${catInfo.color};font-size:1rem">${catInfo.icon}</span><b style="font-size:.9rem;color:var(--night)">${esc(catInfo.label)}</b>` : ''}
            <span class="tag ${entry.status==='completed'?'paid':'unpaid'}" style="margin-left:auto">${entry.status==='completed'?'&#9989; '+t('Done','Listo'):'&#9888; '+t('Partial','Parcial')}</span>
          </div>
          <b style="font-size:.95rem;color:var(--ink)">${esc(a.title)}</b>
          <p style="font-size:.82rem;color:var(--muted);margin:2px 0 0">${t('Skills built:','Habilidades desarrolladas:')} ${esc(a.benefits)}</p>
          ${entry.notes ? `<p style="font-size:.8rem;font-style:italic;color:var(--ink);margin:4px 0 0">${t('Teacher note:','Nota del maestro:')} ${esc(entry.notes)}</p>` : ''}
        </div>`;
      });
      h += `</div>`;
    }
  }

  // Teacher notes
  if (note) {
    h += `<div class="card t-teal" style="margin-bottom:10px">
      <p class="lead" style="margin-bottom:8px">&#128203; ${t("Teacher's Observations","Observaciones del Maestro")}</p>
      ${note.strengths ? `<div style="margin-bottom:8px"><b>&#11088; ${t('What','Lo que')} ${esc(child.name.split(' ')[0])} ${t('did well:','hizo bien:')}</b><p style="font-size:.88rem;margin:2px 0 0">${esc(note.strengths)}</p></div>` : ''}
      ${note.moments  ? `<div style="margin-bottom:8px"><b>&#128149; ${t('A special moment today:','Un momento especial hoy:')}</b><p style="font-size:.88rem;margin:2px 0 0">${esc(note.moments)}</p></div>` : ''}
      ${note.areas    ? `<div style="margin-bottom:8px"><b>&#127919; ${t('Where we are supporting growth:','Donde estamos apoyando el crecimiento:')}</b><p style="font-size:.88rem;margin:2px 0 0">${esc(note.areas)}</p></div>` : ''}
      ${note.recs     ? `<div><b>&#127968; ${t('Try at home tonight:','Para practicar en casa esta noche:')}</b><p style="font-size:.88rem;margin:2px 0 0">${esc(note.recs)}</p></div>` : ''}
    </div>`;
  }

  // Success Metrics snapshot
  if (smMetrics.length) {
    h += `<div class="card" style="margin-bottom:10px">
      <p class="lead" style="margin-bottom:8px">&#11088; ${t("Growth Areas We're Tracking","Areas de Crecimiento que Seguimos")}</p>`;
    smMetrics.slice(0, 4).forEach(sm => {
      const metric = SUCCESS_METRICS.find(m => m.id === sm.metricId);
      if (!metric) return;
      h += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;padding:6px 10px;border-radius:10px;background:#F8F8F8">
        <span>${metric.icon}</span>
        <span style="font-size:.85rem;font-weight:700;flex:1">${esc(metric.label)}</span>
        <span style="padding:2px 10px;border-radius:20px;font-size:.7rem;font-weight:700;background:${SM_COLORS[SM_LEVELS.indexOf(sm.level)]||'#EEE'};color:#333">${esc(sm.level)}</span>
      </div>`;
    });
    h += `</div>`;
  }

  // Development progress summary
  const avgProgress = Math.round(Object.values(progress).reduce((s, v) => s + v, 0) / Math.max(Object.keys(progress).length, 1));
  h += `<div class="card" style="margin-bottom:10px">
    <p class="lead" style="margin-bottom:8px">&#128202; ${t('Overall Development Progress','Progreso General del Desarrollo')}</p>
    <div style="background:#EAE2DA;border-radius:999px;height:18px;overflow:hidden;margin-bottom:8px">
      <div style="background:var(--teal);width:${avgProgress}%;height:100%;border-radius:999px;transition:width .5s;display:flex;align-items:center;justify-content:center">
        ${avgProgress > 20 ? `<span style="color:#fff;font-size:.7rem;font-weight:700">${avgProgress}%</span>` : ''}
      </div>
    </div>
    <p style="font-size:.8rem;color:var(--muted);margin:0;text-align:center">${t('Based on developmental milestones assessed by','Basado en hitos del desarrollo evaluados por el maestro de')} ${esc(child.name.split(' ')[0])}</p>
  </div>`;

  return h;
}

/* ══════════════════════════════════════════════
   SECTION 28 — EXTEND initCurriculumDB WITH NEW FIELDS
   ══════════════════════════════════════════════ */

(function() {
  var _prev28 = initCurriculumDB;
  initCurriculumDB = function() {
    _prev28();
    if (!DB || !DB.curriculum) return;
    if (!DB.curriculum.successMetrics) DB.curriculum.successMetrics = [];
  };
})();
