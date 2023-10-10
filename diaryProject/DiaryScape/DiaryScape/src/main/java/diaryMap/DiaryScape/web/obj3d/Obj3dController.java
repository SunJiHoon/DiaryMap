package diaryMap.DiaryScape.web.obj3d;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import diaryMap.DiaryScape.domain.member.Member;
import diaryMap.DiaryScape.domain.member.MemberMongoRepository;
import diaryMap.DiaryScape.domain.obj3d.Obj3d;
import diaryMap.DiaryScape.domain.obj3d.Obj3dRepository;
import diaryMap.DiaryScape.source.StringSource;
import diaryMap.DiaryScape.web.openApi.NodeDTO;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;

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

    /*
    const ToDoListHandler = () => {
    axios.get('https://localhost:4000/sendlist/todo',
      {userId: userId},
      { withCredentials: true }
    )
    .then((res)=> {
      setToDoList(res.data.data)
    })
  }
  */
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
        obj3d1.setStartX(paraMap.get("x"));
        obj3d1.setStartY(paraMap.get("y"));

        LocalDateTime currentTime = LocalDateTime.now();
        // 시간 형식 지정 (예: "yyyy-MM-dd HH:mm:ss")
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        // 형식에 맞게 출력
        String formattedTime = currentTime.format(formatter);
        log.info("객체 생성 시점: " + formattedTime);
        obj3d1.setCreatedTime(formattedTime);
        obj3d1.setModifiedTime(formattedTime);

        obj3dRepository.save(obj3d1);

        log.info(obj3d1.getObjName());
        Optional<Member> loginMember = memberMongoRepository.findById(cookie);

        if (loginMember.isPresent()) {
            Member actualMember = loginMember.get();
            //log.info(String.valueOf(actualMember));
            // actualMember를 사용하여 필요한 작업을 수행

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
        /*
        List<Member> findmemberlist = memberMongoRepository.findByName("3");
        if (findmemberlist.size() > 0) {
            if(findmemberlist.get(0).getObj3dArrayList() == null){
                findmemberlist.get(0).setObj3dArrayList(new ArrayList<>());
                findmemberlist.get(0).getObj3dArrayList().add(obj3d1);
                memberMongoRepository.save(findmemberlist.get(0));
            }
            else{
                findmemberlist.get(0).getObj3dArrayList().add(obj3d1);
                memberMongoRepository.save(findmemberlist.get(0));
            }
        }
*/

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
        //mapDataDtos.add(new mapData_DTO("title1","id1"));
        //mapDataDtos.add(new mapData_DTO("title2","id2"));

        //log.info(cookie);
        Optional<Member> loginMember = memberMongoRepository.findById(cookie);

        if (loginMember.isPresent()) {
            Member actualMember = loginMember.get();
            for (int i = 0; i < actualMember.getObj3dArrayList().size(); i++) {
                //log.info(actualMember.getObj3dArrayList().get(i).getObjName());
                //log.info(actualMember.getObj3dArrayList().get(i).getId());
                titleDataDtos.add(
                        new titleData_DTO(
                                actualMember.getObj3dArrayList().get(i).getObjName(),
                                actualMember.getObj3dArrayList().get(i).getId(),
                                actualMember.getObj3dArrayList().get(i).getStartX(),
                                actualMember.getObj3dArrayList().get(i).getStartY()
                        ));
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

            /*
            try {
                //objJson = objectMapper.writeValueAsString(actualObj3d.getSceneJSON());
            } catch (JsonProcessingException e) {
                //throw new RuntimeException(e);
            }
            */

        } else {
            log.info("해당 id를 가진 map이 존재하지 않습니다.");
        }
        return objJson;
    }

    //sceneJson 분석용
    /*
    @GetMapping(value = "/obj/one/onlyMapJson/parse", produces = "application/json")
    public String getOneMapOnlyMapJsonParse(
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
            objJson = (actualObj3d.getSceneJSON());
        } else {
            log.info("해당 id를 가진 map이 존재하지 않습니다.");
        }

        JSONObject jsonObject = new JSONObject(objJson);
        // "items" 객체 안에 있는 "item" 배열을 추출
        JSONArray childrenArr = jsonObject.getJSONObject("object")
                .getJSONArray("children");
//                .getJSONObject("items");
        //JSONArray itemArray = items.getJSONArray("item");

        JSONObject actualObject = null;

        for (int i = 0; i < childrenArr.length(); i++) {
            // JSON 객체로 변환
            JSONObject provisoformyNode = childrenArr.getJSONObject(i);
            // 특정 키를 가지고 있는지 확인
            if (provisoformyNode.has("userData")) {
                actualObject = provisoformyNode.getJSONObject("userData");
                break;
            }
        }

        return actualObject.getJSONArray("myNode").toString();
    }
*/
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
            NodeDTO_for_update[] NodeDTOs_for_update = objectMapper.readValue(paramjsonArr_Value.getJsonArr(), NodeDTO_for_update[].class);
/*
            JsonNode rootNode = objectMapper.readTree(paramjsonArr_Value.getJsonArr());
            JsonNode jsonArrNode = rootNode.get("jsonArr");
            log.info(jsonArrNode.toString());
            NodeDTO_for_update[] NodeDTOs_for_update = objectMapper.readValue(jsonArrNode.toString(), NodeDTO_for_update[].class);
 */
            NodeDTO[] NodeDTOs = new NodeDTO[NodeDTOs_for_update.length];
            // NodeDTO_for_update 배열을 NodeDTO 배열로 변환 및 복사
            for (int i = 0; i < NodeDTOs_for_update.length; i++) {
                NodeDTO_for_update sourceNodeDTO = NodeDTOs_for_update[i];

                NodeDTO destinationNodeDTO = new NodeDTO();

                destinationNodeDTO.setContentid(sourceNodeDTO.getContentID());
                destinationNodeDTO.setContentTypeId(sourceNodeDTO.getContentType());
                destinationNodeDTO.setTitle(sourceNodeDTO.getTitle());
                destinationNodeDTO.setTel(sourceNodeDTO.getTel());
                destinationNodeDTO.setMapx(sourceNodeDTO.getMapX());
                destinationNodeDTO.setMapy(sourceNodeDTO.getMapY());
                destinationNodeDTO.setRelativeX(sourceNodeDTO.getRelativeX());
                destinationNodeDTO.setRelativeY(sourceNodeDTO.getRelativeY());
                destinationNodeDTO.setAddr1(sourceNodeDTO.getAddr1());
                // 다른 필드 복사
                NodeDTOs[i] = destinationNodeDTO;
            }

            actualObj3d.setJsonArr(NodeDTOs);
            log.info(NodeDTOs.toString());
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

}

@Data
@RequiredArgsConstructor
class jsonArr_Value{
    private String jsonArr;
}

@Data
@RequiredArgsConstructor
class NodeDTO_for_update{
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
}