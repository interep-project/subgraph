import { ByteArray, crypto } from "@graphprotocol/graph-ts"

/**
 * Concatenates two byte arrays.
 * @param a First byte array.
 * @param b Second byte array.
 * @returns Final concatenated byte array.
 */
export function concat(a: ByteArray, b: ByteArray): ByteArray {
    const out = new Uint8Array(a.length + b.length)

    for (let i = 0; i < a.length; i += 1) {
        out[i] = a[i]
    }

    for (let j = 0; j < b.length; j += 1) {
        out[a.length + j] = b[j]
    }

    return out as ByteArray
}

/**
 * Creates a Keccak256 hash.
 * @param message Message to hash.
 * @returns Hexadecimal string of the Keccak256 hash.
 */
export function hash(message: ByteArray): string {
    return crypto.keccak256(message).toHexString()
}
