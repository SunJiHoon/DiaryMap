package diaryMap.DiaryScape.web.member;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class MemberWithoutId {
    private String loginId; //로그인 ID
    private String name; //사용자 이름

    public MemberWithoutId(String loginId, String name) {
        this.loginId = loginId;
        this.name = name;
    }
}
