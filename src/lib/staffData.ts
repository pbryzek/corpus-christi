export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  teaser: string;
  photo?: string;
  bio?: {
    pullquote: string;
    inspiring: string;
    saint: string;
    song: string;
    prayer: string;
    credentials: string;
    ritual: string;
    extra?: { title: string; text: string };
  };
}

export const staffMembers: StaffMember[] = [
  {
    id: 'leo',
    name: 'Fr. Leo',
    role: 'Pastor',
    email: 'office@cc-parish.org',
    photo: '/Leo_headshot.png',
    teaser: "Coming soon. (He's working on it.)",
  },
  {
    id: 'ankie',
    name: 'Ankie Edgar',
    role: 'Assistant to the Pastor',
    email: 'assistant@cc-parish.org',
    photo: '/ankie.png',
    teaser: '"When others shine, it brings light to our community."',
    bio: {
      pullquote: '"I call myself La Sombra \u2014 the shadow."',
      inspiring: 'I like being behind the scenes. I call myself "La Sombra" \u2014 the shadow. When others shine, it strengthens and brings light to our community. I enjoy helping others find their gifts and finding meaningful ways to use them.',
      saint: "My confirmation name is St. Anne \u2014 Mary's mother and grandmother of Jesus. We'd talk about motherhood and the important role that women have in the family. I wonder what it was like to be Jesus' grandmother\u2026",
      song: 'Make You Feel My Love (lyrics by Bob Dylan, performed by Adele). If you can, really listen to the words. I feel like that song is a love song from Jesus. I get choked up every time I hear it!',
      prayer: 'Constant stream of dialogue.',
      credentials: "On staff and in ministry at Corpus Christi for over 20 years. Teacher and coach \u2014 and as Fr. Leo puts it: not allowed to leave.",
      ritual: "If our family attends 5:00 mass, we usually pick up Chinese at Hunan Yuan on the way home \u2014 unless the Hospitality Committee is having a potluck (my husband Brad's favorite event!). We love the Montclair Farmers Market\u2026 and donuts after the 10:30 mass can't be missed!",
      extra: {
        title: 'A word from Ankie',
        text: "Sometimes we don't know how bad we're feeling until things start to improve, especially in our spiritual lives. If you feel something is missing in your life, try talking with Jesus. He's a soothing balm for troubled souls.",
      },
    },
  },
  {
    id: 'joe',
    name: 'Joe H\u00e9bert',
    role: 'Music Director',
    email: 'ccmusic322@gmail.com',
    photo: '/joe.png',
    teaser: '"I\'m 60% holy water. 40% sheet music."',
    bio: {
      pullquote: '"I\'m deeply moved by the courage it takes to sing through fear."',
      inspiring: "I'm deeply moved by the courage it takes to sing through fear. When we trust our voices and say yes to the moment, we make room for God to work miracles, big and small.",
      saint: 'Mother Teresa of Calcutta. I\'d ask her how we move beyond our fears to trust in the love and mercy of God. And I\'d share her two sayings that changed my life: "A smile is the beginning of love." And: "We cannot all do great things. But we can do small things with great love."',
      song: "Challenging question for a songwriter and musician. I'll start with the classical piece Nimrod by Edward Elgar.",
      prayer: 'Vulnerability, Gratitude, Trust.',
      credentials: 'Classically trained musician. Symphony, orchestral conducting, choral directing, studio recordings, and performance tours throughout the US and beyond. BA Music Performance, Cal State Hayward. Graduate Studies in Pastoral Ministry, Holy Names University. Post-Baccalaureate Studies in Cello Performance, Stanford University. Director of Music Ministry in the Diocese of Oakland since 1988. "I\'ve spent so long in the Diocese, I\'m now 60% holy water and 40% sheet music."',
      ritual: 'Starbucks \u2014 a comfortable atmosphere where I can count on parishioners coming through for a quick hello or cup of coffee.',
    },
  },
  {
    id: 'adrian',
    name: 'Adrian Mison Fulay',
    role: 'Confirmation Director',
    email: 'confirmation@cc-parish.org',
    photo: '/adrian.png',
    teaser: '"When a young person owns their faith, I see God\'s grace at work."',
    bio: {
      pullquote: '"Wonder, Gratitude, Praise."',
      inspiring: "Working with young people who are trying to live their faith and make it their own. When a young person tries to truly understand their faith in today's world, I see God's grace at work.",
      saint: 'St. John Bosco \u2014 patron of young people. I would ask him how he was able to draw out the best in the young people he encountered and give them hope during troubled times.',
      song: 'These Alone Are Enough by Dan Schutte. It always reminds me to be grateful for all my blessings.',
      prayer: 'Wonder, Gratitude, Praise.',
      credentials: 'BA in Political Science, Loyola Marymount University. Masters in Theological Studies, Jesuit School of Theology, Berkeley \u2014 focusing on Liturgy, Youth, and Inculturation. Catholic school educator for 32 years in Religion and Youth Ministry.',
      ritual: 'The Montclair Farmers Market for treats after Mass.',
    },
  },
  {
    id: 'mele',
    name: 'Mele Mortonson',
    role: 'School Principal',
    email: 'principal.mm@corpuschristischool.com',
    photo: '/mele.jpg',
    teaser: '"Prayer life in one word: essential."',
    bio: {
      pullquote: '"I would listen, listen, and listen some more."',
      inspiring: "I'm inspired by the trifecta of Catholic schools: children and their capacity to learn and love; educators and their ability to transform lives; and parents and their tireless contributions to community.",
      saint: 'Catherine of Siena. I would listen, listen, and listen some more!',
      song: "Open My Eyes by Jesse Manabusan brings me immediately into heart-open mode. My childhood favorite was Canticle of the Sun \u2014 so much joy and gratitude, you can't help but smile.",
      prayer: 'Essential.',
      credentials: 'BA in American Studies and Theology, Masters in American Studies \u2014 Saint Louis University. California Teaching Credential in English and Social Studies. Began teaching 8th grade at St. Elizabeth School in Oakland before becoming principal of St. Finn Barr Catholic School in San Francisco for nine years. In her fourteenth year as a Catholic school leader.',
      ritual: 'After Mass I love to head home to relax with my family and prepare a special meal or bake something new. Bonus points if the day includes a swim, walk, bike, or time together outside.',
    },
  },
  {
    id: 'rebeccah',
    name: 'Rebeccah Pelle',
    role: 'Family Faith Formation Director',
    email: 'familyfaith@cc-parish.org',
    photo: '/rebecca.png',
    teaser: '"I ask Mary for the parenting moments that didn\'t make the Gospels."',
    bio: {
      pullquote: '"I love seeing kids\' faces after their first sacrament \u2014 relieved and joyful."',
      inspiring: "I love seeing kids' faces as they return to their pew \u2014 looking relieved and joyful \u2014 after their first experience of a sacrament. I also love creating opportunities for families to talk together about their faith.",
      saint: "Might as well swing big. I'd love to talk to Thomas Aquinas \u2014 informed of the latest science \u2014 about how some of his theological ideas might be different today. If he's unavailable, I'd ask Mary for her best parenting moments that didn't make the Gospels.",
      song: "In Ev'ry Age by Janet Sullivan Whittaker has followed me for 25 years. And honestly, any secular song with a big crescendo \u2014 I'm looking at you, Coldplay and Mumford & Sons \u2014 connects my heart to God every time.",
      prayer: 'Liminal, friendly, beckoning.',
      credentials: 'In lay ministry leadership since age 16. Masters of Divinity, Jesuit School of Theology, Berkeley (2003). Previously at All Saints in Hayward and St. Augustine in Oakland.',
      ritual: 'I like to have lunch and take a deep breath on my back deck before jumping into whatever my family has planned for the afternoon.',
    },
  },
  {
    id: 'anne',
    name: 'Anne Kallin Zehren',
    role: 'Director, OCIA Ministry',
    email: 'ministry@cc-parish.org',
    photo: '/Screenshot_2026-05-12_114024.png',
    teaser: '"I love when someone walks in searching and walks out believing."',
    bio: {
      pullquote: '"When someone starts having \'God Moments\' \u2014 that\'s when the real learning begins."',
      inspiring: 'The Spiritual Transformation. When someone realizes they don\'t have to check their doubts at the door and they start having "God Moments." That\'s when the real learning begins.',
      saint: "I'd invite Saint Phoebe and Mary Magdalene to lunch. Two pioneering saints \u2014 the only deacon in the Bible, and the first witness to the resurrection. I'd ask what it's like to never have their stories read during Sunday Mass. And what they'd like people to know about them that's not in Scripture.",
      song: "Heal My Wounds is a song I wrote during a rough period in my life, inspired by Saint Bernadette and the healing waters at Lourdes. Anything by India.Arie (a REAL musician!). And our Music Director, Joe H\u00e9bert \u2014 his voice and cello playing has brought me to tears during Mass.",
      prayer: 'Non-stop. Raw. Awe. Kind of like the Psalms.',
      credentials: 'Graduate degree in Theological Studies, Jesuit School of Theology. BA, Marquette University. Trained Spiritual Director. Supposedly retired from 30 years of starting companies in Silicon Valley and NYC \u2014 including Publisher of Teen People and Glamour magazines. God had other plans. Loves mentoring female Founders and Entrepreneurs.',
      ritual: 'Coffee or brunch with my "Church Ladies": Mersea (if it\'s sunny), Grand Lake Kitchen, or Fentons \u2014 my son once described the Trinity with its Neapolitan ice cream, so it\'s officially Sacramental. But I\'m pretty sure Fenton\'s was sacred way before then!',
    },
  },
];

export function getStaffByEmail(email: string): StaffMember | undefined {
  return staffMembers.find(s => s.email === email);
}

export function getStaffById(id: string): StaffMember | undefined {
  return staffMembers.find(s => s.id === id);
}
