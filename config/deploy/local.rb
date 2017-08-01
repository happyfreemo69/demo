set :deploy_to, '/home/deployer/synty/nodejs'
set :user, 'deployer'
set :pid_file_name, 'synty.pid'
set :branch, 'dev'

role :app, %w{deployer@docker.usr}
server 'docker.usr', user: 'deployer', roles: %w{web}

