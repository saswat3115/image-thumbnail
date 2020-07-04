import React, { useRef, useState } from 'react';
import './App.css';

function App() {

  const fileRef = useRef(null);
  const [imgSrc, setImgSrc] = useState();
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);

  const onUpload = (e) => {
    console.log(e.target);
    console.log(fileRef.current.files);
    fileRef.current.files.length > 0 ?
      setImgSrc(URL.createObjectURL(fileRef.current.files[0]))
      : setImgSrc('')
  }

  const resize = (img, size) => {
    setLoading(true);
    //define the width to resize e.g 600px
    var resize_width = size * 10;//without px
    //get the image selected
    var item = img;
    //create a FileReader
    var reader = new FileReader();
    //image turned to base64-encoded Data URI.
    reader.readAsDataURL(item);
    reader.name = item.name;//get the image's name
    reader.size = item.size; //get the image's size
    reader.onload = function(event) {
      var img = new Image();//create a image
      img.src = event.target.result;//result is base64-encoded Data URI
      img.name = event.target.name;//set name (optional)
      img.size = event.target.size;//set size (optional)
      img.onload = function(el) {
        var elem = document.createElement('canvas');//create a canvas
  
        //scale the image to 600 (width) and keep aspect ratio
        var scaleFactor = resize_width / el.target.width;
        elem.width = resize_width;
        // elem.height = el.target.height * scaleFactor;
        elem.height = resize_width;
  
        //draw in canvas
        var ctx = elem.getContext('2d');
        ctx.drawImage(el.target, 0, 0, elem.width, elem.height);
  
        //get the base64-encoded Data URI from the resize image
        var srcEncoded = ctx.canvas.toDataURL(el.target, 'image/jpeg', 0);
  
        //assign it to thumb src
        document.querySelector('#thumbnail').src = srcEncoded;
  
        /*Now you can send "srcEncoded" to the server and
        convert it to a png o jpg. Also can send
        "el.target.name" that is the file's name.*/
        setLoading(false);
      }
    }
  }

  return (
    <div className="App">
      <div className="title">
        <h1>Upload you image</h1>
      </div>
      <div className="upload-section" onClick={() => fileRef.current.click()}>
        Upload Image
        <input type="file" id="fileUpload" onInput={onUpload} ref={fileRef} />
      </div>
      <div>
        {imgSrc?.name}
      </div>
      {/* {imgSrc && <div className="img-preview">
        <img src={imgSrc} alt="preview" />
      </div>} */}
      <div className="resolution-section">
        <div className={`btn-resolution ${selected === 10 ? 'selected': ''}`} onClick={() => setSelected(10)}>10 x 10</div>
        <div className={`btn-resolution ${selected === 20 ? 'selected': ''}`} onClick={() => setSelected(20)}>20 x 20</div>
        <div className={`btn-resolution ${selected === 50 ? 'selected': ''}`} onClick={() => setSelected(50)}>50 x 50</div>
      </div>
      <div style={{ textAlign: 'center', padding: '8px' }}>
        <button className="btn-generate" onClick={() => resize(fileRef.current.files[0], selected)}>Generate</button>
      </div>
      <div id="output">
        {loading && 'Resizing your image. Please wait...'}
        <img alt="thumbnail" id="thumbnail" />
      </div>
    </div>
  );
}

export default App;
