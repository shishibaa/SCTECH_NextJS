import Link from 'next/link'
import Image from 'next/image'


export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary text-white">
      <div className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-4">
              <Image src="/logo2.svg" alt="SC TECH logo" width={64} height={64} className="h-auto w-16" />
              <h1 className="text-xl leading-tight font-semibold">
                <span className="text-[32px]">SC TECH (2025)</span>
                <br />
                LIMITED PARTNERSHIP
              </h1>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">ติดต่อเรา</h2>
            <address className="not-italic space-y-1 text-white/90">
              <p>ที่อยู่ 159 ม. 23 ต.หัวขวาง</p>
              <p>อ.โกสุมพิสัย จ.มหาสารคาม 44140</p>
              <p>
                โทรศัพท์ <a href="tel:0956065832" className="">095-606-5832</a>
              </p>
              <p>
                อีเมล <a href="mailto:sctech95@gmail.com" className="">sctech95@gmail.com</a>
              </p>
            </address>
          </div>

          <nav className="sm:order-last lg:order-none">
            <h2 className="text-lg font-semibold mb-3">เมนูลัด</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="inline-block hover:translate-x-0.5 transition-transform ">
                  หน้าแรก
                </Link>
              </li>
              <li>
                <Link href="/about" className="inline-block hover:translate-x-0.5 transition-transform ">
                  เกี่ยวกับเรา
                </Link>
              </li>
              <li>
                <Link href="/service" className="inline-block hover:translate-x-0.5 transition-transform ">
                  บริการ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="inline-block hover:translate-x-0.5 transition-transform ">
                  ติดต่อ
                </Link>
              </li>
              <li>
                <Link href="/quotation" className="inline-block hover:translate-x-0.5 transition-transform ">
                  ขอใบเสนอราคา
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-white/20 pt-6 items-center gap-4">
          <p className="text-sm text-center text-white/70">© {currentYear} SC TECH (2025) LIMITED PARTNERSHIP.</p>
        </div>
      </div>
    </footer>
  )
}
