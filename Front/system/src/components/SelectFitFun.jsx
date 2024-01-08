import React, { useState } from "react"

export const SelectFitFun = ({ selFitfuns, setSelFitfuns, fitfuns = [] }) => {
  // const [selfitfun, setSelFitfun] = useState()

  const [tmpFitfun, setTmpFitfun] = useState()

  function handleChooseFitfun() {
    if (selectFitFunInput.value != "default")
      if (!selFitfuns.includes(selectFitFunInput.value)) {
        setSelFitfuns([...selFitfuns, selectFitFunInput.value])
      }
  }

  const chandleSelect = e => {
    // setTmpFitfun(fitfuns.find(i => i.name === e.target.value))
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
        value={tmpFitfun}
        onChange={e => setTmpFitfun(e.value)}
      >
        <option value='default' hidden>
          Wybierz funkcje celu
        </option>
        {fitfuns != [] ? (
          fitfuns.map(f => {
            return <option value={f.name}>{f.name}</option>
          })
        ) : (
          <></>
        )}
      </select>
      <input
        className='button-circle info'
        type='button'
        value='+'
        onClick={handleChooseFitfun}
      />
      <div id='choosenFitfuns'>
        {selFitfuns != [] ? (
          selFitfuns.map(f => {
            return <p>{f.name}</p>
          })
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
