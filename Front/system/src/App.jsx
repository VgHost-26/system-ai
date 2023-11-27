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

  return (
    <>
      <SelectAlgo algos={algos} />
      <SelectFitFun fitfuns={fitfuns} />
      <AddAlgo />
      <AddFitFun />
      <Start />
      <Restore />
      <Results />
      <HelpButton />
    </>
  )
}

export default App
