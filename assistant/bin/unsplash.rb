#!/usr/bin/env ruby

require 'net/http'
require 'net/https'
require 'json'
require 'securerandom'

def help message = nil
  puts message if message
  exit 1
end

image_id = `pbpaste`.delete_prefix('"').delete_suffix('"')
puts image_id

uri = URI("https://api.unsplash.com/photos/#{image_id}")
puts uri
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true
http.verify_mode = OpenSSL::SSL::VERIFY_PEER

unsplash_key = ""

req =  Net::HTTP::Get.new(uri)
req.add_field "Accept-Version", "v1"
req.add_field "Authorization", "Client-ID #{unsplash_key}"
res = http.request(req)
parsed = JSON.parse(res.body) rescue false
help "could not parse json clipboard" unless parsed

if parsed["errors"]
  help parsed
end

feed_data = {
  id: SecureRandom.uuid,
  url: parsed["urls"]["regular"],
  external_url: parsed["links"]["html"],
  content_text: (parsed["description"] || "Untitiled"),
  _meta: {
    venue: {
      name: "Unsplash",
      url: "https://unsplash.com",
    },
    camera: {
      iso: parsed["exif"]["iso"],
      shutter_speed: parsed["exif"]["exposure_time"],
      aperture: parsed["exif"]["aperture"],
      make: parsed["exif"]["make"],
      model: parsed["exif"]["model"]
    }
  },

  author: {
    name: parsed["user"]["username"],
    url: parsed["user"]["links"]["html"],
    avatar: parsed["user"]["profile_image"]["small"]
  },

  tags: parsed["categories"]
}

venue = feed_data[:_meta][:venue][:name]
feed_data[:external_url] =~ %r|^https://unsplash.com/photos/([^/?]+)|
image_id = $1

puts "Venue: #{venue}"
puts "Image id: #{image_id}"

output_directory = '/Users/robert/Documents/repositories/robacarp/photographic_start/docs/_data/photos'
new_filename = "#{venue}_#{image_id}.json"
output_file = "#{output_directory}/#{new_filename}"
puts "writing to #{output_file}"
File.open(output_file, "w+") do |f|
  f.puts JSON.pretty_generate(feed_data)
end

