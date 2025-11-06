package com.universal.player

import android.content.Context
import androidx.annotation.NonNull
import io.flutter.embedding.engine.plugins.FlutterPlugin
import io.flutter.plugin.common.EventChannel
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel

class UniversalPlayerPlugin: FlutterPlugin, MethodChannel.MethodCallHandler {
  private lateinit var methodChannel: MethodChannel
  private lateinit var stateChannel: EventChannel
  private lateinit var positionChannel: EventChannel

  private var player: ExoBackend? = null

  override fun onAttachedToEngine(@NonNull binding: FlutterPlugin.FlutterPluginBinding) {
    methodChannel = MethodChannel(binding.binaryMessenger, "universal_player/methods")
    methodChannel.setMethodCallHandler(this)

    stateChannel = EventChannel(binding.binaryMessenger, "universal_player/state")
    positionChannel = EventChannel(binding.binaryMessenger, "universal_player/position")

    val context = binding.applicationContext
    player = ExoBackend(context)
    stateChannel.setStreamHandler(player!!.stateStreamHandler)
    positionChannel.setStreamHandler(player!!.positionStreamHandler)
  }

  override fun onMethodCall(@NonNull call: MethodCall, @NonNull result: MethodChannel.Result) {
    when (call.method) {
      "initialize" -> { player?.initialize(call.arguments); result.success(null) }
      "play" -> { player?.play(); result.success(null) }
      "pause" -> { player?.pause(); result.success(null) }
      "stop" -> { player?.stop(); result.success(null) }
      "seek" -> { val ms = call.arguments as Int; player?.seek(ms.toLong()); result.success(null) }
      "setVolume" -> { val vol = (call.arguments as Number).toFloat(); player?.setVolume(vol); result.success(null) }
      "dispose" -> { player?.dispose(); result.success(null) }
      else -> result.notImplemented()
    }
  }

  override fun onDetachedFromEngine(@NonNull binding: FlutterPlugin.FlutterPluginBinding) {
    player?.dispose()
    methodChannel.setMethodCallHandler(null)
  }
}

// ExoPlayer wrapper with event/state wiring.
class ExoBackend(
  private val context: Context
) {
  // PlayerStatus enum indices must match Dart: idle(0), initializing(1), ready(2), playing(3), paused(4), buffering(5), ended(6), error(7)

  private var player: com.google.android.exoplayer2.ExoPlayer? = null
  private var positionTimer: java.util.concurrent.ScheduledExecutorService? = null
  private var positionFuture: java.util.concurrent.ScheduledFuture<*>? = null

  val stateStreamHandler = object : EventChannel.StreamHandler {
    private var sink: EventChannel.EventSink? = null
    override fun onListen(arguments: Any?, events: EventChannel.EventSink?) { sink = events }
    override fun onCancel(arguments: Any?) { sink = null }
    fun emit(map: Map<String, Any?>) { sink?.success(map) }
  }

  val positionStreamHandler = object : EventChannel.StreamHandler {
    private var sink: EventChannel.EventSink? = null
    override fun onListen(arguments: Any?, events: EventChannel.EventSink?) { sink = events }
    override fun onCancel(arguments: Any?) { sink = null }
    fun emit(ms: Long) { sink?.success(ms.toInt()) }
  }

  fun initialize(args: Any?) {
    release()
    stateStreamHandler.emit(mapOf(
      "status" to 1, // initializing
      "isLive" to false,
      "positionMs" to 0,
      "durationMs" to null,
      "volume" to 1.0
    ))

    val map = (args as? Map<*, *>) ?: emptyMap<String, Any?>()
    val url = (map["url"] as? String) ?: (map["variants"] as? List<*>)?.mapNotNull { (it as? Map<*, *>)?.get("url") as? String }?.firstOrNull()
    val headers = (map["headers"] as? Map<*, *>)?.map { it.key.toString() to it.value.toString() }?.toMap() ?: emptyMap()

    val httpFactory = com.google.android.exoplayer2.upstream.DefaultHttpDataSource.Factory().apply {
      if (headers.isNotEmpty()) setDefaultRequestProperties(headers)
    }

    val dataSourceFactory = com.google.android.exoplayer2.upstream.DefaultDataSource.Factory(context, httpFactory)
    val mediaSourceFactory = com.google.android.exoplayer2.source.DefaultMediaSourceFactory(dataSourceFactory)

    val abr = com.google.android.exoplayer2.trackselection.DefaultTrackSelector.ParametersBuilder(context)
      .setExceedRendererCapabilitiesIfNecessary(true)
      .build()
    val trackSelector = com.google.android.exoplayer2.trackselection.DefaultTrackSelector(context)
    trackSelector.parameters = abr

    val exo = com.google.android.exoplayer2.ExoPlayer.Builder(context)
      .setTrackSelector(trackSelector)
      .setMediaSourceFactory(mediaSourceFactory)
      .build()
    player = exo
    if (url != null) {
      val mediaItem = com.google.android.exoplayer2.MediaItem.Builder()
        .setUri(url)
        .setLiveConfiguration(
          com.google.android.exoplayer2.MediaItem.LiveConfiguration.Builder()
            .setMaxPlaybackSpeed(1.0f)
            .build()
        )
        .build()
      exo.setMediaItem(mediaItem)
    }

    exo.addListener(object : com.google.android.exoplayer2.Player.Listener {
      override fun onPlaybackStateChanged(state: Int) {
        when (state) {
          com.google.android.exoplayer2.Player.STATE_BUFFERING -> emitState(5)
          com.google.android.exoplayer2.Player.STATE_READY -> emitState(if (exo.isPlaying) 3 else 2)
          com.google.android.exoplayer2.Player.STATE_ENDED -> emitState(6)
          else -> {}
        }
      }

      override fun onIsPlayingChanged(isPlaying: Boolean) { emitState(if (isPlaying) 3 else 4) }

      override fun onPlayerError(error: com.google.android.exoplayer2.PlaybackException) {
        stateStreamHandler.emit(mapOf(
          "status" to 7, // error
          "isLive" to false,
          "positionMs" to exo.currentPosition.toInt(),
          "durationMs" to if (exo.duration > 0) exo.duration.toInt() else null,
          "volume" to exo.volume,
          "errorDomain" to "backend.exoplayer",
          "errorCode" to error.errorCodeName,
          "errorMessage" to error.message
        ))
      }
    })

    exo.prepare()
    startPositionTimer()
    setupMediaSession(exo)
  }

  private fun emitState(status: Int) {
    val exo = player ?: return
    stateStreamHandler.emit(mapOf(
      "status" to status,
      "isLive" to false,
      "positionMs" to exo.currentPosition.toInt(),
      "durationMs" to if (exo.duration > 0) exo.duration.toInt() else null,
      "volume" to exo.volume
    ))
  }

  private fun startPositionTimer() {
    stopPositionTimer()
    positionTimer = java.util.concurrent.Executors.newSingleThreadScheduledExecutor()
    positionFuture = positionTimer?.scheduleAtFixedRate({
      val pos = player?.currentPosition ?: 0L
      positionStreamHandler.emit(pos)
    }, 0, 250, java.util.concurrent.TimeUnit.MILLISECONDS)
  }

  private fun stopPositionTimer() {
    positionFuture?.cancel(true)
    positionFuture = null
    positionTimer?.shutdownNow()
    positionTimer = null
  }

  fun play() { player?.playWhenReady = true; player?.play() }
  fun pause() { player?.pause() }
  fun stop() { player?.stop(); emitState(2) }
  fun seek(ms: Long) { player?.seekTo(ms) }
  fun setVolume(vol: Float) { player?.volume = vol }

  fun dispose() { release() }

  private fun release() {
    mediaSession?.release()
    stopPositionTimer()
    player?.release()
    player = null
  }

  // MediaSession for background/lockscreen controls
  private var mediaSession: androidx.media3.session.MediaSession? = null
  private fun setupMediaSession(exo: com.google.android.exoplayer2.ExoPlayer) {
    try {
      val session = androidx.media3.session.MediaSession.Builder(context, exo).build()
      mediaSession = session
    } catch (_: Throwable) {}
  }
}
