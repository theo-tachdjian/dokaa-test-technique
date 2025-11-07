const RESTAURANT_REVIEWS_QUERY = `
  query get_partner_reviews(
    $options: SearchOptionsInput!
    $trackingUUID: String!
    $include_token: Boolean!
  ) {
    reviewData: get_partner_reviews(options: $options, tracking_uuid: $trackingUUID) {
      layouts: ui_review_layouts {
        typeName: __typename
        ... on PartnerReviewsLayout {
          title
          sortOptions: sort_options {
            selected
            target {
              ...uiTargetFields
            }
          }
          reviews {
            ...uiPartnerReview
          }
        }
        ... on PartnerRatingBreakdownLayout {
          title
          ratingBreakdown: rating_breakdown {
            averageRating: average_rating
            color: rating_color {
              ...colorFields
            }
            numberOfStars: number_of_stars
            totalStars: total_stars
            reviewCount: review_count
            ratingBreakdownRows: rating_breakdown_rows {
              number
              percent
              color {
                ...colorFields
              }
            }
          }
        }
        ... on PartnerReviewsButtonLayout {
          title
          button {
            text
            uiTarget: target {
              ...uiTargetFields
            }
            uiTheme: ui_theme
          }
        }
      }
      meta {
        trackingId: tracking_id
        partnerDrnId: partner_drn_id
        appliedSort: applied_sort
      }
    }
  }

  fragment colorFields on Color {
    red
    green
    blue
    hex
    name
    alpha
    token @include(if: $include_token)
  }

  fragment uiPartnerReview on PartnerReview {
    id
    reviewer {
      username
      displayName: display_name
      avatar {
        ... on Image {
          url
          altText: alt_text
        }
      }
    }
    tags {
      text
      backgroundColor: background_color {
        ...colorFields
      }
      textColor: text_color {
        ...colorFields
      }
      icon {
        name
      }
    }
    textComment: text_comment
    starRating: star_rating {
      totalStars: total_stars
      appliedStars: applied_stars
      color {
        ...colorFields
      }
    }
    date
    uiTargets: ui_targets {
      ...uiTargetFields
    }
    voteUi: vote_ui {
      defaultLine: ui_line {
        ...uiLineFields
      }
      state
      actions {
        icon {
          ...iconFields
        }
        line: ui_line {
          ...uiLineFields
        }
        state
        descriptor
        selectedIconColor: selected_icon_color {
          ...colorFields
        }
        unselectedIconColor: unselected_icon_color {
          ...colorFields
        }
        target {
          params {
            id
            value
          }
          displayName: display_name
          mutation
        }
      }
    }
  }

  fragment baseUiTargetFields on UITarget {
    typeName: __typename
    ... on UITargetAction {
      params {
        id
        value
      }
      action
      layoutId: layout_id
    }
    ... on UITargetMenuItem {
      menuItemId: menu_item_id
    }
    ... on UITargetWebPage {
      url
      newWindow: new_window
      trackingId: tracking_id
    }
    ... on UITargetLayoutGroup {
      layoutGroupId: layout_group_id
    }
    ... on UITargetMutation {
      params {
        id
        value
      }
      displayName: display_name
      mutation
    }
    ... on UITargetParams {
      title
      params {
        id
        value
      }
      queryParams: query_params
      trackingId: tracking_id
    }
  }

  fragment uiTargetFields on UITarget {
    ...baseUiTargetFields
    ... on UITargetAction {
      displayName: display_name
    }
  }

  fragment uiSpanIconSharedFields on UISpanIcon {
    key
    icon: span_icon {
      name
      size
      color {
        ...colorFields
      }
    }
  }

  fragment uiSpanSpacerSharedFields on UISpanSpacer {
    key
    width
  }

  fragment baseUiSpanFields on UISpan {
    typeName: __typename
    ... on UISpanText {
      key
      text
      size
      trackingId: tracking_id
      target {
        ...uiTargetFields
      }
      color {
        ...colorFields
      }
      isBold: is_bold
      isStrikethrough: is_strikethrough
    }
    ... on UISpanSpacer {
      ...uiSpanSpacerSharedFields
    }
    ... on UISpanIcon {
      ...uiSpanIconSharedFields
    }
    ... on UISpanPlusLogo {
      key
      plusLogoSize: size
      plusLogoColor: color {
        ...colorFields
      }
    }
    ... on UISpanCountdown {
      key
      endsAt: ends_at
      size
      color {
        ...colorFields
      }
      isBold: is_bold
    }
  }

  fragment uiSpanFields on UISpan {
    ...baseUiSpanFields
  }

  fragment uiLineFields on UILine {
    typeName: __typename
    ... on UITextLine {
      key
      align
      spans: ui_spans {
        ...uiSpanFields
      }
      maxLines: max_lines
    }
    ... on UITitleLine {
      key
      text
      color {
        ...colorFields
      }
      size
    }
  }

  fragment iconFields on Icon {
    name
    size
    color {
      ...colorFields
    }
  }
`;

module.exports = {
  RESTAURANT_REVIEWS_QUERY
};
