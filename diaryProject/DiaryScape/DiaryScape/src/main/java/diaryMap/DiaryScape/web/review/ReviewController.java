package diaryMap.DiaryScape.web.review;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import diaryMap.DiaryScape.domain.member.Member;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import static diaryMap.DiaryScape.web.review.DoType.Gangwon;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Slf4j
public class ReviewController {
    //더미
    @GetMapping(value = "/reviews", produces = "application/json")
    public String getReviews() throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();


        ReviewDTO[] reviewDTOs = new ReviewDTO[3];		// 객체 배열 선언 및 생성

        reviewDTOs[0] = new ReviewDTO();
        reviewDTOs[0].setReviewTitle("양양기록");
        reviewDTOs[0].setReviewerName("리뷰어 A");
        reviewDTOs[0].setHart_count(840);
        reviewDTOs[0].setDoName("강원도");

        reviewDTOs[1] = new ReviewDTO();
        reviewDTOs[1].setReviewTitle("환선굴탐방기");
        reviewDTOs[1].setReviewerName("리뷰어 B");
        reviewDTOs[1].setHart_count(370);
        reviewDTOs[1].setDoName("강원도");

        reviewDTOs[2] = new ReviewDTO();
        reviewDTOs[2].setReviewTitle("근대 성당 둘러보기(대구)");
        reviewDTOs[2].setReviewerName("리뷰어 A");
        reviewDTOs[2].setHart_count(942);
        reviewDTOs[2].setDoName("경상경상도");

        String jsonArray = objectMapper.writeValueAsString(reviewDTOs);
        return jsonArray;
    }
}
