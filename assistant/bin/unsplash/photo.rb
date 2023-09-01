require 'securerandom'

module Unsplash
  class Photo
    attr_reader :api_json

    def initialize(api_json)
      @api_json = api_json
    end

    def valid?
      @api_json["errors"].nil?
    end

    def id=(id)
      @id = id
    end

    def id
      api_json["id"]
    end

    def description
      api_json["description"] || "Untitled"
    end

    def venue
      "Unsplash"
    end

    def venue_url
      "https://unsplash.com"
    end

    def external_url
      api_json.dig("links","html")
    end

    def render_json
      data = {
        id: id,
        url: api_json.dig("urls", "regular"),
        external_url: external_url,
        content_text: description,
        _meta: {
          venue: {
            name: venue,
            url: venue_url,
          },
          camera: {
            iso: api_json.dig("exif","iso"),
            shutter_speed: api_json.dig("exif","exposure_time"),
            aperture: api_json.dig("exif","aperture"),
            make: api_json.dig("exif","make"),
            model: api_json.dig("exif","model")
          }
        },

        author: {
          name: api_json.dig("user","username"),
          url: api_json.dig("user","links","html"),
          avatar: api_json.dig("user","profile_image","small")
        },

        tags: api_json["categories"]
      }

      JSON.pretty_generate data
    end
  end
end
