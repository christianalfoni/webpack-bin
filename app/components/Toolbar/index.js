import React, { PropTypes } from 'react';
import { Decorator as Cerebral, Link } from 'cerebral-view-react';
import styles from './styles.css';
import icons from 'common/icons.css';
import classNames from 'classnames';
import AddFile from '../AddFile';
import ToolbarButton from '../ToolbarButton';
import ToolbarLink from '../ToolbarLink';
import ToolbarButtonPopover from '../ToolbarButtonPopover';
import Npm from '../Npm';
import Boilerplates from '../Boilerplates';

import hasEntry from '../../computed/hasEntry';

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
  vimModeEnabled: 'bin.vimMode',
  currentBin: 'bin.currentBin',
  highlightCreateIssue: 'bin.highlightCreateIssue',
  isEntry: 'bin.isEntry',
  hasEntry: hasEntry
})
class Toolbar extends React.Component {
  static propTypes = {
    files: PropTypes.array
  };
  getTwitterUrl() {
    return 'http://twitter.com/share?text=Take a look at this awesome new code bin service!&url=http://www.webpackbin.com/&hashtags=webpackbin,webpack,javascript';
  }
  renderFiles() {
    return (
      <div className={styles.files}>
        {this.props.files.map((file, index) => {
          const active = index === this.props.selectedFileIndex;
          const signals = this.props.signals;

          return (
            <div
              key={index}
              className={classNames(styles.file, {[styles.active]: active})}
              onClick={() => signals.bin.fileClicked({index})}>
              {file.name}
              <i
                className={styles.deleteFile}
                onClick={(e) => {e.stopPropagation();signals.bin.fileDeleted({index})}}>&times;</i>
            </div>
          );
        })}
      </div>
    );
  }
  render() {
    const signals = this.props.signals;

    return (
      <div className={styles.wrapper}>
        <div className={styles.row}>
          <div className={styles.columnWrapper}>
            <div className={styles.column1}>
              <div className={styles.logo}/>
              <div className={styles.version}><div className={styles.versionText}>beta</div></div>
              {/*
              <div className={styles.buttonWrapper}>
                Vim Mode
                <input
                  type="checkbox"
                  checked={this.props.vimModeEnabled}
                  onClick={() => signals.bin.vimModeClicked()}/>
              </div>
              */}
              <div className={styles.buttonWrapper}>
                <ToolbarButton
                  title='Run'
                  icon={icons.play}
                  disabled={this.props.isRunning}
                  onClick={() => signals.bin.runClicked()}/>
              </div>
              <div className={styles.buttonWrapper}>
                <ToolbarButton
                  title='Log'
                  active={this.props.showLog}
                  icon={icons.assignment}
                  notify={this.props.shouldCheckLog}
                  disabled={this.props.isRunning}
                  onClick={() => signals.bin.logToggled()}/>
              </div>
              <div className={styles.buttonWrapper}>
                <ToolbarButton
                  title='Live'
                  active={this.props.currentBin.isLive}
                  icon={icons.live}
                  disabled={
                    (!this.props.currentBin.isOwner && this.props.currentBin.author) ||
                    this.props.isRunning
                  }
                  onClick={() => signals.live.liveToggled()}/>
              </div>
              <div className={styles.buttonWrapper}>
                <ToolbarLink
                  disabled={!this.props.currentBin.id}
                  title='Download'
                  icon={icons.zip}
                  href="/api/project.zip"/>
              </div>
            </div>
            <div className={styles.column2}>
              <ToolbarButtonPopover
                title="Configure"
                className={styles.packagesButton}
                icon={icons.npm}
                onClick={() => signals.bin.packagesToggled()}
                show={this.props.showPackagesSelector}
                middle>
                <Npm/>
              </ToolbarButtonPopover>
              <ToolbarButtonPopover
                title="Boilerplates"
                className={styles.packagesButton}
                icon={icons.boilerplates}
                onClick={() => signals.bin.boilerplatesToggled()}
                show={this.props.showBoilerplatesSelector}
                right>
                <Boilerplates/>
              </ToolbarButtonPopover>
              <ToolbarButtonPopover
                title="Info"
                className={styles.packagesButton}
                icon={icons.help}
                onClick={() => signals.bin.infoToggled()}
                show={this.props.showInfo}
                right>
                <div className={styles.info}>
                  <div className={styles.link} onClick={() => {const win = window.open('http://www.youtube.com/watch?v=LGaJwjVPh9I');win.focus();}}>
                    <i className={icons.movie}/> Watch an introduction
                  </div>
                  <div className={this.props.highlightCreateIssue ? styles.highlightLink : styles.link} onClick={() => {const win = window.open('https://github.com/christianalfoni/webpack-bin/issues');win.focus();}}>
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
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <AddFile
            onAddFileClick={signals.bin.addFileClicked}
            onEntryChange={signals.bin.entryToggled}
            onFileNameChange={signals.bin.addFileNameUpdated}
            onFileSubmit={signals.bin.addFileSubmitted}
            onAddFileAborted={signals.bin.addFileAborted}
            showInput={this.props.showAddFileInput}
            placeholder="Filename..."
            isEntry={this.props.isEntry}
            disableEntry={this.props.hasEntry}
            value={this.props.newFileName}/>
          {this.renderFiles()}
        </div>
      </div>
    );
  }
}

export default Toolbar;
