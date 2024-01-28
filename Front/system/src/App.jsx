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

const authors = [
  'Marcin Widuch',
  'Bartek Głuchowicz',
  'Arseni Mokhau',
  'Paweł Cykowski',
]
authors.sort(() => Math.random() - 0.5)
const testModeEnum = {
  SINGLE_ALGORITHM: 'Pojedynczy algorytm',
  MULTIPLE_ALGORITHMS: 'Wiele algorytmów',
}

const apiURL = 'http://localhost:5076/api'
const endpointGetAlgos = '/Algorithms'
const endpointGetFunctions = '/Functions'
const endpointRun = '/run'
const endpointRunMultiple = '/run-multiple'
const andpointAddFitfun = '/addFitnessFunction?name='
const endpointAddAlgo = '/addAlgorithm?name='
const endpointGetAlgosInfo = '/ParamsInfo?algorithmName='
const endpointRunTSFDE = '/TSFDE'

function App() {
  const [serverResponse, setServerResponse] = useState(null)
  const [allResponses, setAllResponses] = useState([])
  const [iterations, setIterations] = useState(10)
  const [population, setPopulation] = useState(10)
  const [notificationFuns, setNotificationFuns] = useState({
    type: '',
    message: '',
  })
  const [notificationStart, setNotificationStart] = useState({
    type: '',
    message: '',
  })
  const [notificationAlgos, setNotificationAlgos] = useState({
    type: '',
    message: '',
  })
  const [testMode, setTestMode] = useState(testModeEnum.SINGLE_ALGORITHM)
  const [selAlgoList, setSelAlgoList] = useState([])

  const showNotificationFuns = (message, type) => {
    setNotificationFuns({ message, type })
  }

  const showNotificationAlgos = (message, type) => {
    setNotificationAlgos({ message, type })
  }

  const showNotificationStart = (message, type) => {
    setNotificationStart({ message, type })
  }

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

        // Use Set to ensure uniqueness
        const uniqueAlgoNamesSet = new Set(fetchedAlgos)

        // Convert Set back to an array
        const uniqueAlgoNamesArray = Array.from(uniqueAlgoNamesSet)

        // Fetch algorithm details for unique names
        Promise.all(
          uniqueAlgoNamesArray.map(algoName =>
            axios.get(apiURL + endpointGetAlgosInfo + algoName)
          )
        )
          .then(responses => {
            const updatedAlgos = responses.map((response, index) => ({
              name: uniqueAlgoNamesArray[index],
              params: response.data,
            }))

            // Set unique algorithms in the state
            setAlgos(updatedAlgos)
          })
          .catch(error => {
            console.error('Error while adding algos: ', error)
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

  // function takeFunctionsFromServer() {
  //   axios
  //     .get(apiURL + endpointGetFunctions)
  //     .then(response => {
  //       console.log(response.data)
  //       setFitfuns(response.data)
  //     })
  //     .catch(error => {
  //       console.error('Błąd:' + error)
  //     })
  // }

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
    if (testMode === testModeEnum.SINGLE_ALGORITHM) {
      setIsInProgress(true)

      if (selFitfuns[0].name == 'TSFDE') {
        const algoParams = [
          ...params.map(param => param.value),
          iterations,
          population,
        ]
        console.log('TEST', {
          algorithmName: selAlgo.name,
          domain: selFitfuns[0].domain,
          parameters: algoParams,
        })
        axios
          .post(
            apiURL + endpointRunTSFDE,
            {
              algorithmName: selAlgo.name,
              domain: selFitfuns[0].domain,
              parameters: algoParams,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
          .then(response => {
            setIsInProgress(false)
            const formattedResponses = response.data.response.map(
              (res, index) =>
                `(${
                  testMode === testModeEnum.SINGLE_ALGORITHM
                    ? 'Pojedynczy algorytm'
                    : 'Wiele algorytmów'
                }) <br/> Data: ${getNowTimeInNiceFormat()} <br/> Algorytm: ${
                  selAlgo.name
                }, [${params.map(param => param.value)}]<br/> Funkcja: ${
                  selFitfuns[index].name
                }, Wymiar: ${
                  selFitfuns[index].domain
                }<br/> XBest: [${res.xBestValue.join(', ')}], FBest: ${
                  res.fBestValue
                }`
            )

            setAllResponses(prevResponses => [
              ...formattedResponses,
              ...prevResponses,
            ])

            // console.log(
            //   selFitfuns.map(fun => ({
            //     name: fun.name,
            //     domain: fun.domain,
            //   }))
            // )
            console.log('Response from server:', response.data)
          })
          .catch(error => {
            showNotificationStart(
              'There was an error sending the request',
              'error'
            )
            console.error('There was an error sending the POST request:', error)
            setIsInProgress(false)
          })
      } else {
        const algoParams = [
          ...params.map(param => param.value),
          iterations,
          population,
        ]
        // console.log(algoParams)
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
            setIsInProgress(false)
            const formattedResponses = response.data.response.map(
              (res, index) =>
                `(${
                  testMode === testModeEnum.SINGLE_ALGORITHM
                    ? 'Pojedynczy algorytm'
                    : 'Wiele algorytmów'
                }) <br/> Data: ${getNowTimeInNiceFormat()} <br/> Algorytm: ${
                  selAlgo.name
                }, [${params.map(param => param.value)}]<br/> Funkcja: ${
                  selFitfuns[index].name
                }, Wymiar: ${
                  selFitfuns[index].domain
                }<br/> XBest: [${res.xBestValue.join(', ')}], FBest: ${
                  res.fBestValue
                }`
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
            showNotificationStart(
              'There was an error sending the request',
              'error'
            )
            console.error('There was an error sending the POST request:', error)
            setIsInProgress(false)
          })
      }
    } else if (testMode === testModeEnum.MULTIPLE_ALGORITHMS) {
      setIsInProgress(true)
      axios
        .post(
          apiURL + endpointRunMultiple,
          {
            algorithms: selAlgoList.map(alg => ({
              name: alg.name,
              steps: alg.steps,
            })),
            fitnessFunction: {
              name: selFitfuns[0].name,
              domain: selFitfuns[0].domain,
            },
            population: parseInt(population),
            iteration: parseInt(iterations),
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then(response => {
          setIsInProgress(false)
          const formattedResponses = response.data.map(
            (res, index) =>
              `(${
                testMode === testModeEnum.SINGLE_ALGORITHM
                  ? 'Pojedynczy algorytm'
                  : 'Wiele algorytmów'
              }) <br/> Data: ${getNowTimeInNiceFormat()}<br/> Algorytm: ${
                res.algorithmName
              }, [${res.bestParameters}]<br/> Funkcja: ${
                selFitfuns[0].name
              }, Wymiar: ${selFitfuns[0].domain}<br/> XBest: [${res.bestX.join(
                ', '
              )}], FBest: ${res.bestF}`
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
          showNotificationStart(
            'There was an error sending the request',
            'error'
          )
          console.error('There was an error sending the POST request:', error)
          setIsInProgress(false)
        })
    }
  }

  const getNowTimeInNiceFormat = () => {
    let now = new Date()
    let time = now.toISOString()
    time = time.substring(time.indexOf('T') + 1, time.indexOf('.'))
    return time
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
  const [serverConnectionState, setServerConnectionState] = useState('loading')
  const [isInProgress, setIsInProgress] = useState(false)

  return (
    <>
      {successConfirm.module === 'algo' ? (
        <Notify
          type={successConfirm.type}
          anchor='addAlgorithm'
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
          anchor='addFitFun'
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
        type={notificationStart.type}
        anchor='sectionStart'
        clearUseState={setNotificationStart}
      >
        {notificationStart.message}
      </Notify>
      <Notify
        type={notificationFuns.type}
        anchor='selectFitFun'
        clearUseState={setNotificationFuns}
      >
        {notificationFuns.message}
      </Notify>
      <Notify
        type={notificationAlgos.type}
        anchor='selectAlgorithm'
        clearUseState={setNotificationAlgos}
      >
        {notificationAlgos.message}
      </Notify>
      <SelectAlgo
        selAlgo={selAlgo}
        setSelAlgo={setSelAlgo}
        params={params}
        setParams={setParams}
        algos={algos}
        showNotification={showNotificationAlgos}
        testModeEnum={testModeEnum}
        testMode={testMode}
        setTestMode={setTestMode}
        selAlgoList={selAlgoList}
        setSelAlgoList={setSelAlgoList}
      />
      <SelectFitFun
        selFitfuns={selFitfuns}
        setSelFitfuns={setSelFitfuns}
        fitfuns={fitfuns}
        showNotification={showNotificationFuns}
        testMode={testMode}
        testModeEnum={testModeEnum}
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
        loading={isInProgress}
      />
      <Restore restorePoints={restorePoints} />
      <Results allResponses={allResponses} />

      <HelpButton>
        Dla najlepszych doświadczeń zalecamy używać strony na pełnym ekranie
        <br />
        <h6>
          <i>
            wcale to nie jest tak że nam się nie chciało zrobić responsywnej
            strony :P
          </i>
        </h6>
        <b>Wybierz Algorytm</b> - w tym polu należy wybrać algorytm
        optymalizacyjny. Jeśli lista algorytmów jest pusta dodaj algorytm przy
        pomocy pola <b>Dodaj Algorytm</b>
        <br />
        Po wybraniu pojawi się lista parametrów do jego dostrojenia.
        <br />
        <br />
        <b>Dodaj Algorytm</b> - wybierz plik .dll ze swoim algorytmem
        optymalizacyjnym (jeśli chcesz zmień nazwę jego nazwę) i naciśnij
        przycisk 'Dodaj'
        <br />
        <br />
        <b>Wybierz Funkcje Celu</b> - tutaj wybierasz funkcję sprawdzającą
        działanie wybranego algorytmu, oraz wymiar (<i>dimension</i>).
        <br /> Jeśli na liście nie ma funkcji dodaj ją przy pomocy pola{' '}
        <b>Dodaj Algorytm</b>
        <br />
        <br />
        <b>Dodaj Funkcję Celu</b> - wybierz plik .dll ze swoją funkcją celu
        (jeśli chcesz zmień nazwę jej nazwę) i naciśnij przycisk 'Dodaj'
        <br />
        <br />
        <b>Start</b> - wybierz <i>populację</i> i <i>ilość iteracji</i> a
        anstepni naciśnij przycisk 'Start'.
        <br />
        Po ukończeniu sprawdzania algorytmu w sekcji <b>Wyniki</b> pojawi sie
        szybki podgląd wyników oraz link do szczegółowego PDFu
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
