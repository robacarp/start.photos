#!/usr/bin/env ruby

require "fileutils"

require_relative "unsplash/api"
require_relative "unsplash/photo"

#docs/_data/photos/Unsplash_-1ZDUWmlMYA.json
files = Dir["../docs/_data/photos/*.json"]

files.each do |metadata_file|
  contents = File.read metadata_file
  metadata = JSON.parse contents
  id = metadata["external_url"].split("/")[-1]

  unsplash_photo = Unsplash::API.fetch_image id
  unsplash_photo.id = metadata["id"]

  unless unsplash_photo.valid?
    FileUtils.rm metadata_file
    next
  end

  if metadata["content_text"] == "Untitiled"
    File.open(metadata_file, "w") do |f|
      f.puts unsplash_photo.render_json
    end
    puts ":"
  else
    puts "."
  end

  STDOUT.flush
end
