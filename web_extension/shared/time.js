function convert_to_full_month(month) {
  switch (month) {
    case 0: return "January"
    case 1: return "February"
    case 2: return "March"
    case 3: return "April"
    case 4: return "May"
    case 5: return "June"
    case 6: return "July"
    case 7: return "August"
    case 8: return "September"
    case 9: return "October"
    case 10: return "November"
    case 11: return "December"
  }
}

function terse_date(now, sep = "-") {
  date = ""

  year = now.getFullYear()
  date += year
  date += sep

  month = now.getMonth()
  month += 1
  if (month < 10) month = "0" + month
  date += month
  date += sep

  day = now.getDate()
  if (day < 10) day = "0" + day
  date += day

  return date
}

function verbose_date(now) {
  date = ""
  date += convert_to_full_month(now.getMonth())
  date += " "

  day = now.getDate()
  date += day
  date += ", "

  year = now.getFullYear()
  date += year
  return date
}
