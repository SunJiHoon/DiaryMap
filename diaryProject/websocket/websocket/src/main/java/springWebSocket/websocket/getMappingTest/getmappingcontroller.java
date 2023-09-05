package springWebSocket.websocket.getMappingTest;

import lombok.extern.log4j.Log4j2;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class getmappingcontroller {
    @GetMapping("/api/data")
    public String api_data(){
        log.info("get요청이 들어왔다.");
        return "api_data";
    }
}
