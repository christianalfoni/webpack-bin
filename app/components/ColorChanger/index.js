import '!style!css!./../../../node_modules/codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import React, { PropTypes } from 'react';
import { Decorator as Cerebral, Link } from 'cerebral-view-react';
import Title from './Title';
import CodeMirror from 'codemirror';


@Cerebral({
  title: ['example', 'title'],
  color: ['example', 'color'],
  url: ['url']
})
class Home extends React.Component {

  static propTypes = {
    color: PropTypes.string,
    title: PropTypes.string
  };

  componentDidMount() {
    this.codemirror = CodeMirror(this.refs.code, {
      value: 'var react = require(\'react\');\nvar react = require(\'./test.js\');',
      mode: 'javascript',
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

  componentDidUpdate(prevProps) {
    if (prevProps.url !== this.props.url) {
      this.refs.iframe.src = "http://www.codebox.dev:3000/api/sandbox";
    }
  }

  render() {
    const signals = this.props.signals.example;

    return (
      <div>
        <button onClick={() => signals.testClicked({code: this.codemirror.getDoc().getValue()})}>test</button>
        <div style={{display: 'flex'}}>
          <div style={{flex: 1}} ref="code"></div>
          <iframe style={{flex: 1}} ref="iframe"/>
        </div>
      </div>
    );
  }
}

export default Home;
