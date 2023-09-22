package diaryMap.DiaryScape.domain.obj3d;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.*;

@Document(collection = "obj3ds")
@Data
public class Obj3d {
    @Id
    private String id;
    private String objName;
    private String json_obj;
}
