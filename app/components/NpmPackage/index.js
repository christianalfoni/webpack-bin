import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';

@Cerebral({
  packages: 'bin.packages'
})
class NpmPackage extends React.Component {
  isActive() {
    return this.props.packages[this.props.package.name] === this.props.package.version;
  }
  render() {
    return (
      <div className={styles.wrapper} onClick={() => this.props.signals.bin.togglePackage({package: this.props.package})}>
        <input type="checkbox" checked={this.isActive()} readOnly/>
        {this.props.package.name} <small>{this.props.package.version}</small>
      </div>
    );
  }
}

 export default NpmPackage;
