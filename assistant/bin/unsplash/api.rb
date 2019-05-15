require 'net/http'
require 'net/https'
require 'json'

require_relative "photo"

module Unsplash
  class API
    def unsplash_key
      ENV["UNSPLASH_API_KEY"]
    end

    def terms_of_service
      "utm_source=a%20photographic%20start&utm_medium=referral"
    end

    def base_uri
      "https://api.unsplash.com"
    end

    def request(resource)
      url = File.join base_uri, resource
      url.strip!

      if url.index '?'
        url << '&'
      else
        url << '?'
      end

      url << terms_of_service
      uri = URI(url)

      http = Net::HTTP.new uri.host, uri.port
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_PEER
      req = Net::HTTP::Get.new uri
      req.add_field "Accept-Version", "v1"
      req.add_field "Authorization", "Client-ID #{unsplash_key}"

      res = http.request req
      JSON.parse res.body
    end

    def self.fetch_image(id)
      Photo.new(new.request "photos/#{id}")
    end
  end
end
