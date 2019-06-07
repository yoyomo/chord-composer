namespace :start do
  desc 'Start dev server'
  task :development do
    exec 'bundle exec foreman start -f Procfile.dev'
  end

  desc 'Start production server'
  task :production do
    exec 'NPM_CONFIG_PRODUCTION=true npm run postinstall && bundle exec foreman start'
  end
end
task :start => 'start:development'