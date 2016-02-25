import React, { PropTypes } from 'react';
import { Decorator as Cerebral, Link } from 'cerebral-view-react';
import styles from './styles.css';
import icons from 'common/icons.css';
import classNames from 'classnames';
import AddFile from '../AddFile';
import ToolbarButton from '../ToolbarButton';
import ToolbarButtonPopover from '../ToolbarButtonPopover';
import Npm from '../Npm';

@Cerebral({
  files: 'bin.currentBin.files',
  selectedFileIndex: 'bin.selectedFileIndex',
  isRunning: 'bin.isRunning',
  isValid: 'bin.isValid',
  showAddFileInput: 'bin.showAddFileInput',
  newFileName: 'bin.newFileName',
  showPackagesSelector: 'bin.showPackagesSelector',
  showInfo: 'bin.showInfo'
})
class Toolbar extends React.Component {
  static propTypes = {
    files: PropTypes.array
  };
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
              disabled={this.props.isRunning || !this.props.isValid}
              onClick={() => signals.testClicked()}/>
          </div>
          <ToolbarButtonPopover
            title="Configure packages"
            className={styles.packagesButton}
            icon={icons.menu}
            onClick={() => this.props.signals.bin.toggleShowPackagesSelector()}
            show={this.props.showPackagesSelector}
            right>
            <Npm/>
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
                package and webpack loaders to play around with.
              </p>
              <h3>Nice to know</h3>
              <p>
                Your WebpackBin will be saved, though your session is short lived in the alpha, about 5 minutes.
                A copy of your Bin will automatically be created if you save a new one though.
              </p>
              <p>
                Configuring new package bundles requires them to be downloaded from NPM, but using existing
                bundles are superfast to load.
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
