import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles with FORCED dark text for readability
        'h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm',
        // FORCED: Dark slate text color that cannot be overridden by CSS variables
        'text-slate-900 bg-white border-slate-300',
        // FORCED: Visible placeholder text
        'placeholder:text-slate-400',
        // Focus state with Bungee Orange
        'focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none',
        // File input styles
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-900',
        // Selection styles
        'selection:bg-orange-100 selection:text-slate-900',
        // Disabled state
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-100',
        // Error state
        'aria-invalid:ring-red-200 aria-invalid:border-red-500',
        className,
      )}
      style={{ color: '#0f172a' }} // Inline style as final fallback
      {...props}
    />
  )
}

export { Input }
