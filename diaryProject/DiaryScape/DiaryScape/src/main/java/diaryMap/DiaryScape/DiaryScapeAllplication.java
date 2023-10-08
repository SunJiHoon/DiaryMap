package diaryMap.DiaryScape;

import diaryMap.DiaryScape.domain.member.Member;
import diaryMap.DiaryScape.domain.member.MemberMongoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;

@SpringBootApplication
public class DiaryScapeAllplication {
	public static void main(String[] args) {
		SpringApplication.run(DiaryScapeAllplication.class, args);
	}
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins("http://localhost:5173", "http://m.tongtongtripmap.com:80", "http://m.tongtongtripmap.com:8080", "https://m.tongtongtripmap.com:443")
						.allowedMethods("GET", "POST", "PUT", "DELETE")
						.allowCredentials(true).allowedHeaders("*");//;;

					////.allowedHeaders("*");;
			}
		};
	}

}
