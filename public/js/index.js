const uploadPhoto = async () => {
    try {
        const files = document.querySelector('#getFile').files;
        if (!files.length) return alert('Please choose a file to upload first.');

        // AWS 자격 인증
        const res = await axios.get('/secret');
        const cognitoInfo = res.data;
        AWS.config.update({
            region: cognitoInfo.BUCKET_REGION,
            credentials: new AWS.CognitoIdentityCredentials({
                IdentityPoolId: cognitoInfo.IDENTITY_POOL_ID
            })
        });

        // File Upload
        const file = files[0];
        const upload = new AWS.S3.ManagedUpload({ 
            params: { 
                Bucket: cognitoInfo.BUCKET_NAME,
                Key: file.name,
                Body: file,
            } 
        });

        if (!await upload.promise()) {
            alert('File upload fail!\n\nThe upload file does not exist.');
        }

        alert('File upload success!');
    } catch (error) {
        alert('File upload fail!\n\nAn error occurred during the upload process.\n\nPlease contact your administrator.');
        console.error(error);
    }
}
