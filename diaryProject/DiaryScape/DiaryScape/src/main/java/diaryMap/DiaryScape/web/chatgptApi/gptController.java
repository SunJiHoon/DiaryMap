package diaryMap.DiaryScape.web.chatgptApi;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import diaryMap.DiaryScape.domain.obj3d.Obj3d;
import diaryMap.DiaryScape.domain.obj3d.Obj3dRepository;
import diaryMap.DiaryScape.domain.obj3d.dayReview;
import diaryMap.DiaryScape.web.obj3d.NodeDTO_for_update;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.entity.StringEntity;
import org.apache.http.util.EntityUtils;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Slf4j
public class gptController {
    private final Obj3dRepository obj3dRepository;
    public List<mapGroupByDateDTO> giveListMeMapGroupByDate(String queryMapId) {
        Optional<Obj3d> findobj3d = obj3dRepository.findById(queryMapId);
        //String objJson = "{}";
        List<mapGroupByDateDTO> mjgbddList = new ArrayList<>();
        if (findobj3d.isPresent()) {
            log.info("해당 id를 가진 map 발견");
            Obj3d actualObj3d = findobj3d.get();
            NodeDTO_for_update[] tempJsonArr = actualObj3d.getJsonArr();

            String compareDate = "-1";

            for(int i = 0; i < tempJsonArr.length; i++){
                log.info(Integer.toString(i) + "번째");
                log.info("크기 " + Integer.toString(mjgbddList.size()));
                log.info(String.valueOf(compareDate.equals(tempJsonArr[i].getVisitDate())));
                log.info(compareDate);
                log.info(tempJsonArr[i].getVisitDate());
                if (!compareDate.equals(tempJsonArr[i].getVisitDate())){
                    //문자열이 다르면
                    mapGroupByDateDTO mjgbdd = new mapGroupByDateDTO();
                    mjgbdd.setVisitDate(tempJsonArr[i].getVisitDate());
                    compareDate = new String(tempJsonArr[i].getVisitDate());
                    mjgbdd.setNodes(new ArrayList<>());
                    mjgbdd.getNodes().add(tempJsonArr[i]);
                    mjgbddList.add(mjgbdd);
                }
                else{//문자열이 같으면
                    mapGroupByDateDTO mjgbdd = mjgbddList.get(mjgbddList.size() -1);
                    mjgbdd.getNodes().add(tempJsonArr[i]);
                }
            }
        } else {
            log.info("해당 id를 가진 map이 존재하지 않습니다.");
        }
        return mjgbddList;
    }

    //

    @GetMapping(value = "/chatgptApi/sumedDiary",produces = "application/json")
    public MyAnswer giveMeSumedDiary(
            @RequestParam Map<String, String> paraMap
    ) throws IOException {
        String addedPrompt = "";

        List<mapGroupByDateDTO> wholeInfo = giveListMeMapGroupByDate(paraMap.get("mapId"));

        //actualObj3d로 addedPrompt를 구성할 것이다.
        Obj3d actualObj3d;
        Optional<Obj3d> LookingObj3d = obj3dRepository.findById(paraMap.get("mapId"));
        if (LookingObj3d.isPresent()) {
            actualObj3d = LookingObj3d.get();
            ArrayList<dayReview> lookedDayReviews = actualObj3d.getDayReviews();
            //log.info(String.valueOf(actualObj3d));
            log.info("찾은 내용은 다음과 같습니다.");
            for (int i=0;i<lookedDayReviews.size();i++){
                //addedPrompt += lookedDayReviews.get(i).getVisitDate() + " ";
                addedPrompt += " " + Integer.toString(i + 1) + "번째 날" + " ";
                addedPrompt += "간 곳 : ";

                if(wholeInfo.size() > i){
                    for(int j=0;j<wholeInfo.get(i).getNodes().size();j++){
                        addedPrompt += wholeInfo.get(i).getNodes().get(j).getTitle() + ", ";
                    }
                }
                //addedPrompt += " " + Integer.toString(i) + "번째 날" + " ";
                addedPrompt += "리뷰 : " + lookedDayReviews.get(i).getDayReview() + " ";
                log.info("날짜 : " + lookedDayReviews.get(i).getVisitDate());
                log.info("일일 리뷰 : " + lookedDayReviews.get(i).getDayReview());
            }
        } else {
            MyAnswer myAnswer = new MyAnswer();
            myAnswer.setAnswer("mapId불일치. 조회 실패");
            return myAnswer;
        }

        ////
        log.info("쿼리쏘기");
        String apiUrl = "http://localhost:5000/chat";
        String basicPrompt = "다음 데이터를 기반으로 100자 이내의 하나의 일기를 작성해줘.";
        //String prompt = "Translate the following English text to French: 'Hello, how are you?'";
        try {
            URL url = new URL(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-type", "application/json; charset=UTF-8");

            // JSON 데이터를 요청 바디에 작성
            String jsonInputString = "{\"user_message\": \"" +
                    basicPrompt + addedPrompt +
                    "\"}";

            // Output 스트림을 열어서 JSON 데이터 전송
            conn.setDoOutput(true);
            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonInputString.getBytes("utf-8");
                os.write(input, 0, input.length);
            }


            int responseCode = conn.getResponseCode();

            if (responseCode == 200) {
                BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                String inputLine;
                StringBuffer response = new StringBuffer();

                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();

                String responseBody = response.toString();
                System.out.println("Response: " + responseBody);
                MyAnswer myAnswer = new MyAnswer();
                myAnswer.setAnswer(responseBody);
                log.info(responseBody);
                return myAnswer;
            } else {
                System.out.println("Request failed with response code: " + responseCode);
            }

            conn.disconnect();
        } catch (IOException e) {
            e.printStackTrace();
        }
        MyAnswer myAnswer = new MyAnswer();
        myAnswer.setAnswer("python 쿼리 실패");
        return myAnswer;
    }
}

@Data
@RequiredArgsConstructor
class MyAnswer{
    private String answer;
}

@Data
@RequiredArgsConstructor
class mapGroupByDateDTO{
    private String visitDate;
    private List<NodeDTO_for_update> nodes;
}