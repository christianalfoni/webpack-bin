import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';
import Inspector from '../Inspector';

@Cerebral({
  logs: 'bin.logs',
  selectedPath: 'bin.selectedLogPath',
  connected: 'live.connected'
})
class Log extends React.Component {
  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.info}>Use bin.log() in your code to log</div>
        {
          this.props.logs.map((value, index) => (
            <div className={styles.log} key={index}>
              <Inspector
                value={value}
                path={[index]}
                highlight={this.props.connected}
                onTogglePath={this.props.signals.bin.logValueToggled}
                onSelectPath={this.props.signals.bin.logPathSelected}
                selectedPath={this.props.selectedPath}/>
            </div>
          ))
        }
      </div>
    );
  }
}

 export default Log;
