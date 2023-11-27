import React from "react"

export const SelectFitFun = fitfuns => {
  return (
    <div id='selectFitFun' className='section'>
      <p className='sectionTitle'>Wybierz Funkcje Celu</p>
      <hr />
      <label htmlFor='selectFitFunInput' className='desc'>
        Funkcja Celu:{" "}
      </label>

      <select id='selectFitFunInput' defaultValue={"default"}>
        <option value='default' hidden>
          Wybierz funkcje celu
        </option>
        <option value=''>Sphere</option>
        <option value=''>Rastragin</option>
      </select>
    </div>
  )
}
