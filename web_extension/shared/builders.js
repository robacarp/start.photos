'use strict';

class Builder {
  static tag(name, text) {
    const tag = document.createElement(name)
    tag.textContent = text
    return tag
  }

  static link(href, text) {
    const link = Builder.tag("a", text)
    link.href = href
    return link
  }

  static option(text, value = null) {
    if (value == null)
      value = text

    const option = Builder.tag("option",text)
    option.value = value
    return option
  }

  static img(image) {
    const tag = document.createElement('img')
    tag.src = image.url
    tag.dataset.imageId = image.id
    return tag
  }
}
