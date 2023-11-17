import React, { useState } from 'react'

export const AddAlgo = () => {
  const [algo, setAlgo] = useState({ 'name': '' })
  const [algoName, setAlgoName] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    setAlgo(newAlgo.files[0])
    setAlgoName(newAlgoName.value)
  }

  const handleFileChange = () => {
    if (newAlgoName.value == '') {
      setAlgoName(newAlgo.files[0].name.slice(0, -4))
    }
  }

  return (
    <div id="addAlgo">
      <form onSubmit={e => handleSubmit(e)}>
        Dodaj Algorytm
        <hr />
        <label htmlFor='newAlgoName'>
          Nazwa:
          <input id='newAlgoName' type='text' value={algoName} onChange={e => setAlgoName(e.target.value)} />
        </label>
        <input id='newAlgo' type='file' accept='.dll' onChange={handleFileChange} />


        <input type='submit' value={'Dodaj'} />
      </form>

    </div>
  )
}
