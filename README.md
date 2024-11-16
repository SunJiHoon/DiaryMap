# DiaryMap: TongTong TripMap

## 프로젝트 개요
DiaryMap은 사용자가 여행을 보다 쉽고 효율적으로 계획하고 기록할 수 있도록 설계된 여행 리뷰 및 계획 웹 애플리케이션입니다. 여행 기록부터 계획까지, 사용자 친화적인 기능과 혁신적인 기술 통합을 통해 여행 경험을 혁신적으로 개선합니다.

### 주요 기능
- **여행 기록 및 리뷰 작성**  
  사용자가 메모를 입력하면 AI가 이를 기반으로 자동으로 일기를 생성하며, 사용자는 이를 보완할 수 있습니다.
- **여행 계획**  
  다른 사용자가 공개한 여행 데이터를 가져와 자신의 계획에 통합할 수 있습니다.
- **지도 데이터 관리**  
  사용자가 생성한 지도 데이터를 공개(public) 또는 비공개(private)로 설정 가능하며, 공개된 여행 데이터는 다른 사용자와 공유할 수 있습니다.
- **노드 관리 및 추천**  
  방문한 장소와 유사한 노드를 추천하거나, 다른 사용자의 동선을 참고하여 일정을 개선할 수 있습니다.

---

## 사용 기술 스택
### **백엔드**
- **Spring**, **Flask**, **MongoDB**
- 활용 API: OpenAI, Kakao, 한국관광공사

### **프론트엔드**
- **React**, **Chakra UI**

### **그래픽 구성**
- **THREE.JS**, **MapBox API**

---

## 주요 특징
1. **AI 기반 여행 일기 생성**  
   - 사용자의 메모를 기반으로 OpenAI를 활용해 일기를 자동 생성.  
2. **여행 데이터 공개/비공개 설정**  
   - 개인 여행 데이터를 공개하거나 비공개로 설정 가능.  
3. **3D 그래픽을 활용한 지도 렌더링**  
   - THREE.JS와 MapBox API로 3D 지도 및 사용자 인터랙션 제공.  
4. **다른 사용자와의 데이터 공유**  
   - 공개된 여행 데이터를 활용해 개인화된 여행 계획 수립.  

---

## 사용 방법
### **회원가입 및 로그인**
1. 첫 화면에서 **회원가입** 또는 **로그인** 버튼을 클릭하여 계정을 생성합니다.
2. ID, 닉네임, 비밀번호를 입력하여 회원가입을 완료합니다.
![image](https://github.com/user-attachments/assets/692ac180-6faa-479e-865a-0fc6600955b2)
![image](https://github.com/user-attachments/assets/286d6528-d08e-4d6f-9b2a-cb5231b4dec8)

### **여행 관리**
1. **새로운 여행 생성**:
   - 여행 제목, 날짜, 장소를 입력하여 새 여행 계획을 추가합니다.
   - 장소를 검색하여 노드를 추가합니다.
![image](https://github.com/user-attachments/assets/2a7ea626-3df8-4e7c-82b8-7fee9c4c9391)
![image](https://github.com/user-attachments/assets/33e7b136-8109-469e-82f5-d37a5a984774)


2. **여행 기록 및 리뷰 작성**:
   - AI가 생성한 리뷰를 확인하고 필요 시 수정 및 보완 가능합니다.
   - 노드 추가/삭제 및 정보 수정 가능.
![image](https://github.com/user-attachments/assets/32027dd5-984d-4357-9195-f307ddf0562d)
![image](https://github.com/user-attachments/assets/a86e2810-49b1-4ce7-badd-56ab96b85618)
![image](https://github.com/user-attachments/assets/a64ad60a-95f0-4b02-b795-59749a84302d)
![image](https://github.com/user-attachments/assets/beee1706-abd1-4635-b511-5f99b6dc7200)

3. **다른 사용자 데이터 활용**:
   - 공개된 여행 데이터를 가져와 자신의 여행 계획에 통합할 수 있습니다.
![image](https://github.com/user-attachments/assets/c3a35d31-4a9c-41a6-a417-776ca00c8f42)
![image](https://github.com/user-attachments/assets/d307d357-de95-4213-a42b-312a3b8384ac)

---

## 프로젝트 결과
### 성과
- 다양한 기술 스택(Spring, React, MongoDB, THREE.JS)을 통합하여 사용자 친화적인 플랫폼 구현.
- 백엔드, 프론트엔드, 그래픽 간의 효율적인 협업 경험.
- React와 3D 그래픽 설계를 통해 향상된 UI/UX 구현.

### 학습 성과
- NoSQL 데이터베이스와 다양한 API 연동 기술 습득.
- 사용자 중심 설계와 문제 해결 능력 향상.

---

## 향후 계획
- 사용자 피드백을 반영하여 기능 개선.
- 네비게이션 및 캐릭터 상호작용 기능 추가.
- 여행 데이터의 시각적 표현 강화.


![image](https://github.com/SunJiHoon/DiaryMap/assets/46434398/cce2e646-c793-4382-8f04-eae881d5e3da)
![image](https://github.com/SunJiHoon/DiaryMap/assets/46434398/aedb0780-fa9f-4303-932d-c3ea09e83fad)
![image](https://github.com/SunJiHoon/DiaryMap/assets/46434398/17ba7362-0845-4a0a-9310-64f742d556ac)
![image](https://github.com/SunJiHoon/DiaryMap/assets/46434398/8edd72d5-cf9a-4ea3-bedb-259683c4c2cc)
![image](https://github.com/SunJiHoon/DiaryMap/assets/46434398/60bb0e6b-9014-49a0-94fc-fd1d9818ec33)
![image](https://github.com/SunJiHoon/DiaryMap/assets/46434398/b6b9468c-2278-4ff0-8037-a561cf6b4ef9)



