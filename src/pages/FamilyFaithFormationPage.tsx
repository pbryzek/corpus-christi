import { usePageData } from '../lib/usePageData';
import { getStaffByEmail } from '../lib/staffData';

export default function FamilyFaithFormationPage() {
  const { content, contacts, photos } = usePageData('family-faith-formation');
  const staffRebeccah = getStaffByEmail('familyfaith@cc-parish.org');

  const hero = content['hero'];
  const quote = content['quote'];
  const formation = content['formation'];
  const sacraments = content['sacraments'];
  const jrHigh = content['jr-high'];
  const contact = contacts[0];
  const heroPhoto = photos.find(p => p.is_featured);

  const workshopPhotos = photos.filter(p =>
    p.caption?.includes('Workshop') || p.caption?.includes('Family Sessions')
  );
  const sacramentPhotos = photos.filter(p =>
    p.caption?.includes('Communion') || p.caption?.includes('Reconciliation')
  );
  const jrHighPhotos = photos.filter(p =>
    p.caption?.includes('Jr High') || p.caption?.includes('Year One')
  );
  const familyPhoto = photos.find(p => p.caption?.includes('Rebeccah'));

  const workshops = [
    { title: 'Art', description: 'Hands-on, creative exploration of faith through art.', image: workshopPhotos[0]?.image_url || '/FFF_Art.jpg' },
    { title: 'Music', description: 'Faith comes alive through song and sound.', image: workshopPhotos[1]?.image_url || '/Music_compressed.jpg' },
    { title: 'Cooking', description: 'From the kitchen to the soul — faith through food.', image: workshopPhotos[2]?.image_url || '/cooking.png' },
    { title: 'Whole Family Sessions', description: 'Parents and children explore faith side by side.', image: workshopPhotos[3]?.image_url || '/FFF_-_boy_coloring.jpg' },
  ];

  return (
    <div className="min-h-screen bg-sky-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-5 gap-8 items-center mb-8">
          <div className="md:col-span-3">
            <h1 className="text-5xl md:text-6xl font-bold font-serif text-slate-900 mb-4">
              {hero?.title || 'God Loves Your Kids. And So Do We.'}
            </h1>
            <p className="text-2xl font-serif text-slate-600 italic mb-6">
              {hero?.subtitle || 'Our Faith Formation program brings your whole family closer to God.'}
            </p>
            <p className="text-lg text-slate-700 mb-6 leading-relaxed">
              {hero?.body_text || 'Welcome to Faith Formation That Inspires Your Child and Brings Your Family Together.'}
            </p>
            <div className="flex gap-4 flex-wrap">
              <a
                href={hero?.link_url || 'https://docs.google.com/forms/d/e/1FAIpQLSfYJOljbOVuy2-qq9DrMJv1M7xaJgXM8f1IWUkTNsGTpa3utQ/viewform?usp=send_form'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-700 text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-blue-800 transition-colors"
              >
                {hero?.link_label || 'Enroll Now →'}
              </a>
              <a
                href={`mailto:${contact?.email || 'familyfaith@cc-parish.org'}`}
                className="border border-blue-300 text-blue-800 px-6 py-3 rounded-lg text-base font-medium hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                Contact {contact?.name || 'Rebeccah Pelle'}
              </a>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="rounded-lg overflow-hidden aspect-[3/4]">
              <img src={heroPhoto?.image_url || hero?.image_url || '/_JoyGroupShot.jpg'} alt={heroPhoto?.caption || 'Joyful children at Faith Formation'} className="w-full h-full object-cover object-center" />
            </div>
          </div>
        </div>

        <div className="border-l-4 border-blue-600 bg-blue-100 rounded-r-xl px-8 py-7 mb-12">
          <p className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3 leading-relaxed">
            {quote?.title || '"I love seeing kids\' faces as they return to their pew — relieved and joyful — after their first experience of a sacrament."'}
          </p>
          <p className="text-base text-slate-600 italic">
            {quote?.subtitle || '— Rebeccah Pelle, Family Faith Formation Director'}
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-4xl font-semibold text-slate-900 mb-4">
            {formation?.title || 'Real Formation. Real Joy. Real Community.'}
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-8">
            {formation?.body_text || 'Every month, September through May, families and kids gather for something that feels less like school and more like community. TK through 8th grade. Three sessions a month, 9-10:15am. Some mornings bring the whole family together. Others are just for kids — rotating through creative, hands-on workshops that make faith tangible, memorable, and genuinely fun.'}
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {workshops.map((workshop, idx) => (
              <div
                key={idx}
                className="border border-blue-200 rounded-lg bg-white overflow-hidden"
              >
                <div className="bg-blue-50 aspect-[4/3] border-b border-blue-100 overflow-hidden">
                  <img src={workshop.image} alt={`${workshop.title} Workshop`} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h4 className="text-base font-bold text-slate-900 mb-2">{workshop.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{workshop.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-4xl font-semibold text-slate-900 mb-4">
            {sacraments?.title || 'We Belong to God and Each Other.'}
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-8">
            {sacraments?.body_text || "That's what the sacraments remind us. That's what we celebrate here. Walking with you through the sacred moments."}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-blue-200 rounded-lg bg-white overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img src={sacramentPhotos[0]?.image_url || '/Girl_Eucharist.Parents.jpg'} alt="First Communion" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">First Communion</h3>
                <p className="text-base text-slate-700 leading-relaxed mb-4">
                  Six family sessions beginning in January for children 7 and older, woven into the 10:30am Mass with time after. Fair warning: parents usually leave just as inspired as their kids.
                </p>
                <a href={`mailto:${contact?.email || 'familyfaith@cc-parish.org'}`} className="text-sm text-sky-500 hover:text-sky-700 transition">
                  Contact {contact?.name || 'Rebeccah Pelle'} →
                </a>
              </div>
            </div>

            <div className="border border-blue-200 rounded-lg bg-white overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img src={sacramentPhotos[1]?.image_url || '/Screenshot_2026-04-10_095603.png'} alt="First Reconciliation" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">First Reconciliation</h3>
                <p className="text-base text-slate-700 leading-relaxed mb-4">
                  Spoiler: it's nothing like what you remember. The dark box and the terrifying screen are gone. What's left is just grace — and your child walking out lighter than they walked in. Four family sessions beginning in October for children in 4th grade and older.
                </p>
                <a href={`mailto:${contact?.email || 'familyfaith@cc-parish.org'}`} className="text-sm text-sky-500 hover:text-sky-700 transition">
                  Contact {contact?.name || 'Rebeccah Pelle'} →
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-4xl font-semibold text-slate-900 mb-4">
            {jrHigh?.title || 'Jr High & Year One Confirmation.'}
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-8">
            {jrHigh?.body_text || 'Rebeccah Pelle also guides students in grades 6-9 through Junior High faith formation and Year One of the Confirmation journey. Monthly gatherings on Sunday mornings or the 3rd Saturday of the month. To qualify for Year Two of Confirmation, 9th graders must attend at least 8 sessions over the course of the year.'}
          </p>

          <div className="space-y-4">
            <div className="border border-blue-200 rounded-lg bg-white overflow-hidden grid md:grid-cols-[200px_1fr]">
              <div className="overflow-hidden border-b md:border-b-0 md:border-r border-blue-100">
                <img src={jrHighPhotos[0]?.image_url || '/Confirmation.jpg'} alt="Jr High Faith Formation" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Jr High Faith Formation (Grades 6-8)</h3>
                <p className="text-base text-slate-700 leading-relaxed mb-4">
                  Monthly gatherings that meet teens where they are — real conversations, real community, real faith. Sunday mornings or the 3rd Saturday of the month.
                </p>
                <a href={`mailto:${contact?.email || 'familyfaith@cc-parish.org'}`} className="text-sm text-sky-500 hover:text-sky-700 transition">
                  Contact {contact?.name || 'Rebeccah Pelle'} →
                </a>
              </div>
            </div>

            <div className="border border-blue-200 rounded-lg bg-white overflow-hidden grid md:grid-cols-[200px_1fr]">
              <div className="overflow-hidden border-b md:border-b-0 md:border-r border-blue-100">
                <img src={jrHighPhotos[1]?.image_url || '/Confirmation1.jpg'} alt="Year One Confirmation" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Year One Confirmation (9th Grade)</h3>
                <p className="text-base text-slate-700 leading-relaxed mb-4">
                  The first step in the two-year Confirmation journey. 9th graders need at least 8 sessions to qualify for Year Two with Confirmation Director Adrian Mison Fulay.
                </p>
                <a href="/confirmation" className="text-sm text-sky-500 hover:text-sky-700 transition mb-3 inline-block">
                  Learn more about Confirmation →
                </a>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2 text-base text-blue-900">
                  <span>→ Ready for Confirmation?</span>
                  <a href="mailto:confirmation@cc-parish.org" className="font-bold text-blue-900 border-b border-blue-300 hover:border-blue-600 transition">Contact Adrian Mison Fulay</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-slate-900 mb-8">Meet {contact?.name?.split(' ')[0] || 'Rebeccah'}.</h2>
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-1">
              <img
                src={familyPhoto?.image_url || contact?.image_url || staffRebeccah?.photo || '/rebecca.png'}
                alt={contact?.name || 'Rebeccah Pelle'}
                className="aspect-[3/4] w-full object-cover rounded-xl mb-4"
              />
              <h3 className="text-lg font-bold text-slate-900">{contact?.name || staffRebeccah?.name || 'Rebeccah Pelle'}</h3>
              <p className="text-sm text-slate-500 mt-1 mb-2">{contact?.role || staffRebeccah?.role || 'Family Faith Formation Director'}</p>
              <a
                href={`mailto:${contact?.email || staffRebeccah?.email || 'familyfaith@cc-parish.org'}`}
                className="text-sm text-blue-700 border-b border-blue-200 hover:border-blue-700 transition"
              >
                Contact {contact?.name?.split(' ')[0] || 'Rebeccah'}
              </a>
            </div>
            <div className="md:col-span-4 space-y-4">
              <div className="bg-teal-700 text-white rounded-xl p-8 shadow-md">
                <p className="text-sm font-bold tracking-widest uppercase text-teal-200 mb-3">The most inspiring part of her ministry</p>
                <p className="text-lg font-semibold leading-relaxed">
                  "{staffRebeccah?.bio?.inspiring || "I love seeing kids' faces as they return to their pew — looking relieved and joyful — after their first experience of a sacrament. I also love creating opportunities for families to talk together about their faith."}"
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-emerald-700 rounded-xl p-6 flex flex-col justify-center shadow-md">
                  <p className="text-sm font-bold tracking-widest uppercase text-emerald-200 mb-2">Prayer life in three words</p>
                  <p className="text-2xl font-bold text-white leading-snug mt-2">
                    {(staffRebeccah?.bio?.prayer || 'Liminal, friendly, beckoning.').split(',').map((w, i) => <span key={i}>{w.trim()}<br /></span>)}
                  </p>
                </div>
                <div className="md:col-span-2 border border-amber-500 rounded-xl p-6 bg-amber-600 shadow-md">
                  <p className="text-sm font-bold tracking-widest uppercase text-amber-200 mb-2">Saint she'd have to lunch</p>
                  <p className="text-base text-amber-50 leading-relaxed">
                    "{staffRebeccah?.bio?.saint || "Might as well swing big. I'd love to talk to Thomas Aquinas — informed of the latest science — about how some of his theological ideas might be different today."}"
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-rose-600 rounded-xl p-6 bg-rose-700 shadow-md">
                  <p className="text-sm font-bold tracking-widest uppercase text-rose-200 mb-2">Song that feels like God</p>
                  <p className="text-base text-rose-50 leading-relaxed">
                    "{staffRebeccah?.bio?.song || "In Ev'ry Age by Janet Sullivan Whittaker has followed me for 25 years. And honestly, any secular song with a big crescendo connects my heart to God every time."}"
                  </p>
                </div>
                <div className="border border-slate-600 rounded-xl p-6 bg-slate-700 shadow-md">
                  <p className="text-sm font-bold tracking-widest uppercase text-slate-300 mb-2">After Mass ritual</p>
                  <p className="text-base text-slate-100 leading-relaxed">
                    {staffRebeccah?.bio?.ritual || 'I like to have lunch and take a deep breath on my back deck before jumping into whatever my family has planned for the afternoon.'}
                  </p>
                </div>
              </div>
              <div className="bg-sky-700 border border-sky-600 rounded-xl p-8 shadow-md">
                <p className="text-sm font-bold tracking-widest uppercase text-sky-200 mb-2">Street Cred</p>
                <p className="text-base text-sky-50 leading-relaxed">
                  {staffRebeccah?.bio?.credentials || contact?.bio || 'In lay ministry leadership since age 16. Masters of Divinity, Jesuit School of Theology, Berkeley (2003). Previously at All Saints in Hayward and St. Augustine in Oakland.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-900 border border-blue-800 rounded-lg p-8 flex flex-wrap items-center justify-between gap-6 shadow-lg">
          <div>
            <h3 className="text-2xl font-semibold text-white mb-1">Come Grow With Us.</h3>
            <p className="text-base text-blue-200">
              Registration is open for 2025-2026. Takes about two minutes.
            </p>
          </div>
          <a
            href={hero?.link_url || 'https://docs.google.com/forms/d/e/1FAIpQLSfYJOljbOVuy2-qq9DrMJv1M7xaJgXM8f1IWUkTNsGTpa3utQ/viewform?usp=send_form'}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-blue-900 px-6 py-3 rounded-lg text-base font-medium hover:bg-blue-50 transition-colors"
          >
            Enroll Now →
          </a>
        </div>
      </div>
    </div>
  );
}
