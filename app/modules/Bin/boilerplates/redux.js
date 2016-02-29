export default function (state) {
  const currentBin = state.select('bin.currentBin');

  currentBin.set('loaders', {
    babel: {
      stage0: true,
      es2015: true,
      react: true
    }
  });

  currentBin.set('packages', {
    'react': '0.14.7',
    'react-dom': '0.14.7',
    'redux': '3.3.1'
  });

  currentBin.set('files', [{
    name: 'main.js',
    content: `import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import Counter from './Counter'
import counter from './reducers'

const store = createStore(counter)
const rootEl = document.getElementById('app')

function render() {
  ReactDOM.render(
    <Counter
      value={store.getState()}
      onIncrement={() => store.dispatch({ type: 'INCREMENT' })}
      onDecrement={() => store.dispatch({ type: 'DECREMENT' })}
    />,
    rootEl
  )
}

render()
store.subscribe(render)`
  }, {
    name: 'reducers.js',
    content: `export default function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}`
  }, {
    name: 'Counter.js',
    content: `import React, { Component, PropTypes } from 'react'

class Counter extends Component {
  constructor(props) {
    super(props)
    this.incrementAsync = this.incrementAsync.bind(this)
    this.incrementIfOdd = this.incrementIfOdd.bind(this)
  }

  incrementIfOdd() {
    if (this.props.value % 2 !== 0) {
      this.props.onIncrement()
    }
  }

  incrementAsync() {
    setTimeout(this.props.onIncrement, 1000)
  }

  render() {
    const { value, onIncrement, onDecrement } = this.props
    return (
      <p>
        Clicked: {value} times
        {' '}
        <button onClick={onIncrement}>
          +
        </button>
        {' '}
        <button onClick={onDecrement}>
          -
        </button>
        {' '}
        <button onClick={this.incrementIfOdd}>
          Increment if odd
        </button>
        {' '}
        <button onClick={this.incrementAsync}>
          Increment async
        </button>
      </p>
    )
  }
}

Counter.propTypes = {
  value: PropTypes.number.isRequired,
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired
}

export default Counter`
  }]);

}
