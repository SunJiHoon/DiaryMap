# DiaryMap
DiaryMap은 "지도 위 우리 이야기(일기장)"을 구현하기 위한 프로젝트입니다.

"지도 위 우리 이야기(일기장)"은 웹앱으로 제작될 예정입니다.
사용자는 우리의 웹앱에서 지도 위를 돌아다니며 지도 위 어느 공간에서든 일기장을 작성할 수 있습니다.

일기장을 작성할 때, 사물이나 문구 글귀 등을 배치함으로써 본인만의 독특한 일기를 쓸 수 있습니다.

일기를 채워나갈 수록 지도 위 일기가 풍성해질 것입니다 :)


현재 flow
사이트 접속 시
--
HomeController가 잡아서 로그인이 되어있다면
template안에 있는 loginhome.html을 호출한다.
    --
    login이 되어있어서 loginHome.html에 연결된 경우
    로그인 된 상태라 상품관리 혹은 로그아웃 실현 가능.

--
만약 로그인이 안 되어 있었고(session cache로 판단), 회원가입을 할 때
template 안에 있는 Home.html을 연결해준다.
    --
    login이 안 되어있어서 home.html에 연결된 경우
    회원가입 혹은 로그인페이지로 이동 가능
        - 회원가입(/members/add) get 호출 -> MemberController가 동작 
          template의 members/addMemberForm.html을 호출
        회원가입
        로그인 ID
        비밀번호
        이름
        을 입력하여 회원가입 버튼을 누르면
        - 회원가입(/members/add) post 호출 
            -> valid이상 없으면 저장하고 리다이렉트 후완료.

--
만약 로그인이 안 되어 있었고(session cache로 판단), 로그인을 할 때,
    --
    login이 안 되어있어서 home.html에 연결된 경우
    회원가입 혹은 로그인페이지로 이동 가능
        - 로그인(/login) get 호출 -> LoginController 동작 
          template의 login/loginForm.html 호출
        로그인 ID
        비밀번호
        을 입력하여 로그인 버튼을 누르면
        -  로그인(/login) post 호출 
            -> valid이상 없으면 세션쿠키 보내고 리다이렉트 후 완료
            이후 로그아웃 시 세션쿠키를 만료해주면 된다.

