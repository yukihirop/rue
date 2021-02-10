export default {
  errors: {
    messages: {
      property_is_not_presence: "'{{property}}'が空です。",
      property_is_not_absence: "'{{property}}'は空でなければなりません。",
      property_is_too_long_chars_length: "'{{property}}'が長すぎます。(最大値 '{{maximum}}' 個)。",
      property_is_too_short_chars_length: "'{{property}}'が短すぎます。(最小値 '{{minimum}}' 個)。",
      property_is_not_equal_length: "'{{property}}'の長さが等しくありません。('{{is}}' 個)。",
      property_is_too_long_words_length:
        "'{{property}}'が長すぎます。(最大値 '{{maximum}}' 単語数)。",
      property_is_too_short_words_length:
        "'{{property}}'が短すぎます。(最小値 '{{minimum}}' 単語数)。",
      property_is_not_within_length:
        "'{{property}}'の長さが範囲内にありません。(範囲: '{{- within}}')。",
      property_is_not_included: "'{{property}}'が'{{- list}}'に含まれてません。",
      property_is_not_excluded: "'{{property}}'が'{{- list}}'に含まれています。",
      property_do_not_meet_the_condition:
        "'{{property}}'が条件を満たしません。条件: '{{condition}}'。",
      property_do_not_meet_the_format:
        "'{{property}}'がフォーマットを満たしません。フォーマット: '{{- format}}'。",
      property_is_not_only_integer_numeric: "'{{property}}'は整数ではありません。",
      property_is_not_greater_than_numeric:
        "'{{property}}'は'{{greaterThan}}'より大きくありません。",
      property_is_not_greater_than_or_equal_to_numeric:
        "'{{property}}'は'{{greaterThanOrEqualTo}}'以上ではありません。",
      property_is_not_equal_to_numeric: "'{{property}}'は'{{equalTo}}'と等しくありません。",
      property_is_not_less_than_numeric: "'{{property}}'は'{{lessThan}}'より小さくありません。",
      property_is_not_less_than_or_equal_to_numeric:
        "'{{property}}'は'{{lessThanOrEqualTo}}'以下ではありません。",
      property_is_not_odd_numeric: "'{{property}}'は奇数ではありません。",
      property_is_not_even_numeric: "'{{property}}'は偶数ではありません。",
    },
  },
};
