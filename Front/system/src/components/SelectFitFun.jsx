import React, { useState } from 'react'

export const SelectFitFun = ({ selFitfuns, setSelFitfuns, fitfuns = [] }) => {

  const [tmpFitfun, setTmpFitfun] = useState('')
  const [tmpDim, setTmpDim] = useState('')
  const [tmpMin, setTmpMin] = useState('')
  const [tmpMax, setTmpMax] = useState('')

  function combine(dim, min, max) {
    let results = '[['
    for (let i = 0; i < dim; i++) {
      results += `${min}`
      if (i < dim - 1) results += ','
    }
    results += '],['
    for (let i = 0; i < dim; i++) {
      results += `${max}`
      if (i < dim - 1) results += ','
    }
    results += ']]'
    return results
  }

  function handleSubmit(e) {
    e.preventDefault()
    setTmpDim('')
    setTmpMin('')
    setTmpMax('')
    setTmpFitfun('')
    combine(tmpDim, tmpMin, tmpMax)
  }

  function handleChooseFitfun() {
    if (tmpFitfun !== 'default') {
      const newDomain = tmpDim;
  
      setSelFitfuns([
        ...selFitfuns,
        {
          name: tmpFitfun,
          domain: newDomain,
        },
      ]);
    }
  }

  function handleDeleteFitfun(index) {
    const updatedFitfuns = [...selFitfuns];
    updatedFitfuns.splice(index, 1);
    setSelFitfuns(updatedFitfuns);
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
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
            </select>
          </div>
          <div id='dimensions'>
            <label htmlFor='chooseDomain' className=''>
              Wymiar:
              <input
                id='chooseDomain'
                type='number'
                value={tmpDim}
                min={0}
                onChange={e => setTmpDim(e.target.value)}
              />
            </label>
            <label htmlFor='chooseMin' className=''>
              Min:
              <input
                id='chooseMin'
                type='number'
                value={tmpMin}
                onChange={e => setTmpMin(e.target.value)}
              />
            </label>
            <label htmlFor='chooseMax' className=''>
              Max:
              <input
                id='chooseMax'
                type='number'
                value={tmpMax}
                onChange={e => setTmpMax(e.target.value)}
              />
            </label>
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
                <button onClick={() => handleDeleteFitfun(index)}>Delete</button>
              </li>
            ))}
        </ol>
      </div>
    </div>
  )
}
