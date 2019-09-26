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

`Cognito`의 목표는 사용자 인증 이후, AWS 서비스에 대한 액세스 권한을 부여하는 것입니다.

1. 사용자는 **사용자 풀**을 통해 로그인하여 인증을 성공한 후, `사용자 풀 토큰`을 받습니다.

2. 앱은 **자격 증명 풀**을 통해 `사용자 풀 토큰`을 `AWS 자격 증명`으로 교환합니다.

3. 앱 사용자는 `AWS 자격 증명`을 사용하여 Amazon S3 또는 DynamoDB등 기타 AWS 서비스에 액세스 할 수 있습니다.

| <img src="https://docs.aws.amazon.com/ko_kr/cognito/latest/developerguide/images/scenario-cup-cib2.png" width="600" height="700"> |
| :--: |
| [AWS Cognito Scenario Diagram](https://docs.aws.amazon.com/ko_kr/cognito/latest/developerguide/what-is-amazon-cognito.html) |

<br>

### :bookmark: 참고

* [AWS Cognito](https://docs.aws.amazon.com/ko_kr/cognito/latest/developerguide/what-is-amazon-cognito.html) 