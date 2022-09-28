import { Slider, useTheme } from '@mui/material'
import React, { useEffect } from 'react'

type DurationSliderProps = {
  audio: HTMLAudioElement | null
}

function DurationSlider(props: DurationSliderProps) {
  const theme = useTheme();
  const [position, setPosition] = React.useState(0);
  useEffect(() => {
    let interval: NodeJS.Timer
    if (props.audio && props.audio.currentTime) {
       interval = setInterval(() => {
        setPosition(props.audio?.currentTime as number)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [props.audio])
  
  return (
    <Slider
      aria-label="time-indicator"
      size="small"
      value={position}
      min={0}
      step={1}
      max={props.audio?.duration}
      onChange={(_, value) => setPosition(value as number)}
      sx={{
        color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
        height: 4,
        '& .MuiSlider-thumb': {
          width: 8,
          height: 8,
          transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
          '&:before': {
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
          },
          '&:hover, &.Mui-focusVisible': {
            boxShadow: `0px 0px 0px 8px ${theme.palette.mode === 'dark'
              ? 'rgb(255 255 255 / 16%)'
              : 'rgb(0 0 0 / 16%)'
              }`,
          },
          '&.Mui-active': {
            width: 20,
            height: 20,
          },
        },
        '& .MuiSlider-rail': {
          opacity: 0.28,
        },
      }}
    />
  )
}

export default DurationSlider


