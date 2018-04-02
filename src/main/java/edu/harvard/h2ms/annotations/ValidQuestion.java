package edu.harvard.h2ms.annotations;

import java.lang.annotation.Documented;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

import edu.harvard.h2ms.validator.QuestionValidator;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Documented
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = { QuestionValidator.class })
public @interface ValidQuestion {
    String message() default "Invalid question.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}