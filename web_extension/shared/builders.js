function tag(name, text) {
  const tag = document.createElement(name)
  tag.textContent = text
  return tag
}

function link(href, text) {
  const link = tag("a", text)
  link.href = href
  return link
}

function option(text, value = null) {
  if (value == null)
    value = text
  const option = tag("option",text)
  option.value = value
  return option
}
