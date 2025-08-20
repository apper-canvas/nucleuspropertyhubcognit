import React from "react"
import { cn } from "@/utils/cn"

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-primary hover:bg-primary/90 text-white shadow-md",
    secondary: "bg-secondary hover:bg-secondary/90 text-white shadow-md",
    accent: "bg-accent hover:bg-accent/90 text-white shadow-md",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-primary hover:bg-primary/10",
    danger: "bg-error hover:bg-error/90 text-white shadow-md"
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    default: "px-4 py-2 text-base rounded-lg",
    lg: "px-6 py-3 text-lg rounded-lg",
    icon: "p-2 rounded-lg"
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button