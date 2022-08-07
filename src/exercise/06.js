// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const states = {
    idle: 'idle',
    pending: 'pending',
    resolved: 'resolved',
    rejected: 'rejected',
  }

  const [pokemonState, setPokemonState] = React.useState({
    status: states.idle,
    pokemonInfo: null,
    error: null,
  })
  const {status, pokemonInfo, error} = pokemonState

  React.useEffect(() => {
    setPokemonState({status: states.idle})

    if (!pokemonName) {
      return
    }

    setPokemonState({status: states.pending})

    fetchPokemon(pokemonName).then(
      pokemonData => {
        setPokemonState({status: states.resolved, pokemonInfo: pokemonData})
      },
      error => {
        setPokemonState({status: states.rejected, error: error})
      },
    )
  }, [pokemonName])

  if (status === states.rejected) {
    throw error
  } else if (status === states.idle) {
    return 'Submit a pokemon'
  } else if (status === states.pending) {
    return <PokemonInfoFallback name={pokemonName} />
  } else {
    return <PokemonDataView pokemon={pokemonInfo} />
  }
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          resetKeys={[pokemonName]}
          onReset={() => setPokemonName('')}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
