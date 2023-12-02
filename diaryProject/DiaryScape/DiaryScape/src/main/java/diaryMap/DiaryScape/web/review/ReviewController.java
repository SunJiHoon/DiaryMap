package diaryMap.DiaryScape.web.review;
import diaryMap.DiaryScape.domain.obj3d.Obj3d;
import diaryMap.DiaryScape.domain.obj3d.Obj3dRepository;
import diaryMap.DiaryScape.domain.obj3d.dayReview;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Slf4j
public class ReviewController {
    private final Obj3dRepository obj3dRepository;

    //total 리뷰 저장 및 조회
    @PostMapping(value = "/totalReview/save", produces = "application/json")
    public String setTotalReview(
            @RequestParam Map<String, String> paraMap,
            @RequestBody jsonStr_Value paramjsonStr_Value
    ) {
        Obj3d actualObj3d;
        Optional<Obj3d> beingUpdateObj3d = obj3dRepository.findById(paraMap.get("mapId"));

        if (beingUpdateObj3d.isPresent()) {
            actualObj3d = beingUpdateObj3d.get();
            String wantToBeSaveReview = paramjsonStr_Value.getReview();
            log.info(wantToBeSaveReview + "\n라고 저장하겠습니다.");
            actualObj3d.setTotalReview(wantToBeSaveReview);
            obj3dRepository.save(actualObj3d);
            //log.info(String.valueOf(actualObj3d));
            log.info("저장완료");
            return "저장성공";
        } else {
            log.info("mapId불일치. 저장실패");
            return "mapId불일치. 저장실패";
        }
    }

    @GetMapping(value = "/totalReview/look",produces = "application/json")
    public jsonStr_Value getTotalReview(
            @RequestParam Map<String, String> paraMap
        ) {
        Obj3d actualObj3d;
        Optional<Obj3d> LookingObj3d = obj3dRepository.findById(paraMap.get("mapId"));

        if (LookingObj3d.isPresent()) {
            actualObj3d = LookingObj3d.get();
            String lookedReviewVal = actualObj3d.getTotalReview();
            //log.info(String.valueOf(actualObj3d));
            log.info("조회 결과 : " + lookedReviewVal);
            jsonStr_Value jsonLookedReviewVal = new jsonStr_Value();
            jsonLookedReviewVal.setReview(lookedReviewVal);
            return jsonLookedReviewVal;
        } else {
            log.info("mapId불일치. 조회 실패");
            jsonStr_Value jsonLookedReviewVal = new jsonStr_Value();
            jsonLookedReviewVal.setReview("mapId불일치 조회실패");
            return jsonLookedReviewVal;
        }
    }

    //day 리뷰s 저장 및 조회
    @PostMapping(value = "/dayReviews/save", produces = "application/json")
    public String setDayReviews(
            @RequestParam Map<String, String> paraMap,
            @RequestBody jsonArr_Value paramjsonArr_Value
    ) {
        Obj3d actualObj3d;
        Optional<Obj3d> beingUpdateObj3d = obj3dRepository.findById(paraMap.get("mapId"));

        if (beingUpdateObj3d.isPresent()) {
            actualObj3d = beingUpdateObj3d.get();
            ArrayList<dayReview> dayReviewsToBeSaved = paramjsonArr_Value.getDayReviews();
            log.info("입력으로 주어진 저장될 리뷰는 다음과 같습니다.");
            for (int i=0;i<dayReviewsToBeSaved.size();i++){
                log.info("날짜 : " + dayReviewsToBeSaved.get(i).getVisitDate());
                log.info("일일 리뷰 : " + dayReviewsToBeSaved.get(i).getDayReview());
            }
            actualObj3d.setDayReviews(dayReviewsToBeSaved);
            obj3dRepository.save(actualObj3d);
            //log.info(String.valueOf(actualObj3d));
            log.info("저장완료");
            return "저장성공";
        } else {
            log.info("mapId불일치. 저장실패");
            return "mapId불일치. 저장실패";
        }
    }

    @GetMapping(value = "/dayReviews/look",produces = "application/json")
    public ArrayList<dayReview> getDayReviews(
            @RequestParam Map<String, String> paraMap
    ) {
        Obj3d actualObj3d;
        Optional<Obj3d> LookingObj3d = obj3dRepository.findById(paraMap.get("mapId"));

        if (LookingObj3d.isPresent()) {
            actualObj3d = LookingObj3d.get();
            ArrayList<dayReview> lookedDayReviews = actualObj3d.getDayReviews();
            //log.info(String.valueOf(actualObj3d));
            log.info("찾은 내용은 다음과 같습니다.");
            String returnString = "";
            for (int i=0;i<lookedDayReviews.size();i++){
                returnString += lookedDayReviews.get(i).getVisitDate();
                returnString += lookedDayReviews.get(i).getDayReview();
                log.info("날짜 : " + lookedDayReviews.get(i).getVisitDate());
                log.info("일일 리뷰 : " + lookedDayReviews.get(i).getDayReview());
            }
            return lookedDayReviews;
        } else {
            log.info("mapId불일치. 조회 실패");
            ArrayList<dayReview> jsonLookedReviewVal = new ArrayList<dayReview>();
            //jsonLookedReviewVal.setReview("mapId불일치 조회실패");
            return jsonLookedReviewVal;
        }
    }

    /*

    @GetMapping(value = "/hihihi/hihihihi",produces = "application/json")
    public resultMessage hihihireturn(){

        hihihi hi = new hihihi();
        hi.setResult("현현수");
        resultMessage re = new resultMessage();
        re.setCode("2000");
        re.setHihihiresult(hi);
        re.setIsSuccess(true);
        return re;
    }
 */

}

@Data
@RequiredArgsConstructor
class jsonStr_Value{
    private String review;
}

@Data
@RequiredArgsConstructor
class jsonArr_Value{
    private ArrayList<dayReview> dayReviews;
}

/*

@Data
@RequiredArgsConstructor
class hihihi{
    private String result;
}

@Data
@RequiredArgsConstructor
class resultMessage{
    private Boolean isSuccess;
    private String code;
    private hihihi hihihiresult;
}


 */