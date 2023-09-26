package diaryMap.DiaryScape.web.openApi;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class KeywordDTO {
    private String contentid;
    private String contentTypeId;
    private String title;// = jsonObject.getString("title");
    private String tel;// = jsonObject.getString("tel");
    private String mapx;// = jsonObject.getString("mapx");
    private String mapy;// = jsonObject.getString("mapy");
    private String addr1;
}
