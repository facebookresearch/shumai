from urllib import request, parse
import numpy as np

def encodeBinary(array):
    ndim = array.ndim
    metadata = np.array([ndim, 0, 0], dtype=np.int64)
    shape = np.array(array.shape, dtype=np.int64)
    contents = array.astype(np.float32)
    data = metadata.tobytes() + shape.tobytes() + contents.tobytes()
    return data

def decodeBinary(data):
    metadata = np.frombuffer(data[:8*3], dtype=np.int64)
    ndim = metadata[0]
    shape = np.frombuffer(data[8*3:8*(3+ndim)], dtype=np.int64)
    array = np.frombuffer(data[8*(3+ndim):], dtype=np.float32).reshape(shape)
    return array

def encodeReadable(array):
    return np.array2string(array, separator=',', max_line_width=np.inf, threshold=np.inf).replace('\n', '')

def decodeReadable(data):
    return np.array(eval(data))

def call(url, x):
    data = encodeBinary(x)
    req =  request.Request(url + '/forward', method='POST', data=data)
    resp = request.urlopen(req)
    resp_data = resp.read()
    return decodeBinary(resp_data)

