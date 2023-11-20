import React, { useEffect, useState } from "react"

export const SelectAlgo = ({ algos = [] }) => {
  const [selAlgo, setSelAlgo] = useState()
  const [params, setParams] = useState()

  const chandleSelect = e => {
    setSelAlgo(algos.find(i => i.name === e.target.value))
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
              <label title={p.desc}>
                {p.name}
                <input
                  type='number'
                  min={p.lowerBound}
                  max={p.upperBound}
                  step={p.step}
                  value={params.find(i => i.name == p.name).value}
                  // onChange={setParams(...params, {
                  //   name: params.find(i => i.name == p.name).name,
                  //   value: params.find(i => i.name == p.name).value,
                  // })}
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
