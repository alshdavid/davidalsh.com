export function getBinary(event){
    return new Promise((res, err) => {
        let response = []
        let fileList = event.target.files;
        let fileListLength = event.target.files.length

        for (var i = 0; i < fileList.length; i++) {
          var file = fileList[i];
          var reader = new FileReader();

          reader.onload = ((file) =>
            evt => {    
                response.push({
                    image: evt.target.result,
                    imageType: file.type,
                    name: file.name
                }) 
                if (response.length == fileListLength) {
                    res(response)
                }       
            }
          )(file)
    
          reader.readAsBinaryString(file)
        }
    })
}

export function getBase64(event){
    return new Promise((res, err) => {
        let response = []
        let fileList = event.target.files;
        let fileListLength = event.target.files.length
        
        for (var i = 0; i < fileList.length; i++) {
          var file = fileList[i];
          var reader = new FileReader();

          reader.onload = ((file) =>
            evt => {    
                response.push({
                    image: evt.target.result,
                    imageType: file.type,
                    name: file.name
                }) 
                if (response.length == fileListLength) {
                    res(response)
                }        
            }
          )(file)
    
          reader.readAsDataURL(file)
        }
    })
}
