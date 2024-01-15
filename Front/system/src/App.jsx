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
import { parseParams } from './functions'

const authors = ['a', 'b', 'c', 'd']
authors.sort(() => Math.random() - 0.5)

const apiURL = 'http://localhost:5076/api'
const endpointGetAlgos = '/Algorithms'
const endpointGetFunctions = '/Functions'
const endpointRun = '/run'
const andpointAddFitfun = '/addFitnessFunction?name='
const endpointAddAlgo = '/addAlgorithm?name='

function App() {
  const [serverResponse, setServerResponse] = useState(null)
  const [allResponses, setAllResponses] = useState([])
  const [iterations, setIterations] = useState(1);
  const [population, setPopulation] = useState(10);

  const fetchFitFunctions = () => {
    axios
      .get(apiURL + endpointGetFunctions)
      .then(response => {
        let fetchedFitFunNames;

        // Check if the response is a string and parse it
        if (typeof response.data === 'string') {
          fetchedFitFunNames = response.data.split(',');
        } else if (Array.isArray(response.data)) {
          // If it's already an array, use it directly
          fetchedFitFunNames = response.data;
        } else {
          console.error('Unexpected response format for fit functions:', response);
          return;
        }

        // Create fit function objects from the names
        const fetchedFitFuns = fetchedFitFunNames.map(name => ({
          name,
          // You can set a default domain or fetch it from another API endpoint if needed
          domain: '[[-1,-1],[1,1]]',
        }));

        // Setting the fit functions
        console.log(fetchedFitFuns);
        setFitfuns(fetchedFitFuns);
      })
      .catch(error => {
        console.error('Error fetching fit functions:', error);
      });
  };

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
      })
      .catch(error => {
        console.error('There was an error sending the POST request:', error)
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
        fetchFitFunctions();
      })
      .catch(error => {
        console.error('There was an error sending the POST request:', error)
      })
  }

  function startAlgo() {
    const algoParams = [...params.map(param => param.value), iterations, population];
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

  const [fitfuns, setFitfuns] = useState([
  ])

  const [algos, setAlgos] = useState([
    {
      name: 'Archimedes',
      params: [
        {
          name: 'C1',
          desc: 'po prostu stała',
          lowerBound: 1,
          upperBound: 2,
        },
        {
          name: 'C2',
          desc: 'prosze użyć wartości parzystych',
          lowerBound: 2,
          upperBound: 6,
          step: 2,
        },
        {
          name: 'C3',
          desc: 'po prostu stała',
          lowerBound: 1,
          upperBound: 2,
        },
        {
          name: 'C4',
          desc: 'po prostu stała',
          lowerBound: 0.5,
          upperBound: 1,
          step: 0.5,
        },
      ],
    },
  ])

  useEffect(() => {
    fetchFitFunctions();
  }, []);

  const [selAlgo, setSelAlgo] = useState()
  const [params, setParams] = useState([
    { name: 'iter', value: 1 },
    { name: 'pop', value: 10 },
  ])
  const [trigger, setTrigger] = useState(0)
  const [ip, setIp] = useState([1, 10]) //iterations, population
  const [selFitfuns, setSelFitfuns] = useState([])
  const [restorePoints, setRestorePoints] = useState([])

  return (
    <>
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
      />
      <Notify type='' anchor='addFitFun'>
        Notification test
      </Notify>
      <AddAlgo handleAddAlgo={addAlgo} />
      <AddFitFun handleAddFun={addFitFun} />
      <Start
        selAlgo={selAlgo}
        selFitfuns={selFitfuns}
        startAlgo={startAlgo}
        params={params}
        setParams={setParams}
        iterations={iterations}
        population={population}
        setPopulation={setPopulation}
        setIterations={setIterations}
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
