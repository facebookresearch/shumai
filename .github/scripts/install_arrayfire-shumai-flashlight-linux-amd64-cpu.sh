sudo apt install -y gnupg2 ca-certificates
sudo apt-key adv --fetch-key https://repo.arrayfire.com/GPG-PUB-KEY-ARRAYFIRE-2020.PUB
echo "deb https://repo.arrayfire.com/debian all main" | sudo tee /etc/apt/sources.list.d/arrayfire.list
sudo apt update
sudo apt install -y arrayfire-cpu3-dev arrayfire-cpu3-openblas

