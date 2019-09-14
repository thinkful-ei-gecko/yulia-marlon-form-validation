import React from 'react';
import config from '../config'
import cuid from 'cuid';
import ApiContext from '../ApiContext'
import ValidationError from '../ValidationError';

class AddFolder extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
			name: {
				value: '',
			  touched: false
			}
		};
	}

	static contextType = ApiContext;
	
  handleFolderFormSubmit = (event) => {
		event.preventDefault();

		const newFolder = JSON.stringify({
			id: cuid(),
			name: this.state.name.value
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
		.then(response => this.context.addFolder(response))
		.then(
			this.props.history.push('/')
		)
		.catch(error => {
			console.error({ error })
		})
	}
	
	updateFolderName = (name) => {
		this.setState({
			name: {
				value: name,
				touched: true
			}
		})
	}

  validateFolderName() {
		const name = this.state.name.value.trim();
		  if (name.length === 0) {
				return 'Name is required'
			}
	}

	render() {
		return (
			<form onSubmit={this.handleFolderFormSubmit}>
					<label htmlFor="folder-name">Folder name</label>
					<input 
					id="folder-name" 
					type="text" 
					name="folder-name"
					onChange = {e => this.updateFolderName(e.target.value)}
				  ></input>
					{this.state.name.touched && (<ValidationError message = {this.validateFolderName()}/>)}
					<button type="submit" disabled={this.validateFolderName()}>Save</button>
			</form>
		)
	}
}
export default AddFolder;