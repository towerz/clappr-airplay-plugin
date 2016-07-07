import {Events, UICorePlugin} from 'Clappr'

export default class AirPlayPlugin extends UICorePlugin {
  static get version() { return VERSION }
  get name() { return 'air_play' }

  get tagName() { return 'button' }

  get events() {
    return {
      click: this.clicked
    }
  }

  bindEvents() {
    this.listenTo(this.core, Events.CORE_CONTAINERS_CREATED, this.containersCreated)
  }

  containersCreated() {
    var container = this.core.getCurrentContainer()
    if (container != this._container) {
      if (this._container) {
        removeAvailabilityListener()
      }
      this._container = container
      this._playback = container.playback
      addAvailabilityListener()
    }
  }

  removeAvailabilityListener() {
    this._playback.el.removeEventListener('webkitplaybacktargetavailabilitychanged', this._availabilityListener)
  }

  addAvailabilityListener() {
    if (!this._availabilityListener) {
      this._availabilityListener = (event) => {
        switch (event.availability) {
          case "available": this.$el.show(); break;
          case "not-available": this.$el.hide(); break;
        }
      }
    }
    if (window.WebKitPlaybackTargetAvailabilityEvent && this._playback.name === 'html5_video') {
      this._playback.el.addEventListener('webkitplaybacktargetavailabilitychanged', this._availabilityListener)
      this._playback.el["x-webkit-airplay"]="allow"
    }
  }

  clicked() {
    this._playback.el.webkitShowPlaybackTargetPicker()
  }

  render() {
    this.$el.html('TESTE')
  }
}
