import React, { useEffect, useState } from "react"

export const SelectAlgo = ({
  selAlgo,
  setSelAlgo,
  params,
  setParams,
  algos = [],
}) => {
  // const [selAlgo, setSelAlgo] = useState()
  // const [params, setParams] = useState(selAlgo.params)

  const chandleSelect = e => {
    setSelAlgo(algos.find(i => i.name === e.target.value))
  }

  const updateParam = (name, newVal) => {
    setParams(
      params.map(p =>
        p.name === name
          ? { name: name, value: newVal }
          : { name: p.name, value: p.value }
      )
    )
    // setSelAlgo({ ...selAlgo, params: params })
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
      <p className='sectionTitle'>Wybierz Algorytm</p>
      <hr />
      <div className='wrapper'>
        <div>
          <label htmlFor='selectAlgoInput' className='desc'>
            Algorytm:{" "}
          </label>
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
        </div>
        <div>
          <p className='desc'>Parametry:</p>
          <div id='parameters'>
            {selAlgo && params ? (
              selAlgo.params.map(p => {
                // givenP = params.find(i => i.name == p.name)
                return (
                  <label key={p.name} title={p.desc}>
                    {p.name}
                    {console.log(p)}
                    <input
                      type='number'
                      min={p.lowerBound || 0}
                      max={p.upperBound || 10}
                      step={p.step || 1}
                      onChange={e => updateParam(p.name, e.target.value)}
                      // value={() => getParamVal(p.name)}
                    />
                  </label>
                )
              })
            ) : (
              <>-</>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
