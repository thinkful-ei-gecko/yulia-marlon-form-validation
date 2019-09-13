import React from 'react';
import config from '../config'
import cuid from 'cuid';
import ApiContext from '../ApiContext'

class AddFolder extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
			name: '',
			id: ''
		};
		this.nameInput = React.createRef();
	}

	static contextType = ApiContext;
	
  handleFolderFormSubmit = (event) => {
		event.preventDefault();

		const newFolder = JSON.stringify({
			id: cuid(),
			name: this.nameInput.current.value
		})

		fetch(`${config.API_ENDPOINT}/folders`,
		{
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: newFolder
		})
		.then(res => {
			if (!res.ok)
				return res.json().then(e => Promise.reject(e))
			return res.json()
		})
		.then(response => response.json())
		.then(response => this.context.addFolder(response))
		.catch(error => {
			console.error({ error })
		})
	}

	render() {
		return (
			<form onSubmit={this.handleFolderFormSubmit}>
					<label htmlFor="folder-name"> Folder name</label>
					<input 
					id="folder-name" 
					type="text" 
					name="folder-name"
					ref={this.nameInput}>	
					
					</input>
					<input type="submit" value="Submit" />
			</form>
		)
	}
}
export default AddFolder;