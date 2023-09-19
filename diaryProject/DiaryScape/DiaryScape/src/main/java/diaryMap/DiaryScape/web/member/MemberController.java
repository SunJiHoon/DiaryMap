package diaryMap.DiaryScape.web.member;

import diaryMap.DiaryScape.domain.member.Member;
import diaryMap.DiaryScape.domain.member.MemberRepository;
import diaryMap.DiaryScape.web.login.LoginForm;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;


//@RestController
@RequiredArgsConstructor
@RequestMapping("/test")
@Slf4j
public class MemberController {
    private final MemberRepository memberRepository;
    @GetMapping("/members/add")
    public String addForm(@ModelAttribute("member") Member member) {
        return "members/addMemberForm";
    }
    //@PostMapping("/members/add")
    public String save(@Valid @ModelAttribute Member member, BindingResult result) {
        if (result.hasErrors()) {
            return "members/addMemberForm";
        }
        memberRepository.save(member);
        return "redirect:/";
    }
    //@PostMapping("/members/add")
    @PostMapping("/register")
    public String save_josn(@RequestBody Member member,
                            BindingResult result) {
        memberRepository.save(member);
        log.info("회원가입. 완료");
        log.info("member? {}", member);
        return "회원가입";//"items/items";
    }
}
