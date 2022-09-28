import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { useMemo, useRef, useState, useEffect } from 'react';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeSlider from './VolumeSlider';
import DurationSlider from './DurationSlider';
const allMusic = [
  {
    link: 'music1.mp3',
    name: 'Music 1',
    author: 'Author 1',
    image: 'live-from-space.jpg'
  }, {
    link: 'music2.mp3',
    name: 'Music 2',
    author: 'Author 2',
    image: 'bushido.png'
  }]

export default function MediaControlCard() {
  const theme = useTheme();
  const [play, setPlay] = useState(false)
  // const music = useRef<HTMLAudioElement | null>(typeof Audio !== 'undefined' 
  //   ? new Audio('music1.mp3')
  //   : null)
  const [musicNum, setMusicNum] = useState(0)
  const musicIndex = musicNum % allMusic.length
  const music = useMemo(() => {
    return typeof Audio !== 'undefined'
      ? new Audio(allMusic[musicIndex].link)
      : null
  }, [musicNum])
  useEffect(() => {
    if (play) music?.play()
  }, [musicNum])
  return (
    <Box>
      <Card sx={{ display: 'flex' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h5" sx={{}}>
              {allMusic[musicIndex].name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div">
              {allMusic[musicIndex].author}
            </Typography>
          </CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
            <IconButton aria-label="previous" onClick={() => {
              if (music) {
                music.pause()
              }
              setMusicNum((prevState) => {
                if (prevState === 0) return allMusic.length - 1
                return prevState - 1
              })
            }}>
              {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
            </IconButton>
            <IconButton aria-label="play/pause" onClick={() => {
              setPlay((prevState) => {
                return !prevState
              })
              if (music) {
                if (play) music.pause()
                else music.play()
              }
            }}>
              {
                !play ?
                  <PlayArrowIcon sx={{ height: 38, width: 38 }} /> : <PauseIcon sx={{ height: 38, width: 38 }} />
              }
            </IconButton>
            <IconButton aria-label="next" onClick={() => {
              if (music) {
                music.pause()
              }
              setMusicNum((prevState) => {
                return prevState + 1
              })
            }}>
              {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
            </IconButton>
          </Box>
        </Box>
        <CardMedia
          component="img"
          sx={{ width: 151 }}
          image={allMusic[musicIndex].image}
          alt={allMusic[musicIndex].name}
        />
      </Card>
      <VolumeSlider audio={music} />
      <DurationSlider audio={music} />
    </Box>
  );
}
