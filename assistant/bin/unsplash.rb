#!/usr/bin/env ruby

require_relative "unsplash/api"

def process_photo(image_id)
  photo = Unsplash::API.fetch_image image_id
  feed_data = photo.render_json

  photo.external_url =~ %r|^https://unsplash.com/photos/([^/?]+)|
  image_id = $1

  puts "Venue: #{photo.venue}"
  puts "Image id: #{image_id}"

  output_directory = '../docs/_data/photos'
  new_filename = "#{photo.venue}_#{image_id}.json"
  output_file = "#{output_directory}/#{new_filename}"
  puts "Writing to #{output_file}"

  File.open(output_file, "w+") do |f|
    f.puts photo.render_json
  end
  puts "---------------------"
end

previously_seen_ids = []

loop do
  image_id = `pbpaste`.delete_prefix('"').delete_suffix('"')

  unless previously_seen_ids.index image_id
    previously_seen_ids << image_id

    Thread.new do
      process_photo image_id
    end
  end

  sleep 1
end
