import { useNavigate } from 'react-router-dom';

export default function Sacraments() {
  const navigate = useNavigate();

  return (
    <section className="py-10 md:py-14 px-6 bg-blue-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 m-0">
            Sacramental Moments.
          </h2>
          <a href="/sacraments#inquiry" className="px-6 py-3 bg-[#1e3a6e] text-white rounded-lg font-semibold hover:bg-[#162d57] transition whitespace-nowrap shadow-md hover:shadow-xl">
            Schedule a Sacrament
          </a>
        </div>

        <p className="text-xl text-gray-700 mb-12 max-w-3xl">
          We'd be honored to walk with you through the sacred moments that matter most — Baptism, Reconciliation, Marriage Preparation, Weddings, Anointing of the Sick, and Funerals.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => navigate('/sacraments')}
            className="relative rounded-xl overflow-hidden aspect-square bg-gray-200 cursor-pointer hover:opacity-90 transition w-full"
          >
            <img
              src="/Baptism.png"
              alt="Baptism"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-base font-medium text-white">Baptism</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/sacraments')}
            className="relative rounded-xl overflow-hidden aspect-square bg-gray-200 cursor-pointer hover:opacity-90 transition w-full"
          >
            <img
              src="/Screenshot_2026-03-28_at_3.15.10_AM.png"
              alt="Reconciliation"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-base font-medium text-white">Reconciliation</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/sacraments')}
            className="relative rounded-xl overflow-hidden aspect-square bg-gray-200 cursor-pointer hover:opacity-90 transition w-full"
          >
            <img
              src="/GirlEucharistHandup.jpg"
              alt="Eucharist"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-base font-medium text-white">Eucharist</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/sacraments')}
            className="relative rounded-xl overflow-hidden aspect-square bg-gray-200 cursor-pointer hover:opacity-90 transition w-full"
          >
            <img
              src="/Confirmationx.jpg"
              alt="Confirmation"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-base font-medium text-white">Confirmation</p>
            </div>
          </button>
        </div>

      </div>
    </section>
  );
}
