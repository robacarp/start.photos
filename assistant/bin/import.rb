#!/usr/bin/env ruby

def help message = nil
  puts message if message
  exit 1
end

clipboard = `pbpaste`
require 'json'
parsed = JSON.parse(clipboard) rescue false
help "could not parse json clipboard" unless parsed

id = parsed["id"]
output_directory = '/Users/robert/Documents/repositories/robacarp/photographic_start/docs/_data/photos'
output_file = "#{output_directory}/#{id}.json"
puts "writing to #{output_file}"
File.open(output_file, "w+") do |f|
  f.puts clipboard
end

