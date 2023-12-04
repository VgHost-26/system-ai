import React, { useState } from "react"
//import { initiateBackendProcess } from './api';

export const Start = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dimension, setDimension] = useState(1)
  const [population, setPopulation] = useState(10)
  const [iterations, setIterations] = useState(1)

  const simulateBackendProcess = () => {
    return new Promise((resolve, reject) => {
      // Simulate backend process
      setLoading(true)
      setTimeout(() => {
        if (Math.random() > 0.5) {
          console.log("Simulated backend process successful")
          setLoading(false)
          resolve("Success")
        } else {
          console.error("Simulated backend process failed")
          setLoading(false)
          reject("Error")
        }
      }, 2000) // Simulate a 2-second delay
    })
  }

  const startProcess = () => {
    setLoading(true)
    setError(null)

    simulateBackendProcess()
      .then(response => {
        console.log("Backend process initiated:", response)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error initiating backend process:", err)
        setError("Error initiating backend process")
        setLoading(false)
      })
    /*
    initiateBackendProcess(newSelAlgo, selFitfun, dimension, population)
      .then((response) => {
        console.log('Backend process initiated:', response);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error initiating backend process:', err);
        setError('Error initiating backend process');
        setLoading(false);
      });
    */
  }

  const handleDimensionChange = e => {
    setDimension(e.target.value)
  }

  const handlePopulationChange = e => {
    const value = parseInt(e.target.value)
    if (!isNaN(value)) {
      setPopulation(value)
    }
  }

  const handleIterationsChange = e => {
    const value = parseInt(e.target.value)
    if (!isNaN(value)) {
      setIterations(value)
    }
  }

  return (
    <div id='sectionStart' className='section' style={{ gridArea: "run" }}>
      <p className='sectionTitle'>Start </p>
      <hr />
      <div>
        <label>
          Dimension:
          <input
            type='number'
            value={dimension}
            min='1'
            onChange={handleDimensionChange}
          />
        </label>
      </div>
      <div>
        <label>
          Population:
          <input
            type='number'
            value={population}
            min='1'
            onChange={handlePopulationChange}
          />
        </label>
      </div>
      <div>
        <label>
          Iterations:
          <input
            type='number'
            value={iterations}
            min='1'
            onChange={handleIterationsChange}
          />
        </label>
      </div>
      {loading ? (
        <progress></progress>
      ) : (
        <div>
          {/*
          <button onClick={() => startProcess} disabled={!selAlgo || !selFitfun}>
            Start Process
          </button>
          */}
          <button onClick={startProcess}>Start Process</button>
        </div>
      )}
      {error && <p className='error'>{error}</p>}
    </div>
  )
}
