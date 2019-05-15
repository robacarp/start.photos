#!/usr/bin/env ruby

require_relative "unsplash/api"

def help message = nil
  puts "\033[30;41m#{message}\033[0m" if message
  exit 1
end

image_id = `pbpaste`.delete_prefix('"').delete_suffix('"')
photo = Unsplash::API.fetch_image image_id
feed_data = photo.render_json

photo.external_url =~ %r|^https://unsplash.com/photos/([^/?]+)|
image_id = $1

puts "Venue: #{photo.venue}"
puts "Image id: #{image_id}"

output_directory = '../docs/_data/photos'
new_filename = "#{photo.venue}_#{image_id}.json"
output_file = "#{output_directory}/#{new_filename}"
puts "writing to #{output_file}"

File.open(output_file, "w+") do |f|
  f.puts photo.render_json
end

