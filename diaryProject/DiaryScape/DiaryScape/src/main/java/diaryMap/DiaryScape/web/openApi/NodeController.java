package diaryMap.DiaryScape.web.openApi;

import diaryMap.DiaryScape.domain.obj3d.Obj3d;
import diaryMap.DiaryScape.domain.obj3d.Obj3dRepository;
import diaryMap.DiaryScape.web.openApi.metroModule.metroInfo;
import diaryMap.DiaryScape.web.openApi.metroModule.metro_obj;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.util.*;

import diaryMap.DiaryScape.web.openApi.metroModule.metroInfo.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Slf4j
public class NodeController {

    private final Obj3dRepository obj3dRepository;
    private final Environment env;

    private String makeApiQuery(int numOfRows, int pageNo, double mapX, double mapY, int radius, int contentTypeId){
        String apiKey = env.getProperty("KorService1-key");

        return "https://apis.data.go.kr/B551011/KorService1/locationBasedList1" +
                "?serviceKey=" + apiKey +
                "&numOfRows=" + Integer.toString(numOfRows) +
                "&pageNo=" + Integer.toString(pageNo) +
                "&MobileOS=ETC" +
                "&MobileApp=AppTest" +
                "&_type=json" +
                "&listYN=Y" +
                "&arrange=C" +
                "&mapX=" + Double.toString(mapX) + //126.981611
                "&mapY=" + Double.toString(mapY) + //37.568477
                "&radius=" + Integer.toString(radius) +//
                "&contentTypeId=" + Integer.toString(contentTypeId)//12
                ;
    }
    @GetMapping(value = "/openApi/node",produces = "application/json")
    public String showMeNodeInfo_enhance(
            @RequestParam Map<String, String> paraMap//url+?키=value&키=value //John%20Doe
            //  /openApi/node?mapId=123&mapX=127.123123&mapY=36.123456&
            // 돌려주는 값은 NodeDTO 배열(가게정보, 좌표, 상대좌표 정보가 담긴 것 반환.)
    ) throws IOException {
        // stringURL 에는 API URL 넣기

        String searchMapX = paraMap.get("mapX");
        String searchMapY = paraMap.get("mapY");

        //관광타입(12:관광지, 14:문화시설, 15:축제공연행사, 25:여행코스, 28:레포츠, 32:숙박, 38:쇼핑, 39:음식점) ID

        // item 배열을 순회하면서 데이터 추출
        List<NodeDTO> nodeDTOList = new ArrayList<>();
        nodeDTOList.addAll(giveMetourDestination(searchMapX, searchMapY, paraMap.get("mapId"), 12, 30));//관광지

        //nodeDTOList.addAll(giveMetourDestination(searchMapX, searchMapY, paraMap.get("mapId"), 14, 2));//문화시설
        //nodeDTOList.addAll(giveMetourDestination(searchMapX, searchMapY, paraMap.get("mapId"), 15, 2));//축제공연행사
        //nodeDTOList.addAll(giveMetourDestination(searchMapX, searchMapY, paraMap.get("mapId"), 25, 2));//여행코스
        //nodeDTOList.addAll(giveMetourDestination(searchMapX, searchMapY, paraMap.get("mapId"), 28, 2));//레포츠
        //nodeDTOList.addAll(giveMetourDestination(searchMapX, searchMapY, paraMap.get("mapId"), 32, 2));//숙박
        //nodeDTOList.addAll(giveMetourDestination(searchMapX, searchMapY, paraMap.get("mapId"), 38, 2));//쇼핑
        //nodeDTOList.addAll(giveMetourDestination(searchMapX, searchMapY, paraMap.get("mapId"), 39, 2));//음식점
        //nodeDTOList.addAll(giveMetroInfo(searchMapX, searchMapY, paraMap.get("mapId"), 50));//지하철



        //nodeDTOList.addAll(giveMetourDestination_dummy(searchMapX, searchMapY, paraMap.get("mapId"), 12, 2));//관광지
        //nodeDTOList.addAll(giveMetourDestination_dummy(searchMapX, searchMapY, paraMap.get("mapId"), 14, 2));//문화시설
        //nodeDTOList.addAll(giveMetourDestination_dummy(searchMapX, searchMapY, paraMap.get("mapId"), 15, 2));//축제공연행사
        //nodeDTOList.addAll(giveMetourDestination_dummy(searchMapX, searchMapY, paraMap.get("mapId"), 25, 2));//여행코스
        //nodeDTOList.addAll(giveMetourDestination_dummy(searchMapX, searchMapY, paraMap.get("mapId"), 28, 2));//레포츠
        //nodeDTOList.addAll(giveMetourDestination_dummy(searchMapX, searchMapY, paraMap.get("mapId"), 32, 2));//숙박
        //nodeDTOList.addAll(giveMetourDestination_dummy(searchMapX, searchMapY, paraMap.get("mapId"), 38, 2));//쇼핑
        //nodeDTOList.addAll(giveMetourDestination_dummy(searchMapX, searchMapY, paraMap.get("mapId"), 39, 2));//음식점



        JSONArray returnjsonArray = new JSONArray();
        for (NodeDTO nodeDTO : nodeDTOList) {
            JSONObject tempjsonObject = new JSONObject();
            tempjsonObject.put("contentid", nodeDTO.getContentid());
            tempjsonObject.put("contentTypeId", nodeDTO.getContentTypeId());

            tempjsonObject.put("title", nodeDTO.getTitle());
            tempjsonObject.put("tel", nodeDTO.getTel());

            tempjsonObject.put("mapx", nodeDTO.getMapx());
            tempjsonObject.put("mapy", nodeDTO.getMapy());
            //log.info(nodeDTO.getMapx());

            tempjsonObject.put("relativeX", nodeDTO.getRelativeX());
            tempjsonObject.put("relativeY", nodeDTO.getRelativeY());

            tempjsonObject.put("addr1", nodeDTO.getAddr1());

            returnjsonArray.put(tempjsonObject);
        }
        return returnjsonArray.toString();
    }

    private List<NodeDTO> giveMetroInfo(String searchMapX, String searchMapY, String mapId, int contentTypeid) {

        metroInfo me = new metroInfo();
        ArrayList<metro_obj> metroarr = me.getSpecificJsonMetroDataObject(searchMapY, searchMapX, "2000");
//20000은 20km인데 근처 지하철 너무 많이떠서 2000 2km으로 재설정함.



        String startX = "0";
        String startY = "0";

        Optional<Obj3d> findObj = obj3dRepository.findById(mapId);
        if (findObj.isPresent()){
            startX = findObj.get().getStartNode().getMapx();
            startY = findObj.get().getStartNode().getMapy();
        }
        List<NodeDTO> returnArr = new ArrayList<>();//longitude 경도 127도 mapX
        for (int i=0;i<metroarr.size();i++){
            returnArr.add(
                    new NodeDTO
                    (
                            metroarr.get(i).getCode(), "50",
                            metroarr.get(i).getLine() + " " + metroarr.get(i).getName(), "noetel",
                            metroarr.get(i).getLng(), metroarr.get(i).getLat(),
                            calRelativeX(startX, metroarr.get(i).getLng()), calRelativeY(startY, metroarr.get(i).getLat()),
                    metroarr.get(i).getLine() + " " + metroarr.get(i).getName())
            );
        }
        return returnArr;
    }

    public List<NodeDTO> giveMetourDestination(String searchMapX, String searchMapY, String mapId, int contentTypeId, int numOfSearch) throws IOException {
        ///openApi/node?mapX=126.981611&mapY=37.568477&radius=100000&contentTypeId=관광지
        URL url = new URL(makeApiQuery(numOfSearch,1,
                Double.parseDouble(searchMapX), Double.parseDouble(searchMapY),
                1000, contentTypeId));
        log.info(makeApiQuery(numOfSearch,1,
                Double.parseDouble(searchMapX), Double.parseDouble(searchMapY),
                1000, contentTypeId));
        String line;
        StringBuilder sb = new StringBuilder();
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json; charset=UTF-8");

        // API 응답메시지를 불러와서 문자열로 저장
        BufferedReader rd;
        if(conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
            rd = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
        } else {
            rd = new BufferedReader(new InputStreamReader(conn.getErrorStream(), "UTF-8"));
        }
        while ((line = rd.readLine()) != null) {
            sb.append(line);
        }
        rd.close();
        conn.disconnect();
        String text = sb.toString();
        log.info(text);
        JSONObject jsonObject = new JSONObject(text);

        JSONObject body = jsonObject.getJSONObject("response")
                .getJSONObject("body");
        //if ()
        log.info("totalCount = " + body.get("totalCount").toString());
        if (body.get("totalCount").toString().equals("0")){
            return new ArrayList<>();
        }
        // "items" 객체 안에 있는 "item" 배열을 추출
        JSONObject items = jsonObject.getJSONObject("response")
                .getJSONObject("body")
                .getJSONObject("items");
        log.info(items.toString());

        JSONArray itemArray = items.getJSONArray("item");

        String startX = "0";
        String startY = "0";

        Optional<Obj3d> findObj = obj3dRepository.findById(mapId);
        if (findObj.isPresent()){
            startX = findObj.get().getStartNode().getMapx();
            startY = findObj.get().getStartNode().getMapy();
        }

        // item 배열을 순회하면서 데이터 추출
        List<NodeDTO> nodeDTOList = new ArrayList<>();

        for (int i = 0; i < itemArray.length(); i++) {
            JSONObject item = itemArray.getJSONObject(i);
            // "title", "tel", "mapx", "mapy" 정보를 추출하여 객체에 저장
            String contentid = item.getString("contentid");
            //tring contentTypeId = item.getString("contentTypeId");
            String title = item.getString("title");
            String tel = item.getString("tel");
            String mapx = item.getString("mapx");
            String mapy = item.getString("mapy");
            String relativeX = calRelativeX(startX, mapx);
            String relativeY = calRelativeY(startY, mapy);//calRelativeX를 Y에 재활용.
            String addr1 = item.getString("addr1");
            nodeDTOList.add(
                    new NodeDTO(
                            contentid, Integer.toString(contentTypeId),
                            title, tel,
                            mapx, mapy,
                            relativeX, relativeY,
                            addr1)
            );
        }

        return nodeDTOList;
    }
    public List<NodeDTO> giveMetourDestination_dummy(String searchMapX, String searchMapY, String mapId, int contentTypeId, int numOfSearch) throws IOException {
        ///openApi/node?mapX=126.981611&mapY=37.568477&radius=100000&contentTypeId=관광지
        String startX = "0";
        String startY = "0";

        Optional<Obj3d> findObj = obj3dRepository.findById(mapId);
        if (findObj.isPresent()){
            startX = findObj.get().getStartNode().getMapx();
            startY = findObj.get().getStartNode().getMapy();
        }

        // item 배열을 순회하면서 데이터 추출
        List<NodeDTO> nodeDTOList = new ArrayList<>();

        for (int i = 0; i < numOfSearch; i++) {
            // "title", "tel", "mapx", "mapy" 정보를 추출하여 객체에 저장
            String contentid = "dummy_id";
            //tring contentTypeId = item.getString("contentTypeId");
            String title = "dummy_title";
            String tel = "dummy_tel";
            String mapx = Double.toString(Double.parseDouble(searchMapX) + (Math.random()-0.5)*2 *0.1);
            String mapy = Double.toString(Double.parseDouble(searchMapY) + (Math.random()-0.5)*2 *0.1);
            String relativeX = calRelativeX(startX, mapx);
            String relativeY = calRelativeY(startY, mapy);//calRelativeX를 Y에 재활용.
            String addr1 = "dummy_addr";
            nodeDTOList.add(
                    new NodeDTO(
                            contentid, Integer.toString(contentTypeId),
                            title, tel,
                            mapx, mapy,
                            relativeX, relativeY,
                            addr1)
            );
        }
        return nodeDTOList;
    }

    //relativeX가 좌우
    public static String calRelativeX(String startX, String currX){
        double relativeVal = Double.parseDouble(currX) - Double.parseDouble(startX);
        double mul = 88524; //위도상 0.063(5.6km거리)는 500을 곱하여 30을 반환하기로 했다.
        return Double.toString((Double)(relativeVal * mul));
    }

    //relativeY가 상하
    public static String calRelativeY(String startY, String currY){
        double relativeVal = (Double.parseDouble(currY) - Double.parseDouble(startY));
        double mul = -110000; //위도상 0.063(5.6km거리)는 500을 곱하여 30을 반환하기로 했다.
        return Double.toString((Double)(relativeVal * mul));
    }



}
