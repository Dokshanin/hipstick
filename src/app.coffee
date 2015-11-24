Timer = React.createClass
  getInitialState: ->
    secondsElapsed: 0

  tick: React.autoBind ->
    @setState secondsElapsed: @state.secondsElapsed + 1

  componentDidMount: ->
    setInterval @tick, 1000

  render: ->
    (React.DOM.div {}, [
      'Seconds Elapsed: ' + @state.secondsElapsed
    ])

React.renderComponent (Timer {}), document.body
