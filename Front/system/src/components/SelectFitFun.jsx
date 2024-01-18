import React, { useState } from 'react'

export const SelectFitFun = ({ selFitfuns, setSelFitfuns, fitfuns = [] }) => {
  const [tmpFitfun, setTmpFitfun] = useState('')
  const [tmpDim, setTmpDim] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setTmpDim('')
    setTmpFitfun('')
  }

  function handleChooseFitfun() {
    if (tmpFitfun !== 'default') {
      const newDomain = tmpDim

      setSelFitfuns([
        ...selFitfuns,
        {
          name: tmpFitfun,
          domain: newDomain,
        },
      ])
    }
  }

  function handleDeleteFitfun(index) {
    const updatedFitfuns = [...selFitfuns]
    updatedFitfuns.splice(index, 1)
    setSelFitfuns(updatedFitfuns)
  }

  return (
    <div id='selectFitFun' className='section'>
      <p className='sectionTitle'>Wybierz Funkcje Celu</p>
      <hr />
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='selectFitFunInput' className=''>
              Funkcja:
            </label>
            <select
              id='selectFitFunInput'
              defaultValue={'default'}
              value={tmpFitfun}
              onChange={e => setTmpFitfun(e.target.value)}
            >
              <option value='default' hidden>
                Wybierz funkcje celu
              </option>
              {fitfuns.length !== 0 &&
                fitfuns.map(f => (
                  <option key={f.name} value={f.name}>
                    {f.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor='chooseDomain' className=''>
              Wymiar:
            </label>
            <input
              id='chooseDomain'
              type='text'
              placeholder='[[x1,y1, ...], [x2, y2, ...]]'
              value={tmpDim}
              onChange={e => setTmpDim(e.target.value)}
            />
          </div>
          <input
            id='selectFitfunButton'
            disabled={!tmpDim || !tmpFitfun}
            className=''
            type='submit'
            value='+'
            onClick={handleChooseFitfun}
          />
        </form>
        <ol id='choosenFitfuns'>
          {selFitfuns.length !== 0 &&
            selFitfuns.map((f, index) => (
              <li key={`${f.name}-${index}`}>
                {f.name}:{f.domain}
                <button
                  className='delete-button'
                  onClick={() => handleDeleteFitfun(index)}
                >
                  X
                </button>
              </li>
            ))}
        </ol>
      </div>
    </div>
  )
}
