package diaryMap.DiaryScape.web.review;

import lombok.Getter;
import lombok.Setter;


@Getter @Setter
public class ReviewDTO {
    //private Long id;
    private String reviewTitle;
    private String reviewerName;//나중에 리뷰어 id로 변경해야한다.
    //private Long star_count;
    private long hart_count;
    //private DoType doType;
    private String doName;

    private int x;
    private int y;

}
