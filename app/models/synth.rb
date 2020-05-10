class Synth < ApplicationRecord
  enum vco_signal: [:sine, :square, :sawtooth, :triangle]
end
