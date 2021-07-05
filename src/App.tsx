import React, { useRef } from 'react';
import './App.css';
import { Editor } from './components/Editor';
import { EditorContext } from './state/editor/EditorContext';

function App() {
  const editorContext = useRef(new EditorContext());
  return (
    <div className="App">
      <header className="App-header">
        <Editor editorContext={editorContext.current} />
      </header>
    </div>
  );
}

export default App;
