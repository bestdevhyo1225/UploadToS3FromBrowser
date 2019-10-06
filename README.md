# 브라우저에서 S3로 파일 업로드하기

<br>

이미지, 비디오, 음악과 같은 정적 콘텐츠를 업로드 할 때, 클라이언트에서 서버를 통해 AWS S3에 업로드 하는 것은 서버 성능에 좋지 않을것 같다는 생각이 들었습니다. 그래서 서버를 통해 파일을 업로드를 하지 말고, 클라이언트에서 직접 AWS S3에 업로드 하는 것이 서버 성능에 도움이 될 것 같다는 생각을 했습니다.

<br>

### :book: Amazon Cognito

브라우저에서는 AWS 서비스를 이용하려면 어떠한 인증 및 권한을 받아야 합니다. 그리고`Amazon Cognito`는 웹이나 모바일 앱에 대한 인증, 권한 부여 및 사용자 관리를 제공하는 서비스입니다. `Amazon Cognito`의 두 가지 주요 구성 요소는 **사용자 풀**과 **자격 증명 풀**입니다. 그리고 **사용자 풀**과 **자격 증명 풀**을 별도로 사용하거나 함께 사용할 수 있습니다.

* **`사용자 풀`**

    * 앱 사용자의 가입 및 로그인 옵션을 제공합니다.

* **`자격 증명 풀`**

    * 기타 AWS 서비스에 대한 사용자 액세스 권한을 부여할 수 있습니다.

<br>

### :book: Cognito 자격 증명 풀을 사용하기(연동 자격 증명)

`1. 자격 증명 풀 만들기`

![image](https://user-images.githubusercontent.com/23515771/65931617-721eac80-e445-11e9-8fec-3e1ec193dbb4.png)

1. 자격 증명 풀 이름을 작성합니다.

2. 인증되지 않은 자격 증명에 대한 접근을 가능하게 하고 싶다면, `인증되지 않은 자격 증명에 대한 엑세스 활성화`를 체크합니다.

3. 인증 공급자를 추가하고 싶다면, 사용자 풀에서 생성한 사용자 풀 ID, 앱 클라이언트 ID를 추가하여 공급자를 추가합니다.

`2. 권한 설정`

![image](https://user-images.githubusercontent.com/23515771/65931780-10127700-e446-11e9-9b67-236a1f2e501e.png)

세부 정보를 클릭해서 확인하면, `인증된 사용자의 역할`과 `인증 되지 않은 사용자의 역할`을 확인할 수 있습니다.

`인증되지 않은 자격 증명`

* 지원되는 자격 증명 공급자가 인증한 사용자를 위한 것입니다.

`인증된 자격 증명`

* 게스트 사용자를 위한 것입니다.

<br>

### :book: S3 버킷 생성

`버킷 정책`

* 버킷에 접근할 수 있는 역할을 정합니다. 이 역할 외에는 접근할 수 없습니다.

```json
{
    "Version": "2012-10-17",
    "Id": "PolicyForCognitoIdentityPool",
    "Statement": [
        {
            "Sid": "1",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::사용자_계정번호:role/인증된_자격_증명_풀_역할"
            },
            "Action": [
                "s3:GetObject",
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::버킷_이름/*"
        },
        {
            "Sid": "2",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::사용자_계정번호:role/인증되지_않은_자격_증명_풀_역할"
            },
            "Action": [
                "s3:GetObject",
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::버킷_이름/*"
        }
    ]
}
```

`CORS`

* 브라우저 스크립트가 Amazon S3 버킷에 액세스 하려면 먼저 다음과 같이 CORS 구성을 설정해야 합니다.

```html
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>DELETE</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```

<br>

### :book: 아키텍쳐

![image](https://user-images.githubusercontent.com/23515771/66194038-abb61880-e6ce-11e9-82fb-1f8284bf0eb3.png)

<br>

### :book: SDK 구성 및 업로드 코드

현재 웹 or 앱을 사용하는 사용자가 AWS S3 서비스에 접근하기 위해서는 `자격 증명 풀 ID`가 있어야 접근할 수 있습니다. 진행 과정은 사용자가 웹 페이지에 접속하고 나면, `Axios` 비동기 처리를 통해 서버로부터 `Cognito 정보`를 가지고 와서 AWS 서비스에 접근할 수 있도록 구현했습니다.

`SDK 구성`

```javascript
// AWS 자격 인증
const res = await axios.get('/secret');
const cognitoInfo = res.data;
AWS.config.update({
    region: cognitoInfo.BUCKET_REGION,
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: cognitoInfo.IDENTITY_POOL_ID
    })
});
```

`브라우저에서 S3로 업로드`

```javascript
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
```

`직접 구현한 코드 참고하려면, 아래의 링크를 클릭하세요`

* [views/index.pug](https://github.com/bestdevhyo1225/uploading-to-awss3-from-browser/blob/master/views/index.pug)

* [public/js/index.js](https://github.com/bestdevhyo1225/uploading-to-awss3-from-browser/blob/master/public/js/index.js)

<br>

### :memo: 개발 일지

`2019년 10월 3일 (목)`

* Cognito와 관련된 IAM 역할 2개(인증, 비인증)중에서 둘 다 S3에 접근할 수 있는 정책을 추가 했는데 `AccessDenied: Access Denied (403: Forbidden)` 에러가 뜬다. S3 버킷 정책도 추가했지만 마찬가지로 똑같은 문제가 발생한다.

`2019년 10월 4일 (금)`

* `AWS.S3.ManagedUpload` 함수의 params 파라미터의 `ACL : 'public-read'`를 삭제하고 실행하니 됐다. 되는 이유는 `권한`탭에서 `모든 퍼블릭 액세스 차단`을 활성화 시켰기 때문에 버킷 정책에서 내가 접근할 수 있도록 설정한 역할만 접근할 수 있었던 것이다.

`2019년 10월 5일 (토)`

* 만약 업로드할 파일 이름과 S3에 있는 파일 이름과 동일하다면? 이 부분을 생각하지 못했다.


<br>

### :memo: 다음 목표

1. 로그인 기능을 추가해서 구현하기

2. 이미지, 동영상, 음악파일을 서버에 전달하고, 서버에서 직접 저장하도록 구현해서 비교해보기

3. putObject()로 S3에 업로드하는 것과 ManagedUpload()를 사용하여 업로드 하는것의 차이를 공부하기

4. 이 방식이 문제점이 있는지 고민하고 사람들에게 물어보기

5. 업로드 하는 파일 이름이 중복되면 문제가 발생한다는 것. 따라서 유저 아이디와 같은 유니크한 특징을 활용해서 S3에 저장하도록 구현하자. (필수 조건은 회원 가입할 때 반드시 중복된 아이디로 저장하지 못하도록 사전에 작업이 되어 있어야하 한다.)

<br>

### :bookmark: 참고

* [AWS Cognito](https://docs.aws.amazon.com/ko_kr/cognito/latest/developerguide/what-is-amazon-cognito.html)

* [Uploading to S3 from a Browser](https://docs.aws.amazon.com/ko_kr/sdk-for-javascript/v2/developer-guide/s3-example-photo-album.html)