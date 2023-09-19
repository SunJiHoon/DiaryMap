package diaryMap.DiaryScape.web.login;

import diaryMap.DiaryScape.domain.login.LoginService;
import diaryMap.DiaryScape.domain.member.Member;
import diaryMap.DiaryScape.domain.member.MemberRepository;
import diaryMap.DiaryScape.web.member.MemberWithoutId;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;


@Slf4j
//@RestController//
@RequiredArgsConstructor
@RequestMapping("/test")
public class LoginController {
    private final LoginService loginService;
    private final MemberRepository memberRepository;

    @GetMapping("/login")
    public String loginForm(@ModelAttribute("loginForm") LoginForm form) {
        log.info("간다");
        return "login/loginForm";
    }
    @PostMapping("/login")//@Valid//@Valid @ModelAttribute //requestBody
    public MemberWithoutId login(@RequestBody LoginForm form,
                        BindingResult bindingResult,
                        HttpServletResponse response) {
        log.info("들어왔다.");
        log.info(form.toString());
        MemberWithoutId noMember = new MemberWithoutId("-1", "-1");
        if (bindingResult.hasErrors()) {
            return noMember;
        }
        Member loginMember = loginService.login(form.getLoginId(),
                form.getPassword());
        log.info("login? {}", loginMember);
        if (loginMember == null) {
            bindingResult.reject("loginFail", "아이디 또는 비밀번호가 맞지 않습니다.");
            return noMember;
        }
        //로그인 성공 처리 TODO
        //쿠키에 시간 정보를 주지 않으면 세션 쿠키(브라우저 종료시 모두 종료)
        Cookie idCookie = new Cookie("memberId",
                String.valueOf(loginMember.getId()));
        response.addCookie(idCookie);

        MemberWithoutId mem = new MemberWithoutId(loginMember.getLoginId(), loginMember.getName());
        return mem;
    }


    @PostMapping("/logout")
    public String logout(HttpServletResponse response) {
        expireCookie(response, "memberId");
        return "redirect:/";
    }
    private void expireCookie(HttpServletResponse response, String cookieName) {
        Cookie cookie = new Cookie(cookieName, null);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

}
