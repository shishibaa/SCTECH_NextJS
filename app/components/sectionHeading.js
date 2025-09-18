export default function sectionHeading({ heading, paragraph }) {
  return (
    <>
      <h1 className="mx-auto text-center">
        <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fontcolor to-secondary">
          {heading}
        </span>
      </h1>

      {paragraph && (
        <p className="text-center text-xl sm:text-xl md:text-2xl text-secondary mb-5">
          {paragraph}
        </p>
      )}
           

    </>
  )
}

