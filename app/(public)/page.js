'use client'
import Image from 'next/image'
import Link from 'next/link'
import BaseButton from '@/app/components/baseButton'
import ServiceCard from '@/app/components/serviceCard'
import MapCard from '@/app/components/mapCard'

import heroImg from '@/public/womans-hands-typing-laptop-workplace.jpg'
import aboutImg from '@/public/top-view-woman-s-hands-working-with-laptop.jpg'



export default function HomePage() {
  return (
    <main>
      {/* HERO section */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh]">
        <Image
          src={heroImg}
          alt="Hero background"
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-secondary/40" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center text-center">
          <div className="space-y-5 md:space-y-7">
            <Image
              className="mx-auto sm:h-10 md:h-20 w-auto mb-2 md:mb-4"
              src="/logo1.svg"
              alt="โลโก้ SC TECH"
              width={160}
              height={80}
              priority
            />

            <h1 id="hero-title" className="text-white drop-shadow text-xl sm:text-2xl md:text-2xl lg:text-4xl tracking-tight mb-[5px] font-semibold">
              <span>SC TECH (2025) LIMITED PARTNERSHIP</span>
            </h1>

            <p className="text-white/95 drop-shadow text-lg sm:text-xl md:text-2xl leading-relaxed mb-[0px]">
              สร้างสรรค์และนำเสนอเทคโนโลยีที่ทันสมัย
              <br className="hidden md:inline" />
              เพื่อสนับสนุนการเติบโตของลูกค้าและชุมชน
            </p>

            <Link
              href="/quotation"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r px-10 m-5 from-secondary to-secondary text-white py-2 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-lightblue1 hover:to-lightblue2 hover:text-fontcolor"
            >
              ติดต่อเรา
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT section */}
      <section className="animate-fade-up animate-once animate-ease-in bg-gradient-to-b from-[#FFFFFF] via-[#F5F5F5] to-[#D1E0F6]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-center lg:text-left lg:col-start-1 lg:row-start-1 m-2 font-extrabold">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fontcolor to-secondary">เกี่ยวกับเรา</span>
            </h1>
            <br />
            <Image
              src={aboutImg}
              alt="ภาพเกี่ยวกับเรา"
              className="w-full rounded-xl object-cover shadow-md mx-auto lg:col-start-2 lg:row-span-2"
              placeholder="blur"
              sizes="(min-width:1024px) 50vw, 100vw"
              priority={false}
            />

            <p className="m-3 text-fontcolor leading-relaxed text-base sm:text-lg md:text-xl lg:text-2xl text-center lg:text-left lg:col-start-1 lg:row-start-2">
              ผู้นำในด้านการพัฒนาแอพพลิเคชันให้บริการโซลูชันไอทีที่เชื่อถือได้และมีคุณภาพสูง
              <span className="block mt-2">สร้างสรรค์และนำเสนอเทคโนโลยีที่ทันสมัย เพื่อสนับสนุนการเติบโตของลูกค้าและชุมชน</span>
              <span className="block mt-4">มุ่งหวังที่จะเป็นพาร์ทเนอร์ที่ลูกค้าสามารถไว้วางใจได้ ในการเดินทางสู่อนาคตที่ใช้เทคโนโลยีเป็นหัวใจหลักในการพัฒนาปรับปรุงองค์กรและธุรกิจ</span>

              <span className="w-full flex justify-center lg:justify-start lg:col-start-1 lg:row-start-3">
                <BaseButton to="/about" label="ดูเพิ่มเติม" />
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* SERVICE section */}
      <section className="service-section w-full shadow-lg animate-fade-up animate-once animate-ease-in bg-cover bg-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mx-auto text-center mb-3">
            <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fontcolor to-secondary">บริการของเรา</span>
          </h1>

          <p className="text-center text-xl sm:text-xl md:text-2xl mb-4 text-secondary">โซลูชันเทคโนโลยีครบวงจรเพื่อธุรกิจและองค์กร</p>
          <br />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            <div className="h-full">
              <ServiceCard
                title="พัฒนาซอฟต์แวร์ แอปพลิเคชัน"
                description="เว็บไซต์ โปรแกรมสำเร็จรูป การเขียนโปรแกรมตามวัตถุประสงค์ของโครงการ"
                icon="/coding.svg"
              />
            </div>
            <div className="h-full">
              <ServiceCard
                title="จัดหา ติดตั้ง จำหน่าย ซื้อ ขาย นำเข้า "
                description="ครุภัณฑ์ คอมพิวเตอร์ สำนักงาน ไฟฟ้าและวิทยุ ตามบัญชีราคามาตรฐาน ICT"
                icon="/computer.svg"
              />
            </div>
            <div className="h-full">
              <ServiceCard
                title="จัดหา ติดตั้ง จำหน่าย "
                description="ระบบผลิตไฟฟ้าจากพลังงานแสงอาทิตย์ ตามบัญชีราคากลาง"
                icon="/solar.svg"
              />
            </div>
            <div className="h-full">
              <ServiceCard
                title="รับแปลภาษา"
                description="บทความ วิชาการ บทภาพยนตร์ ละคร คลิปวีดีโอ รวมทั้งแปลเอกสารต่างๆ"
                icon="/pen.svg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT section */}
      <section className="contact-section bg-cover bg-center h-160 animate-fade-up flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#FFFFFF] to-primary">
        <h1 className="mx-auto text-center mb-2">
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fontcolor to-secondary">ติดต่อเรา</span>
        </h1>
        <p className="text-center text-xl sm:text-xl md:text-2xl text-secondary mb-5">ดูแผนที่ หรือติดต่อทีมเราได้ทางอีเมลและโทรศัพท์</p>

        <MapCard
          mapsEmbedUrl="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d478.8095309358353!2d103.04955189814909!3d16.247344038437564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTbCsDE0JzUwLjMiTiAxMDPCsDAyJzU4LjciRQ!5e0!3m2!1sen!2sth!4v1757831814686!5m2!1sen!2sth"
          mapsLink="https://maps.app.goo.gl/BG61L7riUT1nTpK78"
          address="ที่อยู่ 159 ม. 23 ต.หัวขวาง อ.โกสุมพิสัย จ.มหาสารคาม 44140"
          phone="095-606-5832"
          email="sctech95@gmail.com"
        />
      </section>

      <style jsx global>{`
        .service-section { background-color: #ffffff; }
      `}</style>
    </main>
  )
}
