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
    const timeId = setTimeout(() => {
      // After 3 seconds set the show value to false
      clearUseState('')
    }, 2000)

    return () => {
      clearTimeout(timeId)
    }
  }, [])

  useEffect(() => {
    const anch = document.getElementById(anchor)
    setX(anch.offsetLeft)
    setY(anch.offsetTop - anch.clientHeight * 1.5)
  }, [])

  return (
    <div
      style={{ left: x + 'px', top: y + 'px' }}
      className={'notification ' + type}
    >
      {children}
    </div>
  )
}
