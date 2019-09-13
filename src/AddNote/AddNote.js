import React from 'react';
import config from '../config'
import cuid from 'cuid';
import ApiContext from '../ApiContext'

class AddNote extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      folderId: ''
    }
    this.nameInput = React.createRef();
    this.contentInput = React.createRef();
	}

	static contextType = ApiContext;
	
  handleNoteSubmit = (event) => {
		event.preventDefault();

		const newNote = JSON.stringify({
			id: cuid(),
      name: this.nameInput.current.value,
      modified: new Date(),
      folderId: this.state.folderId,
      content: this.contentInput.current.value,
    })

		fetch(`${config.API_ENDPOINT}/notes`,
		{
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: newNote
		})
		.then(res => {
			if (!res.ok)
				return res.json().then(e => Promise.reject(e))
			return res.json()
		})
		.then(response => this.context.addNote(response))
		.catch(error => {
			console.error({ error })
		})
	}

  handleOption = (e) => {
    this.setState({
      folderId: e.target.value
    })
  }

	render() {
    console.log(this.state.folderId);
    const folderList = this.context.folders.map (folder => {
      return (
        <option value={folder.id}>{folder.name}</option>
      )
    })

     
		return (
			<form onSubmit={this.handleNoteSubmit}>
					<label htmlFor="note-name">Note name</label>
					<input 
					id="note-name" 
					type="text" 
					name="note-name"
					ref={this.nameInput}>
					</input>
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" ref={this.contentInput}></textarea>
          <select value={this.state.folderId}
          onChange={this.handleOption}> 
          <option>...</option>
            {folderList}
          </select>
					<input type="submit" value="Submit" />
			</form>
		)
	}
}
export default AddNote;