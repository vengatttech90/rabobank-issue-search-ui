import React, { useState } from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import * as ServiceConstants from "../constants/serviceConstants";
import * as AppConstants from "../constants/appConstants";
import "../css/common.css"

export default function FileUpload() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileData, setFileData] = React.useState({
        columns: [],
        data: []
    });

    const onFileSelect = async (event) => {
        let files = event.target.files;
        setSelectedFiles(files);
    };

    const onFileUpload = async (event) => {
        const formData = new FormData();
        for (var i = 0; i < selectedFiles.length; i++) {
            formData.append('files', selectedFiles[i]);
        }
        axios.post(ServiceConstants.uriStore.UPLOAD_AND_FETCH_UPLOADED_DATA, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then(res => {
                let str = JSON.stringify(res.data.data);
                var json_data = JSON.parse(str.replace(/\\"/g, ''));
                setFileData({
                    ...fileData,
                    columns: AppConstants.columns,
                    data: json_data
                });
            }).catch(error => {
                alert('failed to load files due to an error: ' + error+'. please check the template is valid with required input');
            })
    };

    return (
        <div class="cls-root">
            <div class="cls-file-upld">
                <div class="cls-header">
                    <span class="cls-header-text">RABO BANK ISSUES UPLOAD/EXTRACTION</span>
                </div>
                <p>Please upload a issue file to extract and check the issues</p>
                <div class="cls-inp">
                    <input type="file" class="cls-inp-typ" id="customFile" onChange={onFileSelect} />
                </div>
                <div class="cls-upl">
                    <button class="cls-upl-button" name="submit" value="Upload" onClick={onFileUpload} >upload</button>
                </div>
            </div>
            <div class="cls-search-table" >
                <MaterialTable title="Uploaded Issues"
                    columns={fileData.columns}
                    data={fileData.data}
                    editable={{
                        onRowAdd: newData => new Promise(resolve => {
                            setTimeout(() => {
                                resolve();
                                setFileData(prevFileData => {
                                    const data = [...prevFileData.data];
                                    data.push(newData);
                                    return { ...prevFileData, data };
                                });
                            }, 600);
                        }),
                        onRowUpdate: (newData, oldData) => new Promise(resolve => {
                            setTimeout(() => {
                                resolve();
                                if (oldData) {
                                    setFileData(prevFileData => {
                                        const data = [...prevFileData.data];
                                        data[data.indexOf(oldData)] = newData;
                                        return { ...prevFileData, data };
                                    })
                                }
                            }, 600);
                        }),
                        onRowDelete: oldData => new Promise(resolve => {
                            setTimeout(() => {
                                resolve();
                                setFileData(prevFileData => {
                                    const data = [...prevFileData.data];
                                    data.splice(data.indexOf(oldData), 1);
                                    return { ...prevFileData, data };
                                })
                            }, 600);
                        })
                    }}
                />
            </div>
        </div>);
}