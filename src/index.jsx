import "babel-polyfill"
import './style.scss'
import 'braft-editor/dist/braft.css'
import React from 'react'
import ReactDOM from 'react-dom'
import BraftEditor from 'braft-editor'

let cachedPhotos = null

class UnsplashModal extends React.Component {

  state = {
    photos: []
  }

  loadPhotos = (callback) => {

    const xhr = new XMLHttpRequest

    xhr.onreadystatechange = () => {

      if (xhr.readyState === 4) {

        if (xhr.status === 200) {

          try {
            let data = JSON.parse(xhr.responseText)
            callback(data)
          } catch (error) {
            console.log(error)
          }

        }

      }

    }

    xhr.open('GET', 'https://api.unsplash.com/photos/curated?page=1&per_page=28', true)
    xhr.setRequestHeader("Authorization", `Client-ID 09023580e4221e343dabaf2c2bf4acf253c6b845a69cec0dc3bd87c60686ad6e`)
    xhr.send(null)

  }

  componentDidMount () {

    if (!cachedPhotos) {
      this.loadPhotos((photos) => {
        this.setState({ photos })
        cachedPhotos = photos
      })
    } else {
      this.setState({ photos: cachedPhotos })
    }

  }

  selectPhoto (id) {

    if (this.state.photos.filter(item => item.isSelected).length >= 5) {
      return false
    }

    this.setState({
      photos: this.state.photos.map(photo => {
        return photo.id == id ? {
          ...photo,
          isSelected: true
        } : photo
      })
    }, () => {
      this.props.onChange(this.state.photos.filter(item => item.isSelected))
    })

  }

  deselectPhoto (id) {

    this.setState({
      photos: this.state.photos.map(photo => {
        return photo.id == id ? {
          ...photo,
          isSelected: false
        } : photo
      })
    }, () => {
      this.props.onChange(this.state.photos.filter(item => item.isSelected))
    })

  }

  render () {

    return (
      <div className="unsplash-photos">
        <ul>
        {this.state.photos.map((photo, index) => {
          return (
            <li onClick={() => photo.isSelected ? this.deselectPhoto(photo.id) : this.selectPhoto(photo.id)} className={photo.isSelected ? 'active' : ''} key={index}>
              <img src={photo.urls['small']}/>
              <a href={photo.user.links['html']} target="_blank">
                <span>{photo.user.name}</span>
                <small>@{photo.user.username}</small>
              </a>
            </li>
          )
        })}
        </ul>
      </div>
    )

  }

}

class Demo extends React.Component {

  state = {
    htmlContent: '',
    photos: []
  }

  preview = () => {

    if (window.previewWindow) {
      window.previewWindow.close()
    }

    window.previewWindow = window.open()
    window.previewWindow.document.write(this.buildPreviewHtml())

  }

  buildPreviewHtml () {

    const htmlContent = this.editorInstance.getHTMLContent()

    return `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
            <div class="container">${htmlContent}</div>
        </body>
      </html>
    `

  }

  handleUnsplashPhotosSelected = (photos) => {
    this.setState({ photos })
  }

  triggerDownload = (id) => {
    const xhr = new XMLHttpRequest
    xhr.open('GET', `https://api.unsplash.com/photos/${id}/download`)
    xhr.setRequestHeader("Authorization", `Client-ID 09023580e4221e343dabaf2c2bf4acf253c6b845a69cec0dc3bd87c60686ad6e`)
    xhr.send(null)
  }

  insertSelectPhotos = () => {

    this.editorInstance.insertMedias(this.state.photos.map(photo => ({
      type: 'IMAGE',
      url: photo.urls['regular']
    })))

    this.state.photos.forEach(photo => {
      this.triggerDownload(photo.id)
    })

  }

  render() {

    const editorProps = {
      language: 'en',
      viewWrapper: '.demo',
      excludeControls: ['indent', 'line-height', 'letter-spacing'],
      extendControls: [
        {
          type: 'split'
        }, {
          type: 'modal',
          className: 'preview-button',
          text: <span>Unsplash Photos</span>,
          modal: {
            id: 'unsplash-modal', // v1.4.0新增，必选
            title: 'Insert curated photos provided by Unsplash',
            showClose: true,
            showCancel: true,
            showConfirm: true,
            confirmText: 'Insert',
            confirmable: this.state.photos.length,
            onConfirm: this.insertSelectPhotos,
            children: <UnsplashModal onChange={this.handleUnsplashPhotosSelected} />
          }
        }, {
          type: 'split'
        }, {
          type: 'button',
          className: 'preview-button',
          text: <span>Preview</span>,
          onClick: this.preview
        }
      ],
      ref: instance => this.editorInstance = instance
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