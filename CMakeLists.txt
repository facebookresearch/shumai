cmake_minimum_required(VERSION 3.10)

project(shumai LANGUAGES CXX C)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(flashlight CONFIG REQUIRED)

# Flashlight <> JS bindings
add_library(
  flashlight_binding
  SHARED
  shumai/cpp/flashlight_binding.cc
  )

# Embedded Python
add_library(
  python_embed 
  SHARED
  shumai/cpp/python/pyinterpreter.cpp
  shumai/cpp/python/addon.cpp
  )

find_package (Python3 COMPONENTS Interpreter Development)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -undefined dynamic_lookup") 
target_link_libraries(
  python_embed
  PRIVATE
  ${Python3_LIBRARIES}
)
set_target_properties(
  python_embed 
  PROPERTIES 
  LIBRARY_OUTPUT_DIRECTORY ${PROJECT_SOURCE_DIR}
  SUFFIX ".node"
)

target_include_directories(
   flashlight_binding 
  PRIVATE
  ${Python3_INCLUDE_DIRS}
  ./node_modules/node-api-headers/include
)

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
