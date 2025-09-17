import Link from "next/link"
import Image from "next/image"

export default function ServiceCard({
    title,
    description,
    icon,        
    iconAlt = "",
    to = "/service",
    ariaLabel,
}) {
    const isComponent = typeof icon !== "string"

    return (
        <Link
            href={to}
            aria-label={ariaLabel || title}
            className="group block outline-none"
        >
            <article
                className="service-card w-full h-full min-h-[220px] flex-col flex mx-auto items-start gap-4 p-10
                   rounded-2xl shadow-md max-w-md
                   bg-gradient-to-b from-[#ECF4FF] to-[#D1E0F6]
                   transition-transform duration-300 ease-in-out hover:scale-[1.02]
                   focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
            >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
                    <Image
                        src="/Ellipse1.svg"   
                        alt=""
                        aria-hidden="true"
                        fill
                        className="absolute inset-0 w-full h-full select-none pointer-events-none object-contain"
                    />

                    {isComponent ? (
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10" aria-hidden="true">
                            {icon}
                        </div>
                    ) : (
                        icon && (
                            <Image
                                src={icon}
                                alt={iconAlt}
                                width={40}
                                height={40}
                                className="relative w-8 h-8 sm:w-10 sm:h-10 object-contain"
                            />
                        )
                    )}
                </div>

                <div className="text-left">
                    <h3 className="text-secondary font-semibold text-base sm:text-lg mb-1">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-fontcolor text-sm sm:text-base leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
            </article>
        </Link>
    )
}
