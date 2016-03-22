import React, { PropTypes } from 'react';
import { Decorator as Cerebral, Link } from 'cerebral-view-react';
import styles from './styles.css';
import icons from 'common/icons.css';
import classNames from 'classnames';
import ToolbarButton from '../ToolbarButton';
import ToolbarButtonPopover from '../ToolbarButtonPopover';
import Boilerplates from '../Boilerplates';

import hasEntry from '../../computed/hasEntry';

@Cerebral({
  files: 'bin.currentBin.files',
  selectedFileIndex: 'bin.selectedFileIndex',
  isRunning: 'bin.isRunning',
  showLog: 'bin.showLog',
  showBoilerplatesSelector: 'bin.showBoilerplatesSelector',
  shouldCheckLog: 'bin.shouldCheckLog',
  showBoilerplatesSelector: 'bin.showBoilerplatesSelector',
  currentBin: 'bin.currentBin',
  isEntry: 'bin.isEntry',
  hasEntry: hasEntry,
  changedFiles: 'bin.changedFiles',
  showPreview: 'mobile.showPreview'
})
class Toolbar extends React.Component {
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
              {
                file.isEntry ?
                  <span className={styles.entryIndication}>entry</span>
                :
                  null
              }
              {
                this.props.changedFiles.indexOf(index) >= 0 ?
                  <i className={styles.isChanged}/>
                :
                  null
              }
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
          <div className={styles.logo}/>
          <div className={styles.version}><div className={styles.versionText}>beta</div></div>
            <div className={styles.buttonWrapper}>
              <ToolbarButton
                title='Preview'
                active={this.props.showPreview}
                icon={icons.preview}
                disabled={this.props.isRunning}
                onClick={() => signals.mobile.previewToggled()}/>
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
            <ToolbarButtonPopover
              title="Boilerplates"
              className={styles.packagesButton}
              icon={icons.boilerplates}
              onClick={() => signals.bin.boilerplatesToggled()}
              show={this.props.showBoilerplatesSelector}
              right>
              <Boilerplates/>
            </ToolbarButtonPopover>
        </div>
        <div className={styles.row}>
          {this.renderFiles()}
        </div>
      </div>
    );
  }
}

export default Toolbar;
