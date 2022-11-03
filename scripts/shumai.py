from urllib import request, parse
import numpy as np

def encode(array):
    ndim = array.ndim
    metadata = np.array([ndim, 0, 0], dtype=np.int64)
    shape = np.array(array.shape, dtype=np.int64)
    contents = array.astype(np.float32)
    data = metadata.tobytes() + shape.tobytes() + contents.tobytes()
    return data

def decode(data):
    metadata = np.frombuffer(data[:8*3], dtype=np.int64)
    ndim = metadata[0]
    shape = np.frombuffer(data[8*3:8*(3+ndim)], dtype=np.int64)
    array = np.frombuffer(data[8*(3+ndim):], dtype=np.float32).reshape(shape)
    return array

def call(url, x):
    data = encode(x)
    req =  request.Request(url + '/forward', method='POST', data=data)
    resp = request.urlopen(req)
    resp_data = resp.read()
    return decode(resp_data)

