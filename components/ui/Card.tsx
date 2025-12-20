import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", hover = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          bg-white rounded-sm shadow-luxury
          ${hover ? "transition-luxury hover:shadow-xl hover:-translate-y-1" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardImage = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className = "", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

CardImage.displayName = "CardImage";

export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className = "", children, ...props }, ref) => {
  return (
    <div ref={ref} className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
});

CardContent.displayName = "CardContent";

export default Card;
