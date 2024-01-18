import React, { useState } from 'react'

export const AddAlgo = ({ handleAddAlgo }) => {
  const [algo, setAlgo] = useState({ name: '' })
  const [algoName, setAlgoName] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    if (newAlgo.value) {
      // setAlgo(newAlgo.files[0])
      handleAddAlgo(newAlgoName.value, newAlgo.files[0])
      // clear inputs
      setAlgoName('')
      newAlgo.value = null
    }
  }

  const handleFileChange = () => {
    if (newAlgoName.value == '') {
      setAlgoName(newAlgo.files[0].name.slice(0, -4))
    }
  }

  return (
    <div id='addAlgorithm' className='section'>
      <form onSubmit={e => handleSubmit(e)}>
        <p className='sectionTitle'>Dodaj Algorytm</p>
        <hr />
        <input
          id='newAlgo'
          type='file'
          accept='.dll'
          onChange={handleFileChange}
        />
        <label htmlFor='newAlgoName'>
          <span>Nazwa:</span>
          <input
            id='newAlgoName'
            type='text'
            value={algoName}
            onChange={e => setAlgoName(e.target.value)}
          />
        </label>

        <input id='addAlgoSubmit' type='submit' value={'Dodaj'} />
      </form>
    </div>
  )
}
