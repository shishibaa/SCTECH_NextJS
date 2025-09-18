'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Header() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    useEffect(() => {
        function handleKey(e) {
            if (e.key === 'Escape') setIsOpen(false)
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [])

    const links = [
        { href: '/', label: 'หน้าแรก' },
        { href: '/about', label: 'เกี่ยวกับเรา' },
        { href: '/service', label: 'บริการ' },
        { href: '/contact', label: 'ติดต่อ' },
    ]

    return (
        <header className="bg-primary/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
            <nav className="flex items-center p-4">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image src="/logo1.svg" alt="logo" width={48} height={48} className="h-auto w-12" priority />
                </Link>

                {/* Hamburger (mobile) */}
                <button
                    className="ml-auto md:hidden inline-flex items-center justify-center rounded-xl p-2 text-fontcolor focus:outline-none focus:ring-2 focus:ring-secondary"
                    aria-expanded={isOpen}
                    aria-label={isOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
                    onClick={() => setIsOpen((v) => !v)}
                >
                    {isOpen ? (
                        // close
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                fillRule="evenodd"
                                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    ) : (
                        // menu
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                fillRule="evenodd"
                                d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Zm.75 4.5a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                </button>

                {/* Desktop nav */}
                <ul className="hidden md:flex text-lg items-center ml-auto gap-10 text-fontcolor">
                    {links.map((l) => (
                        <li key={l.href}>
                            <Link
                                href={l.href}
                                className={`relative px-1 py-2 transition-colors duration-200 hover:text-secondary
                  after:absolute after:left-0 after:bottom-2 after:h-[2px] after:w-full
                  after:origin-center after:scale-x-0 after:bg-secondary after:content-['']
                  after:transition-transform after:duration-600 hover:after:scale-x-100 after:rounded-full
                  ${pathname === l.href ? 'text-secondary after:scale-x-100' : ''}`}
                            >
                                {l.label}
                            </Link>
                        </li>
                    ))}

                    <Link
                        href="/quotation"
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#3A5E98] to-[#7e96c0] text-white px-4 py-2 rounded-xl shadow-lg border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:from-lightblue1 hover:to-lightblue2 hover:text-fontcolor"
                    >
                        ขอใบเสนอราคา
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path
                                d="M13.5 4.5a.75.75 0 0 0-1.5 0v6.75H5.25a.75.75 0 0 0 0 1.5H12v6.75a.75.75 0 0 0 1.5 0V12.75h6.75a.75.75 0 0 0 0-1.5H13.5V4.5Z" />
                        </svg>
                    </Link>
                </ul>
            </nav>

            {/* Mobile nav */}
            <div
                className={`
    md:hidden bg-primary backdrop-blur-md shadow-md 
    transition-all  duration-500 animate-fade-down origin-top
    ${isOpen ? "max-h-96 opacity-100 scale-y-100" : "max-h-0 opacity-0 scale-y-0 overflow-hidden"}
  `}
            >
                <ul className="pt-3 pb-2 space-y-2 text-fontcolor text-base">
                    {links.map((l) => (
                        <li key={l.href}>
                            <Link
                                href={l.href}
                                className="block px-2 py-2 rounded-lg transition-colors duration-200 hover:bg-secondary/10"
                                onClick={() => setIsOpen(false)}
                            >
                                {l.label}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link
                            href="/quotation"
                            className="block px-2 py-2 rounded-lg transition-colors duration-200 hover:bg-secondary/10"
                            onClick={() => setIsOpen(false)}
                        >
                            ขอใบเสนอราคา
                        </Link>
                    </li>
                </ul>
            </div>
        </header>
    )
}
