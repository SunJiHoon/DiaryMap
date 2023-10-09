package diaryMap.DiaryScape.domain.obj3d;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import diaryMap.DiaryScape.web.openApi.NodeDTO;

import javax.persistence.*;

@Document(collection = "obj3ds")
@Data
public class Obj3d {
    @Id
    private String id;
    private String startX;
    private String startY;
    private String objName;
    //private String json_obj;
    //private String sceneJSON;
    private NodeDTO[] jsonArr;
    private String createdTime;
    private String modifiedTime;


}
