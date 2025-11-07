const FULL_TEXT_SEARCH_QUERY = `
  query getTextSearchResults(
    $ui_blocks: [UIBlockType!]
    $ui_features: [UIFeatureType!]
    $ui_layouts: [UILayoutType!]
    $ui_targets: [UITargetType!]
    $ui_themes: [UIThemeType!]
    $location: LocationInput!
    $url: String
    $options: SearchOptionsInput
    $uuid: String!
    $include_token: Boolean!
  ) {
    results: text_search(
      location: $location
      url: $url
      options: $options
      capabilities: {
        ui_blocks: $ui_blocks
        ui_features: $ui_features
        ui_themes: $ui_themes
        ui_targets: $ui_targets
        ui_layouts: $ui_layouts
      }
      uuid: $uuid
    ) {
      layoutGroups: ui_layout_groups {
        data: ui_layouts {
          ...uiLayoutFields
        }
      }
      controlGroups: ui_control_groups {
        filters: sorting_and_filters {
          ...uiSortingAndFiltersFields
        }
      }
      rooBlockTemplates: roo_block_templates {
        ...uiRooBlockTemplateFields
      }
      meta {
        options {
          query
          recent_searches {
            search_term
            date_time
            pill_id
          }
        }
        uuid
      }
    }
  }
  
  fragment uiBasicComponentFields on UIBasicRowComponent {
    typeName: __typename
    ... on UIBasicRowTextContent {
      key
      textContent: content {
        ...uiLineFields
      }
    }
    ... on UIBasicRowImageContent {
      key
      imageContent: content {
        ... on Icon {
          name
        }
      }
    }
  }

  fragment uiBlockFieldsSearch on UIBlock {
    ...uiBlockFields
    ... on UIBasicRow {
      key
      trackingId: tracking_id
      target {
        ...uiTargetFieldsSearch
      }
      contentMain: content_main {
        ...uiBasicComponentFields
      }
    }
  }

  fragment uiRooBlockFields on UIRooBlock {
    adServeId: ad_serve_id
    data
    rooTemplateId: roo_template_id
    key
    trackingId: tracking_id
    trackingProperties: tracking_properties
  }

  fragment uiBasicRow on UIBasicRow {
    rowType: type
    contentMain: content_main {
      typeName: __typename
      ... on UIBasicRowTextContent {
        key
        textContent: content {
          ...uiLines
        }
      }
    }
    key
    trackingId: tracking_id
  }

  fragment uiBlockFields on UIBlock {
    typeName: __typename
    ... on UIBanner {
      adServeId: ad_serve_id
      key
      header
      caption
      backgroundColor: background_color {
        ...colorFields
      }
      buttonCaption: button_caption
      contentDescription: content_description
      target {
        ...uiTargetFields
      }
      images {
        icon {
          ...iconFields
        }
        image
      }
      theme: ui_theme
      trackingId: tracking_id
      trackingProperties: tracking_properties
    }
    ... on UIButton {
      ...uiButton
    }
    ... on UIShortcut {
      key
      images {
        default
      }
      name
      contentDescription: content_description
      nameColor: name_color {
        ...colorFields
      }
      backgroundColor: background_color {
        ...colorFields
      }
      target {
        ...uiTargetFields
      }
      uiOverlay: ui_overlay {
        backgroundColor: background_color {
          typeName: __typename
          ...colorFields
          ...colorGradientFields
        }
        text {
          typeName: __typename
          ...uiLines
        }
      }
      theme: ui_theme
      trackingId: tracking_id
    }
    ... on UICard {
      adServeId: ad_serve_id
      key
      trackingId: tracking_id
      trackingProperties: tracking_properties
      theme: ui_theme
      contentDescription: content_description
      border {
        ...uiCardBorderFields
      }
      target {
        ...uiTargetFields
      }
      uiContent: properties {
        default {
          ...uiHomeCardFields
        }
        expanded {
          ...uiHomeCardFields
        }
      }
    }
    ... on UIMerchandisingCard {
      key
      headerImageUrl: header_image_url
      backgroundImageUrl: background_image_url
      contentDescription: content_description
      uiLines: ui_lines {
        ...uiLines
      }
      buttons {
        key
        target {
          ...uiTargetFields
        }
        text
      }
      theme: ui_theme
      responsiveImage: image {
        ...uiResponsiveImage
      }
      cardBackgroundColor: background_color {
        ...colorFields
      }
      buttonCaption: button_caption
      target {
        ...uiTargetFields
      }
      trackingId: tracking_id
    }
    ... on UICategoryPill {
      ...uiCategoryPillFields
    }
    ... on UITallMenuItemCard {
      ...uiTallMenuItemCardFields
    }
    ... on UIStoryCard {
      ...uiStoryCardFields
    }
    ... on UIRooBlock {
      ...uiRooBlockFields
      entityDrnId: entity_drn_id
    }
    ... on UIBasicRow {
      ...uiBasicRow
    }
    ... on UIPill {
      ...uiPillFields
    }
  }

  fragment colorFields on Color {
    hex
    red
    green
    blue
    alpha
    token @include(if: $include_token)
  }

  fragment colorGradientFields on ColorGradient {
    from {
      ...colorFields
    }
    to {
      ...colorFields
    }
  }

  fragment currencyFields on Currency {
    code
    formatted
    fractional
    presentational
  }

  fragment iconFields on DeliverooIcon {
    name
    image
  }

  fragment illustrationBadgeFields on DeliverooIllustrationBadge {
    name
    image
  }

  fragment uiTargetFields on UITarget {
    typeName: __typename
    ... on UITargetRestaurant {
      ...uiTargetRestaurant
    }
    ... on UITargetParams {
      ...uiTargetParamsFields
    }
    ... on UITargetAction {
      action
      layoutId: layout_id
      params {
        id
        value
      }
    }
    ... on UITargetMenuItem {
      ...uiTargetMenuItem
    }
    ... on UITargetDeepLink {
      webTarget: fallback_target {
        uri: url
      }
    }
    ... on UITargetMenuItemModifier {
      ...uiTargetMenuItemModifier
    }
    ... on UITargetWebPage {
      url
      newWindow: new_window
    }
    ... on UITargetEditorialContent {
      id
    }
    ... on UITargetOpenFulfillmentTimeModal {
      ...uiTargetOpenFulfillmentTimeModalFields
    }
  }

  fragment uiTargetOpenFulfillmentTimeModalFields on UITargetOpenFulfillmentTimeModal {
    scheduleFilterKey: schedule_filter_key
    trackingId: tracking_id
  }

  fragment uiTargetFieldsUIPill on UITarget {
    typeName: __typename
    ... on UITargetAction {
      action
      layoutId: layout_id
      trackingId: tracking_id
      params {
        id
        value
      }
    }
    ... on UITargetFilterOptions {
      type
      options {
        ...uiPillOptionFields
      }
      trackingId: tracking_id
      trackingProperties: tracking_properties
    }
  }

  fragment uiTargetFieldsSearch on UITarget {
    ...uiTargetFields
    ... on UITargetAutocompleteSuggestion {
      suggestion
      params {
        id
        value
      }
      uiTargetType: ui_target_type
    }
  }

  fragment uiTargetMenuItem on UITargetMenuItem {
    menuItem: menu_item {
      id
    }
    links {
      href
    }
    typeName: __typename
  }

  fragment uiTargetMenuItemModifier on UITargetMenuItemModifier {
    restaurantId: restaurant_id
    menuItemId: menu_item_id
    uiTargetType: ui_target_type
  }

  fragment uiTargetParamsFields on UITargetParams {
    params {
      id
      value
    }
    queryParams: query_params
    title
    typeName: __typename
  }

  fragment uiTargetRestaurant on UITargetRestaurant {
    restaurant {
      id
      name
      partner_drn_id
      partnerDrnId: partner_drn_id
      links {
        self {
          href
          partner_drn_id
        }
      }
    }
    typeName: __typename
    params {
      id
      value
    }
  }

  fragment uiLayoutFields on UILayout {
    typeName: __typename
    ... on UILayoutList {
      header
      key
      blocks: ui_blocks {
        ...uiBlockFieldsSearch
      }
      trackingId: tracking_id
    }
    ... on UILayoutCarousel {
      key
      target {
        ...uiTargetFields
      }
      uiLines: ui_lines {
        ...uiLines
      }
      targetPresentational: target_presentational
      trackingId: tracking_id
      blocks: ui_blocks {
        ...uiBlockFieldsSearch
      }
    }
  }

  fragment uiSortingAndFiltersFields on UISortingAndFiltersGroup {
    title
    options {
      key
      title {
        ...uiLines
      }
      options {
        id
        header
        type: options_type
        options {
          id
          header
          default
          selected
          targetParams: target_params {
            ...uiTargetParamsFields
          }
        }
      }
    }
  }

  fragment uiButton on UIButton {
    key
    text
    contentDescription: content_description
    target {
      ...uiTargetFields
    }
    theme: ui_theme
    trackingId: tracking_id
    trackingProperties: tracking_properties
    line: ui_line {
      ...uiLines
    }
    type
  }

  fragment uiCardBorderFields on UICardBorderType {
    topColor: top_color {
      ...colorFields
    }
    bottomColor: bottom_color {
      ...colorFields
    }
    leftColor: left_color {
      ...colorFields
    }
    rightColor: right_color {
      ...colorFields
    }
    borderWidth: border_width
  }

  fragment uiHomeCardFields on UICardFields {
    bubble {
      uiLines: ui_lines {
        ...uiLines
      }
    }
    overlay {
      badges {
        key
        backgroundColor: background_color {
          ...colorFields
          ...colorGradientFields
        }
        spacing
        position
        text {
          ...uiLines
        }
      }
      background: background {
        typeName: __typename
        ...colorFields
        ...colorGradientFields
      }
      text {
        position
        color {
          ...colorFields
        }
        value
      }
      promotionTag: promotion_tag {
        primaryTagLine: primary_tag_line {
          backgroundColor: background_color {
            ...colorFields
            ...colorGradientFields
          }
          text {
            ...uiLines
          }
        }
        secondaryTagLine: secondary_tag_line {
          backgroundColor: background_color {
            ...colorFields
            ...colorGradientFields
          }
          text {
            ...uiLines
          }
        }
      }
    }
    favouritesOverlay: favourites_overlay {
      id
      entity
      isSelected: is_selected
      backgroundColor: background_color {
        ...colorFields
        ...colorGradientFields
      }
      selectedColor: selected_color {
        ...colorFields
      }
      unselectedColor: unselected_color {
        ...colorFields
      }
      target {
        ...uiTargetFields
      }
      countData: count_data {
        count
        isMaxCount: is_max_count
      }
    }
    countdownBadgeOverlay: countdown_badge_overlay {
      backgroundColor: background_color {
        ...colorFields
      }
      uiLine: ui_line {
        ...uiLines
      }
    }
    image
    uiLines: ui_lines {
      ...uiLines
    }
    illustrationBadge: illustration_badge {
      ...illustrationBadgeFields
    }
  }

  fragment uiCategoryPillFields on UICategoryPill {
    typeName: __typename
    blocks: content {
      ...uiLines
    }
    backgroundColor: background_color {
      typeName: __typename
      ...colorFields
    }
    target {
      ...uiTargetFields
    }
    trackingId: tracking_id
    contentDescription: content_description
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

  fragment uiLines on UILine {
    typeName: __typename
    ... on UITextLine {
      ...uiTextLine
    }
    ... on UITitleLine {
      key
      text
      color {
        ...colorFields
      }
      size
    }
    ... on UITagLine {
      key
    }
    ... on UIBulletLine {
      key
      iconSpan: icon_span {
        typeName: __typename
        icon: span_icon {
          name
          size
          color {
            ...colorFields
          }
        }
      }
      bulletSpacerSpan: bullet_spacer_span {
        typeName: __typename
        width
      }
      spans: ui_spans {
        ...uiSpansPrimitive
      }
    }
  }

  fragment uiPillOptionFields on UIPillOption {
    id
    key
    label
    isSelected: is_selected
    params {
      id
      value
    }
    trackingId: tracking_id
    contentDescription: content_description
  }

  fragment uiPillFields on UIPill {
    key
    label
    isSelected: is_selected
    iconEnd: icon_end {
      name
      size
      color {
        ...colorFields
      }
    }
    iconStart: icon_start {
      name
      size
      color {
        ...colorFields
      }
    }
    target {
      ...uiTargetFieldsUIPill
    }
    contentDescription: content_description
  }

  fragment uiResponsiveImage on UIResponsiveImage {
    mobile
    desktop
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

  fragment uiSpansPrimitive on UISpan {
    typeName: __typename
    ... on UISpanIcon {
      key
      target {
        ...uiTargetFields
      }
      contentDescription: content_description
      trackingId: tracking_id
      icon: span_icon {
        name
        size
        color {
          ...colorFields
        }
      }
    }
    ... on UISpanSpacer {
      key
      width
    }
    ... on UISpanText {
      key
      color {
        ...colorFields
      }
      text
      isBold: is_bold
      size
    }
    ... on UISpanRewardProgressBar {
      key
      steps
      completed
      rewardsType: rewards_type
    }
  }

  fragment uiStoryCardFields on UIStoryCard {
    preview {
      profile {
        imageUrl: image_url
        headingLines: heading_lines {
          ...uiLines
        }
      }
      video {
        ...videoContentFields
      }
      overlay {
        typeName: __typename
        ... on UIStoryTextOverlay {
          background {
            typeName: __typename
            ...colorFields
            ...colorGradientFields
          }
          uiLines: ui_lines {
            ...uiLines
          }
        }
      }
      target {
        ...uiTargetFields
      }
    }
    main {
      profile {
        imageUrl: image_url
        headingLines: heading_lines {
          ...uiLines
        }
      }
      video {
        sources {
          url
          type
        }
        placeholderImage: placeholder_url
        autoplay
        trackingId: tracking_id
      }
      overlay {
        typeName: __typename
        ... on UIStoryButtonOverlay {
          background {
            typeName: __typename
            ...colorFields
            ...colorGradientFields
          }
          contentLines: content {
            ...uiLines
          }
          button {
            key
            text
            contentDescription: content_description
            target {
              ...uiTargetFields
            }
            type
            trackingId: tracking_id
            trackingProperties: tracking_properties
          }
        }
      }
    }
    trackingId: tracking_id
    trackingProperties: tracking_properties
    key
  }

  fragment uiTallMenuItemCardFields on UITallMenuItemCard {
    adServeId: ad_serve_id
    id: menu_item_id
    title
    key
    image
    imageContent: image_content {
      url
      altText: alt_text
      type
    }
    target {
      ...uiTargetFields
    }
    price {
      ...currencyFields
    }
    discountedPrice: discounted_price {
      ...currencyFields
    }
    trackingId: tracking_id
    trackingProperties: tracking_properties
    isSponsored: is_sponsored
    priceInformationShort: price_information_short {
      ...uiLines
    }
    offerText: offer_text
  }

  fragment uiTextLine on UITextLine {
    typeName: __typename
    key
    align
    maxLines: max_lines
    spans: ui_spans {
      ...uiSpansPrimitive
      ... on UISpanCountdown {
        endsAt: ends_at
        isBold: is_bold
        size
        key
        color {
          ...colorFields
        }
      }
      ... on UISpanTag {
        target {
          typeName: __typename
          ... on UITargetAction {
            action
            layoutId: layout_id
            params {
              id
              value
            }
          }
        }
        key
        spans: ui_spans {
          ...uiSpansPrimitive
        }
        backgroundColor: background_color {
          ...colorFields
        }
      }
      ... on UISpanText {
        isStrikethrough: is_strikethrough
      }
    }
  }

  fragment videoContentFields on VideoContent {
    sources {
      url
      type
    }
    placeholderImage: placeholder_url
    autoplay
    trackingId: tracking_id
  }

  fragment uiRooBlockTemplateFields on UIRooBlockTemplate {
    id
    layout
  }

`;

module.exports = { FULL_TEXT_SEARCH_QUERY };
