import 'dart:async';
import 'dart:io';

import 'package:ffmpeg_kit_flutter_full_gpl/ffmpeg_kit.dart';
import 'package:ffmpeg_kit_flutter_full_gpl/return_code.dart';
import 'package:path/path.dart' as p;

import '../models/player_state.dart';
import '../models/source.dart';
import 'player_backend.dart';

/// A simple fallback that remuxes/transcodes unsupported sources into MP4 (H.264/AAC)
/// and then delegates playback to a provided inner backend.
class FfmpegFallbackBackend implements PlayerBackend {
  FfmpegFallbackBackend({required PlayerBackend inner}) : _inner = inner;

  final PlayerBackend _inner;
  final StreamController<PlayerState> _stateController = StreamController.broadcast();
  final StreamController<Duration> _positionController = StreamController.broadcast();

  StreamSubscription<PlayerState>? _innerStateSub;
  StreamSubscription<Duration>? _innerPosSub;

  @override
  Stream<PlayerState> get onStateChanged => _stateController.stream;

  @override
  Stream<Duration> get onPositionChanged => _positionController.stream;

  File? _tempFile;

  @override
  Future<void> initialize(MediaSource source) async {
    final bool needsTranscode = _needsTranscode(source.mimeType, source.url?.path);
    if (!needsTranscode) {
      await _inner.initialize(source);
      _pipeInnerStreams();
      return;
    }

    _stateController.add(PlayerState.initial.copyWith(status: PlayerStatus.buffering));

    final File outFile = await _transcodeToPlayable(source);
    _tempFile = outFile;
    final MediaSource remuxed = MediaSource(
      id: '${source.id}#ffmpeg',
      title: source.title,
      isLive: false,
      url: outFile.uri,
      mimeType: 'video/mp4',
      duration: source.duration,
    );
    await _inner.initialize(remuxed);
    _pipeInnerStreams();
  }

  bool _needsTranscode(String? mime, String? path) {
    if (mime == null && path == null) return true;
    final lower = (mime ?? path ?? '').toLowerCase();
    // Commonly supported by native players
    const ok = ['video/mp4', '.mp4', '.m4v', 'application/vnd.apple.mpegurl', '.m3u8', 'video/quicktime', '.mov'];
    return !ok.any((k) => lower.contains(k));
  }

  Future<File> _transcodeToPlayable(MediaSource source) async {
    final Directory tmp = await Directory.systemTemp.createTemp('universal_player_');
    final String outPath = p.join(tmp.path, 'output.mp4');
    final String input = (source.url ?? Uri()).toString();
    // Try remux first, then fallback to transcode
    final String cmdRemux = "-y -i '$input' -c:v copy -c:a aac -b:a 128k '$outPath'";
    var session = await FFmpegKit.execute(cmdRemux);
    if (ReturnCode.isSuccess(await session.getReturnCode())) {
      return File(outPath);
    }
    final String cmdTranscode = "-y -i '$input' -vf format=yuv420p -c:v libx264 -preset veryfast -crf 23 -c:a aac -b:a 128k '$outPath'";
    session = await FFmpegKit.execute(cmdTranscode);
    if (!ReturnCode.isSuccess(await session.getReturnCode())) {
      final logs = await session.getAllLogs();
      _stateController.add(PlayerState.initial.copyWith(status: PlayerStatus.error));
      throw Exception('FFmpeg failed: ${logs.map((e) => e.getMessage()).join('\n')}');
    }
    return File(outPath);
  }

  void _pipeInnerStreams() {
    _innerStateSub?.cancel();
    _innerPosSub?.cancel();
    _innerStateSub = _inner.onStateChanged.listen(_stateController.add);
    _innerPosSub = _inner.onPositionChanged.listen(_positionController.add);
  }

  @override
  Future<void> pause() => _inner.pause();

  @override
  Future<void> play() => _inner.play();

  @override
  Future<void> seek(Duration position) => _inner.seek(position);

  @override
  Future<void> setVolume(double volume) => _inner.setVolume(volume);

  @override
  Future<void> stop() => _inner.stop();

  @override
  Future<void> dispose() async {
    await _innerStateSub?.cancel();
    await _innerPosSub?.cancel();
    await _inner.dispose();
    await _stateController.close();
    await _positionController.close();
    try {
      if (_tempFile != null && await _tempFile!.exists()) {
        await _tempFile!.delete();
      }
    } catch (_) {}
  }
}
