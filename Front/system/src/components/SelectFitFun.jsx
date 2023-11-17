import React from 'react'

export const SelectFitFun = () => {
  return (
    <div id="selectFitFun">

      <label htmlFor='selectFitFunInput'>Algorytm: </label>
      <select id='selectFitFunInput' defaultValue={'default'}>
        <option value='default' hidden>Wybierz funkcje celu</option>
        <option value='' >Sphere</option>
        <option value='' >Rastragin</option>
      </select>

    </div>
  )
}
