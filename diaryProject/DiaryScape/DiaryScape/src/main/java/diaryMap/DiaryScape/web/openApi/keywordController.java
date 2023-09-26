package diaryMap.DiaryScape.web.openApi;

import diaryMap.DiaryScape.domain.obj3d.Obj3d;
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
import java.io.UnsupportedEncodingException;
import java.net.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Slf4j
public class keywordController {
    private String makeApiKeywordQuery(String userKeyword, String userContentType){

        return "https://apis.data.go.kr/B551011/KorService1/searchKeyword1" +
                "?serviceKey=2q1TgcBZMiSU3%2BDH9RAZej4JCO3rNDHHtjvAoeuAv6wxrDGIOw1BiBdaeYsDKBIUnMDMTvLcE0XKSYaqphQMzQ%3D%3D" +
                "&numOfRows=10" +
                "&pageNo=1&" +
                "MobileOS=ETC" +
                "&MobileApp=AppTest" +
                "&_type=json" +
                "&listYN=Y" +
                "&arrange=A" +
                "&keyword=" + userKeyword +
                "&contentTypeId=" + userContentType
                ;
    }

    //관광타입(12:관광지, 14:문화시설, 15:축제공연행사, 25:여행코스, 28:레포츠, 32:숙박, 38:쇼핑, 39:음식점) ID
    @GetMapping(value = "/openApi/start/list",produces = "application/json")
    public String showMeNodeInfo(
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

        URL url = new URL(makeApiKeywordQuery(queryUserKeyword,"12"));
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

        //변환
        JSONObject jsonObject = new JSONObject(text);
        // "items" 객체 안에 있는 "item" 배열을 추출
        JSONObject items = jsonObject.getJSONObject("response")
                .getJSONObject("body")
                .getJSONObject("items");
        JSONArray itemArray = items.getJSONArray("item");


        // item 배열을 순회하면서 데이터 추출
        List<KeywordDTO> keywordDTOList = new ArrayList<>();

        for (int i = 0; i < itemArray.length(); i++) {
            JSONObject item = itemArray.getJSONObject(i);

            // "title", "tel", "mapx", "mapy" 정보를 추출하여 객체에 저장
            String contentid = item.getString("contentid");
            String contentTypeId = item.getString("contenttypeid");
            String title = item.getString("title");
            String tel = item.getString("tel");
            String mapx = item.getString("mapx");
            String mapy = item.getString("mapy");
            String addr1 = item.getString("addr1");
            keywordDTOList.add(
                    new KeywordDTO(
                            contentid, contentTypeId,
                            title, tel,
                            mapx, mapy,
                            addr1)
            );
        }

        JSONArray returnjsonArray = new JSONArray();
        for (KeywordDTO keywordDTO : keywordDTOList) {
            JSONObject tempjsonObject = new JSONObject();
            tempjsonObject.put("contentid", keywordDTO.getContentid());
            tempjsonObject.put("contentTypeId", keywordDTO.getContentTypeId());

            tempjsonObject.put("title", keywordDTO.getTitle());
            tempjsonObject.put("tel", keywordDTO.getTel());

            tempjsonObject.put("mapx", keywordDTO.getMapx());
            tempjsonObject.put("mapy", keywordDTO.getMapy());

            tempjsonObject.put("addr1", keywordDTO.getAddr1());

            returnjsonArray.put(tempjsonObject);
        }

        return returnjsonArray.toString();
    }
}
