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

venue = parsed["_meta"]["venue"]["name"]
parsed["external_url"] =~ %r|^https://500px.com/photo/(\d+)/|
image_id = $1

puts "Venue: #{venue}"
puts "Image id: #{image_id}"

new_filename = "#{venue}_#{image_id}.json"
output_file = "#{output_directory}/#{new_filename}"
puts "writing to #{output_file}"
File.open(output_file, "w+") do |f|
  f.puts clipboard
end

