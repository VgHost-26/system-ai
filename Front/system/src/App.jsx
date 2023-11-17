import './App.css'
import { AddAlgo } from './components/AddAlgo'
import { AddFitFun } from './components/AddFitFun'
import { HelpButton } from './components/HelpButton'
import { SelectAlgo } from './components/SelectAlgo'
import { SelectFitFun } from './components/SelectFitFun'
import { Results } from './components/Results'

function App() {

  return (
    <>
      <SelectAlgo />
      <SelectFitFun />
      <AddAlgo />
      <AddFitFun />
      <Results />
      <HelpButton />

    </>
  )
}

export default App
