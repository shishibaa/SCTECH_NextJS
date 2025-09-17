import Link from "next/link"

export default function MapCard({
  mapsEmbedUrl,
  mapsLink,
  address,
  phone,
  email,
}) {
  return (
    <section className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg ring-1 ring-black/5 overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Map */}
          <div className="relative min-h-[260px] md:min-h-[420px]">
            <iframe
              src={mapsEmbedUrl}
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              title="Google Maps"
            />
          </div>

          {/* Info */}
          <div className="p-8 md:p-10 flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-semibold text-fontcolor mb-5">ติดต่อเรา</h2>

            <ul className="space-y-4 text-slate-700">
              <li className="flex gap-3 items-start">
                {/* icon: location */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 10.5c0 7.5-7.5 10.5-7.5 10.5S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <p className="leading-relaxed">{address}</p>
              </li>

              <li className="flex gap-3 items-start">
                {/* icon: phone */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a2.25 2.25 0 002.25-2.25v-1.051a1.125 1.125 0 00-.852-1.09l-4.423-1.106a1.125 1.125 0 00-1.173.417l-.97 1.293a.75.75 0 01-1.03.18A12.04 12.04 0 016.806 12.7a.75.75 0 01.18-1.03l1.293-.97a1.125 1.125 0 00.417-1.173L7.59 5.104A1.125 1.125 0 006.5 4.252H5.25A3 3 0 002.25 7.5v-.75z" />
                </svg>
                <a href={`tel:${phone}`} className="font-semibold hover:underline">{phone}</a>
              </li>

              <li className="flex gap-3 items-start">
                {/* icon: email */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21.75 7.5v9a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 012.25 16.5v-9A2.25 2.25 0 014.5 5.25h15A2.25 2.25 0 0121.75 7.5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7l8.4 5.25a1.5 1.5 0 001.6 0L21 7" />
                </svg>
                <a href={`mailto:${email}`} className="font-medium hover:underline">{email}</a>
              </li>
            </ul>

            <Link
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-fontcolor to-secondary w-32 h-10 mt-5 inline-flex items-center justify-center
                         text-primary rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Google Maps
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
