import { useEffect, useMemo, useState } from 'react'
import style from './Player.module.scss'

import YouTube from 'react-youtube'

export default function Player() {
  const [urlInput, setUrlInput] = useState()
  const [videoId, setVideoId] = useState()
  const [playerTitle, setPlayerTitle] = useState()

  const [player, setPlayer] = useState(null)
  const [isReady, setIsReady] = useState(false)
  const [loop, setLoop] = useState(2)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const opts = useMemo(
    () => ({
      host: 'https://www.youtube-nocookie.com',
      mute: false,
      playerVars: {
        autoplay: 1,
        loop: loop === 2 ? 1 : 0,
        playlist: videoId,
        controls: 1,
        fs: 1,
        rel: 0,
      },
    }),
    [loop, videoId]
  )

  function extractVideoID(url) {
    // 正则表达式匹配YouTube视频ID
    const regExp =
      /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)

    // match[2]包含了视频ID
    if (match && match[2].length === 11) {
      return match[2]
    } else {
      // 如果没有匹配到视频ID，可能不是一个有效的YouTube URL
      return null
    }
  }

  async function searchVideo(url) {
    // 檢查輸入使否是一個有效的YouTube URL
    const videoId = extractVideoID(url)
    if (!videoId) return

    // 暫存 youtube video ID
    setVideoId(videoId)
    setIsReady(true)

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
      )
      const videoData = await response.json()

      if (videoData.items && videoData.items.length > 0) {
        const title = videoData.items[0].snippet.title
        setPlayerTitle(title)
        console.log('Video title:', title)
        return title
      } else {
        setPlayerTitle(null)
        console.error('No video data found')
      }
    } catch (error) {
      console.error('Error fetching video data:', error)
      setPlayerTitle(null)
    }
  }

  // 快捷鍵
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
      } else if (event.key === 'Enter') {
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const urlInputOnChange = (e) => {
    setUrlInput(e.target.value)
    searchVideo(e.target.value)
  }

  // 播放器事件函數
  const onReady = (event) => {
    // 嵌入的播放器已經準備就緒
    setPlayer(event.target) // 儲存播放器實例
    event.target.playVideo() // 播放
    // 添加 class
    const iframe = event.target.getIframe()
    iframe.classList.add('youtubePlayer')
  }

  // 播放器控制
  const closePlayer = () => {
    setVideoId()
    setIsPlaying(false)
    setPlayer(null)
    setIsReady(false)
    setIsLoading(false)
    setUrlInput('')
  }
  const handlePlayPause = () => {
    if (player) {
      const state = player.getPlayerState()
      if (state === 1) {
        player.pauseVideo()
      } else {
        player.playVideo()
      }
    }
  }
  const handleSeek = (event) => {
    if (player) {
      const duration = player.getDuration()
      const seekTo =
        (event.nativeEvent.offsetX / event.target.offsetWidth) * duration
      player.seekTo(seekTo)
    }
  }
  const handleBackward = () => {
    if (player) {
      const currentTime = player.getCurrentTime()
      player.seekTo(Math.max(currentTime - 5, 0), true)
    }
  }
  const handleForward = () => {
    if (player) {
      const currentTime = player.getCurrentTime()
      player.seekTo(currentTime + 5, true)
    }
  }

  // 監控進度與加載狀態
  const [progressUpdateIntervalId, setProgressUpdateIntervalId] = useState(null)
  const updateProgress = () => {
    const currentTime = player.getCurrentTime()
    const duration = player.getDuration()
    const prog = (currentTime / duration) * 100
    setProgress(prog) // 百分比進度
    setCurrentTime(currentTime) // 當前播放秒數
    setDuration(duration) // 影片總長秒數
  }
  const startProgressTracking = () => {
    stopProgressTracking() // 停止之前的進度追蹤
    const interval = setInterval(updateProgress, 100)
    setProgressUpdateIntervalId(interval)
  }
  const stopProgressTracking = () => {
    if (progressUpdateIntervalId) {
      clearInterval(progressUpdateIntervalId)
    }
  }
  const handleLoadingState = (state) => {
    setIsLoading(state === 3)
  }
  const handleStateChange = (event) => {
    const playerState = event.data
    const isPlaying = playerState === 1
    setIsPlaying(isPlaying)
    if (isPlaying) {
      startProgressTracking()
    } else {
      stopProgressTracking()
    }
    handleLoadingState(event.target.getPlayerState())
  }

  return (
    <div className={style.view}>
      <div className={style.container}>
        <div
          className={`${style.search_view}${isReady ? ` ${style.ready}` : ''}`}
        >
          {!isReady && (
            <div className={style.header}>
              <h1>YouPure</h1>
              <p>v0.1.0</p>
            </div>
          )}
          <div className={style.input}>
            {isReady && <button onClick={() => closePlayer()}>X</button>}
            <input
              type="text"
              value={urlInput}
              onChange={(e) => urlInputOnChange(e)}
              autoFocus
            />
          </div>
        </div>
        <div
          className={`${style.video_view}${isReady ? ` ${style.ready}` : ''}`}
        >
          {videoId && (
            <YouTube
              opts={opts}
              videoId={videoId}
              onReady={onReady}
              // onEnd={onEnd}
              onStateChange={handleStateChange}
              className="youtubePlayer"
            />
          )}
        </div>
      </div>
    </div>
  )
}
