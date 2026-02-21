/* tslint:disable */
/* eslint-disable */
export function parse_csv_enhanced(csv_content: string, delimiter?: string | null): any;
export function compare_objects_detailed(obj1: any, obj2: any): any;
export function get_memory_usage(): any;
/**
 * Validate vanity search input.
 * Returns a JS string with the error message, or `null` if the input is valid.
 */
export function validate_vanity_input(prefix: string, suffix: string): any;
/**
 * Expected number of random keypairs to check before finding a match.
 * Uses base 58 for case-sensitive search, base 36 as a rough approximation
 * for case-insensitive (many letters have both cases in base58).
 */
export function estimate_attempts(prefix_len: number, suffix_len: number, case_sensitive: boolean): number;
/**
 * Search for a Solana vanity address.
 *
 * Generates up to `batch_size` Ed25519 keypairs and checks each address
 * against `prefix` and `suffix`. Returns as soon as a match is found.
 *
 * Return value:
 * - `null`  — no match found in this batch (call again to continue)
 * - JSON string `{ found: true, address, publicKey, secretKey }` — match found
 *
 * `secretKey` is base58-encoded 64-byte Solana keypair: `seed (32) || pubkey (32)`.
 * This is the format accepted by Phantom, Backpack, and `solana-keygen`.
 */
export function find_vanity_batch(prefix: string, suffix: string, case_sensitive: boolean, batch_size: number): any;
export function init(): void;
export function health_check(): string;
export function get_version(): string;
export function get_features(): any;
export function deep_equal(a: any, b: any): boolean;
export function sort_by_key(data_val: any, key: string): any;
export function parse_csv(csv_data: string): any;
export class PerformanceTimer {
  free(): void;
  constructor(name: string);
  elapsed_ms(): number;
  finish(): string;
}
export class WasmResult {
  free(): void;
  constructor(success: boolean, data: any, error?: string | null);
  readonly success: boolean;
  readonly data: any;
  readonly error: string | undefined;
}
