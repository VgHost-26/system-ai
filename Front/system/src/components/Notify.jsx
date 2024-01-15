import React, { useEffect, useState } from 'react'

export const Notify = ({ children, type = '', anchor = 'root' }) => {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  useEffect(() => {
    const anch = document.getElementById(anchor)
    setX(anch.offsetLeft)
    setY(anch.offsetTop)
  }, [])

  return (
    <div
      style={{ left: x + 'px', right: y + 'px' }}
      className={'notification ' + type}
    >
      {children}
    </div>
  )
}
