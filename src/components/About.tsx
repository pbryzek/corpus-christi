import { Link } from 'react-router-dom';

export default function About() {
  return (
    <section id="about" className="bg-white">
      <div className="bg-slate-900 text-white py-20 px-6 text-center">
        <p className="text-base font-semibold tracking-widest uppercase text-gray-400 mb-6">
          Our Mission
        </p>
        <h2 className="text-5xl md:text-6xl font-light leading-tight max-w-3xl mx-auto">
          We're a Parish Shaped by a Community Who Loves It.
        </h2>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-xl leading-relaxed text-gray-600 mb-16 pb-16 border-b border-gray-200">
          For nearly 100 years, Corpus Christi has been shaped by the people who show up — who serve,
          who welcome the stranger, and who keep returning because something here is real.
        </div>

        <div className="bg-gray-50 border-l-4 border-slate-900 rounded-r-lg p-10 mb-16">
          <p className="text-xl leading-relaxed text-slate-900 italic mb-6">
            "One of the greatest joys of my life is telling others about Corpus Christi. And the fact that
            I call it a family tells you just about everything you need to know. We're not a perfect community —
            we're a real one. Big hopes, full hearts, and a hunger for something meaningful. And somehow, every
            Sunday, something happens. Strangers become neighbors. Neighbors become friends. Friends become family.
            Some people walk in a little weary and walk out lighter. It always moves me when I see and feel it.
            Everyone belongs here — all we ask is that you give us a chance to prove it."
          </p>
          <p className="text-base font-semibold text-gray-600 tracking-wide">
            — Fr. Leo
          </p>
        </div>

        <div className="mb-6">
          <p className="text-2xl font-medium leading-normal mb-6 text-slate-900">
            Fr. Leo means every word of that. And he'll be the first to tell you: he doesn't define this parish.{' '}
            <strong>You do.</strong>
          </p>
          <div className="text-xl leading-loose text-gray-600 space-y-1 mb-6">
            <div>Your joy.</div>
            <div>Your challenges.</div>
            <div>Your openness.</div>
            <div>Your gifts.</div>
            <div>Your contributions.</div>
          </div>
          <p className="text-xl font-semibold text-slate-900 mb-10">
            That's what makes Corpus Christi alive.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/mass"
            className="px-6 py-3 bg-slate-900 text-white text-base font-semibold rounded-lg hover:bg-slate-800 transition"
          >
            Join Us This Sunday
          </Link>
          <Link
            to="/new-visitors"
            className="px-6 py-3 bg-white text-slate-900 text-base font-semibold rounded-lg border-2 border-slate-900 hover:bg-slate-50 transition"
          >
            New? YES!
          </Link>
          <a
            href="#ministries"
            className="px-6 py-3 bg-white text-slate-900 text-base font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition"
          >
            Get Involved
          </a>
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-base font-semibold tracking-widest uppercase text-gray-500 mb-8 text-center">
            Why Corpus Christi?
          </p>
          <h3 className="text-4xl md:text-5xl font-light text-center mb-12 text-slate-900">
            Some Things You Just Have to Experience.
          </h3>

          <p className="text-xl leading-relaxed text-gray-600 mb-12">
            The music. The welcome. The school. Father Leo... and a community that shows up for each other
            in ways that still surprise us.
          </p>

          <div className="space-y-10">
            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                We take faith seriously — and ourselves lightly.
              </h4>
              <p className="text-lg leading-relaxed text-gray-600">
                Expect substance, humor, and homilies worth talking about at brunch.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Our community found us as much as we found them.
              </h4>
              <p className="text-lg leading-relaxed text-gray-600">
                Across generations, backgrounds, and life stories — the diversity here just happened naturally.
                And it's one of our greatest gifts.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                We wrestle with faith openly.
              </h4>
              <p className="text-lg leading-relaxed text-gray-600">
                We're a community that sits with complexity, not one that pretends it's simple.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                We don't just welcome you — we accept you.
              </h4>
              <p className="text-lg leading-relaxed text-gray-600">
                Not despite who you are, but because of who you are.
              </p>
            </div>
          </div>

          <p className="text-xl italic text-slate-900 mt-12 mb-8">
            Come see what keeps people coming back.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/mass"
              className="px-6 py-3 bg-slate-900 text-white text-base font-semibold rounded-lg hover:bg-slate-800 transition"
            >
              Join Us This Sunday
            </Link>
            <Link
              to="/new-visitors"
              className="px-6 py-3 bg-white text-slate-900 text-base font-semibold rounded-lg border-2 border-slate-900 hover:bg-slate-50 transition"
            >
              New? YES!
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
