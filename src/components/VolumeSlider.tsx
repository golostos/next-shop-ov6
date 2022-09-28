import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import { useEffect } from 'react';

type VolumeSliderProps = {
    audio: HTMLAudioElement | null
}

export default function VolumeSlider(props: VolumeSliderProps) {
  const [value, setValue] = React.useState(30);
  useEffect(() => {
    if (props.audio) props.audio.volume = value / 100
  }, [value, props.audio])

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  return (
    <Box sx={{ width: 200 }}>
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        <VolumeDown />
        <Slider aria-label="Volume" value={value} onChange={handleChange} />
        <VolumeUp />
      </Stack>
    </Box>
  );
}