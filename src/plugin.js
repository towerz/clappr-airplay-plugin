import {Events, Log, UICorePlugin} from 'Clappr'

export default class AirPlayPlugin extends UICorePlugin {
  static get version() { return VERSION }
  get name() { return 'air_play' }

  get airPlaySupported() { return window.WebKitPlaybackTargetAvailabilityEvent && this._playback && this._playback.name === 'html5_video' }

  get tagName() { return 'button' }

  get events() {
    return {
      click: this.clicked
    }
  }

  constructor(...args) {
    super(...args)
    this.render()
  }

  bindEvents() {
    this.listenTo(this.core, Events.CORE_CONTAINERS_CREATED, this.containersCreated)
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_RENDERED, this.attachButton)
  }

  containersCreated() {
    var container = this.core.getCurrentContainer()
    if (container != this._container) {
      if (this._container) {
        removeAvailabilityListener()
      }
      this._container = container
      this._playback = container.playback
      this.addAvailabilityListener()
    }
  }

  removeAvailabilityListener() {
    this._playback.el.removeEventListener('webkitplaybacktargetavailabilitychanged', this._availabilityListener)
  }

  addAvailabilityListener() {
    if (!this._availabilityListener) {
      this._availabilityListener = (event) => {
        Log.debug(this.name, 'availability:', event.availability)
        switch (event.availability) {
          case "available": this.$el.show(); break;
          case "not-available": this.$el.hide(); break;
        }
      }
    }
    this.$el.hide()
    if (this.airPlaySupported) {
      this._playback.el.addEventListener('webkitplaybacktargetavailabilitychanged', this._availabilityListener)
      this._playback.el["x-webkit-airplay"]="allow"
    }
  }

  clicked() {
    if (this.airPlaySupported) {
      this._playback.el.webkitShowPlaybackTargetPicker()
    }
  }

  attachButton() {
    var fullscreenButton = this.core.mediaControl.$fullscreenToggle
    if (fullscreenButton.length) {
      this.$el.insertAfter(fullscreenButton)
    } else {
      this.core.mediaControl.$('media-control-right-panel').prepend(this.el)
    }
  }

  render() {
    this.$el.html('ICON')
    this.airPlaySupported || this.$el.hide()
    this.attachButton()
  }
}
