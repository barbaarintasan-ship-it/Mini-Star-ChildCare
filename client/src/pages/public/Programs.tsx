import { useNavigate } from 'react-router-dom'

const PROGRAMS = [
  {
    icon: '🍼', title: 'Infants', age: '0–1 year', tagline: 'Nurturing care that supports every milestone from birth',
    img: '/images/infants.jpg', imgAlt: 'Caregiver gently holding a smiling baby',
    headerColor: 'bg-gold',
    cols: [
      { head: '🎯 Development Goals', items: ['Develop secure attachment with caregivers','Build sensory awareness and early motor control','Establish consistent feeding and sleep rhythms','Begin early communication through sounds and gestures'] },
      { head: '📚 Learning Domains', items: ['Sensory Development','Language & Early Communication','Motor Skills (gross & fine)','Emotional Bonding & Security','Practical Life Routines'] },
      { head: '🕐 Daily Routine', items: ['Responsive feeding on demand','Tummy time & movement exploration','Sensory play: textures, sounds, light','Songs, rhymes, and narrated routines','Rest and comfort care'] },
      { head: '✅ Key Milestones Tracked', items: ['Responds to name and familiar voices','Reaches for and grasps objects','Rolls over, sits with support, stands','Babbles and imitates sounds','Shows object permanence'] },
      { head: '🗓️ Example Activities', items: ['Peek-a-boo and hide-the-toy games','Texture exploration boards','Mirror play and face recognition','Rattle shaking and sound discovery','Gentle music & movement sessions'] },
      { head: '💬 What Parents Receive', items: ['Daily feeding & nap log','Mood & comfort report','Activity notes from caregiver','Milestone alerts when reached','Weekly developmental summary'] },
    ],
  },
  {
    icon: '🧒', title: 'Toddlers', age: '1–3 years', tagline: 'Building independence, language, and early thinking through play',
    img: '/images/toddlers.jpg', imgAlt: 'Toddlers playing with colorful blocks',
    headerColor: 'bg-coral',
    cols: [
      { head: '🎯 Development Goals', items: ['Expand vocabulary rapidly through conversation','Build independence in basic self-care tasks','Develop cause-and-effect understanding','Learn to express emotions appropriately'] },
      { head: '📚 Learning Domains', items: ['Language & Communication','Cognitive Development','Social-Emotional Skills','Practical Life & Self-Care','Early Leadership Awareness'] },
      { head: '🕐 Daily Routine', items: ['Circle time: greetings, songs, movement','Structured play with learning materials','Snack time & self-feeding practice','Outdoor exploration and gross motor play','Story time & naptime routine'] },
      { head: '✅ Key Milestones Tracked', items: ['Uses 2-word phrases then full sentences','Sorts by color, shape, and size','Follows 2-step instructions','Washes hands with reminders','Plays alongside and begins cooperating'] },
      { head: '🗓️ Example Activities', items: ['Block stacking & knock-down games','Color sorting trays and matching puzzles','Pretend cooking and dramatic play','Finger painting and sensory bins','"Helper of the day" task rotation'] },
      { head: '💰 Financial Literacy Intro', items: ['Concepts of "mine" and "sharing"','Pretend store play & "buying" items','Understanding "we wait" vs. "we get now"','Helping tidy supplies (ownership)'] },
    ],
  },
  {
    icon: '🎨', title: 'Preschoolers', age: '3–5 years', tagline: 'School readiness through creativity, curiosity, and confidence',
    img: '/images/preschool.jpg', imgAlt: 'Children painting at a table',
    headerColor: 'bg-teal',
    cols: [
      { head: '🎯 Development Goals', items: ['Build pre-reading and early writing skills','Develop number sense and early math concepts','Learn to work collaboratively in groups','Build confidence through leadership roles'] },
      { head: '📚 Learning Domains', items: ['Literacy & Language Arts','Early Mathematics','Critical Thinking & Problem Solving','Creativity & Innovation','Leadership & Financial Literacy'] },
      { head: '🕐 Daily Routine', items: ['Morning meeting: calendar, weather, theme','Structured literacy & math lesson','Art studio or science exploration','Outdoor play with learning objectives','Leadership circle & reflection time'] },
      { head: '✅ Key Milestones Tracked', items: ['Recognizes all 26 letters (upper & lower)','Counts to 20 and understands quantity','Writes own first name legibly','Retells a story with beginning/middle/end','Resolves conflicts with words'] },
      { head: '🗓️ Example Activities', items: ['Shape & color mixing science experiments','Letter formation practice & sound games','Pretend store with coin counting','Group mural & collaborative art projects','Nature journaling & observation walks'] },
      { head: '🌟 Leadership & Financial Literacy', items: ['Weekly "Helper of the Day" job rotations','Group decision-making exercises','Saving coins for a class "purchase"','Mini entrepreneurship: design & sell art'] },
    ],
  },
  {
    icon: '🏫', title: 'School-Age', age: '5–12 years', tagline: 'Expanding knowledge, leadership, and real-world life skills',
    img: '/images/school-age.jpg', imgAlt: 'School-age children arriving at care',
    headerColor: 'bg-night',
    cols: [
      { head: '🎯 Development Goals', items: ['Strengthen academic skills across all subjects','Build leadership, teamwork, and mentoring skills','Develop financial literacy and entrepreneurship mindset','Prepare for real-world independence'] },
      { head: '📚 Learning Domains', items: ['Academic Support & Critical Thinking','Leadership Development','Financial Literacy & Entrepreneurship','Project-Based Learning','Emotional Intelligence & Life Skills'] },
      { head: '🕐 Daily Routine', items: ['Homework support with caregiver guidance','Structured enrichment activity (STEAM, art, etc.)','Physical activity or outdoor project','Leadership or entrepreneurship challenge','Reflection & goal-setting circle'] },
      { head: '✅ Key Milestones Tracked', items: ['Reading comprehension at grade level','Multi-step math problem solving','Completes a project from idea to presentation','Mentors a younger child independently','Creates and explains a simple budget'] },
      { head: '🗓️ Example Activities', items: ['Mini business plan creation & pitching','STEAM challenges: build, test, improve','Debate club & persuasive writing','Community helper research projects','Goal-setting journals & vision boards'] },
      { head: '💡 Entrepreneurship Pathway', items: ['Stage 1: Identify problems worth solving','Stage 2: Design and prototype a solution','Stage 3: Present to peers and get feedback','Budget planning for a class micro-project'] },
    ],
  },
]

const DOMAINS = [
  { ic: '📚', b: 'Language Development',   s: 'Reading, speaking, listening, and communication',     bg: 'bg-gold/10 border-gold/30' },
  { ic: '📐', b: 'Early Mathematics',       s: 'Numbers, patterns, shapes, and logical thinking',     bg: 'bg-coral/10 border-coral/30' },
  { ic: '🔬', b: 'Science & Discovery',     s: 'Exploration, observation, and how things work',       bg: 'bg-teal/10 border-teal/30' },
  { ic: '🧠', b: 'Critical Thinking',       s: 'Problem-solving, analysis, and reasoning',            bg: 'bg-night/10 border-night/30' },
  { ic: '🎨', b: 'Creativity & Innovation', s: 'Art, music, imagination, and original ideas',         bg: 'bg-gold/10 border-gold/30' },
  { ic: '🌟', b: 'Leadership Skills',       s: 'Decision-making, teamwork, and responsibility',       bg: 'bg-coral/10 border-coral/30' },
  { ic: '💰', b: 'Financial Literacy',      s: 'Value of money, saving, earning, and budgeting',      bg: 'bg-teal/10 border-teal/30' },
  { ic: '💡', b: 'Entrepreneurship',        s: 'Initiative, creative ideas, and building solutions',  bg: 'bg-night/10 border-night/30' },
  { ic: '🏠', b: 'Practical Life Skills',   s: 'Self-care, tidiness, responsibility, and routines',   bg: 'bg-gold/10 border-gold/30' },
  { ic: '❤️', b: 'Emotional Intelligence',  s: 'Self-awareness, empathy, and social skills',          bg: 'bg-coral/10 border-coral/30' },
]

export default function Programs() {
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

      {/* Header */}
      <section>
        <p className="section-eyebrow">★ Programs</p>
        <h2 className="text-night mb-2">Structured Curriculum for Every Age — Birth to 12 Years</h2>
        <p className="text-gray-500 text-sm">
          Our research-based curriculum grows with your child. Every program is tailored to the specific developmental stage, building knowledge, character, and life skills from day one.
        </p>
      </section>

      {/* Journey Bar */}
      <div className="flex items-center justify-center gap-1 flex-wrap">
        {[
          { age: '0–1 Year',  name: 'Infants',    icon: '🍼', focus: 'Sensory & Bonding',    color: 'bg-gold text-white' },
          { age: '1–3 Years', name: 'Toddlers',   icon: '🧒', focus: 'Language & Play',       color: 'bg-coral text-white' },
          { age: '3–5 Years', name: 'Preschool',  icon: '🎨', focus: 'School Readiness',      color: 'bg-teal text-white' },
          { age: '5–12 Years',name: 'School-Age', icon: '🏫', focus: 'Leadership & Life',     color: 'bg-night text-white' },
        ].map((s, i, arr) => (
          <>
            <div key={s.name} className={`rounded-2xl px-4 py-3 text-center ${s.color} min-w-[110px]`}>
              <div className="text-xs opacity-70 font-700">{s.age}</div>
              <div className="text-xl my-1">{s.icon}</div>
              <div className="font-heading font-600 text-sm">{s.name}</div>
              <div className="text-xs opacity-70 mt-0.5">{s.focus}</div>
            </div>
            {i < arr.length - 1 && <span key={`arr-${i}`} className="text-gray-300 text-xl font-700 hidden sm:block">→</span>}
          </>
        ))}
      </div>

      {/* Program Cards */}
      {PROGRAMS.map((prog) => (
        <div key={prog.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Card header */}
          <div className={`${prog.headerColor} px-6 py-4 flex items-center gap-4`}>
            <span className="text-4xl">{prog.icon}</span>
            <div className="flex-1">
              <h3 className="font-heading text-xl font-600 text-white">{prog.title}</h3>
              <p className="text-white/70 text-sm">{prog.tagline}</p>
            </div>
            <span className="bg-white/20 text-white text-xs font-800 px-3 py-1 rounded-full shrink-0">{prog.age}</span>
          </div>

          {/* Program photo */}
          <img
            src={prog.img}
            alt={prog.imgAlt}
            className="w-full h-52 object-cover"
          />

          {/* Detail grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {prog.cols.map(({ head, items }) => (
              <div key={head} className="p-5">
                <p className="text-xs font-800 text-gray-500 mb-2">{head}</p>
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item} className="text-xs text-gray-600 flex items-start gap-1.5">
                      <span className="text-gold mt-0.5 shrink-0">•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 10 Domains */}
      <section>
        <p className="section-eyebrow">★ What children learn</p>
        <h3 className="font-heading text-xl font-600 text-night mb-2">10 Core Development Domains</h3>
        <p className="text-gray-500 text-sm mb-6">
          Our curriculum spans every dimension of a child's growth — academic, social, emotional, and life-skills — preparing them for school and for life.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {DOMAINS.map(({ ic, b, s, bg }) => (
            <div key={b} className={`rounded-2xl border p-4 text-center ${bg}`}>
              <div className="text-2xl mb-2">{ic}</div>
              <b className="text-xs text-night block mb-1">{b}</b>
              <span className="text-[11px] text-gray-500">{s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Every day includes */}
      <div className="card border-l-4 border-l-teal">
        <p className="font-700 text-night mb-3">Every day at Mini Star includes:</p>
        <ul className="space-y-1.5 mb-4">
          {[
            'Structured learning aligned to each child\'s age and development stage',
            'Hands-on creative activities with clear learning objectives',
            'Social-emotional skill building and guided group interaction',
            'Caring, attentive supervision from trained caregivers',
            'Progress tracking and parent reports delivered every week',
          ].map((item) => (
            <li key={item} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-teal mt-0.5 shrink-0">✓</span>{item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-500">
          Our program builds confident, independent children with a lifelong love for learning — not just a safe place to wait for pickup.
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <button type="button" className="btn btn-primary" onClick={() => navigate('/enrollment')}>Ask About Openings</button>
        <button type="button" className="btn btn-outline" onClick={() => navigate('/contact')}>Contact Us</button>
      </div>

    </div>
  )
}
