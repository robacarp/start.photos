#!/usr/bin/env ruby

require 'net/http'
require 'net/https'
require 'json'
require 'securerandom'

#docs/_data/photos/Unsplash_-1ZDUWmlMYA.json
files = %w|
docs/_data/photos/Unsplash_-vpwPHCCD0c.json
docs/_data/photos/Unsplash_0IijELTGVzM.json
docs/_data/photos/Unsplash_0ex5ixoTnRw.json
docs/_data/photos/Unsplash_1Z2niiBPg5A.json
docs/_data/photos/Unsplash_2L_SRNojmy8.json
docs/_data/photos/Unsplash_5PDtzygACqg.json
docs/_data/photos/Unsplash_70OJg2DBgEY.json
docs/_data/photos/Unsplash_7dpWnjeEEVs.json
docs/_data/photos/Unsplash_7pKG7p7zPwg.json
docs/_data/photos/Unsplash_85Yd2AhfahE.json
docs/_data/photos/Unsplash_8LPgWfHgcMg.json
docs/_data/photos/Unsplash_8Wz-gIYEnHY.json
docs/_data/photos/Unsplash_9Qm9uePH1Tw.json
docs/_data/photos/Unsplash_Af5SVVxBmPg.json
docs/_data/photos/Unsplash_Anosw0HcGRk.json
docs/_data/photos/Unsplash_BTDWln5guLQ.json
docs/_data/photos/Unsplash_BvI2MKKCTZ4.json
docs/_data/photos/Unsplash_D0HULIZ5fyI.json
docs/_data/photos/Unsplash_E_61iNM4uaQ.json
docs/_data/photos/Unsplash_FVOkPmiCzAM.json
docs/_data/photos/Unsplash_LXw-Dg0H4is.json
docs/_data/photos/Unsplash_QnO_iiB96gQ.json
docs/_data/photos/Unsplash_Qz8vpLWQZ6A.json
docs/_data/photos/Unsplash_S-2D55mMwEw.json
docs/_data/photos/Unsplash_Sfs_64L9UHE.json
docs/_data/photos/Unsplash_Ti8NogDRMBs.json
docs/_data/photos/Unsplash_Wkf2R-GK-pc.json
docs/_data/photos/Unsplash_YM-jlUioGRc.json
docs/_data/photos/Unsplash_ZmQh4ojSA-k.json
docs/_data/photos/Unsplash__3nr72fLNAE.json
docs/_data/photos/Unsplash__kej2MGjnfc.json
docs/_data/photos/Unsplash_a1-7u30CJpw.json
docs/_data/photos/Unsplash_aPdUKy65qWE.json
docs/_data/photos/Unsplash_aoM_7W7qONU.json
docs/_data/photos/Unsplash_ar2F6xmKgFI.json
docs/_data/photos/Unsplash_bDb7PMXDFf0.json
docs/_data/photos/Unsplash_bZlV3QZ6zoU.json
docs/_data/photos/Unsplash_dInw9vcxZdA.json
docs/_data/photos/Unsplash_ettvH_ceP7A.json
docs/_data/photos/Unsplash_f3ytCVDbSGU.json
docs/_data/photos/Unsplash_ffeMtxlrBhw.json
docs/_data/photos/Unsplash_iIg4F2IWbTM.json
docs/_data/photos/Unsplash_jIaJM8sTs04.json
docs/_data/photos/Unsplash_k2NEXDyAT8I.json
docs/_data/photos/Unsplash_pRq1ShgABJo.json
docs/_data/photos/Unsplash_uNq5xOLruyo.json
docs/_data/photos/Unsplash_yCUsgRHQ4Dk.json
docs/_data/photos/Unsplash_ybdIakmMPpc.json
docs/_data/photos/Unsplash_zepnJQycr4U.json
|

def unsplash_key
  ENV["UNSPLASH_API_KEY"]
end

def terms_of_service
  "utm_source=a%20photographic%20start&utm_medium=referral"
end

def help message = nil
  puts "\033[30;41m#{message}\033[0m" if message
  exit 1
end

def request image_id
  url = "https://api.unsplash.com/photos/#{image_id}".strip

  if url.index '?'
    url << '&'
  else
    url << '?'
  end

  url << terms_of_service
  uri = URI(url)

  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true
  http.verify_mode = OpenSSL::SSL::VERIFY_PEER
  req =  Net::HTTP::Get.new(uri)
  req.add_field "Accept-Version", "v1"
  req.add_field "Authorization", "Client-ID #{unsplash_key}"

  res = http.request(req)
  parsed = JSON.parse(res.body) rescue false
  unless parsed
    help "could not parse json: #{res.body} \n #{res.each_header.map {|h,v| "#{h}=#{v}" }}"
  end

  if parsed["errors"]
    help parsed
  end

  parsed
end

files.first.tap do |file|
  contents = File.read File.join("..", file)
  parsed = JSON.parse contents
  id = parsed["external_url"].split("/")[-1]
  photo = request id
  pp parsed
  next
  pp photo["description"] if photo["description"]
  puts "-- #{id}"
end
