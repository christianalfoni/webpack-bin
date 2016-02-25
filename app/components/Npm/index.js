import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';
import NpmPackage from '../NpmPackage';

@Cerebral({
  packages: 'bin.currentBin.packages',
  searchQuery: 'npm.searchQuery',
  packageNameQuery: 'npm.packageNameQuery',
  bundles: 'npm.bundles',
  isGettingPackage: 'npm.isGettingPackage',
  isSearchingBundles: 'npm.isSearchingBundles',
  packageError: 'npm.packageError'
})
class Npm extends React.Component {
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
  renderBundles() {
    return this.props.bundles.map((bundle, index) => (
      <div
        className={styles.bundle}
        key={index}
        onClick={() => this.props.signals.npm.bundleClicked({packages: bundle.packages})}>
        {Object.keys(bundle.packages).map((key, index) => (
          <span className={styles.bundlePackage} key={index}>
            {key} <small>{bundle.packages[key]}</small>
          </span>
        ))}
      </div>
    ));
  }
  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.column}>
          <h3 className={styles.title}>Bundled packages</h3>
          <input
            type="text"
            className={styles.search}
            placeholder="Search existing bundles..."
            disabled={this.props.isGettingPackage}
            onChange={(e) => this.props.signals.npm.searchBundleQueryChanged({query: e.target.value})}
            value={this.props.searchBundleQuery}/>
          {
            this.props.isSearchingBundles ?
              <div className={styles.searching}>Searching...</div>
            :
              this.renderBundles()
          }
        </div>
        <div className={styles.column}>
          <h3 className={styles.title}>Current package bundle</h3>
          <form onSubmit={(e) => this.onFormSubmitted(e)}>
            <input
              type="text"
              ref="packageSearch"
              className={styles.search}
              placeholder="Add NPM package..."
              disabled={this.props.isGettingPackage}
              onChange={(e) => this.props.signals.npm.packageNameQueryChanged({query: e.target.value})}
              value={this.props.packageNameQuery}/>
          </form>
          {
            this.props.packageError ?
              <div className={styles.error}>ERROR: Could not find package</div>
            :
              null
          }
          {this.renderSelectedPackages()}
        </div>
      </div>
    );
  }
}

 export default Npm;
