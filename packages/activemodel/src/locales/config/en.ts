export default {
  errors: {
    messages: {
      property_is_not_presence: "'{{property}}' can't be empty.",
      property_is_not_absence: "'{{property}}' must be blank.",
      property_is_too_long_chars_length:
        "'{{property}}' is too long (maximum '{{maximum}}' characters).",
      property_is_too_short_chars_length:
        "'{{property}}' is too short (minimum '{{minimum}}' characters).",
      property_is_too_long_words_length:
        "'{{property}}' is too long (maximum '{{maximum}}' words).",
      property_is_too_short_words_length:
        "'{{property}}' is too short (minimum '{{minimum}}' words).",
      property_is_not_equal_length: "'{{property}}' is not equal length ('{{is}}' characters).",
      property_is_not_within_length: "'{{property}}' is not within length (range: '{{- within}}').",
      property_is_not_included: "'{{property}}' is not included in the '{{- list}}'.",
      property_is_not_excluded: "'{{property}}' is not excluded in the '{{- list}}'.",
      property_do_not_meet_the_condition:
        "'{{property}}' do not meet the condition: '{{condition}}'.",
      property_do_not_meet_the_format: "'{{property}}' do not meet the format: '{{- format}}'.",
      property_is_not_only_integer_numeric: "'{{property}}' is not only integer.",
      property_is_not_greater_than_numeric: "'{{property}}' is not greater than '{{greaterThan}}'.",
      property_is_not_greater_than_or_equal_to_numeric:
        "'{{property}}' is not greater than or equal to '{{greaterThanOrEqualTo}}'.",
      property_is_not_equal_to_numeric: "'{{property}}' is not equal to '{{equalTo}}'.",
      property_is_not_less_than_numeric: "'{{property}}' is not less than '{{lessThan}}'.",
      property_is_not_less_than_or_equal_to_numeric:
        "'{{property}}' is not less than or equal to '{{lessThanOrEqualTo}}'.",
      property_is_not_odd_numeric: "'{{property}}' is not odd.",
      property_is_not_even_numeric: "'{{property}}' is not even.",
    },
  },
};
