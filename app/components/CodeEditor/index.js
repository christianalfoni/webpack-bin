import '!style!css!./../../../node_modules/codemirror/lib/codemirror.css';
import '!style!css!./CodeEditorStyle.css';
import 'codemirror/mode/javascript/javascript.js';
import React, { PropTypes } from 'react';
import { Decorator as Cerebral, Link } from 'cerebral-view-react';
import CodeMirror from 'codemirror';
import styles from './styles.css';


@Cerebral()
class CodeEditor extends React.Component {
  componentDidMount() {
    this.codemirror = CodeMirror(this.refs.code, {
      value: 'var react = require(\'react\');\nvar react = require(\'./test.js\');',
      mode: 'javascript',
      theme: 'learncode',
      matchTags: {bothTags: true},
      autoCloseTags: true,
      gutters: ['CodeMirror-lint-markers'],
      lineNumbers: true,
      indentUnit: 2,
      extraKeys: {
        Tab(cm) {
          const spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
          cm.replaceSelection(spaces);
        }
      }
    })
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
