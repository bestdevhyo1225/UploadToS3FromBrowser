const fetchLoadCognitoConfigFromServer = async () => {
    try {
        const res = await fetch('/secret');
        const cognitoInfo = await res.json();
        
        // AWS 자격 인증
        AWS.config.update({
            region: cognitoInfo.BUCKET_REGION,
            credentials: new AWS.CognitoIdentityCredentials({
                IdentityPoolId: cognitoInfo.IDENTITY_POOL_ID
            })
        });

        const s3 = new AWS.S3({ params: { Bucket: cognitoInfo.BUCKET_NAME } });

    } catch (error) {
        console.error(error);
    }
}

fetchLoadCognitoConfigFromServer();