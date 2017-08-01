set :deploy_to, '/home/deployer/ccs'
set :user, 'deployer'
set :pid_file_name, 'ccs.pid'
set :branch, 'uat'
set :url_ping, 'https://ccs-api-uat.citylity.com'
role :app, %w{deployer@185.8.50.64}
