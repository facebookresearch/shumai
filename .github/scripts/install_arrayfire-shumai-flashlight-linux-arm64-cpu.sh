sudo apt remove libarrayfire-dev libarrayfire-cpu3 libarrayfire-cpu-dev
sudo apt install -y libblas-dev liblapack-dev liblapacke-dev libfftw3-dev libboost-all-dev cmake make g++
cd /tmp
sudo rm -rf arrayfire
git clone https://github.com/arrayfire/arrayfire.git
cd arrayfire
cmake -Bbuild -DAF_BUILD_EXAMPLES=OFF -DCMAKE_BUILD_TYPE=Release -DAF_BUILD_UNIFIED=OFF -DAF_TEST_WITH_MTX_FILES=OFF -DBUILD_TESTING=OFF
make -j4 -Cbuild
sudo make install -Cbuild
