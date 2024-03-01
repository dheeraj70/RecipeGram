import React,{useEffect, useRef, useState} from 'react';
import { useNavigate} from 'react-router-dom';
import '../App_media.css';
import './Post.css';


export default function Post() {
  //const [imgs,setImgs] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const titleRef = useRef(null);
  

    useEffect(() => {
        inputRef.current.focus();
        
    }, [inputRef]);

    const SubmitPost =async ()=>{
      

//Submit all the images in container
      const images = inputRef.current.querySelectorAll('img');
      
      const imageUrls = [];

      for (const image of images) {
        //getting image src in blob
        const imageUrl = image.src;
    //retreiving file name from data-filename attribute of image
        const filename = image.dataset.filename;

    //fetching image locally
    const response = await fetch(imageUrl);
    //getting the response as blob
    const blob = await response.blob();

    //creating a new file from the blob
    const file = new File([blob], filename, { type: blob.type });
    //console.log(filename);
    
    //creating a FormData object to post to server
    const formData = new FormData();
    // form name set to 'image' since server accepts upload.single('image');
    formData.append('image', file, filename);
    const res = await fetch('http://localhost:8080/upload-image', {
      method: 'POST',
      credentials: 'include',
      body: formData,
      
    });
    const Url = await res.text();
    //changing the src of each img to the new url which is fetched from server
    image.src = Url;
    imageUrls.push(Url);
  }
  console.log(imageUrls);

      var content = inputRef.current.innerHTML;
      var title = titleRef.current.value;
      var thumbImg = imageUrls[0];
 

      const contentPostResponse = await fetch('http://localhost:8080/upload-post',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({'title':title, 'thumb':thumbImg,'content' :content})
      }).then((res)=>{
        alert("You have successfully Posted");
        navigate('/home')

    }).
      catch((err)=>{
        alert(err)
      })
      
      
    }
  
//yt embed convert
    function getId(url) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
  
      return '//www.youtube.com/embed/'+((match && match[2].length === 11)
        ? match[2]
        : null);
  }

 const videoSubmit=()=>{
  var link = document.getElementById('vidLink').value;

  var newVid = document.createElement('iframe');
      newVid.setAttribute("src", getId(link));
      newVid.setAttribute('allowFullScreen', '')
      newVid.classList.add('img-adjustment');

      

      var imgContainer = document.createElement('div');
      imgContainer.classList.add('vid-container');

      imgContainer.appendChild(newVid);

      var container = document.getElementById('container');
      container.appendChild(imgContainer);


/////MOve CAret to new div!!!
      const newNoden = document.createElement("div");
    newNoden.setAttribute(
        "style",
        "display: inline;"
    );
    newNoden.innerHTML = '&#8203;';
    container.appendChild(newNoden);

    const newRange = document.createRange();
    newRange.setStart(newNoden, 0);
    newRange.collapse(true);

    window.getSelection().removeAllRanges();
    window.getSelection().addRange(newRange);
  

 }

    const UpImg = (e)=>{
      const imga = e.target.files[0];
      

      if(imga){var newImg = document.createElement('img');
      newImg.setAttribute("src", URL.createObjectURL(imga));
      newImg.setAttribute("data-filename", imga.name);
      newImg.classList.add('img-adjustment');

      

      var imgContainer = document.createElement('div');
      imgContainer.classList.add('img-container');

      imgContainer.appendChild(newImg);

      var container = document.getElementById('container');
      container.appendChild(imgContainer);


/////MOve CAret to new div!!!
      const newNoden = document.createElement("div");
    newNoden.setAttribute(
        "style",
        "display: inline;"
    );
    newNoden.innerHTML = '&#8203;';
    container.appendChild(newNoden);

    const newRange = document.createRange();
    newRange.setStart(newNoden, 0);
    newRange.collapse(true);

    window.getSelection().removeAllRanges();
    window.getSelection().addRange(newRange);
 
}
   
    }

  const createHeading = (heading)=>{
    
    var newH1 = document.createElement(heading);
 
    newH1.textContent = 'New Heading '+ heading.slice(1);
    
    var container = document.getElementById('container');
    
    container.appendChild(newH1);


    //to select the new heading tag after creation
    const newRange = document.createRange();
    
    newRange.selectNodeContents(newH1);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(newRange);
    container.focus();

    

  }


  const createBullets =()=>{
    var newul = document.createElement('ul');
   
    //newul.textContent = '<l1></li>';
    var li = document.createElement('li');
    li.textContent = 'Item ';
    newul.appendChild(li);
    var container = document.getElementById('container');
    
    container.appendChild(newul);

    //to select the new u-list tag after creation
    const newRange = document.createRange();
    newRange.selectNode(li);

    window.getSelection().removeAllRanges();
    window.getSelection().addRange(newRange);
    

  }

  const createHighlight=()=>{
    var container = document.getElementById('container');
    const userSelection = window.getSelection();
    const range = userSelection.getRangeAt(0);

    
    const newNode = document.createElement("div");

    
    newNode.setAttribute(
        "style",
        "background-color: yellow; display: inline;"
    );

    
    range.surroundContents(newNode);

   
    userSelection.removeAllRanges();
/////MOve CAret to new div!!!
const newNoden = document.createElement("div");
    newNoden.setAttribute(
        "style",
        "display: inline;"
    );
    newNoden.innerHTML = '&#8203;';
    container.appendChild(newNoden);

    const newRange = document.createRange();
    newRange.setStart(newNoden, 1);
    newRange.collapse(true);

    window.getSelection().removeAllRanges();
    window.getSelection().addRange(newRange);
      
  }

  return (
    <>
    <div className="post">
    <input ref={titleRef} className='title' type="text" name="title" id="title" placeholder='Title of the Recipe'/>
    <div className="opts">
      
      <div className="dropdown">
  <button className="btn btn-light dropdown-toggle btp btph" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Heading
  </button>
  <ul className="dropdown-menu">
    <li><a className="dropdown-item cur-point drop-h1" onClick={()=>{createHeading('h1')}}>Heading 1</a></li>
    <li><a className="dropdown-item cur-point drop-h2" onClick={()=>{createHeading('h2')}}>Heading 2</a></li>
    <li><a className="dropdown-item cur-point drop-h3" onClick={()=>{createHeading('h3')}}>Heading 3</a></li>
    
  </ul>
</div>
      <button className='btn btn-light btp' onClick={()=>{
        createHighlight();
      }} >Highlight</button>
      <button className='btn btn-light btp' onClick={()=>{
        createBullets();
      }}>Bullets</button> 
      <div className="dropdown">
  <button className="btn btn-light dropdown-toggle " type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Embed Image
  </button>
  <ul className="dropdown-menu">
    <div className="embedDrop">
      <h4>Select image</h4>
      <input type="file" name="image" id="img" onChange={UpImg}/>
    </div>
  </ul>
</div>
<div className="dropdown btpe">
  <button className="btn btn-light dropdown-toggle " type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Embed Video
  </button>
  <ul className="dropdown-menu">
    <div className="embedDrop">
      <h4>Enter YouTube link</h4>
      <input type="text" name="ytLink" id="vidLink" />
      <button className='btn btn-secondary' onClick={videoSubmit}>Submit</button>
    </div>
  </ul>
</div>
    </div>
    <div id="container" className="post-input" contentEditable={true} suppressContentEditableWarning={true}
                spellCheck={false}
                ref={inputRef} data-placeholder={"Start typing your recipe here....."}
                >
                  
    
    </div>
 
    </div>
    
    
<div className="sub"><button className='btn btn-secondary' onClick={SubmitPost}>Submit Post</button></div>
    </>
  )
}
