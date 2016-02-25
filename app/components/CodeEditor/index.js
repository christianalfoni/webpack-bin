import eslint from './eslint';
window.eslint = eslint;
import '!style!css!./lint.css';
import '!style!css!./../../../node_modules/codemirror/lib/codemirror.css';
import '!style!css!./CodeEditorStyle.css';
import 'codemirror/mode/jsx/jsx.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/addon/lint/lint.js';
import codemirrorEsLint from './codemirror-eslint.js';
import React, { PropTypes } from 'react';
import { Decorator as Cerebral, Link } from 'cerebral-view-react';
import CodeMirror from 'codemirror';
import styles from './styles.css';

@Cerebral({
  selectedFileIndex: 'bin.selectedFileIndex',
  files: 'bin.currentBin.files',
  isLoadingBin: 'bin.isLoadingBin',
  isRunning: 'bin.isRunning',
})
class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.onCodeChange = this.onCodeChange.bind(this);
    this.onUpdateLinting = this.onUpdateLinting.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (this.props.selectedFileIndex !== prevProps.selectedFileIndex) {
      this.codemirror.getDoc().setValue(this.props.files[this.props.selectedFileIndex].content);
      this.codemirror.setOption('mode', this.getMode());
      this.codemirror.setOption('lint', this.getLinter());
    }
    if (this.props.isLoadingBin || this.props.isRunning) {
      this.codemirror.setOption('readOnly', 'nocursor');
    } else {
      this.codemirror.setOption('readOnly', false);
    }
    if (prevProps.isLoadingBin && !this.props.isLoadingBin) {
      this.codemirror.setValue(this.props.files[this.props.selectedFileIndex].content);
    }
  }
  componentDidMount() {
    this.codemirror = CodeMirror(this.refs.code, {
      value: this.props.files[this.props.selectedFileIndex].content,
      mode: this.getMode(),
      theme: 'learncode',
      matchTags: {bothTags: true},
      autoCloseTags: true,
      gutters: ['CodeMirror-lint-markers'],
      lint: this.getLinter(),
      lineNumbers: true,
      indentUnit: 2,
      extraKeys: {
        Tab(cm) {
          const spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
          cm.replaceSelection(spaces);
        }
      }
    });
    this.codemirror.on('change', this.onCodeChange);
  }
  getMode() {
    const name = this.props.files[this.props.selectedFileIndex].name;
    const ext = name.split('.')[name.split('.').length - 1];
    switch (ext) {
      case 'js':
        return 'jsx';
      case 'css':
        return 'css';
      default:
        return 'jsx';
    }
  }
  getLinter() {
    if (this.getMode() === 'jsx') {
      return {
        getAnnotations: codemirrorEsLint(CodeMirror),
        onUpdateLinting: this.onUpdateLinting
      };
    } else {
      return false;
    }
  }
  onUpdateLinting(errors) {
    this.props.signals.bin.linted({
      isValid: !Boolean(errors.length)
    });
  }
  onCodeChange() {
    this.props.signals.bin.codeChanged({
      code: this.codemirror.getDoc().getValue()
    });
  }
  render() {
    return (
      <div className={styles.wrapper}>
        <div style={{flex: 1, height: '100%'}} ref="code"></div>
      </div>
    );
  }
}

export default CodeEditor;
