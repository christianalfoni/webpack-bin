import React, { PropTypes } from 'react';
import { Decorator as Cerebral, Link } from 'cerebral-view-react';
import styles from './styles.css';
import icons from 'common/icons.css';
import classNames from 'classnames';
import AddFile from '../AddFile';
import ToolbarButton from '../ToolbarButton';
import ToolbarButtonPopover from '../ToolbarButtonPopover';
import Npm from '../Npm';
import Boilerplates from '../Boilerplates';

@Cerebral({
  files: 'bin.currentBin.files',
  selectedFileIndex: 'bin.selectedFileIndex',
  isRunning: 'bin.isRunning',
  isValid: 'bin.isValid',
  showAddFileInput: 'bin.showAddFileInput',
  newFileName: 'bin.newFileName',
  showPackagesSelector: 'bin.showPackagesSelector',
  showInfo: 'bin.showInfo',
  showLog: 'bin.showLog',
  showBoilerplatesSelector: 'bin.showBoilerplatesSelector',
  shouldCheckLog: 'bin.shouldCheckLog',
  showBoilerplatesSelector: 'bin.showBoilerplatesSelector',
  vimModeEnabled: 'bin.vimMode'
})
class Toolbar extends React.Component {
  static propTypes = {
    files: PropTypes.array
  };
  getTwitterUrl() {
    return 'http://twitter.com/share?text=Take a look at this awesome new code bin service!&url=http://www.webpackbin.com/&hashtags=webpackbin,webpack,javascript';
  }
  renderFiles() {
    return this.props.files.map((file, index) => {
      const active = index === this.props.selectedFileIndex;
      const signals = this.props.signals.bin;

      return (
        <div
          key={index}
          className={classNames(styles.file, {[styles.active]: active})}
          onClick={() => signals.fileClicked({index})}>
          {file.name}
          <i
            className={styles.deleteFile}
            onClick={(e) => {e.stopPropagation();signals.fileDeleted({index})}}>x</i>
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
          {/*
          <div className={styles.buttonWrapper}>
            Vim Mode
            <input
              type="checkbox"
              checked={this.props.vimModeEnabled}
              onClick={() => this.props.signals.bin.vimModeClicked()}/>
          </div>
          */}
          <div className={styles.buttonWrapper}>
            <ToolbarButton
              title='Run'
              icon={icons.play}
              disabled={this.props.isRunning || !this.props.isValid}
              onClick={() => signals.runClicked()}/>
          </div>
          <div className={styles.buttonWrapper}>
            <ToolbarButton
              title='Log'
              active={this.props.showLog}
              icon={icons.assignment}
              notify={this.props.shouldCheckLog}
              disabled={this.props.isRunning || !this.props.isValid}
              onClick={() => signals.logToggled()}/>
          </div>
          <ToolbarButtonPopover
            title="Configure"
            className={styles.packagesButton}
            icon={icons.npm}
            onClick={() => this.props.signals.bin.packagesToggled()}
            show={this.props.showPackagesSelector}
            middle>
            <Npm/>
          </ToolbarButtonPopover>
          <ToolbarButtonPopover
            title="Boilerplates"
            className={styles.packagesButton}
            icon={icons.boilerplates}
            onClick={() => this.props.signals.bin.boilerplatesToggled()}
            show={this.props.showBoilerplatesSelector}
            right>
            <Boilerplates/>
          </ToolbarButtonPopover>
          <ToolbarButtonPopover
            title="Info"
            className={styles.packagesButton}
            icon={icons.help}
            onClick={() => this.props.signals.bin.infoToggled()}
            show={this.props.showInfo}
            right>
            <div className={styles.info}>
              <h3>WebpackBin</h3>
              <p>
                WebpackBin is in ALPHA and allows you to load up NPM packages and webpack
                loaders superfast. All bins has its own url and you can share your code
                with anyone.
              </p>
              <div className={styles.link} onClick={() => {const win = window.open('https://github.com/christianalfoni/webpack-bin/issues');win.focus();}}>
                <i className={icons.issue}/> Create an issue
              </div>
              <div className={styles.link} onClick={() => {const win = window.open('https://github.com/christianalfoni/webpack-bin');win.focus();}}>
                <i className={icons.github}/> Contribute to the project
              </div>
              <div className={styles.link} onClick={() => {const win = window.open(this.getTwitterUrl());win.focus();}}>
                <i className={icons.twitter}/> Share on Twitter
              </div>
            </div>
          </ToolbarButtonPopover>
          <div className={styles.logo}/>
        </div>
      </div>
    );
  }
}

export default Toolbar;
