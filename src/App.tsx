import { useState } from 'react'
import { steps } from './steps'

function App() {
  const [currentId, setCurrentId] = useState(steps[steps.length - 1].id)
  const current = steps.find((s) => s.id === currentId) ?? steps[0]
  const StepComponent = current.component

  return (
    <div className="layout">
      <nav>
        <h1>RHF Playground</h1>
        <ul>
          {steps.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className={s.id === currentId ? 'active' : ''}
                onClick={() => setCurrentId(s.id)}
              >
                {s.id}. {s.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <main>
        <h2>
          Step {current.id}. {current.title}
        </h2>
        <StepComponent />
      </main>
    </div>
  )
}

export default App
