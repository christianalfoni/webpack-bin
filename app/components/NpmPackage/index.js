import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';

@Cerebral({
  packages: 'bin.packages'
})
class NpmPackage extends React.Component {
  isActive() {
    return this.props.packages[this.props.name] === this.props.version;
  }
  render() {
    return (
      <div className={styles.wrapper} onClick={() => {
        this.props.signals.bin.togglePackage({
          name: this.props.name, version: this.props.version
        });
      }}>
        <input type="checkbox" checked={this.isActive()} readOnly/>
        {this.props.name} <small>{this.props.version}</small>
      </div>
    );
  }
}

 export default NpmPackage;
