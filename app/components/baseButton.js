import Link from "next/link"

export default function BaseButton({ to, label }) {
  return (
    <Link href={to}>
      <button
        className="bg-gradient-to-r from-fontcolor to-secondary mt-5 px-10 py-2 cursor-pointer
                   text-primary rounded-xl transition-all duration-300
                   hover:scale-105 hover:shadow-lg hover:bg-btn/90 hover:text-primary
                   text-xl sm:text-xl md:text-2xl"
      >
        {label}
      </button>
    </Link>
  )
}
