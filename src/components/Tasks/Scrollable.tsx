import React, { useCallback, useEffect } from 'react'
import { INFINITE_SCROLL_BOTTOM_OFFSET } from '../../config'

interface ScrollableProps {
  onScroll: () => void
}

const Scrollable: React.FC<ScrollableProps> = ({ onScroll, children }) => {
  const handleScroll = useCallback(async () => {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
    const body = document.body
    const html = document.documentElement
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    const windowBottom = windowHeight + window.pageYOffset

    if (windowBottom >= docHeight - INFINITE_SCROLL_BOTTOM_OFFSET) {
      await onScroll()
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return <>{children}</>
}

export default Scrollable