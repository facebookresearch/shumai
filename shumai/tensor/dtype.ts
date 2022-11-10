import { dtype } from './tensor'

export function stringToType(str: string) {
  switch (str.trim()) {
    case 'Float16':
      return dtype.Float16
    case 'Float32':
      return dtype.Float32
    case 'Float64':
      return dtype.Float64
    case 'BoolInt8':
      return dtype.BoolInt8
    case 'Int16':
      return dtype.Int16
    case 'Int32':
      return dtype.Int32
    case 'Int64':
      return dtype.Int64
    case 'BigInt64':
      return dtype.BigInt64
    case 'Uint8':
      return dtype.Uint8
    case 'Uint16':
      return dtype.Uint16
    case 'Uint32':
      return dtype.Uint32
    case 'Uint64':
      return dtype.Uint64
    case 'BigUint64':
      return dtype.BigUint64
  }
  return dtype.Float32
}

export function typeToString(dt) {
  switch (dt) {
    case dtype.Float16:
      return 'Float16'
    case dtype.Float32:
      return 'Float32'
    case dtype.Float64:
      return 'Float64'
    case dtype.BoolInt8:
      return 'BoolInt8'
    case dtype.Int16:
      return 'Int16'
    case dtype.Int32:
      return 'Int32'
    case dtype.Int64:
      return 'Int64'
    case dtype.BigInt64:
      return 'BigInt64'
    case dtype.Uint8:
      return 'Uint8'
    case dtype.Uint16:
      return 'Uint16'
    case dtype.Uint32:
      return 'Uint32'
    case dtype.Uint64:
      return 'Uint64'
    case dtype.BigUint64:
      return 'BigUint64'
  }
  return 'Float32'
}
