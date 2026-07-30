# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# workflow
See [workflow/taste.md](workflow/taste.md)
# architecture
See [architecture/taste.md](architecture/taste.md)
# data-consistency
- When updating sections in generation JSON files (e.g., bestWorstEngines, coreVariants, engineEvolution), match the structure and field naming of existing sibling generation files for consistency across the project. Confidence: 0.65
- Consolidate multi-item arrays like petrolVariants, dieselVariants into a single string using ` · ` (space-middle-dot-space) separators instead of individual array elements. Confidence: 0.70
