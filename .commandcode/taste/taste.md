# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# workflow
- Keep registry pages.json files in sync with corresponding data directories — each JSON file in src/data/*/ becomes an entry (slug + dataFile = filename without extension, plus type field when applicable). Confidence: 0.70
- Include a \"type\" field in all registry entries indicating the data category: \"models\", \"generations\", \"variants\", or \"engines\". Confidence: 0.70

# architecture
- Route structure for BMW engines site: use /engine/[slug] for engines, and a catch-all [...slug]/page.js for models (1-segment), generations (2-segments), and variants (2-segments). Confidence: 0.70
