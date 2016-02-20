import eslint from './eslint';
window.eslint = eslint;
import '!style!css!./lint.css';
import '!style!css!./../../../node_modules/codemirror/lib/codemirror.css';
import '!style!css!./CodeEditorStyle.css';
import 'codemirror/mode/jsx/jsx.js';
import 'codemirror/addon/lint/lint.js';
import codemirrorEsLint from './codemirror-eslint.js';
import React, { PropTypes } from 'react';
import { Decorator as Cerebral, Link } from 'cerebral-view-react';
import CodeMirror from 'codemirror';
import styles from './styles.css';

@Cerebral({
  selectedFileIndex: 'bin.selectedFileIndex',
  files: 'bin.files'
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
    }
  }
  componentDidMount() {
    this.codemirror = CodeMirror(this.refs.code, {
      value: this.props.files[this.props.selectedFileIndex].content,
      mode: 'jsx',
      theme: 'learncode',
      matchTags: {bothTags: true},
      autoCloseTags: true,
      gutters: ['CodeMirror-lint-markers'],
      lint: true,
      lint: {
        getAnnotations: codemirrorEsLint(CodeMirror),
        onUpdateLinting: this.onUpdateLinting
      },
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
