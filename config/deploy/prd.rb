set :deploy_to, '/home/deployer/ccs'
set :user, 'deployer'
set :pid_file_name, 'ccs.pid'
set :branch, 'prd'
set :url_ping, 'https://ccs-api.citylity.com'
role :app, %w{deployer@185.8.50.175}