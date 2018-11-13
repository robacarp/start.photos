#!/usr/bin/env ruby
require 'json'
require 'fileutils'

folder = '/Users/robert/Documents/repositories/robacarp/photographic_start/docs/_data/photos'
Dir.children(folder).each do |file|
  next unless file =~ %r|^[a-z0-9-]+.json$|

  puts "reading #{file}"

  parsed = JSON.parse File.read(File.join folder, file) rescue false
  unless parsed
    puts "could not parse #{file}"
    next
  end

  venue = parsed["_meta"]["venue"]["name"]
  parsed["external_url"] =~ %r|^https://500px.com/photo/(\d+)/|
  image_id = $1

  puts "Venue: #{venue}"
  puts "Image id: #{image_id}"

  new_filename = "#{venue}_#{image_id}.json"

  already_present = File.exist?(File.join folder, new_filename)

  if already_present
    puts "destination file #{new_filename} already exists, skipping"
    next
  end

  FileUtils.mv File.join(folder, file), File.join(folder, new_filename)

  puts "New image #{new_filename} written.\n\n"
end
