import React, { useState, useEffect } from 'react'

export const SelectFitFun = ({
  selFitfuns,
  setSelFitfuns,
  fitfuns = [],
  showNotification,
  testMode,
  testModeEnum,
}) => {
  const [tmpFitfun, setTmpFitfun] = useState('')
  const [tmpDim, setTmpDim] = useState(2)
  const [tmpMin, setTmpMin] = useState('')
  const [tmpMax, setTmpMax] = useState('')

  useEffect(() => {
    // Clear selected fit functions when test mode changes
    handleClearFitfuns()
  }, [testMode])

  function handleSubmit(e) {
    e.preventDefault()
  }

  function handleClear() {
    setTmpFitfun('')
    setTmpDim(2)
    setTmpMin('')
    setTmpMax('')
  }

  function handleClearFitfuns() {
    setSelFitfuns([])
  }

  function handleChooseFitfun() {
    if (tmpFitfun === 'TSFDE') {
      setSelFitfuns([
        {
          name: tmpFitfun,
          domain:
            '[[0.1,1.1,1.0,-70.0,250.0,-30.0,50.0],[0.9,1.9,5.0,-20.0,450.0,-10.0,250.0]]',
        },
      ])
      return
    }
    if (tmpFitfun !== 'default') {
      const newDomain = generateDomain()
      if (newDomain != null) {
        setSelFitfuns([
          ...selFitfuns,
          {
            name: tmpFitfun,
            domain: newDomain,
          },
        ])
        handleClear()
        showNotification('')
      } else {
        showNotification('Invalid input for Min and Max values', 'error')
      }
    }
  }

  function handleChooseFitfunMultitest() {
    if (tmpFitfun !== 'default') {
      const newDomain = generateDomain()
      if (newDomain != null) {
        setSelFitfuns([
          {
            name: tmpFitfun,
            domain: newDomain,
          },
        ])
        handleClear()
        showNotification('')
      } else {
        showNotification('Invalid input for Min and Max values', 'error')
      }
    }
  }

  function parseValues(input) {
    const parsedValues = input.split(',').map(value => parseFloat(value.trim()))
    return Array.isArray(parsedValues) ? parsedValues : []
  }

  function generateDomain() {
    const dimension = parseInt(tmpDim)
    const minValues = parseValues(tmpMin)
    const maxValues = parseValues(tmpMax)

    if (
      !isNaN(dimension) &&
      minValues.length === dimension &&
      minValues.every(value => !isNaN(value)) &&
      maxValues.length === dimension &&
      maxValues.every(value => !isNaN(value))
    ) {
      const domain =
        '[' + '[' + minValues + ']' + ',' + '[' + maxValues + ']' + ']'
      return domain
    } else {
      return null
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
      {testMode === testModeEnum.SINGLE_ALGORITHM && (
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
            {tmpFitfun !== 'TSFDE' ? (
              <div id='dimensions'>
                <label htmlFor='chooseDimension' className=''>
                  Wymiar:
                  <input
                    id='chooseDimension'
                    type='number'
                    min='2'
                    value={tmpDim}
                    onChange={e => setTmpDim(e.target.value)}
                  />
                </label>
                <label htmlFor='chooseMin' className=''>
                  Min:
                  <input
                    id='chooseMin'
                    type='text'
                    placeholder='1, 2, 3, ...'
                    value={tmpMin}
                    onChange={e => setTmpMin(e.target.value)}
                  />
                </label>
                <label htmlFor='chooseMax' className=''>
                  Max:
                  <input
                    id='chooseMax'
                    type='text'
                    placeholder='1, 2, 3, ...'
                    value={tmpMax}
                    onChange={e => setTmpMax(e.target.value)}
                  />
                </label>
              </div>
            ) : (
              <></>
            )}

            <input
              id='selectFitfunButton'
              disabled={
                (!tmpDim || !tmpFitfun || !tmpMin || !tmpMax) &&
                tmpFitfun !== 'TSFDE'
              }
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
                  <button
                    className='delete-button'
                    onClick={() => handleDeleteFitfun(index)}
                  >
                    X
                  </button>
                  {f.name}: {f.domain}
                </li>
              ))}
          </ol>
        </div>
      )}

      {testMode === testModeEnum.MULTIPLE_ALGORITHMS && (
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
                  Wybierz funkcję celu
                </option>
                {fitfuns.length !== 0 &&
                  fitfuns.map(f =>
                    f.name !== 'TSFDE' ? (
                      <option key={f.name} value={f.name}>
                        {f.name}
                      </option>
                    ) : (
                      <></>
                    )
                  )}
              </select>
            </div>
            <div id='dimensions'>
              <label htmlFor='chooseDimension' className=''>
                Wymiar:
                <input
                  id='chooseDimension'
                  type='number'
                  min='2'
                  value={tmpDim}
                  onChange={e => setTmpDim(e.target.value)}
                />
              </label>
              <label htmlFor='chooseMin' className=''>
                Min:
                <input
                  id='chooseMin'
                  type='text'
                  placeholder='1, 2, 3, ...'
                  value={tmpMin}
                  onChange={e => setTmpMin(e.target.value)}
                />
              </label>
              <label htmlFor='chooseMax' className=''>
                Max:
                <input
                  id='chooseMax'
                  type='text'
                  placeholder='1, 2, 3, ...'
                  value={tmpMax}
                  onChange={e => setTmpMax(e.target.value)}
                />
              </label>
            </div>

            <input
              id='selectFitfunButton'
              disabled={!tmpDim || !tmpFitfun || !tmpMin || !tmpMax}
              className='addToQButton'
              type='submit'
              value='+'
              onClick={handleChooseFitfunMultitest}
            />
          </form>
          <ol id='choosenFitfuns'>
            {selFitfuns.length !== 0 &&
              selFitfuns.map((f, index) => (
                <li key={`${f.name}-${index}`}>
                  <button
                    className='delete-button'
                    onClick={() => handleDeleteFitfun(index)}
                  >
                    X
                  </button>
                  {f.name}: {f.domain}
                </li>
              ))}
          </ol>
        </div>
      )}
    </div>
  )
}
