export default function isEqual(value, other) {
    // Check for simple data types and null/undefined
    if (value === other) return true;
  
    if (value === null || value === undefined || other === null || other === undefined) {
      return false;
    }
  
    // Check if data types are different
    if (typeof value !== typeof other) return false;
  
    // Check for arrays
    if (Array.isArray(value)) {
      if (!Array.isArray(other)) return false;
      if (value.length !== other.length) return false;
  
      for (let i = 0; i < value.length; i++) {
        if (!isEqual(value[i], other[i])) return false;
      }
  
      return true;
    }
  
    // Check for objects
    if (typeof value === 'object') {
      const keys1 = Object.keys(value);
      const keys2 = Object.keys(other);
  
      if (keys1.length !== keys2.length) return false;
  
      for (const key of keys1) {
        if (!isEqual(value[key], other[key])) return false;
      }
  
      return true;
    }
  
    // Check for other data types (number, string, boolean)
    return value === other;
  }
  