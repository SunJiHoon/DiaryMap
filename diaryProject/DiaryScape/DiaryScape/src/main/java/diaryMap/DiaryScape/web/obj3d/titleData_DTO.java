package diaryMap.DiaryScape.web.obj3d;

import diaryMap.DiaryScape.web.openApi.NodeDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class titleData_DTO {
    private String reviewtitle;
    private String mapId;
    private String contentId;
    private String contentTypeId;
    private String title;
    private String tel;
    private String mapX;
    private String mapY;
    private String relativeX;
    private String relativeY;
    private String addr1;
}