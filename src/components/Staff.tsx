import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, User } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

interface StaffMember {
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
    extra?: {
      title: string;
      text: string;
    };
  };
}

const staffMembers: StaffMember[] = [
  {
    id: 'leo',
    name: 'Fr. Leo',
    role: 'Pastor',
    email: 'office@cc-parish.org',
    photo: '/IMG_0622.jpg',
    teaser: 'Coming soon. (He\'s working on it.)',
  },
  {
    id: 'ankie',
    name: 'Ankie Edgar',
    role: 'Ministry Manager',
    email: 'assistant@cc-parish.org',
    photo: '/ankie.png',
    teaser: '"When others shine, it brings light to our community."',
    bio: {
      pullquote: '"I call myself La Sombra — the shadow."',
      inspiring: 'I like being behind the scenes. I call myself "La Sombra" — the shadow. When others shine, it strengthens and brings light to our community. I enjoy helping others find their gifts and finding meaningful ways to use them.',
      saint: 'My confirmation name is St. Anne — Mary\'s mother and grandmother of Jesus. We\'d talk about motherhood and the important role that women have in the family. I wonder what it was like to be Jesus\' grandmother…',
      song: 'Make You Feel My Love (lyrics by Bob Dylan, performed by Adele). If you can, really listen to the words. I feel like that song is a love song from Jesus. I get choked up every time I hear it!',
      prayer: 'Constant stream of dialogue.',
      credentials: 'On staff and in ministry at Corpus Christi for over 20 years. Teacher and coach — and as Fr. Leo puts it: not allowed to leave.',
      ritual: 'If our family attends 5:00 mass, we usually pick up Chinese at Hunan Yuan on the way home — unless the Hospitality Committee is having a potluck (my husband Brad\'s favorite event!). We love the Montclair Farmers Market… and donuts after the 10:30 mass can\'t be missed!',
      extra: {
        title: 'A word from Ankie',
        text: 'Sometimes we don\'t know how bad we\'re feeling until things start to improve, especially in our spiritual lives. If you feel something is missing in your life, try talking with Jesus. He\'s a soothing balm for troubled souls.',
      },
    },
  },
  {
    id: 'joe',
    name: 'Joe Hébert',
    role: 'Music Director',
    email: 'ccmusic322@gmail.com',
    photo: '/joe.png',
    teaser: '"I\'m 60% holy water. 40% sheet music."',
    bio: {
      pullquote: '"I\'m deeply moved by the courage it takes to sing through fear."',
      inspiring: 'I\'m deeply moved by the courage it takes to sing through fear. When we trust our voices and say yes to the moment, we make room for God to work miracles, big and small.',
      saint: 'Mother Teresa of Calcutta. I\'d ask her how we move beyond our fears to trust in the love and mercy of God. And I\'d share her two sayings that changed my life: "A smile is the beginning of love." And: "We cannot all do great things. But we can do small things with great love."',
      song: 'Challenging question for a songwriter and musician. I\'ll start with the classical piece Nimrod by Edward Elgar.',
      prayer: 'Vulnerability, Gratitude, Trust.',
      credentials: 'Classically trained musician. Symphony, orchestral conducting, choral directing, studio recordings, and performance tours throughout the US and beyond. BA Music Performance, Cal State Hayward. Graduate Studies in Pastoral Ministry, Holy Names University. Post-Baccalaureate Studies in Cello Performance, Stanford University. Director of Music Ministry in the Diocese of Oakland since 1988. "I\'ve spent so long in the Diocese, I\'m now 60% holy water and 40% sheet music."',
      ritual: 'Starbucks — a comfortable atmosphere where I can count on parishioners coming through for a quick hello or cup of coffee.',
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
      inspiring: 'Working with young people who are trying to live their faith and make it their own. When a young person tries to truly understand their faith in today\'s world, I see God\'s grace at work.',
      saint: 'St. John Bosco — patron of young people. I would ask him how he was able to draw out the best in the young people he encountered and give them hope during troubled times.',
      song: 'These Alone Are Enough by Dan Schutte. It always reminds me to be grateful for all my blessings.',
      prayer: 'Wonder, Gratitude, Praise.',
      credentials: 'BA in Political Science, Loyola Marymount University. Masters in Theological Studies, Jesuit School of Theology, Berkeley — focusing on Liturgy, Youth, and Inculturation. Catholic school educator for 32 years in Religion and Youth Ministry.',
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
      inspiring: 'I\'m inspired by the trifecta of Catholic schools: children and their capacity to learn and love; educators and their ability to transform lives; and parents and their tireless contributions to community.',
      saint: 'Catherine of Siena. I would listen, listen, and listen some more!',
      song: 'Open My Eyes by Jesse Manabusan brings me immediately into heart-open mode. My childhood favorite was Canticle of the Sun — so much joy and gratitude, you can\'t help but smile.',
      prayer: 'Essential.',
      credentials: 'BA in American Studies and Theology, Masters in American Studies — Saint Louis University. California Teaching Credential in English and Social Studies. Began teaching 8th grade at St. Elizabeth School in Oakland before becoming principal of St. Finn Barr Catholic School in San Francisco for nine years. In her fourteenth year as a Catholic school leader.',
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
      pullquote: '"I love seeing kids\' faces after their first sacrament — relieved and joyful."',
      inspiring: 'I love seeing kids\' faces as they return to their pew — looking relieved and joyful — after their first experience of a sacrament. I also love creating opportunities for families to talk together about their faith.',
      saint: 'Might as well swing big. I\'d love to talk to Thomas Aquinas — informed of the latest science — about how some of his theological ideas might be different today. If he\'s unavailable, I\'d ask Mary for her best parenting moments that didn\'t make the Gospels.',
      song: 'In Ev\'ry Age by Janet Sullivan Whittaker has followed me for 25 years. And honestly, any secular song with a big crescendo — I\'m looking at you, Coldplay and Mumford & Sons — connects my heart to God every time.',
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
      pullquote: '"When someone starts having \'God Moments\' — that\'s when the real learning begins."',
      inspiring: 'The Spiritual Transformation. When someone realizes they don\'t have to check their doubts at the door and they start having "God Moments." That\'s when the real learning begins.',
      saint: 'I\'d invite Saint Phoebe and Mary Magdalene to lunch. Two pioneering saints — the only deacon in the Bible, and the first witness to the resurrection. I\'d ask what it\'s like to never have their stories read during Sunday Mass. And what they\'d like people to know about them that\'s not in Scripture.',
      song: 'Heal My Wounds is a song I wrote during a rough period in my life, inspired by Saint Bernadette and the healing waters at Lourdes. Anything by India.Arie (a REAL musician!). And our Music Director, Joe Hébert — his voice and cello playing has brought me to tears during Mass.',
      prayer: 'Non-stop. Raw. Awe. Kind of like the Psalms.',
      credentials: 'Graduate degree in Theological Studies, Jesuit School of Theology. BA, Marquette University. Trained Spiritual Director. Supposedly retired from 30 years of starting companies in Silicon Valley and NYC — including Publisher of Teen People and Glamour magazines. God had other plans. Loves mentoring female Founders and Entrepreneurs.',
      ritual: 'Coffee or brunch with my "Church Ladies": Mersea (if it\'s sunny), Grand Lake Kitchen, or Fentons — my son once described the Trinity with its Neapolitan ice cream, so it\'s officially Sacramental. But I\'m pretty sure Fenton\'s was sacred way before then!',
    },
  },
];

export default function Staff() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  useEffect(() => {
    const memberId = searchParams.get('member');
    if (memberId) {
      const member = staffMembers.find(m => m.id === memberId);
      if (member) {
        setSelectedStaff(member);
      }
    }
  }, [searchParams]);

  if (selectedStaff) {
    return (
      <section id="staff" className="bg-sky-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => {
              setSelectedStaff(null);
              setSearchParams({});
            }}
            className="inline-flex items-center gap-2 text-base text-[#1e3a6e]/80 hover:text-[#1e3a6e] border border-blue-200 bg-white px-4 py-2 rounded-lg mb-10 transition"
          >
            <ArrowLeft size={16} />
            Back to Team
          </button>

          {selectedStaff.bio ? (
            <>
              <div className="bg-[#1e3a6e] text-white rounded-xl p-10 mb-10 text-center">
                <p className="text-3xl font-light leading-relaxed italic">
                  {selectedStaff.bio.pullquote}
                </p>
              </div>

              <div className="grid md:grid-cols-[180px_1fr] gap-8 items-start mb-10 pb-10 border-b border-blue-100">
                <div className="aspect-[3/4] border border-blue-200 rounded-lg bg-blue-100 flex items-center justify-center overflow-hidden">
                  {selectedStaff.photo ? (
                    <img src={selectedStaff.photo} alt={selectedStaff.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-blue-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-4xl font-bold mb-1">{selectedStaff.name}</h2>
                  <p className="text-base text-[#1e3a6e]/80 mb-4">{selectedStaff.role}</p>
                  <a
                    href={`mailto:${selectedStaff.email}`}
                    className="text-base text-[#1e3a6e] border-b border-slate-900 inline-flex items-center gap-2"
                  >
                    <Mail size={14} />
                    {selectedStaff.email === 'office@cc-parish.org' ? selectedStaff.email : `Contact ${selectedStaff.name}`}
                  </a>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-amber-200 rounded-lg p-6 bg-amber-50 shadow-sm">
                  <p className="text-sm font-semibold tracking-wider uppercase text-amber-600 mb-3">
                    The most inspiring part of their ministry
                  </p>
                  <p className="text-base text-[#1e3a6e]/80 leading-relaxed">
                    {selectedStaff.bio.inspiring}
                  </p>
                </div>

                <div className="border border-rose-200 rounded-lg p-6 bg-rose-50 shadow-sm">
                  <p className="text-sm font-semibold tracking-wider uppercase text-rose-500 mb-3">
                    Saint they'd have coffee with
                  </p>
                  <p className="text-base text-[#1e3a6e]/80 leading-relaxed">
                    {selectedStaff.bio.saint}
                  </p>
                </div>

                <div className="border border-emerald-200 rounded-lg p-6 bg-emerald-50 shadow-sm">
                  <p className="text-sm font-semibold tracking-wider uppercase text-emerald-600 mb-3">
                    Song that feels like God
                  </p>
                  <p className="text-base text-[#1e3a6e]/80 leading-relaxed">
                    {selectedStaff.bio.song}
                  </p>
                </div>

                <div className="border border-sky-200 rounded-lg p-6 bg-sky-50 shadow-sm">
                  <p className="text-sm font-semibold tracking-wider uppercase text-sky-600 mb-3">
                    Prayer life in three words
                  </p>
                  <p className="text-base text-[#1e3a6e]/80 leading-relaxed">
                    {selectedStaff.bio.prayer}
                  </p>
                </div>

                <div className="md:col-span-2 border border-orange-200 rounded-lg p-6 bg-orange-50">
                  <p className="text-sm font-semibold tracking-wider uppercase text-orange-500 mb-3">
                    Street Cred
                  </p>
                  <p className="text-base text-[#1e3a6e]/80 leading-relaxed">
                    {selectedStaff.bio.credentials}
                  </p>
                </div>

                <div className="md:col-span-2 border border-teal-200 rounded-lg p-6 bg-teal-50 shadow-sm">
                  <p className="text-sm font-semibold tracking-wider uppercase text-teal-600 mb-3">
                    Favorite ritual after Mass
                  </p>
                  <p className="text-base text-[#1e3a6e]/80 leading-relaxed">
                    {selectedStaff.bio.ritual}
                  </p>
                </div>

                {selectedStaff.bio.extra && (
                  <div className="md:col-span-2 border border-fuchsia-200 rounded-lg p-6 bg-fuchsia-50">
                    <p className="text-sm font-semibold tracking-wider uppercase text-fuchsia-500 mb-3">
                      {selectedStaff.bio.extra.title}
                    </p>
                    <p className="text-base text-[#1e3a6e]/80 leading-relaxed">
                      {selectedStaff.bio.extra.text}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="border-2 border-dashed border-blue-200 rounded-xl p-16 text-center text-blue-400">
              <strong className="block text-2xl text-blue-500 mb-3">
                {selectedStaff.name} — {selectedStaff.role}
              </strong>
              <p className="text-base">Bio coming soon. (He's working on it.)</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="staff" className="bg-sky-50">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 p-12 max-w-7xl mx-auto">
        {staffMembers.map((member) => (
          <button
            key={member.id}
            onClick={() => setSelectedStaff(member)}
            className="text-center cursor-pointer transition hover:-translate-y-1 group flex flex-col"
          >
            <div className="aspect-[3/4] w-full border-2 border-blue-200 rounded-lg bg-blue-50 flex items-center justify-center mb-4 group-hover:border-[#1e3a6e] transition overflow-hidden">
              {member.photo ? (
                <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-blue-400" />
              )}
            </div>
            <h3 className="text-base font-bold text-[#1e3a6e] mb-1">{member.name}</h3>
            <p className="text-sm text-[#1e3a6e]/80 mb-3 leading-tight">{member.role}</p>
            <p className="text-sm text-[#1e3a6e]/70 italic leading-snug pt-3 border-t border-blue-100 flex-1">
              {member.teaser}
            </p>
            <p className="text-sm text-blue-400 mt-3">Click to meet</p>
          </button>
        ))}
      </div>
    </section>
  );
}
