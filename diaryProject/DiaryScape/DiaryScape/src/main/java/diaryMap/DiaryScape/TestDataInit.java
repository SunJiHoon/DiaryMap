package diaryMap.DiaryScape;

import diaryMap.DiaryScape.domain.item.Item;
import diaryMap.DiaryScape.domain.item.ItemRepository;
import diaryMap.DiaryScape.domain.member.Member;
import diaryMap.DiaryScape.domain.member.MemberRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class TestDataInit {

    private final ItemRepository itemRepository;
    private final MemberRepository memberRepository;


    /**
     * 테스트용 데이터 추가
     */
    @PostConstruct
    public void init() {
        itemRepository.save(new Item("itemA", 10000, 10));
        itemRepository.save(new Item("itemB", 20000, 20));

        Member member1 = new Member();
        member1.setLoginId("test");
        member1.setPassword("test!");
        member1.setName("테스터");
        memberRepository.save(member1);

        Member member2 = new Member();
        member2.setLoginId("2");
        member2.setPassword("2!");
        member2.setName("2");
        memberRepository.save(member2);
    }

}