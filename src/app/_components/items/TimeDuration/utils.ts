export interface TimeObj {
  hours: number
  mins: number
  seconds: number
}

export const secondsToHourMinSec = (secs: number): TimeObj => {
  const [hours = 0, mins = 0, seconds = 0] = new Date(secs * 1000)
  .toISOString()
  .substring(11, 19).split(':').map(
    num => parseInt(num)
  )
  return {
    hours,
    mins,
    seconds
  }
}

export const displayTime = (sec:number, showSeconds?: boolean)=>{
  if(sec){
    const {hours, mins, seconds} = secondsToHourMinSec(sec)
    return `${hours}hr ${mins}mins`+ (showSeconds ? ` ${seconds} seconds` : '')
  }
  return ''
}

export const hourMinSecondsToSeconds = (time: TimeObj): number => {
  return time.hours*60*60 +time.mins*60 + time.seconds
}
