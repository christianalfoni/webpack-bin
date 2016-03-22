import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from '../styles.css';
import currentLoader from '../../../computed/currentLoader';

@Cerebral({
  loader: currentLoader
})
class CoffeescriptConfig extends React.Component {
  render() {
    const loader = this.props.loader;

    return (
      <div>
        <div className={styles.description}>
          With the .coffee extension on your files you can write CoffeeScript code
        </div>
      </div>
    );
  }
}

 export default CoffeescriptConfig;
