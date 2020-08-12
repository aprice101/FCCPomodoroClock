const Header = () => <h1 id="title">Pomodoro Clock</h1>;

const SetTimer = ({ type, value, handleClick }) => (
  <div className="set-timer">
    <h3 id={`${type}-label`}>
      {type == "session" ? "Session " : "Break "} Length
    </h3>
    <div className="set-timer-controls">
      <button
        id={`${type}-decrement`}
        className={`${type}-button`}
        onClick={() => handleClick(false, `${type}Value`)}
      >
        &darr;
      </button>
      <div id={`${type}-length`}>{value}</div>
      <button
        id={`${type}-increment`}
        className={`${type}-button`}
        onClick={() => handleClick(true, `${type}Value`)}
      >
        &uarr;
      </button>
    </div>
  </div>
);

const Timer = ({ mode, time }) => (
  <div className="Timer">
    <h1 id="timer-label">{mode === "session" ? "Session" : "Break"}</h1>
    <h3 id="instruction">
      {mode === "session" ? "Time to work!" : "Take a well earned rest"}
    </h3>
    <h1 id="time-left">{time}</h1>
  </div>
);

const Controls = ({ active, handleReset, handlePlayPause }) => (
  <div className="Controls">
    <button id="start_stop" onClick={handlePlayPause}>
      {active ? <span>&#10074;&#10074;</span> : <span>&#9658;</span>}
    </button>
    <button id="reset" onClick={handleReset}>
      &#8635;
    </button>
  </div>
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakValue: 5,
      sessionValue: 25,
      mode: "session",
      time: 25 * 60 * 1000,
      active: false,
      touched: false
    };
  }
  handleSetTimers = (inc, type) => {
    if (this.state[type] === 60 && inc) return;
    if (this.state[type] === 1 && !inc) return;
    let amount = this.state[type] + (inc ? 1 : -1);

    this.setState({ [type]: this.state[type] + (inc ? 1 : -1) });
    if (type === "sessionValue") {
      this.setState({ time: amount * 60 * 1000 });
    }
  };

  handleReset = () => {
    this.setState({
      breakValue: 5,
      sessionValue: 25,
      time: 25 * 60 * 1000,
      touched: false,
      active: false,
      mode: "session"
    });

    clearInterval(this.pomodoro);
    this.audio.pause();
    this.audio.currentTime = 0;
  };

  handlePlayPause = () => {
    if (this.state.active) {
      clearInterval(this.pomodoro);
      this.setState({ active: false });
    } else {
      if (this.state.touched) {
        this.pomodoro = setInterval(
          () => this.setState({ time: this.state.time - 1000 }),
          1000
        );
        this.setState({ active: true });
      } else {
        this.setState(
          {
            time: this.state.sessionValue * 60 * 1000,
            touched: true,
            active: true
          },
          () =>
            (this.pomodoro = setInterval(
              () => this.setState({ time: this.state.time - 1000 }),
              1000
            ))
        );
      }
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.time === 0 && prevState.mode === "session") {
      this.setState({ time: this.state.breakValue * 60 * 1000, mode: "break" });
      this.audio.play();
    }
    if (prevState.time === 0 && prevState.mode === "break") {
      this.setState({
        time: this.state.sessionValue * 60 * 1000,
        mode: "session"
      });
      this.audio.play();
    }
  }

  render() {
    const timeMins = Math.floor(this.state.time / 60000).toString();
    const timeSecs = ((this.state.time % 60000) / 1000).toString();

    function parseTime(min, secs) {
      var newMin = "";
      var newSecs = "";
      if (min.length < 2) {
        newMin = "0".concat(min);
      } else {
        newMin = min;
      }
      if (secs.length < 2) {
        newSecs = ":0".concat(secs);
      } else {
        newSecs = ":".concat(secs);
      }
      return newMin.concat(newSecs);
    }
    var parsedTime = parseTime(timeMins, timeSecs);

    return (
      <div id="container">
        <Header />
        <div className="settings">
          <SetTimer
            type="break"
            value={this.state.breakValue}
            handleClick={this.handleSetTimers}
          />
          <SetTimer
            type="session"
            value={this.state.sessionValue}
            handleClick={this.handleSetTimers}
          />
        </div>
        <Timer mode={this.state.mode} time={parsedTime} />
        <Controls
          active={this.state.active}
          handleReset={this.handleReset}
          handlePlayPause={this.handlePlayPause}
        />
        <audio
          id="beep"
          src="https://sampleswap.org/samples-ghost/MELODIC%20LOOPS/WORLD%20LOOPS/360[kb]115_new-york-bell-rhythm.wav.mp3"
          ref={(el) => (this.audio = el)}
        ></audio>
        <p id="attribution">Made by Amy</p>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
