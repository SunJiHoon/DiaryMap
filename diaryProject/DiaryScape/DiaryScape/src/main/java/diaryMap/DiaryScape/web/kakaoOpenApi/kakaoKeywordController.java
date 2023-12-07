package diaryMap.DiaryScape.web.kakaoOpenApi;

import diaryMap.DiaryScape.domain.obj3d.Obj3d;
import diaryMap.DiaryScape.domain.obj3d.Obj3dRepository;
import diaryMap.DiaryScape.web.openApi.NodeController;


import diaryMap.DiaryScape.web.openApi.KeywordDTO;
import diaryMap.DiaryScape.web.openApi.NodeDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
//import org.hibernate.cfg.Environment;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Slf4j
@PropertySource("classpath:application-API-KEY.properties")
public class kakaoKeywordController {
    private final Environment env;
    private final Obj3dRepository obj3dRepository;
    //https://developers.kakao.com/docs/latest/ko/local/dev-guide#search-by-keyword
    private String makeKakaoApiKeywordQuery_onlyKeywordFirst(String userKeyword){
        return "https://dapi.kakao.com/v2/local/search/keyword.json" +
                "?page=1" +
                "&size=15" +
                "&sort=accuracy" +
                "&query=" + userKeyword;
    }



    @GetMapping(value = "/kakaoOpenApi/onlyKeywordFirst/list",produces = "application/json")
    public String showMeNodeInfo_onlyKeywordFirst(
            @RequestParam Map<String, String> paraMap
    ) throws IOException {
        //쿼리 요청 날리기
        log.info(paraMap.get("userKeyword"));
        String queryUserKeyword = "";
        try {
            queryUserKeyword = URLEncoder.encode(paraMap.get("userKeyword"), "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        URL url = new URL(makeKakaoApiKeywordQuery_onlyKeywordFirst(queryUserKeyword));
        String line;
        StringBuilder sb = new StringBuilder();
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json; charset=UTF-8");
        // KakaoAK를 포함한 Authorization 헤더 설정
        String apiKey = env.getProperty("kakao-admin-key");
        //log.info(apiKey);
        conn.setRequestProperty("Authorization", "KakaoAK " + apiKey);

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

        //변환
        JSONObject jsonObject = new JSONObject(text);
        // "items" 객체 안에 있는 "item" 배열을 추출

        JSONArray itemArray = jsonObject.getJSONArray("documents");


        // item 배열을 순회하면서 데이터 추출
        List<NodeDTO> nodeDTOList = new ArrayList<>();
        for (int i = 0; i < itemArray.length(); i++) {
            JSONObject item = itemArray.getJSONObject(i);

            // "title", "tel", "mapx", "mapy" 정보를 추출하여 객체에 저장
            String contentid = item.getString("id");
            String contentTypeId = item.getString("category_group_code");
            String title = item.getString("place_name");
            String tel = item.getString("phone");
            String mapx = item.getString("x");
            String mapy = item.getString("y");
            String relativeX = "0";
            String relativeY = "0";//calRelativeX를 Y에 재활용.
            String addr1 = item.getString("road_address_name");
            nodeDTOList.add(
                    new NodeDTO(
                            contentid, contentTypeId,
                            title, tel,
                            mapx, mapy,
                            relativeX, relativeY,
                            addr1)
            );
        }

        JSONArray returnjsonArray = new JSONArray();
        for (NodeDTO keywordDTO : nodeDTOList) {
            JSONObject tempjsonObject = new JSONObject();
            tempjsonObject.put("contentid", keywordDTO.getContentid());
            tempjsonObject.put("contentTypeId", keywordDTO.getContentTypeId());

            tempjsonObject.put("title", keywordDTO.getTitle());
            tempjsonObject.put("tel", keywordDTO.getTel());

            tempjsonObject.put("mapx", keywordDTO.getMapx());
            tempjsonObject.put("mapy", keywordDTO.getMapy());


            tempjsonObject.put("relativeX", keywordDTO.getRelativeX());
            tempjsonObject.put("relativeY", keywordDTO.getRelativeY());

            tempjsonObject.put("addr1", keywordDTO.getAddr1());

            returnjsonArray.put(tempjsonObject);
        }

        return returnjsonArray.toString();
    }


    //
    private String makeKakaoApiKeywordQuery_onlyKeyword(String userKeyword){
        return "https://dapi.kakao.com/v2/local/search/keyword.json" +
                "?page=1" +
                "&size=15" +
                "&sort=accuracy" +
                "&query=" + userKeyword;
    }

    @GetMapping(value = "/kakaoOpenApi/onlyKeyword/list",produces = "application/json")
    public String showMeNodeInfo_onlyKeyword(
            @RequestParam Map<String, String> paraMap
    ) throws IOException {
        //쿼리 요청 날리기
        log.info(paraMap.get("userKeyword"));
        String queryUserKeyword = "";
        try {
            queryUserKeyword = URLEncoder.encode(paraMap.get("userKeyword"), "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        URL url = new URL(makeKakaoApiKeywordQuery_onlyKeyword(queryUserKeyword));
        String line;
        StringBuilder sb = new StringBuilder();
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json; charset=UTF-8");
        // KakaoAK를 포함한 Authorization 헤더 설정
        String apiKey = env.getProperty("kakao-admin-key");
        conn.setRequestProperty("Authorization", "KakaoAK " + apiKey);

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

        //변환
        JSONObject jsonObject = new JSONObject(text);
        // "items" 객체 안에 있는 "item" 배열을 추출

        JSONArray itemArray = jsonObject.getJSONArray("documents");


        // item 배열을 순회하면서 데이터 추출
        List<NodeDTO> nodeDTOList = new ArrayList<>();


        String startX = "0";
        String startY = "0";

        Optional<Obj3d> findObj = obj3dRepository.findById(paraMap.get("mapId"));
        if (findObj.isPresent()){
            startX = findObj.get().getStartNode().getMapx();
            startY = findObj.get().getStartNode().getMapy();
        }
        else{
            log.info("맵을 찾지 못했습니다. 추후 출력되는 모든 값은 보장할 수 값입니다.");
        }

        for (int i = 0; i < itemArray.length(); i++) {
            JSONObject item = itemArray.getJSONObject(i);

            // "title", "tel", "mapx", "mapy" 정보를 추출하여 객체에 저장
            String contentid = item.getString("id");
            String contentTypeId = item.getString("category_group_code");
            String title = item.getString("place_name");
            String tel = item.getString("phone");
            String mapx = item.getString("x");
            String mapy = item.getString("y");
            String relativeX = NodeController.calRelativeX(startX, mapx);
            String relativeY = NodeController.calRelativeY(startY, mapy);//calRelativeX를 Y에 재활용.
            String addr1 = item.getString("road_address_name");
            nodeDTOList.add(
                    new NodeDTO(
                            contentid, contentTypeId,
                            title, tel,
                            mapx, mapy,
                            relativeX, relativeY,
                            addr1)
            );
        }

        JSONArray returnjsonArray = new JSONArray();
        for (NodeDTO keywordDTO : nodeDTOList) {
            JSONObject tempjsonObject = new JSONObject();
            tempjsonObject.put("contentid", keywordDTO.getContentid());
            tempjsonObject.put("contentTypeId", keywordDTO.getContentTypeId());

            tempjsonObject.put("title", keywordDTO.getTitle());
            tempjsonObject.put("tel", keywordDTO.getTel());

            tempjsonObject.put("mapx", keywordDTO.getMapx());
            tempjsonObject.put("mapy", keywordDTO.getMapy());


            tempjsonObject.put("relativeX", keywordDTO.getRelativeX());
            tempjsonObject.put("relativeY", keywordDTO.getRelativeY());

            tempjsonObject.put("addr1", keywordDTO.getAddr1());

            returnjsonArray.put(tempjsonObject);
        }

        return returnjsonArray.toString();
    }



    //카카오 키워드는 특정 좌표 근처에서 검색을 수행함.
    private String makeKakaoApiKeywordQuery(String userKeyword, String y, String x){
        return "https://dapi.kakao.com/v2/local/search/keyword.json" +
                "?page=1" +
                "&size=15" +
                "&sort=accuracy" +
                "&query=" + userKeyword +
                "&y=" + y +
                "&x=" + x +
                "&radius=20000";//단위는 미터
    }

    @GetMapping(value = "/kakaoOpenApi/keywordAndCoord/list",produces = "application/json")
    public String showMeNodeInfo(
            @RequestParam Map<String, String> paraMap
    ) throws IOException {
        //쿼리 요청 날리기
        log.info(paraMap.get("userKeyword"));
        String queryUserKeyword = "";
        String mapY = "-1";
        String mapX = "-1";

        try {
            queryUserKeyword = URLEncoder.encode(paraMap.get("userKeyword"), "UTF-8");
            mapY = URLEncoder.encode(paraMap.get("mapY"), "UTF-8");
            mapX =URLEncoder.encode(paraMap.get("mapX"), "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        URL url = new URL(makeKakaoApiKeywordQuery(queryUserKeyword,mapY, mapX));
        String line;
        StringBuilder sb = new StringBuilder();
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json; charset=UTF-8");
        // KakaoAK를 포함한 Authorization 헤더 설정
        // API_KEY 가져오기
        String apiKey = env.getProperty("kakao-admin-key");
        conn.setRequestProperty("Authorization", "KakaoAK " + apiKey);

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

        //변환
        JSONObject jsonObject = new JSONObject(text);
        // "items" 객체 안에 있는 "item" 배열을 추출

        JSONArray itemArray = jsonObject.getJSONArray("documents");


        // item 배열을 순회하면서 데이터 추출
        List<NodeDTO> nodeDTOList = new ArrayList<>();


        String startX = "0";
        String startY = "0";

        Optional<Obj3d> findObj = obj3dRepository.findById(paraMap.get("mapId"));
        if (findObj.isPresent()){
            startX = findObj.get().getStartNode().getMapx();
            startY = findObj.get().getStartNode().getMapy();
        }
        else{
            log.info("맵을 찾지 못했습니다. 추후 출력되는 모든 값은 보장할 수 값입니다.");
        }


        for (int i = 0; i < itemArray.length(); i++) {
            JSONObject item = itemArray.getJSONObject(i);

            // "title", "tel", "mapx", "mapy" 정보를 추출하여 객체에 저장
            String contentid = item.getString("id");
            String contentTypeId = item.getString("category_group_code");
            String title = item.getString("place_name");
            String tel = item.getString("phone");
            String mapx = item.getString("x");
            String mapy = item.getString("y");
            String relativeX = NodeController.calRelativeX(startX, mapx);
            String relativeY = NodeController.calRelativeY(startY, mapy);//calRelativeX를 Y에 재활용.
            String addr1 = item.getString("road_address_name");
            nodeDTOList.add(
                    new NodeDTO(
                            contentid, contentTypeId,
                            title, tel,
                            mapx, mapy,
                            relativeX, relativeY,
                            addr1)
            );
        }

        JSONArray returnjsonArray = new JSONArray();
        for (NodeDTO keywordDTO : nodeDTOList) {
            JSONObject tempjsonObject = new JSONObject();
            tempjsonObject.put("contentid", keywordDTO.getContentid());
            tempjsonObject.put("contentTypeId", keywordDTO.getContentTypeId());

            tempjsonObject.put("title", keywordDTO.getTitle());
            tempjsonObject.put("tel", keywordDTO.getTel());

            tempjsonObject.put("mapx", keywordDTO.getMapx());
            tempjsonObject.put("mapy", keywordDTO.getMapy());


            tempjsonObject.put("relativeX", keywordDTO.getRelativeX());
            tempjsonObject.put("relativeY", keywordDTO.getRelativeY());

            tempjsonObject.put("addr1", keywordDTO.getAddr1());

            returnjsonArray.put(tempjsonObject);
        }

        return returnjsonArray.toString();
    }


    //카카오 키워드는 특정 좌표 근처에서 검색을 수행함.
    private String givemePathQuery(String originX, String originY, String destX, String destY){
        return "https://apis-navi.kakaomobility.com/v1/directions" +
                "?origin=" +
                originX +
                "," +
                originY +
                "&destination=" +
                destX +
                "," +
                destY +
                "&waypoints=" +
                "&priority=RECOMMEND" +
                "&car_fuel=GASOLINE" +
                "&car_hipass=false" +
                "&alternatives=false" +
                "&road_details=false";
    }

    @GetMapping(value = "/kakaoOpenApi/getPath",produces = "application/json")
    public pathInfoClass giveMePath(
            @RequestParam Map<String, String> paraMap
    ) throws IOException {
        //쿼리 요청 날리기
        String oriX = "";
        String oriY = "";
        String destX = "";
        String destY = "";

        try {
            oriX = URLEncoder.encode(paraMap.get("oriX"), "UTF-8");
            oriY = URLEncoder.encode(paraMap.get("oriY"), "UTF-8");
            destX = URLEncoder.encode(paraMap.get("destX"), "UTF-8");
            destY = URLEncoder.encode(paraMap.get("destY"), "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        URL url = new URL(givemePathQuery(oriX, oriY, destX, destY));
        String line;
        StringBuilder sb = new StringBuilder();
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json; charset=UTF-8");
        // KakaoAK를 포함한 Authorization 헤더 설정
        String apiKey = env.getProperty("kakao-admin-key");
        //log.info(apiKey);
        conn.setRequestProperty("Authorization", "KakaoAK " + apiKey);

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

        //변환
        JSONObject jsonObject = new JSONObject(text);
        // "items" 객체 안에 있는 "item" 배열을 추출
        JSONArray routesArray  = jsonObject.getJSONArray("routes");
        int distance = 0;
        int duration = 0;
        int taxiFare = 0;
        if (routesArray.length() > 0) {
            JSONObject firstRoute = routesArray.getJSONObject(0);
            if (firstRoute.has("summary")) {
                JSONObject summaryObj = firstRoute.getJSONObject("summary");
                distance = summaryObj.getInt("distance");//m
                duration = summaryObj.getInt("duration");//초
                taxiFare = summaryObj.getJSONObject("fare").getInt("taxi");
                return new pathInfoClass(String.valueOf(distance), String.valueOf(duration), String.valueOf(taxiFare));
            } else {
                // "summary" 키가 존재하지 않을 때의 처리
                log.info("No routes found");
                return new pathInfoClass("0", "0", "0");
            }
        } else {
            log.info("No routes found");
            return new pathInfoClass("0", "0", "0");
        }


    }
    //
}

@Data
@AllArgsConstructor
class pathInfoClass{
    private String distance;
    private String duration;
    private String taxiFare;
}