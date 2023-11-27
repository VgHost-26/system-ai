import React, { useState } from "react"

export const SelectFitFun = ({ selFitfun, setSelFitfun, fitfuns = [] }) => {
  // const [selfitfun, setSelFitfun] = useState()

  const chandleSelect = e => {
    setSelFitfun(fitfuns.find(i => i.name === e.target.value))
  }
  return (
    <div id='selectFitFun' className='section'>
      <p className='sectionTitle'>Wybierz Funkcje Celu</p>
      <hr />
      <label htmlFor='selectFitFunInput' className='desc'>
        Funkcja Celu:{" "}
      </label>

      <select
        id='selectFitFunInput'
        defaultValue={"default"}
        value={selFitfun?.name}
        onChange={e => chandleSelect(e)}
      >
        <option value='default' hidden>
          Wybierz funkcje celu
        </option>
        {fitfuns != [] ? (
          fitfuns.map(f => {
            return <option>{f.name}</option>
          })
        ) : (
          <></>
        )}
      </select>
    </div>
  )
}
