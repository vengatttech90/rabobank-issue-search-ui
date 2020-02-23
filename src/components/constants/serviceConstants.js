const contextURL = "http://localhost:8083/rabobankstatementvalidator/report/"
export const uriStore = {
  //  UPLOAD_AND_FETCH_UPLOADED_DATA: 'http://localhost:8083/rabobankstatementvalidator/upload',
  //  FETCH_SEARCHED_DATA: 'http://localhost:8083/rabobankstatementvalidator/fetch'
  UPLOAD_AND_FETCH_UPLOADED_DATA: contextURL + "extract/issues",
  FETCH_SEARCHED_DATA: contextURL + "fetch"
}