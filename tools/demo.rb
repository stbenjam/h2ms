#!/usr/bin/env ruby
# Seed demo data to H2MS
# Creates specified users, if they don't already exist, and then seeds a bunch
# of events to make interesting data to look at.
#
# Example usage, seed 1,000 events:
#   ./demo.rb -s https://test.h2ms.org/ -u 'admin@h2ms.org' -p 'password' -e 1000
#

require 'json'
require 'net/http'
require 'optparse'
require 'time'
require 'uri'

OAUTH_ID = 'h2ms'.freeze
OAUTH_SECRET = 'secret'.freeze

@locations = [
  {name: 'Massachusetts General Hospital', address: '55 Fruit St, Boston, MA', zip: '02114', type: 'Hospital' },
  {name: 'MGH Emergency Room', address: '55 Fruit St, Boston, MA', zip: '02114', type: 'ER', parent: 'Massachusetts General Hospital' },
  {name: 'MGH Intensive Care Unit', address: '55 Fruit St, Boston, MA', zip: '02114', type: 'ICU', parent: 'Massachusetts General Hospital'},

  {name: 'Sturdy Memorial Hospital', address: '211 Park St, Attleboor, MA', zip: '02703', type: 'Hospital' },
  {name: 'Sturdy Emergency Room', address: '211 Park St, Attleboor, MA', zip: '02703', type: 'ER', parent: 'Sturdy Memorial Hospital' },
  {name: 'Sturdy Intensive Care Unit', address: '211 Park St, Attleboor, MA', zip: '02703', type: 'ICU', parent: 'Sturdy Memorial Hospital' },
]

@users = [
  { firstName: 'Ben', lastName: 'Jenkins', email: 'bjenkins@h2ms.org', roles: 'ROLE_OBSERVER', password: 'password', type: 'Infection Prevention Nurse' },
  { firstName: 'Wes', lastName: 'Skillern', email: 'wskillern@h2ms.org', roles: 'ROLE_USER', password: 'password', type: 'ER Doctor' }
]

@options = {}

ARGV << '-h' if ARGV.empty?

REQUIRED = [:server, :user, :password, :events].freeze

OptionParser.new do |opts|
  opts.banner = 'Usage: {$PROGRAM_NAME} [@options]'

  opts.on('-s', '--server [URL]', 'URL for API') do |o|
    begin
      @options[:server] = URI.parse(o)
    rescue
      puts 'Invalid URL.'
      exit 1
    end
  end

  opts.on('-u', '--username [USERNAME]', 'Username to login') do |o|
    @options[:user] = o
  end

  opts.on('-p', '--password [PASSWORD]', 'Password') do |o|
    @options[:password] = o
  end

  opts.on('-v', '--verbose', 'Verbose') do |o|
    @options[:verbose] = o
  end

  opts.on('-e', '--events [COUNT]', 'Number of events to create') do |o|
    @options[:events] = o.to_i
  end
end.parse!

missing = []
REQUIRED.each { |r| missing << r if @options[r].nil? }
unless missing.empty?
  puts "Missing required @options: #{missing.join(', ')}"
  exit 1
end

VERBOSE = !!@options[:verbose]

# HTTP HELPERS

def connection
  con = Net::HTTP.new(@options[:server].host, @options[:server].port)
  con.use_ssl = (@options[:server].scheme == 'https')
  con
end

def post(path, hash = {})
  req = Net::HTTP::Post.new(path, 'Content-Type' => 'application/json', 'Authorization' => "Bearer #{token}")
  req.body = hash.to_json
  res = connection.start { |http| http.request(req) }
  JSON.parse(res.body)
end

def get(path, params = {})
  req = Net::HTTP::Get.new(path, 'Accept' => 'application/json', 'Authorization' => "Bearer #{token}")
  req.set_form_data(params)
  req.body = hash.to_json
  res = connection.start { |http| http.request(req) }
  JSON.parse(res.body)
end

# AUTHENTICATION

def get_token
  req = Net::HTTP::Post.new('/api/oauth/token')
  req.set_form_data(grant_type: 'password', username: @options[:user], password: @options[:password])
  req.basic_auth OAUTH_ID, OAUTH_SECRET

  res = connection.start { |http| http.request(req) }
  JSON.parse(res.body)['access_token']
end

def token
  @token ||= get_token
end

def role(name)
  @roles ||= get('/api/roles')['_embedded']['roles']
  @roles.find { |r| r['name'] == name }['_links']['self']['href']
end

def observer
  @users.shuffle.find { |u| u[:roles].include?(role('ROLE_OBSERVER')) }[:url]
end

def subject
  @users.shuffle.find { |u| u[:roles].include?(role('ROLE_USER')) }[:url]
end

def timestamp
  now = Time.now
  year_ago = now - 60 * 60 * 24 * 365
  Time.at(rand(year_ago..now)).iso8601(3)
end

def create_or_find_user(user)
  all_users = get('/api/users')['_embedded']['users']
  existing = all_users.find { |u| u['email'] == user[:email] }

  response = if existing
               existing
             else
               post('/api/users', user)
             end

  user[:url] = response['_links']['self']['href']
  response
end

def find_location(name)
  all_locs = get('/api/locations')['_embedded']['locations']
  existing = all_locs.find { |l| l['name'] == name }
  existing
end

def create_location(location)
  existing = find_location(location[:name])

  response = if existing
               existing
             else
               post('/api/locations', location)
             end

  response['_links']['self']['href']
end

def answer(question)
  answer = { question: question['_links']['self']['href'] }

  case question['answerType']
  when 'options'
    answer['value'] = question['options'].sample
  when 'boolean'
    answer['value'] = %w(true false).sample
  end

  answer
end

def create_events(count)
  template = get('/api/eventTemplates')['_embedded']['eventTemplates'].first['_links']
  template_url = URI.parse(template['self']['href'])
  questions = get(URI.parse(template['questions']['href']).path)['_embedded']['questions']

  count.times do |i|
    puts "Creating event #{i}"
    answers = []
    questions.each do |question|
      answers << answer(question)
    end

    event = { eventTemplate: template_url.to_s, location: @locations.sample[:name], observer: observer, subject: subject, answers: answers, timestamp: timestamp }
    response = post('/api/events', event)
    puts response if VERBOSE
  end
end

# Create users
@users.each do |user|
  # Convert role to URL
  user[:roles] = [role(user[:roles])]
  response = create_or_find_user(user)
  puts response if VERBOSE
end

# Create locations
@locations.each do |location|
  puts "Creating #{location[:name]}"
  location[:parent] = find_location(location[:parent])['_links']['self']['href'] if location[:parent]
  create_location(location)
end

# Create a number of events
create_events(@options[:events])
