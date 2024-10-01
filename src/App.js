import { useRef } from 'react';
import axios from 'axios';

function App() {
  const filePickerRef = useRef();

  const testUpload = async () => {
    const file = filePickerRef?.current?.files?.[0];
    const fileName = file?.name?.split('.')[0];
    const ext = file?.name?.split('.')[1];
    const mime = file?.type;

    const payload = {
      n: 1,
      path: process.env.REACT_APP_BUCKET_PATH,
      extensions: [ext],
      fileNames: [fileName],
    };

    const URL = process.env.REACT_APP_UPLOAD_URL;

    axios.post(URL, payload)
      .then((response) => {
        const url = response.data.data[0].url;

        axios.put(url, file, {
          headers: {
            'Content-Type': mime,
          },
          onUploadProgress: (event) => {
            const { loaded, total } = event;
            let precentage = Math.floor((loaded * 100) / total);
            console.log(precentage);
          },
        }).then(data => console.log(data))
          .catch(err => console.log(err));
      })
      .catch((error) => {
        console.log(error);
      });

  };

  return (
    <div style={{ padding: 10 }}>
      <input type="file" placeholder='Pick file' ref={filePickerRef} onChange={() => testUpload()} />
    </div>
  );
}

export default App;
