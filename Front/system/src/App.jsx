import './App.css'
import { AddAlgo } from './components/AddAlgo'
import { AddFitFun } from './components/AddFitFun'
import { HelpButton } from './components/HelpButton'
import { SelectAlgo } from './components/SelectAlgo'
import { SelectFitFun } from './components/SelectFitFun'
import { Results } from './components/Results'
import { useEffect, useState } from 'react'
import { Start } from './components/Start'
import { Restore } from './components/Restore'
import axios from 'axios'
import { Notify } from './components/Notify'

const authors = ['a', 'b', 'c', 'd']
authors.sort(() => Math.random() - 0.5)

const apiURL = 'http://localhost:5076/api'
const endpointGetAlgos = '/Algorithms'
const endpointGetFunctions = '/Functions'
const endpointRun = '/run'
const andpointAddFitfun = '/addFitnessFunction?name='
const endpointAddAlgo = '/addAlgorithm?name='
const endpointGetAlgosInfo = '/ParamsInfo?algorithmName='

function App() {
  const [serverResponse, setServerResponse] = useState(null)
  const [allResponses, setAllResponses] = useState([])
  const [iterations, setIterations] = useState(1)
  const [population, setPopulation] = useState(10)
  const [notification, setNotification] = useState({ type: '', message: '' });

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const fetchFitFunctions = () => {
    axios
      .get(apiURL + endpointGetFunctions)
      .then(response => {
        let fetchedFitFunNames

        // Check if the response is a string and parse it
        if (typeof response.data === 'string') {
          fetchedFitFunNames = response.data.split(',')
        } else if (Array.isArray(response.data)) {
          // If it's already an array, use it directly
          fetchedFitFunNames = response.data
        } else {
          console.error(
            'Unexpected response format for fit functions:',
            response
          )
          return
        }

        // Create fit function objects from the names
        const fetchedFitFuns = fetchedFitFunNames.map(name => ({
          name,
          domain: '[[-1,-1],[1,1]]',
        }))

        // Setting the fit functions
        console.log(fetchedFitFuns)
        setFitfuns(fetchedFitFuns)
      })
      .catch(error => {
        console.error('Error fetching fit functions:', error)
      })
  }

  const fetchAlgos = () => {
    axios
      .get(apiURL + endpointGetAlgos)
      .then(response => {
        let fetchedAlgos

        if (typeof response.data === 'string') {
          fetchedAlgos = response.data.split(',')
        } else if (Array.isArray(response.data)) {
          fetchedAlgos = response.data
        } else {
          console.error(
            'Unexpected response format for fit functions:',
            response
          )
          return
        }
        fetchedAlgos.map(algoName => {
          axios
            .get(apiURL + endpointGetAlgosInfo + algoName)
            .then(response => {
              setAlgos([...algos, { name: algoName, params: response.data }])
              // console.log(response.data)
              // console.log(algos)
            })
            .catch(error => {
              console.error('Error while adding the algo: ', error)
            })
        })
      })
      .catch(error => {
        console.error('Error fetching algos: ', error)
      })
  }

  function addAlgo(name, newAlgo) {
    // wysłanie funkcji na serwer
    axios
      .post(
        apiURL + endpointAddAlgo + name,
        { file: newAlgo },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      .then(response => {
        // informacja zwrotna
        console.log('Response from server:', response.data)
        setSuccessConfirm({ module: 'algo', type: 'good' })

        fetchAlgos()
      })
      .catch(error => {
        console.error('There was an error sending the POST request:', error)
        setSuccessConfirm({ module: 'algo', type: 'bad' })
      })
  }

  function takeFunctionsFromServer() {
    axios
      .get(apiURL + endpointGetFunctions)
      .then(response => {
        console.log(response.data)
        setFitfuns(response.data)
      })
      .catch(error => {
        console.error('Błąd:' + error)
      })
  }

  function addFitFun(name, newFun) {
    // wysłanie funkcji na serwer
    axios
      .post(
        apiURL + andpointAddFitfun + name,
        { file: newFun },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      .then(response => {
        // informacja zwrotna
        console.log('Response from server:', response.data)
        setSuccessConfirm({ module: 'fitFun', type: 'good' })

        fetchFitFunctions()
      })
      .catch(error => {
        console.error('There was an error sending the POST request:', error)
        setSuccessConfirm({ module: 'fitFun', type: 'bad' })
      })
  }

  function startAlgo() {
    const algoParams = [
      ...params.map(param => param.value),
      iterations,
      population,
    ]
    console.log(algoParams)
    axios
      .post(
        apiURL + endpointRun,
        {
          algorithmName: selAlgo.name,
          fitnessFunctions: selFitfuns.map(fun => ({
            name: fun.name,
            domain: fun.domain,
          })),
          parameters: algoParams,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then(response => {
        const formattedResponses = response.data.response.map(
          (res, index) =>
            `Algorytm: ${selAlgo.name}, Funkcja: ${
              selFitfuns[index].name
            }, Wymiar: ${
              selFitfuns[index].domain
            } - XBest: [${res.xBestValue.join(', ')}], FBest: ${
              res.fBestValue
            }, Iterations: ${res.numberOfEvaluationFitnessFunctionValue}`
        )

        setAllResponses(prevResponses => [
          ...formattedResponses,
          ...prevResponses,
        ])

        console.log(
          selFitfuns.map(fun => ({
            name: fun.name,
            domain: fun.domain,
          }))
        )
        console.log('Response from server:', response.data)
      })
      .catch(error => {
        console.log(
          selFitfuns.map(fun => ({
            name: fun.name,
            domain: fun.domain,
          }))
        )
        console.error('There was an error sending the POST request:', error)
      })
  }

  const formatResponse = response => {
    return `XBest: [${response.xBestValue}], FBest: ${response.fBestValue}, Iterations: ${response.numberOfEvaluationFitnessFunctionValue}`
  }

  const [fitfuns, setFitfuns] = useState([])

  const [algos, setAlgos] = useState([
    // {
    //   name: 'Archimedes',
    //   params: [
    //     {
    //       name: 'C1',
    //       desc: 'po prostu stała',
    //       lowerBound: 1,
    //       upperBound: 2,
    //     },
    //     {
    //       name: 'C2',
    //       desc: 'prosze użyć wartości parzystych',
    //       lowerBound: 2,
    //       upperBound: 6,
    //       step: 2,
    //     },
    //     {
    //       name: 'C3',
    //       desc: 'po prostu stała',
    //       lowerBound: 1,
    //       upperBound: 2,
    //     },
    //     {
    //       name: 'C4',
    //       desc: 'po prostu stała',
    //       lowerBound: 0.5,
    //       upperBound: 1,
    //       step: 0.5,
    //     },
    //   ],
    // },
  ])

  useEffect(() => {
    fetchFitFunctions()
    fetchAlgos()
  }, [])

  const [selAlgo, setSelAlgo] = useState()
  const [params, setParams] = useState([
    { name: 'iter', value: 1 },
    { name: 'pop', value: 10 },
  ])
  const [ip, setIp] = useState([1, 10]) //iterations, population
  const [selFitfuns, setSelFitfuns] = useState([])
  const [restorePoints, setRestorePoints] = useState([])
  const [successConfirm, setSuccessConfirm] = useState('')

  return (
    <>
      {successConfirm.module === 'algo' ? (
        <Notify
          type={successConfirm.type}
          anchor='addAlgoSubmit'
          clearUseState={setSuccessConfirm}
        >
          {successConfirm.type !== 'bad'
            ? 'Dodano pomyślnie'
            : 'Wystąpił błąd przy dodawaniu'}
        </Notify>
      ) : (
        <></>
      )}
      {successConfirm.module === 'fitFun' ? (
        <Notify
          type={successConfirm.type}
          anchor='addFitFunSubmit'
          clearUseState={setSuccessConfirm}
        >
          {successConfirm.type !== 'bad'
            ? 'Dodano pomyślnie'
            : 'Wystąpił błąd przy dodawaniu'}
        </Notify>
      ) : (
        <></>
      )}
      <Notify
  type={notification.type}
  anchor='selectFitFun'
  clearUseState={setNotification}
>
  {notification.message}
</Notify>
      <SelectAlgo
        selAlgo={selAlgo}
        setSelAlgo={setSelAlgo}
        params={params}
        setParams={setParams}
        algos={algos}
      />
      <SelectFitFun
        selFitfuns={selFitfuns}
        setSelFitfuns={setSelFitfuns}
        fitfuns={fitfuns}
        showNotification={showNotification}
      />
      
      <AddAlgo handleAddAlgo={addAlgo} />
      <AddFitFun handleAddFun={addFitFun} />
      <Start
        selAlgo={selAlgo}
        selFitfuns={selFitfuns}
        startAlgo={startAlgo}
        params={params}
        setParams={setParams}
        iterations={iterations}
        setIterations={setIterations}
        population={population}
        setPopulation={setPopulation}
      />
      <Restore restorePoints={restorePoints} />
      <Results allResponses={allResponses} />

      <HelpButton>
        <b>Wybierz Algorytm</b> - w tym polu należy wybrać algorytm
        optymalizacyjny. Jeśli lista algorytmów jest pusta dodaj algorytm przy
        pomocy pola <b>Dodaj Algorytm</b>
        Po wybraniu pojawi się lista parametrów do jego dostrojenia.
        <br />
        <br />
        <b>Dodaj Algorytm</b> - wybierz plik .dll ze swoim algorytmem
        optymalizacyjnym (jeśli chcesz zmień nazwę jego nazwę) i naciśnij
        przycisk 'Dodaj'
        <br />
        <br />
        <b>Wybierz Funkcje Celu</b> - tutaj wybierasz funkcję sprawdzającą
        działanie wybranego algorytmu. Jeśli w liście nie ma funkcji dodaj ją
        przy pomocy pola <b>Dodaj Algorytm</b>
        <br />
        <br />
        <b>Dodaj Funkcję Celu</b> - wybierz plik .dll ze swoją funkcją celu
        (jeśli chcesz zmień nazwę jego nazwę) i naciśnij przycisk 'Dodaj'
        <br />
        <br />
        <b>Start</b> - wybierz <i>wymiar</i>, <i>populację</i> i
        <i>ilość iteracji</i>, a anstepni naciśnij przycisk 'Start'
        <br />
        <br />
        <b>Autorzy:</b>
        <ul>
          {authors.map(name => {
            return <li key={name}>{name}</li>
          })}
        </ul>
      </HelpButton>
    </>
  )
}

export default App
