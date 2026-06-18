/* Mini Star Curriculum Data — Activity Library, Milestones, Schedules */

export const CURR_CATS = [
  { id: 'language',    label: 'Language',         icon: '💬', color: '#2ABFB8' },
  { id: 'cognitive',   label: 'Cognitive',         icon: '🧠', color: '#4A8BC4' },
  { id: 'social',      label: 'Social-Emotional',  icon: '❤️',  color: '#E86B6B' },
  { id: 'physical',    label: 'Physical',           icon: '🏃', color: '#4A9E4A' },
  { id: 'creativity',  label: 'Creativity & Arts',  icon: '🎨', color: '#C8960A' },
  { id: 'life_skills', label: 'Life Skills',         icon: '⭐', color: '#8B4AB8' },
  { id: 'health',      label: 'Health & Wellness',  icon: '🌿', color: '#2E9E8A' },
  { id: 'character',   label: 'Character',           icon: '🌟', color: '#B87828' },
]

export const ML_LEVELS = ['Beginning', 'Emerging', 'Developing', 'Proficient', 'Advanced'] as const
export type MilestoneLevel = typeof ML_LEVELS[number]

export const CURR_THEMES = [
  'All About Me','My Family & Friends','Animals & Nature','Colors & Shapes',
  'Numbers & Counting','Seasons & Weather','Food & Nutrition','Community Helpers',
  'Plants & Growing','Water & Science','Music & Movement','Feelings & Emotions',
  'Transportation','Insects & Bugs','Ocean & Sea Life','Space & Stars',
  'Sports & Exercise','Holidays Around the World','STEM & Technology','Kindness & Compassion',
]

export interface Activity {
  id: string; title: string; obj: string; mats: string[]; steps: string[]; qs: string[];
  benefits: string; dur: number; diff: number;
}

export type AgeKey = 'infants' | 'toddlers' | 'preschool' | 'school_age'
export type ActivityLibrary = Record<AgeKey, Record<string, Activity[]>>

function act(id: string, title: string, obj: string, mats: string[], steps: string[], qs: string[], benefits: string, dur: number, diff: number): Activity {
  return { id, title, obj, mats, steps, qs, benefits, dur, diff }
}

export const ACTIVITY_LIBRARY: ActivityLibrary = {
  infants: {
    language: [
      act('il1','Name It Game','Build receptive vocabulary through naming',['Colorful toys','Common objects'],["Hold up an object at baby's eye level","Say its name clearly and slowly 3 times","Pause and watch for baby's response","Repeat with 3 different objects"],["Can you see the ball?","Where is the cup?"],'Early word association, listening, and language foundations',10,1),
      act('il2','Sing & Sign','Introduce early words through song and gesture',['No materials needed'],['Sing simple songs with repeated words','Add hand gestures for key words: more, all done, milk','Pause and wait for any baby response','Celebrate any attempt to communicate'],["Do you want more?","All done?"],'Pre-verbal communication and early language development',10,1),
      act('il3','Lap Story Time','Expose baby to language rhythm and book concepts',['Board books with simple pictures'],['Sit baby in lap facing book','Point to pictures and name each one','Use expressive voice and facial expressions','Let baby touch and turn board book pages'],["What do you see?","Can you touch the dog?"],'Early literacy, vocabulary, and bonding through shared reading',10,1),
      act('il4','Sound Discovery','Develop auditory awareness and discrimination',['Shakers','Bells','Squeaky toys'],['Make a sound near baby and wait for reaction','Name each sound: "That is a bell!"','Vary volume, pitch, and distance','Watch for baby to locate the sound source'],["Did you hear that?","Where is the sound coming from?"],'Auditory processing and early cause-and-effect understanding',8,1),
    ],
    cognitive: [
      act('ic1','Peek-A-Boo','Develop object permanence and anticipation',['Soft cloth or blanket'],['Hide face behind cloth','Ask: "Where did I go?"','Reveal face with "Peek-a-boo!"','Try hiding a toy under the cloth too'],["Where did it go?","Is it there?"],'Object permanence, memory, and social-cognitive development',8,1),
      act('ic2','Texture Exploration','Stimulate sensory-cognitive learning',['Fabric swatches: soft, rough, smooth','Safe natural textures'],['Present one texture at a time','Guide baby hand gently to feel it','Name the texture: "Soft! Bumpy!"','Watch and narrate facial reactions'],["Is that soft?","What does that feel like?"],'Sensory processing, cognitive curiosity, and tactile learning',12,1),
      act('ic3','Container Play','Build cause-effect and spatial reasoning',['Safe containers','Large soft blocks or balls'],['Demonstrate putting a block into the container','Let baby try independently','Cheer every attempt no matter the result','Try different sized containers'],["Can it fit?","Where did it go?"],'Spatial reasoning, problem solving, and fine motor planning',10,1),
      act('ic4','Mirror Discovery','Develop self-recognition and social awareness',['Safe unbreakable baby mirror'],['Hold baby in front of mirror','Point to reflection: "That is you!"','Make funny faces together','Name body parts seen in mirror'],["Who is that?","Can you touch your nose?"],'Self-awareness, identity, and social-cognitive development',8,1),
    ],
    social: [
      act('is1','Emotion Faces','Introduce basic emotional vocabulary',['Emotion picture cards'],['Make a happy face: "Happy!"','Make a sad face: "Sad!"','Let baby touch the cards','Mirror any expression baby makes'],["Are you happy?","Look at the happy face!"],'Emotional recognition, social bonding, and early empathy',8,1),
      act('is2','Gentle Touch Routine','Build trust through caring interaction',['Soft cloth','Gentle lotion if appropriate'],['Engage in gentle massage or touch play','Name body parts being touched','Talk soothingly throughout','Follow baby cues for comfort and pace'],["Does that feel good?","Is this your hand?"],'Secure attachment, trust, body awareness, and well-being',10,1),
      act('is3','Group Floor Time','Build early peer awareness',['Play mat','Soft toys'],['Place babies on play mat together','Let babies notice each other','Name each baby: "Look, that is Mia!"','Facilitate gentle safe interactions'],["Do you see your friend?"],'Early peer awareness, social interest, and group belonging',15,1),
      act('is4','Call and Response','Build secure attachment through communication',['No materials needed'],['Wait for baby to vocalize or gesture','Respond immediately and warmly','Imitate baby sounds back to them','Take turns in a back-and-forth "conversation"'],[],'Secure attachment, communication, trust, and language turn-taking',10,1),
    ],
    physical: [
      act('ip1','Tummy Time','Strengthen neck and core muscles',['Play mat','Colorful toys placed in front'],['Place baby on tummy on mat','Place bright toy slightly ahead to motivate lifting','Encourage baby to lift head to look','Keep session to 5-10 minutes; watch for fatigue'],["Can you reach the toy?","Look up here!"],'Neck strength, back muscles, head control, and motor foundations',10,1),
      act('ip2','Reach & Grasp','Develop fine motor control and hand-eye coordination',['Dangling toys or rings at reaching distance'],['Position baby on back','Hold toy just within reach','Encourage reaching and grasping','Let baby bring to mouth safely'],["Can you grab it?","Reach for it!"],'Fine motor skills, hand-eye coordination, and intentional movement',8,1),
      act('ip3','Supported Sitting','Build core strength for independent sitting',['Boppy pillow or caregiver lap support'],['Support baby in seated position','Let baby explore while sitting','Place toys at sides to encourage turning','Gradually reduce support as strength grows'],["Can you sit up?","Look over here!"],'Core strength, balance, postural control, and spatial awareness',10,1),
      act('ip4','Kicking Play','Strengthen leg muscles and motor control',['Hanging toy bar or soft target for baby to kick'],['Place baby on back under toy bar','Encourage kicking with feet','Name the action: "You are kicking!"','Let baby feel the reward of making the toy move'],["Can you kick it?","Kick kick kick!"],'Leg strength, intentional motor control, and cause-effect joy',8,1),
    ],
    creativity: [
      act('icr1','Music & Movement','Introduce rhythm, music, and joyful movement',['Soft music player','Rattles or shakers'],['Play gentle music','Move baby arms and legs gently to rhythm','Use rattles to add sounds','Sing simple songs throughout'],["Do you hear the music?","Let's dance!"],'Auditory processing, rhythm awareness, and joy of music',10,1),
      act('icr2','Sensory Art Bag','Safe visual-creative exploration',['Zip-lock bag sealed with colored paint inside','Tape to secure bag flat'],['Tape sealed paint bag to flat surface','Let baby push and smear paint through bag safely','Name colors: "Red! Blue!"','Celebrate marks baby makes'],["What colors do you see?","You made that!"],'Visual tracking, sensory processing, and early cause-effect creativity',10,1),
      act('icr3','Nature Sounds','Introduce natural sounds and calm',['Recordings of birds, rain, or ocean waves'],['Play nature sounds softly during rest or play time','Comment on what you hear: "That is rain!"',"Watch baby's reactions and name them",'Vary sounds across the week'],["Do you hear the birds?","Listen..."],'Auditory awareness, calm regulation, and connection to nature',10,1),
    ],
    life_skills: [
      act('ils1','Clean Up Signal','Introduce routine and transition awareness',['Consistent clean-up song or phrase'],['Sing the same "clean up" song every time','Demonstrate putting one toy away','Guide baby hand in the motion','Make it celebratory: "We did it!"'],[],'Routine understanding, transition skills, and early responsibility',5,1),
      act('ils2','Self-Feeding Exploration','Develop early independence with eating',['Age-appropriate finger foods','High chair'],['Offer safe finger foods on tray','Let baby pick up and bring to mouth','Name each food clearly','Praise any self-feeding attempt warmly'],["Yummy! What are you eating?"],'Self-care independence, fine motor control, and healthy eating attitudes',15,1),
    ],
    health: [
      act('ih1','Wash Hands Together','Introduce hygiene routines early',['Warm water','Gentle baby-safe soap'],['Hold baby at sink','Wash hands together as a pair','Say: "We are washing our hands!"','Make it playful with a song or counting'],["Are we clean now?"],'Lifelong hygiene habits and routine familiarity',5,1),
      act('ih2','Outdoor Fresh Air','Provide fresh air and nature connection',['Stroller or carrier','Weather-appropriate clothing'],['Take baby outside in safe weather','Describe what you see: trees, sky, birds','Let baby feel a gentle breeze','Point out colors, sounds, and movement'],["Do you feel the wind?","Look at the tree!"],'Physical health, vitamin D, sensory awareness, and nature connection',15,1),
    ],
    character: [
      act('ich1','Gentle & Kind','Model gentleness and caring through play',['Stuffed animal'],['Show gentle touch with stuffed animal','Say: "We are being gentle and kind"','Guide baby in gentle petting motion','Model care: "The bear is happy because we are kind!"'],["Can you be gentle?"],'Empathy, kindness, and gentle behavioral foundations',8,1),
      act('ich2','Thank You Ritual','Introduce gratitude through daily modeling',['No materials needed'],['Say "Thank you!" sincerely when giving or receiving','Model a wave or clap as a "thank you"','Celebrate when baby imitates the gesture','Make it warm, real, and consistent daily'],["Can you say thank you?"],'Gratitude, social courtesy, and positive relationship foundations',5,1),
    ],
  },

  toddlers: {
    language: [
      act('tl1','Word of the Day','Expand vocabulary with daily new word',['Picture card or real object'],["Introduce one new word in morning circle","Say slowly: \"Today's word is BUTTERFLY\"","Show a picture or the real object","Use the word all day; review at close"],["Can you say butterfly?","What do butterflies do?"],'Vocabulary building, memory, and daily language enrichment',10,1),
      act('tl2','Two-Word Conversations','Practice two-word phrases in context',['Common toys and objects'],['Model two-word phrases: "Big ball!" "More juice!"','Ask questions that invite two-word answers','Wait patiently for the child response',"Expand what child says: \"dog run\" → \"Yes, the dog is running!\""],["What is this?","What is it doing?"],'Expressive language, sentence construction, and communication confidence',10,1),
      act('tl3','Interactive Storytime','Build listening comprehension and narrative understanding',['Picture books'],['Read with enthusiasm and expression','Point to pictures and name everything','Ask: "What happens next?"',"Let children turn pages and connect story to real life"],["What do you see here?","How does the dog feel?","Has that happened to you?"],'Comprehension, vocabulary, narrative understanding, and reading joy',12,2),
      act('tl4','Action Songs','Connect movement to language learning',['Space to move'],['Teach action songs: Wheels on the Bus, If You\'re Happy','Sing slowly with exaggerated movements','Pause so children can fill in the words','Repeat until children anticipate words'],["What comes next?","Can you show me the motion?"],'Vocabulary, memory, sequencing, and love of language through song',10,1),
    ],
    cognitive: [
      act('tc1','Shape Sorting','Develop shape recognition and problem solving',['Shape sorter toy'],['Name each shape: "This is a circle"','Let child try to fit each shape independently','Give hints if stuck: "Try turning it"','Celebrate every success warmly'],["What shape is this?","Which hole does it fit?","Can you find the circle?"],'Shape recognition, problem solving, spatial reasoning, and persistence',12,2),
      act('tc2','Simple Puzzles','Build problem solving and visual-spatial skills',['2-4 piece puzzles'],['Show completed puzzle first','Take apart one piece at a time','Let child replace each piece','Give visual clues: "Look at the shape of the space"'],["Where does this piece go?","What do you see on this piece?"],'Spatial reasoning, persistence, problem solving, and confidence',15,2),
      act('tc3','Matching Pairs','Build memory and visual discrimination',['Simple matching cards: animals, colors, shapes'],['Lay all cards face up first','Practice matching with visible cards','Turn face down for memory challenge','Take turns flipping cards'],["Do they match?","Are they the same?","Can you remember where it is?"],'Visual memory, discrimination, and concentration skills',12,2),
      act('tc4','Big & Little Sorting','Develop size concepts and comparison',['Big and small versions of same objects'],['Present big and small objects side by side','Say: "This one is BIG! This one is little"','Let child sort into big/little groups','Compare: "Which is bigger?"'],["Which is bigger?","Find the little one!","Are these the same size?"],'Comparative thinking, sorting, and early mathematical concepts',10,1),
    ],
    social: [
      act('ts1','Feelings Check-In','Build emotional vocabulary and self-awareness',['Feelings faces chart'],['Show feelings chart in morning circle','Ask each child: "How do you feel today?"','Name the feeling: "You feel happy!"','Validate all feelings: "It is OK to feel that way"'],["How do you feel?","What does happy look like?","Why do you feel that way?"],'Emotional vocabulary, self-awareness, and emotional acceptance',10,1),
      act('ts2','Turn-Taking Timer','Practice sharing and patience',['Popular toy','Visual timer'],['Introduce: "We share in our class!"','Use visual timer for turns','Coach: "First Sofia, then it is Maya\'s turn"','Praise sharing: "You shared! That was so kind!"'],["Whose turn is it?","How does it feel to wait?","How did it feel to share?"],'Sharing, patience, cooperation, and social negotiation',15,2),
      act('ts3','Kindness Catcher','Notice and celebrate acts of kindness',['Kindness jar','Small paper slips'],['Introduce the Kindness Jar','Notice kind acts throughout the day','Write or draw the kind act on paper','Add to jar: "Maya helped pick up! That is kindness!"'],["Was that kind?","How did your friend feel when you helped?"],'Empathy, kindness awareness, and prosocial behavior development',5,1),
      act('ts4','My Space Awareness','Develop body boundaries and personal space',['Hula hoops or carpet squares'],['Give each child a hoop or mat: "This is your space"','Practice moving without entering others space','Role-play asking permission: "May I sit with you?"','Discuss: "How does it feel when someone respects your space?"'],["Is this your space or mine?","How do we ask to join someone?"],'Personal boundaries, spatial awareness, and social respect',10,1),
    ],
    physical: [
      act('tp1','Obstacle Course','Build gross motor coordination and balance',['Pillows, tunnels, balance beams, cones'],['Set up simple course: crawl, jump, walk on line','Demonstrate each step clearly','Guide child through the course','Adjust difficulty as child masters each section'],["Can you crawl through?","Jump over the pillow!","Walk on the line!"],'Gross motor skills, coordination, balance, and physical confidence',20,2),
      act('tp2','Tong Transfer','Develop hand strength and fine motor control',['Tongs','Cotton balls','Two bowls'],['Demonstrate using tongs to pick up cotton balls','Let child practice at their own pace','Transfer cotton balls from bowl to bowl','Progress to smaller objects as skill grows'],["Can you pick it up?","Squeeze the tongs!"],'Hand strength, pincer grip, fine motor precision, and focus',12,2),
      act('tp3','Dance & Freeze','Develop body control and listening skills',['Music player'],['Play music and let children dance freely','Stop music suddenly: children freeze!','Call body positions: "Freeze like a tree!"','Restart music and repeat'],["Can you freeze?","What is your body doing right now?"],'Body awareness, motor control, listening, and self-regulation',12,1),
      act('tp4','Playdough Workout','Strengthen hand and finger muscles',['Playdough','Rolling pins','Cookie cutters'],['Roll, squeeze, poke, and flatten playdough','Use rolling pin to flatten','Cut with cookie cutters','Make simple shapes, animals, and objects'],["What are you making?","Squeeze it hard!","Can you make it flat?"],'Fine motor strength, hand-eye coordination, and creative expression',15,1),
    ],
    creativity: [
      act('tcr1','Color Mixing Magic','Explore color creation through mixing',['Red, blue, yellow paint','White paper','Brushes'],['Put two primary colors on paper','Let child mix with brush or fingers','Name the new color: "Red and blue makes purple!"','Explore all color combinations together'],["What color did you make?","What happens if we add more blue?"],'Creativity, cause-effect thinking, and color knowledge',15,1),
      act('tcr2','Rhythm Instruments','Explore beat, rhythm, and music making',['Drums, shakers, bells, or homemade instruments'],['Give each child an instrument','Clap a simple beat; children copy','Play fast/slow, loud/soft alternating','Create a group rhythm together'],["Can you copy my beat?","Play it fast! Now slow!"],'Musical awareness, rhythm, listening skills, and creative joy',12,1),
      act('tcr3','Story Drawing','Express stories through drawing',['Paper','Crayons'],['Tell or read a short story together','Ask children to draw what happened','Let each child narrate their drawing','Write their exact words on the paper for them'],["What did you draw?","Tell me about your picture"],'Creative expression, narrative skills, and early literacy connection',15,2),
    ],
    life_skills: [
      act('tls1','Table Setting','Practice responsibility and daily life routines',['Plates, cups, napkins'],['Show where each item belongs','Give one item to place at a time','Praise effort: "You placed the cup perfectly!"','Make it part of daily routine'],["Where does the cup go?","What comes next?"],'Responsibility, sequencing, independence, and community contribution',8,1),
      act('tls2','Dress Self Practice','Build dressing independence and fine motor skills',['Large-button shirts','Zip practice boards','Velcro shoes'],['Start with large zippers or buttons','Demonstrate slowly, step by step','Let child try fully independently','Celebrate any attempt: "You did it yourself!"'],["Can you do it yourself?","Pull the zipper up!"],'Self-care independence, persistence, and fine motor development',10,2),
      act('tls3','Picture Label Clean-Up','Build responsibility and organizational matching',['Labeled bins with picture labels'],['Sing clean-up song to signal time','Show where each toy goes with picture labels','Child matches toy to the picture label on bin','High five for completing clean-up'],["Where does the block go?","Find the matching picture!"],'Responsibility, visual matching, and organizational habits',8,1),
    ],
    health: [
      act('th1','Hand Washing Song','Build proper hand washing as a lifelong habit',['Sink','Soap','Paper towels'],['Sing a 20-second hand washing song together','Scrub all parts: palms, backs, between fingers','Rinse thoroughly and dry','Practice before meals, after outdoor play, after bathroom'],["Did we get all the germs?","Why do we wash our hands?"],'Hygiene habits, germ prevention, and health independence',5,1),
      act('th2','Rainbow on My Plate','Introduce healthy food variety and nutrition',['Pictures of colorful fruits and vegetables or real samples'],['Show a rainbow of colored fruits and vegetables','Name each food and its color','Explain: "Different colors give us different healthy things!"','Let children share their favorites'],["What color is this food?","Is this food healthy?","Which color do you like most?"],'Nutritional awareness, healthy food attitudes, and food variety appreciation',10,1),
    ],
    character: [
      act('tch1','Honesty Story','Teach the value of honesty through narrative',['Book about honesty or teacher-told story'],['Tell a story about a character who tells the truth even when it is hard','Discuss how it made everyone feel','Ask: "What would YOU do?"','Practice saying honest statements in role play'],["Why did he tell the truth?","How did his friends feel?","When is it hard to be honest?"],'Honesty, trust, integrity, and moral development',12,2),
      act('tch2','Patience Garden','Practice patience through plant care',['Seeds','Small cups','Soil','Water'],['Plant a seed together','Explain: "It needs time to grow"','Check on it together every day','Connect to life: "Some wonderful things need patience"'],["Has it grown yet?","Why do we need to wait?","What are you waiting patiently for?"],'Patience, responsibility, delayed gratification, and nature connection',15,1),
      act('tch3','Gratitude Circle','Practice daily gratitude',['No materials needed'],['In afternoon circle, each child shares one thing they are thankful for','Teacher models: "I am thankful for our wonderful class!"','Validate all responses warmly','Connect gratitude to feelings of happiness'],["What are you thankful for today?","How does it feel to think about that?"],'Gratitude, positive mindset, and emotional well-being',8,1),
    ],
  },

  preschool: {
    language: [
      act('pl1','Read-Aloud Deep Dive','Build comprehension and critical thinking through books',['Age-appropriate picture book'],['Read with expression and enthusiasm','Stop at key moments for prediction questions','Discuss characters, feelings, and events','Retell the story together in sequence',"Connect story to children's own lives"],["What do you think will happen?","How does the character feel?","Has this ever happened to you?","What would YOU do?"],'Deep comprehension, vocabulary, critical thinking, and love of books',15,2),
      act('pl2','Letter Sound Hunt','Develop phonological awareness and reading readiness',['Letter of the week card','Objects beginning with that letter'],['Introduce the letter of the week with its sound: "/B/ for Ball!"','Show the letter in print','Hunt around the room for objects starting with that sound','Sort objects by beginning sound'],["What sound does B make?","Does ball start with B?","Find something that starts with /s/!"],'Phonological awareness, letter-sound connections, and early reading readiness',15,2),
      act('pl3','Show & Tell Circle','Build presentation and communication confidence',['Each child brings one special item from home'],['Each child has 2 minutes to show and describe their item','Class asks 3 questions','Teacher models active listening','Celebrate every presenter'],["What is it?","What does it feel like?","Why did you bring it today?"],'Speaking confidence, listening skills, descriptive language, and community sharing',20,2),
      act('pl4','Rhyme Time Workshop','Build phonological awareness through rhyme play',['Rhyming books or cards'],['Read a rhyming book or poem together','Identify rhyming pairs: "Cat/Hat — do they rhyme?"','Complete rhymes: "I see a cat sitting on a ___"','Create silly rhymes together as a group'],["Do these words rhyme?","What rhymes with dog?","Make a silly rhyme!"],'Phonological awareness, memory, prediction, and early literacy foundations',12,2),
    ],
    cognitive: [
      act('pc1','Pattern Making','Develop mathematical pattern recognition',['Colored blocks','Pattern cards'],['Create a simple AB pattern: red, blue, red, blue','Ask child to copy the pattern','Ask: "What comes next?"','Create ABC patterns for advanced learners'],["What comes next?","Can you see the pattern?","Make your own pattern!"],'Mathematical thinking, sequencing, prediction, and algebraic reasoning',15,2),
      act('pc2','Nature Science Exploration','Build scientific observation and inquiry',['Magnifying glasses','Natural objects: leaves, rocks, seeds'],['Give each child a magnifying glass','Examine natural objects up close and describe','Ask open-ended observation questions','Record findings through drawing in a science journal'],["What do you see?","Why do you think that happens?","What would happen if...?"],'Scientific thinking, observation skills, and curiosity-driven inquiry',20,2),
      act('pc3','Number Sense Practice','Build deep counting and number understanding',['Counting manipulatives','10-frame mats'],['Set up counting collections of 10-20 items','Count together, touching each object once','Sort into groups and compare','Ask: "Which group has more? How do you know?"'],["How many?","Which group has more?","Can you count backwards from 10?"],'Number sense, one-to-one correspondence, cardinality, and comparison',15,2),
      act('pc4','Memory Challenge','Strengthen working memory and attention',['Colored blocks','Tray'],['Build a simple 3-block structure on a tray','Show it for 5 seconds, then cover it','Child rebuilds from memory','Gradually increase complexity each session'],["What did you see?","How many blocks were there?","What color was on top?"],'Working memory, attention, spatial recall, and concentration',12,3),
    ],
    social: [
      act('ps1','Peace Corner Practice','Teach structured conflict resolution',['Peace corner with calming tools','Feelings chart','Calm-down jar'],['Introduce the peace corner: "A place to calm down and solve problems"','When conflict occurs, go to the peace corner','Use I-messages: "I feel ___ when ___ because ___"','Work toward a solution together'],["How do you feel?","What do you need right now?","How can we solve this together?"],'Conflict resolution, emotional regulation, problem-solving, and empathy',15,3),
      act('ps2','Cooperative Building','Develop teamwork and shared decision making',['Blocks or construction materials'],['Assign pairs or small groups','Give a building challenge: "Build a bridge strong enough to hold a book"','Must plan and build together','Present and explain the finished project'],["How will you work together?","Who will do what?","What happened when you disagreed?"],'Cooperation, communication, leadership, and creative teamwork',20,3),
      act('ps3','Empathy Role Play','Build perspective-taking and empathy through puppets',['Puppets or dolls'],['Use puppets to act out relatable scenarios','Example: "The new puppy is scared and alone"','Ask: "How does the puppy feel?"','What could we do to help?'],["How does the puppy feel?","What would you do?","How would YOU feel if that happened to you?"],'Empathy, perspective-taking, prosocial behavior, and emotional intelligence',15,2),
      act('ps4','Calming Toolbox','Teach self-regulation strategies for big feelings',['Glitter calm-down jar','Breathing visuals','Calm music'],['Introduce 4-5 calming strategies: deep breathing, counting, hugging, squeezing hands','Practice each strategy when children are calm','Reference toolbox when upset occurs','Practice together daily at check-in time'],["Which strategy helps you most?","Take 3 deep breaths with me","What helps you feel calm again?"],'Emotional self-regulation, coping strategies, and emotional independence',12,2),
    ],
    physical: [
      act('pp1','Scissor Skills Station','Develop fine motor precision and cutting control',['Child safety scissors','Pre-drawn lines and shapes on paper'],['Demonstrate correct scissor grip clearly','Practice opening and closing scissors','Cut along straight lines first','Progress to gentle curves, then shapes'],["Are your fingers in the right holes?","Can you cut exactly on the line?"],'Fine motor control, hand dominance, bilateral coordination, and precision',15,3),
      act('pp2','Kids Yoga Flow','Develop balance, flexibility, and body mindfulness',['Yoga mats or carpet squares'],['Teach 5 animal poses: cat, dog, tree, butterfly, cobra','Hold each pose for 5 deep breaths','Flow between poses smoothly','Connect poses to a nature story narrative'],["Can you balance like a tree in the wind?","Take a deep breath in this pose"],'Balance, flexibility, body awareness, mindfulness, and calm focus',15,2),
      act('pp3','Ball Skills Circuit','Develop throwing, catching, and hand-eye coordination',['Soft balls of varying sizes'],['Start with large ball, short distance','Practice underhand throw with proper form','Catch with two hands extended','Progress to smaller balls and longer distances'],["Use two hands to catch!","Are you ready?","Great catch!"],'Hand-eye coordination, motor timing, athletic confidence, and persistence',15,2),
      act('pp4','Pre-Writing Practice','Develop the foundational strokes needed for writing',['Sand trays','Chalkboard','Large chalk or fat crayons'],['Practice vertical strokes: top to bottom','Horizontal strokes: left to right','Circles: counterclockwise','Diagonal strokes: top-right to bottom-left'],["Which way does this line go?","Try to make it smooth and even"],'Pre-writing skills, pencil control, directionality, and fine motor precision',15,2),
    ],
    creativity: [
      act('pcr1','Process Art Studio','Encourage creative expression without a product focus',['Varied art materials: paint, collage, clay, fabric'],['Set up an open art invitation','Show NO model or example — let children create freely','Children explore materials in their own way','Ask about their process, not the product'],["Tell me about what you made","What did you enjoy making?","How did you do that?"],'Creative confidence, self-expression, risk-taking, and artistic joy',20,1),
      act('pcr2','Dramatic Play World','Develop imagination and social skills through role play',['Dress-up clothes','Themed props: grocery store, doctor office, kitchen'],['Set up themed dramatic play environment','Introduce the theme and available props','Children create their own scenarios freely','Teacher narrates to extend and enrich play'],["What is happening in your story?","Who are you today?","What happens next?"],'Imagination, language development, social skills, and creative problem-solving',25,1),
      act('pcr3','Original Song Making','Create original music, words, and rhythm as a class',['Instrument or simple beat'],['Teach a simple repeating melody','Change words to create a new class song','Let children volunteer new verses','Record and celebrate the group creation'],["What should our song be about?","What rhymes with sun?"],'Creativity, phonological awareness, musical expression, and group collaboration',15,2),
    ],
    life_skills: [
      act('pls1','Classroom Jobs Board','Build responsibility through meaningful classroom roles',['Job chart with name cards and picture labels'],['Assign daily classroom job: door holder, plant waterer, line leader, messenger','Explain the responsibilities clearly','Child completes job independently throughout the day','Whole class thanks the job holder at end of day'],["What is your job today?","Did you complete your job?","Why are classroom jobs important?"],'Personal responsibility, community contribution, and self-efficacy',5,1),
      act('pls2','Independent Lunch Routine','Build meal independence and sequential self-care',['Lunch boxes and napkins'],['Children open their own lunch boxes','Spread their own napkins independently','Self-serve when possible','Clean up their own space after eating'],["Can you open that yourself?","What comes next in our routine?"],'Independence, self-care, sequential thinking, and personal responsibility',20,2),
      act('pls3','Problem Solving Steps','Teach a systematic problem-solving framework',['Problem-solving poster: Stop, Think, Choose, Do'],['Introduce the 4 steps: Stop, Think, Choose, Do','Role-play a simple daily problem','Walk through each step slowly','Practice throughout the day with real situations'],["What is the problem?","What can you do?","Which choice is the best one?"],'Independent problem-solving, critical thinking, and decision-making skills',12,3),
    ],
    health: [
      act('ph1','Body Care Connection','Learn body parts and corresponding hygiene practices',['Body outline drawing','Toothbrushes for practice'],['Review major body parts','Connect each to how we care for it: teeth→brush, hair→wash','Practice brushing teeth with toothbrushes','Create a personal body care chart together'],["How do we take care of our teeth?","Why is it important to wash our hair?"],'Health literacy, personal hygiene habits, and body autonomy',15,2),
      act('ph2','Safety Rules Circle','Learn and practice basic personal safety',['Safety picture cards'],['Discuss one safety rule at a time','Show what safe and unsafe looks like using cards','Role-play realistic situations','Create a class safety rules chart together'],["Is this safe or not safe?","What should we do?","Why is this rule important?"],'Safety awareness, personal judgment, and self-protection skills',15,2),
    ],
    character: [
      act('pch1','Responsibility Stars','Develop personal responsibility awareness',['Personal responsibility chart for each child'],['Each child has a daily chart of responsibilities','Children check off completed items throughout the day','Weekly celebration of responsible behavior','Discuss: "Why does being responsible matter?"'],["Did you complete your responsibilities today?","How does it feel to be responsible?"],'Self-responsibility, intrinsic motivation, and personal accountability',5,2),
      act('pch2','Class Respect Pledge','Build a classroom culture of mutual respect',['Respect pledge displayed prominently on classroom wall'],['Create the class respect pledge together as a group','Recite together each morning','Notice and name specific respectful behaviors throughout the day','Discuss: "What is respect? How do we show it?"'],["What does respect mean to you?","How do you show respect?","Was that respectful?"],'Mutual respect, community values, and a positive classroom culture',8,2),
      act('pch3','Compassion in Action','Practice compassion through real helping',['Varies by helping activity'],['Identify someone or something that needs help','Plan together how to help','Carry out the helping action','Reflect: "How did that feel? What difference did we make?"'],["How can we help?","How did it feel to help someone?","Why is compassion important?"],'Compassion, empathy, civic-mindedness, and community connection',15,2),
    ],
  },

  school_age: {
    language: [
      act('sal1','Reading Workshop','Build fluency, comprehension, and love of reading',['Books at varied reading levels','Reading response journals'],['Independent reading time 15-20 minutes','Reading response journal entry after reading','Share favorite part or insight with a partner','Weekly reading challenge or goal setting'],["What happened in your book?","What was the main message?","Would you recommend it? Why?"],'Reading fluency, comprehension, stamina, and love of reading',20,3),
      act('sal2','Creative Writing Workshop','Develop written voice and expressive writing',['Writing journals','Writing prompt cards'],['Mini-lesson on one writing skill: voice, detail, dialogue, or structure','Write for 15 minutes independently','Share with writing partner for feedback','Revise one specific section using feedback'],["What is your story about?","How can you add more specific detail?","Read your most powerful sentence"],'Written expression, voice, revision skills, and communication',25,3),
      act('sal3','Structured Discussion','Develop critical thinking and respectful oral discourse',['Age-appropriate discussion topic card'],['Present an engaging question: "Should school lunches be free for everyone?"','Give 2 minutes of thinking time','Share opinions with supporting reasons','Practice respectful disagreement: "I see it differently because..."'],["What do you think? Why?","Does anyone see it differently?","What evidence supports your view?"],'Critical thinking, oral communication, civic discourse, and respectful debate',20,4),
      act('sal4','Vocabulary Detective','Build academic vocabulary through context clue strategies',['Text with rich vocabulary','Vocabulary journals'],['Read a rich text together','Identify 3-5 unfamiliar words in context','Use context clues to guess meanings','Confirm with dictionary; use each word in an original sentence'],["What do you think this word means?","What clues helped you figure it out?"],'Academic vocabulary, independent word-learning strategies, and reading depth',15,3),
    ],
    cognitive: [
      act('sac1','STEM Engineering Challenge','Develop engineering thinking and creative problem solving',['Building materials: straws, tape, index cards, cups','Written challenge card'],['Present challenge: "Build the tallest free-standing tower using only these materials"','Plan stage: 5 minutes to draw and discuss plan','Build stage: 15 minutes','Test and evaluate: does it meet the challenge?','Redesign based on what you learned'],["What was your plan?","What worked well?","What would you change next time?","Why did it fail?"],'Engineering thinking, creative problem-solving, resilience, and design process',30,4),
      act('sac2','Real-World Math','Apply mathematical thinking to authentic contexts',['Word problem cards','Manipulatives or scratch paper'],['Read word problem aloud together','Identify: "What do you know? What do you need to find?"','Choose a strategy and show your thinking','Solve, then explain your reasoning to a partner'],["What information do you know?","What are you trying to find?","Does your answer make sense?"],'Mathematical reasoning, real-world application, and mathematical communication',20,4),
      act('sac3','Scientific Investigation','Practice the complete scientific method',['Experiment materials vary','Science notebooks'],['Question: "What do we want to find out?"','Hypothesis: "What do we predict will happen?"','Experiment: "Let\'s test it!"','Observe and record data carefully','Conclude: "What did we actually learn?"'],["What is your hypothesis?","What did you observe?","Was your prediction correct? Why or why not?"],'Scientific thinking, inquiry, analytical reasoning, and intellectual honesty',30,4),
      act('sac4','Coding & Computational Thinking','Build logical and algorithmic thinking skills',['Unplugged coding cards or tablets with Scratch/Code.org'],['Explain: "Coding is giving precise instructions to a computer"','Unplugged activity: give step-by-step instructions to a "human robot"','Try a beginner coding platform: Scratch Jr, Code.org','Debug a simple error: what went wrong?'],["What instruction comes first?","What happened when you ran that code?","How do you find and fix the bug?"],'Computational thinking, logic, sequencing, and technology literacy',25,3),
    ],
    social: [
      act('sas1','Conflict Resolution Protocol','Master structured peer conflict resolution',['4-step conflict resolution poster'],['Teach 4-step protocol: (1) Calm down, (2) Each person shares their perspective, (3) Find common ground, (4) Make a plan','Practice with realistic role-play scenarios','Apply in real conflicts as they arise','Reflect on outcomes: what worked?'],["How do you feel?","What does the other person need?","What solution works for everyone involved?"],'Conflict resolution, empathy, communication, and relationship skills',20,4),
      act('sas2','Leadership Project','Develop leadership, planning, and community responsibility',['Project planning template','Materials vary by project'],['Small groups identify a real class or school improvement project','Assign roles: leader, recorder, presenter','Plan and execute the project together','Present to class with reflection'],["What is your leadership role?","How will you guide your team?","What challenges did you overcome?"],'Leadership, teamwork, civic engagement, planning, and public speaking',45,4),
      act('sas3','Peer Mentoring','Build empathy and leadership through mentoring younger children',['Paired mentor-mentee activity'],['Pair older children with younger peers','Older child reads to or guides younger child through an activity','Structured activity designed for both ages','Reflect: "What did you learn from each other?"'],["How did you help your buddy today?","What did you learn from someone younger than you?"],'Empathy, leadership, responsibility, patience, and community connection',20,3),
    ],
    physical: [
      act('sap1','Team Sports & Sportsmanship','Develop athletic skills, teamwork, and sportsmanship',['Sport-appropriate equipment'],['Teach basic rules of one team sport','Practice individual skills in small groups','Play a modified game with focus on sportsmanship','Debrief: "What teamwork moments stood out today?"'],["How did your team work together?","What sportsmanship did you see?"],'Teamwork, athletic skills, sportsmanship, cooperation, and physical health',30,3),
      act('sap2','Personal Fitness Circuit','Build fitness habits and health awareness',['Fitness station cards with written instructions'],['5-7 stations: jumping jacks, wall push-ups, balance, stretching, etc.','45 seconds at each station with rest between','Track and celebrate personal records','Discuss: "Why does regular exercise matter for our health and brain?"'],["How does exercise make you feel?","Can you beat your personal best from last week?"],'Physical fitness, goal-setting, health awareness, and lifelong active habits',25,3),
    ],
    creativity: [
      act('sacr1','Multimedia Storytelling','Create stories using multiple creative and digital modes',['Tablets or computers','Drawing materials','Audio recording option'],['Plan story arc: beginning, middle, end','Create visual art to illustrate the story','Record narration in child own voice','Combine into a complete multimedia presentation'],["What is your story about?","How does your artwork tell the story?","How does your voice bring it to life?"],'Creativity, technology skills, narrative thinking, and multimedia communication',45,4),
      act('sacr2','Invention Convention','Design solutions to real problems using creative thinking',['Recyclable materials','Design journals','Tape, scissors, glue'],['Step 1: Identify a real problem you care about','Step 2: Brainstorm multiple solutions','Step 3: Build a prototype','Step 4: Test, evaluate, and improve','Step 5: Present your invention to the class'],["What problem are you solving?","How does your invention work?","What would you improve in the next version?"],'Creative thinking, engineering mindset, innovation, and presentation skills',45,5),
    ],
    life_skills: [
      act('sals1','Financial Literacy','Introduce responsible money management concepts',['Play money','Simple classroom "store" setup'],['Teach the 4 key concepts: earn, save, spend, give','Run a classroom "store" simulation','Practice making change and calculating costs','Discuss saving for goals vs. impulse spending'],["What is the difference between needs and wants?","How much change do you get?","What would you save up for?"],'Financial literacy, math application, decision-making, and future planning',25,3),
      act('sals2','Digital Citizenship','Practice responsible, safe, and kind technology use',['Tablets or computers'],['Discuss internet safety rules: what to share, what never to share','Identify cyberbullying: what it is, how to respond, who to tell','Practice kind and constructive online communication','Create a personal digital citizenship pledge'],["Is this information safe to share online?","What would you do if someone was unkind to you online?","How can we be a good digital citizen?"],'Digital citizenship, online safety, responsible technology use, and kindness online',20,3),
      act('sals3','Meal Prep & Nutrition','Build nutrition knowledge and practical cooking skills',['Simple, safe ingredients','Age-appropriate kitchen tools'],['Plan a healthy balanced snack together','Prepare it safely with appropriate tools','Identify the nutrients and food groups in each ingredient','Share and enjoy the meal together as a class'],["What makes this snack healthy and balanced?","What would you add or change next time?"],'Nutrition literacy, practical cooking skills, health habits, and independence',30,3),
    ],
    health: [
      act('sah1','Mental Health Matters','Build emotional health literacy and coping skills',['Discussion prompts','Personal journals'],['Discuss mental health as an essential part of overall health','Normalize hard feelings: everyone has difficult days','Introduce and practice 5 healthy coping strategies','Journaling: "How I am feeling and what helps me"'],["What does mental health mean to you?","What helps you when you feel stressed or overwhelmed?","Who is someone safe you can talk to?"],'Mental health awareness, coping skills, help-seeking, and emotional resilience',20,3),
      act('sah2','Nutrition Label Investigation','Develop nutritional literacy and informed food choices',['Food labels from 4-6 different packaged products'],['Learn to read a nutrition label: what each number means','Find: calories, added sugar, protein, vitamins, serving size','Compare two similar foods side by side','Make an informed choice and explain your reasoning'],["Which food has less added sugar?","What is a realistic serving size?","Would you choose this food? Why or why not?"],'Nutritional literacy, analytical thinking, informed food choices, and health advocacy',20,3),
    ],
    character: [
      act('sach1','Community Service Project','Develop civic responsibility and meaningful compassion',['Project materials vary by service project'],['Identify a real community need together','Plan a concrete, achievable service project','Execute the project as a team','Reflect: "What impact did we make? What did we learn about ourselves?"'],["Why does this matter to you?","How did it feel to contribute to your community?","What did you learn about yourself?"],'Civic responsibility, compassion, community connection, and leadership in action',60,4),
      act('sach2','Integrity Dilemmas','Practice ethical reasoning and principled decision-making',['Age-appropriate scenario cards'],['Present an ethical dilemma: "Your friend asks you to lie for them. What do you do?"','Students discuss in small groups first','Share different perspectives respectfully','Conclude together: "What does acting with integrity look like here?"'],["What would the right thing be?","Why does integrity matter even when it is hard?","What would YOU actually do?"],'Moral reasoning, integrity, ethical decision-making, and principled action',20,4),
      act('sach3','Daily Gratitude Journal','Build a daily gratitude practice and growth mindset',['Personal gratitude journals'],['Write 3 specific things grateful for each day','Vary the prompts: a person, an experience, something in nature','Share one entry with a partner each week','Discuss: "How does practicing gratitude change how we feel?"'],["What are you genuinely grateful for today?","How does thinking about gratitude affect your mood?"],'Gratitude, positive thinking, growth mindset, and emotional well-being',10,2),
    ],
  },
}

export interface MilestoneItem { id: string; skill: string }
export type MilestonesDB = Record<AgeKey, Record<string, MilestoneItem[]>>

export const MILESTONES_DB: MilestonesDB = {
  infants: {
    language:    [{id:'iml1',skill:'Responds to own name'},{id:'iml2',skill:'Babbles and coos'},{id:'iml3',skill:'Imitates sounds'},{id:'iml4',skill:'Responds to familiar voices'}],
    cognitive:   [{id:'imc1',skill:'Object permanence'},{id:'imc2',skill:'Cause and effect awareness'},{id:'imc3',skill:'Explores objects with senses'},{id:'imc4',skill:'Sustained attention to faces'}],
    social:      [{id:'ims1',skill:'Social smile'},{id:'ims2',skill:'Secure caregiver attachment'},{id:'ims3',skill:'Stranger awareness'},{id:'ims4',skill:'Emotional signaling'}],
    physical:    [{id:'imp1',skill:'Head control'},{id:'imp2',skill:'Reach and grasp'},{id:'imp3',skill:'Rolling over'},{id:'imp4',skill:'Sits with support'}],
    creativity:  [{id:'imcr1',skill:'Responds to music'},{id:'imcr2',skill:'Vocalizes with delight'}],
    life_skills: [{id:'imls1',skill:'Self-feeding attempts'},{id:'imls2',skill:'Recognizes daily routines'}],
    health:      [{id:'imh1',skill:'Sleep self-soothing begins'},{id:'imh2',skill:'Clear hunger and fullness cues'}],
    character:   [{id:'imch1',skill:'Reciprocal back-and-forth interaction'},{id:'imch2',skill:'Shows trust in caregivers'}],
  },
  toddlers: {
    language:    [{id:'tml1',skill:'Uses 2-word phrases'},{id:'tml2',skill:'50+ word vocabulary'},{id:'tml3',skill:'Follows 2-step directions'},{id:'tml4',skill:'Names familiar people and objects'}],
    cognitive:   [{id:'tmc1',skill:'Sorts by shape or color'},{id:'tmc2',skill:'Completes simple 4-piece puzzle'},{id:'tmc3',skill:'Engages in symbolic play'},{id:'tmc4',skill:'Matches identical pictures'}],
    social:      [{id:'tms1',skill:'Parallel play with peers'},{id:'tms2',skill:'Shows empathy for others'},{id:'tms3',skill:'Turn-taking with support'},{id:'tms4',skill:'Expresses needs verbally'}],
    physical:    [{id:'tmp1',skill:'Runs without falling'},{id:'tmp2',skill:'Climbs stairs holding railing'},{id:'tmp3',skill:'Scribbles and makes marks'},{id:'tmp4',skill:'Stacks 6+ blocks'}],
    creativity:  [{id:'tmcr1',skill:'Engages in pretend play'},{id:'tmcr2',skill:'Sings parts of familiar songs'},{id:'tmcr3',skill:'Uses materials creatively'}],
    life_skills: [{id:'tmls1',skill:'Self-feeds with spoon'},{id:'tmls2',skill:'Helps put toys away'},{id:'tmls3',skill:'Attempts to put on clothing'}],
    health:      [{id:'tmh1',skill:'Washes hands with support'},{id:'tmh2',skill:'Names 5+ body parts'}],
    character:   [{id:'tmch1',skill:'Uses please and thank you with reminders'},{id:'tmch2',skill:'Notices when others are sad or hurt'}],
  },
  preschool: {
    language:    [{id:'pml1',skill:'Speaks in 5-6 word sentences'},{id:'pml2',skill:'Identifies beginning sounds'},{id:'pml3',skill:'Retells a simple 3-event story'},{id:'pml4',skill:'Asks why and how questions'}],
    cognitive:   [{id:'pmc1',skill:'Counts objects 1-to-1 up to 10'},{id:'pmc2',skill:'Recognizes most letters'},{id:'pmc3',skill:'Creates and extends patterns'},{id:'pmc4',skill:'Classifies by multiple attributes'}],
    social:      [{id:'pms1',skill:'Cooperative play with 2-3 peers'},{id:'pms2',skill:'Uses words to manage emotions'},{id:'pms3',skill:'Shows genuine empathy'},{id:'pms4',skill:'Follows classroom rules independently'}],
    physical:    [{id:'pmp1',skill:'Uses safety scissors on a line'},{id:'pmp2',skill:'Writes own first name'},{id:'pmp3',skill:'Catches a large ball'},{id:'pmp4',skill:'Balances on one foot 5 seconds'}],
    creativity:  [{id:'pmcr1',skill:'Draws recognizable human figure'},{id:'pmcr2',skill:'Sustained dramatic play with peers'},{id:'pmcr3',skill:'Creates original artwork with intent'}],
    life_skills: [{id:'pmls1',skill:'Completes classroom jobs independently'},{id:'pmls2',skill:'Manages personal belongings'},{id:'pmls3',skill:'Problem-solves with peers verbally'}],
    health:      [{id:'pmh1',skill:'Washes hands independently'},{id:'pmh2',skill:'Identifies healthy vs. unhealthy foods'},{id:'pmh3',skill:'Demonstrates basic safety awareness'}],
    character:   [{id:'pmch1',skill:'Takes responsibility for belongings'},{id:'pmch2',skill:'Understands and applies fairness'},{id:'pmch3',skill:'Expresses genuine gratitude'}],
  },
  school_age: {
    language:    [{id:'saml1',skill:'Reads grade-level text with comprehension'},{id:'saml2',skill:'Writes organized paragraphs'},{id:'saml3',skill:'Participates meaningfully in discussions'},{id:'saml4',skill:'Uses academic vocabulary appropriately'}],
    cognitive:   [{id:'samc1',skill:'Solves multi-step problems'},{id:'samc2',skill:'Applies STEM and engineering thinking'},{id:'samc3',skill:'Evaluates information critically'},{id:'samc4',skill:'Understands basic computational thinking'}],
    social:      [{id:'sams1',skill:'Resolves conflicts without adult help'},{id:'sams2',skill:'Takes positive leadership roles'},{id:'sams3',skill:'Collaborates effectively in groups'},{id:'sams4',skill:'Uses coping strategies under stress'}],
    physical:    [{id:'samp1',skill:'Participates positively in team sports'},{id:'samp2',skill:'Understands components of physical fitness'},{id:'samp3',skill:'Uses tools with precision and control'}],
    creativity:  [{id:'samcr1',skill:'Creates multimedia projects'},{id:'samcr2',skill:'Applies design thinking to real problems'}],
    life_skills: [{id:'samls1',skill:'Understands earn, save, spend, give'},{id:'samls2',skill:'Practices responsible and safe technology use'},{id:'samls3',skill:'Manages time to complete assignments'}],
    health:      [{id:'samh1',skill:'Recognizes emotions and knows when to seek help'},{id:'samh2',skill:'Makes informed food choices'}],
    character:   [{id:'samch1',skill:'Makes ethical choices when not observed'},{id:'samch2',skill:'Participates in community service'},{id:'samch3',skill:'Demonstrates growth mindset'}],
  },
}

export interface ScheduleSlot { time: string; name: string; type: string; cat: string | null; slotIndex?: number }
export type DailySchedule = Record<AgeKey, ScheduleSlot[]>

export const DAILY_SCHEDULE: DailySchedule = {
  infants: [
    {time:'7:00–8:00',  name:'Arrival & Settling',                type:'routine', cat:null},
    {time:'8:00–8:30',  name:'Morning Feeding',                   type:'care',    cat:'health'},
    {time:'8:30–9:15',  name:'Tummy Time & Sensory Exploration',  type:'learning',cat:'physical'},
    {time:'9:15–10:15', name:'Morning Nap',                       type:'care',    cat:null},
    {time:'10:15–10:45',name:'Language & Music Time',             type:'learning',cat:'language'},
    {time:'10:45–11:30',name:'Active Exploration Play',           type:'learning',cat:'cognitive'},
    {time:'11:30–12:00',name:'Feeding & Diapering',               type:'care',    cat:'health'},
    {time:'12:00–2:00', name:'Afternoon Nap',                     type:'care',    cat:null},
    {time:'2:00–2:30',  name:'Outdoor Time',                      type:'learning',cat:'health'},
    {time:'2:30–4:00',  name:'Afternoon Social Play',             type:'learning',cat:'social'},
    {time:'4:00–5:30',  name:'Feeding & Departure',               type:'care',    cat:null},
  ],
  toddlers: [
    {time:'7:00–8:30',  name:'Arrival & Free Exploration',        type:'routine', cat:null},
    {time:'8:30–9:00',  name:'Morning Circle',                    type:'learning',cat:'language'},
    {time:'9:00–9:50',  name:'Learning Centers',                  type:'learning',cat:null},
    {time:'9:50–10:10', name:'Snack Time',                        type:'care',    cat:'health'},
    {time:'10:10–11:00',name:'Outdoor Play',                      type:'learning',cat:'physical'},
    {time:'11:00–11:30',name:'Curriculum Activity Block',         type:'learning',cat:null},
    {time:'11:30–11:45',name:'Story Time',                        type:'learning',cat:'language'},
    {time:'11:45–12:15',name:'Lunch',                             type:'care',    cat:'health'},
    {time:'12:15–2:30', name:'Rest & Nap',                        type:'care',    cat:null},
    {time:'2:30–3:00',  name:'Afternoon Snack & Sharing',         type:'routine', cat:'social'},
    {time:'3:00–4:30',  name:'Afternoon Activities',              type:'learning',cat:null},
    {time:'4:30–5:30',  name:'Departure Routine',                 type:'routine', cat:null},
  ],
  preschool: [
    {time:'7:00–8:30',  name:'Arrival & Morning Work',            type:'routine', cat:null},
    {time:'8:30–9:00',  name:'Morning Circle',                    type:'learning',cat:'language'},
    {time:'9:00–9:50',  name:'Learning Centers',                  type:'learning',cat:null},
    {time:'9:50–10:00', name:'Clean-Up & Transition',             type:'routine', cat:'life_skills'},
    {time:'10:00–10:20',name:'Snack',                             type:'care',    cat:'health'},
    {time:'10:20–11:10',name:'Outdoor Play',                      type:'learning',cat:'physical'},
    {time:'11:10–11:45',name:'Curriculum Focus Block',            type:'learning',cat:null},
    {time:'11:45–12:00',name:'Story & Vocabulary',                type:'learning',cat:'language'},
    {time:'12:00–12:30',name:'Lunch',                             type:'care',    cat:'health'},
    {time:'12:30–2:30', name:'Rest Time',                         type:'care',    cat:null},
    {time:'2:30–3:15',  name:'Afternoon Creative Activity',       type:'learning',cat:'creativity'},
    {time:'3:15–4:00',  name:'Reflection & Gratitude Circle',     type:'routine', cat:'character'},
    {time:'4:00–5:30',  name:'Extended Care',                     type:'routine', cat:null},
  ],
  school_age: [
    {time:'7:00–8:30',  name:'Arrival & Homework Help',           type:'routine', cat:null},
    {time:'8:30–9:00',  name:'Morning Meeting',                   type:'learning',cat:'social'},
    {time:'9:00–9:50',  name:'Academic Block',                    type:'learning',cat:'cognitive'},
    {time:'9:50–10:40', name:'STEM & Science Time',               type:'learning',cat:'cognitive'},
    {time:'10:40–11:00',name:'Snack & Movement Break',            type:'care',    cat:'health'},
    {time:'11:00–11:45',name:'Creative Arts & Enrichment',        type:'learning',cat:'creativity'},
    {time:'11:45–12:15',name:'Lunch',                             type:'care',    cat:'health'},
    {time:'12:15–12:45',name:'Physical Education',                type:'learning',cat:'physical'},
    {time:'12:45–1:30', name:'Character & Life Skills',           type:'learning',cat:'character'},
    {time:'1:30–2:30',  name:'Project-Based Learning',            type:'learning',cat:'cognitive'},
    {time:'2:30–3:30',  name:'Reflection & Goal Setting',         type:'routine', cat:'character'},
    {time:'3:30–5:30',  name:'Homework & Extended Care',          type:'routine', cat:null},
  ],
}

/** Look up an activity by ID across all age groups and domains */
export function findActivity(activityId: string): Activity | null {
  for (const ageActivities of Object.values(ACTIVITY_LIBRARY)) {
    for (const domainActivities of Object.values(ageActivities)) {
      const found = domainActivities.find(a => a.id === activityId)
      if (found) return found
    }
  }
  return null
}

/** Compute per-domain progress % for a child given their tracked milestones */
export function computeProgress(ageKey: AgeKey, trackedMilestones: Record<string, MilestoneLevel>): Record<string, number> {
  const milestoneData = MILESTONES_DB[ageKey] || {}
  const progress: Record<string, number> = {}
  for (const cat of CURR_CATS) {
    const domain = milestoneData[cat.id] || []
    if (!domain.length) { progress[cat.id] = 0; continue }
    let points = 0
    for (const m of domain) {
      const level = trackedMilestones[m.id]
      if (level) points += ML_LEVELS.indexOf(level) + 1
    }
    const maxPoints = domain.length * ML_LEVELS.length
    progress[cat.id] = Math.round((points / maxPoints) * 100)
  }
  return progress
}
