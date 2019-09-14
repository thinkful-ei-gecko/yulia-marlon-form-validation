import React from 'react';
import config from '../config'
import cuid from 'cuid';
import ApiContext from '../ApiContext';
import ValidationError from '../ValidationError';

class AddNote extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
			name: {
				value: '',
			  touched: false
			},
			folderId: {
				value: '',
				touched: false
			},
			content: {
				value: '',
				touched: false
			}
		}
		
    this.nameInput = React.createRef();
    this.contentInput = React.createRef();
	}

	static contextType = ApiContext;
	
  handleNoteSubmit = (event) => {
		event.preventDefault();

		const newNote = JSON.stringify({
			id: cuid(),
      name: this.state.name.value,
      modified: new Date(),
      folderId: this.state.folderId.value,
      content: this.state.content.value,
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
		.then(
			this.props.history.push('/')
		)
		.catch(error => {
			console.error({ error })
		})
	}

  updateFolderId = (folderId) => {
    this.setState({
      folderId: {
				value: folderId,
				touched: true
			}
    })
	}
	
	updateName = (name) => {
		this.setState({
		  name: {
				value: name,
				touched: true
			}
		})
	}

	updateContent = (content) => {
		this.setState({
			content: {
				value: content,
				touched: true
			}
		})
	}

  validateName() {
		const name = this.state.name.value.trim();
		  if (name.length === 0) {
				return 'Name is required'
			}
	}

	validateFolderSelect() {
		const folderIsEmpty = this.state.folderId.value;
		if (folderIsEmpty === '') {
			return 'Choose a valid folder';
		}
	}

	render() {
    const folderList = this.context.folders.map (folder => {
      return (
        <option key= {folder.id} value={folder.id}>{folder.name}</option>
      )
    })

     
		return (
			<form onSubmit={this.handleNoteSubmit}>
					<label htmlFor="note-name">Note name</label>
					<input 
						id="note-name" 
						type="text" 
						name="note-name"
						onChange={e => this.updateName(e.target.value)}
					>
					</input>
					{this.state.name.touched && (<ValidationError message = {this.validateName()}/>)}
          <label htmlFor="content">Content</label>
					<textarea id="content" 
						name="content" 
						onChange={e => this.updateContent(e.target.value)}
					></textarea>
					<select 
						onChange={e => this.updateFolderId(e.target.value)}
					>
					<option>...</option>
            {folderList}
          </select>
					{this.state.folderId.touched && (<ValidationError message = {this.validateFolderSelect()}/>)}
					<button type="submit"
					disabled = {this.validateFolderSelect()|| 
					this.validateName()}
					>Save</button>
			</form>
		)
	}
}
export default AddNote;