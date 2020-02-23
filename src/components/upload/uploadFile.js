import React, { Component } from 'react';
import axios from 'axios';
import {Progress} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as RestEndpoints from "./constants";
import MaterialTable from 'material-table';
import Button from 'material-ui/Button';
export class UploadFile extends Component {
  constructor(props) {
    super(props);
      this.state = {
        selectedFile: null,
        loaded:0,
        responseData: null,
        statementColumn: RestEndpoints.column
      };
      this.onClickHandler = this.onClickHandler.bind(this);
      this.onChangeHandler = this.onChangeHandler.bind(this);
      this.checkMimeType = this.checkMimeType.bind(this);
      this.checkFileSize = this.checkFileSize.bind(this);
  }
  checkMimeType=(event)=>{
    //getting file object
    let files = event.target.files 
    //define message container
    let err = []
    // list allow mime type
  // const types = ['image/png', 'image/jpeg', 'image/gif']
  const types = ['text/csv','application/vnd.ms-excel'];
    // loop access array
    for(let x = 0; x<files.length; x++) {
     // compare file type find doesn't matach
         if (types.every(type => files[x].type !== type)) {
         // create error message and assign to container   
         err[x] = files[x].type+' is not a supported format\n';
       }
     };
     for(var z = 0; z<err.length; z++) {// if message not same old that mean has error 
         // discard selected file
        toast.error(err[z])
        event.target.value = null
    }
   return true;
  }
  maxSelectFile=(event)=>{
    let files = event.target.files
        if (files.length > 3) { 
           const msg = 'Only 3 images can be uploaded at a time'
           event.target.value = null
           toast.warn(msg)
           return false;
      }
    return true;
 }
 checkFileSize=(event)=>{
  let files = event.target.files
  let size = 2000000 
  let err = []; 
  for(var x = 0; x<files.length; x++) {
  if (files[x].size > size) {
   err[x] = files[x].type+'is too large, please pick a smaller file\n';
 }
};
for(var z = 0; z<err.length; z++) {// if message not same old that mean has error 
  // discard selected file
 toast.error(err[z])
 event.target.value = null
}
return true;
}
onChangeHandler=event=>{
  var files = event.target.files
 // if(this.maxSelectFile(event) && this.checkMimeType(event) &&    this.checkFileSize(event)){ 
  // if return true allow to setState
     this.setState({
     selectedFile: files,
     loaded:0
  })
//}
}
  onClickHandler = () => {
    const data = new FormData() 
    for(var x = 0; x<this.state.selectedFile.length; x++) {
      console.log("files count"+x);
      data.append('files', this.state.selectedFile[x])
    }
    console.log('RestEndpoints-->'+RestEndpoints.uriStore.UPLOAD_AND_FETCH_UPLOADED_DATA);
    axios.post(RestEndpoints.uriStore.UPLOAD_AND_FETCH_UPLOADED_DATA, data, {
      onUploadProgress: ProgressEvent => {
        this.setState({
          loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
        })
      },
    })
      .then(reponse => { // then print response status
       // alert(reponse.data);
        this.setState({
          responseData:reponse.data
        })
        toast.success('upload success')
      })
      .catch(err => { // then print response status
        console.log('error while uploading and fetching the uploaded data===>' + err);
        toast.error('Failed to upload due to an error: ' + err);
      })
    }

  render() {
    return (
      <div class="container">
	      <div class="row">
      	  <div class="offset-md-3 col-md-6">
               <div class="form-group files">
                <label>Upload Your File </label>
                <input type="file" name="files" class="form-control" multiple onChange={this.onChangeHandler}/>
              </div>  
              <div class="form-group">
              <ToastContainer />
              <Progress max="100" color="success" value={this.state.loaded} >{Math.round(this.state.loaded,2) }%</Progress>
        
              </div> 
              
              <button type="button" class="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button>

              <div>
              <MaterialTable
      title="Issues in rabobank statement"
      columns={this.state.statementColumn}
      data={this.state.responseData}
      editable={{
        onRowAdd: newData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              this.setState(prevState => {
                const data = [...prevState.data];
                data.push(newData);
                return { ...prevState, data };
              });
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              if (oldData) {
                this.setState(prevState => {
                  const data = [...prevState.data];
                  data[data.indexOf(oldData)] = newData;
                  return { ...prevState, data };
                });
              }
            }, 600);
          }),
        onRowDelete: oldData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              this.setState(prevState => {
                const data = [...prevState.data];
                data.splice(data.indexOf(oldData), 1);
                return { ...prevState, data };
              });
            }, 600);
          }),
      }}
    />
  );
                </div>

	      </div>
      </div>
      </div>
    );
  }
}