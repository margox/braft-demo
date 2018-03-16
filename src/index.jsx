import "babel-polyfill"
import './style.scss'
import 'braft-editor/dist/braft.css'
import React from 'react'
import ReactDOM from 'react-dom'
import BraftEditor from 'braft-editor'

class Demo extends React.Component {

  state = {
    htmlContent: ''
  }

  render() {

    const editorProps = {
      onChange: console.log,
      onHTMLChange: console.log
    }

    return (
      <div className="demo">
        <BraftEditor {...editorProps} />
      </div>
    )

  }

  handleHTMLChange = (htmlContent) => {
    this.setState({ htmlContent })
  }

}

ReactDOM.render(<Demo />, document.querySelector('#root'))