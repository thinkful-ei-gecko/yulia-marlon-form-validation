import React from 'react';
import config from '../config'

class AddFolder extends React.Component {
	constructor(props) {
    super(props);
    this.state = {value: ''};
	}
	handleChange = (event) => {
		this.setState({value: event.target.value});
  }
  handleFolderFormSubmit = (event) => {
		console.log(this.state.value);
		event.preventDefault();
		const newFolderName = JSON.stringify(this.state.value)
		fetch(`${config.API_ENDPOINT}/folders`,
		{
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: newFolderName
		})
		
	}
	render() {
		return (
			<form onSubmit={this.handleFolderFormSubmit}>
					<label htmlFor="folder-name"> Folder name</label>
					<input id="folder-name" type="text" 
					name="folder-name"
					value={this.state.value} 
					onChange={this.handleChange}
					></input>
					<input type="submit" value="Submit" />
			</form>
		)
	}
}
export default AddFolder;