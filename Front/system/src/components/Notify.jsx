import React, { useEffect, useState } from 'react'

export const Notify = ({
  children,
  type = '',
  anchor = 'root',
  clearUseState,
}) => {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  // On componentDidMount set the timer
  useEffect(() => {
    if (children) {
      const timeId = setTimeout(() => {
        // After 6 seconds set the show value to false
        clearUseState('')
      }, 4000)

      return () => {
        clearTimeout(timeId)
      }
    }
  }, [children, clearUseState])

  useEffect(() => {
    const anch = document.getElementById(anchor)
    setX(anch.offsetLeft)
    // Tymczasowo wyłączone, ponieważ powiadomienia nie były wyświetlane.
    // setY(anch.offsetTop - anch.clientHeight * 1.5)
    setY(anch.offsetTop)
  }, [anchor])

  if (!children) {
    return null // Render nothing if children are empty
  }

  return (
    <div
      style={{ left: x + 'px', top: y + 'px' }}
      className={'notification ' + type}
    >
      {children}
    </div>
  )
}
