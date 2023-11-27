import React, { useState } from "react"
export const AddFitFun = ({ handleAddFun }) => {
  const [fitfun, setFitfun] = useState({ name: "" })
  const [fitfunName, setFitfunName] = useState("")

  const handleSubmit = e => {
    e.preventDefault()
    if (newFitFun.files[0]) {
      // setFitfun(newFitFun.files[0])
      handleAddFun(newFitFunName.value, newFitFun.files[0])
      // clear inputs
      newFitFun.value = null
      setFitfunName("")
    }
  }

  const handleFileChange = () => {
    if (newFitFunName.value == "") {
      setFitfunName(newFitFun.files[0].name.slice(0, -4))
    }
  }

  return (
    <div id='addFitFun' className='section'>
      <form onSubmit={e => handleSubmit(e)}>
        <p className='sectionTitle'>Dodaj Funkcje Celu</p>
        <hr />
        <input
          id='newFitFun'
          type='file'
          accept='.dll'
          onChange={handleFileChange}
        />
        <label htmlFor='newFitFunName'>
          <span>Nazwa:</span>
          <input
            id='newFitFunName'
            type='text'
            value={fitfunName}
            onChange={e => setFitfunName(e.target.value)}
          />
        </label>

        <input type='submit' value={"Dodaj"} />
      </form>
    </div>
  )
}
