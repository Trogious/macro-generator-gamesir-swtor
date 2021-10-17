// import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';

function App() {
  const API_ENDPOINT = "https://y0avaeyoy0.execute-api.eu-west-2.amazonaws.com/default/swtorrotation";
  const [selectedFile, setSelectedFile] = useState();
  const [fileContents, setFileContents] = useState();
  const [rowCount, setRowCount] = useState(1);
	const [isSelected, setIsSelected] = useState(false);
  const [rotations, setRotations] = useState([]);

	const changeHandler = (event) => {
    const file = event.target.files[0];
    if (file !== undefined) {
  		setSelectedFile(file);
  		setIsSelected(true);
      showFile(file);
    }
	};

	const handleSubmission = () => {
    const macroInput = document.getElementsByTagName('textarea')[0].value;
    try {
      JSON.parse(macroInput);
    } catch(e) {
      alert('Invalid JSON file:\n\n' + e);
      return;
    }

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({'macro_input': macroInput})
    };
    // console.log(requestOptions.body);
    fetch(API_ENDPOINT, requestOptions)
        .then(response => response.text())
        .then((data) => {
          console.log(data);
          const rotas = JSON.parse(data).rotations;
          setRotations(rotas);
        })
        .catch((error) => {
          console.warn(error);
        });
	};

  const showFile = async (file) => {
    const reader = new FileReader()
    reader.onload = async (progressEvent) => {
      const text = progressEvent.target.result;
      const rows = (text.match(/\n/g) || []).length;
      setRowCount(rows > 50 ? 50 : rows);
      setFileContents(text);
      document.getElementsByTagName('textarea')[0].value = text;
    };
    reader.readAsText(file)
  }

  const reload = () => {
    if (fileContents !== undefined) {
      document.getElementsByTagName('textarea')[0].value = fileContents;
    }
  }

	return(
   <div className="App">
      <div>
        <input className="file-input" type="file" name="file" onInput={changeHandler} />
      </div>
			{isSelected ? (
				<div>
					<p>Filename: {selectedFile.name}</p>
					<p>Filetype: {selectedFile.type}</p>
					<p>Size in bytes: {selectedFile.size}</p>
					<p>
						lastModifiedDate:{' '}
						{selectedFile.lastModifiedDate.toLocaleDateString()}
					</p>
				</div>
			) : (
				<p>Select a file to populate macro input abilities</p>
			)}
      <div>
       <textarea className="contents"  rows={rowCount} readOnly={false}/>
      </div>
			<div>
				<button onClick={reload}>Reload</button> <button onClick={handleSubmission}>Submit</button>
			</div>
      <div className="rotas">
      {rotations.map((r, i) => (<div className="rota-url" key={i}><a href={r}>{r.substring(r.indexOf('out/')+4)}</a></div>))}
      <div className="copyright">&copy; Trog</div>
      </div>
		</div>
	)
}

export default App;
