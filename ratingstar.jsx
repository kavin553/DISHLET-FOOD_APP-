import React from "react";
import { Star } from "lucide-react";

export default function RatingStars({ value = 0, onChange, size = 18 }) {
  const [hover, setHover] = React.useState(null);
  const display = hover ?? value;

  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          onClick={() => onChange && onChange(i)}
          className="p-0.5"
          aria-label={`Rate ${i} star${i>1?'s':''}`}
        >
          <Star
            className={`${display >= i ? 'text-yellow-500 fill-yellow-400' : 'text-gray-300'} transition-colors`}
            size={size}
          />
        </button>
      ))}
    </div>
  );
}