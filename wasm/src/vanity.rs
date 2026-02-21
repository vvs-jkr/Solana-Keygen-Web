use wasm_bindgen::prelude::*;
use ed25519_dalek::SigningKey;
use rand::rngs::OsRng;
use serde_json::json;

/// Base58 alphabet used by Solana (Bitcoin variant, no 0/O/I/l).
const BASE58_ALPHABET: &str = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

fn is_valid_base58(s: &str) -> bool {
    s.chars().all(|c| BASE58_ALPHABET.contains(c))
}

/// Validate vanity search input.
/// Returns a JS string with the error message, or `null` if the input is valid.
#[wasm_bindgen]
pub fn validate_vanity_input(prefix: &str, suffix: &str) -> JsValue {
    if prefix.is_empty() && suffix.is_empty() {
        return JsValue::from_str("Укажите префикс или суффикс");
    }

    if !prefix.is_empty() && !is_valid_base58(prefix) {
        return JsValue::from_str(
            "Префикс содержит недопустимые символы. \
             Допустимы только base58: 123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
        );
    }

    if !suffix.is_empty() && !is_valid_base58(suffix) {
        return JsValue::from_str(
            "Суффикс содержит недопустимые символы. \
             Допустимы только base58: 123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
        );
    }

    // Solana addresses are 32–44 chars; leave room for the rest of the address.
    if prefix.len() + suffix.len() > 32 {
        return JsValue::from_str("Суммарная длина префикса и суффикса не должна превышать 32 символа");
    }

    JsValue::NULL // null == valid
}

/// Expected number of random keypairs to check before finding a match.
/// Uses base 58 for case-sensitive search, base 36 as a rough approximation
/// for case-insensitive (many letters have both cases in base58).
#[wasm_bindgen]
pub fn estimate_attempts(prefix_len: u32, suffix_len: u32, case_sensitive: bool) -> f64 {
    let base: f64 = if case_sensitive { 58.0 } else { 34.0 };
    base.powi((prefix_len + suffix_len) as i32)
}

/// Search for a Solana vanity address.
///
/// Generates up to `batch_size` Ed25519 keypairs and checks each address
/// against `prefix` and `suffix`. Returns as soon as a match is found.
///
/// Return value:
/// - `null`  — no match found in this batch (call again to continue)
/// - JSON string `{ found: true, address, publicKey, secretKey }` — match found
///
/// `secretKey` is base58-encoded 64-byte Solana keypair: `seed (32) || pubkey (32)`.
/// This is the format accepted by Phantom, Backpack, and `solana-keygen`.
#[wasm_bindgen]
pub fn find_vanity_batch(
    prefix: &str,
    suffix: &str,
    case_sensitive: bool,
    batch_size: u32,
) -> JsValue {
    // Pre-compute comparison strings once outside the hot loop.
    let prefix_cmp: String = if case_sensitive {
        prefix.to_string()
    } else {
        prefix.to_lowercase()
    };
    let suffix_cmp: String = if case_sensitive {
        suffix.to_string()
    } else {
        suffix.to_lowercase()
    };

    let has_prefix = !prefix_cmp.is_empty();
    let has_suffix = !suffix_cmp.is_empty();

    let mut rng = OsRng;

    for _ in 0..batch_size {
        let signing_key = SigningKey::generate(&mut rng);
        let verifying_key = signing_key.verifying_key();

        // Solana address = base58 of the 32-byte Ed25519 public key.
        let address = bs58::encode(verifying_key.as_bytes()).into_string();

        let address_cmp: String = if case_sensitive {
            address.clone()
        } else {
            address.to_lowercase()
        };

        let matches = (!has_prefix || address_cmp.starts_with(&prefix_cmp))
            && (!has_suffix || address_cmp.ends_with(&suffix_cmp));

        if matches {
            // Build 64-byte Solana keypair: seed (32 bytes) || pubkey (32 bytes).
            let mut keypair_bytes = [0u8; 64];
            keypair_bytes[..32].copy_from_slice(&signing_key.to_bytes());
            keypair_bytes[32..].copy_from_slice(verifying_key.as_bytes());

            let result = json!({
                "found": true,
                "address": address,
                "publicKey": bs58::encode(verifying_key.as_bytes()).into_string(),
                "secretKey": bs58::encode(&keypair_bytes).into_string(),
            });

            return JsValue::from_str(&result.to_string());
        }
    }

    JsValue::NULL
}
