const fs = require('fs');
console.log('Starting Notes.js');

const fetchNotes = () => {
	try {
		noteString = fs.readFileSync('notes-data.json');
		return JSON.parse(noteString);
	} catch (e) {
		return [];
	}
}

const getAll = () => {
	return fetchNotes();
}
const saveNotes = (notes) => {
	fs.writeFileSync('notes-data.json', JSON.stringify(notes));
}

const addNote = (title, body) => {
	var notes = fetchNotes();
	var note = {title, body};

	const duplicateNotes = notes.filter(note => note.title === title);

	// No need to add duplicate note.
	if(duplicateNotes.length === 0) {
		notes.push(note);
		saveNotes(notes);
		return note;
	}
}

const removeNote = (title) => {
	var notes = fetchNotes();
	const filteredNotes = notes.filter(note => note.title !== title);
	saveNotes(filteredNotes);

	return (filteredNotes.length !== notes.length);
}

const logNote = (note) => {
	console.log(`-----`);
	console.log(`Title: ${note.title}`);
	console.log(`Body: ${note.body}`);
}
module.exports = {
	addNote,
	removeNote,
	getAll,
	logNote
}