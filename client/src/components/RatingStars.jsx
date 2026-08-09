export function RatingStars({ value = 5 }) {
  return (
    <div className="flex items-center gap-1 text-[#c9973c]" aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, idx) => (
        <svg key={idx} viewBox="0 0 20 20" className={`h-4 w-4 ${idx < value ? 'opacity-100' : 'opacity-20'}`} fill="currentColor" aria-hidden="true">
          <path d="m10 1.8 2.41 4.89 5.4.78-3.9 3.8.92 5.38L10 14.1l-4.83 2.55.92-5.38-3.9-3.8 5.4-.78L10 1.8Z" />
        </svg>
      ))}
    </div>
  );
}
