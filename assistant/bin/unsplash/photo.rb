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
      @id ||= SecureRandom.uuid
    end

    def description
      api_json["description"] || "Untitled"
    end

    def render_json
      data = {
        id: id,
        url: api_json["urls"]["regular"],
        external_url: api_json["links"]["html"],
        content_text: description,
        _meta: {
          venue: {
            name: "Unsplash",
            url: "https://unsplash.com",
          },
          camera: {
            iso: api_json["exif"]["iso"],
            shutter_speed: api_json["exif"]["exposure_time"],
            aperture: api_json["exif"]["aperture"],
            make: api_json["exif"]["make"],
            model: api_json["exif"]["model"]
          }
        },

        author: {
          name: api_json["user"]["username"],
          url: api_json["user"]["links"]["html"],
          avatar: api_json["user"]["profile_image"]["small"]
        },

        tags: api_json["categories"]
      }

      JSON.pretty_generate data
    end
  end
end
