package diaryMap.DiaryScape.domain.login;

import diaryMap.DiaryScape.domain.member.Member;
import diaryMap.DiaryScape.domain.member.MemberMongoRepository;
import diaryMap.DiaryScape.domain.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LoginMongoService {
    private final MemberMongoRepository memberMongoRepository;
    /**
     * @return null이면 로그인 실패
     */
    public Member login(String loginId, String password) {
        //List<Member> result = memberMongoRepository.findByName("4");
        List<Member> memberList = memberMongoRepository.findByLoginId(loginId);
        if (memberList.size() == 0) {
            return null;
        }
        else if (memberList.get(0).getPassword().equals(password) == true){
            return memberList.get(0);
        }
        else{
            return null;
        }
    }
}
