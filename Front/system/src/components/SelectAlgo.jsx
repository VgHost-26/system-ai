import React, { useEffect, useState } from "react"

export const SelectAlgo = ({ algos = [] }) => {
  const [selAlgo, setSelAlgo] = useState()
  const [params, setParams] = useState()

  const chandleSelect = e => {
    setSelAlgo(algos.find(i => i.name === e.target.value))
  }

  const updateParam = (name, newVal) => {
    const newParams = params.map(p => {
      if (p.name == name) {
        p.value = newVal
      }
    })
    setParams(newParams)
  }
  const getParamVal = name => {
    params.map(p => {
      if (p.name == name) {
        return p.value
      }
    })
    return 0
  }

  useEffect(() => {
    if (selAlgo) {
      setParams(
        selAlgo.params.map(p => ({
          name: p.name,
          value: p.lowerBound,
        }))
      )
    }
  }, [selAlgo])

  return (
    <div id='selectAlgorithm' className='section'>
      <label htmlFor='selectAlgoInput'>Algorytm: </label>
      <select
        id='selectAlgoInput'
        defaultValue={"default"}
        value={selAlgo?.name}
        onChange={e => chandleSelect(e)}
      >
        <option value='default' hidden>
          Wybierz algorytm
        </option>
        {algos != [] ? (
          algos.map(a => {
            return <option value={a.name}>{a.name}</option>
          })
        ) : (
          <option disabled>Najpierw dodaj algorytm</option>
        )}
      </select>

      <div id='parameters'>
        <label>Parametry: </label>
        {selAlgo && params ? (
          selAlgo.params.map(p => {
            // givenP = params.find(i => i.name == p.name)
            return (
              <label key={p.name} title={p.desc}>
                {p.name}
                <input
                  type='number'
                  min={p.lowerBound}
                  max={p.upperBound}
                  step={p.step}
                  value={() => getParamVal(p.name)}
                  onChange={e => updateParam(p.name, e.target.value)}
                />
              </label>
            )
          })
        ) : (
          <>-</>
        )}
      </div>
    </div>
  )
}
