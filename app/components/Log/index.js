import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';
import Inspector from '../Inspector';

@Cerebral({
  logs: 'bin.logs'
})
class Log extends React.Component {
  render() {
    return (
      <div className={styles.wrapper}>
        {this.props.logs.map((value, index) => (
          <div className={styles.log} key={index}>
            <Inspector value={value}/>
          </div>
        ))}
      </div>
    );
  }
}

 export default Log;
