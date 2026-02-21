// Jest mock for @wasm/wasm_lib.js — avoids loading actual WASM binary in tests
const init = jest.fn().mockResolvedValue({})

module.exports = {
  default: init,
  parse_csv: jest.fn().mockReturnValue([]),
  deep_equal: jest.fn().mockReturnValue(true),
  sort_by_key: jest.fn().mockReturnValue([]),
  find_vanity_batch: jest.fn().mockReturnValue(null),
  validate_vanity_input: jest.fn().mockReturnValue(null),
  estimate_attempts: jest.fn().mockReturnValue(0),
  health_check: jest.fn().mockReturnValue('ok'),
  get_version: jest.fn().mockReturnValue('0.0.0'),
}
