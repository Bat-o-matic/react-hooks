// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStore(key, initialState = {}) {
  const [state, setState] = React.useState(() => {
    const localValue = window.localStorage.getItem(key)
    if (localValue) {
      try {
        return JSON.parse(localValue)
      } catch (error) {
        window.localStorage.removeItem(key)
      }
    }
    return initialState
  })

  React.useEffect(() => {
    var serialised = JSON.stringify(state)
    window.localStorage.setItem(key, serialised)
  }, [state])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  // const [name, setName] = React.useState(
  //   () => window.localStorage.getItem('name') ?? initialName,
  // )

  // React.useEffect(() => {
  //   window.localStorage.setItem('name', name)
  // }, [name])

  const [name, setName] = useLocalStore('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
