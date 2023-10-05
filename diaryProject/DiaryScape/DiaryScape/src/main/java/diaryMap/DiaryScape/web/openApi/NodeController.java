package diaryMap.DiaryScape.web.openApi;

import diaryMap.DiaryScape.domain.obj3d.Obj3d;
import diaryMap.DiaryScape.domain.obj3d.Obj3dRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Slf4j
public class NodeController {

    private final Obj3dRepository obj3dRepository;

    private String makeApiQuery(int numOfRows, int pageNo, double mapX, double mapY, int radius, int contentTypeId){
        return "https://apis.data.go.kr/B551011/KorService1/locationBasedList1" +
                "?serviceKey=2q1TgcBZMiSU3%2BDH9RAZej4JCO3rNDHHtjvAoeuAv6wxrDGIOw1BiBdaeYsDKBIUnMDMTvLcE0XKSYaqphQMzQ%3D%3D" +
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
//관광타입(12:관광지, 14:문화시설, 15:축제공연행사, 25:여행코스, 28:레포츠, 32:숙박, 38:쇼핑, 39:음식점) ID
    @GetMapping(value = "/openApi/node",produces = "application/json")
    public String showMeNodeInfo(
            @RequestParam Map<String, String> paraMap//url+?키=value&키=value //John%20Doe
            //  /openApi/node?mapId=123&mapX=127.123123&mapY=36.123456&
            // 돌려주는 값은 NodeDTO 배열(가게정보, 좌표, 상대좌표 정보가 담긴 것 반환.)
    ) throws IOException {
    // stringURL 에는 API URL 넣기

        //contentTypeId 임의 배정
        int contentTypeId = 12;
        /*
        int contentTypeId = -1;

        String contentType = paraMap.get("contentType");
        if (contentType.equals("관광지")){
            contentTypeId = 12;
        }
        else if(contentType.equals("문화시설")){
            contentTypeId = 14;
        }
        else if(contentType.equals("쇼핑")){
            contentTypeId = 38;
        }
        else if(contentType.equals("음식점")){
            contentTypeId = 39;
        }

         */
        String searchMapX = paraMap.get("mapX");
        String searchMapY = paraMap.get("mapY");

///openApi/node?mapX=126.981611&mapY=37.568477&radius=100000&contentTypeId=관광지
        URL url = new URL(makeApiQuery(3,1,
                Double.parseDouble(searchMapX), Double.parseDouble(searchMapY),
                10000, contentTypeId));
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

        JSONObject jsonObject = new JSONObject(text);
        // "items" 객체 안에 있는 "item" 배열을 추출
        JSONObject items = jsonObject.getJSONObject("response")
                .getJSONObject("body")
                .getJSONObject("items");
        JSONArray itemArray = items.getJSONArray("item");

        String startX = "0";
        String startY = "0";

        Optional<Obj3d> findObj = obj3dRepository.findById(paraMap.get("mapId"));
        if (findObj.isPresent()){
            startX = findObj.get().getStartX();
            startY = findObj.get().getStartY();
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
            String relativeY = calRelativeX(startY, mapy);//calRelativeX를 Y에 재활용.
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

    String calRelativeX(String startX, String currX){
        double relativeVal = Double.parseDouble(currX) - Double.parseDouble(startX);
        double mul = 100; //위도상 0.063(5.6km거리)는 500을 곱하여 30을 반환하기로 했다.
        return Integer.toString((int)(relativeVal * mul) * 5);
    }



}
