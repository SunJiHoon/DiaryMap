package diaryMap.DiaryScape.web.obj3d;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import diaryMap.DiaryScape.domain.member.Member;
import diaryMap.DiaryScape.domain.member.MemberMongoRepository;
import diaryMap.DiaryScape.domain.obj3d.Obj3d;
import diaryMap.DiaryScape.domain.obj3d.Obj3dRepository;
import diaryMap.DiaryScape.domain.obj3d.dayReview;
import diaryMap.DiaryScape.source.StringSource;
import diaryMap.DiaryScape.web.openApi.NodeDTO;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.persistence.Id;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;


@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class Obj3dController {

    private final Obj3dRepository obj3dRepository;
    private final MemberMongoRepository memberMongoRepository;

    @PostMapping("/obj/create")// obj/create?mapName=척척박사//postMapping도 가능하다.
    public String createNewObj(
            @RequestParam Map<String, String> paraMap,//url+?키=value&키=value //John%20Doe
            //@RequestParam String mapName,
            @CookieValue(value = "memberId", required = false) String cookie
    ) {

        StringSource stringSource = new StringSource();
        Obj3d obj3d1 = new Obj3d();
        obj3d1.setObjName(paraMap.get("mapName"));
        //obj3d1.setSceneJSON(stringSource.getJsonInitData());
        //obj3d1.setJsonArr();
        //obj3d1.setStartX(paraMap.get("x"));
        //obj3d1.setStartY(paraMap.get("y"));
        NodeDTO_for_update tempStartNode = new NodeDTO_for_update();
        tempStartNode.setAddr1(paraMap.get("addr1"));
        tempStartNode.setRelativeY(paraMap.get("relativeY"));
        tempStartNode.setRelativeX(paraMap.get("relativeX"));
        tempStartNode.setContentid(paraMap.get("contentid"));
        tempStartNode.setContentTypeId(paraMap.get("contentTypeId"));
        tempStartNode.setTel(paraMap.get("tel"));
        tempStartNode.setTitle(paraMap.get("title"));
        tempStartNode.setMapx(paraMap.get("mapx"));
        tempStartNode.setMapy(paraMap.get("mapy"));
        tempStartNode.setVisitDate(paraMap.get("date"));
        tempStartNode.setNodeReview(paraMap.get("nodeReview"));
        tempStartNode.setImportCount("0");

        obj3d1.setStartNode(tempStartNode);

        LocalDateTime currentTime = LocalDateTime.now();
        // 시간 형식 지정 (예: "yyyy-MM-dd HH:mm:ss")
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        // 형식에 맞게 출력
        String formattedTime = currentTime.format(formatter);
        log.info("객체 생성 시점: " + formattedTime);
        obj3d1.setCreatedTime(formattedTime);
        obj3d1.setModifiedTime(formattedTime);

        //obj3dRepository.save(obj3d1);

        log.info(obj3d1.getObjName());
        Optional<Member> loginMember = memberMongoRepository.findById(cookie);

        if (loginMember.isPresent()) {
            Member actualMember = loginMember.get();
            //log.info(String.valueOf(actualMember));
            // actualMember를 사용하여 필요한 작업을 수행
            obj3d1.setMember(actualMember); // obj3d1에 Member 정보 설정
            obj3dRepository.save(obj3d1);
            if (actualMember.getObj3dArrayList() == null) {
                actualMember.setObj3dArrayList(new ArrayList<>());
                actualMember.getObj3dArrayList().add(obj3d1);
                memberMongoRepository.save(actualMember);
            } else {
                actualMember.getObj3dArrayList().add(obj3d1);
                memberMongoRepository.save(actualMember);
            }

            //obj3d1은 참조 관계이기때문에 자동으로 저장될 것임
            log.info("로그인된 id에 초기화 된 map저장 완료.");

        } else {
            log.info("쿠키에 들어있는 id로 조회를 해봤으나 db상에 해당 id가 존재하지 않습니다.");
            log.info("we can not find id in our db. i think cookie you have is expired.");
            // Member 객체를 찾지 못한 경우의 처리
            // 예를 들어, 오류 처리 또는 다른 작업을 수행
        }

        log.info(paraMap.get("mapName"));
        log.info(cookie);
        return "success";
    }

    @GetMapping(value = "/obj/list", produces = "application/json")// obj/create?mapName=척척박사//postMapping도 가능하다.
    public String getMapLists(
            @CookieValue(value = "memberId", required = false) String cookie
    ) {
        ObjectMapper objectMapper = new ObjectMapper();
        List<titleData_DTO> titleDataDtos = new ArrayList<>();

        Optional<Member> loginMember = memberMongoRepository.findById(cookie);

        if (loginMember.isPresent()) {
            Member actualMember = loginMember.get();
            if (actualMember.getObj3dArrayList() == null){
                return "[]";
            }
            for (int i = 0; i < actualMember.getObj3dArrayList().size(); i++) {
                titleDataDtos.add(
                        new titleData_DTO(
                                actualMember.getObj3dArrayList().get(i).getObjName(),
                                actualMember.getObj3dArrayList().get(i).getId(),
                                actualMember.getObj3dArrayList().get(i).getStartNode().getContentid(),
                                actualMember.getObj3dArrayList().get(i).getStartNode().getContentTypeId(),
                                actualMember.getObj3dArrayList().get(i).getStartNode().getTitle(),
                                actualMember.getObj3dArrayList().get(i).getStartNode().getTel(),
                                actualMember.getObj3dArrayList().get(i).getStartNode().getMapx(),
                                actualMember.getObj3dArrayList().get(i).getStartNode().getMapy(),
                                actualMember.getObj3dArrayList().get(i).getStartNode().getRelativeX(),
                                actualMember.getObj3dArrayList().get(i).getStartNode().getRelativeY(),
                                actualMember.getObj3dArrayList().get(i).getStartNode().getAddr1(),
                                actualMember.getObj3dArrayList().get(i).getStartNode().getVisitDate(),
                                actualMember.getName()
                        )
                );
            }

            log.info("로그인된 id에 해당하는 map 리스트 추출 완료.");

        } else {
            log.info("쿠키에 들어있는 id로 조회를 해봤으나 db상에 해당 id가 존재하지 않습니다.");
            log.info("we can not find id in our db. i think cookie you have is expired.");
        }

        String mapDatasJson;
        try {
            mapDatasJson = objectMapper.writeValueAsString(titleDataDtos);
        } catch (JsonProcessingException e) {
            mapDatasJson = "[]";
        }
        return mapDatasJson;
    }

    @GetMapping(value = "/obj/list/public", produces = "application/json")// obj/create?mapName=척척박사//postMapping도 가능하다.
    public String getMapPublicLists(
    ) {
        ObjectMapper objectMapper = new ObjectMapper();
        List<titleData_DTO> titleDataDtos = new ArrayList<>();

        List<Obj3d> obj3ds = obj3dRepository.findAll();
        //Optional<Member> loginMember = memberMongoRepository.findById(cookie);

        Member ownerMember;
        String userName = "";
        for (int i = 0; i < obj3ds.size(); i++) {
            ownerMember = obj3ds.get(i).getMember();
            userName = ownerMember.getName();
            titleDataDtos.add(
                    new titleData_DTO(
                            obj3ds.get(i).getObjName(),
                            obj3ds.get(i).getId(),
                            obj3ds.get(i).getStartNode().getContentid(),
                            obj3ds.get(i).getStartNode().getContentTypeId(),
                            obj3ds.get(i).getStartNode().getTitle(),
                            obj3ds.get(i).getStartNode().getTel(),
                            obj3ds.get(i).getStartNode().getMapx(),
                            obj3ds.get(i).getStartNode().getMapy(),
                            obj3ds.get(i).getStartNode().getRelativeX(),
                            obj3ds.get(i).getStartNode().getRelativeY(),
                            obj3ds.get(i).getStartNode().getAddr1(),
                            obj3ds.get(i).getStartNode().getVisitDate(),
                            userName
                    )
            );
        }

        String mapDatasJson;
        try {
            mapDatasJson = objectMapper.writeValueAsString(titleDataDtos);
        } catch (JsonProcessingException e) {
            mapDatasJson = "[]";
        }
        return mapDatasJson;
    }

    @GetMapping(value = "/obj/one", produces = "application/json")
    public String getOneMap(
            @RequestParam Map<String, String> paraMap
            //url+?키=value&키=value //John%20Doe
    ) {
        ObjectMapper objectMapper = new ObjectMapper();

        String queryMapId = paraMap.get("mapId");
        Optional<Obj3d> findobj3d = obj3dRepository.findById(queryMapId);

        String objJson = "{}";
        if (findobj3d.isPresent()) {
            log.info("해당 id를 가진 map 발견");
            Obj3d actualObj3d = findobj3d.get();

            try {
                objJson = objectMapper.writeValueAsString(actualObj3d);
            } catch (JsonProcessingException e) {
                //throw new RuntimeException(e);
            }
        } else {
            log.info("해당 id를 가진 map이 존재하지 않습니다.");
        }

        return objJson;
    }

    //jsonArr를 반환
    @GetMapping(value = "/obj/one/onlyMapJson", produces = "application/json")
    public String getOneMapOnlyMapJson(
            @RequestParam Map<String, String> paraMap
            //url+?키=value&키=value //John%20Doe
    ) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();

        String queryMapId = paraMap.get("mapId");
        Optional<Obj3d> findobj3d = obj3dRepository.findById(queryMapId);

        String objJson = "{}";
        if (findobj3d.isPresent()) {
            log.info("해당 id를 가진 map 발견");
            Obj3d actualObj3d = findobj3d.get();
            //objJson = Arrays.toString((actualObj3d.getJsonArr()));
            objJson = objectMapper.writeValueAsString((actualObj3d.getJsonArr()));

        } else {
            log.info("해당 id를 가진 map이 존재하지 않습니다.");
        }
        return objJson;
    }

    //jsonArr를 날짜별로 그룹화해서 반환함
    @GetMapping(value = "/obj/one/onlyMapJsonGroupByDate", produces = "application/json")
    public String getOneMapOnlyMapJsonGroupByDate(
            @RequestParam Map<String, String> paraMap
            //url+?키=value&키=value //John%20Doe
    ) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();

        String queryMapId = paraMap.get("mapId");
        Optional<Obj3d> findobj3d = obj3dRepository.findById(queryMapId);

        String objJson = "{}";
        if (findobj3d.isPresent()) {
            log.info("해당 id를 가진 map 발견");
            Obj3d actualObj3d = findobj3d.get();
            NodeDTO_for_update[] tempJsonArr = actualObj3d.getJsonArr();

            String compareDate = "-1";
            List<mapJsonGroupByDateDTO> mjgbddList = new ArrayList<>();
            for(int i = 0; i < tempJsonArr.length; i++){
                log.info(Integer.toString(i) + "번째");
                log.info("크기 " + Integer.toString(mjgbddList.size()));
                log.info(String.valueOf(compareDate.equals(tempJsonArr[i].getVisitDate())));
                log.info(compareDate);
                log.info(tempJsonArr[i].getVisitDate());
                if (!compareDate.equals(tempJsonArr[i].getVisitDate())){
                    //문자열이 다르면
                    mapJsonGroupByDateDTO mjgbdd = new mapJsonGroupByDateDTO();
                    mjgbdd.setVisitDate(tempJsonArr[i].getVisitDate());
                    compareDate = new String(tempJsonArr[i].getVisitDate());
                    mjgbdd.setNodes(new ArrayList<>());
                    mjgbdd.getNodes().add(tempJsonArr[i]);
                    mjgbddList.add(mjgbdd);
                }
                else{//문자열이 같으면
                    mapJsonGroupByDateDTO mjgbdd = mjgbddList.get(mjgbddList.size() -1);
                    mjgbdd.getNodes().add(tempJsonArr[i]);
                }
            }
            objJson = objectMapper.writeValueAsString(mjgbddList);

        } else {
            log.info("해당 id를 가진 map이 존재하지 않습니다.");
        }
        return objJson;
    }

    @PostMapping(value = "/obj/update")
    public String updateOneMap(
            @RequestParam Map<String, String> paraMap,
            //@RequestBody Obj3d paramObj3d
            @RequestBody jsonArr_Value paramjsonArr_Value
            //url+?키=value&키=value //John%20Doe
            //@CookieValue(value = "memberId", required = false) String cookie
    ) throws JsonProcessingException {
        Obj3d actualObj3d;
        Optional<Obj3d> beingUpdateObj3d = obj3dRepository.findById(paraMap.get("mapId"));
        if (beingUpdateObj3d.isPresent()) {
            LocalDateTime currentTime = LocalDateTime.now();
            // 시간 형식 지정 (예: "yyyy-MM-dd HH:mm:ss")
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            // 형식에 맞게 출력
            String formattedTime = currentTime.format(formatter);
            log.info("객체 수정 시점: " + formattedTime);

            actualObj3d = beingUpdateObj3d.get();
            //log.info("들어온 내용 :" + paramObj3d.getSceneJSON());


            // JSON 배열을 파싱하여 JSON 객체로 변환
            //JSONArray jsonArray = new JSONArray(paramjsonArr_Value.getJsonArr());


            //nodeDto[]를 jsonArray로 만들기
            ObjectMapper objectMapper = new ObjectMapper();

            log.info(paramjsonArr_Value.getJsonArr());
            //NodeDTO_for_update[] NodeDTOs_for_update = objectMapper.readValue(paramjsonArr_Value.getJsonArr(), NodeDTO_for_update[].class);
            trashDTO[] trashDTO_for_NodeDTOs_for_update = objectMapper.readValue(paramjsonArr_Value.getJsonArr(), trashDTO[].class);
            NodeDTO_for_update[] NodeDTOs_for_update = new NodeDTO_for_update[trashDTO_for_NodeDTOs_for_update.length];

            // trashDTO_for_NodeDTOs_for_update 배열을 NodeDTO_for_update 배열로 변환 및 복사
            for (int i = 0; i < trashDTO_for_NodeDTOs_for_update.length; i++) {
                trashDTO sourceNodeDTO = trashDTO_for_NodeDTOs_for_update[i];

                NodeDTO_for_update destinationNodeDTO = new NodeDTO_for_update();

                destinationNodeDTO.setContentid(sourceNodeDTO.getContentID());
                destinationNodeDTO.setContentTypeId(sourceNodeDTO.getContentType());
                destinationNodeDTO.setTitle(sourceNodeDTO.getTitle());
                destinationNodeDTO.setTel(sourceNodeDTO.getTel());
                destinationNodeDTO.setMapx(sourceNodeDTO.getMapX());
                destinationNodeDTO.setMapy(sourceNodeDTO.getMapY());
                destinationNodeDTO.setRelativeX(sourceNodeDTO.getRelativeX());
                destinationNodeDTO.setRelativeY(sourceNodeDTO.getRelativeY());
                destinationNodeDTO.setAddr1(sourceNodeDTO.getAddr1());
                destinationNodeDTO.setVisitDate(sourceNodeDTO.getVisitDate());
                destinationNodeDTO.setNodeReview(paraMap.get("nodeReview"));
                destinationNodeDTO.setImportCount(sourceNodeDTO.getImportCount());
                // 다른 필드 복사
                NodeDTOs_for_update[i] = destinationNodeDTO;
            }

            actualObj3d.setJsonArr(NodeDTOs_for_update);
            log.info(NodeDTOs_for_update.toString());
            actualObj3d.setModifiedTime(formattedTime);
            log.info("저장수행");
            obj3dRepository.save(actualObj3d);
            //log.info(String.valueOf(actualObj3d));
            log.info("저장완료");
        } else {
            log.info("mapId불일치. 저장실패");

        }
        //저장된 내용 반환하기
        return "...";
    }

    ///

    @PostMapping(value = "/obj/update/usingJson")
    public String updateOneMapUsingJson(
            @RequestParam Map<String, String> paraMap,
            //@RequestBody Obj3d paramObj3d
            @RequestBody Map<String, List<trashDTO>> jsonData
            //url+?키=value&키=value //John%20Doe
            //@CookieValue(value = "memberId", required = false) String cookie
    ) throws JsonProcessingException {
        Obj3d actualObj3d;
        Optional<Obj3d> beingUpdateObj3d = obj3dRepository.findById(paraMap.get("mapId"));
        if (beingUpdateObj3d.isPresent()) {
            LocalDateTime currentTime = LocalDateTime.now();
            // 시간 형식 지정 (예: "yyyy-MM-dd HH:mm:ss")
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            // 형식에 맞게 출력
            String formattedTime = currentTime.format(formatter);
            log.info("객체 수정 시점: " + formattedTime);

            actualObj3d = beingUpdateObj3d.get();

            // 이 메서드에서 jsonData를 사용할 수 있습니다.
            List<trashDTO> jsonArr = jsonData.get("jsonArr");

            trashDTO[] trashDTO_for_NodeDTOs_for_update = new trashDTO[jsonArr.size()];
            for(int i = 0;i<jsonArr.size();i++){
                trashDTO_for_NodeDTOs_for_update[i] = jsonArr.get(i);
            }

            // JSON 데이터를 처리하는 로직을 작성합니다.
            NodeDTO_for_update[] NodeDTOs_for_update = new NodeDTO_for_update[trashDTO_for_NodeDTOs_for_update.length];

            // trashDTO_for_NodeDTOs_for_update 배열을 NodeDTO_for_update 배열로 변환 및 복사
            for (int i = 0; i < trashDTO_for_NodeDTOs_for_update.length; i++) {
                trashDTO sourceNodeDTO = trashDTO_for_NodeDTOs_for_update[i];

                NodeDTO_for_update destinationNodeDTO = new NodeDTO_for_update();

                destinationNodeDTO.setContentid(sourceNodeDTO.getContentID());
                destinationNodeDTO.setContentTypeId(sourceNodeDTO.getContentType());
                destinationNodeDTO.setTitle(sourceNodeDTO.getTitle());
                destinationNodeDTO.setTel(sourceNodeDTO.getTel());
                destinationNodeDTO.setMapx(sourceNodeDTO.getMapX());
                destinationNodeDTO.setMapy(sourceNodeDTO.getMapY());
                destinationNodeDTO.setRelativeX(sourceNodeDTO.getRelativeX());
                destinationNodeDTO.setRelativeY(sourceNodeDTO.getRelativeY());
                destinationNodeDTO.setAddr1(sourceNodeDTO.getAddr1());
                destinationNodeDTO.setVisitDate(sourceNodeDTO.getVisitDate());
                destinationNodeDTO.setNodeReview(paraMap.get("nodeReview"));
                destinationNodeDTO.setImportCount(sourceNodeDTO.getImportCount());

                // 다른 필드 복사
                NodeDTOs_for_update[i] = destinationNodeDTO;
            }

            actualObj3d.setJsonArr(NodeDTOs_for_update);
            log.info(NodeDTOs_for_update.toString());
            actualObj3d.setModifiedTime(formattedTime);
            log.info("저장수행");
            obj3dRepository.save(actualObj3d);
            //log.info(String.valueOf(actualObj3d));
            log.info("저장완료");
        } else {
            log.info("mapId불일치. 저장실패");

        }
        //저장된 내용 반환하기
        return "...";
    }


    @PostMapping(value = "/obj/updateNodeAndDayReviews/usingJson")
    public String updateOneMapAndReviewUsingJson(
            @RequestParam Map<String, String> paraMap,
            @RequestBody RequestDatas requestDatas
            //,@RequestBody diaryMap.DiaryScape.web.review.jsonArr_Value paramjsonArr_Value
    ) {
        //private ArrayList<dayReview> dayReviews;
        Obj3d actualObj3d;
        Optional<Obj3d> beingUpdateObj3d = obj3dRepository.findById(paraMap.get("mapId"));

        if (beingUpdateObj3d.isPresent()) {
            actualObj3d = beingUpdateObj3d.get();
            ArrayList<dayReview> dayReviewsToBeSaved = requestDatas.getRequestData().getDayReviews();
            log.info("입력으로 주어진 저장될 리뷰는 다음과 같습니다.");
            for (int i=0;i<dayReviewsToBeSaved.size();i++){
                log.info("날짜 : " + dayReviewsToBeSaved.get(i).getVisitDate());
                log.info("일일 리뷰 : " + dayReviewsToBeSaved.get(i).getDayReview());
            }
            actualObj3d.setDayReviews(dayReviewsToBeSaved);
            obj3dRepository.save(actualObj3d);
            //log.info(String.valueOf(actualObj3d));
            log.info("리뷰들 저장완료");
        } else {
            log.info("mapId불일치. 리뷰들 저장실패");
        }

        if (beingUpdateObj3d.isPresent()) {
            LocalDateTime currentTime = LocalDateTime.now();
            // 시간 형식 지정 (예: "yyyy-MM-dd HH:mm:ss")
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            // 형식에 맞게 출력
            String formattedTime = currentTime.format(formatter);
            log.info("객체 수정 시점: " + formattedTime);

            actualObj3d = beingUpdateObj3d.get();

            // 이 메서드에서 jsonData를 사용할 수 있습니다.
            List<trashDTO> jsonArr = requestDatas.getRequestData().getJsonArr();

            trashDTO[] trashDTO_for_NodeDTOs_for_update = new trashDTO[jsonArr.size()];
            for(int i = 0;i<jsonArr.size();i++){
                trashDTO_for_NodeDTOs_for_update[i] = jsonArr.get(i);
            }

            // JSON 데이터를 처리하는 로직을 작성합니다.
            NodeDTO_for_update[] NodeDTOs_for_update = new NodeDTO_for_update[trashDTO_for_NodeDTOs_for_update.length];
            //입력으로 주어진 저장될 노드들은 다음과 같습니다.
            // trashDTO_for_NodeDTOs_for_update 배열을 NodeDTO_for_update 배열로 변환 및 복사
            for (int i = 0; i < trashDTO_for_NodeDTOs_for_update.length; i++) {
                log.info("노드리뷰 : " + trashDTO_for_NodeDTOs_for_update[i].getNodeReview());
                trashDTO sourceNodeDTO = trashDTO_for_NodeDTOs_for_update[i];

                NodeDTO_for_update destinationNodeDTO = new NodeDTO_for_update();

                destinationNodeDTO.setContentid(sourceNodeDTO.getContentID());
                destinationNodeDTO.setContentTypeId(sourceNodeDTO.getContentType());
                destinationNodeDTO.setTitle(sourceNodeDTO.getTitle());
                destinationNodeDTO.setTel(sourceNodeDTO.getTel());
                destinationNodeDTO.setMapx(sourceNodeDTO.getMapX());
                destinationNodeDTO.setMapy(sourceNodeDTO.getMapY());
                destinationNodeDTO.setRelativeX(sourceNodeDTO.getRelativeX());
                destinationNodeDTO.setRelativeY(sourceNodeDTO.getRelativeY());
                destinationNodeDTO.setAddr1(sourceNodeDTO.getAddr1());
                destinationNodeDTO.setVisitDate(sourceNodeDTO.getVisitDate());
                destinationNodeDTO.setNodeReview(sourceNodeDTO.getNodeReview());
                destinationNodeDTO.setImportCount(sourceNodeDTO.getImportCount());
                // 다른 필드 복사
                NodeDTOs_for_update[i] = destinationNodeDTO;
            }

            actualObj3d.setJsonArr(NodeDTOs_for_update);
            log.info(NodeDTOs_for_update.toString());
            actualObj3d.setModifiedTime(formattedTime);
            log.info("저장수행");
            obj3dRepository.save(actualObj3d);
            //log.info(String.valueOf(actualObj3d));
            log.info("노드들 저장완료");
            return "성공";
        } else {
            log.info("mapId불일치. 노드들 저장실패");
            return "실패";
        }
    }




    @GetMapping(value = "/obj/isFirst")
    public String checkFirstOrNot(
            @RequestParam Map<String, String> paraMap
    )
    {
        Obj3d actualObj3d;
        Optional<Obj3d> beingUpdateObj3d = obj3dRepository.findById(paraMap.get("mapId"));
        if (beingUpdateObj3d.isPresent()){
            actualObj3d = beingUpdateObj3d.get();
            log.info("객체 생성 시점" + actualObj3d.getCreatedTime());
            log.info("객체 수정 시점" + actualObj3d.getModifiedTime());
            if (actualObj3d.getCreatedTime().equals(actualObj3d.getModifiedTime())){
                return "first";
            }
            else{
                return "modified";
            }
        }
        else{
            log.info("mapId불일치. 저장실패");
        }
        //저장된 내용 반환하기
        return "mapId를 다시 확인해주세요";
    }

    @PostMapping("/obj/delete")// obj/create?mapName=척척박사//postMapping도 가능하다.
    public String createNewObj(
            @RequestParam Map<String, String> paraMap
    ) {
        String id = paraMap.get("mapId");
        Optional<Obj3d> obj3dRepositoryById = obj3dRepository.findById(id);
        if (obj3dRepositoryById.isPresent()){
            Obj3d actualObj3d = obj3dRepositoryById.get();
            Member member = actualObj3d.getMember();
            if (member.getObj3dArrayList() != null) {
                member.getObj3dArrayList().removeIf(obj -> obj.getId().equals(id));
                memberMongoRepository.save(member); // 변경된 Member를 저장
            }
            obj3dRepository.deleteById(id);
        }
        return "삭제 수행";
    }


}

@Data
@RequiredArgsConstructor
class jsonArr_Value{
    private String jsonArr;
}

@Data
@RequiredArgsConstructor
class trashDTO{
    private String tag;
    private String contentID;
    private String contentType;
    private String title;// = jsonObject.getString("title");
    private String tel;// = jsonObject.getString("tel");
    private String mapX;// = jsonObject.getString("mapx");
    private String mapY;// = jsonObject.getString("mapy");
    private String relativeX;
    private String relativeY;
    private String addr1;
    private String visitDate;
    private String nodeReview;
    private String importCount;
}
@Data
@RequiredArgsConstructor
class mapJsonGroupByDateDTO{
    private String visitDate;
    private List<NodeDTO_for_update> nodes;
}

@Data
@RequiredArgsConstructor
class jsonArr_Value_dayReviews{
    private ArrayList<dayReview> dayReviews;
}



// 여러 개의 JSON 객체를 담을 수 있는 래퍼 클래스
@Data
@RequiredArgsConstructor
class RequestData {
    //private Map<String, List<trashDTO>> dayReviewss;
    private ArrayList<trashDTO> jsonArr;
    private ArrayList<dayReview> dayReviews;

    // jsonData와 paramjsonArr_Value의 Getter와 Setter 메서드
}

@Data
@RequiredArgsConstructor
class RequestDatas {
    private RequestData requestData;
}