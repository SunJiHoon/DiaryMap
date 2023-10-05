package diaryMap.DiaryScape.web.obj3d;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import diaryMap.DiaryScape.domain.member.Member;
import diaryMap.DiaryScape.domain.member.MemberMongoRepository;
import diaryMap.DiaryScape.domain.obj3d.Obj3d;
import diaryMap.DiaryScape.domain.obj3d.Obj3dRepository;
import diaryMap.DiaryScape.source.StringSource;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.json.JSONParser;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;


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
    ){

        StringSource stringSource = new StringSource();
        Obj3d obj3d1 = new Obj3d();
        obj3d1.setObjName(paraMap.get("mapName"));
        obj3d1.setSceneJSON(stringSource.getJsonInitData());
        obj3d1.setStartX(paraMap.get("x"));
        obj3d1.setStartY(paraMap.get("y"));
        obj3dRepository.save(obj3d1);

        log.info(obj3d1.getObjName());
        Optional<Member> loginMember = memberMongoRepository.findById(cookie);

        if (loginMember.isPresent()) {
            Member actualMember = loginMember.get();
            //log.info(String.valueOf(actualMember));
            // actualMember를 사용하여 필요한 작업을 수행

            if(actualMember.getObj3dArrayList() == null){
                actualMember.setObj3dArrayList(new ArrayList<>());
                actualMember.getObj3dArrayList().add(obj3d1);
                memberMongoRepository.save(actualMember);
            }
            else{
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
    ){
        ObjectMapper objectMapper = new ObjectMapper();
        List<titleData_DTO> titleDataDtos = new ArrayList<>();
        //mapDataDtos.add(new mapData_DTO("title1","id1"));
        //mapDataDtos.add(new mapData_DTO("title2","id2"));

        //log.info(cookie);
        Optional<Member> loginMember = memberMongoRepository.findById(cookie);

        if (loginMember.isPresent()) {
            Member actualMember = loginMember.get();
            for(int i=0;i<actualMember.getObj3dArrayList().size();i++){
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

        }
        else {
            log.info("쿠키에 들어있는 id로 조회를 해봤으나 db상에 해당 id가 존재하지 않습니다.");
            log.info("we can not find id in our db. i think cookie you have is expired.");
        }

        String mapDatasJson;
        try{
            mapDatasJson = objectMapper.writeValueAsString(titleDataDtos);
        }
        catch (JsonProcessingException e){
            mapDatasJson= "[]";
        }

        return mapDatasJson;
    }

    @GetMapping(value = "/obj/one", produces = "application/json")
    public String getOneMap(
            @RequestParam Map<String, String> paraMap
            //url+?키=value&키=value //John%20Doe
    )
    {
        ObjectMapper objectMapper = new ObjectMapper();

        String queryMapId = paraMap.get("mapId");
        Optional<Obj3d> findobj3d = obj3dRepository.findById(queryMapId);

        String objJson = "{}";
        if (findobj3d.isPresent()){
            log.info("해당 id를 가진 map 발견");
            Obj3d actualObj3d = findobj3d.get();

            try {
                objJson = objectMapper.writeValueAsString(actualObj3d);
            } catch (JsonProcessingException e) {
                //throw new RuntimeException(e);
            }
        }
        else{
            log.info("해당 id를 가진 map이 존재하지 않습니다.");
        }

        return objJson;
    }

    @GetMapping(value = "/obj/one/onlyMapJson", produces = "application/json")
    public String getOneMapOnlyMapJson(
            @RequestParam Map<String, String> paraMap
            //url+?키=value&키=value //John%20Doe
    )
    {
        ObjectMapper objectMapper = new ObjectMapper();

        String queryMapId = paraMap.get("mapId");
        Optional<Obj3d> findobj3d = obj3dRepository.findById(queryMapId);

        String objJson = "{}";
        if (findobj3d.isPresent()){
            log.info("해당 id를 가진 map 발견");
            Obj3d actualObj3d = findobj3d.get();

            try {
                objJson = objectMapper.writeValueAsString(actualObj3d.getSceneJSON());
            } catch (JsonProcessingException e) {
                //throw new RuntimeException(e);
            }
        }
        else{
            log.info("해당 id를 가진 map이 존재하지 않습니다.");
        }

        return objJson;
    }
    @PostMapping(value = "/obj/update")
    public void updateOneMap(
            @RequestParam Map<String, String> paraMap,
            @RequestBody Obj3d paramObj3d
            //url+?키=value&키=value //John%20Doe
            //@CookieValue(value = "memberId", required = false) String cookie
    )
    {
        Obj3d actualObj3d;
        Optional<Obj3d> beingUpdateObj3d = obj3dRepository.findById(paraMap.get("mapId"));
        if (beingUpdateObj3d.isPresent()){
            actualObj3d = beingUpdateObj3d.get();
            actualObj3d.setSceneJSON(paramObj3d.getSceneJSON());
            log.info("저장수행");
            obj3dRepository.save(actualObj3d);
            //log.info(String.valueOf(actualObj3d));
            log.info("저장완료");
        }
        else{
            log.info("mapId불일치. 저장실패");

        }

    }
}