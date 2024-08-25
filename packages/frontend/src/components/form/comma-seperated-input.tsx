import * as React from "react"

import { cn } from "@repetition/frontend/lib/utils"


export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onBlur2: (text: string) => void
}

const CommaSeparatedInput = ({ className, type, ...props }: InputProps) => {
    const [val, setVal] = React.useState('')
    const inputRef = React.useRef<HTMLInputElement | null>(null)

    props.onChange = (e) => {
        setVal( e.target.value )
    }

    props.onBlur = (e) => {
        props.onBlur2(e.target.value)
        setVal('')
    }

    return (
      <input
        
        type={type || "text"}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
        value= {val}
        ref={inputRef}
      />
    )
  }


export { CommaSeparatedInput }
