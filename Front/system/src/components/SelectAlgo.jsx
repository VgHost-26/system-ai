import React from 'react'

export const SelectAlgo = () => {
  return (
    <div id="selectAlgo">

      <label htmlFor='selectAlgoInput'>Algorytm: </label>
      <select id='selectAlgoInput' defaultValue={'default'}>
        <option value='default' hidden>Wybierz algorytm</option>
        <option value='' >Archimedes</option>
        <option value='' >Dzikie węże</option>
      </select>

      <div id="parameters">
        <label>Parametry: </label>
        <input type='number' value={0} />
        <input type='number' value={0} />
        <input type='number' value={0} />
      </div>

    </div>
  )
}
