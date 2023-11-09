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
    public void giveMeSumedDiary() throws IOException {
        log.info("쿼리쏘기");
        String apiKey = "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";
        //String apiUrl = "https://api.openai.com/v1/chat/completions"; // API 엔드포인트 URL
        //String apiKey = "YOUR_API_KEY";
        String prompt = "Translate the following English text to French: 'Hello, how are you?'";
        String apiUrl = "https://api.openai.com/v1/engines/davinci-codex/completions";

        try {
            URL url = new URL(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            conn.setRequestProperty("Authorization", "Bearer " + apiKey);
            conn.setDoOutput(true);

            String postData = "{\"prompt\": \"" + prompt + "\", \"max_tokens\": 50}"; // Adjust max_tokens as needed

            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = postData.getBytes("UTF-8");
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
            } else {
                System.out.println("Request failed with response code: " + responseCode);
            }

            conn.disconnect();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
