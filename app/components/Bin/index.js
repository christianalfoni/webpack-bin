import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';
import Toolbar from '../Toolbar';
import CodeEditor from '../CodeEditor';
import Preview from '../Preview';

@Cerebral()
class Bin extends React.Component {
  componentDidMount() {
    this.props.signals.bin.mounted();
    window.addEventListener('keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && event.keyCode === 83) {
        event.preventDefault();
        this.props.signals.bin.saveShortcutPressed();
      }
    });
  }
  render() {
    return (
      <div>
        <Toolbar/>
        <div style={{height: 'calc(100vh - 50px)', width: '100%', display: 'flex'}}>
          <CodeEditor/>
          <Preview/>
        </div>
      </div>
    );
  }
}

 export default Bin;
