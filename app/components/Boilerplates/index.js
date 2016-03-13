import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';

const boilerplates = {
  'react': 'React',
  'cerebral': 'Cerebral',
  'redux': 'Redux',
  'cycle': 'Cycle JS',
  'vue': 'Vue JS',
  'angular': 'Angular'
};

@Cerebral()
class Boilerplates extends React.Component {
  render() {
    return (
      <div className={styles.wrapper}>
        {Object.keys(boilerplates).map((key, index) => {
          return (
            <div
              className={styles.boilerplate}
              key={index}
              onClick={() => this.props.signals.bin.boilerplateClicked({name: key})}>
              {boilerplates[key]}
            </div>
          );
        })}
      </div>
    );
  }
}

 export default Boilerplates;
