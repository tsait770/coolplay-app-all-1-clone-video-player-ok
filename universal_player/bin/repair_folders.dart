import 'package:universal_player/src/import/repository.dart';

// One-off repair utility: normalize folder names and recompute counts.
Future<void> main(List<String> args) async {
  final repo = InMemoryBookmarkRepository();
  await repo.normalizeFolderNamesUtf8();
  await repo.ensureCountsConsistent();
  // In a real app, wire to your DB repository and print a report.
  // Here we just exit successfully.
}
