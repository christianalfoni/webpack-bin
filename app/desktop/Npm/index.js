import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';
import NpmPackage from '../NpmPackage';
import Loaders from '../Loaders';

const quickstarts = [{
  title: 'Simple',
  description: 'ES2015 entry point'
}, {
  title: 'Simple with CSS',
  description: 'ES2015 entry point with CSS'
}, {
  title: 'Typescript',
  description: 'Typescript entry point with CSS'
}]

@Cerebral({
  packages: 'bin.currentBin.packages',
  packageNameQuery: 'npm.packageNameQuery',
  isGettingPackage: 'npm.isGettingPackage',
  packageError: 'npm.packageError'
})
class Npm extends React.Component {
  constructor(props) {
    super(props);
    this.renderQuickstart = this.renderQuickstart.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.isGettingPackage && !this.props.isGettingPackage) {
      this.refs.packageSearch.focus();
    }
  }
  onFormSubmitted(e) {
    e.preventDefault();
    this.props.signals.npm.packageNameQuerySubmitted();
  }
  renderSelectedPackages() {
    return Object.keys(this.props.packages).map((key, index) => {
      return <NpmPackage key={index} name={key} version={this.props.packages[key]}/>
    });
  }
  renderQuickstart(quickstart, index) {
    return (
      <div
        className={styles.quickstart}
        key={index}
        onClick={() => this.props.signals.npm.quickstartClicked({index})}>
        <div className={styles.quickstartTitle}>{quickstart.title}</div>
        <div className={styles.quickstartDescription}>
          {quickstart.description}
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.column}>
          <h3 className={styles.title}>Quick start</h3>
          {quickstarts.map(this.renderQuickstart)}
        </div>
        <div className={styles.column}>
          <h3 className={styles.title}>Add NPM package</h3>
          <form onSubmit={(e) => this.onFormSubmitted(e)}>
            <input
              type="text"
              ref="packageSearch"
              className={styles.search}
              placeholder="Type name of package..."
              disabled={this.props.isGettingPackage}
              onChange={(e) => this.props.signals.npm.packageNameQueryChanged({query: e.target.value})}
              value={this.props.packageNameQuery}/>
          </form>
          <div className={styles.bundleInfo}>You can assign specific version with "@", ex. "react@0.14.7"</div>
          {
            this.props.packageError ?
              <div className={styles.error}>ERROR: Could not find package</div>
            :
              null
          }
          {this.renderSelectedPackages()}
        </div>
        <div className={styles.columnLarge}>
          <h3 className={styles.title}>Loaders</h3>
          <Loaders/>
        </div>
      </div>
    );
  }
}

 export default Npm;
