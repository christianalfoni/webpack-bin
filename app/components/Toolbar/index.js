import React, { PropTypes } from 'react';
import { Decorator as Cerebral, Link } from 'cerebral-view-react';
import styles from './styles.css';
import icons from 'common/icons.css';
import classNames from 'classnames';
import AddFile from '../AddFile';
import ToolbarButton from '../ToolbarButton';
import ToolbarButtonPopover from '../ToolbarButtonPopover';
import NpmPackage from '../NpmPackage';

@Cerebral({
  files: 'bin.files',
  selectedFileIndex: 'bin.selectedFileIndex',
  isLoading: 'bin.isLoading',
  isValid: 'bin.isValid',
  hasInitialized: 'bin.hasInitialized',
  showAddFileInput: 'bin.showAddFileInput',
  newFileName: 'bin.newFileName',
  npmPackages: 'bin.npmPackages',
  showPackagesSelector: 'bin.showPackagesSelector',
  showInfo: 'bin.showInfo'
})
class Toolbar extends React.Component {
  static propTypes = {
    files: PropTypes.array
  };
  renderNpmPackages() {
    return this.props.npmPackages.map((npmPackage, index) => {
      return <NpmPackage key={index} package={npmPackage}/>
    });
  }
  renderFiles() {
    return this.props.files.map((file, index) => {
      const active = index === this.props.selectedFileIndex;
      const signals = this.props.signals.bin;

      return (
        <div
          key={index}
          className={classNames(styles.file, {[styles.active]: active})}
          onClick={() => signals.fileClicked({index: index})}>
          {file.name}
        </div>
      );
    })
  }
  render() {
    const signals = this.props.signals.bin;

    return (
      <div className={styles.wrapper}>
        <div className={styles.column}>
          {this.renderFiles()}
          <AddFile
            onAddFileClick={this.props.signals.bin.addFileClicked}
            onFileNameChange={this.props.signals.bin.addFileNameUpdated}
            onFileSubmit={this.props.signals.bin.addFileSubmitted}
            onAddFileAborted={this.props.signals.bin.addFileAborted}
            showInput={this.props.showAddFileInput}
            placeholder="Filename..."
            value={this.props.newFileName}/>
        </div>
        <div className={styles.column}>
          <div className={styles.buttonWrapper}>
            <ToolbarButton
              title='Run code'
              icon={icons.play}
              disabled={this.props.isLoading || !this.props.isValid}
              onClick={() => signals.testClicked()}/>
          </div>
          <ToolbarButtonPopover
            title="Configure packages"
            className={styles.packagesButton}
            icon={icons.menu}
            onClick={() => this.props.signals.bin.toggleShowPackagesSelector()}
            show={this.props.showPackagesSelector}>
            {this.renderNpmPackages()}
          </ToolbarButtonPopover>
          <ToolbarButtonPopover
            title="Info"
            className={styles.packagesButton}
            icon={icons.help}
            onClick={() => this.props.signals.bin.toggleShowInfo()}
            show={this.props.showInfo}>
            <div className={styles.info}>
              <h3>What is this project?</h3>
              <p>
                WebpackBin is in ALPHA and will allow you to load in any NPM
                package and webpack loaders to play around with. It has super
                optimized handling of packages to give the best experience.
              </p>
              <h3>How it works</h3>
              <p>
                When you configure a package bundle that is already in use
                it will be delivered directly to you an cached in the browser.
                The Webpack instance on the server will only handle your little
                project.
              </p>
              <p>
                A new configured package bundle will be fetched from NPM and
                an optimized version is cached in the database for later use.
              </p>
            </div>
          </ToolbarButtonPopover>
          <div className={styles.logo}/>
        </div>
      </div>
    );
  }
}

export default Toolbar;
