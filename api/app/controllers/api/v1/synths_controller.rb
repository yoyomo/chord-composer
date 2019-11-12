class Api::V1::SynthsController < APIController
  before_action :set_synth, only: [:show, :update, :destroy]

  # GET /synths
  def index
    @synths = Synth.all

    render json: { data: @synths}
  end

  # GET /synths/1
  def show
    render json: { data: @synth }
  end

  # POST /synths
  def create
    @synth = Synth.new(synth_params)

    if @synth.save
      render json: { data: @synth}, status: :created
    else
      render json: { errors:  [{type: "create_synth", message: @synth.errors.messages.to_s}]}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /synths/1
  def update
    if @synth.update(synth_params)
      render json: { data: @synth }
    else
      render json: {errors: [{type: "update_synth", message: @synth.errors.messages.to_s}]}, status: :unprocessable_entity
    end
  end

  # DELETE /synths/1
  def destroy
    @synth.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_synth
      @synth = Synth.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def synth_params
      params.require(:synth).permit(:base_frequency, :base_octave, :vco_signal, :sound_on, :user_id)
    end
end
