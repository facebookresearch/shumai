all:
	g++ src/cpp/flashlight_binding.cc  -I${HOME}/usr/include -I${HOME}/usr/include/cereal -L${HOME}/usr/lib -lflashlight -lafcuda -L/public/apps/cuda/11.4/lib64 -L/public/apps/cudnn/v8.4.1.50-cuda.11.6/cuda/lib64 -lcuda -lcudart -lcudnn -std=c++17 -O3 -g --shared -fPIC -o libflashlight_binding.so
