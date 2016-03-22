import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';

@Cerebral({
  boilerplates: 'bin.boilerplates'
})
class Boilerplates extends React.Component {
  render() {
    return (
      <div className={styles.wrapper}>
        {Object.keys(this.props.boilerplates).map((key, index) => {
          return (
            <div
              className={styles.boilerplate}
              key={index}
              onClick={() => this.props.signals.bin.boilerplateClicked({name: key})}>
              {this.props.boilerplates[key]}
            </div>
          );
        })}
      </div>
    );
  }
}

 export default Boilerplates;
