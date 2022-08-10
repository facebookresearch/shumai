cmake_minimum_required(VERSION 3.15...3.22)
project(pt_vs_js LANGUAGES CXX C)
add_library(
  js_binding
  SHARED
  ${CMAKE_CURRENT_SOURCE_DIR}/js_binding.cc
  )


find_package(Python COMPONENTS Interpreter Development.Module REQUIRED)

add_subdirectory(nanobind)
nanobind_add_module(py_binding py_binding.cc)

set_target_properties(
  js_binding 
  PROPERTIES
  LIBRARY_OUTPUT_DIRECTORY ${PROJECT_SOURCE_DIR}
)
set_target_properties(
  py_binding 
  PROPERTIES
  LIBRARY_OUTPUT_DIRECTORY ${PROJECT_SOURCE_DIR}
)
