import React from 'react';
import styles from './styles.css';
import elements from 'common/elements.css';
import icons from 'common/icons.css';
import ToolbarButton from '../ToolbarButton';

class AddFile extends React.Component {
  constructor(props) {
    super(props);
    this.onAddFileInputChange = this.onAddFileInputChange.bind(this);
    this.onAddFileInputKeyDown = this.onAddFileInputKeyDown.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.isEntry !== this.props.isEntry) {
      this.refs.fileInput && this.refs.fileInput.focus();
    }
  }
  onAddFileInputChange(event) {
    const fileName = event.target.value;
    this.props.onFileNameChange({fileName: fileName});
  }
  onAddFileInputKeyDown(event) {
    const keyCode = event.keyCode;

    if (keyCode === 27) { // Escape
      this.props.onAddFileAborted();
    }
  }
  onSubmit(event) {
    event.preventDefault();
    this.props.onFileSubmit();
  }
  render() {
    return (
      this.props.showInput ?
        <div className={styles.wrapper}>
          <div className={styles.inputWrapper}>
            <form onSubmit={this.onSubmit}>
              <input
                ref="fileInput"
                value={this.props.value}
                onClick={(e) => e.stopPropagation()}
                onChange={this.onAddFileInputChange}
                onKeyDown={this.onAddFileInputKeyDown}
                className={styles.input}
                autoFocus
                placeholder={this.props.placeholder}/>
              <label className={styles.entry} onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={this.props.isEntry}
                  disabled={this.props.disableEntry}
                  onChange={() => this.props.onEntryChange()}/>
                  <span>Is entry</span>
              </label>
            </form>
          </div>
        </div>
      :
        <div className={styles.addFileWrapper}>
          <ToolbarButton title="New File" icon={icons.addFile} onClick={() => this.props.onAddFileClick()}/>
        </div>
    );
  }
}
export default AddFile;
