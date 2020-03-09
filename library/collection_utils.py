def list_to_dict(data_in, key, value):
    data_out = {}
    for entry in data_in:
        data_out[entry[key]] = entry[value]
    return data_out

def dict_invert(data_in):
    data_out = {}
    for key in data_in.keys():
        data_out[data_in[key]] = key
    return data_out