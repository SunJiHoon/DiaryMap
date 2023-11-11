package diaryMap.DiaryScape.web.chatgptApi;

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
import java.util.Map;

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
    @GetMapping(value = "/chatgptApi/sumedDiary",produces = "application/json")
    public String giveMeSumedDiary() throws IOException {
        log.info("쿼리쏘기");
        String apiUrl = "http://localhost:5000/chat";
        String basicPrompt = "내가 말하는 모든 문장을 소재로 시로 써줘. ";
        //String prompt = "Translate the following English text to French: 'Hello, how are you?'";
        String addedPrompt = "아침엔 비가 왔다. 점심엔 소금빵을 먹었는데, 조금 짰다. 날은 하루종일 흐리다.";
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
                return responseBody;
            } else {
                System.out.println("Request failed with response code: " + responseCode);
            }

            conn.disconnect();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "실패";
    }
}
