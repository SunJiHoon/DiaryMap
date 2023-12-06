package diaryMap.DiaryScape.domain.obj3d;

import diaryMap.DiaryScape.domain.member.Member;
import diaryMap.DiaryScape.web.obj3d.NodeDTO_for_update;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import diaryMap.DiaryScape.web.openApi.NodeDTO;

import javax.persistence.*;
import java.util.ArrayList;

@Document(collection = "obj3ds")
@Data
public class Obj3d {
    @Id
    private String id;
    //private String startX;
    //private String startY;
    private String objName;
    //private String json_obj;
    //private String sceneJSON;
    private NodeDTO_for_update[] jsonArr;
    private String createdTime;
    private String modifiedTime;
    private NodeDTO_for_update startNode;
    private String totalReview;
    private ArrayList<dayReview> dayReviews;
    private String isPublic;
    @DBRef
    private Member member; // Member를 DBRef로 참조
}

