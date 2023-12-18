import "./App.css"
import { AddAlgo } from "./components/AddAlgo"
import { AddFitFun } from "./components/AddFitFun"
import { HelpButton } from "./components/HelpButton"
import { SelectAlgo } from "./components/SelectAlgo"
import { SelectFitFun } from "./components/SelectFitFun"
import { Results } from "./components/Results"
import { useState } from "react"
import { Start } from "./components/Start"
import { Restore } from "./components/Restore"
function App() {
  function addAlgo(name, newAlgo) {
    // wysłanie funkcji na serwer
    // informacja zwrotna
    // dodanie funkcji do 'algos'
  }
  function addFitFun(name, newFun) {
    // wysłanie funkcji na serwer
    // informacja zwrotna
    // dodanie funkcji do 'algos'
  }

  const [fitfuns, setFitfuns] = useState([
    { name: "Sphere", dim: 0 },
    { name: "Beale", dim: 2 },
  ])
  const [algos, setAlgos] = useState([
    {
      name: "Archimedes",
      params: [
        {
          name: "C1",
          desc: "po prostu stała",
          lowerBound: 1,
          upperBound: 2,
        },
        {
          name: "C2",
          desc: "prosze użyć wartości parzystych",
          lowerBound: 2,
          upperBound: 6,
          step: 2,
        },
        {
          name: "C3",
          desc: "po prostu stała",
          lowerBound: 1,
          upperBound: 2,
        },
        {
          name: "C4",
          desc: "po prostu stała",
          lowerBound: 0.5,
          upperBound: 1,
          step: 0.5,
        },
      ],
    },
  ])

  const [selAlgo, setSelAlgo] = useState()
  const [params, setParams] = useState()
  const [selFitfun, setSelFitfun] = useState()
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
        selFitfun={selFitfun}
        setSelFitfun={setSelFitfun}
        fitfuns={fitfuns}
      />
      <AddAlgo handleAddAlgo={addAlgo} />
      <AddFitFun handleAddFun={addFitFun} />
      <Start selAlgo={selAlgo} selFitfun={selFitfun} />
      <Restore restorePoints={restorePoints} />
      <Results />

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
        <b>Start</b> - wybierz <i>wymiar</i>, <i>populację</i> i{" "}
        <i>ilość iteracji</i>, a anstepni naciśnij przycisk 'Start'
      </HelpButton>
    </>
  )
}

export default App
