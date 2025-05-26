"use client"

import {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
  type ChangeEvent,
  type RefObject
} from "react"

import { cn } from "~/lib/utils"
import { Input } from "~/components/ui/input"
import {secondsToHourMinSec, hourMinSecondsToSeconds} from './utils'

interface TimeDurationProps  {
  initialValue?: number
  onChange?: (value: {
    hours: number;
    minutes: number;
    seconds: number;
    total: number
  }) => void
  className?: string
  disabled?: boolean
  /**
  * defaults to 'Duration'
  * */
  label?: string

  /**
   * defaults to false
   **/
  showSeconds?: boolean
}

export function TimeDuration({
  className,
  showSeconds = false,
  initialValue = 0,
  onChange,
  disabled = false,
  label = 'Duration',
  ...props
}: TimeDurationProps) {
  const {
    hours: valueHours,
    mins: valueMins,
    seconds: valueSeconds
  } = secondsToHourMinSec(initialValue)

  const [hours, setHours] = useState<number>(valueHours)
  const [minutes, setMinutes] = useState<number>(valueMins)
  const [seconds, setSeconds] = useState<number>(valueSeconds)

  const hoursRef = useRef<HTMLInputElement>(null)
  const minutesRef = useRef<HTMLInputElement>(null)
  const secondsRef = useRef<HTMLInputElement>(null)

  // Update internal state when value prop changes
  //useEffect(() => {
  //  console.log('updated', initialValue)
  //  const updatedTime = secondsToHourMinSec(initialValue)
  //  setHours(updatedTime.hours || 0)
  //  setMinutes(updatedTime.mins || 0)
  //  setSeconds(updatedTime.seconds || 0)
  //}, [initialValue])

  // Notify parent component when values change
  useEffect(() => {
    const total = hourMinSecondsToSeconds({hours, mins: minutes, seconds})
    onChange?.({ hours, minutes, seconds, total})
  }, [hours, minutes, seconds, onChange])

  const handleHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? 0 : Number.parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 0 && value <= 99) {
      setHours(value)
    }
  }

  const handleMinutesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? 0 : Number.parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 0 && value <= 59) {
      setMinutes(value)
    }
  }

  const handleSecondsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? 0 : Number.parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 0 && value <= 59) {
      setSeconds(value)
    }
  }

  type FieldType= "hours" | "minutes" | "seconds"

  interface MiniStateMachine {
    next: RefObject<HTMLInputElement>
    prev: RefObject<HTMLInputElement>
  }
  const fieldStateWithSeconds: Record<FieldType, MiniStateMachine>= {
    hours: {
      next: minutesRef,
      prev:secondsRef
    },
    minutes: {
      next: secondsRef,
      prev:hoursRef
    },
    seconds: {
      next: hoursRef,
      prev:minutesRef
    } 
  } 

  const fieldStateWithoutSeconds: Record<Exclude<FieldType,'seconds'>, MiniStateMachine> = {
    hours: {
      next: minutesRef,
      prev:minutesRef
    },
    minutes: {
      next: hoursRef,
      prev:hoursRef
    },
  } 

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, field:FieldType) => {
    // Handle arrow key navigation
    if (e.key === "ArrowRight") {
      e.preventDefault()
      if(showSeconds){
        fieldStateWithSeconds[field].next.current?.focus()
      }else {
        fieldStateWithoutSeconds[field as Exclude<
          FieldType,
          'seconds'
        >].next.current?.focus()
      }
      //if (field === "hours") minutesRef.current?.focus()
      //if (field === "minutes") secondsRef.current?.focus()
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      if(showSeconds){
        fieldStateWithSeconds[field].prev.current?.focus()
      }else {
        fieldStateWithoutSeconds[field as Exclude<
          FieldType,
          'seconds'
        >].prev.current?.focus()
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (field === "hours" && hours < 99) setHours(hours + 1)
      if (field === "minutes" && minutes < 59) setMinutes(minutes + 1)
      if (field === "seconds" && seconds < 59) setSeconds(seconds + 1)
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (field === "hours" && hours > 0) setHours(hours - 1)
      if (field === "minutes" && minutes > 0) setMinutes(minutes - 1)
      if (field === "seconds" && seconds > 0) setSeconds(seconds - 1)
    }
  }

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <fieldset>
        <legend>{label}</legend>
        <div className="flex items-center">
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Input
              ref={hoursRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={hours}
              onChange={handleHoursChange}
              onKeyDown={(e) => handleKeyDown(e, "hours")}
              className="w-16 text-center"
              disabled={disabled}
              aria-label="Hours"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">h</span>
          </div>
          <span className="text-muted-foreground">:</span>
          <div className="relative">
            <Input
              ref={minutesRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={minutes}
              onChange={handleMinutesChange}
              onKeyDown={(e) => handleKeyDown(e, "minutes")}
              className="w-16 text-center"
              disabled={disabled}
              aria-label="Minutes"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">m</span>
          </div>
          <span className="text-muted-foreground">:</span>
          {showSeconds ?
            <div className="relative">
              <Input
                ref={secondsRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={seconds}
                onChange={handleSecondsChange}
                onKeyDown={(e) => handleKeyDown(e, "seconds")}
                className="w-16 text-center"
                disabled={disabled}
                aria-label="Seconds"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">s</span>
            </div>: null
          }
        </div>
      </fieldset>
    </div>
  )
}
