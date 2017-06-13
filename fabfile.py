from fabric.api import run, env, sudo, cd, prefix, shell_env

env.hosts = ['138.68.0.180']
env.user = 'sososeng'

DIR = '/home/sososeng/Thirst_Keeper'

def start ():
  with cd(DIR):
    with shell_env(PATH='/home/sososeng/.nvm/versions/node/v6.10.3/bin:$PATH'):
      run('pm2 start server.js > start.log')

def stop ():
  run('pm2 stop all > stop.log')

def deploy ():
  with cd(DIR):
    run('git pull')

    run('npm install  > install.log')

    run('pm2 restart all > restart.log')

def hello ():
  print("Hello")
