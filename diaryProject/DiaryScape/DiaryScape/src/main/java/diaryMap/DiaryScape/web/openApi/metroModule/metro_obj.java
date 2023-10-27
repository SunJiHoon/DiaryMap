package diaryMap.DiaryScape.web.openApi.metroModule;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public
class metro_obj{
    private String line;
    private String name;
    private String code;
    private String lat;
    private String lng;
}