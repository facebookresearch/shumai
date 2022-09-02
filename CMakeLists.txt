cmake_minimum_required(VERSION 3.10)

project(shumai LANGUAGES CXX C)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(flashlight CONFIG REQUIRED)

# Flashlight <> JS bindings
add_library(
  flashlight_binding
  SHARED
  src/cpp/flashlight_binding.cc
  )

# Flashlight <> JS finalizer bindings
add_library(flashlight_finalizer_binding SHARED src/cpp/finalizer.cc)
target_include_directories(flashlight_finalizer_binding PRIVATE src/cpp/napi/)
target_link_libraries(
  flashlight_finalizer_binding
  PRIVATE
  flashlight::flashlight
)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -undefined dynamic_lookup") 

# Write lib to the project root
set_target_properties(
  flashlight_binding
  PROPERTIES
  LIBRARY_OUTPUT_DIRECTORY ${PROJECT_SOURCE_DIR}
)

target_link_libraries(
  flashlight_binding
  PRIVATE
  flashlight::flashlight
)
