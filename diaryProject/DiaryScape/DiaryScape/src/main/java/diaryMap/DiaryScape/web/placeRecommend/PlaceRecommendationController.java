package diaryMap.DiaryScape.web.placeRecommend;

import diaryMap.DiaryScape.domain.obj3d.Obj3d;
import diaryMap.DiaryScape.domain.obj3d.Obj3dRepository;
import diaryMap.DiaryScape.web.obj3d.NodeDTO_for_update;
import diaryMap.DiaryScape.web.openApi.NodeDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import static diaryMap.DiaryScape.web.openApi.NodeController.calRelativeX;
import static diaryMap.DiaryScape.web.openApi.NodeController.calRelativeY;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Slf4j
public class PlaceRecommendationController {
    private final Obj3dRepository obj3dRepository;

    @GetMapping(value = "/placeRecommend/recommendPlace",produces = "application/json")
    ArrayList<importedPathModule> recommendPlace(
            //@RequestBody String contentid
            @RequestParam Map<String, String> paraMap
    ){

        String userContentid = paraMap.get("contentid");
        String MapidForStartingNode = paraMap.get("mapid");
        //String curuseridForremovingNode = paraMap.get("loginId");
        String curuseridForremovingNode = "";
        Optional<Obj3d> obj3dOptionalforStart = obj3dRepository.findById(MapidForStartingNode);
        String startX = "";
        String startY = "";
        if (obj3dOptionalforStart.isPresent()){
            Obj3d obj3dforStart = obj3dOptionalforStart.get();
            startX =obj3dforStart.getStartNode().getMapx();
            startY =obj3dforStart.getStartNode().getMapy();
            curuseridForremovingNode = obj3dforStart.getMember().getLoginId();
        }

        List<Obj3d> obj3dList = obj3dRepository.findAll();
        ArrayList<mapidAndDay> mapidAndDayArrayList = new ArrayList<>();
        for(int i = 0; i < obj3dList.size(); i++){//모든 맵 중에서
            Obj3d curObj3d = obj3dList.get(i);
            NodeDTO_for_update[] nodeDTOForUpdatesArr = curObj3d.getJsonArr();
            if (curObj3d.getMember().getLoginId().compareTo(curuseridForremovingNode) !=0 && nodeDTOForUpdatesArr != null){//jsonArr가 아직 생성 안된 경우는 제외해야 한다.
                //nodeDTOForUpdates 배열이 contentid와 일치하는 노드를 포함하고 있을까?
                for(int j = 0; j < nodeDTOForUpdatesArr.length; j++){
                    NodeDTO_for_update curNodeDTO_for_update = nodeDTOForUpdatesArr[j];
                    String curContentid = curNodeDTO_for_update.getContentid();

                    if (curContentid != null && curContentid.compareTo(userContentid) == 0){
                        //curContentid
                        String curMapid = curObj3d.getId();
                        String curDay = curNodeDTO_for_update.getVisitDate();
                        mapidAndDay tempMAD = new mapidAndDay(curMapid, curDay);
                        mapidAndDayArrayList.add(tempMAD);
                    }
                    //맵의 id와 맵의 날짜 저장
                }
            }
        }

        //현재 mapidAndDayArrayList에는 userContentid를 방문한 적 있는 맵과 날짜를 저장하고 있다.
        //이제부터 mapid를 찾고 해당 날짜를 모아서 리스트로 만들면 된다.
        ArrayList<importedPathModule> importedPathModuleArrayList = new ArrayList<>();
        for (int i=0; i < mapidAndDayArrayList.size(); i++){
            mapidAndDay tempMAD = mapidAndDayArrayList.get(i);
            String curMapid = tempMAD.getMapid();
            String curDay = tempMAD.getVisitDate();

            Optional<Obj3d> obj3d = obj3dRepository.findById(curMapid);
            if (obj3d.isPresent()) {
                Obj3d actualObj3d = obj3d.get();
                //username구하기
                String curUsername = actualObj3d.getMember().getName();
                //ArrayList<NodeDTO> nodeDTOArrayList; 구하기
                NodeDTO_for_update[] finding = actualObj3d.getJsonArr();
                ArrayList<NodeDTO_for_update> curNodeDTOArrayList = new ArrayList<>();
                int curTotalCount = 0;
                for (int j=0; j < finding.length; j++){
                    if (finding[j].getVisitDate().compareTo(curDay) == 0){
                        String relativeX = calRelativeX(startX, finding[j].getMapx());
                        String relativeY = calRelativeY(startY, finding[j].getMapy()); //calRelativeX를 Y에 재활용.
                        NodeDTO_for_update nodeDTO_for_update = new NodeDTO_for_update(
                                finding[j].getContentid(),
                                finding[j].getContentTypeId(),
                                finding[j].getTitle(),
                                finding[j].getTel(),
                                finding[j].getMapx(),
                                finding[j].getMapy(),
                                relativeX,
                                relativeY,
                                finding[j].getAddr1(),
                                finding[j].getVisitDate(),
                                finding[j].getNodeReview(),
                                finding[j].getImportCount()
                        );
                        if (finding[j].getImportCount() != null){
                            curTotalCount += Integer.parseInt(finding[j].getImportCount());
                        }
                        curNodeDTOArrayList.add(nodeDTO_for_update);
                    }
                }
                //String curTotalCount_string =  String.valueOf(curTotalCount);
                Random random = new Random();
                String curTotalCount_string =  String.valueOf(random.nextInt(11));
                String mapName = "";
                mapName = actualObj3d.getObjName();
                importedPathModule curimportedPathModule = new importedPathModule(curUsername, mapName, curTotalCount_string ,curNodeDTOArrayList);
                importedPathModuleArrayList.add(curimportedPathModule);
            }
            else{

            }
        }

        // 만약 당신이
        // 모듈 개수, //수정 예정
        // 내림차순
        // 을 원한다면
        // Comparator 정의
        Comparator<importedPathModule> totalCountComparator = Comparator.comparingInt(module ->
                Integer.parseInt(module.getTotalImportedCount()));

        // importedPathModuleArrayList를 totalImportedCount 기준으로 내림차순 정렬
        importedPathModuleArrayList.sort((module1, module2) ->
                Integer.compare(Integer.parseInt(module2.getTotalImportedCount()),
                        Integer.parseInt(module1.getTotalImportedCount())));

        //맵의 주인공 이름과, 맵에 담긴 노드들 중, 해당 날짜 노드 들을 추천.
        return importedPathModuleArrayList;
    }


}

@AllArgsConstructor
@Data
class mapidAndDay{
    String mapid;
    String visitDate;
}
@AllArgsConstructor
@Data
class importedPathModule{
    String username;
    String mapname;
    String totalImportedCount;
    ArrayList<NodeDTO_for_update> NodeDTO_for_updateArrayList;
}