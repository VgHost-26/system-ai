import React from "react"

export const Start = ({ selAlgo, selFitfun }) => {
  function handleSubmit(e) {
    e.preventDefault()
  }

  return (
    <div id='sectionStart' className='section'>
      <p className='sectionTitle'>Uruchom</p>
      <hr />
    </div>
  )
}
