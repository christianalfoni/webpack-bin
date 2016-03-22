import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';

@Cerebral({
  files: 'bin.currentBin.files',
  fileToDeleteIndex: 'bin.fileToDeleteIndex'
})
class DeleteFileModal extends React.Component {
  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.backdrop}></div>
        <div className={styles.modal}>
          Are you sure you want to delete the file
          <strong> {this.props.files[this.props.fileToDeleteIndex].name}</strong> ?
          <div className={styles.buttons}>
            <div
              className={styles.delete}
              onClick={() => this.props.signals.bin.fileDeleted()}>Yes, do it!</div>
            <div
              className={styles.undo}
              onClick={() => this.props.signals.bin.fileDeleteAborted()}>Ops, no no!</div>
          </div>
        </div>
      </div>
    );
  }
}

 export default DeleteFileModal;
