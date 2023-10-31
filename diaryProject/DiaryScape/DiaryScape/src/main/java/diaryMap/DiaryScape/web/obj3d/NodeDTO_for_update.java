package diaryMap.DiaryScape.web.obj3d;

import lombok.Data;
import lombok.RequiredArgsConstructor;

//for update이기도 하지만, 그냥 mynodes, jsonarr를 위한 값이다.
@Data
@RequiredArgsConstructor
public class NodeDTO_for_update {
    //private String tag;
    private String contentid;
    private String contentTypeId;
    private String title;// = jsonObject.getString("title");
    private String tel;// = jsonObject.getString("tel");
    private String mapx;// = jsonObject.getString("mapx");
    private String mapy;// = jsonObject.getString("mapy");
    private String relativeX;
    private String relativeY;
    private String addr1;
    private String visitDate;
}
