package edu.harvard.h2ms.validator;

import static java.util.Arrays.asList;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.ConstraintViolationException;

import edu.harvard.h2ms.annotations.ValidQuestion;
import edu.harvard.h2ms.domain.core.Question;

/**
 * Validator for Questions. Ensures that default values contain expected
 * options, and that option types provide options.
 */
public class QuestionValidator implements ConstraintValidator<ValidQuestion, Question> {

	@Override
	public boolean isValid(Question question, ConstraintValidatorContext context) {
		context.disableDefaultConstraintViolation();

		if (question.getAnswerType().equals("options")) {

			// Must supply an options list
			if (question.getOptions() == null || question.getOptions().isEmpty()) {
				context.buildConstraintViolationWithTemplate("Question with type 'options' requires options.")
						.addConstraintViolation();

				return false;
			}

			// Default value must be in options:
			else if (question.getDefaultValue() != null
					&& !question.getOptions().contains(question.getDefaultValue())) {
				context.buildConstraintViolationWithTemplate("Default value must be a valid option.")
						.addConstraintViolation();

				return false;
			}
		} else if (question.getAnswerType().equals("boolean")) {

			// Boolean default value must be one of true, false:
			if (!asList("true", "false", null).contains(question.getDefaultValue())) {
				context.buildConstraintViolationWithTemplate("Default value must be one of: true, false")
						.addConstraintViolation();

				return false;
			}
		} else {
			// Unknown type
			context.buildConstraintViolationWithTemplate("Question has unknown type.").addConstraintViolation();

			return false;
		}

		return true;
	}

	@Override
	public void initialize(ValidQuestion validator) {
		// Nothing required
	}

}
