export interface SynthResource {
  base_frequency: number
  base_octave: number
  vco_signal: OscillatorType
  sound_on: boolean
  cutoff_frequency: number

  id: number | void
  user_id: number | void

}