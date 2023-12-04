import React from "react"

export const Start = ({ selAlgo, selFitfun }) => {
  function handleSubmit(e) {
    e.preventDefault()
  }

  return (
    <div id='sectionStart' className='section'>
      <p className='sectionTitle'>Uruchom</p>
      <hr />
      <form>
        <label>
          Populacja:
          <input type='number' />
        </label>
        <label>
          Iteracje:
          <input type='number' />
        </label>
        <label>
          Wymiar:
          <input type='number' />
        </label>
        <input type='submit' value={"Start"} />
      </form>
    </div>
  )
}
